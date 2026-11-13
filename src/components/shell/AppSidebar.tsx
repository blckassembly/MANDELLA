import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Layers,
  Database,
  ShieldCheck,
  Activity,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { MandelaApplication, MandelaModule } from '../../types/mandelaOS';

export interface AppSidebarProps {
  application: MandelaApplication;
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
  onReturnToLaunchpad: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  application,
  activeModuleId,
  onSelectModule,
  onReturnToLaunchpad,
  isCollapsed,
  onToggleCollapse
}) => {
  const AppIcon = application.icon;

  return (
    <aside
      className={`${
        isCollapsed ? 'w-18' : 'w-80 sm:w-88'
      } shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-200 select-none z-30 overflow-hidden font-sans`}
    >
      {/* 1. Upper: Application Identity Banner */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
        {!isCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-amber-400 shrink-0 shadow-md">
              <AppIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold border border-zinc-700">
                  {application.code}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-zinc-300 uppercase font-semibold truncate">
                  {application.category}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate mt-1 tracking-tight" title={application.name}>
                {application.name}
              </h2>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto" title={application.name}>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-amber-400">
              <AppIcon className="w-5 h-5" />
            </div>
          </div>
        )}

        {/* Collapse / Expand Toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0 ml-auto border border-zinc-800 hover:border-zinc-700"
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation to icon rail'}
        >
          {isCollapsed ? <ChevronRight className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* 2. Middle: Persistent Application Modules Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1.5 flex items-center justify-between text-xs font-mono uppercase text-zinc-300 font-bold tracking-wider">
            <span>Modules &amp; Workspaces</span>
            <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded text-[11px] font-bold border border-zinc-800">{application.modules.length}</span>
          </div>
        )}

        {application.modules.map((module) => {
          const isActive = activeModuleId === module.id;
          const ModuleIcon = module.icon;

          if (isCollapsed) {
            return (
              <button
                key={module.id}
                onClick={() => onSelectModule(module.id)}
                className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all cursor-pointer relative group ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                }`}
                title={`${module.label} — ${module.description}`}
              >
                <ModuleIcon className="w-5 h-5" />
                {/* Tooltip on hover when collapsed */}
                <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-700 text-zinc-100 text-sm font-semibold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                  {module.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className={`w-full px-3.5 py-3 rounded-xl text-left flex items-center justify-between transition-all cursor-pointer group ${
                isActive
                  ? 'bg-zinc-900 text-white font-bold border-l-3 border-amber-400 shadow-md ring-1 ring-zinc-800'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900/70 border-l-3 border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200 group-hover:bg-zinc-850'}`}>
                  <ModuleIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className={`text-sm sm:text-base leading-snug truncate ${isActive ? 'font-bold text-white' : 'font-semibold text-zinc-200 group-hover:text-white'}`}>
                    {module.label}
                  </div>
                  {module.description && (
                    <div className="text-xs text-zinc-400 font-normal truncate mt-0.5 leading-tight group-hover:text-zinc-300">
                      {module.description}
                    </div>
                  )}
                </div>
              </div>

              {module.badge ? (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 shrink-0">
                  {module.badge}
                </span>
              ) : isActive ? (
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/50" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 3. Lower: Bound Microservices & Permanent "← All Applications" Control */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-900/60 space-y-2 shrink-0">
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Data Sources:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{application.dataSources.length} Connected</span>
              </span>
            </div>
          </div>
        )}

        {/* Permanent Return to All Applications Directory */}
        <button
          onClick={onReturnToLaunchpad}
          className={`w-full py-2.5 rounded-xl text-sm font-mono font-bold flex items-center justify-center gap-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-amber-300 border border-zinc-800 hover:border-amber-500/40 transition-colors cursor-pointer shadow-md ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
          title="Return to global 30-application directory"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
          {!isCollapsed && <span>All Applications</span>}
        </button>
      </div>
    </aside>
  );
};
