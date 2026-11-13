import React, { useState } from 'react';
import { SbcPointOfPresence, SbcAiAlert, PopCode } from '../../types/sbc';
import {
  Server,
  Activity,
  ShieldAlert,
  Zap,
  Globe,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface SbcNocDashboardProps {
  pops: SbcPointOfPresence[];
  aiAlerts: SbcAiAlert[];
  onDrainPop: (code: PopCode) => void;
  onScalePop: (code: PopCode, podsCount: number) => void;
  onApplyAiAction: (alert: SbcAiAlert) => void;
  onOpenLadderTraces: () => void;
  onOpenPbxConnect: () => void;
  onOpenAclSecurity: () => void;
}

export const SbcNocDashboard: React.FC<SbcNocDashboardProps> = ({
  pops,
  aiAlerts,
  onDrainPop,
  onScalePop,
  onApplyAiAction,
  onOpenLadderTraces,
  onOpenPbxConnect,
  onOpenAclSecurity
}) => {
  const [selectedPopCode, setSelectedPopCode] = useState<PopCode>('LOS');

  const selectedPop = pops.find((p) => p.code === selectedPopCode) || pops[0];

  // Aggregate stats across all 6 African PoPs
  const totalCps = pops.reduce((acc, p) => acc + p.currentCps, 0);
  const totalActiveChannels = pops.reduce((acc, p) => acc + p.activeChannels, 0);
  const totalRegistrations = pops.reduce((acc, p) => acc + p.registrationsCount, 0);
  const avgSignalingLatency = Math.round(
    pops.reduce((acc, p) => acc + p.signalingLatencyMs, 0) / pops.length
  );
  const avgMediaLatency = Math.round(
    pops.reduce((acc, p) => acc + p.mediaLatencyMs, 0) / pops.length
  );
  const pendingAiAlerts = aiAlerts.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Carrier Thesis Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-mono text-xs font-semibold border border-amber-400/30">
              System 4 · SBC & SIP Core
            </span>
            <h2 className="text-base font-bold text-white">
              Carrier-Grade Anycast SBC & Sovereign Signaling Edge
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            <strong className="text-amber-300">Thesis:</strong> Own the core. Don&apos;t rent Twilio&apos;s SBCs.
            Built on Kamailio (SBC + Dispatcher) + FreeSWITCH (Media) + RTPEngine across 6 African Points of Presence (10,000 CPS per PoP target).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenPbxConnect}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>Connect Office PBX</span>
          </button>
          <button
            onClick={onOpenLadderTraces}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>SIP Ladder Traces</span>
          </button>
          <button
            onClick={onOpenAclSecurity}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Global ACL & Fraud Guard</span>
          </button>
        </div>
      </div>

      {/* Real-Time Metrics Strip (Carrier Grade Targets) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Aggregate CPS</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {totalCps.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            60,000 CPS Anycast Ceiling
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Channels</span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {totalActiveChannels.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            RTPEngine Direct Bypass
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>SIP Registrations</span>
            <Server className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {totalRegistrations.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            99.99% TLS 1.3 Digest
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Signaling Latency</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {avgSignalingLatency} ms
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            Target &lt; 150 ms (p95)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Media Latency</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
            {avgMediaLatency} ms
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            Target &lt; 80 ms (p95)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Anycast PoPs</span>
            <Globe className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white mt-1">
            6 / 6
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            BGP AS37105 Active
          </div>
        </div>
      </div>

      {/* AI Anomaly & Threat Detection Feed (PRD Section 8) */}
      {pendingAiAlerts.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                AI SBC Threat Intelligence & Capacity Forecasting ({pendingAiAlerts.length} Active)
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-300">
              PRD §8 · Real-Time Heuristics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAiAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase ${
                      alert.severity === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-600/40'
                        : 'bg-amber-950 text-amber-300 border border-amber-600/40'
                    }`}>
                      {alert.severity} · {alert.type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      PoP: {alert.affectedPop} · {alert.timestamp}
                    </span>
                  </div>
                  <h4 className="font-bold text-white">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {alert.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400">
                    Recommended: {alert.suggestedAction}
                  </span>
                  <button
                    onClick={() => onApplyAiAction(alert)}
                    className="py-1 px-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded transition-colors"
                  >
                    Accept Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: 6 PoP Cards & Focused Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 6 PoPs Overview List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Pan-African BGP Anycast PoPs
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              sip.mandela.africa
            </span>
          </div>

          <div className="space-y-2">
            {pops.map((pop) => (
              <div
                key={pop.code}
                onClick={() => setSelectedPopCode(pop.code)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  pop.code === selectedPopCode
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{pop.flag}</span>
                    <strong className="text-white text-xs">{pop.city}</strong>
                    <span className="text-[10px] text-amber-300 font-bold">[{pop.code}]</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    pop.status === 'healthy'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : pop.status === 'draining'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}>
                    {pop.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px]">CPS / Target</span>
                    <span className="text-white font-bold">{pop.currentCps.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500"> / 10k</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Latency (p95)</span>
                    <span className="text-emerald-400 font-bold">{pop.mediaLatencyMs}ms</span>
                    <span className="text-[9px] text-slate-500"> media</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Channels</span>
                    <span className="text-white">{pop.activeChannels.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress bar towards 10k CPS */}
                <div className="mt-2 w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (pop.currentCps / pop.targetCps) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected PoP Detailed Core Node Telemetry (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedPop.flag}</span>
                <h3 className="text-base font-bold text-white">
                  {selectedPop.city} PoP ({selectedPop.code}) — {selectedPop.region}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Anycast IP: {selectedPop.anycastIp} · BGP ASN: {selectedPop.bgpAsn}
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              {selectedPop.status !== 'draining' ? (
                <button
                  onClick={() => onDrainPop(selectedPop.code)}
                  className="py-1 px-3 bg-amber-950/80 hover:bg-amber-900 border border-amber-600/50 text-amber-300 font-bold rounded transition-colors text-[11px]"
                >
                  Drain Traffic (BGP Prepend)
                </button>
              ) : (
                <button
                  onClick={() => onDrainPop(selectedPop.code)}
                  className="py-1 px-3 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-300 font-bold rounded transition-colors text-[11px]"
                >
                  Un-Drain PoP
                </button>
              )}
              <button
                onClick={() => onScalePop(selectedPop.code, selectedPop.kamailioPods + 2)}
                className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors text-[11px] border border-slate-700"
              >
                +2 Pods
              </button>
            </div>
          </div>

          {/* Component Nodes Cluster View */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-amber-400 flex items-center justify-between">
                <span>Kamailio Pods</span>
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-bold font-mono text-white">
                {selectedPop.kamailioPods} Active
              </div>
              <p className="text-[10px] text-slate-400">
                SBC, Dispatcher, Topology Hiding & TLS Signaling
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-emerald-400 flex items-center justify-between">
                <span>RTPEngine Nodes</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {selectedPop.rtpEngineNodes} Relays
              </div>
              <p className="text-[10px] text-slate-400">
                Direct media relay, NAT traversal & SRTP crypto
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[11px] font-mono text-purple-400 flex items-center justify-between">
                <span>FreeSWITCH Media</span>
                <Server className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-bold font-mono text-purple-300">
                {selectedPop.freeSwitchNodes} Nodes
              </div>
              <p className="text-[10px] text-slate-400">
                Transcoding, recording hooks & IVR integration
              </p>
            </div>
          </div>

          {/* Core Hardware & Quality Gauges */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-[11px] text-slate-400 uppercase font-semibold border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>SBC Node Telemetry & Error Ratios</span>
              <span className="text-emerald-400">5xx Error Rate: {selectedPop.error5xxRate}%</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CPU Utilization</span>
                <span className="text-white font-bold text-sm">{selectedPop.cpuPercent}%</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Memory (RAM)</span>
                <span className="text-white font-bold text-sm">{selectedPop.memoryPercent}%</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Signaling (TLS)</span>
                <span className="text-amber-300 font-bold text-sm">{selectedPop.signalingLatencyMs} ms</span>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px] block">RTP Media (SRTP)</span>
                <span className="text-emerald-400 font-bold text-sm">{selectedPop.mediaLatencyMs} ms</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 leading-relaxed font-sans">
              ✓ Kamailio <code className="text-amber-300">dispatcher.list</code> synchronized with System 1 sovereign number inventory. Inbound calls map via ENUM NAPTR DNS queries directly to customer PBX trunks.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
