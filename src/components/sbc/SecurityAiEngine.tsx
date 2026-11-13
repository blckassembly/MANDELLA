import React, { useState } from 'react';
import { SbcGlobalAcl, SbcAiAlert, PopCode } from '../../types/sbc';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Lock,
  Globe,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface SecurityAiEngineProps {
  acls: SbcGlobalAcl[];
  alerts: SbcAiAlert[];
  onAddAcl: (acl: Omit<SbcGlobalAcl, 'id' | 'createdAt' | 'syncStatus' | 'matchedPacketsLastHour'>) => void;
  onRemoveAcl: (id: string) => void;
  onResolveAlert: (alertId: string) => void;
  onQuickBlockCidr: (cidr: string, reason: string) => void;
}

export const SecurityAiEngine: React.FC<SecurityAiEngineProps> = ({
  acls,
  alerts,
  onAddAcl,
  onRemoveAcl,
  onResolveAlert,
  onQuickBlockCidr
}) => {
  const [showAddAclModal, setShowAddAclModal] = useState(false);
  const [newCidr, setNewCidr] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newAction, setNewAction] = useState<SbcGlobalAcl['action']>('block');
  const [quickBlockInput, setQuickBlockInput] = useState('10.0.0.0/8');
  const [isPushingAcl, setIsPushingAcl] = useState(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  const handleAddAclSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCidr.trim()) return;

    onAddAcl({
      cidr: newCidr.trim(),
      action: newAction,
      reason: newReason.trim() || 'Manual Security Operator ACL Rule',
      appliedBy: 'SecOps Officer (Dual-Controlled)',
      activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH']
    });

    setNewCidr('');
    setNewReason('');
    setShowAddAclModal(false);
  };

  const handleTriggerQuickBlock = () => {
    if (!quickBlockInput.trim()) return;
    setIsPushingAcl(true);
    setPushStatusMessage(`Pushing BGP/SBC ACL for ${quickBlockInput} to 6 African PoPs...`);

    setTimeout(() => {
      onQuickBlockCidr(quickBlockInput.trim(), 'Fraud spike emergency block via NOC 1-Click');
      setIsPushingAcl(false);
      setPushStatusMessage(`✓ ACL ${quickBlockInput} successfully applied across all 6 PoPs in 1.4s`);
      setTimeout(() => setPushStatusMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">SBC Threat Intelligence, AI Fraud Shield & Global ACL</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 5.5, 8 & 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Atomic sub-30 second ACL push to all 6 PoPs. Real-time AI detection of SIP scanning, toll fraud spikes, and registration floods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddAclModal(true)}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create ACL Rule</span>
          </button>
        </div>
      </div>

      {/* NOC One-Click Global Emergency Action (PRD Section 4.3 & 10 Quote!) */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              NOC One-Click Global Emergency Action — Atomic ACL Push
            </h3>
          </div>
          <span className="text-[10px] font-mono text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
            Push Target &lt; 30 Seconds Across 6 PoPs
          </span>
        </div>

        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          As mandated in PRD Section 4.3 &amp; 10: “Block 10.0.0.0/8, fraud spike” command pushes immediately to Kamailio iptables, BGP Flowspec, and SBC rate-limiters in Lagos, Nairobi, Johannesburg, Cairo, Dakar, and Kinshasa.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={quickBlockInput}
              onChange={(e) => setQuickBlockInput(e.target.value)}
              placeholder="Enter IP or CIDR (e.g. 10.0.0.0/8, 45.142.122.9/32)"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
            />
          </div>
          <button
            onClick={handleTriggerQuickBlock}
            disabled={isPushingAcl}
            className="w-full sm:w-auto py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
          >
            {isPushingAcl ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Broadcasting to Anycast Edge...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Push Global ACL Block</span>
              </>
            )}
          </button>
        </div>

        {pushStatusMessage && (
          <div className="text-[11px] font-mono text-emerald-400 font-semibold pt-1">
            {pushStatusMessage}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Global ACL Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase tracking-wider font-mono">
              Active Global ACL Entries ({acls.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">
              ✓ Synced to 6 African PoPs
            </span>
          </div>

          <div className="space-y-3">
            {acls.map((acl) => (
              <div
                key={acl.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      acl.action === 'block'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {acl.action}
                    </span>
                    <strong className="text-white text-xs">{acl.cidr}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {acl.matchedPacketsLastHour.toLocaleString()} drops/hr
                    </span>
                    <button
                      onClick={() => onRemoveAcl(acl.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Remove ACL rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {acl.reason}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-500">
                  <span>Applied by: {acl.appliedBy}</span>
                  <span>Active PoPs: LOS · NBO · JNB · CAI · DKR · FIH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Attack & Capacity Feed (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase tracking-wider font-mono">
                AI Detection & Predictions
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300">Heuristics v4.2</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                    alert.severity === 'critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                      : alert.severity === 'high'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                  }`}>
                    {alert.severity} · {alert.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {alert.timestamp}
                  </span>
                </div>

                <h4 className="font-bold text-white text-xs">{alert.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {alert.description}
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-emerald-400 truncate max-w-[200px]">
                    Action: {alert.suggestedAction}
                  </span>
                  {alert.status === 'pending' ? (
                    <button
                      onClick={() => onResolveAlert(alert.id)}
                      className="py-1 px-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded transition-colors"
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="text-slate-500 font-semibold">Resolved</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add ACL */}
      {showAddAclModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create Global SBC ACL Rule</h3>
              <button
                onClick={() => setShowAddAclModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAclSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">IP / CIDR Block</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 185.220.101.0/24 or 45.142.122.9/32"
                  value={newCidr}
                  onChange={(e) => setNewCidr(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Action</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                >
                  <option value="block">Block (Drop SIP & RTP)</option>
                  <option value="allow">Allow (Bypass Inspection)</option>
                  <option value="rate_limit">Rate Limit (Token Bucket 5 CPS)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason / Attack Signature</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-rate toll fraud attempt or scanner flood"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAclModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Deploy to All 6 PoPs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
