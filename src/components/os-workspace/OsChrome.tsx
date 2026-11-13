import React, { useState } from 'react';
import {
  Monitor,
  LayoutGrid,
  Layers,
  Share2,
  Terminal,
  Rocket,
  Sliders,
  Bell,
  User,
  Search,
  ChevronDown,
  Maximize2,
  Minimize2,
  Palette,
  Activity,
  Bot,
  Radio,
  Globe,
  Compass,
  Building2,
  Briefcase
} from 'lucide-react';
import { TenantAccount } from '../../types/multiTenant';
import { ExperienceMode, OsInterfaceMode, OsSectionId } from './types';

export const OS_NAV_ITEMS: {
  id: OsSectionId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'desktop', label: 'Desktop', shortLabel: 'DESKTOP', icon: Monitor },
  { id: 'mission_control', label: 'Mission Control', shortLabel: 'MISSION', icon: LayoutGrid },
  { id: 'systems', label: 'Systems', shortLabel: 'SYSTEMS', icon: Layers },
  { id: 'infrastructure', label: 'Infrastructure', shortLabel: 'INFRA', icon: Share2 },
  { id: 'golden_command', label: 'Golden Command', shortLabel: 'COMMAND', icon: Terminal },
  { id: 'deployments', label: 'Deployments', shortLabel: 'DEPLOY', icon: Rocket },
  { id: 'expert_console', label: 'Expert Console', shortLabel: 'EXPERT', icon: Sliders }
];

interface OsChromeProps {
  activeSection: OsSectionId;
  onSelectSection: (section: OsSectionId) => void;
  experienceMode: ExperienceMode;
  onChangeExperienceMode: (mode: ExperienceMode) => void;
  interfaceMode: OsInterfaceMode;
  onChangeInterfaceMode: (mode: OsInterfaceMode) => void;
  currentTenant: TenantAccount;
  onOpenTenantModal: () => void;
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  unreadNotifications: number;
  workflowCode: string;
  workflowTitle: string;
  projectLabel: string;
  onOpenOnboarding: () => void;
  onOpenOrientationTour: () => void;
  onOpenDesignSystem: () => void;
  onOpenStressTest: () => void;
  onOpenNmcpControlPlane: () => void;
  onOpenGeminiChat: () => void;
  onOpenPublicLanding: () => void;
  onOpenLegacyDesktop?: () => void;
  isReadOnly?: boolean;
  onToggleSimulateOffline?: () => void;
  leftSidebar: React.ReactNode;
  children: React.ReactNode;
}

