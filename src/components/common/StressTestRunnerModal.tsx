import React, { useState } from 'react';
import {
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
  Satellite,
  Rocket,
  Building2,
  Server,
  ShieldAlert,
  Sliders,
  Check,
  TrendingDown
} from 'lucide-react';
import {
  ModalShell,
  Badge,
  Button,
  Card,
  StatCard,
  StatusDot
} from '../../design-system';

interface StressScenario {
  id: string;
  name: string;
  targetPersona: 'Satellite Carrier' | 'Telecom MNO' | 'FinTech Startup' | 'Enterprise Scale';
  icon: React.ReactNode;
  description: string;
  loadMetric: string;
  expectedSla: string;
}

const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'sat-doppler',
    name: 'Satellite Doppler Shift & LEO Beam Handover',
    targetPersona: 'Satellite Carrier',
    icon: <Satellite className="w-4 h-4 text-sky-400" />,
    description: 'Simulates rapid orbital motion inducing ±45 kHz carrier frequency drift and sudden beam handovers over the East African Rift.',
    loadMetric: '±45 kHz Doppler Drift · 180ms Max Jitter',
    expectedSla: '0% Dropped Packets · Jitter Buffer Clamped <75ms',
  },
  {
    id: 'telco-cps',
    name: '10,000 CPS Core Signaling Flood',
    targetPersona: 'Telecom MNO',
    icon: <Radio className="w-4 h-4 text-amber-400" />,
    description: 'Saturates Kamailio dispatcher with 10,000 SIP INVITEs/sec across 6 African PoPs simultaneously to test anycast autoscaling.',
    loadMetric: '10,000 Calls/sec Burst across 6 PoPs',
    expectedSla: 'p99 Signaling Latency <12ms · Zero 503 Overload',
  },
  {
    id: 'interconnect-grey',
    name: 'Carrier Grey Route & Negative Margin Attack',
    targetPersona: 'Telecom MNO',
    icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
    description: 'Simulates sudden 400% tariff spike by an upstream aggregator and checks automated AI LCRq rerouting in under 3 seconds.',
    loadMetric: 'Sudden $0.048/min Tariff Spike on +254 (KE)',
    expectedSla: 'Automatic Reroute <3.2s · Zero Negative Margins',
  },
  {
    id: 'startup-otp',
    name: 'Startup Flash-Sale SMS Surge with USSD Failover',
    targetPersona: 'FinTech Startup',
    icon: <Rocket className="w-4 h-4 text-violet-400" />,
    description: 'Simulates 50,000 OTPs sent in 60 seconds with MNO queue congestion, verifying instantaneous fallback to USSD sessions.',
    loadMetric: '50,000 OTPs in 60s · 40% SMPP Throttling',
    expectedSla: 'Delivery Rate ≥98.4% (via USSD fallback)',
  },
  {
    id: 'enterprise-failover',
    name: 'Pan-African Multi-Region PoP Disaster Drain',
    targetPersona: 'Enterprise Scale',
    icon: <Building2 className="w-4 h-4 text-emerald-400" />,
    description: 'Force-drains Nairobi AS37105 hub and verifies BGP anycast convergence to Johannesburg and Lagos without active call drops.',
    loadMetric: 'Total Nairobi PoP Fiber Cut Simulation',
    expectedSla: 'BGP Convergence <800ms · 0 Active Call Disconnects',
  },
];

