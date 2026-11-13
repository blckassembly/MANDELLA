import React, { useState } from 'react';
import { SipCallTrace, SipLadderMessage } from '../../types/sbc';
import { PacketDiagnosticModal } from './PacketDiagnosticModal';
import {
  Activity,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  FileCode,
  Download,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  Radio,
  Layers,
  Sparkles,
  Zap,
  Play
} from 'lucide-react';

interface SipLadderTracesProps {
  traces: SipCallTrace[];
  onSelectTrace?: (trace: SipCallTrace) => void;
}

export const SipLadderTraces: React.FC<SipLadderTracesProps> = ({ traces }) => {
  const [selectedTraceId, setSelectedTraceId] = useState<string>(traces[0]?.id || '');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [showPacketDiagnostic, setShowPacketDiagnostic] = useState<boolean>(false);

  const selectedTrace = traces.find((t) => t.id === selectedTraceId) || traces[0];

  const filteredTraces = traces.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.callId.toLowerCase().includes(q) ||
      t.callerMsisdn.includes(q) ||
      t.calleeMsisdn.includes(q) ||
      t.popCode.toLowerCase().includes(q)
    );
  });

  const selectedMessage: SipLadderMessage =
    selectedTrace?.messages.find((m) => m.id === selectedMessageId) ||
    selectedTrace?.messages[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const getEntityColIndex = (entity: SipLadderMessage['fromEntity']) => {
    switch (entity) {
      case 'Enterprise PBX':
        return 0;
      case 'Anycast Edge (Kamailio)':
        return 1;
      case 'RTPEngine / FreeSWITCH':
        return 2;
      case 'Carrier PSTN':
        return 3;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Interactive SIP Call Ladder Traces & Packet Inspector</h2>
            <span className="text-xs text-amber-300 font-mono font-medium">· PRD Section 4.2 & 9.2</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Full carrier-grade signaling observability. Inspect transaction flows, SDP crypto handshakes, PAI/Privacy headers, and Kamailio dispatcher logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter Call-ID, MSISDN, PoP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs rounded-lg pl-8 pr-3 py-1.5 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-400 w-52"
            />
          </div>

          <button
            onClick={() => setShowPacketDiagnostic(true)}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm"
            title="Trigger a 30-second traffic capture session for this SIP call trace to inspect RTP headers"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Packet Diagnostic (30s RTP)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Call Traces List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider font-mono">
              Captured Sessions ({filteredTraces.length})
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Live Homer/HEP V3</span>
          </div>

          <div className="space-y-2">
            {filteredTraces.map((trace) => (
              <div
                key={trace.id}
                onClick={() => {
                  setSelectedTraceId(trace.id);
                  setSelectedMessageId(trace.messages[0]?.id || null);
                }}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  trace.id === selectedTraceId
                    ? 'bg-amber-400/10 border-amber-400/60 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-mono mb-1">
                  <span className="text-white font-bold">{trace.callerMsisdn}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    trace.sipCode === 200
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}>
                    {trace.sipCode} {trace.sipReason}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-amber-300 truncate">
                  → {trace.calleeMsisdn}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-500">
                  <span>PoP: <strong className="text-white">{trace.popCode}</strong></span>
                  <span>{trace.durationSec}s · MOS {trace.mosScore}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTraceId(trace.id);
                      setShowPacketDiagnostic(true);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-bold hover:underline"
                    title="Launch 30s RTP packet capture for this call"
                  >
                    Diagnostic ⚡
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Interactive SIP Ladder Diagram & Packet Inspector (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Ladder Diagram Canvas */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">Call-ID:</span>
                <span className="font-mono text-xs font-bold text-amber-300 truncate block max-w-lg">
                  {selectedTrace?.callId}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
                <span className="text-slate-400">PoP:</span>
                <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {selectedTrace?.popCode} Anycast
                </span>
                <button
                  onClick={() => setShowPacketDiagnostic(true)}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-black rounded text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Trigger a 30-second traffic capture session for this specific SIP call trace to inspect RTP headers"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>30s RTP Capture</span>
                </button>
              </div>
            </div>

            {/* 4 Entities Columns Header */}
            <div className="grid grid-cols-4 gap-2 text-center font-mono text-[11px] font-bold border-b border-slate-800 pb-3">
              <div className="bg-slate-950 py-2 rounded-lg border border-slate-800 text-white">
                Enterprise PBX
              </div>
              <div className="bg-amber-950/40 py-2 rounded-lg border border-amber-600/40 text-amber-300">
                Anycast Kamailio
              </div>
              <div className="bg-purple-950/40 py-2 rounded-lg border border-purple-600/40 text-purple-300">
                RTPEngine / Media
              </div>
              <div className="bg-slate-950 py-2 rounded-lg border border-slate-800 text-emerald-400">
                Carrier PSTN
              </div>
            </div>

            {/* Ladder Steps */}
            <div className="space-y-2.5 py-2">
              {selectedTrace?.messages.map((msg, index) => {
                const fromIdx = getEntityColIndex(msg.fromEntity);
                const toIdx = getEntityColIndex(msg.toEntity);
                const isSelected = selectedMessage?.id === msg.id;
                const isRightward = toIdx > fromIdx;

                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedMessageId(msg.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/70 shadow-sm'
                        : msg.isError
                        ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 text-[10px] flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className={`font-bold ${
                          msg.isError
                            ? 'text-rose-400'
                            : msg.methodOrStatus.includes('200 OK')
                            ? 'text-emerald-400'
                            : 'text-white'
                        }`}>
                          {msg.methodOrStatus}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        +{msg.relativeTimeMs} ms · {msg.protocol}
                      </span>
                    </div>

                    {/* Flow arrow indicator */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                      <span className="text-slate-300">{msg.fromEntity}</span>
                      <span className="text-amber-400 flex items-center">
                        {isRightward ? '──────►' : '◄──────'}
                      </span>
                      <span className="text-slate-300">{msg.toEntity}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw SIP Packet & SDP Inspector */}
          {selectedMessage && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white uppercase text-[11px]">
                    Packet Inspector: {selectedMessage.methodOrStatus}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(selectedMessage.rawHeaders + (selectedMessage.sdpBody ? '\n\n' + selectedMessage.sdpBody : ''))}
                  className="py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedRaw ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRaw ? 'Copied' : 'Copy SIP PDU'}</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                  SIP Signaling Headers
                </label>
                <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-48 whitespace-pre-wrap">
                  {selectedMessage.rawHeaders}
                </pre>
              </div>

              {selectedMessage.sdpBody && (
                <div>
                  <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                    SDP Media Session Body (RFC 4566 / SAVPF SRTP)
                  </label>
                  <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-emerald-400/90 overflow-x-auto leading-relaxed max-h-40 whitespace-pre-wrap">
                    {selectedMessage.sdpBody}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Packet Diagnostic Modal: 30-Second Traffic Capture & RFC 3550 RTP Header Inspector */}
      {selectedTrace && (
        <PacketDiagnosticModal
          isOpen={showPacketDiagnostic}
          onClose={() => setShowPacketDiagnostic(false)}
          trace={selectedTrace}
        />
      )}
    </div>
  );
};
