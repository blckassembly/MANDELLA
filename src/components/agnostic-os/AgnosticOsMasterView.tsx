import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Bot,
  Sliders,
  Server,
  Database,
  Terminal as TerminalIcon,
  ShieldCheck,
  PhoneCall,
  Radio,
  ArrowRight,
  Globe,
  Lock,
  Zap,
  Users,
  Image as ImageIcon,
  HardDrive,
  Monitor,
  Layout
} from 'lucide-react';
import { CommandControlDashboard } from './CommandControlDashboard';
import { AgentBuilderStudio } from './AgentBuilderStudio';
import { VisualWorkflowBuilder } from './VisualWorkflowBuilder';
import { ProviderRegistryView } from './ProviderRegistryView';
import { CallRecordingsAnalyticsView } from './CallRecordingsAnalyticsView';
import { DeveloperConsoleView } from './DeveloperConsoleView';
import { MandelaShellTerminal } from './MandelaShellTerminal';
import { SystemTaskManager } from './SystemTaskManager';
import { TelecomFileExplorer } from './TelecomFileExplorer';
import { AgnosticDesktop } from './AgnosticDesktop';
import { PanAfricaNumberInventoryView } from '../numbers/PanAfricaNumberInventoryView';
import { TenantAccount, PortalMode } from '../../types/multiTenant';

export type AgnosticOsTab =
  | 'command_control'
  | 'pan_africa_numbers'
  | 'terminal'
  | 'task_manager'
  | 'file_explorer'
  | 'agent_builder'
  | 'workflow_builder'
  | 'providers'
  | 'recordings'
  | 'dev_console'
  | 'architecture';

interface AgnosticOsMasterViewProps {
  currentTenant: TenantAccount;
  onSwitchPortalMode: (mode: PortalMode) => void;
  onOpenTenantModal?: () => void;
  onOpenStressTest?: () => void;
  onOpenOnboarding?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSoftphone?: (num: any) => void;
  onOpenDesignSystem?: () => void;
}

