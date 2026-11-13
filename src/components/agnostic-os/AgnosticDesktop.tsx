import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Bot,
  Sliders,
  Server,
  Database,
  Terminal as TerminalIcon,
  HardDrive,
  FileText,
  Search,
  Wifi,
  Volume2,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  X,
  Minus,
  Sparkles,
  PhoneCall,
  Radio,
  Layers,
  ChevronRight,
  RefreshCw,
  LogOut,
  Settings,
  HelpCircle,
  Folder,
  Home,
  Monitor,
  Eye,
  LayoutGrid
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
import { PanAfricaNumberInventoryView } from '../numbers/PanAfricaNumberInventoryView';
import { AppKernelShell } from './AppKernelShell';
import { ControlCenterModal } from './ControlCenterModal';
import { SpotlightSearchModal } from './SpotlightSearchModal';
import { CleanAppLauncherModal } from './CleanAppLauncherModal';
import { MultiAiMcpGatewaySuite } from '../gateway/MultiAiMcpGatewaySuite';
import { MandelaOsBootstrap } from './MandelaOsBootstrap';
import { OS_APPLICATIONS_REGISTRY, OsApplicationManifest } from '../../config/osAppsRegistry';
import { TenantAccount, PortalMode } from '../../types/multiTenant';

export interface DesktopWindow {
  id: string;
  appId: string;
  title: string;
  strategicFunction: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface AgnosticDesktopProps {
  currentTenant: TenantAccount;
  onSwitchPortalMode: (mode: PortalMode) => void;
  onOpenTenantModal?: () => void;
  onOpenStressTest?: () => void;
  onOpenOnboarding?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSoftphone?: (num: any) => void;
  onOpenDesignSystem?: () => void;
  onToggleViewMode: () => void;
}

export const AgnosticDesktop: React.FC<AgnosticDesktopProps> = ({
  currentTenant,
  onSwitchPortalMode,
  onOpenTenantModal,
  onOpenStressTest,
  onOpenOnboarding,
  onOpenCommandPalette,
  onOpenSoftphone,
  onOpenDesignSystem,
  onToggleViewMode
}) => {
  // Clean Desktop: All applications reside in the floating dock bar
  const [windows, setWindows] = useState<DesktopWindow[]>(() =>
    OS_APPLICATIONS_REGISTRY.map((app, idx) => ({
      id: `win-${app.appId}`,
      appId: app.appId,
      title: app.appName,
      strategicFunction: app.strategicFunction,
      icon: app.icon,
      isOpen: false, // Clean desktop: click any app in the floating dock to launch
      isMinimized: false,
      isMaximized: false,
      position: app.defaultPosition,
      size: app.defaultWindowSize,
      zIndex: idx + 1
    }))
  );

  // Mandela OS System Bootstrap state (runs bootloader on OS startup)
  const [isBootstrapped, setIsBootstrapped] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('mandela_os_bootstrapped') === 'true';
    } catch {
      return false;
    }
  });

  // Operating System Foundation Auto-Hiding (when an app expands)
  const [isFoundationPinned, setIsFoundationPinned] = useState(false);
  const [isTopBarHovered, setIsTopBarHovered] = useState(false);
  const [isDockHovered, setIsDockHovered] = useState(false);

  // UI Modals & Navigation Anchors
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string>('');
  const [maxZIndex, setMaxZIndex] = useState<number>(20);
  const [dockIconSize, setDockIconSize] = useState<'normal' | 'large' | 'xl'>('large');

  // Clock state
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
        ' ' +
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts (⌘Space for Spotlight, ⌘D / Esc for Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bring Window to Front and enforce Single Active Window Mode
  // When an app is activated, it opens in full operating workspace (maximized) and closes others
  const focusWindow = (id: string) => {
    const nextZ = maxZIndex + 1;
    setMaxZIndex(nextZ);
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: nextZ, isMinimized: false, isOpen: true, isMaximized: true }
          : { ...w, isOpen: false, isMinimized: false } // Auto-close other windows
      )
    );
  };

  // Launch App (Single Active Window enforcement)
  const openApp = (appId: string) => {
    const targetWin = windows.find((w) => w.appId === appId);
    if (targetWin) {
      focusWindow(targetWin.id);
    }
  };

  // Close Window
  const closeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w))
    );
  };

  // Minimize Window
  const minimizeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  // Toggle Maximize Window
  const toggleMaximizeWindow = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Show Clean Desktop: Minimize All Windows or Restore
  const areAnyWindowsVisible = windows.some((w) => w.isOpen && !w.isMinimized);

  const toggleShowDesktop = () => {
    if (areAnyWindowsVisible) {
      // Minimize all to show clean desktop
      setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true })));
    } else {
      // Restore all previously open windows
      setWindows((prev) => prev.map((w) => (w.isOpen ? { ...w, isMinimized: false } : w)));
    }
  };

  // Active App & Operating System Foundation Auto-Hiding calculation
  const activeApp = windows.find((w) => w.id === activeWindowId && w.isOpen && !w.isMinimized);
  const isAppExpanded = Boolean(activeApp && activeApp.isMaximized);
  const shouldHideFoundation = isAppExpanded && !isFoundationPinned;
  const showTopBar = !shouldHideFoundation || isTopBarHovered;
  const showDock = !shouldHideFoundation || isDockHovered;

  // Scalable Dock Sizes
  const dockSizeClasses = {
    normal: 'w-11 h-11 text-lg',
    large: 'w-13 h-13 text-xl',
    xl: 'w-16 h-16 text-2xl'
  };

  const dockIconDimensions = {
    normal: 'w-5 h-5',
    large: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  // If OS Bootstrap is pending, run full bootloader diagnostics
  if (!isBootstrapped) {
    return (
      <MandelaOsBootstrap
        onBootstrapComplete={() => {
          setIsBootstrapped(true);
          try {
            sessionStorage.setItem('mandela_os_bootstrapped', 'true');
          } catch {}
        }}
        tenantSlug={currentTenant.slug}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 text-zinc-100 font-sans overflow-hidden select-none flex flex-col">
      {/* Invisible Top Edge Hover Trigger Zone: reveals OS top bar when app is expanded */}
      {shouldHideFoundation && (
        <div
          onMouseEnter={() => setIsTopBarHovered(true)}
          className="fixed top-0 left-0 right-0 h-2 z-60 pointer-events-auto cursor-pointer"
          title="Move mouse to top edge to reveal OS top bar"
        />
      )}

      {/* =========================================================================
          1. CLEAN GRAPHITE GRAY WALLPAPER & AMBIENT ATMOSPHERIC LIGHTING
          Refined, modern OS desktop gray backdrop with subtle lighting
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft atmospheric ambient glow */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full opacity-35 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(212, 212, 216, 0.22) 0%, rgba(161, 161, 170, 0.12) 45%, transparent 75%)'
          }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
            backgroundSize: '36px 36px'
          }}
        />
      </div>

      {/* =========================================================================
          2. APPLE macOS-STYLE TOP SYSTEM BAR — AUTO-HIDES WHEN APP EXPANDS
          ========================================================================= */}
      <header
        onMouseLeave={() => setIsTopBarHovered(false)}
        className={`h-7 w-full bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 px-3 flex items-center justify-between text-xs text-zinc-300 z-50 shrink-0 transition-all duration-300 ease-in-out ${
          showTopBar
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Left: Mandela System Icon & Breadcrumb Navigation Anchor */}
        <div className="flex items-center gap-2.5">
          {/* Mandela System Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setIsAppleMenuOpen(!isAppleMenuOpen);
                setIsStartMenuOpen(false);
              }}
              className="font-black text-sm text-emerald-400 hover:text-white px-1.5 py-0.5 rounded transition-colors cursor-pointer"
              title="Mandela Operating System Menu"
            >
              M
            </button>

            {isAppleMenuOpen && (
              <div
                className="absolute top-7 left-0 w-64 rounded-xl bg-zinc-900/95 backdrop-blur-2xl border border-zinc-700/80 shadow-2xl py-1 text-xs text-zinc-200 z-50 font-sans"
                onClick={() => setIsAppleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-zinc-800 font-bold text-white flex items-center justify-between">
                  <span>About Mandela OS</span>
                  <span className="text-[10px] font-mono text-emerald-400">v2.4 Sovereign LTS</span>
                </div>
                <button
                  onClick={() => openApp('task_manager')}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Activity Monitor (Task Manager)</span>
                  <span className="text-[10px] font-mono opacity-60">⌥⌘Esc</span>
                </button>
                <button
                  onClick={() => openApp('file_explorer')}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Sovereign Storage Explorer</span>
                  <span className="text-[10px] font-mono opacity-60">⌘E</span>
                </button>
                <button
                  onClick={() => openApp('terminal')}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Telecom Shell (msh)</span>
                  <span className="text-[10px] font-mono opacity-60">⌘T</span>
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  onClick={toggleShowDesktop}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>{areAnyWindowsVisible ? 'Hide Windows (Show Desktop)' : 'Restore All Windows'}</span>
                  <span className="text-[10px] font-mono opacity-60">⌘D</span>
                </button>
                <button
                  onClick={onOpenTenantModal}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Switch Organization...</span>
                  <span className="text-[10px] font-mono opacity-60">{currentTenant.slug}</span>
                </button>
                {onOpenOnboarding && (
                  <button
                    onClick={onOpenOnboarding}
                    className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-emerald-400"
                  >
                    <span>Guided Onboarding &amp; KYC...</span>
                    <span className="text-[10px] font-mono opacity-80">Wallet</span>
                  </button>
                )}
                {onOpenCommandPalette && (
                  <button
                    onClick={onOpenCommandPalette}
                    className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    <span>Command Palette</span>
                    <span className="text-[10px] font-mono opacity-60">⌘K</span>
                  </button>
                )}
                {onOpenStressTest && (
                  <button
                    onClick={onOpenStressTest}
                    className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-amber-400"
                  >
                    <span>Architecture &amp; UX Stress Fleet</span>
                    <span className="text-[10px] font-mono opacity-80">Chaos</span>
                  </button>
                )}
                {onOpenDesignSystem && (
                  <button
                    onClick={onOpenDesignSystem}
                    className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-amber-300"
                  >
                    <span>Centralized Design System...</span>
                    <span className="text-[10px] font-mono opacity-80">Tokens &amp; DS</span>
                  </button>
                )}
                <button
                  onClick={onToggleViewMode}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Switch to Studio Mode</span>
                  <span className="text-[10px] font-mono opacity-60">⌘M</span>
                </button>
                <button
                  onClick={() => onSwitchPortalMode('customer_portal')}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Customer Portal &amp; KYC Wallet</span>
                  <span className="text-[10px] font-mono opacity-60">⌘C</span>
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  onClick={() => {
                    try {
                      sessionStorage.removeItem('mandela_os_bootstrapped');
                    } catch {}
                    setIsBootstrapped(false);
                    setIsAppleMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-emerald-400 font-bold"
                >
                  <span>Reboot &amp; Bootstrap OS</span>
                  <span className="text-[10px] font-mono opacity-80">⌥⌘B</span>
                </button>
                <button
                  onClick={() => onSwitchPortalMode('public_landing')}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-zinc-400"
                >
                  <span>Exit to Public Showcase</span>
                  <span className="text-[10px] font-mono opacity-60">⌘Q</span>
                </button>
              </div>
            )}
          </div>

          {/* Navigation Anchor Breadcrumb: [ 🏠 Desktop ] > [ Active App ] */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={toggleShowDesktop}
              className={`px-2 py-0.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                !areAnyWindowsVisible
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold'
                  : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              title="Show Clean Desktop (Minimize All Windows)"
            >
              <Home className="w-3 h-3 text-emerald-400" />
              <span>Desktop</span>
            </button>

            {activeApp && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-600 shrink-0" />
                <span className="font-bold text-white truncate max-w-[220px]">
                  {activeApp.title}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 hidden sm:inline">
                  RUNNING
                </span>
              </>
            )}
          </div>

          {/* Fast App Switcher Bar */}
          <div className="hidden lg:flex items-center gap-1 ml-2 pl-2 border-l border-zinc-800">
            {windows
              .filter((w) => w.isOpen)
              .map((w) => (
                <button
                  key={w.id}
                  onClick={() => focusWindow(w.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    activeWindowId === w.id && !w.isMinimized
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {w.title.split('·')[0].trim()}
                </button>
              ))}
          </div>
        </div>

        {/* Center: Tenant & Core Status */}
        <div className="hidden xl:flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-white">{currentTenant.name}</strong> · FREESWITCH ANYCAST (1000 CPS)
          </span>
        </div>

        {/* Right: Status Tray & Spotlight */}
        <div className="flex items-center gap-2.5 font-mono text-xs text-zinc-300">
          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">BGP ANYCAST</span>
          </div>

          <div className="flex items-center gap-1 text-zinc-400">
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">82%</span>
          </div>

          {/* Command Palette Launcher (⌘K) */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-mono px-1.5"
              title="Global Command Palette (⌘K)"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline text-[10px] text-zinc-400">⌘K</span>
            </button>
          )}

          {/* Spotlight Search Launcher (⌘Space) */}
          <button
            onClick={() => setIsSpotlightOpen(true)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Spotlight Search (⌘Space)"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Control Center Launcher */}
          <button
            onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="Hardware & Telecom Control Center"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Clock */}
          <span className="text-white font-medium pl-1 hidden xs:inline">{currentTime}</span>
        </div>
      </header>

      {/* =========================================================================
          3. CLEAN DESKTOP CANVAS — ZERO APPS ON DESKTOP, APPS LIVE IN FLOATING DOCK
          ========================================================================= */}
      <main className="flex-1 relative overflow-hidden">
        {/* Clean Desktop Surface (Pristine backdrop with zero app icons on canvas) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
          <div className="text-center space-y-4 px-6 max-w-xl opacity-90">
            {/* Sovereign Monogram */}
            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-800/90 border border-zinc-650/80 shadow-2xl flex items-center justify-center text-emerald-400 font-black text-2xl tracking-tighter backdrop-blur-md">
              M
            </div>

            {/* Ambient Time */}
            <div className="text-5xl sm:text-6xl font-extralight tracking-tight text-white font-sans drop-shadow-sm">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>

            {/* System Identity & Organization */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-zinc-200 font-sans tracking-wider uppercase drop-shadow-xs">
                Mandela Pan-African Operating System
              </div>
              <div className="text-[11px] text-zinc-300 font-mono">
                {currentTenant.name} · {currentTenant.subscription.displayName} · Kernel 6.8 RT-PREEMPT
              </div>
            </div>

            {/* Clear Guidance Cue */}
            <div className="text-[11px] text-zinc-300/90 font-mono pt-2">
              Launch applications from the floating icon bar below · <span className="text-emerald-300 font-bold">⌘Space</span> for Spotlight
            </div>
          </div>
        </div>

        {/* Floating Multi-Windows */}
        {windows.map((win) => {
          if (!win.isOpen || win.isMinimized) return null;

          const Icon = win.icon;
          const isActive = activeWindowId === win.id;

          const style: React.CSSProperties = win.isMaximized
            ? {
                top: 0,
                left: 0,
                width: '100%',
                height: shouldHideFoundation ? '100%' : 'calc(100% - 72px)',
                zIndex: win.zIndex
              }
            : {
                top: `${win.position.y}px`,
                left: `${win.position.x}px`,
                width: `${win.size.width}px`,
                height: `${win.size.height}px`,
                zIndex: win.zIndex
              };

          return (
            <div
              key={win.id}
              onClick={() => focusWindow(win.id)}
              style={style}
              className={`absolute flex flex-col overflow-hidden shadow-2xl transition-all duration-150 ${
                win.isMaximized && shouldHideFoundation ? 'rounded-none' : 'rounded-xl'
              } ${
                isActive
                  ? 'border border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-emerald-950/50'
                  : 'border border-zinc-800/80 shadow-black/80 opacity-95'
              }`}
            >
              {/* Apple macOS Style Window Titlebar with Traffic Lights */}
              <div
                className={`h-9.5 px-3.5 flex items-center justify-between select-none cursor-grab active:cursor-grabbing border-b ${
                  isActive
                    ? 'bg-zinc-900/95 border-zinc-750 text-white'
                    : 'bg-zinc-950/95 border-zinc-800 text-zinc-400'
                }`}
                onDoubleClick={(e) => toggleMaximizeWindow(win.id, e)}
              >
                {/* Left: Traffic Lights (Red, Yellow, Green) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => closeWindow(win.id, e)}
                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-600 flex items-center justify-center text-[8px] text-red-950 opacity-80 hover:opacity-100 cursor-pointer"
                    title="Close Application"
                  >
                    ✕
                  </button>
                  <button
                    onClick={(e) => minimizeWindow(win.id, e)}
                    className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 border border-amber-600 flex items-center justify-center text-[8px] text-amber-950 opacity-80 hover:opacity-100 cursor-pointer"
                    title="Minimize to Dock"
                  >
                    –
                  </button>
                  <button
                    onClick={(e) => toggleMaximizeWindow(win.id, e)}
                    className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 border border-emerald-600 flex items-center justify-center text-[8px] text-emerald-950 opacity-80 hover:opacity-100 cursor-pointer"
                    title={win.isMaximized ? 'Restore Window' : 'Zoom Window'}
                  >
                    +
                  </button>
                </div>

                {/* Center: Title & Strategic Function Tooltip & Auto-Hide Control */}
                <div className="flex items-center gap-2 text-xs font-semibold truncate px-4">
                  <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{win.title}</span>
                  <span className="text-[10px] text-zinc-500 font-mono font-normal truncate hidden sm:inline">
                    · {win.strategicFunction.slice(0, 50)}...
                  </span>

                  {win.isMaximized && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFoundationPinned(!isFoundationPinned);
                      }}
                      className="ml-2 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 hover:text-white bg-zinc-800/90 hover:bg-zinc-750 transition-colors cursor-pointer border border-zinc-700/80"
                      title={
                        isFoundationPinned
                          ? 'OS Foundation is Pinned. Click to enable Auto-Hide'
                          : 'OS Foundation Auto-Hides (hover screen edges to reveal). Click to Pin'
                      }
                    >
                      <Eye className={`w-3 h-3 ${isFoundationPinned ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span className="hidden md:inline">
                        {isFoundationPinned ? 'Foundation: Pinned' : 'Foundation: Auto-Hidden'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Right: Maximize / Minimize controls */}
                <div className="flex items-center gap-1.5 opacity-60 hover:opacity-100">
                  <button
                    onClick={(e) => toggleMaximizeWindow(win.id, e)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-300"
                  >
                    {win.isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* Window Body Container with Startup Kernel & First-Principle Navigation */}
              <div className="flex-1 overflow-hidden bg-zinc-950 select-text flex flex-col">
                <AppKernelShell
                  appId={win.appId}
                  appName={win.title}
                  strategicFunction={win.strategicFunction}
                  currentTenant={currentTenant}
                  onClose={() => closeWindow(win.id)}
                  onSwitchPortalMode={onSwitchPortalMode}
                  onOpenTenantModal={onOpenTenantModal}
                  onOpenOnboarding={onOpenOnboarding}
                  onOpenApp={openApp}
                >
                  {win.appId === 'pan_africa_numbers' && (
                    <PanAfricaNumberInventoryView
                      currentTenant={currentTenant}
                      onOpenSoftphone={onOpenSoftphone}
                      onOpenVoiceIvr={() => openApp('workflow_builder')}
                      onOpenMessaging={() => openApp('terminal')}
                    />
                  )}
                  {win.appId === 'command_control' && <CommandControlDashboard />}
                  {win.appId === 'agent_builder' && <AgentBuilderStudio />}
                  {win.appId === 'workflow_builder' && (
                    <VisualWorkflowBuilder
                      onOpenSoftphone={onOpenSoftphone}
                      onOpenOnboarding={onOpenOnboarding}
                    />
                  )}
                  {win.appId === 'providers' && <ProviderRegistryView />}
                  {win.appId === 'recordings' && <CallRecordingsAnalyticsView />}
                  {win.appId === 'dev_console' && <DeveloperConsoleView />}
                  {win.appId === 'terminal' && <MandelaShellTerminal />}
                  {win.appId === 'task_manager' && <SystemTaskManager />}
                  {win.appId === 'file_explorer' && <TelecomFileExplorer />}
                  {win.appId === 'architecture' && (
                    <div className="p-4 bg-zinc-950 h-full flex flex-col items-center justify-center space-y-3">
                      <img
                        src="/assets/aistudio/1_d037196d.jpg"
                        alt="Mandela Core Architecture"
                        className="max-h-[80%] rounded-xl border border-zinc-800 shadow-2xl object-contain"
                      />
                      <div className="text-xs text-zinc-400 font-mono text-center">
                        Carrier Trunk → FreeSWITCH Media (1000 CPS) + RTPEngine → Call Control (NCCO) → ASR/TTS (50 African Languages) → AI Layer
                      </div>
                    </div>
                  )}
                  {(win.appId === 'multi_ai_gateway' || win.appId === 'mcp_gateway') && (
                    <MultiAiMcpGatewaySuite
                      currentTenant={currentTenant}
                      onOpenApp={openApp}
                    />
                  )}
                </AppKernelShell>
              </div>
            </div>
          );
        })}

        {/* Clean Application Launcher Modal matching OS Desktop screenshot */}
        <CleanAppLauncherModal
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
          onLaunchApp={(appId) => {
            setIsStartMenuOpen(false);
            openApp(appId);
          }}
          onOpenDesignSystem={onOpenDesignSystem}
        />
      </main>

      {/* Invisible Bottom Edge Hover Trigger Zone: reveals OS dock when app is expanded */}
      {shouldHideFoundation && (
        <div
          onMouseEnter={() => setIsDockHovered(true)}
          className="fixed bottom-0 left-0 right-0 h-2.5 z-60 pointer-events-auto cursor-pointer"
          title="Move mouse to bottom edge to reveal OS dock"
        />
      )}

      {/* =========================================================================
          4. APPLE macOS-STYLE FLOATING DOCK — AUTO-HIDES WHEN APP EXPANDS
          ========================================================================= */}
      <footer
        onMouseLeave={() => setIsDockHovered(false)}
        className={`h-18 flex items-center justify-between px-6 pb-2 z-40 shrink-0 pointer-events-none transition-all duration-300 ease-in-out ${
          showDock
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0'
        }`}
      >
        {/* Left: Dock Size Scaler Control */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 text-[10px] font-mono bg-zinc-900/80 backdrop-blur-md px-2 py-1 rounded-lg border border-zinc-800 text-zinc-400">
          <span>DOCK:</span>
          {(['normal', 'large', 'xl'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setDockIconSize(s)}
              className={`px-1.5 py-0.5 rounded uppercase font-bold cursor-pointer transition-colors ${
                dockIconSize === s ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'hover:text-white'
              }`}
            >
              {s === 'xl' ? 'XL' : s === 'large' ? 'LG' : 'MD'}
            </button>
          ))}
        </div>

        {/* Center: Translucent Floating Dock (All Apps Accessible Here) */}
        <div className="pointer-events-auto h-14 sm:h-16 px-3 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-zinc-700/80 shadow-2xl flex items-center gap-1.5 sm:gap-2 mx-auto max-w-[95vw] overflow-x-auto scrollbar-none">
          {/* Start Launcher Tile (9-dot App Launcher Grid matching OS screenshot) */}
          <button
            onClick={() => {
              setIsStartMenuOpen(!isStartMenuOpen);
              setIsAppleMenuOpen(false);
            }}
            className={`${dockSizeClasses[dockIconSize]} rounded-2xl bg-zinc-800/90 hover:bg-emerald-500 hover:scale-115 text-zinc-300 hover:text-zinc-950 flex items-center justify-center border border-zinc-700/80 shadow-lg transition-all cursor-pointer shrink-0`}
            title="Application Launcher (Click or press ⌘Space)"
          >
            <LayoutGrid className={dockIconDimensions[dockIconSize]} />
          </button>

          <div className="h-8 w-[1px] bg-zinc-700/80 mx-0.5" />

          {/* Canonical Dock App Items */}
          {OS_APPLICATIONS_REGISTRY.map((app) => {
            const AppIcon = app.icon;
            const targetWin = windows.find((w) => w.appId === app.appId);
            const isRunning = targetWin?.isOpen;
            const isActive = targetWin?.id === activeWindowId && targetWin.isOpen && !targetWin.isMinimized;

            return (
              <button
                key={app.appId}
                onClick={() => {
                  if (targetWin?.isOpen && !targetWin.isMinimized && activeWindowId === targetWin.id) {
                    minimizeWindow(targetWin.id);
                  } else {
                    openApp(app.appId);
                  }
                }}
                className={`relative ${dockSizeClasses[dockIconSize]} rounded-2xl flex items-center justify-center transition-all duration-200 hover:scale-120 hover:-translate-y-2 cursor-pointer group ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-zinc-850/80 text-zinc-300 hover:text-white hover:bg-zinc-750'
                }`}
                title={app.appName}
              >
                <AppIcon className={dockIconDimensions[dockIconSize]} />

                {/* Running App Dot */}
                {isRunning && (
                  <span
                    className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-emerald-400 ring-2 ring-emerald-500/30' : 'bg-zinc-400'
                    }`}
                  />
                )}

                {/* Hover Tooltip with Strategic Function */}
                <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-950 text-white text-[11px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none border border-zinc-700 shadow-xl transition-opacity flex flex-col items-center">
                  <span>{app.appName}</span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase font-normal">{app.category.replace('_', ' ')}</span>
                </div>
              </button>
            );
          })}

          <div className="h-8 w-[1px] bg-zinc-700/80 mx-0.5" />

          {/* Clean Desktop Trigger Icon */}
          <button
            onClick={toggleShowDesktop}
            className={`${dockSizeClasses[dockIconSize]} rounded-2xl bg-zinc-850 hover:bg-zinc-750 text-zinc-300 hover:text-emerald-400 flex items-center justify-center transition-all hover:scale-115 hover:-translate-y-1.5 cursor-pointer group relative`}
            title={areAnyWindowsVisible ? 'Show Clean Desktop' : 'Restore Open Windows'}
          >
            <Home className={dockIconDimensions[dockIconSize]} />
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-zinc-950 text-white text-[11px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none border border-zinc-700 shadow-xl transition-opacity">
              {areAnyWindowsVisible ? 'Show Desktop' : 'Restore Windows'}
            </div>
          </button>
        </div>

        {/* Right: Windows-style Peek Desktop Sliver */}
        <div className="pointer-events-auto hidden md:flex items-center">
          <button
            onClick={toggleShowDesktop}
            className="w-3 h-10 border-l border-zinc-700/80 hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Peek Desktop (Minimize All)"
          />
        </div>
      </footer>

      {/* Control Center Modal */}
      <ControlCenterModal
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        onOpenApp={openApp}
      />

      {/* Spotlight Search Modal (⌘Space) */}
      <SpotlightSearchModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={openApp}
      />
    </div>
  );
};
