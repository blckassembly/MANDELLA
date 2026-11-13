// Package esim provides GSMA SGP.22 eUICC attestation verification middleware.
// File: services/id-federation/pkg/esim/attestation_middleware.go
package esim

import (
	"context"
	"crypto/ed25519"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"
)

// Standard Context Key for downstream handler context injection.
type contextKey string

const (
	EUICCContextKey contextKey = "mandela_euicc_identity_context"
	
	// Headers
	HeaderAttestationToken = "X-Mandela-eUICC-Attestation"
	HeaderDeviceIMEI       = "X-Device-IMEI"
	HeaderAuthorization    = "Authorization"

	// Hard SLA for in-line signature verification
	MaxVerificationBudgetUs = 2000 // 2.0ms SLA budget
)

var (
	ErrMissingAttestationToken = errors.New("attestation_middleware: missing eUICC attestation token in request headers")
	ErrMalformedJWS            = errors.New("attestation_middleware: invalid compact JWS format (expected 3 dot-delimited segments)")
	ErrUnsupportedAlgorithm   = errors.New("attestation_middleware: unsupported algorithm (must be EdDSA with Ed25519)")
	ErrKeyNotFound             = errors.New("attestation_middleware: public key not found for specified key ID")
	ErrSignatureInvalid        = errors.New("attestation_middleware: cryptographic Ed25519 signature verification failed")
	ErrTokenExpired            = errors.New("attestation_middleware: eUICC hardware attested token has expired")
	ErrTokenIssuedInFuture     = errors.New("attestation_middleware: token iat claim is in the future")
	ErrProfileNotEnabled       = errors.New("attestation_middleware: SGP.22 eUICC profile state is not ENABLED")
	ErrBindingRevoked          = errors.New("attestation_middleware: eUICC binding or EID has been revoked / quarantined by SOC")
	ErrIMEIChassisMismatch     = errors.New("attestation_middleware: hardware IMEI does not match token chassis lock binding")
)

// EUICCIdentityContext is injected into the request context after successful verification.
type EUICCIdentityContext struct {
	BindingID            string    `json:"binding_id"`
	SessionID            string    `json:"session_id"`
	MaskedEID            string    `json:"masked_eid"`
	ICCIDHashHex         string    `json:"iccid_hash_hex"`
	DeviceIMEI           string    `json:"device_imei"`
	IMEIChassisLocked    bool      `json:"imei_chassis_locked"`
	CountryISO            string    `json:"country_iso"`
	SGP22ProfileState    string    `json:"sgp22_profile_state"`
	KeyID                string    `json:"key_id"`
	IssuedAt             time.Time `json:"issued_at"`
	ExpiresAt            time.Time `json:"expires_at"`
	VerifiedAt           time.Time `json:"verified_at"`
	VerificationLatencyUs int64    `json:"verification_latency_us"`
	IsGenuineEUICC       bool      `json:"is_genuine_euicc"`
}

// JWSHeader matches RFC 7515 representation for EdDSA
type JWSHeader struct {
	Alg string `json:"alg"` // "EdDSA"
	Crv string `json:"crv"` // "Ed25519"
	Typ string `json:"typ"` // "JWT"
	Kid string `json:"kid"` // Key ID
}

// HardwareAttestedClaims represents the decoded payload
type HardwareAttestedClaims struct {
	Iss               string `json:"iss"`
	Sub               string `json:"sub"`
	BindingID         string `json:"binding_id"`
	MaskedEID         string `json:"masked_eid"`
	ICCIDHashHex      string `json:"iccid_hash_hex"`
	IMEIChassisLocked bool   `json:"imei_chassis_locked"`
	DeviceIMEI        string `json:"device_imei"`
	CountryISO        string `json:"country_iso"`
	SGP22ProfileState string `json:"sgp22_profile_state"`
	Iat               int64  `json:"iat"`
	Exp               int64  `json:"exp"`
}

// ProblemDetails represents RFC 7807 structured HTTP error responses
type ProblemDetails struct {
	Type     string `json:"type"`
	Title    string `json:"title"`
	Status   int    `json:"status"`
	Detail   string `json:"detail"`
	Code     string `json:"code"`
	TraceID  string `json:"trace_id,omitempty"`
}

// RevocationChecker interface for real-time quarantine and blacklist validation
type RevocationChecker interface {
	IsBindingRevoked(ctx context.Context, bindingID string) (bool, error)
	IsEIDRevoked(ctx context.Context, maskedEID string) (bool, error)
}

// InMemoryRevocationRegistry provides a thread-safe default implementation
type InMemoryRevocationRegistry struct {
	mu           sync.RWMutex
	revokedBindings map[string]string // bindingID -> reason
	revokedEIDs      map[string]string // maskedEID -> reason
}

func NewInMemoryRevocationRegistry() *InMemoryRevocationRegistry {
	return &InMemoryRevocationRegistry{
		revokedBindings: make(map[string]string),
		revokedEIDs:      make(map[string]string),
	}
}

