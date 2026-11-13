import React from 'react';
import {
  ChevronRight,
  Search,
  Building2,
  Phone,
  LayoutGrid,
  ShieldCheck,
  Radio,
  ExternalLink
} from 'lucide-react';
import { BreadcrumbItem } from '../../router/useMandelaRouter';
import { TenantAccount } from '../../types/multiTenant';

export interface AppHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  currentTenant: TenantAccount;
  onOpenTenantModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSoftphone?: () => void;
  onOpenLaunchpad?: () => void;
  onOpenOnboarding?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs,
  currentTenant,
  onOpenTenantModal,
  onOpenCommandPalette,
  onOpenSoftphone,
  onOpenLaunchpad,
  onOpenOnboarding
}) => {
  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-850 px-4 flex items-center justify-between shrink-0 gap-4 z-40 select-none text-zinc-100">
      {/* Left: Brand Identity & Breadcrumb Navigation */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenLaunchpad}
          className="flex items-center gap-2 group cursor-pointer shrink-0"
          title="Return to 30-Application Directory"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shadow-sm">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-wider font-mono text-zinc-100 uppercase flex items-center gap-1.5">
              <span>MANDELA</span>
              <span className="text-[10px] text-amber-400 font-mono">OS</span>
            </span>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              Telecom Kernel
            </span>
          </div>
        </button>

        <div className="w-[1px] h-6 bg-zinc-800 shrink-0 mx-1" />

        {/* Dynamic Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 text-xs font-mono">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.id}>
                {idx > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                )}
                {crumb.onClick && !isLast ? (
                  <button
                    onClick={crumb.onClick}
                    className="text-zinc-400 hover:text-zinc-100 transition-colors truncate max-w-[160px] cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={`truncate max-w-[200px] ${
                      isLast ? 'text-amber-300 font-bold' : 'text-zinc-300'
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right: Global Search (⌘K), Softphone, Tenant Switcher & Onboarding */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search Command Palette Trigger (⌘K) */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500" />
            <span>Search 30 Apps & Commands...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-700 text-[10px] text-zinc-400">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Softphone Dialer Shortcut */}
        {onOpenSoftphone && (
          <button
            onClick={onOpenSoftphone}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-emerald-400 border border-zinc-800 transition-colors cursor-pointer"
            title="Open WebRTC Softphone"
          >
            <Phone className="w-4 h-4" />
          </button>
        )}

        {/* Tenant Switcher & Tier Badge */}
        <button
          onClick={onOpenTenantModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-colors text-left cursor-pointer"
          title={`Active Tenant: ${currentTenant.name} (${currentTenant.region})`}
        >
          <div className="w-5 h-5 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Building2 className="w-3 h-3" />
          </div>
          <div className="hidden sm:block min-w-0 pr-1">
            <div className="text-xs font-bold text-zinc-200 truncate max-w-[130px]">
              {currentTenant.name}
            </div>
            <div className="text-[10px] font-mono text-zinc-400 truncate">
              {currentTenant.subscription.tier.toUpperCase()} · ${currentTenant.usage.accountBalanceUsd.toFixed(2)}
            </div>
          </div>
        </button>

        {/* Guided Onboarding */}
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Onboarding</span>
          </button>
        )}
      </div>
    </header>
  );
};
