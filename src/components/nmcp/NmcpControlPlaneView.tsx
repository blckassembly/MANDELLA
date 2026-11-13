import React, { useState, useEffect } from 'react';
import {
  NmcpContextSnapshot,
  NmcpAiUnderstanding,
  NmcpLayerState,
  NmcpTenantSlice,
  NmcpAnomalyEvent
} from '../../types/nmcp';
import { TenantAccount, EnterpriseProduct } from '../../types/multiTenant';
import {
  buildNmcpContextSnapshot,
  queryNmcpAiReasoning,
  INITIAL_NMCP_LAYERS
} from '../../services/nmcpContextService';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Layers,
  Server,
  Zap,
  RefreshCw,
  Send,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Radio,
  FileCode,
  Copy,
  Check,
  X,
  Play
} from 'lucide-react';

interface NmcpControlPlaneViewProps {
  tenants: TenantAccount[];
  currentTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  onNavigateToPortal?: (product: EnterpriseProduct) => void;
  onClose?: () => void;
  className?: string;
}

export const NmcpControlPlaneView: React.FC<NmcpControlPlaneViewProps> = ({
  tenants,
  currentTenantId,
  onSelectTenant,
  onNavigateToPortal,
  onClose,
  className = ''
}) => {
  // Active Tenant Filter in NMCP
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>(currentTenantId);

  // Active Tab inside the NMCP view
  const [activeTab, setActiveTab] = useState<'ai_reasoning' | 'layers_matrix' | 'tenant_slices' | 'json_schema'>('ai_reasoning');

  // Selected Reasoning Model
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');

  // Context Snapshot state
  const [snapshot, setSnapshot] = useState<NmcpContextSnapshot>(() => {
    return buildNmcpContextSnapshot({
      tenants,
      activeTenantId: currentTenantId
    });
  });

  // AI Understanding state
  const [aiUnderstanding, setAiUnderstanding] = useState<NmcpAiUnderstanding>(snapshot.aiUnderstanding);
  const [isAiReasoning, setIsAiReasoning] = useState<boolean>(false);
  const [customUserPrompt, setCustomUserPrompt] = useState<string>('');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Sync snapshot when tenant filter changes
  useEffect(() => {
    const updated = buildNmcpContextSnapshot({
      tenants,
      activeTenantId: selectedTenantFilter,
      overrides: {
        layers: snapshot.layers,
        activeAnomalies: snapshot.activeAnomalies
      }
    });
    setSnapshot(updated);
  }, [selectedTenantFilter, tenants]);

  // Execute AI Reasoning query
  const handleExecuteReasoning = async (prompt?: string) => {
    setIsAiReasoning(true);
    setActionSuccessMessage(null);
    try {
      const result = await queryNmcpAiReasoning({
        snapshot,
        userPrompt: prompt || customUserPrompt || 'Analyze current multi-tenant telecommunications posture across all 11 layers.',
        targetTenantId: selectedTenantFilter,
        model: selectedModel
      });

      setAiUnderstanding(result.understanding);
    } catch (err: any) {
      console.error('Failed to execute AI reasoning:', err);
    } finally {
      setIsAiReasoning(false);
    }
  };

  // Simulate Network Events to demonstrate AI understanding
  const handleInjectFault = (faultType: 'ss7_flood' | 'esim_surge' | 'flink_lag' | 'nominal') => {
    let newLayers = { ...snapshot.layers };
    let newAnomalies = [...snapshot.activeAnomalies];

    if (faultType === 'ss7_flood') {
      newLayers['08'] = {
        ...newLayers['08'],
        status: 'critical',
        healthScore: 74.2,
        activeAlarms: ['Inbound SS7 MAP_SendRoutingInfo flood (45,000 PPS) from unauthorized peering GT'],
        keyMetrics: {
          ...newLayers['08'].keyMetrics,
          ebpfDropRatePps: 18400
        }
      };
      newAnomalies.unshift({
        id: `anom-ss7-${Date.now()}`,
        layerId: '08',
        layerName: 'Edge Defense Plane',
        severity: 'critical',
        title: 'High-Volume SS7 MAP Velocity Flood Detected',
        description: 'Unauthorized GT +447700900122 attempting IMSI correlation enumeration across Safaricom and MTN roaming nodes.',
        affectedTenantId: selectedTenantFilter,
        timestamp: new Date().toISOString(),
        recommendedPlaybook: 'Engage eBPF XDP kernel drop filter and BGP FlowSpec blackhole for origin GT.',
        remediationActionKey: 'block_gt_prefix',
        resolved: false
      });
      setActionSuccessMessage('Injected SS7 MAP velocity flood into Layer 08. Re-running AI situational analysis...');
    } else if (faultType === 'esim_surge') {
      newLayers['06'] = {
        ...newLayers['06'],
        status: 'critical',
        healthScore: 68.4,
        activeAlarms: ['18 eSIM attestation tokens critically expiring (<7 days) with risk of device deregistration'],
        keyMetrics: {
          ...newLayers['06'].keyMetrics,
          criticalExpiringTokensCount: 18
        }
      };
      newAnomalies.unshift({
        id: `anom-esim-surge-${Date.now()}`,
        layerId: '06',
        layerName: 'Sovereign NMS',
        severity: 'critical',
        title: 'Critical Expiry Surge: 18 eUICC Tokens within 7 Days',
        description: 'Device fleet eUICC cryptographic leases will expire without immediate GSMA SGP.22 ES2+ re-binding.',
        affectedTenantId: selectedTenantFilter,
        timestamp: new Date().toISOString(),
        recommendedPlaybook: 'Trigger automated bulk re-bind across all 18 tokens with carrier SM-DP+ roots.',
        remediationActionKey: 'rebind_esim_tokens',
        resolved: false
      });
      setActionSuccessMessage('Simulated critical eSIM expiry surge in Layer 06. Re-running AI situational analysis...');
    } else if (faultType === 'flink_lag') {
      newLayers['09'] = {
        ...newLayers['09'],
        status: 'degraded',
        healthScore: 84.1,
        activeAlarms: ['Flink 15m correlation state window lag exceeded 45,000ms'],
        keyMetrics: {
          ...newLayers['09'].keyMetrics,
          inboundEps: '4.8M (100% capacity)'
        }
      };
      setActionSuccessMessage('Injected Flink state correlation lag into Layer 09.');
    } else {
      // Restore Nominal
      newLayers = { ...INITIAL_NMCP_LAYERS };
      newAnomalies = newAnomalies.map((a) => ({ ...a, resolved: true }));
      setActionSuccessMessage('Restored nominal continental telecom telemetry across all 11 system layers.');
    }

    const updated = buildNmcpContextSnapshot({
      tenants,
      activeTenantId: selectedTenantFilter,
      overrides: {
        layers: newLayers,
        activeAnomalies: newAnomalies,
        globalHealthScore: faultType === 'ss7_flood' ? 88.4 : faultType === 'esim_surge' ? 86.2 : 98.2
      }
    });

    setSnapshot(updated);

    // Auto-trigger AI reasoning on event injection
    queryNmcpAiReasoning({
      snapshot: updated,
      userPrompt: `Network event injected: ${faultType}. Explain immediate operational impact, cross-layer cascading risks, and automated playbooks.`,
      targetTenantId: selectedTenantFilter,
      model: selectedModel
    }).then((res) => {
      setAiUnderstanding(res.understanding);
    });
  };

  // Execute remediation action
  const handleExecuteAction = (actionId: string, actionText: string) => {
    setActionSuccessMessage(`Executed Playbook: "${actionText}". Telecom state updated.`);
    if (actionId === 'act-rebind' || actionText.toLowerCase().includes('re-bind')) {
      // Mark Layer 06 healthy
      setSnapshot((prev) => {
        const nextLayers = { ...prev.layers };
        nextLayers['06'] = {
          ...nextLayers['06'],
          status: 'nominal',
          healthScore: 99.4,
          activeAlarms: []
        };
        return {
          ...prev,
          layers: nextLayers,
          activeAnomalies: prev.activeAnomalies.map((a) =>
            a.remediationActionKey === 'rebind_esim_tokens' ? { ...a, resolved: true } : a
          )
        };
      });
    }
  };

  // Copy raw JSON snapshot
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className={`bg-white border border-black/15 flex flex-col h-full rounded-[2px] shadow-sm select-none ${className}`}>
      {/* 1. NMCP Top Navigation & Control Header */}
      <div className="p-4 border-b border-black/15 bg-zinc-950 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[2px] bg-white text-black flex items-center justify-center font-bold text-sm shrink-0">
            <Radio className="w-4 h-4 text-black animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                NMCP · Network Management Control Plane
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-zinc-800 text-zinc-300 border border-zinc-700">
                {snapshot.controlPlaneVersion}
              </span>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
              Live Multi-Tenant Telemetry &amp; Cognitive AI Observability Plane
            </div>
          </div>
        </div>

        {/* Tenant Filter Selector & Model Picker */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Tenant Slices Dropdown */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-[2px] px-2 py-1 text-xs font-mono">
            <span className="text-zinc-400 mr-2 text-[11px] uppercase">Tenant Slice:</span>
            <select
              value={selectedTenantFilter}
              onChange={(e) => {
                setSelectedTenantFilter(e.target.value);
                onSelectTenant(e.target.value);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-zinc-900 text-white">
                  {t.name} ({t.countryCode}) · {t.subscription.tier}
                </option>
              ))}
            </select>
          </div>

          {/* AI Reasoning Model Picker */}
          <div className="flex items-center bg-zinc-900 border border-zinc-700 rounded-[2px] px-2 py-1 text-xs font-mono">
            <Bot className="w-3.5 h-3.5 text-zinc-400 mr-1.5" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer text-xs"
            >
              <option value="gemini-3.8-flash" className="bg-zinc-900 text-white">Gemini 3.8 Flash (Standard)</option>
              <option value="gemini-4-argon" className="bg-zinc-900 text-white">Gemini 4 Argon (Deep Forensic)</option>
              <option value="gemini-3.1-flash-lite" className="bg-zinc-900 text-white">Gemini 3.1 Flash Lite (Fast)</option>
            </select>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-[2px] transition-colors cursor-pointer"
              title="Close NMCP Console"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Key Multi-Tenant Infrastructure Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-black/15 bg-zinc-50 text-xs font-mono divide-x divide-y sm:divide-y-0 divide-black/10 shrink-0">
        <div className="p-3">
          <div className="text-[10px] uppercase text-black/50 font-sans">Global NMCP Health</div>
          <div className="text-base font-bold text-black flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${snapshot.globalHealthScore > 95 ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
            <span>{snapshot.globalHealthScore.toFixed(1)}%</span>
            <span className="text-[10px] text-black/40 font-normal">NOMINAL</span>
          </div>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-black/50 font-sans">Aggregate CPS</div>
          <div className="text-base font-bold text-black mt-0.5">
            {snapshot.aggregateCps.toLocaleString()} <span className="text-[11px] text-black/50 font-normal">CPS</span>
          </div>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-black/50 font-sans">Traffic Bandwidth</div>
          <div className="text-base font-bold text-black mt-0.5">
            {snapshot.aggregateTrafficGbps} <span className="text-[11px] text-black/50 font-normal">Gbps</span>
          </div>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-black/50 font-sans">Tenant Slices</div>
          <div className="text-base font-bold text-black mt-0.5">
            {snapshot.tenantSlices.length} <span className="text-[11px] text-black/50 font-normal">Active Slices</span>
          </div>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-black/50 font-sans">Security Posture</div>
          <div className="text-base font-bold text-black mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{snapshot.securityPostureIndex}/100</span>
          </div>
        </div>
      </div>

      {/* 3. Success / Action Confirmation Banner */}
      {actionSuccessMessage && (
        <div className="p-2.5 px-4 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4. Tab Navigation Strip */}
      <div className="px-4 py-2 bg-white border-b border-black/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('ai_reasoning')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai_reasoning'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Live AI Situational Understanding</span>
          </button>

          <button
            onClick={() => setActiveTab('layers_matrix')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'layers_matrix'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>11-Layer Architecture Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('tenant_slices')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tenant_slices'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Multi-Tenant Slices &amp; Quotas</span>
          </button>

          <button
            onClick={() => setActiveTab('json_schema')}
            className={`px-3 py-1.5 rounded-[2px] text-xs font-sans font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'json_schema'
                ? 'bg-black text-white'
                : 'text-black/70 hover:bg-zinc-100 hover:text-black'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>NMCP Context Vector (JSON)</span>
          </button>
        </div>

        {/* Fault Injection Simulation Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-black/50 uppercase hidden lg:inline">Inject Event:</span>
          <button
            onClick={() => handleInjectFault('ss7_flood')}
            className="px-2 py-1 rounded-[2px] bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            title="Simulate SS7 MAP Velocity Flood on Layer 08"
          >
            SS7 Flood
          </button>
          <button
            onClick={() => handleInjectFault('esim_surge')}
            className="px-2 py-1 rounded-[2px] bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            title="Simulate 18 Expiring eSIM Tokens on Layer 06"
          >
            eSIM Expiry
          </button>
          <button
            onClick={() => handleInjectFault('nominal')}
            className="px-2 py-1 rounded-[2px] bg-zinc-100 hover:bg-zinc-200 text-black border border-black/15 text-[11px] font-mono font-medium transition-colors cursor-pointer"
            title="Reset All Layers to Nominal Posture"
          >
            Reset Nominal
          </button>
        </div>
      </div>

      {/* 5. Main Tab Body Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ================= TAB 1: LIVE AI SITUATIONAL UNDERSTANDING ================= */}
        {activeTab === 'ai_reasoning' && (
          <div className="space-y-4">
            {/* Real-time AI Situation Card */}
            <div className="p-4 rounded-[2px] border border-black/15 bg-white shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-[2px] bg-black text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-black/50 font-semibold">
                      Live AI Network Understanding
                    </div>
                    <div className="text-sm font-bold text-black mt-0.5">
                      {aiUnderstanding.situationHeadline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-[2px] text-xs font-mono font-bold uppercase ${
                      aiUnderstanding.riskLevel === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : aiUnderstanding.riskLevel === 'ELEVATED'
                        ? 'bg-amber-500 text-black'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Risk Level: {aiUnderstanding.riskLevel}
                  </span>
                  <button
                    onClick={() => handleExecuteReasoning()}
                    disabled={isAiReasoning}
                    className="px-2.5 py-1 rounded-[2px] bg-black text-white hover:bg-zinc-800 disabled:opacity-50 text-xs font-sans font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAiReasoning ? 'animate-spin' : ''}`} />
                    <span>{isAiReasoning ? 'Reasoning...' : 'Re-Evaluate'}</span>
                  </button>
                </div>
              </div>

              {/* Executive Summary */}
              <div>
                <div className="text-xs font-mono uppercase text-black/50 font-semibold mb-1">
                  Executive Assessment:
                </div>
                <p className="text-xs sm:text-[13px] text-black/85 leading-relaxed font-sans">
                  {aiUnderstanding.executiveSummary}
                </p>
              </div>

              {/* Root Cause Analysis */}
              <div className="p-3 bg-zinc-50 rounded-[2px] border border-black/10">
                <div className="text-xs font-mono uppercase text-black/60 font-semibold mb-1">
                  Underlying Root Cause:
                </div>
                <p className="text-xs text-black/80 font-sans leading-relaxed">
                  {aiUnderstanding.rootCauseAnalysis}
                </p>
              </div>

              {/* Cross-Layer Correlations */}
              <div>
                <div className="text-xs font-mono uppercase text-black/50 font-semibold mb-1.5">
                  Cross-Layer Architectural Correlations:
                </div>
                <ul className="space-y-1">
                  {aiUnderstanding.crossLayerCorrelations.map((correlation, idx) => (
                    <li key={idx} className="text-xs text-black/80 font-sans flex items-start gap-2">
                      <span className="text-black font-bold font-mono">[{idx + 1}]</span>
                      <span>{correlation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Immediate AI Action Items */}
              <div>
                <div className="text-xs font-mono uppercase text-black/50 font-semibold mb-1.5">
                  Recommended Immediate Playbooks:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {aiUnderstanding.immediateActionItems.map((act) => (
                    <div
                      key={act.id}
                      className="p-2.5 rounded-[2px] border border-black/10 bg-white hover:border-black transition-colors flex flex-col justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                          <span className="font-semibold text-black">{act.targetLayer}</span>
                          <span
                            className={`uppercase px-1 rounded-[1px] font-bold ${
                              act.priority === 'high'
                                ? 'bg-red-100 text-red-900'
                                : act.priority === 'medium'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-zinc-100 text-black'
                            }`}
                          >
                            {act.priority}
                          </span>
                        </div>
                        <div className="text-xs font-sans text-black font-medium leading-snug">
                          {act.action}
                        </div>
                      </div>

                      <button
                        onClick={() => handleExecuteAction(act.id, act.action)}
                        className="w-full py-1 px-2 rounded-[2px] bg-black text-white hover:bg-zinc-800 text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-white" />
                        <span>Execute Playbook</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reasoning Engine Metadata Footer */}
              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[11px] font-mono text-black/50">
                <span>Model: {aiUnderstanding.reasoningModel} · Confidence: {Math.round(aiUnderstanding.confidenceScore * 100)}%</span>
                <span>Evaluated: {new Date(aiUnderstanding.lastAnalyzedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Interactive Query Console to Ask AI about Network State */}
            <div className="p-4 rounded-[2px] border border-black/15 bg-zinc-50 space-y-3">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-black" />
                <span className="text-xs font-mono uppercase font-bold text-black">
                  Query NMCP Cognitive Intelligence Engine
                </span>
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-sans text-black/60 mr-1">Presets:</span>
                {[
                  'Explain current eSIM expiry and hardware attestation risks',
                  'Verify Safaricom tenant slice CPS utilization and SLA',
                  'Audit STIR/SHAKEN and SS7 signaling firewall drops',
                  'Simulate BGP link failure between Nairobi and Mombasa'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCustomUserPrompt(prompt);
                      handleExecuteReasoning(prompt);
                    }}
                    className="px-2 py-1 rounded-[2px] bg-white hover:bg-black hover:text-white border border-black/15 text-xs font-sans transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Prompt Input Box */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customUserPrompt}
                  onChange={(e) => setCustomUserPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteReasoning();
                  }}
                  placeholder="Ask the AI about any telecom layer, carrier bind, tenant quota, or protocol metric..."
                  className="flex-1 px-3 py-2 bg-white border border-black/20 rounded-[2px] text-xs font-sans text-black focus:outline-none focus:border-black"
                />
                <button
                  onClick={() => handleExecuteReasoning()}
                  disabled={isAiReasoning}
                  className="px-4 py-2 bg-black text-white hover:bg-zinc-800 disabled:opacity-50 rounded-[2px] text-xs font-sans font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: 11-LAYER ARCHITECTURE MATRIX ================= */}
        {activeTab === 'layers_matrix' && (
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-black/60 font-semibold">
              Live State of All 11 Telecommunications Architecture Layers
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.values(snapshot.layers).map((layer) => (
                <div
                  key={layer.layerId}
                  className={`p-3 rounded-[2px] border transition-colors flex flex-col justify-between gap-2.5 ${
                    layer.status === 'critical'
                      ? 'bg-red-50/50 border-red-300'
                      : layer.status === 'degraded'
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-white border-black/15'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-black flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded-[2px] bg-black text-white text-[10px]">
                          {layer.layerId}
                        </span>
                        <span>{layer.name}</span>
                      </span>

                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] ${
                          layer.status === 'nominal'
                            ? 'bg-emerald-100 text-emerald-900'
                            : layer.status === 'degraded'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {layer.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-black/60 font-sans">
                      {layer.category}
                    </div>

                    {/* Alarms if degraded */}
                    {layer.activeAlarms.length > 0 && (
                      <div className="mt-2 p-1.5 bg-amber-100/60 border border-amber-300 rounded-[2px] text-[11px] font-sans text-amber-900 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-800 mt-0.5" />
                        <span>{layer.activeAlarms[0]}</span>
                      </div>
                    )}

                    {/* Key Metrics */}
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5 text-[11px] font-mono bg-zinc-50 p-2 rounded-[2px] border border-black/10">
                      <div>
                        <span className="text-black/50 block text-[9px] uppercase">Health:</span>
                        <span className="font-bold text-black">{layer.healthScore.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-black/50 block text-[9px] uppercase">Latency:</span>
                        <span className="font-bold text-black">{layer.latencyMs}ms</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-black/10">
                        <span className="text-black/50 block text-[9px] uppercase">Primary Metric:</span>
                        <span className="font-semibold text-black truncate block">
                          {Object.entries(layer.keyMetrics)[0]?.[0]}: {Object.entries(layer.keyMetrics)[0]?.[1]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Drill-down button to portal */}
                  {onNavigateToPortal && (
                    <button
                      onClick={() => onNavigateToPortal(layer.productId)}
                      className="w-full py-1 px-2 rounded-[2px] bg-zinc-100 hover:bg-black hover:text-white border border-black/15 text-xs font-sans font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Open Layer {layer.layerId} Portal</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MULTI-TENANT SLICES & QUOTAS ================= */}
        {activeTab === 'tenant_slices' && (
          <div className="space-y-3">
            <div className="text-xs font-mono uppercase text-black/60 font-semibold">
              Multi-Tenant Virtual Network Slices &amp; Isolation Boundaries
            </div>

            <div className="overflow-x-auto border border-black/15 rounded-[2px]">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-zinc-950 text-white font-mono text-[11px] uppercase border-b border-black/20">
                  <tr>
                    <th className="py-2.5 px-3">Tenant Slice</th>
                    <th className="py-2.5 px-3">Isolation Keyspace</th>
                    <th className="py-2.5 px-3">CPS Utilization</th>
                    <th className="py-2.5 px-3">Active DIDs</th>
                    <th className="py-2.5 px-3">SMPP Binds</th>
                    <th className="py-2.5 px-3">SLA Compliance</th>
                    <th className="py-2.5 px-3">Quarantine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 font-mono text-[12px]">
                  {snapshot.tenantSlices.map((slice) => {
                    const isSelected = slice.tenantId === selectedTenantFilter;
                    return (
                      <tr
                        key={slice.tenantId}
                        className={`hover:bg-zinc-50 transition-colors ${
                          isSelected ? 'bg-zinc-100 font-semibold' : ''
                        }`}
                      >
                        <td className="py-2 px-3 font-sans">
                          <div className="font-bold text-black">{slice.tenantName}</div>
                          <div className="text-[10px] text-black/50 font-mono">{slice.tenantId}</div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-black/80">{slice.keyspace}</span>
                        </td>
                        <td className="py-2 px-3">
                          <div>
                            <span>{slice.currentCps} / {slice.allocatedCps} CPS</span>
                            <div className="w-24 h-1.5 bg-zinc-200 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-black rounded-full"
                                style={{ width: `${Math.min(slice.cpsUtilizationPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 font-bold text-black">{slice.activeDids.toLocaleString()}</td>
                        <td className="py-2 px-3">{slice.activeBinds}</td>
                        <td className="py-2 px-3 text-emerald-700 font-bold">{slice.slaCompliancePct}%</td>
                        <td className="py-2 px-3">
                          <span className="px-1.5 py-0.5 rounded-[2px] bg-emerald-100 text-emerald-900 text-[10px] uppercase font-bold">
                            {slice.quarantineStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: NMCP CONTEXT VECTOR (JSON) ================= */}
        {activeTab === 'json_schema' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-black/60 font-semibold">
                Live Normalized Multi-Tenant Context Vector (Fed to AI at any given time)
              </span>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 rounded-[2px] bg-black text-white hover:bg-zinc-800 text-xs font-sans font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>

            <pre className="p-3 bg-zinc-950 text-emerald-400 font-mono text-xs rounded-[2px] overflow-x-auto max-h-[500px] border border-zinc-800">
              {JSON.stringify(snapshot, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
