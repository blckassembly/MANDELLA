import React from 'react';
import {
  X,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Lock,
  Download,
  AlertTriangle
} from 'lucide-react';
import { WorkspaceRecordItem } from '../../types/mandelaOS';

export interface RecordDetailsDrawerProps {
  record: WorkspaceRecordItem | null;
  onClose: () => void;
  onAction?: (actionId: string, record: WorkspaceRecordItem) => void;
}

export const RecordDetailsDrawer: React.FC<RecordDetailsDrawerProps> = ({
  record,
  onClose,
  onAction
}) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!record) return null;

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <aside className="w-80 sm:w-96 bg-white border-l border-neutral-200 flex flex-col shrink-0 z-30 shadow-xl overflow-hidden font-sans">
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-700 uppercase">
            <span>Record Details</span>
            <span>·</span>
            <span>{record.category || 'Entity'}</span>
          </div>
          <h3 className="text-sm font-bold text-neutral-900 truncate mt-0.5" title={record.title}>
            {record.title}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {/* Status & Provenance Card */}
        <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-neutral-500">Status:</span>
            <span
              className={`font-bold ${
                record.status === 'ACTIVE'
                  ? 'text-emerald-700'
                  : record.status === 'WARNING'
                  ? 'text-amber-700'
                  : 'text-neutral-700'
              }`}
            >
              {record.status}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-neutral-500">Last Synced:</span>
            <span className="text-neutral-800 tabular-nums">{record.lastUpdated}</span>
          </div>

          <div className="pt-2 border-t border-neutral-200/70 text-[10px] font-mono text-neutral-500">
            <div className="text-neutral-400 mb-0.5">Cryptographic Provenance:</div>
            <div className="text-neutral-700 truncate" title={record.provenance}>
              {record.provenance}
            </div>
          </div>
        </div>

        {/* Dynamic Attributes Grid */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-mono uppercase font-bold text-neutral-500">
            Configuration Attributes
          </h4>

          <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 overflow-hidden bg-white">
            {Object.entries(record.attributes).map(([k, v]) => (
              <div key={k} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                <span className="text-neutral-500 font-mono text-[11px] capitalize truncate">
                  {k.replace(/([A-Z])/g, ' $1')}
                </span>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-neutral-900 truncate max-w-[140px] text-right font-medium">
                    {String(v)}
                  </span>
                  <button
                    onClick={() => handleCopy(String(v), k)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                    title="Copy value"
                  >
                    {copiedKey === k ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Controls & Permissions */}
        <div className="space-y-2 pt-2 border-t border-neutral-200">
          <h4 className="text-[11px] font-mono uppercase font-bold text-neutral-500">
            Authorized Operations
          </h4>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            <button
              onClick={() => onAction && onAction('activate', record)}
              className="py-1.5 px-3 rounded bg-neutral-900 hover:bg-neutral-800 text-white font-bold transition-colors cursor-pointer text-center"
            >
              Synchronize
            </button>
            <button
              onClick={() => onAction && onAction('export_json', record)}
              className="py-1.5 px-3 rounded bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 font-bold transition-colors cursor-pointer text-center"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
