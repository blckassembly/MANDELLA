import React, { useState } from 'react';
import {
  Wifi,
  Radio,
  Volume2,
  Mic,
  Moon,
  Sun,
  Shield,
  Activity,
  Server,
  Zap,
  Sliders,
  X
} from 'lucide-react';

interface ControlCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export const ControlCenterModal: React.FC<ControlCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenApp
}) => {
  const [audioGain, setAudioGain] = useState(82);
  const [asrSensitivity, setAsrSensitivity] = useState(90);
  const [jitterBufferMs, setJitterBufferMs] = useState(40);
  const [isDDoSDefenseActive, setIsDDoSDefenseActive] = useState(true);
  const [isSubseaAnycastActive, setIsSubseaAnycastActive] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-transparent"
      onClick={onClose}
    >
      <div
        className="w-80 sm:w-96 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-4 text-slate-100 font-sans space-y-3.5 animate-in fade-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <span className="font-bold text-sm tracking-tight text-white">Mandela Control Center</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2x2 Network & Telecom Quick Tiles */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Subsea Anycast */}
          <div
            onClick={() => setIsSubseaAnycastActive(!isSubseaAnycastActive)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              isSubseaAnycastActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <Radio className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2">
              <div className="text-[10px] uppercase font-mono font-bold">Anycast BGP</div>
              <div className="text-xs font-bold text-white">Equiano / 2Africa</div>
            </div>
          </div>

          {/* eBPF XDP Firewall */}
          <div
            onClick={() => setIsDDoSDefenseActive(!isDDoSDefenseActive)}
            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              isDDoSDefenseActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-zinc-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <Shield className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-[10px] uppercase font-mono font-bold">eBPF XDP Scrub</div>
              <div className="text-xs font-bold text-white">100K PPS Shield</div>
            </div>
          </div>
        </div>

        {/* Sliders: Media Audio Output & ASR Input */}
        <div className="space-y-3 p-3 rounded-xl bg-white/5 border border-white/10">
          {/* Audio Output Gain */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-zinc-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> FreeSWITCH Master Audio Gain
              </span>
              <span className="font-mono text-emerald-300 font-bold">{audioGain}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={audioGain}
              onChange={(e) => setAudioGain(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* ASR Input Sensitivity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Mic className="w-3.5 h-3.5 text-emerald-400" /> African Dialect ASR Sensitivity
              </span>
              <span className="font-mono text-emerald-300 font-bold">{asrSensitivity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={asrSensitivity}
              onChange={(e) => setAsrSensitivity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* RTPEngine Jitter Buffer */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> RTPEngine Jitter Buffer
              </span>
              <span className="font-mono text-amber-300 font-bold">{jitterBufferMs} ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="150"
              value={jitterBufferMs}
              onChange={(e) => setJitterBufferMs(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Quick Launch Shortcuts */}
        <div className="pt-1 flex items-center justify-between gap-2 text-xs font-mono">
          <button
            onClick={() => {
              onOpenApp('terminal');
              onClose();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
          >
            Launch Shell
          </button>
          <button
            onClick={() => {
              onOpenApp('task_manager');
              onClose();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
          >
            Task Manager
          </button>
          <button
            onClick={() => {
              onOpenApp('file_explorer');
              onClose();
            }}
            className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-center transition-colors cursor-pointer"
          >
            File Explorer
          </button>
        </div>
      </div>
    </div>
  );
};
