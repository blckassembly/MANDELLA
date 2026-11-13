import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Bot,
  Terminal,
  Folder,
  Server,
  Globe,
  Radio,
  Sliders,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  PhoneCall,
  Activity,
  HardDrive,
  FileText,
  Zap,
  Sparkles,
  Key,
  Code2,
  ExternalLink,
  Palette
} from 'lucide-react';
import { OS_APPLICATIONS_REGISTRY } from '../../config/osAppsRegistry';

export interface CleanAppLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
  onOpenDesignSystem?: () => void;
}

interface LauncherAppItem {
  id: string;
  name: string;
  category: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  customIcon?: string;
  iconComponent?: React.ComponentType<{ className?: string }>;
}

export const CleanAppLauncherModal: React.FC<CleanAppLauncherModalProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  onOpenDesignSystem
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Comprehensive Launcher Applications matching GNOME/macOS clean grid layout from screenshot
  const launcherApps: LauncherAppItem[] = useMemo(() => [
    // Flagship AI Systems
    { id: 'agent_builder', name: 'AI Agent Studio', category: 'AI', iconBg: 'bg-emerald-500', iconColor: 'text-white', iconComponent: Bot, badge: 'Gemini' },
    { id: 'multi_ai_gateway', name: 'Multi-AI Gateway', category: 'AI', iconBg: 'bg-indigo-600', iconColor: 'text-white', iconComponent: Sparkles, badge: 'Claude/GPT' },
    { id: 'mcp_gateway', name: 'MCP Architecture', category: 'AI', iconBg: 'bg-purple-600', iconColor: 'text-white', iconComponent: Cpu, badge: 'Protocol' },

    // Core Telecommunications
    { id: 'pan_africa_numbers', name: 'Africa Numbers', category: 'Telecom', iconBg: 'bg-teal-500', iconColor: 'text-white', iconComponent: Globe, badge: '54 ITU' },
    { id: 'command_control', name: 'NOC Command', category: 'Telecom', iconBg: 'bg-blue-600', iconColor: 'text-white', iconComponent: Activity },
    { id: 'workflow_builder', name: 'Workflow Builder', category: 'Automation', iconBg: 'bg-amber-500', iconColor: 'text-zinc-950', iconComponent: Sliders, badge: 'n8n' },
    { id: 'providers', name: 'Carriers & Trunks', category: 'Telecom', iconBg: 'bg-sky-600', iconColor: 'text-white', iconComponent: Server },
    { id: 'recordings', name: 'Call Analytics', category: 'Telecom', iconBg: 'bg-rose-500', iconColor: 'text-white', iconComponent: PhoneCall },

    // Developer & System Utilities
    { id: 'terminal', name: 'Telecom Shell', category: 'System', iconBg: 'bg-zinc-900', iconColor: 'text-emerald-400', iconComponent: Terminal, badge: 'Foot' },
    { id: 'file_explorer', name: 'Storage Explorer', category: 'System', iconBg: 'bg-blue-500', iconColor: 'text-white', iconComponent: Folder, badge: 'Files' },
    { id: 'dev_console', name: 'API & SDK Hub', category: 'Developer', iconBg: 'bg-violet-600', iconColor: 'text-white', iconComponent: Code2, badge: 'v1' },
    { id: 'task_manager', name: 'Task Manager', category: 'System', iconBg: 'bg-orange-500', iconColor: 'text-white', iconComponent: HardDrive },
    { id: 'architecture', name: 'System Blueprint', category: 'System', iconBg: 'bg-cyan-600', iconColor: 'text-white', iconComponent: Layers },
    { id: 'design_system', name: 'Design System', category: 'System', iconBg: 'bg-amber-600', iconColor: 'text-white', iconComponent: Palette, badge: 'Tokens' },
    { id: 'stress_test', name: 'Stress Test Fleet', category: 'QA', iconBg: 'bg-rose-600', iconColor: 'text-white', iconComponent: Zap, badge: '10K CPS' }
  ], []);

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return launcherApps;
    const q = searchQuery.toLowerCase();
    return launcherApps.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        (app.badge && app.badge.toLowerCase().includes(q))
    );
  }, [launcherApps, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-700/80 p-6 sm:p-8 text-zinc-900 dark:text-zinc-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (Matching GNOME/macOS clean launcher from screenshot) */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-zinc-100/90 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
            <Search className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps..."
              className="w-full bg-transparent text-base sm:text-lg font-sans placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none text-zinc-900 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Application Grid (7 columns matching attached reference image) */}
        <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-y-6 gap-x-3 sm:gap-x-4 p-1">
            {filteredApps.map((app) => {
              const IconComp = app.iconComponent || Sparkles;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    if (app.id === 'design_system' && onOpenDesignSystem) {
                      onOpenDesignSystem();
                      onClose();
                    } else {
                      onLaunchApp(app.id);
                      onClose();
                    }
                  }}
                  className="flex flex-col items-center justify-start group cursor-pointer text-center p-2 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {/* Clean Squircle App Icon */}
                  <div className="relative mb-2">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${app.iconBg} ${app.iconColor} flex items-center justify-center shadow-md group-hover:scale-108 group-hover:shadow-lg transition-all duration-200`}
                    >
                      <IconComp className="w-7 h-7 sm:w-8 sm:h-8" />
                    </div>
                    {app.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-zinc-900 text-emerald-300 border border-zinc-700 shadow-xs">
                        {app.badge}
                      </span>
                    )}
                  </div>

                  {/* Clean Label underneath */}
                  <span className="text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white line-clamp-1 max-w-[90px] leading-tight">
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredApps.length === 0 && (
            <div className="py-16 text-center text-zinc-400">
              <Search className="w-10 h-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm font-medium">No applications match "{searchQuery}"</p>
              <p className="text-xs text-zinc-500 mt-1">Try searching for "AI", "NOC", "Shell", or "Numbers"</p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MANDELA AGNOSTIC OS · KERNEL 6.8 RT</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300">Esc</kbd> to close</span>
            <span>·</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-[10px] text-zinc-700 dark:text-zinc-300">⌘Space</kbd> for Launcher</span>
          </div>
        </div>
      </div>
    </div>
  );
};
