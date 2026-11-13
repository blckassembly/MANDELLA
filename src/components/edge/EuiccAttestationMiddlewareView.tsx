import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Key,
  Cpu,
  Lock,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Zap,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
  Smartphone,
  Server
} from 'lucide-react';
import {
  verifyHardwareAttestedToken,
  generateMockAttestedToken,
  TRUSTED_SMDP_PUBLIC_KEYS,
  HardwareAttestedToken,
  VerifiedEUICCIdentity
} from '../../services/euiccAttestationService';
import { Badge, Button, Card, CodeBlock, SectionHeader, StatCard } from '../../design-system';

interface ScenarioPreset {
  id: string;
  name: string;
  category: 'genuine' | 'attack' | 'expired' | 'quarantine';
  description: string;
  expectedStatus: number;
  expectedCode: string;
  tokenParams: {
    sessionId: string;
    eid: string;
    iccid: string;
    countryIso: string;
    deviceImei: string;
    keyId: string;
    profileState: 'ENABLED' | 'DISABLED' | 'DOWNLOADED';
    isExpired?: boolean;
    tamperSig?: boolean;
    quarantineBinding?: boolean;
    mismatchedImei?: string;
  };
}

const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'genuine_safaricom',
    name: 'Genuine eUICC Binding (Safaricom KE)',
    category: 'genuine',
    description: 'Cryptographically valid Ed25519 signature from Safaricom root SM-DP+, ENABLED profile, and matching device IMEI chassis lock.',
    expectedStatus: 200,
    expectedCode: 'ACCESS_GRANTED_GENUINE_EUICC',
    tokenParams: {
      sessionId: 'sess_ke_saf_994821',
      eid: '89049032000001000000000012345678',
      iccid: '8925402100000192837',
      countryIso: 'KE',
      deviceImei: '863920048192830',
      keyId: 'smdp_root_ke_safaricom_2026_01',
      profileState: 'ENABLED'
    }
  },
  {
    id: 'tampered_signature',
    name: 'Tampered Signature Attack (Forged Token)',
    category: 'attack',
    description: 'Attacker altered JWS signature bytes to impersonate a verified eUICC without the SM-DP+ Ed25519 private key.',
    expectedStatus: 403,
    expectedCode: 'ERR_EUICC_SIGNATURE_INVALID',
    tokenParams: {
      sessionId: 'sess_ke_saf_994821',
      eid: '89049032000001000000000012345678',
      iccid: '8925402100000192837',
      countryIso: 'KE',
      deviceImei: '863920048192830',
      keyId: 'smdp_root_ke_safaricom_2026_01',
      profileState: 'ENABLED',
      tamperSig: true
    }
  },
  {
    id: 'expired_token',
    name: 'Expired Hardware Token',
    category: 'expired',
    description: 'Genuine Ed25519 token whose 24-hour expiration window has elapsed without SM-DP+ re-attestation.',
    expectedStatus: 401,
    expectedCode: 'ERR_EUICC_TOKEN_EXPIRED',
    tokenParams: {
      sessionId: 'sess_ng_mtn_771822',
      eid: '89023412000002000000000098765432',
      iccid: '8923401100000994821',
      countryIso: 'NG',
      deviceImei: '864901882019482',
      keyId: 'smdp_root_ng_mtn_2026_01',
      profileState: 'ENABLED',
      isExpired: true
    }
  },
  {
    id: 'profile_disabled',
    name: 'eUICC Profile Not Enabled (SGP.22 Violation)',
    category: 'attack',
    description: 'Profile state reported as DISABLED or DOWNLOADED; subscriber has not completed eUICC local activation.',
    expectedStatus: 403,
    expectedCode: 'ERR_EUICC_PROFILE_NOT_ENABLED',
    tokenParams: {
      sessionId: 'sess_za_vod_554911',
      eid: '89027011000003000000000045612378',
      iccid: '8927003300000554411',
      countryIso: 'ZA',
      deviceImei: '867102948201940',
      keyId: 'smdp_root_za_vodacom_2026_01',
      profileState: 'DISABLED'
    }
  },
  {
    id: 'imei_mismatch',
    name: 'Hardware IMEI Chassis Mismatch',
    category: 'attack',
    description: 'Token was extracted from legitimate eUICC but replayed from an unauthorized hardware chassis/IMEI.',
    expectedStatus: 403,
    expectedCode: 'ERR_EUICC_HARDWARE_MISMATCH',
    tokenParams: {
      sessionId: 'sess_gh_tel_441829',
      eid: '89023301000004000000000033221100',
      iccid: '8923304400000778899',
      countryIso: 'GH',
      deviceImei: '863920048192830',
      keyId: 'smdp_root_gh_telecel_2026_01',
      profileState: 'ENABLED',
      mismatchedImei: '869999999999999' // Rogue device IMEI
    }
  },
  {
    id: 'quarantined_binding',
    name: 'Quarantined eUICC Binding (SOC-C2 Blacklist)',
    category: 'quarantine',
    description: 'Binding ID or EID was quarantined by SOC-C2 automated playbook following suspicious post-swap MFA bursts.',
    expectedStatus: 403,
    expectedCode: 'ERR_EUICC_BINDING_REVOKED',
    tokenParams: {
      sessionId: 'sess_ke_saf_994821',
      eid: '89049032000001000000000012345678',
      iccid: '8925402100000192837',
      countryIso: 'KE',
      deviceImei: '863920048192830',
      keyId: 'smdp_root_ke_safaricom_2026_01',
      profileState: 'ENABLED',
      quarantineBinding: true
    }
  }
];

