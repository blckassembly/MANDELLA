import React from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { PortalMode } from '../../types/multiTenant';

interface LandingTopNavProps {
  onLaunchConsole: (mode?: PortalMode) => void;
  onOpenStressTest?: () => void;
}

export const LandingTopNav: React.FC<LandingTopNavProps> = ({
  onLaunchConsole,
  onOpenStressTest,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#hero"
          className="text-lg sm:text-xl font-bold font-sans tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span>Mandela Connect</span>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#tour"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Product Tour
          </a>
          <a
            href="#sandbox"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Live Sandbox
          </a>
          <a
            href="#roi-calculator"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            ROI Calculator
          </a>
          <a
            href="#solutions"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Solutions
          </a>
          <a
            href="#comparison"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Why Mandela
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onLaunchConsole('customer_portal')}
            className="hidden sm:inline-flex text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer px-2 py-1"
          >
            Customer Portal
          </button>
          <button
            onClick={() => onLaunchConsole('enterprise_suite')}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-all duration-200 shadow-md shadow-emerald-500/20 whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Launch Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