func (r *InMemoryRevocationRegistry) RevokeBinding(bindingID, reason string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.revokedBindings[bindingID] = reason
}

func (r *InMemoryRevocationRegistry) RevokeEID(maskedEID, reason string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.revokedEIDs[maskedEID] = reason
}

func (r *InMemoryRevocationRegistry) IsBindingRevoked(ctx context.Context, bindingID string) (bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	_, exists := r.revokedBindings[bindingID]
	return exists, nil
}

func (r *InMemoryRevocationRegistry) IsEIDRevoked(ctx context.Context, maskedEID string) (bool, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	_, exists := r.revokedEIDs[maskedEID]
	return exists, nil
}

// AttestationVerifier manages trusted Ed25519 public keys and verifies JWS compact signatures
type AttestationVerifier struct {
	mu                 sync.RWMutex
	trustedPublicKeys  map[string]ed25519.PublicKey // kid -> public key
	revocationChecker  RevocationChecker
	clockSkewTolerance time.Duration
}

// NewAttestationVerifier constructs a thread-safe token verifier
func NewAttestationVerifier(revocation RevocationChecker) *AttestationVerifier {
	if revocation == nil {
		revocation = NewInMemoryRevocationRegistry()
	}
	return &AttestationVerifier{
		trustedPublicKeys:  make(map[string]ed25519.PublicKey),
		revocationChecker:  revocation,
		clockSkewTolerance: 30 * time.Second,
	}
}

// RegisterPublicKey registers a trusted carrier SM-DP+ or CIAM Ed25519 public key
func (v *AttestationVerifier) RegisterPublicKey(kid string, pubKey ed25519.PublicKey) {
	v.mu.Lock()
	defer v.mu.Unlock()
	v.trustedPublicKeys[kid] = pubKey
}

// VerifyJWSCompact verifies the Ed25519 signature and returns the verified claims
func (v *AttestationVerifier) VerifyJWSCompact(ctx context.Context, tokenString string, expectedIMEI string) (*EUICCIdentityContext, error) {
	startTime := time.Now()

	// 1. Split RFC 7515 compact serialization: header.payload.signature
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, ErrMalformedJWS
	}

	b64Header, b64Payload, b64Signature := parts[0], parts[1], parts[2]

	// 2. Decode and parse Header
	headerBytes, err := base64.RawURLEncoding.DecodeString(b64Header)
	if err != nil {
		return nil, fmt.Errorf("%w: decode header: %v", ErrMalformedJWS, err)
	}

	var header JWSHeader
	if err := json.Unmarshal(headerBytes, &header); err != nil {
		return nil, fmt.Errorf("%w: unmarshal header: %v", ErrMalformedJWS, err)
	}

	// Algorithm constraint
	if header.Alg != "EdDSA" {
		return nil, ErrUnsupportedAlgorithm
	}

	// 3. Retrieve trusted public key
	v.mu.RLock()
	pubKey, ok := v.trustedPublicKeys[header.Kid]
	v.mu.RUnlock()

	if !ok {
		return nil, fmt.Errorf("%w: kid='%s'", ErrKeyNotFound, header.Kid)
	}

	// 4. Verify Cryptographic Ed25519 Signature
	sigBytes, err := base64.RawURLEncoding.DecodeString(b64Signature)
	if err != nil {
		return nil, fmt.Errorf("%w: decode signature: %v", ErrMalformedJWS, err)
	}

	signingInput := []byte(b64Header + "." + b64Payload)
	if !ed25519.Verify(pubKey, signingInput, sigBytes) {
		return nil, ErrSignatureInvalid
	}

	// 5. Decode and validate Claims
	payloadBytes, err := base64.RawURLEncoding.DecodeString(b64Payload)
	if err != nil {
		return nil, fmt.Errorf("%w: decode payload: %v", ErrMalformedJWS, err)
	}

	var claims HardwareAttestedClaims
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, fmt.Errorf("%w: unmarshal payload: %v", ErrMalformedJWS, err)
	}

	now := time.Now().UTC()

	// 6. Check Token Expiration & Clock Skew
	if claims.Exp > 0 && now.Unix() > (claims.Exp+int64(v.clockSkewTolerance.Seconds())) {
		return nil, ErrTokenExpired
	}
	if claims.Iat > 0 && claims.Iat > (now.Unix()+int64(v.clockSkewTolerance.Seconds())) {
		return nil, ErrTokenIssuedInFuture
	}

	// 7. Check GSMA SGP.22 Profile State (Strictly ENABLED)
	if claims.SGP22ProfileState != "ENABLED" {
		return nil, ErrProfileNotEnabled
	}

	// 8. Cross-check Revocation & Quarantine Blacklists
	if v.revocationChecker != nil {
		isRevoked, err := v.revocationChecker.IsBindingRevoked(ctx, claims.BindingID)
		if err == nil && isRevoked {
			return nil, ErrBindingRevoked
		}
		isEidRevoked, err := v.revocationChecker.IsEIDRevoked(ctx, claims.MaskedEID)
		if err == nil && isEidRevoked {
			return nil, ErrBindingRevoked
		}
	}

	// 9. Hardware Chassis Lock Enforcement
	if claims.IMEIChassisLocked && claims.DeviceIMEI != "" {
		if expectedIMEI != "" && expectedIMEI != claims.DeviceIMEI {
			return nil, ErrIMEIChassisMismatch
		}
	}

	verificationLatencyUs := time.Since(startTime).Microseconds()

	return &EUICCIdentityContext{
		BindingID:            claims.BindingID,
		SessionID:            claims.Sub,
		MaskedEID:            claims.MaskedEID,
		ICCIDHashHex:         claims.ICCIDHashHex,
		DeviceIMEI:           claims.DeviceIMEI,
		IMEIChassisLocked:    claims.IMEIChassisLocked,
		CountryISO:            claims.CountryISO,
		SGP22ProfileState:    claims.SGP22ProfileState,
		KeyID:                header.Kid,
		IssuedAt:             time.Unix(claims.Iat, 0).UTC(),
		ExpiresAt:            time.Unix(claims.Exp, 0).UTC(),
		VerifiedAt:           now,
		VerificationLatencyUs: verificationLatencyUs,
		IsGenuineEUICC:       true,
	}, nil
}

