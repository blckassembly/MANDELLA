import React, { useState } from 'react';
import { 
  Server, 
  Layers, 
  Radio, 
  PhoneCall, 
  MessageSquare, 
  Database, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Sliders, 
  Cpu, 
  Terminal 
} from 'lucide-react';
import { EnterpriseProduct } from '../../types/multiTenant';

interface TourPillar {
  id: string;
  targetProduct: EnterpriseProduct;
  title: string;
  shortLabel: string;
  tagline: string;
  icon: React.ReactNode;
  specs: string[];
  capabilities: { title: string; desc: string }[];
  simulationData: {
    badge: string;
    primaryMetric: string;
    primaryMetricLabel: string;
    secondaryMetric: string;
    secondaryMetricLabel: string;
    consolePreviewTitle: string;
    consoleLogs: string[];
  };
}

const PILLARS: TourPillar[] = [
  {
    id: 'sbc_core',
    targetProduct: 'sbc_core',
    title: 'System 4: Carrier-Grade SBC & Anycast SIP Core',
    shortLabel: '01. SBC Core',
    tagline: 'Kamailio + FreeSWITCH + RTPEngine mesh delivering 10,000 CPS across 6 African PoPs with real-time SIP ladder traces.',
    icon: <Server className="w-5 h-5 text-emerald-400" />,
    specs: ['Kamailio 5.7 Anycast', 'RTPEngine JitterBuffer', '10,000 CPS Capacity', 'SIP Packet Diagnostic (RTP PCAP)'],
    capabilities: [
      {
        title: '30-Second Packet Diagnostic',
        desc: 'Capture real-time SIP signaling and RTP packet traces with raw hex headers, codec negotiation, and jitter telemetry.'
      },
      {
        title: 'Dynamic SIP Header Manipulation',
        desc: 'Inject P-Asserted-Identity, Privacy, and custom carrier diversion headers on ingress and egress trunks.'
      },
      {
        title: 'Autonomous PoP Drain & Scale',
        desc: 'Instantly drain degraded points of presence in Lagos or Nairobi and re-route live dialogues in <25ms.'
      }
    ],
    simulationData: {
      badge: 'POP MESH STATUS: 6 / 6 HEALTHY',
      primaryMetric: '10,420 CPS',
      primaryMetricLabel: 'PEAK CALL CONCURRENCY',
      secondaryMetric: '0.002%',
      secondaryMetricLabel: 'PACKET JITTER LOSS',
      consolePreviewTitle: 'KAMAILIO_ANYCAST_CORE // LIVE SIP TRACE',
      consoleLogs: [
        'INVITE sip:+2348030012@sbc.lagos.mandela.net SIP/2.0 (TLS 1.3)',
        '100 Trying - RTPEngine allocated port 19024 [G.711a]',
        '180 Ringing - Transit carrier acknowledged B-leg legId: #7821',
        '200 OK - Active 2-way RTP media session locked (MOS: 4.41)'
      ]
    }
  },
  {
    id: 'interconnect',
    targetProduct: 'interconnect',
    title: 'Carrier Interconnect & Least-Cost Routing (LCRq)',
    shortLabel: '02. Interconnect & LCR',
    tagline: 'Algorithmic rate-deck arbitration across 100+ global and pan-African carriers with automated grey-route quarantine.',
    icon: <Layers className="w-5 h-5 text-cyan-400" />,
    specs: ['Sub-millisecond route decisions', 'Automated margin protection', 'Grey route auto-isolation', '100+ Live Rate Decks'],
    capabilities: [
      {
        title: 'Real-Time Rate Engine (LCRq)',
        desc: 'Arbitrate lowest cost per second while enforcing minimum Quality of Service (QoS) and ASR thresholds.'
      },
      {
        title: 'Anti-Grey-Route Shield',
        desc: 'Heuristics immediately quarantine leaky SIM-boxes, CLI spoofers, and uncertified VoIP bypass routes.'
      },
      {
        title: 'Instant Rate Deck Ingestion',
        desc: 'Upload CSV rate sheets and recalculate pan-African termination margins in under 4 seconds.'
      }
    ],
    simulationData: {
      badge: 'LCR ROUTING ENGINE // 100+ CARRIERS',
      primaryMetric: '+$142,800',
      primaryMetricLabel: 'MONTHLY MARGIN RETAINED',
      secondaryMetric: '0.84ms',
      secondaryMetricLabel: 'LCR DECISION LATENCY',
      consolePreviewTitle: 'RATE_ARBITRATOR // ROUTING MATRIX',
      consoleLogs: [
        'Ingress call to +254 (Kenya Mobile Safaricom)',
        'Carrier Deck A: $0.0182 (ASR: 78%) -> REJECTED (Quality threshold)',
        'Carrier Deck B: $0.0134 (ASR: 94%) -> SELECTED (Primary Tier-1)',
        'Route verified: Margin +24.6% locked on bilateral trunk'
      ]
    }
  },
  {
    id: 'satellite_ntn',
    targetProduct: 'satellite_ntn',
    title: 'Satellite NTN & Orbital Teleport Gateway',
    shortLabel: '03. Satellite NTN',
    tagline: '3GPP Rel-17 non-terrestrial network (NTN) integration providing direct-to-device and off-grid remote telemetry.',
    icon: <Radio className="w-5 h-5 text-purple-400" />,
    specs: ['3GPP Release 17 NTN', 'Doppler Shift Compensation', '14 African Ground Teleports', 'LEO & GEO Direct Link'],
    capabilities: [
      {
        title: 'Direct-to-Device (D2D)',
        desc: 'Standard smartphones and IoT sensors connect directly to low-Earth orbit satellites without dedicated ground hardware.'
      },
      {
        title: 'Doppler Shift Phase-Lock',
        desc: 'Autonomous orbital ephemeris compensation for high-velocity LEO satellites crossing the equator.'
      },
      {
        title: 'Off-Grid Mining & Maritime',
        desc: 'Zero blind spots across Sahara, Congo Basin, Rift Valley, and South Atlantic maritime shipping corridors.'
      }
    ],
    simulationData: {
      badge: 'LEO CONSTELLATION: 18 BIRDS IN VIEW',
      primaryMetric: '550 km',
      primaryMetricLabel: 'ORBITAL ALTITUDE',
      secondaryMetric: '38.4 ms',
      secondaryMetricLabel: 'NTN FEEDER LATENCY',
      consolePreviewTitle: 'TELEPORT_TRACKER // HARARE_GROUND_STATION',
      consoleLogs: [
        'Acquiring LEO-MND-09 azimuth: 142.4° elevation: 68.2°',
        'Phase-lock loop locked: Doppler offset -34.2 kHz normalized',
        'Ingesting 1,480 remote IoT telemetry packets from Katanga Copper Belt',
        'Ephemeris next pass handover scheduled in 04:12 mins'
      ]
    }
  },
  {
    id: 'voice_ivr',
    targetProduct: 'voice_ivr',
    title: 'System 3: Consumer Voice & 50 African Languages IVR',
    shortLabel: '04. African Voice IVR',
    tagline: 'Sub-150ms speech-to-speech neural pipeline with deep acoustic models for native African dialects.',
    icon: <PhoneCall className="w-5 h-5 text-amber-400" />,
    specs: ['50 Native Dialects', 'FreeSWITCH Media Cluster', 'Sub-150ms Audio Latency', 'Drag-and-Drop Visual IVR'],
    capabilities: [
      {
        title: 'Native African Acoustic Models',
        desc: 'Trained on 100,000+ hours of localized speech in Swahili, Yoruba, Amharic, Hausa, Zulu, Igbo, and Wolof.'
      },
      {
        title: 'Visual Multi-Language IVR Flow Builder',
        desc: 'Design branched voice workflows with dynamic speech synthesis, DTMF failback, and payment verification.'
      },
      {
        title: 'Real-Time Sentiment & Dialect Detection',
        desc: 'Automatically detect caller language in first 1.2 seconds and route to specialized native voice agents.'
      }
    ],
    simulationData: {
      badge: 'NEURAL SPEECH PIPELINE // 50 DIALECTS',
      primaryMetric: '138 ms',
      primaryMetricLabel: 'SPEECH-TO-SPEECH LATENCY',
      secondaryMetric: '97.4%',
      secondaryMetricLabel: 'DIALECT ACCURACY (SWAHILI/YORUBA)',
      consolePreviewTitle: 'FREESWITCH_MEDIA // NEURAL_ASR_TTS',
      consoleLogs: [
        'Caller connected from Dar es Salaam (+255)',
        'Acoustic model detected: Coastal Swahili (Confidence: 99.1%)',
        'Synthesizing prompt: "Karibu! Bonyeza moja kwa salio..."',
        'Streaming RTP audio packet sequence: 16kHz Opus clean stream'
      ]
    }
  },
  {
    id: 'messaging_sms',
    targetProduct: 'messaging_sms',
    title: 'System 2: Sovereign SMS & USSD Messaging Gateway',
    shortLabel: '05. SMS & USSD Gateway',
    tagline: 'High-throughput direct SMPP v5 binds delivering OTPs in 4.2 seconds with native USSD session menus.',
    icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
    specs: ['Direct SMPP v5 binds', 'Native USSD over SIGTRAN', '99.8% 4.2s Delivery SLA', 'Smart Unicode UCS-2 GSM 03.38'],
    capabilities: [
      {
        title: 'Direct Tier-1 Telco Binds',
        desc: 'Bypasses multi-hop international aggregator middlemen to eliminate delivery drops and 12-second OTP delays.'
      },
      {
        title: 'USSD Banking Menu Engine',
        desc: 'Session-stateful USSD menus (*992#) running over SIGTRAN SS7/Diameter with 200ms turnaround.'
      },
      {
        title: 'Carrier Quality & PDU Inspector',
        desc: 'Inspect raw SMPP Protocol Data Units (SUBMIT_SM, SUBMIT_SM_RESP, DELIVER_SM) in real time.'
      }
    ],
    simulationData: {
      badge: 'SMPP v5 CARRIER BINDS: 48 ACTIVE',
      primaryMetric: '3.8 sec',
      primaryMetricLabel: 'P99 OTP DELIVERY TIME',
      secondaryMetric: '99.82%',
      secondaryMetricLabel: 'FIRST-ATTEMPT DELIVERY RATE',
      consolePreviewTitle: 'SMPP_TRANSMITTER // PDU INSPECTOR',
      consoleLogs: [
        'PDU [submit_sm] seq: #91024 dest: +2348021110000 source: ECOBANK',
        'Direct SMPP v5 session over TLS to MTN Nigeria SMSC',
        'Receipt [submit_sm_resp] command_status: ESME_ROK',
        'Delivery Receipt (DLR) received: DELIVRD in 3.4 seconds'
      ]
    }
  },
  {
    id: 'dataverse',
    targetProduct: 'dataverse',
    title: 'System 07: MANDELA Sovereign Dataverse & Lakehouse',
    shortLabel: '06. Sovereign Dataverse',
    tagline: 'Strict multi-tenant data residency, schema designer, and distributed Change Data Capture (CDC) pipelines.',
    icon: <Database className="w-5 h-5 text-blue-400" />,
    specs: ['Zero-Trust Multi-Tenancy', 'Schema Evolution & RBAC', 'Cryptographic Audit Trail', 'CDC Event Pipeline'],
    capabilities: [
      {
        title: 'Pan-African Sovereign Data Residency',
        desc: 'Guarantees sovereign customer data never leaves African borders, complying with AU Malabo Convention.'
      },
      {
        title: 'Dynamic Dataverse Schema Designer',
        desc: 'Define custom entity attributes, one-to-many relationships, and role-based access rules without migrations.'
      },
      {
        title: 'Tamper-Evident SHA-256 Audit Stream',
        desc: 'Every schema mutation, record query, and export is hashed into an immutable append-only ledger.'
      }
    ],
    simulationData: {
      badge: 'DATAVERSE RESIDENCY: 54 JURISDICTIONS',
      primaryMetric: '1.2 PB',
      primaryMetricLabel: 'SOVEREIGN DATA STORED',
      secondaryMetric: '100%',
      secondaryMetricLabel: 'IN-COUNTRY RESIDENCY COMPLIANCE',
      consolePreviewTitle: 'DATAVERSE_FABRIC // CDC EVENT PIPELINE',
      consoleLogs: [
        'Tenant: ECOBANK_NG schema: customer_verified_lines',
        'Write mutation recorded: UUID #f92a10c8 (SHA256 verified)',
        'CDC event published: Kafka topic [dataverse.mutations.ng]',
        'Zero-trust validation: AU Malabo Convention rule passed'
      ]
    }
  }
];

