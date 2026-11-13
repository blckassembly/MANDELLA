import React from 'react';
import { Quote, TrendingUp, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

interface CaseStudy {
  client: string;
  category: string;
  headline: string;
  quote: string;
  author: string;
  role: string;
  stats: { value: string; label: string }[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'Pan-African Fintech FlutterFlow',
    category: 'Payments & Neobanking',
    headline: 'Reduced OTP Latency from 18.4s to 3.4s Across 14 Sovereign Nations',
    quote: 'Before Mandela Connect, our auth OTPs were hopping through aggregators in Europe before landing back in Lagos and Nairobi. Dropped transactions were our biggest churn vector. Mandela’s direct SMPP binds cut our delivery latency by 81% and saved us $180,000 every single month.',
    author: 'Adebayo Ogunlesi',
    role: 'VP of Platform Engineering',
    stats: [
      { value: '-81%', label: 'OTP Delivery Latency' },
      { value: '+$2.1M', label: 'Annual Cost Saved' },
      { value: '99.82%', label: 'Conversion Success' }
    ]
  },
  {
    client: 'StarCell Sovereign Telecom',
    category: 'Tier-1 Mobile Operator',
    headline: 'Scaled Carrier SBC to 12,000 CPS with Zero-Downtime Subsea Failover',
    quote: 'When the WACS subsea fiber was cut off the coast of West Africa, Mandela’s autonomous LCR routing engine rerouted 10,000 simultaneous voice dialogues onto the Equiano cable in under 12 milliseconds. Our subscribers never noticed a single glitch.',
    author: 'Fatima El-Mansouri',
    role: 'Chief Network Officer',
    stats: [
      { value: '12,000', label: 'Active Call Concurrency' },
      { value: '<12ms', label: 'Subsea Cable Failover' },
      { value: '4.41', label: 'Mean Opinion Score (MOS)' }
    ]
  },
  {
    client: 'AngloSahara Extraction Logistics',
    category: 'Mining & Heavy Industry',
    headline: 'Direct-to-Device Satellite NTN Telemetry Across Off-Grid Sahara Corridor',
    quote: 'Operating across thousands of kilometers of desert with zero cellular towers used to require bulky $15,000 satellite antennas per vehicle. Mandela’s 3GPP Rel-17 NTN allows standard asset trackers to uplink straight to LEO satellites and stream real-time telemetry.',
    author: 'Kwame Mensah',
    role: 'Director of Remote Operations',
    stats: [
      { value: '100%', label: 'Concession Land Coverage' },
      { value: '420+', label: 'Heavy Vehicles Connected' },
      { value: '0', label: 'Cellular Towers Needed' }
    ]
  }
];

export const CaseStudyShowcase: React.FC<{
  onLaunchConsole: (mode?: PortalMode) => void;
}> = ({ onLaunchConsole }) => {
  return (
    <section className="py-20 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>ENTERPRISE PROOF POINTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
            Proven at Pan-African Scale.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Read how regulated financial institutions and tier-1 mobile network operators modernized their core signaling infrastructure with Mandela.
          </p>
        </div>

        {/* Case Study Cards */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((cs, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wide">
                    {cs.category}
                  </span>
                  <Quote className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mt-3">
                  {cs.headline}
                </h3>

                <p className="mt-4 text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  &quot;{cs.quote}&quot;
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <div className="font-bold text-xs text-white">{cs.author}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{cs.role} · {cs.client}</div>
                </div>
              </div>

              {/* Quantified Metrics Box */}
              <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center font-mono">
                {cs.stats.map((s, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <div className="text-sm sm:text-base font-extrabold text-emerald-400 tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-[9px] text-slate-400 uppercase tracking-tight mt-0.5 truncate">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
