import React, { useState } from 'react';
import { Building2, CreditCard, Radio, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

interface IndustrySolution {
  id: string;
  tabLabel: string;
  icon: React.ReactNode;
  headline: string;
  description: string;
  keyOutcomes: string[];
  metrics: { value: string; label: string }[];
  caseSnippet: string;
}

const SOLUTIONS: IndustrySolution[] = [
  {
    id: 'mno',
    tabLabel: 'MNOs & MVNOs',
    icon: <Building2 className="w-4 h-4 text-emerald-400" />,
    headline: 'Carrier Interconnect, Least-Cost Routing & Roaming Offload',
    description: 'Transform legacy circuit-switched infrastructure into cloud-native Anycast SIP SBCs. Arbitrate 100+ carrier rate decks with automated grey route quarantine and SS7 signaling firewall protection.',
    keyOutcomes: [
      'Eliminate 30% aggregator margin leaks with direct wholesale routing',
      'Kamailio + FreeSWITCH carrier SBC cluster handling 10,000+ CPS',
      'Autonomous subsea BGP cable failover (WACS, Equiano, 2Africa) in <12ms',
      'GSMA PRD IR.21 and sovereign number portability (MNP) compliance'
    ],
    metrics: [
      { value: '+34%', label: 'Terminating Wholesale Margin' },
      { value: '10,000', label: 'Concurrent Calls / Sec' },
      { value: '99.999%', label: 'Carrier Core Uptime SLA' }
    ],
    caseSnippet: 'Powering tier-1 mobile operators across Kenya, Nigeria, and South Africa with carrier-grade trunking.'
  },
  {
    id: 'fintech',
    tabLabel: 'Fintechs & Neobanks',
    icon: <CreditCard className="w-4 h-4 text-cyan-400" />,
    headline: 'High-Velocity OTPs, Session USSD & Anti-SIM-Swap Defense',
    description: 'Stop losing transaction conversion to delayed 2-minute OTPs. Mandela Connect delivers direct Tier-1 SMPP v5 binds with 4.2-second delivery SLAs, session-stateful USSD banking menus (*992#), and cryptographic SIM-swap verification.',
    keyOutcomes: [
      'Sub-4.2s OTP delivery SLA directly over local mobile operator SMSCs',
      'Zero-hops USSD gateway for offline unbanked population banking',
      'Real-time IMSI and SIM-swap detection API before dispatching high-value OTPs',
      'PCI-DSS Level 1 certified signaling architecture with mTLS 1.3 encryption'
    ],
    metrics: [
      { value: '4.2s', label: 'P99 OTP Delivery Time' },
      { value: '99.8%', label: 'First-Attempt Conversion' },
      { value: '0 ms', label: 'Middleman Aggregator Latency' }
    ],
    caseSnippet: 'Securing millions of daily transactions for pan-African payment processors, wallets, and neo-banking leaders.'
  },
  {
    id: 'mining',
    tabLabel: 'Mining, Logistics & Energy',
    icon: <Radio className="w-4 h-4 text-purple-400" />,
    headline: 'Off-Grid Satellite NTN & Remote Concession Telemetry',
    description: 'Connect open-pit mines, deep exploration shafts, oil rigs, and cross-border trucking fleets outside cellular coverage. Mandela Satellite NTN delivers 3GPP Rel-17 direct-to-device connectivity through 14 sovereign African teleports.',
    keyOutcomes: [
      'Direct sensor-to-satellite telemetry without installing satellite dishes',
      'Doppler-stabilized LEO constellation links with automated beam handover',
      'Autonomous emergency SOS beacon dispatch across remote wilderness',
      'Sovereign edge caching for telemetry during intermittent solar power cycles'
    ],
    metrics: [
      { value: '100%', label: 'African Landmass Coverage' },
      { value: '14', label: 'Sovereign Ground Teleports' },
      { value: '<45ms', label: 'NTN Uplink Processing' }
    ],
    caseSnippet: 'Monitoring remote extraction sites in the Copperbelt and Sahara pipeline networks with zero blackout zones.'
  },
  {
    id: 'government',
    tabLabel: 'Governments & Regulators',
    icon: <Shield className="w-4 h-4 text-amber-400" />,
    headline: 'Sovereign Number Registry, STIR/SHAKEN & Emergency Alerting',
    description: 'Empower telecommunications regulatory authorities with centralized E.164 number inventory, real-time mobile number portability clearinghouses, cryptographic caller identity attestation, and national cell broadcast emergency alerts.',
    keyOutcomes: [
      'Centralized National Numbering Management System (NMS) with eSIM cryptographic attestation',
      'STIR/SHAKEN cryptographic caller ID verification to eradicate cross-border voice fraud',
      'High-throughput emergency Cell Broadcast (CAP) reaching 50 million citizens in seconds',
      'Strict adherence to African Union Malabo Convention on data sovereignty'
    ],
    metrics: [
      { value: '54', label: 'Sovereign Jurisdictions' },
      { value: '100%', label: 'In-Country Data Sovereignty' },
      { value: 'SHA-256', label: 'Immutable Audit Ledger' }
    ],
    caseSnippet: 'Chosen by sovereign telecommunications regulators to modernize national spectrum and numbering inventories.'
  }
];

export const SolutionsByIndustry: React.FC<{
  onLaunchConsole: (mode?: PortalMode) => void;
}> = ({ onLaunchConsole }) => {
  const [activeTab, setActiveTab] = useState<string>('mno');
  const solution = SOLUTIONS.find((s) => s.id === activeTab) || SOLUTIONS[0];

  return (
    <section id="solutions" className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>SOLUTIONS BY INDUSTRY</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
            Engineered for Africa’s Toughest Infrastructure Demands.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Whether terminating billions of call minutes, safeguarding banking transactions, or connecting remote mining concessions, Mandela delivers sovereign reliability.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2">
          {SOLUTIONS.map((s) => {
            const isActive = s.id === activeTab;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(s.id)}
                className={`p-4 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-slate-800/80">{s.icon}</span>
                  <span className="font-bold text-sm">{s.tabLabel}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Solution Detail Card */}
        <div className="mt-6 p-8 rounded-2xl bg-slate-900/80 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {solution.tabLabel} ARCHITECTURE
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-2">
                {solution.headline}
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
                {solution.description}
              </p>
            </div>

            <div className="space-y-2.5">
              {solution.keyOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => onLaunchConsole('enterprise_suite')}
                className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <span>Launch {solution.tabLabel} Environment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Quantitative Proof Metrics */}
          <div className="lg:col-span-5 bg-slate-950/90 border border-slate-800 rounded-xl p-6 space-y-6">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              QUANTIFIED ENTERPRISE BENCHMARKS
            </div>

            <div className="grid grid-cols-1 gap-4">
              {solution.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="text-2xl font-black text-white font-mono tabular-nums">
                    {m.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 font-mono italic border-t border-slate-800">
              &quot;{solution.caseSnippet}&quot;
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
