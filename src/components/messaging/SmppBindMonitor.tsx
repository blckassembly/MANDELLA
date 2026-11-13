import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SmppBind, SmppPduTrace } from '../../types/messaging';
import { Radio, RefreshCw, Terminal, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Activity, Download, Pause, Play, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface SmppBindMonitorProps {
  binds: SmppBind[];
  pduTraces: SmppPduTrace[];
  onTriggerRebind: (bindId: string) => void;
  onBulkRebind?: (bindIds: string[]) => void;
  onSendProbeEnquireLink: (bindId: string) => void;
}

const BIND_LINE_COLORS = [
  '#34d399', // emerald-400
  '#fbbf24', // amber-400
  '#38bdf8', // sky-400
  '#a78bfa', // violet-400
  '#fb7185', // rose-400
  '#2dd4bf', // teal-400
  '#f472b6', // pink-400
  '#facc15', // yellow-400
  '#60a5fa', // blue-400
  '#f97316'  // orange-500
];

interface TpsSamplePoint {
  time: string;
  [bindId: string]: string | number;
}

const buildInitialHistory = (binds: SmppBind[]): TpsSamplePoint[] => {
  const now = Date.now();
  const points: TpsSamplePoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now - i * 2000);
    const label = t.toTimeString().slice(0, 8);
    const row: TpsSamplePoint = { time: label };
    binds.forEach((b, idx) => {
      if (b.state !== 'BOUND' && b.state !== 'THROTTLED') {
        row[b.id] = 0;
        return;
      }
      // Realistic deterministic micro-oscillation around baseline TPS
      const wave = Math.sin((12 - i + idx * 1.7) * 0.65) * 0.08;
      const sample = i === 0 ? b.tps : Math.max(0, Math.round(b.tps * (1 + wave)));
      row[b.id] = sample;
    });
    points.push(row);
  }
  return points;
};

interface CustomChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
    color?: string;
    dataKey?: string;
  }>;
  label?: string;
}

const TpsChartTooltip: React.FC<CustomChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3 shadow-xl text-xs font-mono space-y-1.5 min-w-[200px]">
      <div className="text-slate-400 text-[10px] border-b border-slate-800 pb-1 flex justify-between">
        <span>SAMPLE TIME</span>
        <span className="text-white font-bold">{label}</span>
      </div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-200 truncate max-w-[160px]">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: entry.color || '#34d399' }}
              />
              <span className="truncate">{entry.name}</span>
            </span>
            <span className="text-white font-bold tabular-nums">{entry.value} TPS</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface LatencyVisuals {
  rowGradientClass: string;
  selectedRingClass: string;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  label: string;
  percentOfThreshold: number;
}

const getLatencyVisuals = (bind: SmppBind, thresholdMs: number): LatencyVisuals => {
  if (bind.state === 'CLOSED' || bind.state === 'ERROR') {
    return {
      rowGradientClass:
        'bg-gradient-to-r from-slate-950/90 via-rose-950/35 to-rose-950/65 border-rose-500/45 hover:border-rose-400/70',
      selectedRingClass: 'ring-2 ring-rose-400/70 border-rose-400',
      dotClass: 'bg-rose-500',
      textClass: 'text-rose-400 font-bold',
      badgeClass: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
      label: 'OFFLINE',
      percentOfThreshold: 100
    };
  }

  const safeThreshold = Math.max(1, thresholdMs);
  const ratio = bind.latencyMs / safeThreshold;
  const pct = Math.min(200, Math.round(ratio * 100));

  if (ratio <= 0.4) {
    return {
      rowGradientClass:
        'bg-gradient-to-r from-emerald-950/50 via-emerald-950/25 to-slate-950/85 border-emerald-500/35 hover:border-emerald-400/60',
      selectedRingClass: 'ring-2 ring-emerald-400/70 border-emerald-400',
      dotClass: 'bg-emerald-400',
      textClass: 'text-emerald-400 font-semibold',
      badgeClass: 'bg-emerald-950/75 text-emerald-300 border-emerald-500/40',
      label: 'OPTIMAL',
      percentOfThreshold: pct
    };
  }

  if (ratio <= 0.7) {
    return {
      rowGradientClass:
        'bg-gradient-to-r from-emerald-950/30 via-lime-950/25 to-amber-950/20 border-lime-500/35 hover:border-lime-400/60',
      selectedRingClass: 'ring-2 ring-lime-400/70 border-lime-400',
      dotClass: 'bg-lime-400',
      textClass: 'text-lime-300 font-semibold',
      badgeClass: 'bg-lime-950/75 text-lime-300 border-lime-500/40',
      label: 'NOMINAL',
      percentOfThreshold: pct
    };
  }

  if (ratio <= 1.0) {
    return {
      rowGradientClass:
        'bg-gradient-to-r from-amber-950/45 via-orange-950/35 to-rose-950/25 border-amber-500/50 hover:border-amber-400/75',
      selectedRingClass: 'ring-2 ring-amber-400/75 border-amber-400',
      dotClass: 'bg-amber-400',
      textClass: 'text-amber-300 font-bold',
      badgeClass: 'bg-amber-950/80 text-amber-300 border-amber-500/45',
      label: 'ELEVATED',
      percentOfThreshold: pct
    };
  }

  return {
    rowGradientClass:
      'bg-gradient-to-r from-rose-950/80 via-red-950/65 to-rose-900/55 border-rose-500/85 hover:border-rose-400',
    selectedRingClass: 'ring-2 ring-rose-400 border-rose-400 shadow-sm',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-400 font-bold',
    badgeClass: 'bg-rose-600 text-white border-rose-400',
    label: 'BREACH',
    percentOfThreshold: pct
  };
};

