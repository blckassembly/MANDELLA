import React, { useState } from 'react';
import { AfricanLanguageModel } from '../../types/voice';
import { AFRICAN_LANGUAGE_MODELS } from '../../data/mockVoiceData';
import { Volume2, Sparkles, CheckCircle2, ShieldCheck, Search, Radio } from 'lucide-react';

export const AfricanLanguagesMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const filteredLanguages = AFRICAN_LANGUAGE_MODELS.filter((l) => {
    const q = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q)
    );
  });

  const handlePlaySampleAudio = (lang: AfricanLanguageModel) => {
    setPlayingCode(lang.code);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sampleAudioPrompt);
      utterance.rate = 0.9;
      utterance.onend = () => setPlayingCode(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingCode(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white">50 African Languages Speech Matrix (ASR & Neural TTS)</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 7</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Custom speech recognition and text-to-speech models trained on African speech datasets with real-time code-switching.
          </p>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search language or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLanguages.map((lang) => (
          <div
            key={lang.code}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3.5 hover:border-slate-700 transition-all text-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white text-sm">{lang.name}</h3>
                  <span className="text-xs text-amber-300 font-mono">({lang.nativeName})</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {lang.region} · {lang.speakersCount} speakers
                </div>
              </div>

              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 uppercase">
                {lang.status}
              </span>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px] block">ASR Acc</span>
                <span className="text-emerald-400 font-bold">{lang.asrAccuracy}%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">TTS MOS</span>
                <span className="text-white font-bold">{lang.ttsNaturalnessMos} / 5</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Code-Switch</span>
                <span className={lang.codeSwitchingSupport ? 'text-amber-300' : 'text-slate-500'}>
                  {lang.codeSwitchingSupport ? 'Active' : 'Mono'}
                </span>
              </div>
            </div>

            {/* Sample Spoken Phrase */}
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Sample Spoken Prompt:</span>
              <p className="text-slate-200 text-xs italic">&ldquo;{lang.sampleAudioPrompt}&rdquo;</p>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                EN: {lang.sampleTranslationEn}
              </p>
            </div>

            {/* Listen button */}
            <button
              onClick={() => handlePlaySampleAudio(lang)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <Volume2 className={`w-3.5 h-3.5 ${playingCode === lang.code ? 'animate-pulse text-amber-400' : ''}`} />
              <span>{playingCode === lang.code ? 'Synthesizing Audio...' : 'Preview Neural Speech'}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