export const EuiccAttestationMiddlewareView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>(PRESET_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<'simulator' | 'jws_inspector' | 'go_code'>('simulator');
  const [customImeiInput, setCustomImeiInput] = useState<string>('863920048192830');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerifiedEUICCIdentity | null>(null);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [copiedHeader, setCopiedHeader] = useState<boolean>(false);

  // Generate current token based on scenario
  const currentToken: HardwareAttestedToken = useMemo(() => {
    const p = selectedScenario.tokenParams;
    const base = generateMockAttestedToken({
      sessionId: p.sessionId,
      eid: p.eid,
      iccid: p.iccid,
      countryIso: p.countryIso,
      deviceImei: p.deviceImei,
      keyId: p.keyId,
      profileState: p.profileState,
      isExpired: p.isExpired
    });

    if (p.tamperSig) {
      // Modify last 4 chars to tamper signature
      base.ed25519_jws_compact_sig = base.ed25519_jws_compact_sig.slice(0, -4) + 'AAAA';
    }

    if (p.quarantineBinding) {
      base.binding_id = 'bind_863920048192039_mal';
    }

    return base;
  }, [selectedScenario]);

  // Decode JWS parts for inspector
  const jwsParts = useMemo(() => {
    const parts = currentToken.ed25519_jws_compact_sig.split('.');
    if (parts.length !== 3) return { header: '{}', payload: '{}', sig: '' };
    try {
      const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      return {
        header: JSON.stringify(JSON.parse(headerStr), null, 2),
        payload: JSON.stringify(JSON.parse(payloadStr), null, 2),
        sig: parts[2]
      };
    } catch {
      return { header: '{}', payload: '{}', sig: parts[2] || '' };
    }
  }, [currentToken]);

  // Run verification
  const handleRunVerification = () => {
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      const expectedImei = selectedScenario.tokenParams.mismatchedImei || customImeiInput;
      const res = verifyHardwareAttestedToken(currentToken.ed25519_jws_compact_sig, {
        expectedImei
      });
      setVerificationResult(res);
      setIsVerifying(false);
    }, 280);
  };

  // Run on scenario change
  React.useEffect(() => {
    handleRunVerification();
    if (selectedScenario.tokenParams.mismatchedImei) {
      setCustomImeiInput(selectedScenario.tokenParams.mismatchedImei);
    } else {
      setCustomImeiInput(selectedScenario.tokenParams.deviceImei);
    }
  }, [selectedScenario]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-white">eUICC Hardware Attestation Middleware</h2>
                <Badge variant="telco" className="text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                  Ed25519 JWS Compact
                </Badge>
                <Badge variant="warning" className="text-amber-400 border-amber-500/30 text-[10px] font-mono">
                  SLA &lt; 2.0ms
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                In-line verification service inspecting <code className="text-slate-300 font-mono">HardwareAttestedToken</code> signatures before granting access to protected telecom provisioning &amp; number management APIs.
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">SGP.22 Spec</div>
            <div className="text-xs font-bold text-white font-mono">GSMA Rel-18</div>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Crypto Alg</div>
            <div className="text-xs font-bold text-emerald-400 font-mono">EdDSA / Ed25519</div>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <div className="text-[10px] text-slate-500 uppercase font-mono">Verified Latency</div>
            <div className="text-xs font-bold text-sky-400 font-mono">
              {verificationResult ? `${(verificationResult.verificationLatencyUs / 1000).toFixed(2)} ms` : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'simulator'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>In-Line Middleware Simulator</span>
        </button>
        <button
          onClick={() => setActiveTab('jws_inspector')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'jws_inspector'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>JWS Compact Token Inspector</span>
        </button>
        <button
          onClick={() => setActiveTab('go_code')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'go_code'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Production Go Middleware (Source)</span>
        </button>
      </div>

      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Test Scenarios & Ingress Token (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Test Attack &amp; Verification Scenarios
                </span>
                <span className="text-[10px] text-slate-500 font-mono">6 Scenarios</span>
              </div>

              <div className="space-y-2">
                {PRESET_SCENARIOS.map((scenario) => {
                  const isSelected = selectedScenario.id === scenario.id;
                  const isGenuine = scenario.category === 'genuine';
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => setSelectedScenario(scenario)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                        isSelected
                          ? isGenuine
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-white shadow-sm'
                            : 'bg-rose-950/40 border-rose-500/50 text-white shadow-sm'
                          : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-semibold flex items-center gap-1.5">
                          {isGenuine ? (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span className="truncate">{scenario.name}</span>
                        </div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold shrink-0 ${
                            scenario.expectedStatus === 200
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {scenario.expectedStatus} {scenario.expectedStatus === 200 ? 'OK' : 'DENY'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{scenario.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingress Headers Inspector */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  Simulated Ingress Headers
                </span>
                <span className="text-[10px] text-slate-500 font-mono">HTTP/2</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>X-Mandela-eUICC-Attestation</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(currentToken.ed25519_jws_compact_sig);
                        setCopiedToken(true);
                        setTimeout(() => setCopiedToken(false), 2000);
                      }}
                      className="text-slate-500 hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copiedToken ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 break-all max-h-24 overflow-y-auto">
                    {currentToken.ed25519_jws_compact_sig}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400 mb-1">X-Device-IMEI (Caller Chassis)</div>
                  <input
                    type="text"
                    value={customImeiInput}
                    onChange={(e) => setCustomImeiInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="Enter device IMEI..."
                  />
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-2"
                onClick={handleRunVerification}
                disabled={isVerifying}
              >
                <Play className="w-3.5 h-3.5 fill-current mr-1.5" />
                {isVerifying ? 'Verifying Ed25519 Signature...' : 'Trigger In-Line Middleware Inspection'}
              </Button>
            </div>
          </div>

          {/* Right: Verification Pipeline & Verdict (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Verdict Card */}
            {verificationResult && (
              <div
                className={`border rounded-xl p-5 transition-all ${
                  verificationResult.isValid
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg mt-0.5 ${
                        verificationResult.isValid
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {verificationResult.isValid ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold uppercase font-mono ${
                            verificationResult.isValid ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {verificationResult.isValid
                            ? '200 OK — ACCESS GRANTED (GENUINE eUICC)'
                            : `403 FORBIDDEN — ${verificationResult.errorCode}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        {verificationResult.isValid
                          ? 'Ed25519 JWS Compact signature verified against trusted carrier SM-DP+ root key. Profile is ENABLED and hardware IMEI chassis lock matched.'
                          : verificationResult.errorMessage}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Verification SLA</div>
                    <div
                      className={`text-sm font-mono font-bold ${
                        verificationResult.slaBudgetMet ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {(verificationResult.verificationLatencyUs / 1000).toFixed(2)} ms
                    </div>
                    <div className="text-[10px] text-emerald-400/80 font-mono">Budget: &lt; 2.0ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* 8-Point Verification Pipeline Visualizer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    In-Line Verification Pipeline Steps
                  </span>
                </div>
                <Badge variant="neutral" className="text-slate-400 border-slate-700 text-[10px] font-mono">
                  Zero-Copy Ed25519
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Step 1: Format */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">01</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>RFC 7515 JWS Format</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      3 segments parsed: <code className="text-slate-300 font-mono">header.payload.sig</code>
                    </p>
                  </div>
                </div>

                {/* Step 2: Alg Check */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">02</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Algorithm Integrity</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Restricted to <code className="text-emerald-400 font-mono">EdDSA / Ed25519</code>
                    </p>
                  </div>
                </div>

                {/* Step 3: Public Key Resolution */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">03</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>SM-DP+ Key Lookup</span>
                      {selectedScenario.tokenParams.keyId in TRUSTED_SMDP_PUBLIC_KEYS ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">
                      KID: {selectedScenario.tokenParams.keyId}
                    </p>
                  </div>
                </div>

                {/* Step 4: Cryptographic Signature */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">04</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Ed25519 Signature</span>
                      {selectedScenario.tokenParams.tamperSig ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedScenario.tokenParams.tamperSig
                        ? 'FAILED: Cryptographic checksum mismatch'
                        : 'PASSED: 64-byte Ed25519 sig valid'}
                    </p>
                  </div>
                </div>

                {/* Step 5: Profile State */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">05</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>GSMA SGP.22 Profile State</span>
                      {selectedScenario.tokenParams.profileState === 'ENABLED' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      State: {selectedScenario.tokenParams.profileState} (Required: ENABLED)
                    </p>
                  </div>
                </div>

                {/* Step 6: Expiration */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">06</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Validity Window (exp)</span>
                      {selectedScenario.tokenParams.isExpired ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedScenario.tokenParams.isExpired ? 'EXPIRED: 24h lease expired' : 'ACTIVE: Within 24h validity window'}
                    </p>
                  </div>
                </div>

                {/* Step 7: IMEI Chassis Lock */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">07</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>IMEI Chassis Lock</span>
                      {selectedScenario.tokenParams.mismatchedImei ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedScenario.tokenParams.mismatchedImei
                        ? 'MISMATCH: Bound IMEI ≠ Caller IMEI'
                        : 'LOCKED: Hardware IMEI verified'}
                    </p>
                  </div>
                </div>

                {/* Step 8: Quarantine Blacklist */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 flex items-start gap-2.5">
                  <div className="p-1 rounded bg-slate-900 text-sky-400 font-mono text-[10px] font-bold">08</div>
                  <div className="flex-1">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>SOC Revocation Registry</span>
                      {selectedScenario.tokenParams.quarantineBinding ? (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {selectedScenario.tokenParams.quarantineBinding
                        ? 'BLACKLISTED: SIM-swap quarantine active'
                        : 'CLEAN: No active SOC blacklist'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Injected Context Preview */}
            {verificationResult?.isValid && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-emerald-400" />
                    Injected Downstream Context: <code className="text-emerald-400 font-mono">EUICCIdentityContext</code>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">context.WithValue</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Binding ID</div>
                    <div className="text-white font-bold truncate mt-0.5">{verificationResult.bindingId}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Masked EID</div>
                    <div className="text-emerald-400 font-bold truncate mt-0.5">{verificationResult.maskedEid}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Country ISO</div>
                    <div className="text-amber-300 font-bold mt-0.5">{verificationResult.countryIso}</div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Chassis Locked</div>
                    <div className="text-sky-400 font-bold mt-0.5">
                      {verificationResult.imeiChassisLocked ? 'YES (Strict)' : 'NO'}
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800 col-span-2">
                    <div className="text-[10px] text-slate-500 uppercase">ICCID Hash (SHA-256)</div>
                    <div className="text-slate-300 text-[11px] truncate mt-0.5">{verificationResult.iccidHashHex}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: JWS Compact Token Inspector */}
      {activeTab === 'jws_inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segment 1: Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider font-mono">
                Segment 1: JWS Header
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Base64URL</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
              {jwsParts.header}
            </pre>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">alg:</strong> EdDSA (Edwards-curve Digital Signature)</div>
              <div><strong className="text-slate-300">crv:</strong> Ed25519 (256-bit elliptic curve)</div>
              <div><strong className="text-slate-300">kid:</strong> Trusted SM-DP+ Key identifier</div>
            </div>
          </div>

          {/* Segment 2: Payload Claims */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider font-mono">
                Segment 2: Claims Payload
              </span>
              <span className="text-[10px] text-slate-500 font-mono">GSMA SGP.22</span>
            </div>
            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-72">
              {jwsParts.payload}
            </pre>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">masked_eid:</strong> 32-digit masked eUICC identity</div>
              <div><strong className="text-slate-300">sgp22_profile_state:</strong> Strictly ENABLED</div>
              <div><strong className="text-slate-300">device_imei:</strong> Bound hardware chassis</div>
            </div>
          </div>

          {/* Segment 3: Signature */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                Segment 3: Ed25519 Signature
              </span>
              <span className="text-[10px] text-slate-500 font-mono">64 Bytes (512-bit)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 break-all max-h-40 overflow-y-auto">
              {jwsParts.sig}
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div><strong className="text-slate-300">Input:</strong> Base64URL(Header) + &quot;.&quot; + Base64URL(Payload)</div>
              <div><strong className="text-slate-300">Verification:</strong> ed25519.Verify(pubKey, input, sig)</div>
              <div><strong className="text-slate-300">Performance:</strong> Zero-copy in Go/Rust (&lt; 200 µs)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Go Source Code */}
      {activeTab === 'go_code' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">
                  services/id-federation/pkg/esim/attestation_middleware.go
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Production HTTP middleware wrapper validating Ed25519 JWS signatures and injecting verified identity context into downstream telecom handlers.
                </p>
              </div>
              <Badge variant="neutral" className="text-slate-400 border-slate-700 font-mono text-[10px]">
                Go 1.24 / net/http
              </Badge>
            </div>

            <pre className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px]">
{`// Package esim provides GSMA SGP.22 eUICC attestation verification middleware.
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
	"time"
)

// AttestationMiddleware returns a standard net/http middleware enforcing eUICC hardware attestation
func (v *AttestationVerifier) AttestationMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 1. Extract token from header: X-Mandela-eUICC-Attestation
		tokenString := r.Header.Get("X-Mandela-eUICC-Attestation")
		if tokenString == "" {
			writeProblemJSON(w, http.StatusUnauthorized, "ERR_EUICC_TOKEN_MISSING",
				"Missing eUICC Hardware Attestation Token",
				"Protected telecom operations require genuine SM-DP+ signed badge.")
			return
		}

		// 2. Extract Device IMEI if present for chassis lock validation
		requestIMEI := r.Header.Get("X-Device-IMEI")

		// 3. Cryptographically verify Ed25519 signature & SGP.22 profile claims
		idCtx, err := v.VerifyJWSCompact(r.Context(), tokenString, requestIMEI)
		if err != nil {
			writeProblemJSON(w, http.StatusForbidden, "ERR_EUICC_SIGNATURE_INVALID",
				"eUICC Attestation Verification Failed", err.Error())
			return
		}

		// 4. Inject Verified Context into Request
		ctx := context.WithValue(r.Context(), EUICCContextKey, idCtx)

		// 5. Add Telemetry Response Headers (< 2.0ms SLA met)
		w.Header().Set("X-eUICC-Verified", "true")
		w.Header().Set("X-eUICC-Binding-ID", idCtx.BindingID)
		w.Header().Set("X-eUICC-Verification-Us", fmt.Sprintf("%d", idCtx.VerificationLatencyUs))

		// 6. Forward to downstream telecom API handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