export const SmppBindMonitor: React.FC<SmppBindMonitorProps> = ({
  binds,
  pduTraces,
  onTriggerRebind,
  onBulkRebind,
  onSendProbeEnquireLink
}) => {
  const [selectedBindId, setSelectedBindId] = useState<string>(binds[0]?.id || '');
  const [filterCommand, setFilterCommand] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'binds' | 'pdus'>('binds');
  const [downloadedRecently, setDownloadedRecently] = useState<boolean>(false);
  const [isStreamPaused, setIsStreamPaused] = useState<boolean>(false);
  const [chartScope, setChartScope] = useState<'all_active' | 'selected'>('all_active');
  const [alertThresholdMs, setAlertThresholdMs] = useState<number>(150);
  const [nocToast, setNocToast] = useState<{ title: string; detail: string } | null>(null);
  const [tpsHistory, setTpsHistory] = useState<TpsSamplePoint[]>(() => buildInitialHistory(binds));

  const lastAlertSignatureRef = useRef<string>('');

  const bindsRef = useRef<SmppBind[]>(binds);
  useEffect(() => {
    bindsRef.current = binds;
  }, [binds]);

  const latencyBreachedBinds = useMemo(
    () => binds.filter((b) => alertThresholdMs > 0 && b.latencyMs > alertThresholdMs),
    [binds, alertThresholdMs]
  );

  // Trigger visual NOC toast notification when binds exceed the DLR latency Alert Threshold
  useEffect(() => {
    const signature = `${alertThresholdMs}:${latencyBreachedBinds.map((b) => `${b.id}@${b.latencyMs}`).join(',')}`;
    if (latencyBreachedBinds.length === 0) {
      lastAlertSignatureRef.current = signature;
      return;
    }
    if (lastAlertSignatureRef.current === signature) return;

    const timer = window.setTimeout(() => {
      lastAlertSignatureRef.current = signature;
      const summaryNames = latencyBreachedBinds
        .slice(0, 3)
        .map((b) => `${b.operator} (${b.latencyMs}ms)`)
        .join(', ');
      const extraCount = latencyBreachedBinds.length > 3 ? ` +${latencyBreachedBinds.length - 3} more` : '';
      setNocToast({
        title: `DLR Latency Alert (> ${alertThresholdMs}ms)`,
        detail: `${latencyBreachedBinds.length} bind(s) breached threshold: ${summaryNames}${extraCount}`
      });
    }, 300);

    return () => window.clearTimeout(timer);
  }, [latencyBreachedBinds, alertThresholdMs]);

  // Auto-dismiss NOC toast after 5 seconds
  useEffect(() => {
    if (!nocToast) return;
    const hideTimer = window.setTimeout(() => setNocToast(null), 5000);
    return () => window.clearTimeout(hideTimer);
  }, [nocToast]);

  // Real-time 2s TPS telemetry sampling for active binds
  useEffect(() => {
    if (isStreamPaused) return;
    const timer = window.setInterval(() => {
      const currentBinds = bindsRef.current;
      const nowLabel = new Date().toTimeString().slice(0, 8);
      setTpsHistory((prev) => {
        const lastSample = prev[prev.length - 1];
        const nextRow: TpsSamplePoint = { time: nowLabel };
        currentBinds.forEach((b, idx) => {
          if (b.state !== 'BOUND' && b.state !== 'THROTTLED') {
            nextRow[b.id] = 0;
            return;
          }
          const prevVal = typeof lastSample?.[b.id] === 'number' ? (lastSample[b.id] as number) : b.tps;
          const jitter = Math.round((Math.random() - 0.48) * Math.max(6, b.tps * 0.14));
          // Occasional brief throughput dip on THROTTLED binds to surface anomalies clearly
          const anomalyDip = b.state === 'THROTTLED' && idx % 2 === 1 && Math.random() < 0.25 ? -Math.round(b.tps * 0.28) : 0;
          const anchored = Math.round(prevVal * 0.35 + b.tps * 0.65) + jitter + anomalyDip;
          nextRow[b.id] = Math.max(5, Math.min(b.maxTps, anchored));
        });
        return [...prev.slice(-19), nextRow];
      });
    }, 2000);

    return () => window.clearInterval(timer);
  }, [isStreamPaused]);

  const selectedBind = binds.find((b) => b.id === selectedBindId) || binds[0];
  const degradedBinds = binds.filter((b) => b.state === 'CLOSED' || b.state === 'ERROR');
  const activeBinds = useMemo(
    () => binds.filter((b) => b.state === 'BOUND' || b.state === 'THROTTLED'),
    [binds]
  );

  const chartBinds = useMemo(() => {
    if (chartScope === 'selected' && selectedBind) {
      return [selectedBind];
    }
    return activeBinds;
  }, [chartScope, activeBinds, selectedBind]);

  const throughputAnomalies = useMemo(() => {
    if (tpsHistory.length < 3) return [];
    const latest = tpsHistory[tpsHistory.length - 1];
    const alerts: Array<{ bindId: string; carrier: string; detail: string }> = [];
    activeBinds.forEach((b) => {
      const latestVal = Number(latest[b.id] ?? b.tps);
      const utilizationPct = b.maxTps > 0 ? Math.round((latestVal / b.maxTps) * 100) : 0;
      if (b.state === 'THROTTLED' || utilizationPct >= 82) {
        alerts.push({
          bindId: b.id,
          carrier: b.carrierName,
          detail: `High utilization (${latestVal}/${b.maxTps} TPS · ${utilizationPct}%)`
        });
      } else if (b.tps > 0 && latestVal < b.tps * 0.72) {
        alerts.push({
          bindId: b.id,
          carrier: b.carrierName,
          detail: `Sudden drop (${latestVal} vs ${b.tps} baseline TPS)`
        });
      }
    });
    return alerts;
  }, [tpsHistory, activeBinds]);

  const handleBulkRebindAll = () => {
    if (degradedBinds.length === 0) return;
    const targetIds = degradedBinds.map((b) => b.id);
    if (onBulkRebind) {
      onBulkRebind(targetIds);
    } else {
      targetIds.forEach((id) => onTriggerRebind(id));
    }
  };

  const escapeCsvCell = (value: unknown): string => {
    const str = value === null || value === undefined ? '' : String(value);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const handleDownloadLogs = () => {
    const exportedAt = new Date().toISOString();
    const headers = [
      'RECORD_TYPE',
      'RECORD_ID',
      'STATE_OR_STATUS',
      'CARRIER_OR_COMMAND',
      'OPERATOR_OR_DIRECTION',
      'COUNTRY',
      'PROTOCOL_OR_SEQUENCE',
      'SYSTEM_ID_OR_MESSAGE_ID',
      'ENDPOINT_OR_ROUTING',
      'TPS_LATENCY_SUCCESS',
      'TIMESTAMP_OR_LAST_ENQUIRE_LINK',
      'AUDIT_DETAIL_OR_HEX_PDU'
    ];

    const bindRows = binds.map((bind) => [
      'BIND_STATUS',
      bind.id,
      bind.state,
      bind.carrierName,
      bind.operator,
      bind.countryCode,
      `${bind.protocol} (${bind.bindType})`,
      bind.systemId,
      `${bind.host}:${bind.port} | ${bind.sigtranGateway}`,
      `${bind.tps}/${bind.maxTps} TPS | ${bind.latencyMs}ms RTT | ${bind.successRate1h}% 1h | Win ${bind.windowUtilization}%/${bind.windowSize}`,
      `Last EnquireLink: ${bind.lastEnquireLink} (Every ${bind.enquireLinkIntervalSec}s)`,
      `Audit Snapshot @ ${exportedAt}`
    ]);

    const pduRows = pduTraces.map((pdu) => [
      'PDU_TRACE',
      pdu.id,
      pdu.commandStatus,
      pdu.command,
      pdu.direction.toUpperCase(),
      '',
      `Seq #${pdu.sequenceNumber}`,
      pdu.messageId || '',
      `${pdu.sourceAddr || ''} -> ${pdu.destAddr || ''}`,
      '',
      pdu.timestamp,
      `${pdu.decodedSummary} | HEX: ${pdu.hexDump}`
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...bindRows.map((row) => row.map(escapeCsvCell).join(',')),
      ...pduRows.map((row) => row.map(escapeCsvCell).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTimestamp = exportedAt.replace(/[:.]/g, '-').slice(0, 19);
    link.href = url;
    link.setAttribute('download', `mandela-smpp-nms-audit-${safeTimestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedRecently(true);
    window.setTimeout(() => setDownloadedRecently(false), 2500);
  };

  const filteredPdus = pduTraces.filter((pdu) => {
    if (filterCommand !== 'all' && pdu.command !== filterCommand) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* NOC Engineer Visual Toast Notification for DLR Latency Breaches */}
      {nocToast && (
        <div
          role="alert"
          className="fixed top-20 right-6 z-50 max-w-md bg-rose-950 border-2 border-rose-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 text-xs animate-in fade-in slide-in-from-top-2"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="font-mono font-bold uppercase tracking-wider text-rose-200">
              {nocToast.title}
            </div>
            <div className="text-rose-100 mt-0.5 leading-snug">{nocToast.detail}</div>
          </div>
          <button
            type="button"
            onClick={() => setNocToast(null)}
            className="text-rose-300 hover:text-white font-mono text-sm leading-none px-1 cursor-pointer"
            aria-label="Dismiss NOC Latency Alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Direct SMPP v5 Carrier Binds & PDU Protocol Trace</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4.2 & 5.2</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time transceiver binds directly connected to African mobile operator SMSCs without third-party aggregators.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono">
            <span className="text-slate-400 font-semibold whitespace-nowrap">Alert Threshold:</span>
            <input
              type="number"
              min={1}
              step={10}
              value={alertThresholdMs}
              onChange={(e) => {
                const parsed = Number(e.target.value);
                setAlertThresholdMs(Number.isFinite(parsed) && parsed > 0 ? parsed : 1);
              }}
              aria-label="Alert Threshold (ms)"
              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-white font-bold text-right focus:outline-none focus:border-amber-400 tabular-nums"
            />
            <span className="text-slate-400">ms</span>
          </label>
          <button
            type="button"
            onClick={handleDownloadLogs}
            className="px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700 cursor-pointer"
            title="Export current SMPP bind statuses and recent PDU trace history as CSV for NMS audit"
          >
            {downloadedRecently ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Logs Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download Logs</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBulkRebindAll}
            disabled={degradedBinds.length === 0}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-colors flex items-center gap-1.5 border ${
              degradedBinds.length > 0
                ? 'bg-rose-600 hover:bg-rose-500 text-white border-rose-500 cursor-pointer'
                : 'bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
            title={
              degradedBinds.length > 0
                ? `Rebind ${degradedBinds.length} bind(s) in CLOSED or ERROR state`
                : 'No binds currently in CLOSED or ERROR state'
            }
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Bulk Rebind All ({degradedBinds.length})</span>
          </button>

          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('binds')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'binds'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Binds ({binds.length})
            </button>
            <button
              onClick={() => setActiveTab('pdus')}
              className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
                activeTab === 'pdus'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Live PDU Trace ({pduTraces.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'binds' && (
        <div className="space-y-6">
          {/* Real-Time Active Bind TPS Trend Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Real-Time TPS Throughput Trends ({activeBinds.length} Active Binds)
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                      isStreamPaused
                        ? 'bg-slate-950 text-slate-400 border-slate-700'
                        : 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {isStreamPaused ? 'PAUSED' : 'LIVE · 2S POLL'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transactions Per Second per active carrier bind for rapid detection of SMSC throttling, sudden traffic drops, and saturation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setChartScope('all_active')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      chartScope === 'all_active'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All Active ({activeBinds.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartScope('selected')}
                    className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      chartScope === 'selected'
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Selected Bind
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsStreamPaused((p) => !p)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {isStreamPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{isStreamPaused ? 'Resume Stream' : 'Pause Stream'}</span>
                </button>
              </div>
            </div>

            {throughputAnomalies.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/40 rounded-lg px-3.5 py-2.5 flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-amber-300 font-mono font-bold uppercase shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Throughput Anomaly ({throughputAnomalies.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {throughputAnomalies.map((a) => (
                    <button
                      key={a.bindId}
                      type="button"
                      onClick={() => setSelectedBindId(a.bindId)}
                      className="text-[11px] font-mono bg-slate-950/80 hover:bg-slate-900 border border-amber-500/30 text-amber-200 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {a.carrier}: {a.detail}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="h-64 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3">
              {chartBinds.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs font-mono text-slate-500">
                  No active SMPP binds available to plot. Use Bulk Rebind All to restore CLOSED/ERROR binds.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tpsHistory} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                      unit=" TPS"
                      width={64}
                    />
                    <Tooltip content={<TpsChartTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '6px' }}
                    />
                    {chartBinds.map((bind, idx) => {
                      const color = BIND_LINE_COLORS[idx % BIND_LINE_COLORS.length];
                      const isSelected = selectedBind?.id === bind.id;
                      return (
                        <Line
                          key={bind.id}
                          type="monotone"
                          dataKey={bind.id}
                          name={`${bind.operator} (${bind.countryCode})`}
                          stroke={color}
                          strokeWidth={isSelected ? 2.8 : 1.75}
                          dot={false}
                          activeDot={{ r: 4 }}
                          isAnimationActive={false}
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Binds List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="space-y-1.5 pb-2 border-b border-slate-800">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider flex justify-between items-center">
                <span>Carrier SMPP Interconnects</span>
                {latencyBreachedBinds.length > 0 ? (
                  <span className="font-mono text-[10px] text-rose-400 font-bold">
                    {latencyBreachedBinds.length} LATENCY ALERT{latencyBreachedBinds.length > 1 ? 'S' : ''} (&gt;{alertThresholdMs}ms)
                  </span>
                ) : (
                  <span className="font-mono text-[10px] text-emerald-400">200+ Target Capacity</span>
                )}
              </div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
                <span>Latency Scale vs {alertThresholdMs}ms:</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />≤40%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-lime-400" />≤70%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />≤100%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />&gt;100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {binds.map((bind) => {
                const isLatencyBreached = alertThresholdMs > 0 && bind.latencyMs > alertThresholdMs;
                const isSelected = bind.id === selectedBindId;
                const latencyVis = getLatencyVisuals(bind, alertThresholdMs);
                return (
                  <div
                    key={bind.id}
                    onClick={() => setSelectedBindId(bind.id)}
                    className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      latencyVis.rowGradientClass
                    } ${isSelected ? latencyVis.selectedRingClass : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${latencyVis.dotClass}`}
                            title={`Latency Status: ${latencyVis.label} (${latencyVis.percentOfThreshold}% of ${alertThresholdMs}ms threshold)`}
                          />
                          <span>{bind.carrierName}</span>
                          {isLatencyBreached && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-600 text-white font-bold uppercase">
                              DLR &gt; {alertThresholdMs}ms
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {bind.protocol} · {bind.bindType} · {bind.host}:{bind.port}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${latencyVis.badgeClass}`}
                          title={`${bind.latencyMs}ms vs ${alertThresholdMs}ms threshold (${latencyVis.percentOfThreshold}%)`}
                        >
                          {latencyVis.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                            bind.state === 'BOUND'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : bind.state === 'THROTTLED'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                              : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {bind.state}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Window</span>
                        <span className="text-white">{bind.windowUtilization}% / {bind.windowSize}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Throughput</span>
                        <span className="text-emerald-400">{bind.tps} TPS</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">DLR Latency</span>
                        <span className={latencyVis.textClass}>
                          {bind.latencyMs} ms ({latencyVis.percentOfThreshold}%)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Success (1h)</span>
                        <span className="text-white">{bind.successRate1h}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Bind Inspector & Controls (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{selectedBind.carrierName}</h3>
                  <span className="text-xs font-mono text-amber-300 font-semibold">{selectedBind.operator}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct transceiver session over IPsec VPN to operator SMSC
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSendProbeEnquireLink(selectedBind.id)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono rounded transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Probe ENQUIRE_LINK</span>
                </button>
                <button
                  onClick={() => onTriggerRebind(selectedBind.id)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors flex items-center gap-1.5 border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Force Rebind</span>
                </button>
              </div>
            </div>

            {/* Detailed Parameters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">System ID</span>
                <span className="text-white font-bold">{selectedBind.systemId}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Host & Port</span>
                <span className="text-white">{selectedBind.host}:{selectedBind.port}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Round-Trip RTT</span>
                <span className="text-emerald-400 font-bold">{selectedBind.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Window Utilization</span>
                <span className="text-white">{selectedBind.windowUtilization}% (Cap: {selectedBind.windowSize})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Enquire-Link Cadence</span>
                <span className="text-white">Every {selectedBind.enquireLinkIntervalSec}s (last: {selectedBind.lastEnquireLink})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Capacity Limit</span>
                <span className="text-amber-300 font-bold">{selectedBind.maxTps} msg/sec</span>
              </div>
            </div>

            {/* SIGTRAN Gateway Linkage */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] font-semibold block">
                Integrated SIGTRAN / SS7 Route
              </span>
              <p className="text-slate-300 font-mono text-[11px]">
                {selectedBind.sigtranGateway}
              </p>
              <div className="text-slate-500 text-[11px] pt-1 border-t border-slate-900">
                Direct MAP connectivity to operator HLR enables instantaneous USSD sessions without third-party transit hops.
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {activeTab === 'pdus' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden space-y-0">
          {/* Filter Bar */}
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">Live SMPP Protocol Trace (PDU Packet Inspector)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">Filter Command:</span>
              <select
                value={filterCommand}
                onChange={(e) => setFilterCommand(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded px-2.5 py-1 font-mono focus:outline-none"
              >
                <option value="all">ALL COMMANDS</option>
                <option value="SUBMIT_SM">SUBMIT_SM</option>
                <option value="SUBMIT_SM_RESP">SUBMIT_SM_RESP</option>
                <option value="DELIVER_SM">DELIVER_SM (DLR)</option>
                <option value="ENQUIRE_LINK">ENQUIRE_LINK</option>
              </select>
            </div>
          </div>

          {/* Trace Rows */}
          <div className="divide-y divide-slate-800 font-mono text-xs">
            {filteredPdus.map((pdu) => (
              <div key={pdu.id} className="p-4 hover:bg-slate-950/60 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        pdu.direction === 'outbound'
                          ? 'bg-sky-950 text-sky-400 border border-sky-500/30'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {pdu.direction.toUpperCase()}
                    </span>
                    <span className="font-bold text-amber-300">{pdu.command}</span>
                    <span className="text-slate-500">· Seq: #{pdu.sequenceNumber}</span>
                    <span className="text-slate-400">· Status: {pdu.commandStatus}</span>
                  </div>
                  <span className="text-slate-500">{pdu.timestamp}</span>
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  {pdu.decodedSummary}
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 text-[11px] text-slate-400 overflow-x-auto">
                  <span className="text-slate-600 block text-[10px] mb-0.5">RAW HEX PDU DUMP:</span>
                  <code className="text-slate-300 font-mono">{pdu.hexDump}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
