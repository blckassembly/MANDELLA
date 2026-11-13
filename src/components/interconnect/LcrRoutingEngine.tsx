import React, { useState } from 'react';
import {
  CarrierRouteOption,
  RoutingStrategy,
  InterconnectMarginAlert
} from '../../types/interconnect';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  Radio,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface LcrRoutingEngineProps {
  routes: CarrierRouteOption[];
  alerts: InterconnectMarginAlert[];
  onApplyReroute: (alert: InterconnectMarginAlert) => void;
}

export const LcrRoutingEngine: React.FC<LcrRoutingEngineProps> = ({
  routes,
  alerts,
  onApplyReroute
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<RoutingStrategy>('balanced');
  const [selectedCountry, setSelectedCountry] = useState<string>('KE');

  const filteredRoutes = routes.filter((r) => r.countryCode === selectedCountry);

  // Sort routes based on active strategy
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (selectedStrategy === 'best_quality') {
      return b.mosScore - a.mosScore;
    }
    if (selectedStrategy === 'cheapest') {
      return a.costPerMinUsd - b.costPerMinUsd;
    }
    // balanced / custom_lcrq: lower LCRq is better
    return a.lcrqScore - b.lcrqScore;
  });

  const primaryChoice = sortedRoutes[0];
  const pendingAlerts = alerts.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Carrier Interconnect &amp; LCRq Routing Engine</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· Mandela Telecom Core</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            <strong className="text-amber-300">Thesis:</strong> Interconnect is where African telco makes/loses money. We build the brain.
            Real-time Least Cost Routing with Quality (LCRq = cost × 1/MOS × 1/ASR). Sub-5ms decision latency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-amber-400"
          >
            <option value="KE">Kenya (+254)</option>
            <option value="NG">Nigeria (+234)</option>
            <option value="SN">Senegal (+221)</option>
            <option value="ZA">South Africa (+27)</option>
          </select>
        </div>
      </div>

      {/* Negative Margin Alert Feed */}
      {pendingAlerts.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">
                Interconnect Margin Alerts ({pendingAlerts.length} Active)
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-300">Reaction Target &lt; 60 Seconds</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingAlerts.map((alt) => (
              <div
                key={alt.id}
                className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-rose-400 font-mono font-bold text-[10px] uppercase">
                      {alt.severity} · {alt.destination}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alt.detectedAt}</span>
                  </div>
                  <h4 className="font-bold text-white">{alt.title}</h4>
                  <div className="flex items-center gap-2 font-mono text-[11px] pt-1">
                    <span className="text-slate-400">Previous: +{alt.previousMarginPercent}%</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-rose-400 font-bold">Current: {alt.currentMarginPercent}%</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {alt.recommendedAction}
                  </span>
                  <button
                    onClick={() => onApplyReroute(alt)}
                    className="py-1 px-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
                  >
                    Auto-Reroute
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Novice vs Expert Routing Profiles */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
          <div>
            <h3 className="font-bold text-white text-sm">Outbound Routing Strategy Profile</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select routing priority or let the Rust LCRq engine automatically balance cost and MOS.
            </p>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            {(['best_quality', 'balanced', 'cheapest', 'custom_lcrq'] as const).map((strat) => (
              <button
                key={strat}
                onClick={() => setSelectedStrategy(strat)}
                className={`px-3 py-1 rounded capitalize transition-colors ${
                  selectedStrategy === strat
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {strat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Novice Side-by-Side Comparison Box */}
        {filteredRoutes.length >= 2 && (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
              Novice Operator Comparison (PRD §4.1)
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Option A: Direct Route */}
              <div className="p-3.5 rounded-lg border bg-emerald-950/20 border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs">Direct Carrier Route</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                    Highest MOS Quality
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{filteredRoutes[0]?.carrierName}</h4>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-slate-400 text-[11px]">Cost / Min:</span>
                  <span className="text-white font-bold text-base">${filteredRoutes[0]?.costPerMinUsd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Audio Quality (MOS):</span>
                  <span className="text-emerald-400 font-bold">{filteredRoutes[0]?.mosScore} / 5.0</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Call Completion (ASR):</span>
                  <span className="text-emerald-400 font-bold">{(filteredRoutes[0]?.asrPercent * 100).toFixed(0)}%</span>
                </div>
              </div>

              {/* Option B: Grey Route */}
              <div className="p-3.5 rounded-lg border bg-rose-950/20 border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold text-xs">Aggregator / Grey Route</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                    Suspected Simbox Farm
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{filteredRoutes[1]?.carrierName}</h4>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-slate-400 text-[11px]">Cost / Min:</span>
                  <span className="text-amber-300 font-bold text-base">${filteredRoutes[1]?.costPerMinUsd.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Audio Quality (MOS):</span>
                  <span className="text-rose-400 font-bold">{filteredRoutes[1]?.mosScore} / 5.0 (Degraded)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Call Completion (ASR):</span>
                  <span className="text-rose-400 font-bold">{(filteredRoutes[1]?.asrPercent * 100).toFixed(0)}% (Frequent Fails)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Carrier Route Options Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-bold text-white uppercase text-xs">
            Live Carrier Routes for {selectedCountry} ({sortedRoutes.length})
          </span>
          <span className="text-emerald-400 text-[11px]">
            Active Formula: LCRq = cost × (1/MOS) × (1/ASR)
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Carrier Route</th>
                <th className="p-3">Rate ($/min)</th>
                <th className="p-3">MOS Quality</th>
                <th className="p-3">ASR %</th>
                <th className="p-3">PDD (ms)</th>
                <th className="p-3">LCRq Score</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sortedRoutes.map((r, idx) => (
                <tr key={r.carrierId} className="hover:bg-slate-950/50 text-slate-300">
                  <td className="p-3">
                    <div className="font-bold text-white">{r.carrierName}</div>
                    <div className="text-[10px] text-slate-500">{r.destinationName} ({r.prefix})</div>
                  </td>
                  <td className="p-3 font-bold text-amber-300">${r.costPerMinUsd.toFixed(4)}</td>
                  <td className="p-3">
                    <span className={r.mosScore >= 4.0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {r.mosScore.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-white">{(r.asrPercent * 100).toFixed(0)}%</td>
                  <td className="p-3 text-slate-400">{r.pddMs} ms</td>
                  <td className="p-3 font-bold text-emerald-400">{r.lcrqScore.toFixed(5)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      r.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
