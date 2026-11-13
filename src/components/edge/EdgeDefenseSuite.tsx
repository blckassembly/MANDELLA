import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  AlertTriangle,
  Radio,
  FileCode,
  Layers,
  Cpu,
  Lock,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sliders,
  Server,
  ArrowUpRight,
  Terminal,
  Clock,
  Sparkles,
  ChevronRight,
  Copy,
  Check,
  Send,
  Eye,
  Crosshair,
  Filter
} from 'lucide-react';
import { EdgeDefenseTab } from '../../types/multiTenant';
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
  INITIAL_SIGNALING_RULES,
  INITIAL_SIGNALING_EVENTS,
  INITIAL_SMS_FIREWALL_EVENTS,
  INITIAL_STIR_SHAKEN_RECORDS,
  INITIAL_IXP_CENTERS,
  INITIAL_OPTICAL_RELAYS,
  AI_SHADOW_ARTIFACTS,
  SignalingRule,
  SignalingPacketEvent,
  SmsFirewallEvent,
  StirShakenCallRecord,
  IxpScrubberCenter,
  OpticalBypassRelay
} from '../../data/mockEdgeDefenseData';

interface EdgeDefenseSuiteProps {
  currentTenantId?: string;
}

export const EdgeDefenseSuite: React.FC<EdgeDefenseSuiteProps> = () => {
  const [activeTab, setActiveTab] = useState<EdgeDefenseTab>('signaling_firewall');

  // Signaling state
  const [rules, setRules] = useState<SignalingRule[]>(INITIAL_SIGNALING_RULES);
  const [events, setEvents] = useState<SignalingPacketEvent[]>(INITIAL_SIGNALING_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<SignalingPacketEvent | null>(INITIAL_SIGNALING_EVENTS[0]);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState<boolean>(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  // SMS Firewall state
  const [smsEvents, setSmsEvents] = useState<SmsFirewallEvent[]>(INITIAL_SMS_FIREWALL_EVENTS);
  const [testSmsPayload, setTestSmsPayload] = useState<{
    sender: string;
    recipient: string;
    body: string;
    hasSimjackerUdh: boolean;
  }>({
    sender: '+44 7000 918231',
    recipient: '+254 712 345678',
    body: 'Urgent: Your M-PESA PIN is expired. Claim funds at http://safari-mpesa-claim.cc/payout-id-94',
    hasSimjackerUdh: true
  });
  const [smsInspectResult, setSmsInspectResult] = useState<string | null>(null);

  // STIR/SHAKEN state
  const [calls, setCalls] = useState<StirShakenCallRecord[]>(INITIAL_STIR_SHAKEN_RECORDS);
  const [testCli, setTestCli] = useState<string>('112');
  const [testCalledParty, setTestCalledParty] = useState<string>('+254 722 000100');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);

  // IXP Scrubber state
  const [ixpCenters, setIxpCenters] = useState<IxpScrubberCenter[]>(INITIAL_IXP_CENTERS);
  const [selectedIxp, setSelectedIxp] = useState<IxpScrubberCenter>(INITIAL_IXP_CENTERS[0]);
  const [isInjectingGtpFlood, setIsInjectingGtpFlood] = useState<boolean>(false);

  // Optical Bypass state
  const [relays, setRelays] = useState<OpticalBypassRelay[]>(INITIAL_OPTICAL_RELAYS);

  // AI Shadow Spec state
  const [activeArtifactIndex, setActiveArtifactIndex] = useState<number>(0);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Toggle rule status
  const toggleRuleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? { ...r, status: r.status === 'enforcing' ? 'monitoring' : 'enforcing' }
          : r
      )
    );
  };

  // Simulate SS7 Injection Attack
  const handleSimulateAttack = (attackType: 'MAP_InsertSubscriberData' | 'S6a_CLR' | 'AIR_Harvesting') => {
    setIsSimulatingAttack(true);
    setSimulationStatus(`Injecting malicious ${attackType} packet via international SCCP interconnect...`);

    setTimeout(() => {
      const newEvent: SignalingPacketEvent = {
        id: `sig-sim-${Date.now()}`,
        timestamp: 'Just now',
        protocol: attackType === 'MAP_InsertSubscriberData' ? 'SS7 MAP' : 'Diameter S6a',
        originGtOrHost: attackType === 'MAP_InsertSubscriberData' ? '+44 7973 000999 (Rogue GT)' : 'dra-adversary.peer.io',
        destGtOrRealm: 'stp01.mandela-ke.net',
        opCodeName: attackType === 'MAP_InsertSubscriberData' ? 'MAP_InsertSubscriberData [3]' : attackType === 'S6a_CLR' ? 'S6a_CLR [317]' : 'S6a_AIR [318]',
        imsiTarget: '6390100' + Math.floor(10000000 + Math.random() * 90000000),
        category: attackType === 'AIR_Harvesting' ? 'Category 3' : 'Category 1',
        verdict: attackType === 'AIR_Harvesting' ? 'VELOCITY_RATE_LIMITED' : 'BLOCKED_FS11',
        latencyUs: 1380 + Math.floor(Math.random() * 240),
        asn1HexDump: '30 2b 02 01 03 04 08 63 90 10 04 ... [BLOCKED: GSMA FS.11 Category 1 Unauthorized Injection]',
        threatDetails: `Active zero-copy Rust DPDK filter dropped ${attackType} in 1,420 µs (< 1800 µs budget). Cause code 34 sent.`
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 15)]);
      setSelectedEvent(newEvent);
      setIsSimulatingAttack(false);
      setSimulationStatus(`Zero-copy Rust engine neutralized ${attackType} in ${newEvent.latencyUs} µs! Zero packet leakage.`);
    }, 600);
  };

  // Test SMS Firewall inspection
  const handleInspectSms = () => {
    let result = '';
    const latency = (1.8 + Math.random() * 1.5).toFixed(1);
    if (testSmsPayload.hasSimjackerUdh) {
      result = `[BLOCKED & STRIPPED]: Simjacker/WIBattack 0x7F SIM Toolkit envelope detected at byte offset 0x06. Malicious UDH envelope stripped in ${latency}ms. Payload sanitized.`;
    } else if (testSmsPayload.body.toLowerCase().includes('http') && testSmsPayload.body.toLowerCase().includes('mpesa')) {
      result = `[URL DEFUSED]: FastText/ONNX Smishing Classifier scored 0.994 malicious probability in ${latency}ms. Phishing domain defused with carrier landing warning.`;
    } else {
      result = `[DELIVERED & VIRTUALIZED]: Clean payload. GSMA Home Routing enforced; true subscriber IMSI substituted with virtual token V-IMSI-KE-99042 in ${latency}ms.`;
    }
    setSmsInspectResult(result);

    const newSmsEv: SmsFirewallEvent = {
      id: `sms-ev-${Date.now()}`,
      timestamp: 'Just now',
      protocol: 'SMPP v3.4',
      senderCli: testSmsPayload.sender,
      recipientMsisdn: testSmsPayload.recipient,
      threatClass: testSmsPayload.hasSimjackerUdh ? 'SIMJACKER_0x7F' : 'SMISHING_URL',
      udhHeaderHex: testSmsPayload.hasSimjackerUdh ? '02 70 00 05 02 01 7F [SIM Toolkit Attack]' : '00',
      smishingUrlDetected: testSmsPayload.body.includes('http') ? 'http://safari-mpesa-claim.cc/...' : undefined,
      actionTaken: testSmsPayload.hasSimjackerUdh ? 'STRIPPED_0x7F_ENVELOPE' : 'URL_DEFUSED',
      inferenceLatencyMs: parseFloat(latency)
    };
    setSmsEvents((prev) => [newSmsEv, ...prev]);
  };

  // Verify STIR/SHAKEN CLI
  const handleVerifyCli = () => {
    if (['112', '999', '911', '+254000000'].includes(testCli.trim())) {
      setVerificationFeedback(
        `[REJECTED 403 FORBIDDEN]: Inbound CLI "${testCli}" is flagged on the National Do-Not-Originate (DNO) Registry! Spoofed emergency corridor call dropped immediately.`
      );
      const newRec: StirShakenCallRecord = {
        id: `ss-rec-${Date.now()}`,
        timestamp: 'Just now',
        sipCallId: `spoof-dno-${Date.now()}@carrier-transit.net`,
        callingCli: testCli,
        calledParty: testCalledParty,
        serviceType: 'STI-VS (Verify Inbound)',
        attestationLevel: 'REJECT_DNO',
        isDnoMatch: true,
        passportTokenSignature: 'BLOCKED_DNO',
        x509CertChainThumbprint: 'REJECTED',
        redisCacheHit: true,
        verdict: 'DNO_BLACKLIST_DROP',
        verificationLatencyMs: 1.2
      };
      setCalls((prev) => [newRec, ...prev]);
    } else {
      setVerificationFeedback(
        `[SIGNED & VERIFIED]: STI-AS generated RFC 8224 PASSporT token with Attestation Level A. STI-VS resolved X.509 cert from Redis cache in 0.3ms (Total latency: 4.1ms < 8.0ms SLA).`
      );
      const newRec: StirShakenCallRecord = {
        id: `ss-rec-${Date.now()}`,
        timestamp: 'Just now',
        sipCallId: `call-ok-${Date.now()}@mandela.africa`,
        callingCli: testCli,
        calledParty: testCalledParty,
        serviceType: 'STI-AS (Sign Outbound)',
        attestationLevel: 'Attestation A (Full)',
        isDnoMatch: false,
        passportTokenSignature: 'eyJhbGciOiJFUzI1NiIsInBwdCI6InNoYWtlbiJ9...',
        x509CertChainThumbprint: 'SHA256:719823abce451290384756192837465019283746',
        redisCacheHit: true,
        verdict: 'VERIFIED_VALID',
        verificationLatencyMs: 4.1
      };
      setCalls((prev) => [newRec, ...prev]);
    }
  };

  // Trigger IXP 40 Gbps GTP-U Flood Simulation
  const handleTriggerGtpFlood = () => {
    setIsInjectingGtpFlood(true);
    setTimeout(() => {
      setIxpCenters((prev) =>
        prev.map((c) =>
          c.id === selectedIxp.id
            ? {
                ...c,
                status: 'SCRUBBING_ACTIVE',
                activeThreat: 'GTP-U Floods',
                attackTrafficGbps: 48.6,
                ingressTrafficGbps: c.baselineCleanGbps + 48.6,
                bgpFlowSpecAnnounced: true,
                flowSpecRule: 'match destination 196.201.214.0/24 protocol udp port 2152 => traffic-rate 0',
                xdpDropsPerSec: 24500000,
                mitigationConvergenceSec: 1.6
              }
            : c
        )
      );
      setIsInjectingGtpFlood(false);
    }, 800);
  };

  // Toggle Optical Relay Mode
  const toggleRelayMode = (relayId: string) => {
    setRelays((prev) =>
      prev.map((r) =>
        r.id === relayId
          ? {
              ...r,
              opticalMode: r.opticalMode === 'fail-open' ? 'fail-closed' : 'fail-open'
            }
          : r
      )
    );
  };

  const copyArtifactCode = () => {
    navigator.clipboard.writeText(AI_SHADOW_ARTIFACTS[activeArtifactIndex].code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Architecture Banner */}
      <div className="bg-black text-white p-6 rounded-[2px] border border-black shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-red-600 text-white rounded-[2px]">
                MOD-01-EDGE-DEFENSE
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-medium tracking-wider bg-zinc-800 text-zinc-300 rounded-[2px]">
                Owner: Product Architect & Principal Network Security Engineer
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-zinc-800 text-emerald-400 rounded-[2px] flex items-center gap-1">
                <StatusDot status="live" /> Kafka OCSF: telecom.ocsf.edge.raw
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Inline Signaling & Edge Defense Plane</h1>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Zero-copy SS7/Diameter signaling firewalls at STP & DRA, SMS Simjacker/Smishing defense, STIR/SHAKEN
              cryptographic attestation, and sub-3s IXP eBPF/XDP volumetric scrubbing across African telecom corridors.
            </p>
          </div>

          {/* Southbound & Runtime Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-[2px] text-right">
              <span className="text-[10px] block text-zinc-400 uppercase tracking-wider font-semibold">Dataplane Engine</span>
              <span className="text-xs font-mono font-bold text-amber-300">Rust (tokio + dpdk-sys + aya-ebpf)</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-[2px] text-right">
              <span className="text-[10px] block text-zinc-400 uppercase tracking-wider font-semibold">Control Plane</span>
              <span className="text-xs font-mono font-bold text-sky-300">Go 1.24 + gRPC + BGP-FlowSpec</span>
            </div>
          </div>
        </div>

        {/* Real-Time Performance & Guardrails SLA Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-5 border-t border-zinc-800">
          <div className="bg-zinc-900/80 p-2.5 rounded-[2px] border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">SS7 / Diameter P99</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-mono font-bold text-emerald-400">1.42 ms</span>
              <span className="text-[10px] text-zinc-500 font-mono">SLA &lt;2.0ms</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-medium mt-1">✓ Budget 1800 µs Met</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-[2px] border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">SMS Firewall P99</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-mono font-bold text-emerald-400">2.81 ms</span>
              <span className="text-[10px] text-zinc-500 font-mono">SLA &lt;5.0ms</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-medium mt-1">✓ 0x7F Simjacker Strip</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-[2px] border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">STIR/SHAKEN P99</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-mono font-bold text-emerald-400">4.60 ms</span>
              <span className="text-[10px] text-zinc-500 font-mono">SLA &lt;8.0ms</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-medium mt-1">✓ Redis Cert Cache 99.8%</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-[2px] border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">IXP Mitigation Speed</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-mono font-bold text-emerald-400">1.80 s</span>
              <span className="text-[10px] text-zinc-500 font-mono">SLA &lt;3.0s</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-medium mt-1">✓ BGP FlowSpec Automated</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-[2px] border border-zinc-800">
            <div className="text-[10px] uppercase font-semibold text-zinc-400">Optical Relay Engagement</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-mono font-bold text-emerald-400">28 ms</span>
              <span className="text-[10px] text-zinc-500 font-mono">SLA &lt;50ms</span>
            </div>
            <div className="text-[10px] text-emerald-500 font-medium mt-1">✓ Fail-Open/Closed Armed</div>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-black/10 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('signaling_firewall')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'signaling_firewall'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          SS7 & Diameter (FS.11/19)
        </button>

        <button
          onClick={() => setActiveTab('sms_firewall')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'sms_firewall'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          SMS Firewall & Simjacker
        </button>

        <button
          onClick={() => setActiveTab('stir_shaken')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'stir_shaken'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          STIR/SHAKEN & DNO
        </button>

        <button
          onClick={() => setActiveTab('ixp_scrubber')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ixp_scrubber'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          IXP eBPF/XDP Scrubbing
        </button>

        <button
          onClick={() => setActiveTab('bypass_guardrails')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'bypass_guardrails'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Hardware Optical Bypass
        </button>

        <button
          onClick={() => setActiveTab('ai_shadow_spec')}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-[2px] transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'ai_shadow_spec'
              ? 'bg-black text-white shadow-sm'
              : 'text-black/60 hover:text-black hover:bg-black/5'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          AI Shadow Spec & Source
        </button>
      </div>

      {/* 3. TAB 1: SS7 & DIAMETER SIGNALING FIREWALL */}
      {activeTab === 'signaling_firewall' && (
        <div className="space-y-6">
          {/* Top Control Bar with Attack Simulator */}
          <div className="bg-zinc-50 border border-black/15 p-4 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  INLINE STP &amp; DRA DEFENSE STATE: ENFORCING GSMA FS.11 / FS.19
                </span>
              </div>
              <p className="text-xs text-black/60 mt-1">
                Zero-copy ASN.1/BER parsing in Rust with 1800 µs latency budget. Drops unauthorized internal operations,
                validates roaming velocity, and throttles AIR harvests.
              </p>
            </div>

            {/* Simulated Injections */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                disabled={isSimulatingAttack}
                onClick={() => handleSimulateAttack('MAP_InsertSubscriberData')}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white rounded-[2px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Inject MAP_InsertSub (Cat 1)
              </button>
              <button
                disabled={isSimulatingAttack}
                onClick={() => handleSimulateAttack('S6a_CLR')}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-[2px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Inject S6a_CLR (Cat 1)
              </button>
              <button
                disabled={isSimulatingAttack}
                onClick={() => handleSimulateAttack('AIR_Harvesting')}
                className="px-3 py-1.5 text-xs font-mono font-bold bg-zinc-800 hover:bg-black text-white rounded-[2px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" /> Flood AIR Vectors (Cat 3)
              </button>
            </div>
          </div>

          {simulationStatus && (
            <div className="p-3 bg-black text-emerald-400 font-mono text-xs rounded-[2px] border border-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{simulationStatus}</span>
            </div>
          )}

          {/* GSMA Rule Matrix */}
          <div className="border border-black/15 rounded-[2px] overflow-hidden bg-white">
            <div className="p-3.5 bg-zinc-100 border-b border-black/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-black" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  GSMA FS.11 &amp; FS.19 Active Rule Sets
                </span>
              </div>
              <span className="text-[11px] font-mono text-black/60">
                P99 Latency Budget: 1800 µs (Measured: 1,420 µs)
              </span>
            </div>

            <div className="divide-y divide-black/10">
              {rules.map((rule) => (
                <div key={rule.id} className="p-4 hover:bg-zinc-50/50 transition">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-black text-white rounded-[2px]">
                          {rule.standardReference}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] ${
                            rule.category === 'cat1_unauthorized_internal'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : rule.category === 'cat2_location_spoofing'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {rule.category.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-black">{rule.name}</span>
                        <span className="text-[11px] font-mono text-black/50">({rule.protocol})</span>
                      </div>
                      <p className="text-xs text-black/70 max-w-4xl">{rule.description}</p>
                      <div className="flex items-center gap-4 text-[11px] font-mono text-black/60 pt-1">
                        <span>Target OpCodes: {rule.opCodes.join(', ')}</span>
                        <span>Matches: {rule.matchCount.toLocaleString()}</span>
                        <span className="text-red-700 font-semibold">Blocks: {rule.blockCount.toLocaleString()}</span>
                        <span>Latency Budget: {rule.latencyBudgetUs} µs</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`px-3 py-1 text-xs font-mono font-bold rounded-[2px] transition ${
                          rule.status === 'enforcing'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {rule.status === 'enforcing' ? 'ENFORCING' : 'MONITORING'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Packet Events & Hex Decoder Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Packet Log */}
            <div className="border border-black/15 rounded-[2px] bg-white">
              <div className="p-3 bg-zinc-100 border-b border-black/15 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Live Signaling Event Stream (STP &amp; DRA Interconnect)
                </span>
                <span className="text-[10px] font-mono text-black/50">Auto-refresh (P99 1.4ms)</span>
              </div>
              <div className="divide-y divide-black/10 max-h-96 overflow-y-auto">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={`p-3 text-xs cursor-pointer transition ${
                      selectedEvent?.id === ev.id ? 'bg-zinc-100 border-l-2 border-black' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-black">{ev.opCodeName}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded-[2px] font-mono text-[10px] font-bold ${
                          ev.verdict.startsWith('BLOCKED')
                            ? 'bg-red-600 text-white'
                            : ev.verdict === 'VELOCITY_RATE_LIMITED'
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {ev.verdict}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-black/60 mt-1 truncate">
                      From: {ev.originGtOrHost} → To: {ev.destGtOrRealm}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-black/50 mt-1">
                      <span>Target IMSI: {ev.imsiTarget}</span>
                      <span>Latency: {ev.latencyUs} µs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hex Payload & ASN.1 / AVP Decoder */}
            <div className="border border-black/15 rounded-[2px] bg-zinc-950 text-white p-4 font-mono text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Zero-Copy ASN.1 BER / AVP Decoder
                  </span>
                  <span className="text-[10px] text-zinc-500">Event: {selectedEvent?.id || 'None'}</span>
                </div>

                {selectedEvent ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-[10px] uppercase text-zinc-400">Threat Diagnosis</div>
                      <div className="text-zinc-200 mt-0.5 text-[11px]">{selectedEvent.threatDetails}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-zinc-900 p-2 rounded-[2px] border border-zinc-800">
                      <div>
                        <span className="text-zinc-500 block">Protocol:</span>
                        <span className="text-zinc-200">{selectedEvent.protocol}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Category:</span>
                        <span className="text-amber-300">{selectedEvent.category}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Zero-Copy Parse Time:</span>
                        <span className="text-emerald-400">{selectedEvent.latencyUs} µs (&lt; 1800 µs)</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block">Enforcement Action:</span>
                        <span className="text-red-400 font-bold">{selectedEvent.verdict}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase text-zinc-400 mb-1">Raw ASN.1 / AVP Hex Buffer</div>
                      <pre className="bg-black p-2.5 rounded-[2px] text-zinc-300 text-[10px] leading-relaxed overflow-x-auto border border-zinc-900 font-mono">
                        {selectedEvent.asn1HexDump}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-500 py-10 text-center">Select an event from the stream</div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 flex justify-between">
                <span>Kernel Ring: DPDK /dev/uio0</span>
                <span>GSMA FS.11 State Machine Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: SMS APPLICATION DEFENSE & SIMJACKER */}
      {activeTab === 'sms_firewall' && (
        <div className="space-y-6">
          {/* Overview & SLA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">Simjacker &amp; WIBattack Defense</div>
              <div className="text-xl font-bold font-mono mt-1 text-black">0x7F UDH Binary Envelope</div>
              <p className="text-xs text-black/70 mt-1">
                Strips SIM Toolkit binary command wrappers to defeat silent OTA SIM execution and spyware payloads.
              </p>
            </div>

            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">IMSI Home Routing</div>
              <div className="text-xl font-bold font-mono mt-1 text-emerald-600">Virtual Token Enforced</div>
              <p className="text-xs text-black/70 mt-1">
                Conceals true subscriber IMSI from unauthenticated foreign SMS gateways, defeating IMSI-catchers.
              </p>
            </div>

            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">Smishing &amp; Gray Routes</div>
              <div className="text-xl font-bold font-mono mt-1 text-black">P99 &lt; 5.0ms ONNX Classifier</div>
              <p className="text-xs text-black/70 mt-1">
                FastText and ONNX model scans URLs in SMS bodies in under 3.2ms, defusing phishing and grey bypass routes.
              </p>
            </div>
          </div>

          {/* Interactive SMS Simulator */}
          <div className="bg-zinc-50 border border-black/15 p-5 rounded-[2px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Interactive SMS Payload &amp; UDH Inspector
              </span>
              <span className="text-[11px] font-mono text-black/50">SMPP v3.4 / v5.0 &amp; MAP-MO/MT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Sender CLI</label>
                    <input
                      type="text"
                      value={testSmsPayload.sender}
                      onChange={(e) => setTestSmsPayload({ ...testSmsPayload, sender: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-black/20 rounded-[2px] bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Recipient MSISDN</label>
                    <input
                      type="text"
                      value={testSmsPayload.recipient}
                      onChange={(e) => setTestSmsPayload({ ...testSmsPayload, recipient: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-black/20 rounded-[2px] bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">SMS Body Text</label>
                  <textarea
                    rows={2}
                    value={testSmsPayload.body}
                    onChange={(e) => setTestSmsPayload({ ...testSmsPayload, body: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-black/20 rounded-[2px] bg-white"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-black">
                    <input
                      type="checkbox"
                      checked={testSmsPayload.hasSimjackerUdh}
                      onChange={(e) => setTestSmsPayload({ ...testSmsPayload, hasSimjackerUdh: e.target.checked })}
                      className="rounded-[2px]"
                    />
                    <span>Attach Malicious 0x7F SIM Toolkit UDH Header (Simjacker Attack)</span>
                  </label>

                  <button
                    onClick={handleInspectSms}
                    className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-[2px] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" /> Inspect SMS
                  </button>
                </div>
              </div>

              {/* Inspection Output */}
              <div className="bg-black text-white p-4 rounded-[2px] font-mono text-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase text-zinc-400 font-bold mb-2">Live Inspection Verdict</div>
                  {smsInspectResult ? (
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-[2px] text-zinc-200 leading-relaxed text-[11px]">
                      {smsInspectResult}
                    </div>
                  ) : (
                    <div className="text-zinc-500 py-6 text-center">Click &apos;Inspect SMS&apos; to trigger deep inspection.</div>
                  )}
                </div>

                <div className="text-[10px] text-zinc-500 pt-3 border-t border-zinc-800 flex justify-between">
                  <span>FastText Latency: 2.1ms</span>
                  <span>Home Routing Token: V-IMSI-KE-99042</span>
                </div>
              </div>
            </div>
          </div>

          {/* SMS Firewall Logs */}
          <div className="border border-black/15 rounded-[2px] overflow-hidden bg-white">
            <div className="p-3.5 bg-zinc-100 border-b border-black/15 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Recent SMS Firewall Interceptions
              </span>
              <span className="text-[10px] font-mono text-black/50">P99 SLA &lt; 5.0ms</span>
            </div>

            <div className="divide-y divide-black/10">
              {smsEvents.map((ev) => (
                <div key={ev.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-black">{ev.protocol}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold ${
                          ev.threatClass === 'SIMJACKER_0x7F'
                            ? 'bg-red-600 text-white'
                            : ev.threatClass === 'SMISHING_URL'
                            ? 'bg-amber-600 text-white'
                            : 'bg-zinc-800 text-white'
                        }`}
                      >
                        {ev.threatClass}
                      </span>
                      <span className="text-xs text-black/60 font-mono">
                        {ev.senderCli} → {ev.recipientMsisdn}
                      </span>
                    </div>
                    {ev.smishingUrlDetected && (
                      <div className="text-xs text-red-600 font-mono">Smishing URL: {ev.smishingUrlDetected}</div>
                    )}
                    <div className="text-[11px] font-mono text-black/50">UDH Hex: {ev.udhHeaderHex}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 bg-zinc-100 border border-black/20 text-black font-mono text-xs font-bold rounded-[2px]">
                      {ev.actionTaken}
                    </span>
                    <div className="text-[10px] font-mono text-emerald-600 mt-1">
                      Inference: {ev.inferenceLatencyMs}ms (&lt; 5.0ms)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: STIR/SHAKEN VOICE ATTESTATION & DNO */}
      {activeTab === 'stir_shaken' && (
        <div className="space-y-6">
          {/* Architecture Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">STI-AS (Authentication Service)</div>
              <div className="text-xl font-bold font-mono mt-1 text-black">PASSporT X.509 Signing</div>
              <p className="text-xs text-black/70 mt-1">
                Signs outbound SIP INVITE headers with ES256 PASSporT JWT tokens across Attestation A, B, and C tiers.
              </p>
            </div>

            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">STI-VS (Verification Service)</div>
              <div className="text-xl font-bold font-mono mt-1 text-emerald-600">Redis Cache Hit 99.8%</div>
              <p className="text-xs text-black/70 mt-1">
                Verifies RFC 8224 Identity headers with local certificate chain resolution in 0.3ms.
              </p>
            </div>

            <div className="p-4 bg-white border border-black/15 rounded-[2px]">
              <div className="text-xs font-bold uppercase tracking-wider text-black/60">Do-Not-Originate (DNO) Registry</div>
              <div className="text-xl font-bold font-mono mt-1 text-red-600">Zero-Tolerance Drop</div>
              <p className="text-xs text-black/70 mt-1">
                Rejects spoofed CLI matching emergency shortcodes (112, 999, 911) and bank hotlines without SIP INVITE pass-through.
              </p>
            </div>
          </div>

          {/* Interactive STIR/SHAKEN Verifier */}
          <div className="bg-zinc-50 border border-black/15 p-5 rounded-[2px]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                STIR/SHAKEN Calling CLI Verification &amp; DNO Test
              </span>
              <span className="text-[11px] font-mono text-black/50">RFC 8224 / ATIS-1000074</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">
                      Inbound Calling CLI (Try &apos;112&apos; or &apos;+254 722...&apos;)
                    </label>
                    <input
                      type="text"
                      value={testCli}
                      onChange={(e) => setTestCli(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-black/20 rounded-[2px] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-black/60 block mb-1">Called Party</label>
                    <input
                      type="text"
                      value={testCalledParty}
                      onChange={(e) => setTestCalledParty(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-mono border border-black/20 rounded-[2px] bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-100 rounded-[2px] text-xs space-y-1 text-black/70">
                  <div className="font-semibold text-black">Attestation Hierarchy:</div>
                  <div>• <strong>Attestation A (Full):</strong> Customer authenticated, authorized to use E.164 number.</div>
                  <div>• <strong>Attestation B (Partial):</strong> Customer authenticated, but number is third-party PBX pool.</div>
                  <div>• <strong>Attestation C (Gateway):</strong> International peering ingress without direct subscriber proof.</div>
                </div>

                <button
                  onClick={handleVerifyCli}
                  className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-bold rounded-[2px] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" /> Execute STI-VS Verification
                </button>
              </div>

              {/* Feedback */}
              <div className="bg-black text-white p-4 rounded-[2px] font-mono text-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase text-zinc-400 font-bold mb-2">STI-VS Attestation Verdict</div>
                  {verificationFeedback ? (
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-[2px] text-zinc-200 text-[11px] leading-relaxed">
                      {verificationFeedback}
                    </div>
                  ) : (
                    <div className="text-zinc-500 py-6 text-center">Test a CLI to verify against DNO and PASSporT cache.</div>
                  )}
                </div>

                <div className="text-[10px] text-zinc-500 pt-3 border-t border-zinc-800 flex justify-between">
                  <span>DNO Registry Hash: SHA256:dno-afr-v9</span>
                  <span>Cache Latency: 0.3ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* STIR/SHAKEN Call Logs */}
          <div className="border border-black/15 rounded-[2px] overflow-hidden bg-white">
            <div className="p-3.5 bg-zinc-100 border-b border-black/15 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Real-Time SIP Identity &amp; PASSporT Verifications
              </span>
              <span className="text-[10px] font-mono text-black/50">P99 SLA &lt; 8.0ms</span>
            </div>

            <div className="divide-y divide-black/10">
              {calls.map((c) => (
                <div key={c.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-black">{c.serviceType}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold ${
                          c.attestationLevel === 'Attestation A (Full)'
                            ? 'bg-emerald-600 text-white'
                            : c.attestationLevel === 'Attestation B (Partial)'
                            ? 'bg-blue-600 text-white'
                            : c.attestationLevel === 'Attestation C (Gateway)'
                            ? 'bg-amber-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {c.attestationLevel}
                      </span>
                      <span className="text-xs text-black/60 font-mono">
                        {c.callingCli} → {c.calledParty}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-black/50 truncate max-w-2xl">
                      Call-ID: {c.sipCallId} | PASSporT: {c.passportTokenSignature.slice(0, 32)}...
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 font-mono text-xs font-bold rounded-[2px] ${
                        c.verdict.includes('VALID') || c.verdict.includes('SUCCESS')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {c.verdict}
                    </span>
                    <div className="text-[10px] font-mono text-black/50 mt-1">
                      Latency: {c.verificationLatencyMs}ms (&lt; 8.0ms)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB 4: IXP VOLUMETRIC SCRUBBING & EBPF/XDP */}
      {activeTab === 'ixp_scrubber' && (
        <div className="space-y-6">
          {/* Status Header */}
          <div className="bg-zinc-50 border border-black/15 p-4 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-black">
                  ANYCAST eBPF/XDP SCRUBBING FABRIC (NETFLOW V9 / IPFIX / SFLOW)
                </span>
              </div>
              <p className="text-xs text-black/60 mt-1">
                Ingests flow telemetry at Internet Exchange Points. Detects GTP-U tunnel floods, SIP reflection, or UDP storms
                and deploys automated BGP FlowSpec rules within 3.0 seconds.
              </p>
            </div>

            <button
              disabled={isInjectingGtpFlood}
              onClick={handleTriggerGtpFlood}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold rounded-[2px] transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" /> Simulate 40 Gbps GTP-U Flood
            </button>
          </div>

          {/* IXP Center Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ixpCenters.map((ixp) => (
              <div
                key={ixp.id}
                onClick={() => setSelectedIxp(ixp)}
                className={`p-4 border rounded-[2px] cursor-pointer transition ${
                  selectedIxp.id === ixp.id ? 'border-black bg-zinc-50 shadow-sm' : 'border-black/15 bg-white hover:bg-zinc-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-black">{ixp.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] font-bold ${
                      ixp.status === 'SCRUBBING_ACTIVE' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {ixp.status}
                  </span>
                </div>
                <div className="text-[11px] text-black/60 font-mono mt-1">{ixp.ixpLocation}</div>

                <div className="mt-3 space-y-1 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-black/50">Ingress:</span>
                    <span className="font-bold text-black">{ixp.ingressTrafficGbps.toFixed(1)} Gbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Attack Traffic:</span>
                    <span className={ixp.attackTrafficGbps > 2 ? 'text-red-600 font-bold' : 'text-emerald-600'}>
                      {ixp.attackTrafficGbps.toFixed(1)} Gbps
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">XDP Drops:</span>
                    <span className="text-black">{(ixp.xdpDropsPerSec / 1000000).toFixed(1)}M pkts/s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black/50">Convergence:</span>
                    <span className="text-emerald-600 font-bold">{ixp.mitigationConvergenceSec}s (&lt; 3.0s)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected IXP Deep Dive */}
          <div className="border border-black/15 rounded-[2px] bg-white p-5">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-black">
                  {selectedIxp.name} — Anycast Scrubbing Console
                </h3>
                <span className="text-xs text-black/60 font-mono">{selectedIxp.carrierInterconnect}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-black/60">Automated BGP FlowSpec:</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-[2px] ${
                    selectedIxp.bgpFlowSpecAnnounced ? 'bg-emerald-600 text-white' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {selectedIxp.bgpFlowSpecAnnounced ? 'ACTIVE ANNOUNCEMENT' : 'IDLE STANDBY'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 border border-black/10 rounded-[2px]">
                  <div className="text-[10px] uppercase font-bold text-black/50">Active FlowSpec Rule (GoBGP gRPC)</div>
                  <pre className="text-xs font-mono font-bold text-red-600 mt-1 whitespace-pre-wrap">
                    {selectedIxp.flowSpecRule}
                  </pre>
                </div>

                <div className="p-3 bg-zinc-50 border border-black/10 rounded-[2px]">
                  <div className="text-[10px] uppercase font-bold text-black/50">Mitigation Mechanism</div>
                  <p className="text-xs text-black/70 mt-1">
                    Ingress telemetry triggers GoBGP route server announcements within {selectedIxp.mitigationConvergenceSec}s.
                    The Linux NIC driver executes <code>xdp_gtpu_sip_scrubber</code> at ring buffer level, dropping packets
                    with zero memory allocation before the Linux TCP/IP stack.
                  </p>
                </div>
              </div>

              {/* eBPF Drop Counter Visual */}
              <div className="bg-black text-white p-4 rounded-[2px] font-mono text-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase text-zinc-400 font-bold mb-2">eBPF XDP Kernel Driver Drops</div>
                  <div className="text-2xl font-bold text-amber-400">
                    {(selectedIxp.xdpDropsPerSec / 1000000).toFixed(2)} Million pkts/sec
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    Active BPF map: <code>blacklist_flowspec_map</code> (65,536 hash buckets)
                  </p>
                </div>

                <div className="text-[10px] text-zinc-500 pt-3 border-t border-zinc-800 flex justify-between">
                  <span>NIC Hook: XDP_DRV (Zero-copy)</span>
                  <span>Target SLA: &lt; 3.0s (Live: {selectedIxp.mitigationConvergenceSec}s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TAB 5: HARDWARE OPTICAL BYPASS & SLA GUARDRAILS */}
      {activeTab === 'bypass_guardrails' && (
        <div className="space-y-6">
          {/* Strategic Overview */}
          <div className="bg-white border border-black/15 p-5 rounded-[2px]">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-black" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-black">
                Physical Optical Bypass Relays &amp; 50ms Fail-Safe Watchdogs
              </h2>
            </div>
            <p className="text-xs text-black/70 max-w-4xl">
              Deploys inline optical bypass relays on high-capacity peering trunks. Heartbeat monitors poll inspection nodes every
              10ms. Upon heartbeat loss, optical relays deflect mirrors within <strong>50ms</strong> into either
              <strong> Fail-Open</strong> (preserves voice and emergency 112 continuity) or <strong>Fail-Closed</strong> (locks down
              untrusted international peering trunks to stop zero-day signaling floods).
            </p>
          </div>

          {/* Relay Nodes Matrix */}
          <div className="border border-black/15 rounded-[2px] overflow-hidden bg-white">
            <div className="p-3.5 bg-zinc-100 border-b border-black/15 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                International Peering Trunk Optical Relays
              </span>
              <span className="text-[10px] font-mono text-black/50">Heartbeat Threshold: 50ms</span>
            </div>

            <div className="divide-y divide-black/10">
              {relays.map((relay) => (
                <div key={relay.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-black">{relay.name}</span>
                      <span className="text-[11px] font-mono text-black/50">({relay.peeringTrunk})</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold ${
                          relay.opticalMode === 'fail-open'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {relay.opticalMode.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-black/70 max-w-3xl">{relay.purpose}</p>
                    <div className="flex items-center gap-4 text-[11px] font-mono text-black/50 pt-1">
                      <span>Peering Partner: {relay.peeringPartner}</span>
                      <span className="text-emerald-600 font-semibold">Heartbeat: {relay.heartbeatMs}ms (&lt; 50ms)</span>
                      <span>Switch Speed: {relay.opticalSwitchTimeMs}ms</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleRelayMode(relay.id)}
                      className="px-3 py-1.5 text-xs font-mono font-bold border border-black/20 hover:bg-black hover:text-white rounded-[2px] transition cursor-pointer"
                    >
                      Toggle Mode ({relay.opticalMode})
                    </button>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-600 text-white rounded-[2px]">
                      {relay.relayState}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 6: AI SHADOW SPECIFICATION & GENERATED CODE ARTIFACTS */}
      {activeTab === 'ai_shadow_spec' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-zinc-50 border border-black/15 p-4 rounded-[2px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-black" />
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  AI Build Shadow Prop Artifacts (MOD-01-EDGE-DEFENSE)
                </span>
              </div>
              <p className="text-xs text-black/60 mt-1">
                Generated production services across Rust DPDK, Go 1.24, and Linux eBPF/XDP drivers.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyArtifactCode}
                className="px-3 py-1.5 bg-black hover:bg-zinc-800 text-white text-xs font-mono font-bold rounded-[2px] transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied Code!' : 'Copy Source Code'}
              </button>
            </div>
          </div>

          {/* Artifact Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-black/10 overflow-x-auto pb-1">
            {AI_SHADOW_ARTIFACTS.map((art, idx) => (
              <button
                key={art.path}
                onClick={() => setActiveArtifactIndex(idx)}
                className={`px-3 py-2 text-xs font-mono font-bold rounded-[2px] transition shrink-0 ${
                  activeArtifactIndex === idx
                    ? 'bg-black text-white'
                    : 'bg-zinc-100 text-black/70 hover:bg-zinc-200'
                }`}
              >
                {art.path.split('/').pop()}
              </button>
            ))}
          </div>

          {/* Active Artifact Card */}
          <div className="border border-black/15 rounded-[2px] bg-white overflow-hidden">
            <div className="p-4 bg-zinc-100 border-b border-black/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-black">{AI_SHADOW_ARTIFACTS[activeArtifactIndex].path}</span>
                <p className="text-xs text-black/70 mt-0.5">{AI_SHADOW_ARTIFACTS[activeArtifactIndex].responsibility}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono text-black/50 block">Latency Budget</span>
                <span className="text-xs font-mono font-bold text-emerald-600">
                  {AI_SHADOW_ARTIFACTS[activeArtifactIndex].latencyBudgetMicroseconds} µs
                </span>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto max-h-[500px]">
              <pre className="leading-relaxed">{AI_SHADOW_ARTIFACTS[activeArtifactIndex].code}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