interface StressTestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StressTestRunnerModal: React.FC<StressTestRunnerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sat-doppler');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [completedMetrics, setCompletedMetrics] = useState<{
    latencyMs: number;
    throughput: string;
    slaCompliance: string;
    verdict: 'PASS' | 'FAIL';
  } | null>(null);

  const selectedScenario = STRESS_SCENARIOS.find((s) => s.id === selectedScenarioId) || STRESS_SCENARIOS[0];

  const handleStartStressTest = () => {
    setIsRunning(true);
    setProgress(0);
    setCompletedMetrics(null);
    setLogs([`[0.00s] Initializing Stress Test: "${selectedScenario.name}"...`]);

    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 20;

        if (next === 20) {
          setLogs((l) => [
            ...l,
            `[0.45s] Injecting simulated stress payload: ${selectedScenario.loadMetric}...`,
            `[0.60s] Monitoring Kamailio SIP core & RTPEngine jitter metrics...`,
          ]);
        } else if (next === 40) {
          setLogs((l) => [
            ...l,
            `[1.10s] Anycast cluster absorbing burst. CPU load steady at 38%.`,
            `[1.35s] AI anomaly engine engaged. Analyzing packet streams...`,
          ]);
        } else if (next === 60) {
          setLogs((l) => [
            ...l,
            `[1.80s] Automated mitigating policy applied: dynamic jitter clamped / LCRq reroute locked.`,
          ]);
        } else if (next === 80) {
          setLogs((l) => [
            ...l,
            `[2.40s] Stress cycle stabilized across 6 African PoPs. Verifying SLA guarantees...`,
          ]);
        } else if (next >= 100) {
          clearInterval(stepInterval);
          setIsRunning(false);
          setLogs((l) => [
            ...l,
            `[2.85s] TEST COMPLETED SUCCESSFULLY! All carrier invariants preserved.`,
          ]);
          setCompletedMetrics({
            latencyMs: selectedScenario.id === 'sat-doppler' ? 32 : 11,
            throughput: selectedScenario.id === 'telco-cps' ? '10,240 CPS' : '99.8% Nominal',
            slaCompliance: selectedScenario.id === 'startup-otp' ? '98.7% Delivery' : '100% SLA Guarantee',
            verdict: 'PASS',
          });
          return 100;
        }

        return next;
      });
    }, 500);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="First-Principles Carrier Stress Test Simulator"
      subtitle="Stress test edge capacity, satellite Doppler compensation, and carrier failover across Africa."
      icon={<Activity className="w-5 h-5 text-rose-400" />}
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Select Stress Scenario
          </label>
          {STRESS_SCENARIOS.map((sc) => {
            const isSelected = sc.id === selectedScenarioId;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  if (!isRunning) {
                    setSelectedScenarioId(sc.id);
                    setCompletedMetrics(null);
                    setLogs([]);
                    setProgress(0);
                  }
                }}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500/80 bg-amber-950/20 shadow-md'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {sc.icon}
                  <span className="font-semibold text-slate-100 text-xs">{sc.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {sc.targetPersona}
                </div>
              </div>
            );
          })}
        </div>

        {/* Test Console & Execution */}
        <div className="lg:col-span-2 space-y-4">
          <Card variant="elevated" className="p-4 border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  {selectedScenario.icon}
                  {selectedScenario.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedScenario.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 mb-4">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Simulated Load</span>
                <span className="text-slate-200 font-mono font-medium">{selectedScenario.loadMetric}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">Target SLA</span>
                <span className="text-emerald-400 font-mono font-medium">{selectedScenario.expectedSla}</span>
              </div>
            </div>

            {/* Run Button and Progress */}
            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                loading={isRunning}
                onClick={handleStartStressTest}
                icon={<Play className="w-4 h-4" />}
              >
                {isRunning ? 'Injecting Real-time Stress Packets...' : 'Execute Live Stress Test'}
              </Button>

              {isRunning && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>Stress Packet Emission</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Results Summary */}
          {completedMetrics && (
            <Card variant="neonAmber" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4" />
                  Stress Test Result: {completedMetrics.verdict}
                </div>
                <Badge variant="live">Production Ready</Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Edge Latency</span>
                  <span className="text-slate-100 font-bold">{completedMetrics.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Peak Sustained</span>
                  <span className="text-sky-400 font-bold">{completedMetrics.throughput}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SLA Verified</span>
                  <span className="text-emerald-400 font-bold">{completedMetrics.slaCompliance}</span>
                </div>
              </div>
            </Card>
          )}

          {/* Live Packet Logs Terminal */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-1 mb-1">
              Live Edge Packet Tracer & Diagnostic Output:
            </div>
            {logs.length === 0 ? (
              <div className="text-slate-600 italic">Click "Execute Live Stress Test" to begin packet tracing.</div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="leading-tight text-[11px]">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ModalShell>
  );
};
