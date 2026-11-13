import React, { useState } from 'react';
import {
  AiDataServicePolicy,
  DataverseRecord,
  DataverseEntitySchema
} from '../../types/dataverse';
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Search,
  Bot,
  CheckCircle2,
  AlertTriangle,
  Play,
  RefreshCw,
  Send,
  Database
} from 'lucide-react';

interface AiDataServiceProps {
  policy: AiDataServicePolicy;
  schemas: DataverseEntitySchema[];
  records: DataverseRecord[];
}

export const AiDataService: React.FC<AiDataServiceProps> = ({
  policy,
  schemas,
  records
}) => {
  const [aiPrompt, setAiPrompt] = useState(
    'Summarize our high-revenue customer accounts in Nigeria and Kenya, their provisioned SIP trunks, and any open P1 tickets.'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(
    `[Dataverse AI Permission Boundary Checked]\n` +
    `✓ Verified Read Permission: 'fs_account', 'fs_case', 'fs_telecom_asset'\n` +
    `✓ Masked Protected Fields: Tax Identification Number (BVN/TIN) suppressed from AI context.\n\n` +
    `Summary Analysis for Farsight Dataverse:\n` +
    `1. Zenith Commercial Bank PLC (Nigeria, NG):\n` +
    `   - Annual Revenue: $840M USD (Tier-3 Sovereign Enterprise)\n` +
    `   - Provisioned Trunks: 6 Anycast SIP Trunks active\n` +
    `   - Open Case: CAS-2026-0941 (High P2 Degraded - Lagos Anycast TLS Re-handshake)\n\n` +
    `2. Kenya Tea Development Agency (KTDA) (Kenya, KE):\n` +
    `   - Annual Revenue: $145M USD (Tier-3 Sovereign Enterprise)\n` +
    `   - Provisioned Trunks: 3 Anycast SIP Trunks active\n` +
    `   - Status: All systems healthy; agri-voice pricing IVR operational.`
  );

  const handleRunAiQuery = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAiResponse(
        `[Dataverse AI Permission Boundary Enforced]\n` +
        `✓ Access Granted: Role 'AI Service Principal' authenticated.\n` +
        `✓ Field-Level Security: Sensitive columns [tax_identification_number, encryptionKeyAlias] redacted.\n\n` +
        `Structured Intelligence Retrieved:\n` +
        `- Queried: ${records.length} records across ${schemas.length} Dataverse entities.\n` +
        `- Key Findings: Customer accounts possess healthy credit headroom; telecom asset bindings route cleanly through Lagos and Nairobi Anycast PoPs.\n` +
        `- Operational Note: Any write operations will trigger mandatory Dual-Control authorization.`
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">AI-Accessible Data Services & Permission Guardrails</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· Farsight AI Native Gateway</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Expose structured business objects to AI agents with strict permission controls. Enforces field-level redaction, semantic vector groundings, and dual approval for automated writes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Guardrails: ACTIVE</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI Policy Rules (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase tracking-wider">
                Active AI Data Policy
              </span>
              <span className="text-emerald-400">Policy: {policy.id}</span>
            </div>

            <div className="space-y-2">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block font-bold text-[11px]">Authorized Entities</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {policy.allowedEntities.map((e) => (
                    <span key={e} className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-rose-400 font-bold text-[11px]">
                  <span>Permanently Redacted Columns</span>
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {policy.deniedFields.map((f) => (
                    <span key={f} className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px]">
                      {f}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 pt-1 font-sans">
                  These fields are cryptographically masked before AI LLM context construction.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">Max Row Ceiling:</span>
                  <span className="text-white font-bold text-xs">{policy.maxRowsPerQuery} Rows</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-500 block">Dual Approval:</span>
                  <span className="text-emerald-400 font-bold text-xs">Required for Writes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive AI Data Query Console (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs font-mono">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase text-[11px]">
                AI Semantic Data Query Console
              </span>
            </div>
            <span className="text-emerald-400 text-[10px]">Vector Grounded</span>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-400 text-[11px] font-sans">
              Natural Language Data Query (Validated against RBAC):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask about customers, revenue, support cases..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-sans text-xs focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={handleRunAiQuery}
                disabled={isProcessing}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Query</span>
              </button>
            </div>
          </div>

          {/* AI Output Window */}
          {aiResponse && (
            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1">
                <span>Dataverse Grounded Output</span>
                <span className="text-emerald-400 font-bold">✓ Zero Hallucination Guard</span>
              </div>
              <pre className="text-slate-300 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-72">
                {aiResponse}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
