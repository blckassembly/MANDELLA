import React, { useState, useEffect } from 'react';
import {
  Server,
  Cpu,
  Globe,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Zap,
  Activity,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

interface MandelaOsBootstrapProps {
  onBootstrapComplete: () => void;
  tenantSlug?: string;
}

interface BootStep {
  id: string;
  subsystem: string;
  message: string;
  status: 'pending' | 'running' | 'ok';
  latencyMs?: number;
}

const INITIAL_BOOT_STEPS: BootStep[] = [
  { id: '1', subsystem: 'BIOS/UEFI', message: 'Verifying hardware cryptographic keys (TPM 2.0 & GSMA SGP.22)...', status: 'pending' },
  { id: '2', subsystem: 'KERNEL', message: 'Loading Mandela Pan-African Linux Microkernel 6.8 RT-PREEMPT...', status: 'pending' },
  { id: '3', subsystem: 'CPU/MEMORY', message: 'Allocating zero-copy shared ringbuffers for 64 audio threads...', status: 'pending' },
  { id: '4', subsystem: 'NETWORK', message: 'Establishing BGP Anycast mesh peering (Lagos, Nairobi, Johannesburg, Cairo)...', status: 'pending' },
  { id: '5', subsystem: 'REGISTRIES', message: 'Mounting 54 African Sovereign ITU-T E.164 dial plans & NNP schemas...', status: 'pending' },
  { id: '6', subsystem: 'FREESWITCH', message: 'Binding ESL socket on 127.0.0.1:8021 @ 1,000 CPS per Anycast node...', status: 'pending' },
  { id: '7', subsystem: 'KAMAILIO', message: 'Synchronizing Kamailio 5.7 SIP RFC 3261 stateful proxy plane...', status: 'pending' },
  { id: '8', subsystem: 'DATABASE', message: 'PostgreSQL Multi-Tenant partition & Redis 15-minute reservation cache armed...', status: 'pending' },
  { id: '9', subsystem: 'FOUNDATION', message: 'Initializing MANDELA OS Universal Desktop Workspace & Auto-Hide Engine...', status: 'pending' }
];

export const MandelaOsBootstrap: React.FC<MandelaOsBootstrapProps> = ({
  onBootstrapComplete,
  tenantSlug = 'safaricom'
}) => {
  const [steps, setSteps] = useState<BootStep[]>(INITIAL_BOOT_STEPS);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let currentStepIdx = 0;
    const stepInterval = 120; // Fast and snappy ~1.2s total

    const interval = setInterval(() => {
      if (currentStepIdx < INITIAL_BOOT_STEPS.length) {
        const idx = currentStepIdx;
        setSteps((prev) =>
          prev.map((step, sIdx) => {
            if (sIdx === idx) {
              return { ...step, status: 'ok', latencyMs: Math.floor(Math.random() * 8) + 2 };
            }
            if (sIdx === idx + 1) {
              return { ...step, status: 'running' };
            }
            return step;
          })
        );
        currentStepIdx++;
        setProgress(Math.round((currentStepIdx / INITIAL_BOOT_STEPS.length) * 100));
      } else {
        clearInterval(interval);
        setIsDone(true);
        setTimeout(() => {
          onBootstrapComplete();
        }, 300);
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, [onBootstrapComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950 text-zinc-100 font-mono select-none flex flex-col justify-between p-6 sm:p-12 overflow-hidden">
      {/* Top Header: System Spec & Telecom Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-lg">
            M
          </div>
          <div>
            <div className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span>MANDELA OS BOOTSTRAP LOADER</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                KERNEL 6.8 RT
              </span>
            </div>
            <div className="text-xs text-zinc-400">
              Sovereign Pan-African Telecommunications Operating System · Tenant: <strong className="text-emerald-400">{tenantSlug}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={onBootstrapComplete}
          className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-sm group"
        >
          <span>Fast Boot (Skip Loader)</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Main Console Boot Stream */}
      <div className="my-auto max-w-4xl w-full mx-auto space-y-4 py-6">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-zinc-200 uppercase tracking-wider">Subsystem Bootstrap Diagnostics</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-zinc-500">Progress:</span>
              <strong className="text-emerald-400">{progress}%</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-150 ease-out shadow-sm shadow-emerald-400/50"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Log Stream */}
          <div className="space-y-2 text-xs font-mono max-h-72 overflow-y-auto scrollbar-none pt-1">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors ${
                  s.status === 'ok'
                    ? 'text-zinc-350 bg-zinc-950/40'
                    : s.status === 'running'
                    ? 'text-emerald-300 bg-emerald-950/30 border border-emerald-800/40'
                    : 'text-zinc-600'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate pr-2">
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      s.status === 'ok'
                        ? 'bg-zinc-800 text-zinc-300'
                        : s.status === 'running'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-zinc-850 text-zinc-600'
                    }`}
                  >
                    {s.subsystem}
                  </span>
                  <span className="truncate">{s.message}</span>
                </div>

                <div className="shrink-0 flex items-center gap-2 text-[11px]">
                  {s.status === 'ok' && (
                    <>
                      <span className="text-zinc-500">{s.latencyMs}ms</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </>
                  )}
                  {s.status === 'running' && (
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  )}
                  {s.status === 'pending' && <span className="text-zinc-600">...</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer System Line */}
      <div className="border-t border-zinc-800 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>BOOTSTRAP ENGINE ACTIVE</span>
          </span>
          <span className="text-zinc-700">|</span>
          <span>AUTONOMOUS TELECOM OS FOUNDATION</span>
        </div>
        <div className="text-[11px] font-mono text-zinc-400">
          54 NATIONS · 100+ CARRIERS · GSMA SGP.22 eSIM VAULT · ZERO-SLIDER ARCHITECTURE
        </div>
      </div>
    </div>
  );
};
