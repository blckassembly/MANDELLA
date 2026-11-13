import React, { useState } from 'react';
import {
  Brain,
  Mic,
  Activity,
  Radio,
  Network,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Volume2,
  Sliders,
  Compass,
  ArrowRight
} from 'lucide-react';
import { AiAnomalyTab } from '../../types/multiTenant';
import {
  Card,
  Badge,
  Button,
  StatCard,
  StatusDot,
  CodeBlock,
  SectionHeader
} from '../../design-system';
import {
  INITIAL_GEODESIC_ANOMALIES,
  INITIAL_POST_SWAP_CHAINS,
  INITIAL_TOWER_ANOMALIES,
  INITIAL_IP_JA4_ANOMALIES,
  INITIAL_VOICE_FRAUD_SESSIONS,
  AI_FRAUD_SHADOW_ARTIFACTS,
  GeodesicVelocityAnomaly,
  PostSwapDrainChain,
  TowerAnomalyReport,
  IpJa4Anomaly,
  VoiceFraudSession
} from '../../data/mockAiFraudData';

interface AiAnomalyVoiceSuiteProps {
  currentTenantId?: string;
}

export const AiAnomalyVoiceSuite: React.FC<AiAnomalyVoiceSuiteProps> = () => {
  const [activeTab, setActiveTab] = useState<AiAnomalyTab>('phone_velocity');

  // Phone anomaly state
  const [geodesicAnomalies, setGeodesicAnomalies] = useState<GeodesicVelocityAnomaly[]>(INITIAL_GEODESIC_ANOMALIES);
  const [postSwapChains, setPostSwapChains] = useState<PostSwapDrainChain[]>(INITIAL_POST_SWAP_CHAINS);
  const [selectedChain, setSelectedChain] = useState<PostSwapDrainChain | null>(INITIAL_POST_SWAP_CHAINS[0]);
  const [customTestMsisdn, setCustomTestMsisdn] = useState<string>('+254 711 009281');
  const [geodesicResult, setGeodesicResult] = useState<string | null>(null);

  // Tower ST-GNN state
  const [towers, setTowers] = useState<TowerAnomalyReport[]>(INITIAL_TOWER_ANOMALIES);
  const [selectedTower, setSelectedTower] = useState<TowerAnomalyReport | null>(INITIAL_TOWER_ANOMALIES[0]);
  const [towerActionFeedback, setTowerActionFeedback] = useState<string | null>(null);

  // IP JA4 state
  const [ipAnomalies, setIpAnomalies] = useState<IpJa4Anomaly[]>(INITIAL_IP_JA4_ANOMALIES);
  const [testJa4Input, setTestJa4Input] = useState<string>('t13d1516h2_8daaf6152771_b123985b4618');
  const [ja4ScoreFeedback, setJa4ScoreFeedback] = useState<string | null>(null);

  // Voice deepfake state
  const [voiceSessions, setVoiceSessions] = useState<VoiceFraudSession[]>(INITIAL_VOICE_FRAUD_SESSIONS);
  const [activeAudioSimulation, setActiveAudioSimulation] = useState<string | null>(null);
  const [audioWaveformActive, setAudioWaveformActive] = useState<boolean>(false);
  const [voiceTestFeedback, setVoiceTestFeedback] = useState<string | null>(null);

  // AI Shadow artifacts
  const [activeArtifactIdx, setActiveArtifactIdx] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Run test geodesic calculation
  const handleTestGeodesic = () => {
    const timeDelta = 18; // seconds
    const dist = 6800; // km
    const velocity = Math.round((dist / (timeDelta / 3600)));
    setGeodesicResult(
      `[ANOMALY CRITICAL]: MSISDN ${customTestMsisdn} attached in Nairobi at 19:10:00 and attempted SS7 MAP_ProvideSubscriberInfo from London GT in 18s. Velocity = ${velocity.toLocaleString()} km/h (> Mach 1,000). Action: REJECT_AND_FREEZE_VLR.`
    );
  };

  // Run Voice Deepfake RawNet3 test
  const handleSimulateVoiceInference = (type: 'synthetic_clone' | 'authentic_voice') => {
    setActiveAudioSimulation(type);
    setAudioWaveformActive(true);
    setVoiceTestFeedback('Streaming 16kHz PCM audio chunk from SBC into RAM Enclave... Executing RawNet3 ONNX model...');

    setTimeout(() => {
      setAudioWaveformActive(false);
      if (type === 'synthetic_clone') {
        setVoiceTestFeedback(
          '[ALERT: SYNTHETIC VOICE CLONE DETECTED]: RawNet3 Anti-Spoof score = 0.982 (> 0.90 threshold). Latency: 38.4ms. SBC sent SIP 603 Decline. Ephemeral RAM memory wiped clean (0 bytes persisted).'
        );
        const newSession: VoiceFraudSession = {
          callId: `SIP-CALL-2026-${Date.now().toString().slice(-5)}`,
          callerMsisdn: '+254 700 998822',
          destinationNumber: '+254 722 000000 (Bank IVR Pin Reset)',
          acdDurationSeconds: 12,
          irsfHotlistHit: false,
          acousticDeepfakeScore: 0.982,
          rawNet3ModelLatencyMs: 38.4,
          ramEnclaveStatus: 'EPHEMERAL_PROCESSED_AND_PURGED',
          isClonedVoice: true,
          targetVictimRole: 'High Net-Worth Banking IVR Social Engineering',
          verdict: 'SYNTHETIC_VOICE_CLONE_BLOCKED'
        };
        setVoiceSessions((prev) => [newSession, ...prev]);
      } else {
        setVoiceTestFeedback(
          '[CALL CLEARED]: RawNet3 score = 0.038 (Clean human voice acoustics). Spectral harmonics natural. Latency: 29.1ms. Call permitted to continue.'
        );
      }
    }, 900);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Module Identity */}
      <div className="bg-black text-white p-6 border border-black shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                MODULE 3: AI ANOMALY & VOICE FRAUD
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-white/30 text-white/80">
                MULTI-ENTITY INFERENCE
              </span>
              <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase border border-emerald-400 text-emerald-300">
                RAWNET3 &amp; ST-GNN ACTIVE
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Multi-Entity AI Anomaly &amp; Voice Fraud Engine
            </h1>
            <p className="text-sm text-white/70 mt-1 max-w-3xl">
              Owner: Chief Technology Officer &amp; Lead ML/Audio Scientist · Real-time anomaly scoring per Phone Number, Cell Tower, and IP Address, plus dual-plane voice fraud detection with acoustic deepfake neural inference in under 40ms.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right pl-3 border-l border-white/20">
              <div className="text-xs font-mono text-white/60">TRITON INFERENCE</div>
              <div className="text-xl font-mono font-bold text-emerald-400">&lt; 40ms P99</div>
            </div>
          </div>
        </div>

        {/* Real-time SLAs Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">GEODESIC VELOCITY: </span>
              <span className="text-white font-medium">Sub-second Math</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">POST-SWAP WINDOW: </span>
              <span className="text-white font-medium">300s Drain Correlation</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">ST-GNN CLUSTERING: </span>
              <span className="text-white font-medium">Zero TA Variance</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="live" />
            <div>
              <span className="text-white/60">VOICE DEEPFAKE SLA: </span>
              <span className="text-white font-medium">RAM Enclave Purged</span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center border-b border-black/10 gap-2 overflow-x-auto pb-1">
        {[
          { tab: 'phone_velocity', label: 'Per-Phone Number & Geodesic Velocity' },
          { tab: 'tower_simbox', label: 'Per-Tower ST-GNN & SIM-Box Detection' },
          { tab: 'ip_ja4', label: 'Per-IP Address & JA4 Fingerprinting' },
          { tab: 'voice_deepfake', label: 'Voice Fraud & Acoustic Deepfake Lab' },
          { tab: 'ai_shadow_spec', label: 'AI Shadow Model Specs (Python)' }
        ].map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab as AiAnomalyTab)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === item.tab
                ? 'border-black text-black font-semibold'
                : 'border-transparent text-black/60 hover:text-black hover:border-black/30'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PER-PHONE NUMBER & GEODESIC VELOCITY */}
      {activeTab === 'phone_velocity' && (
        <div className="space-y-6">
          {/* Section 1: Impossible Geodesic Velocity */}
          <div className="border border-black p-5 bg-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/10">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
                  Impossible Geodesic Velocity Detection
                </h3>
                <p className="text-xs text-black/60 mt-0.5">
                  Flags physical impossibility when an SS7 MAP_UpdateLocation or Diameter ULR arrives from a distant country while the phone is anchored on the local RAN.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customTestMsisdn}
                  onChange={(e) => setCustomTestMsisdn(e.target.value)}
                  className="px-3 py-1 text-xs font-mono border border-black/20 focus:outline-none focus:border-black"
                  placeholder="Enter MSISDN"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleTestGeodesic}
                  className="bg-black text-white hover:bg-zinc-800 text-xs cursor-pointer"
                >
                  Calculate Geodesic Delta
                </Button>
              </div>
            </div>

            {geodesicResult && (
              <div className="p-3 my-4 bg-red-50 border-l-4 border-red-600 text-xs font-mono text-red-900">
                {geodesicResult}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {geodesicAnomalies.map((anom) => (
                <div key={anom.id} className="p-4 border border-black/15 bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-black">{anom.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono border border-red-500 bg-red-100 text-red-800 font-bold uppercase">
                      {anom.verdict}
                    </span>
                  </div>

                  <div className="text-xs font-mono space-y-1">
                    <div>
                      <span className="text-black/50">Target MSISDN: </span>
                      <strong className="text-black">{anom.msisdn}</strong> (IMSI: {anom.imsi})
                    </div>
                    <div>
                      <span className="text-black/50">Point A (Local RAN): </span>
                      <span className="text-black">{anom.firstEvent.location}</span> ({anom.firstEvent.timestamp})
                    </div>
                    <div>
                      <span className="text-black/50">Point B (Remote Signaling): </span>
                      <span className="text-black">{anom.secondEvent.location}</span> ({anom.secondEvent.timestamp})
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-white border border-black/10 text-xs font-mono text-center">
                    <div>
                      <span className="text-black/40 text-[10px] block">DISTANCE</span>
                      <strong className="text-black">{anom.distanceKm.toLocaleString()} km</strong>
                    </div>
                    <div>
                      <span className="text-black/40 text-[10px] block">TIME DELTA</span>
                      <strong className="text-black">{anom.timeDeltaSeconds}s</strong>
                    </div>
                    <div>
                      <span className="text-black/40 text-[10px] block">CALCULATED SPEED</span>
                      <strong className="text-red-700">{anom.calculatedVelocityKmh.toLocaleString()} km/h</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black text-white text-xs font-mono flex items-center justify-between">
                    <span>ENFORCED ACTION:</span>
                    <strong className="text-emerald-400">{anom.riskAction}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Post-Swap Account Drain Chains */}
          <div className="border border-black p-5 bg-white">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black mb-1">
              Post-Swap 300-Second Account Drain Chains
            </h3>
            <p className="text-xs text-black/60 mb-4">
              Correlates a POS SIM-swap / eSIM re-issuance event followed within 300 seconds by inbound banking OTP bursts and outbound CIAM login anomalies.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {postSwapChains.map((chain) => (
                <div key={chain.id} className="border border-black/20 p-4 bg-zinc-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-black">{chain.id}</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono border border-red-600 bg-red-50 text-red-700 font-bold">
                      RISK SCORE: {(chain.fraudRiskScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    {/* Event 1 */}
                    <div className="p-2.5 bg-white border border-black/10 flex items-start gap-2">
                      <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] shrink-0">1</span>
                      <div>
                        <div className="font-semibold text-black">SIM Swap Re-provisioned ({chain.simSwapEvent.timestamp})</div>
                        <div className="text-black/60">Agent: {chain.simSwapEvent.posAgent} at {chain.simSwapEvent.storeLocation}</div>
                      </div>
                    </div>

                    {/* Event 2 */}
                    <div className="p-2.5 bg-white border border-black/10 flex items-start gap-2">
                      <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] shrink-0">2</span>
                      <div>
                        <div className="font-semibold text-black">
                          Inbound Banking MFA Burst (+{chain.mfaBurstEvent.elapsedSeconds}s)
                        </div>
                        <div className="text-black/60">{chain.mfaBurstEvent.smsCount}x OTP SMS from {chain.mfaBurstEvent.sender}</div>
                      </div>
                    </div>

                    {/* Event 3 */}
                    <div className="p-2.5 bg-white border border-black/10 flex items-start gap-2">
                      <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] shrink-0">3</span>
                      <div>
                        <div className="font-semibold text-black">
                          Target CIAM Login Anomaly (+{chain.ciamAnomalyEvent.elapsedSeconds}s)
                        </div>
                        <div className="text-black/60">{chain.ciamAnomalyEvent.targetBank} via JA4 {chain.ciamAnomalyEvent.ja4Fingerprint.substring(0, 16)}...</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-black/10 text-xs font-mono">
                    <div>
                      <span className="text-black/50">Loss At Risk: </span>
                      <strong className="text-red-700">${chain.totalLossAtRiskUsd.toLocaleString()} USD</strong>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-500 font-bold uppercase text-[10px]">
                      {chain.state}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PER-TOWER ST-GNN & SIM-BOX DETECTION */}
      {activeTab === 'tower_simbox' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 border border-black/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
              Spatio-Temporal Graph Neural Network (ST-GNN) Tower Anomaly Model
            </h3>
            <p className="text-xs text-black/60 mt-0.5">
              Continuously correlates RAN Timing Advance (TA) distributions, call-to-SMS ratios, and IMEI rotation velocity to detect stationary SIM-boxes and rogue 2G IMSI-catchers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {towers.map((tower) => (
                <div
                  key={tower.cellId}
                  onClick={() => setSelectedTower(tower)}
                  className={`p-4 border transition-colors cursor-pointer bg-white ${
                    selectedTower?.cellId === tower.cellId
                      ? 'border-black ring-1 ring-black'
                      : 'border-black/15 hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-sm text-black">{tower.towerName}</div>
                      <div className="text-xs font-mono text-black/50">{tower.cellId} · {tower.carrierTech}</div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2.5 py-1 text-xs font-mono font-bold uppercase ${
                          tower.anomalyType === 'SIMBOX_CLUSTER' || tower.anomalyType === 'ROGUE_IMSI_CATCHER'
                            ? 'bg-red-600 text-white'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        }`}
                      >
                        {tower.anomalyType}
                      </span>
                      <div className="text-[11px] font-mono text-black/50 mt-1">
                        ST-GNN Score: <strong>{(tower.stGnnScore * 100).toFixed(1)}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-zinc-50 border border-black/10 text-xs font-mono">
                    <div>
                      <span className="text-black/40 text-[10px] block">TIMING ADVANCE VAR</span>
                      <strong className={tower.metrics.timingAdvanceVarianceKm < 0.01 ? 'text-red-700' : 'text-black'}>
                        {tower.metrics.timingAdvanceVarianceKm} km
                      </strong>
                    </div>
                    <div>
                      <span className="text-black/40 text-[10px] block">CALL-TO-SMS RATIO</span>
                      <strong className="text-black">{tower.metrics.outboundToInboundRatio}</strong>
                    </div>
                    <div>
                      <span className="text-black/40 text-[10px] block">IMEI ROTATION</span>
                      <strong className={tower.metrics.imeiRotationFrequencyPerHour > 10 ? 'text-red-700' : 'text-black'}>
                        {tower.metrics.imeiRotationFrequencyPerHour} / hr
                      </strong>
                    </div>
                    <div>
                      <span className="text-black/40 text-[10px] block">ACTIVE UEs</span>
                      <strong className="text-black">{tower.activeUeCount} devices</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tower Mitigation Panel */}
            <div className="border border-black p-5 bg-zinc-50 space-y-4">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-black pb-2 border-b border-black/10">
                Tower Playbook Action
              </h4>

              {selectedTower ? (
                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <span className="text-black/50">Selected Tower: </span>
                    <strong className="text-black">{selectedTower.towerName}</strong>
                  </div>
                  <div>
                    <span className="text-black/50">Anomaly Classification: </span>
                    <span className="text-red-700 font-bold">{selectedTower.anomalyType}</span>
                  </div>
                  <div>
                    <span className="text-black/50">Radio Encryption: </span>
                    <span className={selectedTower.metrics.cipherDowngradeAlert ? 'text-red-600 font-bold' : 'text-black'}>
                      {selectedTower.metrics.cipherDowngradeAlert ? 'A5/0 CIPHER DOWNGRADE DETECTED' : '128-EEA2 Active'}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-black/10 space-y-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setTowerActionFeedback(
                          `PLAYBOOK_ISOLATE_SIMBOX_CLUSTER executed on Cell ${selectedTower.cellId}. 142 radio bearers revoked via S6a_CLR.`
                        );
                      }}
                      className="w-full bg-red-600 text-white hover:bg-red-700 text-xs cursor-pointer"
                    >
                      Isolate Tower Bearers (Playbook)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTowerActionFeedback(`Dispatching mobile RF engineering squad to triangulate ${selectedTower.cellId}.`);
                      }}
                      className="w-full border-black text-black hover:bg-black hover:text-white text-xs cursor-pointer"
                    >
                      Dispatch RF Triangulation Squad
                    </Button>
                  </div>

                  {towerActionFeedback && (
                    <div className="p-3 bg-black text-emerald-400 text-xs mt-3 leading-relaxed">
                      {towerActionFeedback}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-black/50 font-mono py-8 text-center">
                  Select a tower to execute playbooks.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PER-IP ADDRESS & JA4 */}
      {activeTab === 'ip_ja4' && (
        <div className="space-y-6">
          <div className="p-4 bg-zinc-50 border border-black/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
              Per-IP Address &amp; JA4 TLS Client Fingerprinting
            </h3>
            <p className="text-xs text-black/60 mt-0.5">
              Scores Gi-LAN subscriber egress IPs, enterprise SIP trunks, and public CIAM endpoints using JA4 TLS fingerprints, request entropy, and ASN reputation to stop automated eSIM swap bots.
            </p>
          </div>

          <div className="border border-black overflow-hidden bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-black/10 uppercase tracking-wider text-black/70">
                <tr>
                  <th className="p-3">Source IP Address</th>
                  <th className="p-3">Endpoint Type</th>
                  <th className="p-3">JA4 TLS Fingerprint</th>
                  <th className="p-3 text-right">Entropy</th>
                  <th className="p-3">ASN Organization</th>
                  <th className="p-3">Threat Type</th>
                  <th className="p-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {ipAnomalies.map((ip) => (
                  <tr key={ip.srcIp} className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-black">{ip.srcIp}</td>
                    <td className="p-3 text-black/70">{ip.clientType}</td>
                    <td className="p-3 text-[11px] font-mono text-black/80">{ip.ja4Fingerprint}</td>
                    <td className="p-3 text-right font-semibold text-black">{ip.entropyScore}</td>
                    <td className="p-3 text-black/60 text-[11px] truncate max-w-xs">{ip.asnOrg}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] border border-black/20 bg-zinc-100">
                        {ip.threatType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          ip.verdict === 'DROP_TCP_RESET'
                            ? 'bg-red-600 text-white'
                            : ip.verdict === 'RATE_LIMIT_CHALLENGE'
                            ? 'bg-amber-100 text-amber-800 border border-amber-400'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        }`}
                      >
                        {ip.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: VOICE FRAUD & ACOUSTIC DEEPFAKE LAB */}
      {activeTab === 'voice_deepfake' && (
        <div className="space-y-6">
          <div className="p-5 bg-black text-white border border-black">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                  DUAL-PLANE VOICE FRAUD DEFENSE
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-white mt-1">
                  Signaling Call-Graph + Inline Acoustic Deepfake Neural Inspector
                </h3>
                <p className="text-xs font-mono text-white/70 mt-0.5">
                  RawNet3 ONNX engine processing 16kHz PCM chunks at the SBC/IVR edge in under 40ms. Audio is processed strictly in ephemeral RAM enclaves and immediately purged to satisfy data sovereignty.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulateVoiceInference('synthetic_clone')}
                  className="bg-red-600 text-white border-red-600 hover:bg-red-700 cursor-pointer text-xs"
                >
                  <Flame className="w-3.5 h-3.5 mr-1.5" />
                  Inject AI Voice Clone
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSimulateVoiceInference('authentic_voice')}
                  className="bg-white text-black border-white hover:bg-zinc-200 cursor-pointer text-xs"
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                  Test Clean Human Voice
                </Button>
              </div>
            </div>

            {/* Live Audio Spectrum Visualizer */}
            <div className="mt-6 p-4 bg-zinc-950 border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono text-white/60 mb-2">
                <span>RTP 16kHz PCM SPECTRAL HARMONICS (RAM ENCLAVE)</span>
                <span className="text-emerald-400">RAM PURGE: ZERO BYTES ON DISK</span>
              </div>

              <div className="h-16 flex items-end gap-1.5 bg-black p-2 border border-white/10">
                {Array.from({ length: 48 }).map((_, i) => {
                  const height = audioWaveformActive
                    ? Math.floor(15 + Math.random() * 80)
                    : activeAudioSimulation === 'synthetic_clone'
                    ? [75, 80, 85, 20, 15, 90, 85, 20][i % 8]
                    : 20;
                  return (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`flex-1 transition-all duration-150 ${
                        activeAudioSimulation === 'synthetic_clone' ? 'bg-red-500' : 'bg-emerald-400'
                      }`}
                    />
                  );
                })}
              </div>

              {voiceTestFeedback && (
                <div className="mt-3 p-3 bg-zinc-900 border border-white/10 font-mono text-xs text-white leading-relaxed">
                  {voiceTestFeedback}
                </div>
              )}
            </div>
          </div>

          {/* Voice Calls Table */}
          <div className="border border-black overflow-hidden bg-white">
            <div className="p-3 bg-zinc-50 border-b border-black/10 font-mono text-xs font-semibold uppercase text-black/70">
              Real-Time Voice Sessions Ingested from SBC Edge
            </div>
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-black/10 uppercase tracking-wider text-black/70">
                <tr>
                  <th className="p-3">SIP Call ID</th>
                  <th className="p-3">Caller &rarr; Destination</th>
                  <th className="p-3 text-right">ACD Duration</th>
                  <th className="p-3 text-right">RawNet3 Deepfake Score</th>
                  <th className="p-3 text-right">Inference Latency</th>
                  <th className="p-3">RAM Enclave</th>
                  <th className="p-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {voiceSessions.map((session) => (
                  <tr key={session.callId} className="hover:bg-zinc-50/80">
                    <td className="p-3 font-bold text-black">{session.callId}</td>
                    <td className="p-3">
                      <div className="font-medium text-black">{session.callerMsisdn}</div>
                      <div className="text-[11px] text-black/50 truncate max-w-xs">{session.destinationNumber}</div>
                    </td>
                    <td className="p-3 text-right font-semibold text-black">{session.acdDurationSeconds}s</td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-bold ${
                          session.acousticDeepfakeScore > 0.9 ? 'text-red-600' : 'text-emerald-700'
                        }`}
                      >
                        {(session.acousticDeepfakeScore * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-3 text-right text-black font-semibold">{session.rawNet3ModelLatencyMs}ms</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 text-[10px] bg-zinc-100 border border-black/10 text-black">
                        PURGED (RAM ONLY)
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                          session.verdict === 'SYNTHETIC_VOICE_CLONE_BLOCKED'
                            ? 'bg-red-600 text-white'
                            : session.verdict === 'IRSF_WANGIRI_DROP'
                            ? 'bg-amber-100 text-amber-800 border border-amber-500'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-500'
                        }`}
                      >
                        {session.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AI SHADOW MODEL SPECS */}
      {activeTab === 'ai_shadow_spec' && (
        <div className="space-y-6">
          <div className="p-5 bg-black text-white border border-black">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/15">
              <div>
                <span className="px-2 py-0.5 text-xs font-mono font-medium tracking-wider uppercase bg-white text-black border border-white">
                  SHADOW MODULE ID: MOD-03-AI-INFERENCE
                </span>
                <h3 className="text-lg font-semibold tracking-tight text-white mt-1">
                  Target Agent: mlops-triton-inference-builder
                </h3>
                <p className="text-xs font-mono text-white/70 mt-0.5">
                  Runtime: NVIDIA Triton Inference Server (ONNX + TensorRT) + Feast Redis Cluster + PyTorch Geometric
                </p>
              </div>

              <button
                onClick={() => handleCopyCode(AI_FRAUD_SHADOW_ARTIFACTS[activeArtifactIdx].code)}
                className="px-3 py-1.5 text-xs font-mono bg-white text-black hover:bg-zinc-200 cursor-pointer flex items-center gap-1.5 font-medium"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied' : 'Copy Code'}
              </button>
            </div>

            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              {AI_FRAUD_SHADOW_ARTIFACTS.map((art, idx) => (
                <button
                  key={art.path}
                  onClick={() => setActiveArtifactIdx(idx)}
                  className={`px-3 py-1.5 text-xs font-mono border cursor-pointer whitespace-nowrap ${
                    activeArtifactIdx === idx
                      ? 'bg-white text-black border-white font-semibold'
                      : 'border-white/20 text-white/70 hover:border-white/50'
                  }`}
                >
                  {art.path.split('/').pop()}
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-zinc-900 border border-white/10 text-xs font-mono text-white/80">
              <span className="text-white/40">Responsibility: </span>
              {AI_FRAUD_SHADOW_ARTIFACTS[activeArtifactIdx].responsibility}
            </div>

            <pre className="mt-3 p-4 bg-zinc-950 text-emerald-300 font-mono text-xs border border-white/10 overflow-x-auto max-h-[500px] leading-relaxed">
              {AI_FRAUD_SHADOW_ARTIFACTS[activeArtifactIdx].code}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
