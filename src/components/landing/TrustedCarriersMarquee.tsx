import React from 'react';
import { ShieldCheck, Network, Radio, Server } from 'lucide-react';

interface CarrierPartner {
  name: string;
  region: string;
  protocol: string;
  metric: string;
}

const CARRIERS: CarrierPartner[] = [
  { name: 'Safaricom', region: 'East Africa', protocol: 'Direct SMPP v5', metric: '3.1s OTP P99' },
  { name: 'MTN Group', region: 'Pan-Africa', protocol: 'SIGTRAN SS7 / Diameter', metric: '290M Subscribers' },
  { name: 'Vodacom', region: 'Southern Africa', protocol: 'BGP Anycast PoP', metric: '10,000 CPS SIP' },
  { name: 'Ecobank', region: '33 Sovereign Nations', protocol: 'PCI-DSS Direct Trunk', metric: '$2.4B Monthly Volume' },
  { name: 'Flutterwave', region: 'Fintech Rail', protocol: 'Sub-100ms API Webhook', metric: '99.99% Uptime' },
  { name: 'Orange', region: 'West & Central', protocol: 'Direct Tier-1 Trunk', metric: '42 PoPs Interconnect' },
  { name: 'Standard Bank', region: 'Banking Core', protocol: 'mTLS Private Leased Line', metric: 'Zero-Trust Enclave' },
  { name: 'Airtel Africa', region: '14 Nations', protocol: 'Direct SMPP bind', metric: '4.2s Delivery SLA' },
  { name: 'Telecom Egypt', region: 'North Africa / Red Sea', protocol: 'Subsea Cable Landing', metric: 'Equiano & 2Africa' }
];

export const TrustedCarriersMarquee: React.FC = () => {
  return (
    <section className="border-y border-slate-800/80 bg-slate-950/70 py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400 font-semibold tracking-wider uppercase flex items-center gap-2">
              <Network className="w-3.5 h-3.5" />
              <span>DIRECT TIER-1 INTERCONNECT NETWORK</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
              Zero Intermediaries. Direct Binds to Sovereign Telcos & Regulated Banks.
            </h2>
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>9 Direct MNO Peering Fabrics</span>
          </div>
        </div>
      </div>

      {/* Marquee Card Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CARRIERS.slice(0, 5).map((carrier, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {carrier.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{carrier.region}</div>
              <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{carrier.protocol}</span>
                <span className="text-cyan-400 font-semibold">{carrier.metric}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {CARRIERS.slice(5).map((carrier, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {carrier.name}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{carrier.region}</div>
              <div className="mt-3 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400">{carrier.protocol}</span>
                <span className="text-cyan-400 font-semibold">{carrier.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