export const AgnosticOsMasterView: React.FC<AgnosticOsMasterViewProps> = ({
  currentTenant,
  onSwitchPortalMode,
  onOpenTenantModal,
  onOpenStressTest,
  onOpenOnboarding,
  onOpenCommandPalette,
  onOpenSoftphone,
  onOpenDesignSystem
}) => {
  // Toggle between 'desktop' (Apple/Windows/Linux multi-window OS) and 'studio' (Fullscreen tabbed)
  const [viewMode, setViewMode] = useState<'desktop' | 'studio'>('desktop');
  const [activeTab, setActiveTab] = useState<AgnosticOsTab>('command_control');

  // If in Desktop mode, render the rich windowed OS with Linux CLI, Windows Taskbar, and Apple Dock
  if (viewMode === 'desktop') {
    return (
      <AgnosticDesktop
        currentTenant={currentTenant}
        onSwitchPortalMode={onSwitchPortalMode}
        onOpenTenantModal={onOpenTenantModal}
        onOpenStressTest={onOpenStressTest}
        onOpenOnboarding={onOpenOnboarding}
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenSoftphone={onOpenSoftphone}
        onOpenDesignSystem={onOpenDesignSystem}
        onToggleViewMode={() => setViewMode('studio')}
      />
    );
  }

  // Otherwise render the full-screen Studio tabbed workspace
  return (
    <div className="min-h-screen bg-zinc-850 text-zinc-100 font-sans selection:bg-emerald-500 selection:text-zinc-950 flex flex-col">
      {/* 1. Agnostic OS Sub-Header / Control Strip */}
      <div className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20">
              OS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-tight">
                  Mandela Communications Operating System
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                  STUDIO MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Active Tenant: <strong className="text-white">{currentTenant.name}</strong> · Tier: <strong className="text-emerald-400">{currentTenant.subscription.displayName}</strong>
              </p>
            </div>
          </div>

          {/* Quick links & Desktop switcher */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {/* Switch to Desktop OS Button */}
            <button
              onClick={() => setViewMode('desktop')}
              className="px-3 py-1.5 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 hover:text-white border border-emerald-500/40 flex items-center gap-1.5 font-bold transition-all cursor-pointer shadow-sm"
              title="Switch to Multi-Window Desktop (Linux shell, Windows taskbar, Apple UX dock)"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>DESKTOP OS MODE</span>
            </button>

            <button
              onClick={() => onSwitchPortalMode('public_landing')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Public Site
            </button>
            <button
              onClick={() => onSwitchPortalMode('enterprise_suite')}
              className="px-2.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              Enterprise Suite
            </button>
            <button
              onClick={() => onSwitchPortalMode('customer_portal')}
              className="px-2.5 py-1.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Client Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs font-mono font-semibold">
          {[
            { id: 'command_control', label: 'Command & Control', icon: Activity },
            { id: 'pan_africa_numbers', label: 'Pan-Africa Numbers', icon: Globe, badge: '54 ITU' },
            { id: 'terminal', label: 'Linux Shell (msh)', icon: TerminalIcon, badge: 'LINUX' },
            { id: 'task_manager', label: 'Task Manager', icon: Activity, badge: 'WINDOWS' },
            { id: 'file_explorer', label: 'Storage Explorer', icon: HardDrive },
            { id: 'agent_builder', label: 'AI Agent Studio', icon: Bot, badge: 'NATURAL LANGUAGE' },
            { id: 'workflow_builder', label: 'Visual Callflow (NCCO)', icon: Sliders },
            { id: 'providers', label: 'Provider Registry', icon: Server, badge: 'AGNOSTIC' },
            { id: 'recordings', label: 'Recordings & Transcripts', icon: Database },
            { id: 'dev_console', label: 'Developer Console & API', icon: TerminalIcon },
            { id: 'architecture', label: 'Architecture Blueprint', icon: ImageIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AgnosticOsTab)}
                className={`px-3.5 py-2.5 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-white border-b-2 border-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'command_control' && (
          <CommandControlDashboard />
        )}

        {activeTab === 'pan_africa_numbers' && (
          <PanAfricaNumberInventoryView currentTenant={currentTenant} />
        )}

        {activeTab === 'terminal' && (
          <div className="h-[700px]">
            <MandelaShellTerminal />
          </div>
        )}

        {activeTab === 'task_manager' && (
          <div className="h-[700px]">
            <SystemTaskManager />
          </div>
        )}

        {activeTab === 'file_explorer' && (
          <div className="h-[700px]">
            <TelecomFileExplorer />
          </div>
        )}

        {activeTab === 'agent_builder' && (
          <AgentBuilderStudio
            onPublishAgent={() => setActiveTab('command_control')}
          />
        )}

        {activeTab === 'workflow_builder' && (
          <VisualWorkflowBuilder
            onOpenSoftphone={onOpenSoftphone}
            onOpenOnboarding={onOpenOnboarding}
          />
        )}

        {activeTab === 'providers' && (
          <ProviderRegistryView />
        )}

        {activeTab === 'recordings' && (
          <CallRecordingsAnalyticsView />
        )}

        {activeTab === 'dev_console' && (
          <DeveloperConsoleView />
        )}

        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    SPECIFICATION &amp; TELECOMMUNICATIONS ARCHITECTURE MAP
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight mt-1">
                    End-to-End Media, Signaling &amp; Speech Layer Architecture
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  REF: /public/assets/aistudio/1_d037196d.jpg
                </span>
              </div>

              {/* Reference Image Embedding */}
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-2xl">
                <img
                  src="/public/assets/aistudio/1_d037196d.jpg"
                  alt="Agnostic Communications Operating System Architecture"
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>

              {/* Architectural Principles Breakdown */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-sans">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-white font-mono text-sm flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>FreeSWITCH &amp; RTPEngine</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Media processing cluster deployed on Mandela Cloud (System 7/9). 1,000 concurrent calls per node with RTPEngine handling NAT traversal, kernel-level packet forwarding, and recording streams.
                  </p>
                  <div className="text-[10px] font-mono text-zinc-400 pt-1">
                    DEPENDS ON: System 4 (Carrier SBC Core)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="font-bold text-white font-mono text-sm flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Call Control Engine</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed">
                    VoiceXML / NCCO visual flow builder with webhooks. Decouples state machine logic from hardware appliances. Coordinates ASR, TTS, and AI agent handovers.
                  </p>
                  <div className="text-[10px] font-mono text-zinc-400 pt-1">
                    DEPENDS ON: System 1 (Number Management)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <div className="font-bold text-white font-mono text-sm flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span>Speech &amp; AI Layer</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    50 African languages neural ASR/TTS trained on localized speech with streaming code-switching. Voice biometrics, noise suppression, and real-time call summarization.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 pt-1">
                    INTEGRATION: Gemini 3.8 Flash SDK
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
