import React, { useState } from 'react';
import { SbcHeaderRule } from '../../types/sbc';
import {
  Layers,
  Plus,
  Trash2,
  CheckCircle2,
  Settings,
  Code,
  ShieldCheck,
  Zap,
  Sliders,
  Copy,
  Check
} from 'lucide-react';

interface HeaderRulesEditorProps {
  rules: SbcHeaderRule[];
  onToggleRule: (id: string) => void;
  onAddRule: (rule: Omit<SbcHeaderRule, 'id'>) => void;
  onDeleteRule: (id: string) => void;
}

export const HeaderRulesEditor: React.FC<HeaderRulesEditorProps> = ({
  rules,
  onToggleRule,
  onAddRule,
  onDeleteRule
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedKamailio, setCopiedKamailio] = useState(false);
  const [mediaBypassEnabled, setMediaBypassEnabled] = useState(true);
  const [dispatcherAlgorithm, setDispatcherAlgorithm] = useState<'round_robin' | 'call_id_hash' | 'least_loaded'>('call_id_hash');

  // Form State
  const [ruleName, setRuleName] = useState('');
  const [description, setDescription] = useState('');
  const [headerName, setHeaderName] = useState<SbcHeaderRule['headerName']>('P-Asserted-Identity');
  const [action, setAction] = useState<SbcHeaderRule['action']>('pass_through');
  const [direction, setDirection] = useState<SbcHeaderRule['direction']>('ingress');
  const [targetValue, setTargetValue] = useState('');

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    onAddRule({
      name: ruleName.trim(),
      description: description.trim() || 'Custom SBC header normalization rule',
      customerId: '*',
      direction,
      headerName,
      action,
      targetValue: targetValue.trim() || undefined,
      status: 'active',
      priority: rules.length + 1
    });

    setRuleName('');
    setDescription('');
    setTargetValue('');
    setShowAddModal(false);
  };

  const getKamailioCfgSnippet = () => {
    return `# /etc/kamailio/kamailio.cfg — Mandela SBC Header Normalization
route[SBC_NORMALIZE_HEADERS] {
    # Topology Hiding: Hide internal IPs and carrier routing
    remove_hf("Via");
    insert_hf("Via: SIP/2.0/TLS 102.134.88.10:5061;branch=$branch;rport\\r\\n");

    # P-Asserted-Identity Handling (PRD §5.2)
    if (is_present_hf("P-Asserted-Identity")) {
        $var(pai) = @hf_value.p_asserted_identity;
        xlog("L_INFO", "SBC: Ingress PAI verified: $var(pai)\\n");
    }

    # Privacy Anonymization
    if ($hdr(Privacy) == "id") {
        uac_replace_from("", "sip:anonymous@anonymous.invalid");
    }

    # RTPEngine Media Mode: ${mediaBypassEnabled ? 'Direct Media Bypass' : 'Full Media Relay'}
    ${mediaBypassEnabled ? 'rtpengine_offer("replace-origin replace-session-connection media-handover");' : 'rtpengine_offer("replace-origin replace-session-connection trust-address");'}

    # Dispatcher Routing (${dispatcherAlgorithm})
    ds_select_dst("1", "${dispatcherAlgorithm === 'call_id_hash' ? '4' : '0'}");
    t_on_failure("DISPATCH_FAILOVER");
}`;
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(getKamailioCfgSnippet());
    setCopiedKamailio(true);
    setTimeout(() => setCopiedKamailio(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">SBC Header Normalization & Kamailio Dispatcher</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 5.2 & 5.4</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Topology hiding, PAI verification, privacy masking, and carrier interoperability fixes applied atomically across all 6 African PoPs.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Header Rule</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Header Rules List (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase tracking-wider font-mono">
              Active Header Manipulation Rules ({rules.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Atomic Sync &lt; 30s</span>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                  rule.status === 'active'
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-bold">
                      {rule.priority}
                    </span>
                    <strong className="text-white text-xs">{rule.name}</strong>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/30 font-bold">
                      {rule.headerName}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition-colors ${
                        rule.status === 'active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {rule.status}
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                      title="Delete rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {rule.description}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Direction:</span>
                    <span className="text-white capitalize">{rule.direction}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Action:</span>
                    <span className="text-amber-300 capitalize">{rule.action.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target Pattern:</span>
                    <span className="text-emerald-400 truncate block">{rule.targetValue || 'Any'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dispatcher Settings & Kamailio Live CFG (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Dispatcher & Media Proxy Settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-white uppercase tracking-wider text-xs">
                RTPEngine & Dispatcher Policies
              </h3>
            </div>

            <div className="space-y-3">
              {/* Media Bypass Toggle */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block">Direct Media Bypass</span>
                  <span className="text-[11px] text-slate-400">
                    Allows RTP audio directly between PBX & Carrier where NAT permits for minimum latency.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMediaBypassEnabled(!mediaBypassEnabled)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                    mediaBypassEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      mediaBypassEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Load Balancing Algorithm */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Kamailio Dispatcher Algorithm
                </label>
                <select
                  value={dispatcherAlgorithm}
                  onChange={(e) => setDispatcherAlgorithm(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="call_id_hash">Call-ID Consistent Hashing (Algorithm 4)</option>
                  <option value="round_robin">Round-Robin (Algorithm 0)</option>
                  <option value="least_loaded">Least-Loaded FreeSWITCH Node (Algorithm 9)</option>
                </select>
                <span className="text-[10px] text-emerald-400 mt-1 block font-mono">
                  ✓ Automatic failover to secondary node upon SIP 500/503 response
                </span>
              </div>
            </div>
          </div>

          {/* Compiled Kamailio Route Script */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase font-mono">
                  Compiled Kamailio Route Block
                </span>
              </div>
              <button
                onClick={handleCopyConfig}
                className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono flex items-center gap-1"
              >
                {copiedKamailio ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>

            <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400/90 overflow-x-auto leading-relaxed max-h-56">
              {getKamailioCfgSnippet()}
            </pre>
          </div>
        </div>
      </div>

      {/* Modal: Add Rule */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create SBC Header Normalization Rule</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Normalize PAI for Enterprise PBX"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target SIP Header</label>
                  <select
                    value={headerName}
                    onChange={(e) => setHeaderName(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="P-Asserted-Identity">P-Asserted-Identity</option>
                    <option value="Privacy">Privacy</option>
                    <option value="Diversion">Diversion</option>
                    <option value="User-Agent">User-Agent</option>
                    <option value="X-Mandela-Tenant">X-Mandela-Tenant</option>
                    <option value="Custom">Custom Header</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Action</label>
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="pass_through">Pass Through</option>
                    <option value="overwrite">Overwrite / Replace</option>
                    <option value="strip">Strip / Remove</option>
                    <option value="anonymize">Anonymize</option>
                    <option value="prepend">Prepend</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Direction</label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  >
                    <option value="ingress">Ingress (PBX → SBC)</option>
                    <option value="egress">Egress (SBC → PBX / PSTN)</option>
                    <option value="both">Both Directions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Value / Pattern</label>
                  <input
                    type="text"
                    placeholder="e.g. <sip:$fwd@sip.mandela.africa>"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Explain why this header rule is necessary for interoperability..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg"
                >
                  Deploy Rule to 6 PoPs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
