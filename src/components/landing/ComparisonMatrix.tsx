import React from 'react';
import { Check, X, ShieldAlert, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

interface ComparisonFeature {
  name: string;
  mandela: string | boolean;
  aggregators: string | boolean;
  hardware: string | boolean;
}

const FEATURES: ComparisonFeature[] = [
  {
    name: 'Direct Tier-1 Sovereign Telco Interconnect',
    mandela: 'Direct SMPP v5 & Anycast SIP',
    aggregators: '3 to 5 Middleman Aggregators',
    hardware: 'Manual E1/PRI TDM cards'
  },
  {
    name: 'African Native Languages IVR Pipeline',
    mandela: '50 Native Dialects (Swahili, Yoruba, etc.)',
    aggregators: 'English & French only',
    hardware: 'Pre-recorded static wav files'
  },
  {
    name: 'Average OTP Delivery Latency in Africa',
    mandela: '3.2 to 4.2 seconds (P99)',
    aggregators: '14 to 45 seconds',
    hardware: 'N/A (No SMS engine)'
  },
  {
    name: 'Wholesale Pricing Model',
    mandela: 'Direct wholesale sovereign tariffs',
    aggregators: '200% to 350% aggregator markup',
    hardware: 'Heavy upfront CapEx ($250k+)'
  },
  {
    name: 'Data Sovereignty (AU Malabo Convention)',
    mandela: '100% In-Country Data Residency',
    aggregators: 'US / EU Cloud Shards',
    hardware: 'On-premises server rack'
  },
  {
    name: 'Direct-to-Device Satellite NTN (3GPP Rel-17)',
    mandela: 'Built-in (14 Ground Teleports)',
    aggregators: 'None (Terrestrial only)',
    hardware: 'Expensive VSAT hardware ($15k/mo)'
  },
  {
    name: 'Autonomous Subsea Cable BGP Failover',
    mandela: '<12ms (Equiano, WACS, 2Africa)',
    aggregators: 'Blackout or degraded routing',
    hardware: 'Manual engineer intervention'
  },
  {
    name: 'Real-Time SIP Packet Diagnostic (RTP PCAP)',
    mandela: '1-Click 30-sec Live Trace',
    aggregators: 'Ticket-based support (48h wait)',
    hardware: 'Requires local Wireshark probe'
  }
];

export const ComparisonMatrix: React.FC<{
  onLaunchConsole: (mode?: PortalMode) => void;
}> = ({ onLaunchConsole }) => {
  return (
    <section id="comparison" className="py-20 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400 mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>ARCHITECTURAL BENCHMARK</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Why Enterprise Leaders Choose Mandela.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300">
            Compare Mandela Connect directly against legacy global cloud aggregators and traditional on-premises telecom appliances.
          </p>
        </div>

        {/* Feature Comparison Table */}
        <div className="mt-12 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-slate-800 rounded-2xl bg-slate-950/80 shadow-2xl">
              <table className="min-w-full divide-y divide-slate-800 text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-900/90 text-slate-300">
                    <th scope="col" className="py-4.5 px-6 font-bold text-sm tracking-wider uppercase">
                      Capability / Architecture
                    </th>
                    <th scope="col" className="py-4.5 px-6 font-bold text-sm text-emerald-400 bg-emerald-950/20 border-x border-emerald-500/20 tracking-wider uppercase">
                      Mandela Connect OS
                    </th>
                    <th scope="col" className="py-4.5 px-6 font-bold text-sm text-slate-400 tracking-wider uppercase">
                      Global Aggregators (Twilio, Infobip)
                    </th>
                    <th scope="col" className="py-4.5 px-6 font-bold text-sm text-slate-400 tracking-wider uppercase">
                      Legacy PBX Hardware (Cisco)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {FEATURES.map((feat, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/30'}
                    >
                      <td className="py-4 px-6 font-sans font-semibold text-white text-xs sm:text-sm">
                        {feat.name}
                      </td>
                      <td className="py-4 px-6 text-emerald-300 font-bold bg-emerald-950/15 border-x border-emerald-500/20 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{feat.mandela}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        <div className="flex items-center gap-2">
                          <X className="w-3.5 h-3.5 text-rose-400/80 shrink-0" />
                          <span>{feat.aggregators}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-400 text-xs">
                        <div className="flex items-center gap-2">
                          <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{feat.hardware}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-base text-white">
              Ready to eliminate middleman markups?
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Migrate your traffic in under 48 hours without zero downtime.
            </div>
          </div>
          <button
            onClick={() => onLaunchConsole('enterprise_suite')}
            className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 whitespace-nowrap"
          >
            <span>Launch Migration Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
