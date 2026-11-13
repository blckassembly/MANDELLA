import React, { useState } from 'react';
import {
  Activity,
  Phone,
  Server,
  Radio,
  Mic,
  Cpu,
  Database,
  ShieldAlert,
  Headphones,
  Volume2,
  Users,
  AlertTriangle,
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Clock,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { LiveCallSession, SupervisorMode } from '../../types/agnosticOS';
import { INITIAL_LIVE_CALLS, INITIAL_TELEMETRY } from '../../data/mockAgnosticData';

interface CommandControlDashboardProps {
  onOpenSoftphone?: (call: LiveCallSession) => void;
  onOpenWorkflow?: (workflowId: string) => void;
  onOpenAgent?: (agentId: string) => void;
}

export const CommandControlDashboard: React.FC<CommandControlDashboardProps> = ({
  onOpenSoftphone,
  onOpenWorkflow,
  onOpenAgent,
}) => {
  const [calls, setCalls] = useState<LiveCallSession[]>(INITIAL_LIVE_CALLS);
  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id || '');
  const [supervisorStatus, setSupervisorStatus] = useState<{ callId: string; mode: SupervisorMode } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCall = calls.find((c) => c.id === selectedCallId) || calls[0];

  const handleSupervisorAction = async (callId: string, action: SupervisorMode) => {
    try {
      setSupervisorStatus({ callId, mode: action });
      const res = await fetch('/api/v1/calls/supervisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, action }),
      });
      const data = await res.json();
      setToastMessage(data.message || `Supervisor ${action.toUpperCase()} engaged on FreeSWITCH bridge.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch {
      setToastMessage(`Supervisor ${action.toUpperCase()} engaged on media bridge (Simulated).`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleDisconnectCall = (callId: string) => {
    setCalls((prev) => prev.filter((c) => c.id !== callId));
    setToastMessage(`Call ${callId} terminated by supervisor on FreeSWITCH core.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Architecture Flow Strip (Directly from uploaded diagram) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-wider uppercase">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>COMMUNICATIONS OS MEDIA TOPOLOGY // FREESWITCH & RTPENGINE MESH</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>NODES: 6 POPs ACTIVE</span>
            <span>CAPACITY: 1,000 CONCURRENT CALLS/NODE</span>
          </div>
        </div>

        {/* Visual Node Diagram Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center justify-between">
              <span>01. Ingress</span>
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">Farmer / Consumer</div>
            <div className="text-[11px] text-slate-400 mt-0.5">SIP via IP Carrier</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2">1,040 Active Calls</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center justify-between">
              <span>02. Media Server</span>
              <Server className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">FreeSWITCH Core</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mandela Cloud (Sys 7/9)</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2">0.02% Jitter Loss</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center justify-between">
              <span>03. NAT Engine</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">RTPEngine Cluster</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Kernel Traversal</div>
            <div className="text-[10px] font-mono text-purple-300 mt-2">Latency: 4.2ms</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center justify-between">
              <span>04. Call Control</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">VoiceXML / NCCO</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Visual Flow Engine</div>
            <div className="text-[10px] font-mono text-amber-300 mt-2">State: Synchronized</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-pink-400 uppercase font-bold flex items-center justify-between">
              <span>05. Speech & AI</span>
              <Mic className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">ASR / TTS & LLM</div>
            <div className="text-[11px] text-slate-400 mt-0.5">50 African Dialects</div>
            <div className="text-[10px] font-mono text-pink-300 mt-2">Gemini 3.8 Flash</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center justify-between">
              <span>06. Analytics</span>
              <Database className="w-3.5 h-3.5" />
            </div>
            <div className="font-bold text-white mt-1">Recording & S3</div>
            <div className="text-[11px] text-slate-400 mt-0.5">AES-256 Encrypted</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-2">MOS Avg: 4.41</div>
          </div>
        </div>
      </div>

      {/* 2. Main Command & Control Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Live Call Channels (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Live Active Calls ({calls.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                AUTO-REFRESH: REAL-TIME (WEBSOCKETS)
              </span>
            </div>

            {/* List of active live calls */}
            <div className="mt-4 space-y-3">
              {calls.map((call) => {
                const isSelected = call.id === selectedCallId;
                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCallId(call.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-400 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-bold text-sm text-white">
                            {call.fromLabel}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            ({call.from})
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                          <span>To: <strong className="text-slate-200">{call.to}</strong></span>
                          <span>·</span>
                          <span className="text-cyan-400 font-mono">{call.workflowName}</span>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-emerald-400">
                          {Math.floor(call.durationSeconds / 60)}:
                          {(call.durationSeconds % 60).toString().padStart(2, '0')}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          MOS: <span className="text-white font-bold">{call.mosScore}</span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata strip */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300">
                          {call.selectedLanguage}
                        </span>
                        <span>{call.mediaServerId.split('.')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <span>ASR Conf: {(call.asrConfidence * 100).toFixed(0)}%</span>
                        {call.supervisorAction && call.supervisorAction !== 'none' && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-700/50 uppercase text-[9px] font-bold">
                            SUP: {call.supervisorAction}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {calls.length === 0 && (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  No active calls at this moment. Dispatch a simulated call from the simulator.
                </div>
              )}
            </div>
          </div>

          {/* Real-Time Telemetry Trend */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white">CONCURRENT CALLS &amp; LATENCY BENCHMARK</span>
              <span className="text-emerald-400">FREESWITCH CLUSTER LOAD: 64%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Active Channels</div>
                <div className="text-xl font-bold text-white mt-1 tabular-nums">1,015</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+4.2% peak surge</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">ASR Latency P99</div>
                <div className="text-xl font-bold text-cyan-400 mt-1 tabular-nums">82 ms</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Neural System 7</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">Mean Opinion (MOS)</div>
                <div className="text-xl font-bold text-emerald-400 mt-1 tabular-nums">4.41</div>
                <div className="text-[10px] text-slate-400 mt-0.5">G.711 / OPUS 16k</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-slate-400 text-[10px] uppercase">AI Reasoning P95</div>
                <div className="text-xl font-bold text-purple-400 mt-1 tabular-nums">140 ms</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Gemini 3.8 Flash</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Call Live Inspector & Supervisor Actions (5 cols) */}
        {activeCall && (
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                    CALL CONTROL SESSION INSPECTOR
                  </div>
                  <h4 className="font-bold text-white text-sm">{activeCall.fromLabel}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase font-bold">
                  {activeCall.state}
                </span>
              </div>

              {/* Call Details */}
              <div className="py-3 border-b border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Caller ID:</span>
                  <span className="text-white font-bold">{activeCall.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Media Server:</span>
                  <span className="text-slate-300">{activeCall.mediaServerId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NAT Engine:</span>
                  <span className="text-slate-300">{activeCall.rtpEngineId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Language Detected:</span>
                  <span className="text-cyan-400">{activeCall.detectedDialect || activeCall.selectedLanguage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Accrued Cost:</span>
                  <span className="text-emerald-400 font-bold">${activeCall.costAccruedUsd.toFixed(4)}</span>
                </div>
              </div>

              {/* Supervisor Actions (Listen, Barge, Whisper) */}
              <div className="py-4 border-b border-slate-800">
                <div className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider mb-2.5">
                  Supervisor Media Controls (Live FreeSWITCH Bridge)
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleSupervisorAction(activeCall.id, 'listen')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      supervisorStatus?.mode === 'listen' && supervisorStatus.callId === activeCall.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-cyan-800/50'
                    }`}
                    title="Silently listen to audio stream without audio transmission"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>

                  <button
                    onClick={() => handleSupervisorAction(activeCall.id, 'whisper')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      supervisorStatus?.mode === 'whisper' && supervisorStatus.callId === activeCall.id
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-800/50'
                    }`}
                    title="Speak into the agent's ear without the caller hearing"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Whisper</span>
                  </button>

                  <button
                    onClick={() => handleSupervisorAction(activeCall.id, 'barge')}
                    className={`py-2 px-2.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      supervisorStatus?.mode === 'barge' && supervisorStatus.callId === activeCall.id
                        ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-800/50'
                    }`}
                    title="Enter 3-way conference call bridging all participants"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Barge</span>
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => handleDisconnectCall(activeCall.id)}
                    className="py-1.5 px-3 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-mono font-bold transition-colors cursor-pointer"
                  >
                    Force Disconnect Call
                  </button>
                  <button
                    onClick={() => onOpenWorkflow && onOpenWorkflow(activeCall.workflowId)}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Inspect Workflow &rarr;
                  </button>
                </div>
              </div>

              {/* Live Streaming Audio Transcript */}
              <div className="pt-4">
                <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE SPEECH-TO-TEXT STREAM (ASR)</span>
                  </span>
                  <span>ENCRYPTED SRTP</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-sans text-xs">
                  {activeCall.liveTranscript.map((t) => (
                    <div key={t.id} className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span className={`font-bold ${
                          t.speaker === 'agent' ? 'text-emerald-400' : t.speaker === 'consumer' ? 'text-cyan-400' : 'text-slate-400'
                        }`}>
                          {t.speaker.toUpperCase()}
                        </span>
                        <span>{t.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed pl-2 border-l-2 border-slate-800">
                        {t.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
