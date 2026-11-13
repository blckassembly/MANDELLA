import React, { useState } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Download,
  Plus,
  Radio,
  ExternalLink
} from 'lucide-react';
import { MandelaApplication, MandelaModule } from '../../types/mandelaOS';

export interface WorkspaceHeaderProps {
  application: MandelaApplication;
  module: MandelaModule;
  onRefresh?: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  sourceStatus?: 'CONNECTED' | 'SYNCHRONIZED' | 'DEGRADED';
  isRefreshing?: boolean;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  application,
  module,
  onRefresh,
  onPrimaryAction,
  primaryActionLabel,
  sourceStatus = 'CONNECTED',
  isRefreshing = false
}) => {
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  const handleRefreshClick = () => {
    setLastRefreshedAt(
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    if (onRefresh) onRefresh();
  };

  const actionText = primaryActionLabel || module.primaryActionLabel;

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-xs">
      {/* Title & Context */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase tracking-wider">
            {application.code} · {application.shortName}
          </span>
          <span className="text-neutral-300">/</span>
          <span className="text-[11px] font-mono text-amber-700 font-bold uppercase">
            {module.workspaceType.toUpperCase()}
          </span>
        </div>

        <h1 className="text-lg font-bold text-neutral-900 tracking-tight mt-0.5">
          {module.label}
        </h1>
        <p className="text-xs text-neutral-500 mt-0.5 max-w-2xl">
          {module.description}
        </p>
      </div>

      {/* Right Controls: Data Status, Timestamp, Refresh & Action Button */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Source Telemetry Status */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-neutral-50 border border-neutral-200 text-[11px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              sourceStatus === 'CONNECTED'
                ? 'bg-emerald-500'
                : sourceStatus === 'SYNCHRONIZED'
                ? 'bg-cyan-500'
                : 'bg-amber-500'
            }`}
          />
          <span className="text-neutral-700 font-semibold">{sourceStatus}</span>
          <span className="text-neutral-400">·</span>
          <span className="text-neutral-500 text-[10px]">Sync: {lastRefreshedAt}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          disabled={isRefreshing}
          className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 border border-neutral-200 transition-colors cursor-pointer"
          title="Refresh module data"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-600' : ''}`}
          />
        </button>

        {/* Primary Action Button (if applicable) */}
        {actionText && (
          <button
            onClick={onPrimaryAction}
            className="px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>{actionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
