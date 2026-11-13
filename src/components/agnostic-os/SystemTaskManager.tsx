import React, { useState } from 'react';
import { Activity, Cpu, Server, HardDrive, RefreshCw, XCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

interface ProcessItem {
  pid: number;
  name: string;
  subsystem: string;
  cpu: number;
  ramMb: number;
  status: 'running' | 'degraded' | 'restarting';
  cps: number;
  uptime: string;
}

export const SystemTaskManager: React.FC = () => {
  const [processes, setProcesses] = useState<ProcessItem[]>([
    { pid: 812, name: 'freeswitch-core', subsystem: 'Media Engine (1000 CPS)', cpu: 14.8, ramMb: 1240, status: 'running', cps: 48, uptime: '42d 18h' },
    { pid: 815, name: 'kamailio-sip-proxy', subsystem: 'Anycast SIP RFC 3261', cpu: 6.2, ramMb: 680, status: 'running', cps: 120, uptime: '42d 18h' },
    { pid: 820, name: 'rtpengine-daemon', subsystem: 'NAT Traversal / Jitter Buffer', cpu: 11.5, ramMb: 920, status: 'running', cps: 48, uptime: '42d 18h' },
    { pid: 904, name: 'african-asr-pool', subsystem: '50 African Languages ASR (System 7)', cpu: 19.4, ramMb: 2480, status: 'running', cps: 34, uptime: '12d 04h' },
    { pid: 910, name: 'gemini-agent-gateway', subsystem: 'AI Reasoning (Gemini 3.8 Flash)', cpu: 8.1, ramMb: 540, status: 'running', cps: 16, uptime: '42d 18h' },
    { pid: 925, name: 'kafka-cdr-mediator', subsystem: 'Realtime CDR Ingestion Pipeline', cpu: 4.0, ramMb: 410, status: 'running', cps: 180, uptime: '42d 18h' },
    { pid: 940, name: 'ebpf-packet-scrubber', subsystem: 'DDoS & SIP Firewall Kernel Filter', cpu: 2.8, ramMb: 180, status: 'running', cps: 840, uptime: '42d 18h' },
  ]);

  const [selectedPid, setSelectedPid] = useState<number>(812);
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'app_history'>('processes');

  const handleRestart = (pid: number) => {
    setProcesses((prev) =>
      prev.map((p) => (p.pid === pid ? { ...p, status: 'restarting' } : p))
    );
    setTimeout(() => {
      setProcesses((prev) =>
        prev.map((p) => (p.pid === pid ? { ...p, status: 'running', cpu: Math.round(Math.random() * 8 + 4) } : p))
      );
    }, 1200);
  };

  const handleKill = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  const totalCpu = processes.reduce((acc, p) => acc + p.cpu, 0).toFixed(1);
  const totalRam = (processes.reduce((acc, p) => acc + p.ramMb, 0) / 1024).toFixed(2);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans text-xs select-text rounded-b-xl overflow-hidden border border-slate-800">
      {/* Top Header & Metrics Bar */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">System Resource &amp; Task Manager</div>
            <div className="text-zinc-400 text-[11px] font-mono">
              Host: <span className="text-emerald-400">mandela-core-edge-01</span> · Kernel: 6.8.0-RT
            </div>
          </div>
        </div>

        {/* Global Resource Pill Gauges */}
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">CPU:</span>
            <span className="font-bold text-white">{totalCpu}%</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-zinc-400">RAM:</span>
            <span className="font-bold text-white">{totalRam} GB / 32 GB</span>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-400">CPS Load:</span>
            <span className="font-bold text-white">48 / 1,000 calls</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="bg-zinc-900/60 border-b border-zinc-800 px-3 flex items-center gap-1 font-mono text-xs">
        <button
          onClick={() => setActiveTab('processes')}
          className={`px-3 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'processes' ? 'border-emerald-400 text-white bg-zinc-800/50' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Processes ({processes.length})
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`px-3 py-2 border-b-2 font-semibold transition-colors cursor-pointer ${
            activeTab === 'performance' ? 'border-emerald-400 text-white bg-zinc-800/50' : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Performance Telemetry
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'processes' && (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Process Name</th>
                    <th className="py-2 px-3">PID</th>
                    <th className="py-2 px-3">Subsystem Role</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">CPU %</th>
                    <th className="py-2 px-3">Memory (MB)</th>
                    <th className="py-2 px-3">Channels</th>
                    <th className="py-2 px-3">Uptime</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {processes.map((proc) => {
                    const isSelected = selectedPid === proc.pid;
                    return (
                      <tr
                        key={proc.pid}
                        onClick={() => setSelectedPid(proc.pid)}
                        className={`hover:bg-slate-900 cursor-pointer transition-colors ${
                          isSelected ? 'bg-slate-800/60 text-white font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2 px-3 font-bold text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${proc.status === 'running' ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                          {proc.name}
                        </td>
                        <td className="py-2 px-3 text-emerald-400">{proc.pid}</td>
                        <td className="py-2 px-3 text-zinc-400 text-[11px]">{proc.subsystem}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              proc.status === 'running'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-zinc-900 text-zinc-400 border border-zinc-750'
                            }`}
                          >
                            {proc.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">{proc.cpu}%</td>
                        <td className="py-2 px-3">{proc.ramMb} MB</td>
                        <td className="py-2 px-3 text-zinc-200 font-bold">{proc.cps}</td>
                        <td className="py-2 px-3 text-zinc-400">{proc.uptime}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Process Action Toolbar (Windows Style) */}
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
              <span className="text-slate-400 text-xs font-mono">
                Selected PID: <strong className="text-white">{selectedPid}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestart(selectedPid)}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restart Service</span>
                </button>
                <button
                  onClick={() => handleKill(selectedPid)}
                  className="px-3 py-1.5 rounded bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>End Task</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-400" /> CPU Core Saturation (16 Cores)
                </span>
                <span className="text-emerald-400 font-bold">{totalCpu}%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, Number(totalCpu))}%` }} />
              </div>
              <div className="text-[11px] text-slate-400">
                RT-PREEMPT Kernel thread jitter: &lt; 12 microseconds. FreeSWITCH scheduling priority: -20.
              </div>
            </div>

            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> FreeSWITCH Concurrent Calls (CPS)
                </span>
                <span className="text-emerald-400 font-bold">48 / 1,000 Calls</span>
              </div>
              <div className="w-full bg-zinc-950 h-3 rounded-full overflow-hidden border border-zinc-800">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${(48 / 1000) * 100}%` }} />
              </div>
              <div className="text-[11px] text-zinc-400">
                Available headroom: 952 simultaneous audio bridges across Nairobi &amp; Lagos PoPs.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