// AttestationMiddleware returns a standard net/http middleware enforcing eUICC hardware attestation
func (v *AttestationVerifier) AttestationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Extract token from header: X-Mandela-eUICC-Attestation, or Authorization: Bearer <token>
		tokenString := r.Header.Get(HeaderAttestationToken)
		if tokenString == "" {
			authHeader := r.Header.Get(HeaderAuthorization)
			if strings.HasPrefix(strings.ToLower(authHeader), "bearer ") {
				candidate := strings.TrimSpace(authHeader[7:])
				// If it's a compact JWS (contains two periods)
				if strings.Count(candidate, ".") == 2 {
					tokenString = candidate
				}
			}
		}

		if tokenString == "" {
			writeProblemJSON(w, http.StatusUnauthorized, "ERR_EUICC_TOKEN_MISSING",
				"Missing eUICC Hardware Attestation Token. Protected telecom operations require genuine SM-DP+ signed badge.",
				ErrMissingAttestationToken.Error())
			return
		}

		// 2. Extract Device IMEI if present
		requestIMEI := r.Header.Get(HeaderDeviceIMEI)

		// 3. Verify Ed25519 Signature & Claims
		idCtx, err := v.VerifyJWSCompact(r.Context(), tokenString, requestIMEI)
		if err != nil {
			status := http.StatusForbidden
			code := "ERR_EUICC_VERIFICATION_FAILED"

			switch {
			case errors.Is(err, ErrTokenExpired):
				status = http.StatusUnauthorized
				code = "ERR_EUICC_TOKEN_EXPIRED"
			case errors.Is(err, ErrSignatureInvalid):
				code = "ERR_EUICC_SIGNATURE_INVALID"
			case errors.Is(err, ErrProfileNotEnabled):
				code = "ERR_EUICC_PROFILE_NOT_ENABLED"
			case errors.Is(err, ErrBindingRevoked):
				code = "ERR_EUICC_BINDING_REVOKED"
			case errors.Is(err, ErrIMEIChassisMismatch):
				code = "ERR_EUICC_HARDWARE_MISMATCH"
			case errors.Is(err, ErrKeyNotFound):
				code = "ERR_EUICC_UNKNOWN_KEY_ID"
			}

			writeProblemJSON(w, status, code,
				"eUICC Attestation Verification Failed",
				err.Error())
			return
		}

		// 4. Inject Verified Context into Request
		ctx := context.WithValue(r.Context(), EUICCContextKey, idCtx)

		// 5. Add Telemetry Response Headers
		w.Header().Set("X-eUICC-Verified", "true")
		w.Header().Set("X-eUICC-Binding-ID", idCtx.BindingID)
		w.Header().Set("X-eUICC-Verification-Us", fmt.Sprintf("%d", idCtx.VerificationLatencyUs))

		// 6. Forward to downstream telecom API handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetEUICCContext extracts the verified identity context from request context
func GetEUICCContext(ctx context.Context) (*EUICCIdentityContext, bool) {
	val := ctx.Value(EUICCContextKey)
	if val == nil {
		return nil, false
	}
	idCtx, ok := val.(*EUICCIdentityContext)
	return idCtx, ok
}

// Helper to render RFC 7807 JSON errors
func writeProblemJSON(w http.ResponseWriter, status int, code, title, detail string) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)
	prob := ProblemDetails{
		Type:   fmt.Sprintf("https://specs.mandela.africa/errors/%s", strings.ToLower(code)),
		Title:  title,
		Status: status,
		Detail: detail,
		Code:   code,
	}
	_ = json.NewEncoder(w).Encode(prob)
}