export const OsChrome: React.FC<OsChromeProps> = ({
  activeSection,
  onSelectSection,
  experienceMode,
  onChangeExperienceMode,
  interfaceMode,
  onChangeInterfaceMode,
  currentTenant,
  onOpenTenantModal,
  onOpenCommandPalette,
  onToggleNotifications,
  unreadNotifications,
  workflowCode,
  workflowTitle,
  projectLabel,
  onOpenOnboarding,
  onOpenOrientationTour,
  onOpenDesignSystem,
  onOpenStressTest,
  onOpenNmcpControlPlane,
  onOpenGeminiChat,
  onOpenPublicLanding,
  onOpenLegacyDesktop,
  isReadOnly,
  onToggleSimulateOffline,
  leftSidebar,
  children
}) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [dockAutoHidden, setDockAutoHidden] = useState(false);

  return (
    <div className="min-h-screen h-screen flex flex-col bg-white text-black font-sans overflow-hidden">
      {/* 1. TOP APPLICATION BAR */}
      <header className="h-14 border-b border-black bg-white px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30">
        {/* Left Wordmark + Primary OS Section Links */}
        <div className="flex items-center gap-5 min-w-0">
          <button
            type="button"
            onClick={() => {
              onChangeInterfaceMode('os_workspace');
              onSelectSection('desktop');
            }}
            className="font-sans font-extrabold text-lg sm:text-xl tracking-tight text-black whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2 pr-4 border-r border-black/30"
          >
            <span>{interfaceMode === 'operator_ops' ? 'MANDELA / Operations' : 'MANDELA OS'}</span>
          </button>

          {interfaceMode === 'os_workspace' && (
            <nav className="hidden lg:flex items-center gap-5 overflow-x-auto">
              {OS_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectSection(item.id)}
                    className={`py-4 text-xs sm:text-[13px] whitespace-nowrap shrink-0 border-b-2 transition-colors cursor-pointer ${
                      isActive
                        ? 'border-black text-black font-bold'
                        : 'border-transparent text-zinc-600 hover:text-black font-medium'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Interface Switcher Pills (Rectangular Sharp Buttons) */}
          <div className="hidden md:flex items-center border border-black bg-white">
            <button
              type="button"
              onClick={() => onChangeInterfaceMode('os_workspace')}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase cursor-pointer transition-colors ${
                interfaceMode === 'os_workspace' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
              }`}
              title="MANDELA OS Operator & Engineering Workspace"
            >
              OS
            </button>
            <button
              type="button"
              onClick={() => onChangeInterfaceMode('customer_portal')}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-l border-black cursor-pointer transition-colors ${
                interfaceMode === 'customer_portal' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
              }`}
              title="Customer Self-Service Business Line Portal"
            >
              Client
            </button>
            <button
              type="button"
              onClick={() => onChangeInterfaceMode('operator_ops')}
              className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase border-l border-black cursor-pointer transition-colors ${
                interfaceMode === 'operator_ops' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
              }`}
              title="Operator Provisioning & Operations Queue"
            >
              Ops
            </button>
          </div>

          <span className="px-2 py-1 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-wider shrink-0">
            {isReadOnly ? 'OFFLINE' : 'DEMO'}
          </span>

          {/* Organization Selector */}
          <button
            type="button"
            onClick={onOpenTenantModal}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-black bg-white hover:bg-zinc-100 text-xs font-semibold text-black cursor-pointer whitespace-nowrap max-w-[180px]"
            title="Switch Pilot Organization / Tenant Account"
          >
            <span className="truncate">{currentTenant.name}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0" />
          </button>

          {/* Search ⌘K */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="p-1.5 sm:px-2.5 sm:py-1 border border-black/30 hover:border-black bg-white hover:bg-zinc-100 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            title="Global Command Search (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[11px] font-bold">⌘K</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={onToggleNotifications}
            className="relative p-1.5 border border-transparent hover:border-black bg-white text-black cursor-pointer"
            title="Open Notifications Panel (WF-11)"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-black text-white text-[9px] font-mono font-bold flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* User Profile & Tools Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen((p) => !p)}
              className="p-1.5 border border-black bg-white hover:bg-zinc-100 text-black cursor-pointer"
              title="Account, Onboarding & Platform Tools"
            >
              <User className="w-4 h-4" />
            </button>

            {profileMenuOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileMenuOpen(false)}
              />
            )}

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border-2 border-black shadow-xl z-50 divide-y divide-black/15 text-xs">
                <div className="p-3 bg-zinc-50">
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    WORKSPACE PROFILE
                  </div>
                  <div className="font-bold text-sm text-black mt-0.5 truncate">{currentTenant.name}</div>
                  <div className="font-mono text-[11px] text-zinc-600 truncate">{currentTenant.registeredAdminEmail}</div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onChangeInterfaceMode('os_workspace');
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>MANDELA OS Workspace</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onChangeInterfaceMode('customer_portal');
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Customer Self-Service Portal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onChangeInterfaceMode('operator_ops');
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Operator Operations (MVP-001)</span>
                  </button>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenOnboarding();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Sign-In & Organization Setup (01–03)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenOrientationTour();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>First-Time Orientation Tour (WF-04)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenNmcpControlPlane();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>NMCP AI Control Plane</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenGeminiChat();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Telecom Copilot</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenDesignSystem();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Design System Specification</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenStressTest();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>System Stress & UX Audit</span>
                  </button>
                  {onToggleSimulateOffline && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onToggleSimulateOffline();
                      }}
                      className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center justify-between cursor-pointer font-mono text-[11px]"
                    >
                      <span>WORKBOX OFFLINE TEST</span>
                      <span className="font-bold">{isReadOnly ? 'ON' : 'OFF'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onOpenPublicLanding();
                    }}
                    className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Enterprise Showcase Site</span>
                  </button>
                  {onOpenLegacyDesktop && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onOpenLegacyDesktop();
                      }}
                      className="w-full text-left px-2.5 py-2 hover:bg-zinc-100 flex items-center gap-2 cursor-pointer text-zinc-600"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Windowed Desktop Launcher</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. SUB-CONTEXT BREADCRUMB STRIP */}
      {interfaceMode === 'os_workspace' && (
        <div className="h-9 border-b border-black bg-white px-4 sm:px-6 flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="truncate text-black">
              PILOT ORGANIZATION / {projectLabel}
            </span>
            <span className="text-black/30">|</span>
            <div className="inline-flex items-center gap-1">
              <span className="text-zinc-600">MODE:</span>
              <button
                type="button"
                onClick={() => onChangeExperienceMode(experienceMode === 'guided' ? 'expert' : 'guided')}
                className="px-1.5 py-0.5 border border-black bg-white hover:bg-black hover:text-white transition-colors cursor-pointer"
                title="Switch between Guided Mode and Expert Mode"
              >
                {experienceMode === 'guided' ? 'GUIDED' : 'EXPERT'}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden sm:inline text-black">
              {workflowCode} — {workflowTitle}
            </span>
            <button
              type="button"
              onClick={() => setDockAutoHidden((p) => !p)}
              className="px-2 py-0.5 border border-black/40 hover:border-black bg-white text-[10px] flex items-center gap-1 cursor-pointer"
              title={dockAutoHidden ? 'Show Bottom OS Dock' : 'Expand Workspace (Hide OS Dock)'}
            >
              {dockAutoHidden ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden md:inline">{dockAutoHidden ? 'SHOW DOCK' : 'EXPAND'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. TWO-COLUMN MAIN VIEWPORT */}
      <div className="flex-1 flex min-h-0 overflow-hidden bg-white">
        {leftSidebar && (
          <aside className="w-[260px] lg:w-[290px] border-r border-black bg-white overflow-y-auto shrink-0 hidden md:block">
            {leftSidebar}
          </aside>
        )}

        <main className="flex-1 overflow-y-auto bg-white min-w-0">
          {children}
        </main>
      </div>

      {/* 4. CENTERED BOTTOM OS DOCK + FOOTER STATUS BAR */}
      {interfaceMode === 'os_workspace' && !dockAutoHidden && (
        <footer className="border-t border-black bg-white shrink-0 z-20">
          {/* Centered Icon Dock */}
          <div className="py-2 px-4 flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto border-b border-black/20">
            {OS_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectSection(item.id)}
                  className={`min-w-[74px] sm:min-w-[82px] px-2.5 py-1.5 border border-black rounded-[2px] flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'bg-white text-black hover:bg-zinc-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-tight leading-none">
                    {item.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Workflow Status Strip */}
          <div className="h-8 px-4 sm:px-6 flex items-center justify-between text-[11px] font-sans text-zinc-700 bg-white">
            <div className="flex items-center gap-2 font-semibold text-black truncate">
              <span>{workflowCode} — {workflowTitle}</span>
              <span className="text-black/30 hidden sm:inline">|</span>
              <span className="hidden sm:inline text-zinc-600 font-normal">MANDELA OS</span>
            </div>
            <div className="text-zinc-600 truncate">
              Demo planning environment — no live infrastructure changes.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
