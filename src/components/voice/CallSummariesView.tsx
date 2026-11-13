import React, { useState } from 'react';
import { CallSummaryReport } from '../../types/voice';
import { INITIAL_CALL_SUMMARIES } from '../../data/mockVoiceData';
import { Play, Square, Download, Sparkles, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CallSummariesView: React.FC = () => {
  const [summaries] = useState<CallSummaryReport[]>(INITIAL_CALL_SUMMARIES);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);

  const togglePlayAudio = (callId: string) => {
    if (playingCallId === callId) {
      setPlayingCallId(null);
    } else {
      setPlayingCallId(callId);
      setTimeout(() => {
        setPlayingCallId(null);
      }, 4000);
    }
  };

  const handleDownloadReport = (format: 'json' | 'csv') => {
    const blob = new Blob(
      [
        format === 'json'
          ? JSON.stringify(summaries, null, 2)
          : 'CallID,MSISDN,Language,Intent,Sentiment\n' +
            summaries.map((s) => `${s.callId},${s.callerMsisdn},${s.language},"${s.intent}",${s.sentiment}`).join('\n')
      ],
      { type: format === 'json' ? 'application/json' : 'text/csv' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Mandela_Voice_Call_Summaries_${Date.now()}.${format}`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">Post-Call Structured AI Summaries & Recording Intelligence</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 8 & 10</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn low-literacy spoken phone calls into structured database outcomes, sentiment scores, and synchronized transcripts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadReport('json')}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded transition-colors flex items-center gap-1.5 border border-slate-700 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => handleDownloadReport('csv')}
            className="py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summaries List */}
      <div className="space-y-4">
        {summaries.map((summary) => (
          <div
            key={summary.callId}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="font-mono text-base font-bold text-white">
                  {summary.callerMsisdn}
                </span>
                <span className="text-slate-400">on line</span>
                <span className="font-mono text-amber-300 font-semibold">{summary.didE164}</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                  {summary.language}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold ${
                    summary.sentiment === 'positive'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {summary.sentiment}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-slate-400">
                <span>Duration: {summary.durationSec}s</span>
                <span>·</span>
                <span>{summary.timestamp}</span>
              </div>
            </div>

            {/* Audio Waveform Simulator */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-4">
              <button
                onClick={() => togglePlayAudio(summary.callId)}
                className="p-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow-md shrink-0"
              >
                {playingCallId === summary.callId ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 flex items-center gap-1.5 h-8">
                {summary.recordingWaveform.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${
                      playingCallId === summary.callId ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <span className="text-[11px] font-mono text-slate-500 shrink-0">
                {playingCallId === summary.callId ? 'Streaming FreeSWITCH WAV' : 'Encrypted SRTP'}
              </span>
            </div>

            {/* AI Extracted Narrative & Structured Outcome */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
              <div className="lg:col-span-7 space-y-1">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-mono block">
                  AI Transcript Abstract:
                </span>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {summary.transcriptSummary}
                </p>
              </div>

              <div className="lg:col-span-5 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
                <span className="text-slate-500 uppercase text-[10px] block mb-1">Structured Outcome Entities:</span>
                {Object.entries(summary.structuredOutcome).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-400">{k}:</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
