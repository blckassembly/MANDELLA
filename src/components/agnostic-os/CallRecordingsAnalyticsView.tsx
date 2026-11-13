import React, { useState } from 'react';
import {
  Database,
  Search,
  Play,
  Pause,
  Download,
  ShieldCheck,
  Eye,
  EyeOff,
  Volume2,
  Clock,
  CheckCircle2,
  Sliders,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react';
import { CallRecordingRecord } from '../../types/agnosticOS';
import { INITIAL_RECORDINGS } from '../../data/mockAgnosticData';

export const CallRecordingsAnalyticsView: React.FC = () => {
  const [recordings, setRecordings] = useState<CallRecordingRecord[]>(INITIAL_RECORDINGS);
  const [selectedRecordId, setSelectedRecordId] = useState<string>(recordings[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [piiRedacted, setPiiRedacted] = useState<boolean>(true);
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(12);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedRecord = recordings.find((r) => r.id === selectedRecordId) || recordings[0];

  const filteredRecordings = recordings.filter((r) =>
    r.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.transcription.some((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownloadPcap = () => {
    setToastMessage(`Downloading encrypted raw RTP PCAP trace for session ${selectedRecord.callSessionId}...`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: S3 Storage & Encryption Posture */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>RECORDINGS &amp; ANALYTICS // SOVEREIGN S3 VAULT</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-1">
            Searchable Call Recordings, Transcripts &amp; Quality Metrics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Encrypted with AES-GCM-256 at rest. AU Malabo Convention compliant with automated PII masking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPiiRedacted(!piiRedacted)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              piiRedacted
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {piiRedacted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>PII REDACTION: {piiRedacted ? 'ACTIVE' : 'UNMASKED'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recording List & Search (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-bold text-white text-xs font-mono">CALL ARCHIVES ({filteredRecordings.length})</span>
              <span className="text-[11px] font-mono text-slate-500">RETENTION: 90 DAYS</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search transcripts, keywords, or numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {filteredRecordings.map((rec) => {
                const isSelected = rec.id === selectedRecordId;
                return (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecordId(rec.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-800 border-emerald-400 shadow-md ring-1 ring-emerald-400/40'
                        : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-mono text-xs font-bold text-white">
                        {piiRedacted ? rec.from.slice(0, 7) + 'XXXX' : rec.from}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        MOS: {rec.mosScore}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {rec.summary}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{rec.language} · {rec.durationSeconds}s</span>
                      <span className="text-zinc-400">{new Date(rec.startedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Audio Waveform Player & Searchable Transcript (7 cols) */}
        {selectedRecord && (
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    SESSION RECORDING DETAIL
                  </div>
                  <h3 className="font-bold text-white text-sm">
                    {piiRedacted ? selectedRecord.from.slice(0, 7) + 'XXXX' : selectedRecord.from} &rarr; {selectedRecord.to}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadPcap}
                    className="py-1.5 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Raw PCAP</span>
                  </button>
                </div>
              </div>

              {/* Audio Waveform Player Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={togglePlayback}
                      className="w-9 h-9 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 flex items-center justify-center transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                    </button>
                    <span className="text-white font-bold">
                      00:{playbackSeconds.toString().padStart(2, '0')} / 02:22
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    OPUS 16kHz · 2-CHANNEL STEREO
                  </span>
                </div>

                {/* Simulated Audio Waveform Bars */}
                <div className="h-12 flex items-center gap-1 pt-2">
                  {Array.from({ length: 48 }).map((_, idx) => {
                    const heightPercent = Math.sin(idx * 0.4) * 40 + 50;
                    const isPassed = idx < (playbackSeconds / 142) * 48;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all ${
                          isPassed ? 'bg-emerald-400' : 'bg-slate-800'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Executive AI Call Summary */}
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                <div className="font-bold text-emerald-400 font-mono text-[10px] uppercase mb-1">
                  AI Call Summary &amp; Structured Insights
                </div>
                <p className="text-slate-200 leading-relaxed font-sans">
                  {selectedRecord.summary}
                </p>
              </div>

              {/* Searchable Diarized Transcript */}
              <div>
                <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
                  <span>SPEAKER TURNS (DIARIZATION CONFIDENCE: 98.4%)</span>
                  <span className="text-emerald-400">CONSENT ANNOUNCED</span>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto p-3 rounded-lg bg-slate-950 border border-slate-800 font-sans text-xs">
                  {selectedRecord.transcription.map((turn, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={`font-bold ${turn.speaker === 'agent' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {turn.speaker.toUpperCase()} [00:{turn.startSecond.toString().padStart(2, '0')}]
                        </span>
                        <span className="text-slate-500">Confidence: {(turn.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-slate-200 text-xs leading-relaxed pl-2.5 border-l-2 border-slate-800">
                        {turn.text}
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
