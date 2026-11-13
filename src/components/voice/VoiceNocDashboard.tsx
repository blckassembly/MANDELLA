import React, { useState } from 'react';
import { LiveVoiceCall, AfricanLanguageModel } from '../../types/voice';
import {
  PhoneCall,
  Volume2,
  Mic,
  Users,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Play,
  Square,
  ShieldCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface VoiceNocDashboardProps {
  liveCalls: LiveVoiceCall[];
  languages: AfricanLanguageModel[];
  onOpenFlowBuilder: () => void;
  onOpenCallSimulator: (call?: LiveVoiceCall) => void;
  onOpenLanguages: () => void;
  onSupervisorAction: (callId: string, action: 'listening' | 'whispering' | 'barged' | 'none') => void;
}

export const VoiceNocDashboard: React.FC<VoiceNocDashboardProps> = ({
  liveCalls,
  languages,
  onOpenFlowBuilder,
  onOpenCallSimulator,
  onOpenLanguages,
  onSupervisorAction
}) => {
  const [selectedCallId, setSelectedCallId] = useState<string>(liveCalls[0]?.id || '');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedCall = liveCalls.find((c) => c.id === selectedCallId) || liveCalls[0];

  const avgMos = (
    liveCalls.reduce((acc, c) => acc + c.mosScore, 0) / (liveCalls.length || 1)
  ).toFixed(2);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Thesis Hero Banner (PRD Section 1 & 2.2) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                System 3 · Consumer Voice & IVR
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-emerald-400 font-mono font-medium">
                FreeSWITCH + RTPEngine Media Cluster
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Voice for people who can&apos;t read. Voice is the UI.
            </h1>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Serving low-literacy populations across Africa with conversational voice prompts in 50 African languages, streaming speech recognition, real-time code-switching, and rural background noise suppression.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
            <div className="text-center pr-4 border-r border-slate-800">
              <div className="text-[10px] uppercase font-mono text-slate-400">Call Completion</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-1">
                94.6%
              </div>
              <div className="text-[10px] text-emerald-500 font-medium">SLA Target ≥92%</div>
            </div>

            <div className="text-center pl-2">
              <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold">
                African Languages
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tabular-nums mt-1">
                50 Online
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Custom Neural ASR/TTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Active Media Channels
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              {liveCalls.length}
            </span>
            <span className="text-xs text-slate-400">/ 1,000 per node</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            FreeSWITCH & RTPEngine NAT
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Mean Opinion Score (MOS)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {avgMos}
            </span>
            <span className="text-xs text-slate-400">/ 5.0 (SLA &gt;3.8)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            2G Noise Suppression Active
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            ASR/TTS Turnaround Latency
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white tabular-nums">
              1.2s
            </span>
            <span className="text-xs text-emerald-400">· SLA &lt;1.5s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Streaming Speech Inference
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
            Code-Switching Detection
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              96.8%
            </span>
            <span className="text-xs text-slate-400">accuracy</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">
            Twi+En / Swahili+Sheng
          </div>
        </div>
      </div>

      {/* Live Calls & Supervisor Center (PRD Section 5.4 & 10) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Live Calls Stream (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider pb-2 border-b border-slate-800 flex justify-between items-center">
            <span>Live Voice Calls ({liveCalls.length})</span>
            <span className="font-mono text-[10px] text-emerald-400">RTP Relay OK</span>
          </div>

          <div className="space-y-2">
            {liveCalls.map((call) => (
              <div
                key={call.id}
                onClick={() => setSelectedCallId(call.id)}
                className={`p-3.5 rounded-lg border text-xs cursor-pointer transition-all ${
                  call.id === selectedCallId
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{call.callerMsisdn}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      DID: <span className="text-amber-300 font-mono">{call.didE164}</span> · {call.carrier}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-400 block tabular-nums">
                      {Math.floor(call.durationSec / 60)}:{(call.durationSec % 60).toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">MOS: {call.mosScore}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium truncate max-w-[200px]">
                    {call.flowName}
                  </span>
                  <span className="text-amber-300 font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800">
                    {call.detectedLanguage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Supervisor Console (Listen / Whisper / Barge) & Live Transcript (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Active Call: {selectedCall.callerMsisdn}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  {selectedCall.state.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Node: <span className="font-mono text-slate-300">{selectedCall.mediaServer}</span> · Step: {selectedCall.currentStep}
              </p>
            </div>

            {/* Supervisor Action Controls (Listen / Whisper / Barge - PRD Section 5.4 & 10) */}
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => onSupervisorAction(selectedCall.id, 'listening')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  selectedCall.supervisorMode === 'listening'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Silent listen to call audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>

              <button
                onClick={() => onSupervisorAction(selectedCall.id, 'whispering')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  selectedCall.supervisorMode === 'whispering'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Whisper guidance to agent/bridge"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Whisper</span>
              </button>

              <button
                onClick={() => onSupervisorAction(selectedCall.id, 'barged')}
                className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                  selectedCall.supervisorMode === 'barged'
                    ? 'bg-rose-500 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Join call as 3-way conference"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Barge</span>
              </button>
            </div>
          </div>

          {/* Code-Switching & Biometrics Banner */}
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">
                Code-Switching Detector:{' '}
                <strong className="text-amber-300">
                  {selectedCall.codeSwitchingDetected ? selectedCall.codeSwitchingPair : 'Mono-lingual'}
                </strong>
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">
              Noise Suppression: -22dB Active
            </span>
          </div>

          {/* Real-time Streaming Speech Transcript */}
          <div className="space-y-2">
            <span className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold block">
              Live Speech Transcript (Streaming ASR)
            </span>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 max-h-52 overflow-y-auto text-xs font-mono">
              {selectedCall.liveTranscript.map((turn, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className={turn.speaker === 'system' ? 'text-amber-400' : 'text-emerald-400'}>
                      {turn.speaker === 'system' ? 'SYSTEM TTS (Neural)' : `CALLER (${selectedCall.detectedLanguage})`}
                    </span>
                    <span>{turn.time}</span>
                  </div>
                  <p className="text-slate-200 font-sans text-xs">{turn.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-mono">
              FreeSWITCH RTP Audio Port: 16384 (Opus/G.711u)
            </span>
            <button
              onClick={() => onOpenCallSimulator(selectedCall)}
              className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5"
            >
              <span>Open Call Tester Simulator →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onOpenFlowBuilder}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-1.5"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>Visual IVR & NCCO Builder</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Drag-and-drop call menus or edit programmable NCCO VoiceXML with speech recognition.
          </p>
        </button>

        <button
          onClick={onOpenLanguages}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-1.5"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>50 African Languages Speech Matrix</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Preview neural voices and inspect Word Error Rate (WER) across Twi, Swahili, Yoruba, Hausa, Zulu.
          </p>
        </button>

        <button
          onClick={() => onOpenCallSimulator()}
          className="bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl p-4 text-left transition-all hover:border-slate-700 group space-y-1.5"
        >
          <div className="flex items-center justify-between text-white font-semibold text-sm">
            <span>Interactive Phone Call Simulator</span>
            <PhoneCall className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dial into any published African IVR line, listen to synthesized speech, and test DTMF/ASR.
          </p>
        </button>
      </div>
    </div>
  );
};
