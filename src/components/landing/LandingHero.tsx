import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Activity, Globe, CheckCircle2 } from 'lucide-react';
import { LiveSandboxWidget } from './LiveSandboxWidget';
import { PortalMode } from '../../types/multiTenant';

interface LandingHeroProps {
  onLaunchConsole: (mode?: PortalMode) => void;
  onOpenTour: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLaunchConsole,
  onOpenTour,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-20 md:pt-16 md:pb-28 overflow-hidden">
      {/* Background radial gradient mesh and tech grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[400px] bg-amber-500/8 rounded-full blur-[140px]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Kicker */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">NEXT-GEN INFRASTRUCTURE</span>
            <span className="text-slate-500">·</span>
            <span className="text-emerald-400">54 AFRICAN NATIONS CONNECTED</span>
          </div>

          {/* Jasper.ai style massive headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl">
            The Sovereign Telecom{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Operating System
            </span>{' '}
            for Africa & Beyond.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl leading-relaxed font-normal">
            Direct Tier-1 MNO SMPP binds, carrier-grade SIP SBC core, neural voice IVR across 50 African languages, and satellite NTN orbital teleports. Zero aggregator markups. Zero grey routes.
          </p>

          {/* Dual CTAs & Micro Trust Badges */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => onLaunchConsole('enterprise_suite')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all duration-200 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Enterprise Console</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#tour"
              onClick={onOpenTour}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:text-white"
            >
              <span>Explore Architecture Tour</span>
            </a>
          </div>

          {/* Editorial Micro-Proof Line */}
          <div className="mt-5 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free instant sandbox trial</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full GSMA PRD IR.21 Compliance</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>No credit card required to test</span>
            </span>
          </div>

          {/* Social Proof Metric Pillars */}
          <div className="mt-12 w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl border-y border-slate-800/80 py-6">
            <div className="text-center px-3">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                10,000<span className="text-emerald-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Calls / Sec (CPS)
              </div>
            </div>
            <div className="text-center px-3 border-l border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                50<span className="text-cyan-400">+</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                African Languages IVR
              </div>
            </div>
            <div className="text-center px-3 border-l border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                99.8<span className="text-emerald-400">%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                OTP Delivery in 4.2s
              </div>
            </div>
            <div className="text-center px-3 border-l border-slate-800/80">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tabular-nums">
                &lt;12<span className="text-amber-400">ms</span>
              </div>
              <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
                Autonomous Subsea LCR
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Hero Interactive Sandbox Widget */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold">
              INTERACTIVE DEMO SANDBOX — TEST LIVE TELEMETRY
            </span>
          </div>
          <LiveSandboxWidget onLaunchConsole={() => onLaunchConsole('enterprise_suite')} />
        </div>
      </div>
    </section>
  );
};
