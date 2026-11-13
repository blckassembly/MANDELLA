import React, { useState, useEffect } from 'react';
import {
  PortalMode,
  EnterpriseProduct,
  CustomerProduct,
  TenantAccount
} from '../../types/multiTenant';
import { UserPersona } from '../Header';
import {
  ChevronRight,
  Sparkles,
  Rocket,
  Activity,
  Palette,
  Type,
  Search,
  Bot,
  Radio,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface TopHeaderProps {
  portalMode: PortalMode;
  activeEnterpriseProduct: EnterpriseProduct;
  activeCustomerTab: CustomerProduct;
  currentTenant: TenantAccount;
  onOpenTenantModal: () => void;
  onOpenOnboarding?: () => void;
  onOpenStressTest?: () => void;
  onOpenDesignSystem?: () => void;
  onOpenNmcpControlPlane?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenGeminiChat?: () => void;
  onSwitchToLanding?: () => void;
  onSwitchToAgnosticOs?: () => void;
  activePersona: UserPersona;
  onSelectPersona: (p: UserPersona) => void;
  isSidebarCollapsed: boolean;
  onUpgradeTier?: () => void;
  isOnline?: boolean;
  isReadOnly?: boolean;
  onToggleSimulateOffline?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  portalMode,
  activeEnterpriseProduct,
  activeCustomerTab,
  currentTenant,
  onOpenTenantModal,
  onOpenOnboarding,
  onOpenStressTest,
  onOpenDesignSystem,
  onOpenNmcpControlPlane,
  onOpenCommandPalette,
  onOpenGeminiChat,
  onSwitchToLanding,
  onSwitchToAgnosticOs,
  activePersona,
  onSelectPersona,
  onUpgradeTier
}) => {
  const plan = currentTenant.subscription;

  const [textSize, setTextSize] = useState<'standard' | 'large' | 'xl'>(() => {
    return (localStorage.getItem('atelier-text-size') as 'standard' | 'large' | 'xl') || 'large';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize);
    localStorage.setItem('atelier-text-size', textSize);
  }, [textSize]);

  const getProductTitle = () => {
    if (portalMode === 'customer_portal') {
      switch (activeCustomerTab) {
        case 'overview':
          return 'Customer Usage & Analytics';
        case 'services':
          return 'Communications Lines & DIDs';
        case 'storefront':
          return 'Sovereign DID & eSIM Storefront';
        case 'cdrs':
          return 'Call Detail Records (CDRs) & Audio';
        case 'api_keys':
          return 'Developer API & Webhooks Hub';
        case 'billing':
          return 'Subscription Plans & Invoices';
        case 'support':
          return 'Support Tickets & SLA Incidents';
        case 'sla':
          return 'SLA & Sovereign Data Residency';
        default:
          return 'Customer Self-Service Workspace';
      }
    } else {
      switch (activeEnterpriseProduct) {
        case 'interconnect':
          return 'Portal 01 · Carrier Interconnect & LCR Engine';
        case 'satellite_ntn':
          return 'Portal 02 · Satellite NTN & Orbital Gateway';
        case 'sbc_core':
          return 'Portal 03 · Carrier SBC & Anycast SIP Core';
        case 'voice_ivr':
          return 'Portal 04 · Consumer Voice & Multilingual IVR';
        case 'messaging_sms':
          return 'Portal 05 · SMS & USSD Messaging Gateway';
        case 'nms_numbers':
          return 'Portal 06 · Sovereign Number Management (NMS)';
        case 'dataverse':
          return 'Portal 07 · MANDELA Sovereign Dataverse';
        case 'edge_defense':
          return 'Portal 08 · Inline Signaling & Edge Defense Plane';
        case 'siem_fabric':
          return 'Portal 09 · 18-System SIEM & Normalization Fabric';
        case 'ai_anomaly_voice':
          return 'Portal 10 · AI Anomaly & Voice Fraud Engine';
        case 'soc_c2':
          return 'Portal 11 · SOC Command & Control (C2)';
        default:
          return 'Mandela Sovereign Architecture';
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-black/15 min-h-[4rem] h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Left: Quiet architectural breadcrumb */}
      <div className="flex items-center gap-2 min-w-0 text-sm font-sans">
        <span className="text-black/60 uppercase tracking-[0.16em] text-[11px] sm:text-xs font-semibold hidden sm:inline">
          {portalMode === 'enterprise_suite' ? 'Enterprise Core' : 'Customer Workspace'}
        </span>
        <ChevronRight className="w-4 h-4 text-black/35 hidden sm:inline shrink-0" />
        <span className="text-black font-bold truncate tracking-tight text-sm sm:text-[15px]">
          {getProductTitle()}
        </span>
      </div>

      {/* Right Controls: Search, Tenant Switcher, Persona, Precision Actions */}
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        {/* Global Command Palette Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-zinc-50 hover:bg-zinc-100 border border-black/15 hover:border-black text-xs text-black/70 hover:text-black transition-all duration-300 ease-out cursor-pointer group"
            title="Search across tenants, schemas, provisioning, and audit logs (⌘K or Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-black/60 group-hover:text-black transition-colors" />
            <span className="hidden sm:inline font-sans font-medium">Search...</span>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-white border border-black/20 rounded-[2px] text-black shadow-2xs">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Dynamic Typography Scaler */}
        <div className="hidden md:flex items-center bg-zinc-100 p-0.5 rounded-[2px] border border-black/15 text-xs" title="Font Scale Controller: Non-destructive text scaling">
          <span className="px-2 text-black/60 font-sans text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-black/60" />
            <span className="hidden xl:inline">Text:</span>
          </span>
          <button
            onClick={() => setTextSize('standard')}
            className={`px-2.5 py-0.5 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              textSize === 'standard' ? 'bg-black text-white font-semibold' : 'text-black/60 hover:text-black font-medium'
            }`}
            title="Standard Text Scale (15px)"
          >
            A
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-2.5 py-0.5 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              textSize === 'large' ? 'bg-black text-white font-semibold' : 'text-black/60 hover:text-black font-medium'
            }`}
            title="Comfortable Large Text Scale (16.5px - Recommended)"
          >
            A+
          </button>
          <button
            onClick={() => setTextSize('xl')}
            className={`px-2.5 py-0.5 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              textSize === 'xl' ? 'bg-black text-white font-semibold' : 'text-black/60 hover:text-black font-medium'
            }`}
            title="Extra Large Text Scale (18px)"
          >
            A++
          </button>
        </div>

        {/* Tenant Switcher Button */}
        <button
          onClick={onOpenTenantModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-white hover:bg-zinc-50 border border-black/15 hover:border-black transition-all duration-300 ease-out cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-[2px] bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
            {currentTenant.logoInitial}
          </div>
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-black flex items-center gap-1.5">
              <span>{currentTenant.name}</span>
              <span className="text-[11px] uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-zinc-100 text-black border border-black/10 font-medium">
                {plan.displayName}
              </span>
            </div>
          </div>
          <span className="text-xs text-black/50 font-mono">▾</span>
        </button>

        {/* Persona Switcher */}
        <div className="hidden lg:flex items-center bg-zinc-100 p-0.5 rounded-[2px] border border-black/10 text-xs">
          <button
            onClick={() => onSelectPersona('enterprise')}
            className={`px-3 py-1 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              activePersona === 'enterprise'
                ? 'bg-black text-white font-medium'
                : 'text-black/60 hover:text-black font-medium'
            }`}
          >
            Enterprise
          </button>
          <button
            onClick={() => onSelectPersona('developer')}
            className={`px-3 py-1 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              activePersona === 'developer'
                ? 'bg-black text-white font-medium'
                : 'text-black/60 hover:text-black font-medium'
            }`}
          >
            Dev
          </button>
          <button
            onClick={() => onSelectPersona('ops')}
            className={`px-3 py-1 rounded-[2px] transition-all duration-300 ease-out cursor-pointer text-xs ${
              activePersona === 'ops'
                ? 'bg-black text-white font-medium'
                : 'text-black/60 hover:text-black font-medium'
            }`}
          >
            NOC Ops
          </button>
        </div>

        {/* Quick Action: Onboard Carrier/Startup */}
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-black text-white hover:bg-white hover:text-black border border-black text-xs sm:text-[13px] font-sans font-medium transition-all duration-300 ease-out cursor-pointer"
            title="Launch Onboarding Wizard for Satellites, Telcos, Startups, and Enterprises"
          >
            <Rocket className="w-3.5 h-3.5 shrink-0" />
            <span>Onboard</span>
          </button>
        )}

        {/* Quick Action: Stress Test Network */}
        {onOpenStressTest && (
          <button
            onClick={onOpenStressTest}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-white text-black hover:bg-black hover:text-white border border-black text-xs sm:text-[13px] font-sans font-medium transition-all duration-300 ease-out cursor-pointer"
            title="Simulate Carrier-Grade Stress Scenarios"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline">Stress Test</span>
          </button>
        )}

        {/* Quick Action: Design System Catalog */}
        {onOpenDesignSystem && (
          <button
            onClick={onOpenDesignSystem}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-[2px] bg-white text-black hover:bg-black hover:text-white border border-black/30 hover:border-black text-xs sm:text-[13px] font-sans font-medium transition-all duration-300 ease-out cursor-pointer"
            title="Open The Atelier Luxury Minimalist Design System Catalog"
          >
            <Palette className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden xl:inline">Atelier Spec</span>
          </button>
        )}

        {/* Quick Action: NMCP Multi-Tenant AI Control Plane */}
        {onOpenNmcpControlPlane && (
          <button
            onClick={onOpenNmcpControlPlane}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-zinc-950 text-white hover:bg-zinc-800 border border-zinc-700 text-xs sm:text-[13px] font-mono transition-colors cursor-pointer shadow-xs"
            title="Open NMCP Infrastructure Control Plane & Live AI Observability"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
            <span className="font-bold tracking-tight">NMCP Control Plane</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded-[1px] border border-emerald-800 hidden lg:inline leading-none font-bold">
              AI LIVE
            </span>
          </button>
        )}

        {/* Quick Action: Gemini AI Telecom Copilot */}
        {onOpenGeminiChat && (
          <button
            onClick={onOpenGeminiChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-gradient-to-r from-emerald-500/10 to-teal-500/20 text-emerald-700 hover:bg-black hover:text-white border border-emerald-500/40 text-xs sm:text-[13px] font-sans font-medium transition-all duration-300 ease-out cursor-pointer shadow-sm"
            title="Launch Multi-Turn Gemini AI Copilot for Telecom Security & Architecture"
          >
            <Bot className="w-3.5 h-3.5 shrink-0 text-emerald-600 group-hover:text-white" />
            <span className="font-semibold">AI Copilot</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {/* Public Landing & Interactive Tour Site */}
        {onSwitchToLanding && (
          <button
            onClick={onSwitchToLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-slate-900 text-emerald-400 hover:bg-black hover:text-emerald-300 border border-slate-700 text-xs sm:text-[13px] font-sans font-medium transition-all duration-300 ease-out cursor-pointer shadow-xs"
            title="Switch to Enterprise Public Landing & Live Showcase"
          >
            <Globe className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span className="font-semibold">Public Site</span>
          </button>
        )}

        {/* Agnostic OS Architecture & Studio */}
        {onSwitchToAgnosticOs && (
          <button
            onClick={onSwitchToAgnosticOs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-emerald-950 text-emerald-300 hover:bg-emerald-900 hover:text-white border border-emerald-500/40 text-xs sm:text-[13px] font-mono font-bold transition-all duration-300 ease-out cursor-pointer shadow-xs"
            title="Switch to Agnostic Communications OS (Media, AI Agent Studio, Flow Builder)"
          >
            <Radio className="w-3.5 h-3.5 shrink-0 text-emerald-400 animate-pulse" />
            <span>AGNOSTIC OS</span>
          </button>
        )}

        {/* Upgrade CTA if on starter or growth */}
        {(plan.tier === 'starter_sme' || plan.tier === 'growth_business') && onUpgradeTier && (
          <button
            onClick={onUpgradeTier}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-zinc-100 hover:bg-black hover:text-white text-black border border-black/20 rounded-[2px] text-xs sm:text-[13px] font-medium transition-all duration-300 ease-out cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Upgrade</span>
          </button>
        )}
      </div>
    </header>
  );
};
