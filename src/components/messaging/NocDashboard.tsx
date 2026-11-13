import React, { useState } from 'react';
import { CarrierQualityMetric, SmppBind } from '../../types/messaging';
import {
  TrendingUp,
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

interface NocDashboardProps {
  carrierMetrics: CarrierQualityMetric[];
  binds: SmppBind[];
  onOpenDispatcher: () => void;
  onOpenPhoneSimulator: () => void;
  onOpenBinds: () => void;
  onApplyAiReroute: (carrier: string, failoverRoute: string) => void;
}

export const NocDashboard: React.FC<NocDashboardProps> = ({
  carrierMetrics,
  binds,
  onOpenDispatcher,
  onOpenPhoneSimulator,
  onOpenBinds,
  onApplyAiReroute
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const avgMandelaDelivery = (
    carrierMetrics.reduce((acc, c) => acc + c.currentDeliveryRate, 0) / carrierMetrics.length
  ).toFixed(1);

  const avgIndustryAggregator = (
    carrierMetrics.reduce((acc, c) => acc + c.industryAggregatorRate, 0) / carrierMetrics.length
  ).toFixed(1);

  const totalBindsCount = binds.length;
  const boundCount = binds.filter((b) => b.state === 'BOUND').length;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Core Thesis Hero Banner (PRD Section 1 & 2.2) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                System 2 · Messaging Gateway
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-mono font-medium">
                Direct SMPP v5 & SIGTRAN MAP
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              SMS is still king in Africa. Delivery was 60%. We deliver at 98%.
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Eliminating opaque third-party aggregators through 200+ direct carrier binds, automated SIGTRAN USSD fallback for 2G feature phones, and AI pre-send failure prediction.
            </p>
          </div>

          {/* Stark Delivery Comparison Callout */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-500">Industry Aggregators</div>
              <div className="text-2xl font-bold font-mono text-slate-400 tabular-nums line-through decoration-rose-500/80 mt-1">
                {avgIndustryAggregator}%
              </div>
              <div className="text-[10px] text-rose-400 font-medium">40% drop & opaque fails</div>
            </div>

            <div className="text-center pl-2">
              <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Mandela Gateway
              </div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums mt-0.5">
                {avgMandelaDelivery}%
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">+38.4% Guaranteed Lift</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            End-to-End Delivery
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {avgMandelaDelivery}%
            </span>
            <span className="text-xs text-slate-400">· Target ≥98%</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            DLR Correlated & Verified
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            SMS Latency (p95)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              4.1s
            </span>
            <span className="text-xs text-emerald-400">· SLA &lt;8.0s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Submission to Handset DLR
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            USSD Session Latency
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              1.9s
            </span>
            <span className="text-xs text-emerald-400">· SLA &lt;3.0s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            MAP/SIGTRAN to HLR
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Direct SMPP Binds
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {boundCount} / {totalBindsCount}
            </span>
            <span className="text-xs text-emerald-400">· 200+ Capacity</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            MTN, Airtel, Safaricom, Voda
          </div>
        </div>
      </div>

      {/* AI Real-Time Operational Recommendations Feed (PRD Section 8 & 10) */}
      <div className="space-y-3">
        {carrierMetrics
          .filter((c) => c.status === 'degraded' && !dismissedAlerts.includes(c.carrier))
          .map((degraded) => (
            <div
              key={degraded.carrier}
              className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 mt-0.5 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-300">
                      AI Route Optimization Advisory: {degraded.carrier} ({degraded.flag})
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded">
                      THROTTLED
                    </span>
                  </div>
                  <p className="text-slate-300 mt-1 leading-relaxed">
                    {degraded.activeAlert}
                  </p>
                  <p className="text-slate-400 mt-0.5 text-[11px]">
                    Recommendation: <span className="text-white font-medium">{degraded.suggestedFailover}</span>. Estimated cost impact: <strong className="text-amber-200">+$0.004 per message</strong>. Projected delivery restore: <strong className="text-emerald-400">98.5%</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={() => {
                    onApplyAiReroute(degraded.carrier, degraded.suggestedFailover || 'Vodacom RDC SIGTRAN');
                    setDismissedAlerts((prev) => [...prev, degraded.carrier]);
                  }}
                  className="py-1.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Execute One-Click Reroute</span>
                </button>
                <button
                  onClick={() => setDismissedAlerts((prev) => [...prev, degraded.carrier])}
                  className="text-slate-400 hover:text-white px-2 py-1 text-xs"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Carrier Delivery Quality Heatmap & Telemetry Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Carrier Direct Interconnect Delivery Matrix
            </h3>
            <p className="text-slate-400 mt-0.5">
              Live rolling 24-hour delivery rates vs legacy 60% aggregator benchmarks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-0.5 rounded transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh NOC Telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Carrier Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Operator / Country</th>
                <th className="py-3 px-4">Mandela Delivery</th>
                <th className="py-3 px-4">Aggregator Rate</th>
                <th className="py-3 px-4">Hourly Trend (24h)</th>
                <th className="py-3 px-4">Latency (p95)</th>
                <th className="py-3 px-4">Rate (SMS / USSD)</th>
                <th className="py-3 px-4 text-right">Interconnect Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {carrierMetrics.map((c) => (
                <tr key={c.carrier} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <span className="font-semibold text-white block">{c.carrier}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {c.activeBinds} direct SMPP binds
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-baseline gap-1.5 font-mono">
                      <span className="text-base font-bold text-emerald-400 tabular-nums">
                        {c.currentDeliveryRate.toFixed(1)}%
                      </span>
                      <span className="text-[11px] text-emerald-500">
                        (+{(c.currentDeliveryRate - c.industryAggregatorRate).toFixed(1)}%)
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    <span className="tabular-nums line-through decoration-rose-500/70">
                      {c.industryAggregatorRate.toFixed(1)}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-end gap-1 h-5 w-28">
                      {c.hourlyDeliveryRates.map((rate, idx) => (
                        <div
                          key={idx}
                          className="flex-1 rounded-sm bg-emerald-500"
                          style={{
                            height: `${Math.max(20, (rate - 90) * 10)}%`,
                            opacity: rate >= 98 ? 1 : 0.6
                          }}
                          title={`Hour ${idx}: ${rate}%`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-200 tabular-nums">
                    {c.p95LatencySec.toFixed(1)}s
                  </td>

                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    <div>${c.costPerSmsUsd.toFixed(4)} <span className="text-slate-500 text-[10px]">SMS</span></div>
                    <div className="text-[11px] text-amber-300/90">${c.costPerUssdUsd.toFixed(4)} <span className="text-slate-500 text-[10px]">USSD</span></div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded border uppercase ${
                        c.status === 'optimal'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Access Action Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onOpenDispatcher}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-2"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>Send Message & Campaign</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dispatch OTPs or farmer broadcasts with AI pre-send failure prediction and auto-split.
          </p>
        </button>

        <button
          onClick={onOpenPhoneSimulator}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-2"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>2G Feature Phone & USSD Terminal</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dial <span className="font-mono text-amber-300 font-semibold">*384*123#</span> on an interactive Nokia hardware UI. Test zero-data reach.
          </p>
        </button>

        <button
          onClick={onOpenBinds}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-2"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>SMPP Binds & PDU Protocol Trace</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 transition-colors" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Inspect raw SUBMIT_SM hex packets, DLR receipts, windowing, and circuit breakers.
          </p>
        </button>
      </div>
    </div>
  );
};
