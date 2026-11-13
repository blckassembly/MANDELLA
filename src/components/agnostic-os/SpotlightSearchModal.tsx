import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  Activity,
  Bot,
  Sliders,
  Server,
  Database,
  PhoneCall,
  HardDrive,
  FileText,
  CornerDownLeft,
  X,
  Sparkles,
  Globe
} from 'lucide-react';
import { INITIAL_LIVE_CALLS } from '../../data/mockAgnosticData';
import { LiveCallSession } from '../../types/agnosticOS';

interface SpotlightSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
}

export const SpotlightSearchModal: React.FC<SpotlightSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenApp
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const ALL_ITEMS = [
    { id: 'command_control', title: 'Command & Control Dashboard', category: 'Applications', icon: Activity, subtitle: 'Live SIP call monitoring, MOS scores, FreeSWITCH audio bridges' },
    { id: 'pan_africa_numbers', title: 'Pan-Africa Number Inventory & ITU Registry', category: 'Telephony & Inventory', icon: Globe, subtitle: '54 African countries, ITU numbering rules, DIDWW/Twilio/DIDLogic/MNO aggregation, 15m reservations' },
    { id: 'agent_builder', title: 'AI Agent Studio', category: 'Applications', icon: Bot, subtitle: 'Natural language voice agent compiler & approval gate' },
    { id: 'workflow_builder', title: 'Visual Callflow (NCCO)', category: 'Applications', icon: Sliders, subtitle: 'VoiceXML 2.1 & NCCO DAG visual builder and debugger' },
    { id: 'providers', title: 'Provider Registry & Adapters', category: 'Applications', icon: Server, subtitle: 'Agnostic telephony, speech ASR/TTS, and AI model adapters' },
    { id: 'recordings', title: 'Recordings & Transcripts', category: 'Applications', icon: Database, subtitle: 'Audio waveforms, diarized transcripts, PII masking, PCAPs' },
    { id: 'dev_console', title: 'Developer Console & API', category: 'Applications', icon: Terminal, subtitle: 'OpenAPI 3.1 specification and HMAC-SHA256 webhook tester' },
    { id: 'terminal', title: 'Mandela Telecom Shell (msh)', category: 'System Tools (Linux)', icon: Terminal, subtitle: 'UNIX CLI with telecom commands (ps, call list, tcpdump, cat)' },
    { id: 'task_manager', title: 'System Resource & Task Manager', category: 'System Tools (Windows)', icon: Activity, subtitle: 'CPU/RAM load, FreeSWITCH 1000 CPS channels, End Task' },
    { id: 'file_explorer', title: 'Telecom File Explorer', category: 'System Tools (Windows/Mac)', icon: HardDrive, subtitle: 'Browse /etc/freeswitch, /var/log/cdr, dialplans, and PCAPs' },
    { id: 'architecture', title: 'Architecture Blueprint', category: 'Documentation', icon: FileText, subtitle: 'Carrier SIP trunk, FreeSWITCH media, ASR/TTS, and AI Layer diagram' },
  ];

  const filteredItems = ALL_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCalls = INITIAL_LIVE_CALLS.filter((c: LiveCallSession) =>
    c.from.includes(query) ||
    c.to.includes(query) ||
    c.fromLabel.toLowerCase().includes(query.toLowerCase()) ||
    c.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-slate-950/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl overflow-hidden text-slate-100 font-sans space-y-2 animate-in fade-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input (Apple Spotlight Style) */}
        <div className="p-3.5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, calls, commands, dialplans... (⌘Space)"
            className="flex-1 bg-transparent text-white text-base focus:outline-none placeholder-slate-500 font-medium"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1.5 font-sans">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => {
                  onOpenApp(item.id);
                  onClose();
                }}
                className="p-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{item.title}</span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase bg-white/5 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>
                  </div>
                </div>
                <CornerDownLeft className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
              </div>
            );
          })}

          {/* Live Call Matches if query typed */}
          {query.trim().length > 1 && filteredCalls.length > 0 && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-[11px] font-mono uppercase text-slate-500 px-2 py-1 font-bold">
                Live Active Calls Matching Query
              </div>
              {filteredCalls.map((call: LiveCallSession) => (
                <div
                  key={call.id}
                  onClick={() => {
                    onOpenApp('command_control');
                    onClose();
                  }}
                  className="p-2 rounded-xl hover:bg-white/10 flex items-center justify-between gap-3 cursor-pointer transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold text-white">
                        {call.from} ({call.fromLabel}) → {call.to}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        Session: {call.id} · MOS: {call.mosScore} · Bridge: {call.mediaServerId}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                    Join Call
                  </span>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && filteredCalls.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-sm font-mono">
              No matching applications or calls found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-slate-950/60 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 px-4">
          <span>Navigate with arrows · Press Enter to open</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
