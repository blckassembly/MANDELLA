// Package esim unit tests for attestation middleware and Ed25519 signature verification.
// File: services/id-federation/pkg/esim/attestation_middleware_test.go
package esim

import (
	"context"
	"crypto/ed25519"
	"crypto/rand"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

type mockES2Client struct {
	expectedState string
	err           error
}

func (m *mockES2Client) ConfirmProfileBoundToEID(ctx context.Context, eid, iccid, imei string) (string, error) {
	return m.expectedState, m.err
}

func TestAttestationMiddleware_FullCycle(t *testing.T) {
	// 1. Generate Ed25519 keypair
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		t.Fatalf("GenerateKey failed: %v", err)
	}
	keyID := "smdp_root_ke_2026_01"

	// 2. Setup SM-DP+ Identity Binder
	es2Mock := &mockES2Client{expectedState: "ENABLED"}
	binder := NewSMDPIdentityBinder(es2Mock, privKey, keyID)

	// 3. Issue genuine token
	req := &ESIMBindingRequest{
		SessionID:             "sess_ke_saf_994821",
		EID:                   "89049032000001000000000012345678",
		ICCID:                 "8925402100000192837",
		CountryISO:            "KE",
		ZeroKnowledgeProofHex: "3f7a8b9c",
		DeviceIMEI:            "863920048192830",
	}

	token, err := binder.BindIdentityToEUICC(context.Background(), req)
	if err != nil {
		t.Fatalf("BindIdentityToEUICC failed: %v", err)
	}

	// 4. Setup Verifier
	revocation := NewInMemoryRevocationRegistry()
	verifier := NewAttestationVerifier(revocation)
	verifier.RegisterPublicKey(keyID, pubKey)

	// 5. Test downstream handler execution
	handlerInvoked := false
	protectedHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		idCtx, ok := GetEUICCContext(r.Context())
		if !ok || idCtx == nil {
			t.Errorf("Expected EUICCContext in request, got none")
			return
		}
		if idCtx.BindingID != token.BindingID {
			t.Errorf("Expected BindingID %s, got %s", token.BindingID, idCtx.BindingID)
		}
		if !idCtx.IsGenuineEUICC {
			t.Errorf("Expected IsGenuineEUICC to be true")
		}
		handlerInvoked = true
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"SUCCESS_ACCESS_GRANTED"}`))
	})

	middleware := verifier.AttestationMiddleware(protectedHandler)

	// Scenario A: Legitimate request with valid Ed25519 token
	reqHttp := httptest.NewRequest("POST", "/v1/numbers/purchase", nil)
	reqHttp.Header.Set(HeaderAttestationToken, token.Ed25519JWSCompactSig)
	reqHttp.Header.Set(HeaderDeviceIMEI, "863920048192830")
	rec := httptest.NewRecorder()

	middleware.ServeHTTP(rec, reqHttp)

	if rec.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d: %s", rec.Code, rec.Body.String())
	}
	if !handlerInvoked {
		t.Fatalf("Protected handler was not invoked")
	}

	// Scenario B: Tampered token (Signature verification fail)
	tamperedSig := token.Ed25519JWSCompactSig[:len(token.Ed25519JWSCompactSig)-4] + "AAAA"
	reqHttpTampered := httptest.NewRequest("POST", "/v1/numbers/purchase", nil)
	reqHttpTampered.Header.Set(HeaderAttestationToken, tamperedSig)
	recTampered := httptest.NewRecorder()

	middleware.ServeHTTP(recTampered, reqHttpTampered)
	if recTampered.Code != http.StatusForbidden {
		t.Fatalf("Expected 403 Forbidden for tampered signature, got %d", recTampered.Code)
	}

	// Scenario C: Revoked EID / Binding
	revocation.RevokeBinding(token.BindingID, "SIM-swap fraudulent porting detected by SOC-C2")
	recRevoked := httptest.NewRecorder()
	middleware.ServeHTTP(recRevoked, reqHttp)
	if recRevoked.Code != http.StatusForbidden {
		t.Fatalf("Expected 403 Forbidden for revoked binding, got %d", recRevoked.Code)
	}
}