export const InteractiveProductTour: React.FC<{
  onLaunchPillarConsole: (product: EnterpriseProduct) => void;
}> = ({ onLaunchPillarConsole }) => {
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);
  const pillar = PILLARS[activePillarIndex];

  return (
    <section id="tour" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>INTERACTIVE ARCHITECTURE TOUR</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
            Six Pillars of Sovereign Telecom Engineering.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Explore the deep technical architecture powering pan-African telecom operators, multinational fintechs, and national emergency backbones.
          </p>
        </div>

        {/* Pillar Navigation Tabs */}
        <div className="mt-10 flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-800 scrollbar-none">
          {PILLARS.map((p, idx) => {
            const isActive = idx === activePillarIndex;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillarIndex(idx)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-800 text-white border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Pillar Showcase Grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Specs & Deep Dive (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{pillar.simulationData.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                {pillar.tagline}
              </p>
            </div>

            {/* Spec Highlights */}
            <div className="flex flex-wrap gap-2">
              {pillar.specs.map((spec, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{spec}</span>
                </span>
              ))}
            </div>

            {/* Deep Technical Capabilities */}
            <div className="space-y-4 pt-2">
              {pillar.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-mono text-xs">0{i + 1}.</span>
                    <span>{cap.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed pl-6">
                    {cap.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Pillar Action: Jump to Console */}
            <div className="pt-2">
              <button
                onClick={() => onLaunchPillarConsole(pillar.targetProduct)}
                className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <span>Launch {pillar.shortLabel.split('. ')[1]} in Operating Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Live Simulation Box (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono font-medium">
                  {pillar.simulationData.primaryMetricLabel}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono mt-1 tabular-nums">
                  {pillar.simulationData.primaryMetric}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-xs text-slate-400 font-mono font-medium">
                  {pillar.simulationData.secondaryMetricLabel}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono mt-1 tabular-nums">
                  {pillar.simulationData.secondaryMetric}
                </div>
              </div>
            </div>

            {/* Live Interactive Telemetry Console View */}
            <div className="mt-6">
              <div className="flex items-center justify-between pb-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{pillar.simulationData.consolePreviewTitle}</span>
                </span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LIVE</span>
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2.5 text-slate-300">
                {pillar.simulationData.consoleLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span className="leading-relaxed break-words">{log}</span>
                  </div>
                ))}
              </div>

              {/* Sub-footer metadata */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>ENCRYPTION: mTLS 1.3 / SRTP</span>
                <span className="text-slate-400">SOVEREIGN TELECOM CORE v4.8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
