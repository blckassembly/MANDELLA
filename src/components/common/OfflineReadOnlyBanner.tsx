import React from 'react';
import { WifiOff, Database, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';

export interface OfflineReadOnlyBannerProps {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline?: () => void;
  lastOnlineAt: string;
}

export const OfflineReadOnlyBanner: React.FC<OfflineReadOnlyBannerProps> = ({
  isOnline,
  isSimulatedOffline,
  onToggleSimulateOffline,
  lastOnlineAt
}) => {
  if (isOnline) {
    return null;
  }

  const formattedTime = new Date(lastOnlineAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="w-full bg-amber-500 text-black border-b border-amber-600 px-4 py-2.5 shadow-sm transition-all animate-in fade-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider bg-black text-amber-400 px-2 py-0.5 rounded-[2px] shrink-0">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>OFFLINE READ-ONLY MODE</span>
          </div>

          <span className="font-semibold text-black/90 font-sans">
            Remote Infrastructure Offline Protection Active (Workbox Cache Synced).
          </span>

          <span className="text-black/75 hidden md:inline text-[11px] font-mono">
            All 11 system portals are viewable in read-only state. Mutations and provisioning triggers are locked to prevent remote state drift.
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono shrink-0 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-black/70 bg-amber-600/20 px-2 py-0.5 rounded-[2px] border border-amber-600/30">
            LAST SYNC: {formattedTime}
          </span>

          {onToggleSimulateOffline && isSimulatedOffline && (
            <button
              onClick={onToggleSimulateOffline}
              className="bg-black text-white hover:bg-zinc-800 px-2.5 py-1 rounded-[2px] font-mono font-semibold transition cursor-pointer flex items-center gap-1 text-[11px]"
              title="Return to real online network status"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Exit Simulation</span>
            </button>
          )}

          {!isSimulatedOffline && (
            <button
              onClick={() => window.location.reload()}
              className="bg-black text-white hover:bg-zinc-800 px-2.5 py-1 rounded-[2px] font-mono font-semibold transition cursor-pointer flex items-center gap-1 text-[11px]"
              title="Attempt to re-establish connection to African network gateway"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry Connection</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
