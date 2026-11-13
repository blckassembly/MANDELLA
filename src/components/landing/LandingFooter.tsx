import React from 'react';
import { ShieldCheck, Network, Terminal, ArrowRight, Heart } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

export const LandingFooter: React.FC<{
  onLaunchConsole: (mode?: PortalMode) => void;
}> = ({ onLaunchConsole }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 font-sans text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Pre-Footer CTA Strip */}
        <div className="pb-12 mb-12 border-b border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Power Your Pan-African Telecom Infrastructure Today.
            </h3>
            <p className="mt-1 text-slate-400 text-sm">
              Deploy direct SMPP binds, SIP trunking, and satellite NTN links in minutes.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onLaunchConsole('customer_portal')}
              className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:text-white font-semibold cursor-pointer transition-colors"
            >
              Customer Self-Service
            </button>
            <button
              onClick={() => onLaunchConsole('enterprise_suite')}
              className="px-5 py-2.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>Launch Enterprise Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Column Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Sovereignty */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
              <span className="text-base font-bold text-white tracking-tight">Mandela Connect Layer</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The Sovereign Pan-African Telecom Operating System. Providing carrier-grade SIP SBC core, neural voice IVR across 50 languages, high-throughput SMPP messaging, and 3GPP Rel-17 Satellite NTN direct links across 54 sovereign African nations.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                AU MALABO COMPLIANT
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                GSMA PRD IR.21
              </span>
              <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                PCI-DSS LEVEL 1
              </span>
            </div>
          </div>

          {/* Column 2: Architecture Pillars */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-[11px] font-mono">
              Core Systems
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  System 4: SBC Anycast Core
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  System 3: 50 African Languages IVR
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  System 2: Sovereign SMS & USSD
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  System 1: Number Management (NMS)
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  Satellite NTN Orbital Teleports
                </a>
              </li>
              <li>
                <a href="#tour" className="hover:text-white transition-colors">
                  MANDELA Sovereign Dataverse
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-[11px] font-mono">
              Industries
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Tier-1 MNOs & MVNOs
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Fintechs & Neobanks
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  Mining, Oil & Logistics
                </a>
              </li>
              <li>
                <a href="#solutions" className="hover:text-white transition-colors">
                  National Regulators (NRA)
                </a>
              </li>
              <li>
                <a href="#roi-calculator" className="hover:text-white transition-colors">
                  TCO & Arbitrage Model
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  Aggregator Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Console Access */}
          <div className="space-y-3">
            <div className="text-white font-bold tracking-wider uppercase text-[11px] font-mono">
              Operating Console
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onLaunchConsole('enterprise_suite')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Carrier Interconnect (LCR)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onLaunchConsole('enterprise_suite')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  SBC Packet Diagnostic
                </button>
              </li>
              <li>
                <button
                  onClick={() => onLaunchConsole('enterprise_suite')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Satellite Feeder Monitor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onLaunchConsole('customer_portal')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Customer Self-Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onLaunchConsole('enterprise_suite')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  SOC Command & Control (C2)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} Mandela Connect Layer Ltd. All rights reserved. Sovereign African Telecom Infrastructure.
          </div>
          <div className="flex items-center gap-4">
            <span>Pan-African Data Sovereignty Certified</span>
            <span>·</span>
            <span>Zero Aggregator Middleware</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
