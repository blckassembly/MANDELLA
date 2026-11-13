// Package esim implements GSMA SGP.22 eUICC identity binding and hardware attestation.
// File: services/id-federation/pkg/esim/smdp_identity_binder.go
package esim

import (
	"context"
	"crypto/ed25519"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"time"
)

// Hard SLA ceiling from MOD-16-01-IDENTITY-AGGREGATOR shadow spec.
const EsimEidAttestationP99Timeout = 400 * time.Millisecond

var (
	eidRegex               = regexp.MustCompile(`^[0-9]{32}$`) // GSMA SGP.22 32-digit EID standard
	iccidRegex             = regexp.MustCompile(`^[0-9]{18,22}$`)
	ErrInvalidEIDFormat    = errors.New("esim_binder: EID must be a valid 32-digit GSMA SGP.22 eUICC identifier")
	ErrInvalidICCIDFormat  = errors.New("esim_binder: ICCID must be an 18-to-22 digit profile identifier")
	ErrEIDProfileNotActive = errors.New("esim_binder: SM-DP+ reports profile is not in ENABLED state on target EID")
	ErrBindingTimedOut     = errors.New("esim_binder: attestation exceeded 400ms SLA budget")
)

// ESIMBindingRequest binds a verified sovereign identity to an eUICC chip.
type ESIMBindingRequest struct {
	SessionID             string `json:"session_id"`
	EID                   string `json:"eid"`   // 32-digit eUICC Identifier
	ICCID                 string `json:"iccid"` // Profile ICCID
	CountryISO            string `json:"country_iso"`
	ZeroKnowledgeProofHex string `json:"zk_proof_hex"`
	DeviceIMEI            string `json:"device_imei"`
}

// HardwareAttestedToken is embedded into the Mandela Business "Verified" Badge.
type HardwareAttestedToken struct {
	BindingID            string    `json:"binding_id"`
	SessionID            string    `json:"session_id"`
	MaskedEID            string    `json:"masked_eid"`
	ICCIDHashHex         string    `json:"iccid_hash_hex"`
	IMEIChassisLocked    bool      `json:"imei_chassis_locked"`
	SGP22ProfileState    string    `json:"sgp22_profile_state"` // "ENABLED"
	IssuedAt             time.Time `json:"issued_at"`
	ExpiresAt            time.Time `json:"expires_at"`
	Ed25519JWSCompactSig string    `json:"ed25519_jws_compact_sig"`
	AttestationLatencyMs int64     `json:"attestation_latency_ms"`
}

// SMDPPlusES2Client abstracts the mutual-TLS GSMA SGP.22 ES2+ interface to the carrier SM-DP+ server.
type SMDPPlusES2Client interface {
	ConfirmProfileBoundToEID(ctx context.Context, eid, iccid, imei string) (profileState string, err error)
}

// SMDPIdentityBinder signs hardware-attested eSIM profile metadata within 400ms.
type SMDPIdentityBinder struct {
	es2Client  SMDPPlusES2Client
	signingKey ed25519.PrivateKey
	keyID      string
}

// NewSMDPIdentityBinder constructs an SM-DP+ identity binder instance.
func NewSMDPIdentityBinder(es2Client SMDPPlusES2Client, privKey ed25519.PrivateKey, keyID string) *SMDPIdentityBinder {
	return &SMDPIdentityBinder{
		es2Client:  es2Client,
		signingKey: privKey,
		keyID:      keyID,
	}
}

// MaskEID masks middle 20 digits of a 32-digit EID for privacy-preserving audit logs.
func MaskEID(eid string) string {
	if len(eid) < 12 {
		return eid
	}
	return fmt.Sprintf("%s%s%s", eid[:6], "********************", eid[len(eid)-6:])
}

// HashICCID returns the SHA-256 hex digest of an ICCID to prevent profile snooping.
func HashICCID(iccid string) string {
	h := sha256.Sum256([]byte(iccid))
	return hex.EncodeToString(h[:])
}

// BindIdentityToEUICC validates the EID/ICCID state via ES2+ and issues an Ed25519 hardware-attested token.
func (b *SMDPIdentityBinder) BindIdentityToEUICC(ctx context.Context, req *ESIMBindingRequest) (*HardwareAttestedToken, error) {
	start := time.Now()

	// 1. Format validation
	if !eidRegex.MatchString(req.EID) {
		return nil, ErrInvalidEIDFormat
	}
	if !iccidRegex.MatchString(req.ICCID) {
		return nil, ErrInvalidICCIDFormat
	}

	// 2. Query SM-DP+ ES2+ interface with context timeout
	timeoutCtx, cancel := context.WithTimeout(ctx, EsimEidAttestationP99Timeout)
	defer cancel()

	profileState, err := b.es2Client.ConfirmProfileBoundToEID(timeoutCtx, req.EID, req.ICCID, req.DeviceIMEI)
	if err != nil {
		return nil, fmt.Errorf("esim_binder: ES2+ communication failed: %w", err)
	}
	if profileState != "ENABLED" {
		return nil, ErrEIDProfileNotActive
	}

	// 3. Construct HardwareAttestedToken claims
	now := time.Now().UTC()
	bindingID := fmt.Sprintf("bind_%x", sha256.Sum256([]byte(req.SessionID+req.EID+now.String())))[:24]
	expiresAt := now.Add(24 * time.Hour) // Token validity window: 24h

	jwsHeader := map[string]interface{}{
		"alg": "EdDSA",
		"crv": "Ed25519",
		"typ": "JWT",
		"kid": b.keyID,
	}
	headerJSON, err := json.Marshal(jwsHeader)
	if err != nil {
		return nil, fmt.Errorf("esim_binder: marshal header: %w", err)
	}

	claimsPayload := map[string]interface{}{
		"iss":                 "mandela-smdp-plus-attestation-authority",
		"sub":                 req.SessionID,
		"binding_id":          bindingID,
		"masked_eid":          MaskEID(req.EID),
		"iccid_hash_hex":      HashICCID(req.ICCID),
		"imei_chassis_locked": req.DeviceIMEI != "",
		"device_imei":         req.DeviceIMEI,
		"country_iso":         req.CountryISO,
		"sgp22_profile_state": "ENABLED",
		"iat":                 now.Unix(),
		"exp":                 expiresAt.Unix(),
	}
	payloadJSON, err := json.Marshal(claimsPayload)
	if err != nil {
		return nil, fmt.Errorf("esim_binder: marshal payload: %w", err)
	}

	// 4. Create RFC 7515 Compact JWS
	b64Header := base64.RawURLEncoding.EncodeToString(headerJSON)
	b64Payload := base64.RawURLEncoding.EncodeToString(payloadJSON)
	signingInput := b64Header + "." + b64Payload

	sig := ed25519.Sign(b.signingKey, []byte(signingInput))
	b64Sig := base64.RawURLEncoding.EncodeToString(sig)
	compactJWS := signingInput + "." + b64Sig

	elapsed := time.Since(start).Milliseconds()

	return &HardwareAttestedToken{
		BindingID:            bindingID,
		SessionID:            req.SessionID,
		MaskedEID:            MaskEID(req.EID),
		ICCIDHashHex:         HashICCID(req.ICCID),
		IMEIChassisLocked:    req.DeviceIMEI != "",
		SGP22ProfileState:    "ENABLED",
		IssuedAt:             now,
		ExpiresAt:            expiresAt,
		Ed25519JWSCompactSig: compactJWS,
		AttestationLatencyMs: elapsed,
	}, nil
}
