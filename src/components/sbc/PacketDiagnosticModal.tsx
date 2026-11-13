import React, { useState, useEffect, useRef } from 'react';
import {
  SipCallTrace,
  RtpPacketHeader,
  PacketDiagnosticSession
} from '../../types/sbc';
import {
  createInitialDiagnosticSession,
  generateFull30sCapture,
  generateSingleRtpPacket,
  exportDiagnosticPcapFile,
  exportDiagnosticJsonFile
} from '../../utils/rtpDiagnosticGenerator';
import {
  Activity,
  Download,
  Copy,
  Check,
  Play,
  Square,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCode,
  Layers,
  X,
  Clock,
  ShieldCheck,
  Volume2,
  Zap
} from 'lucide-react';

interface PacketDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  trace: SipCallTrace;
}

export const PacketDiagnosticModal: React.FC<PacketDiagnosticModalProps> = ({
  isOpen,
  onClose,
  trace
}) => {
  const [session, setSession] = useState<PacketDiagnosticSession>(() => createInitialDiagnosticSession(trace));
  const [selectedPacketNumber, setSelectedPacketNumber] = useState<number>(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [markerOnlyFilter, setMarkerOnlyFilter] = useState(false);
  const [copiedHex, setCopiedHex] = useState(false);

  // Live countdown timer state
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // When trace changes or modal opens, initialize diagnostic session
  useEffect(() => {
    if (isOpen) {
      setSession(createInitialDiagnosticSession(trace));
      setSelectedPacketNumber(1);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, trace.id]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Handler to start the 30-second live capture session
  const handleStart30sCapture = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const isOpus = trace.codec.toLowerCase().includes('opus');
    const baseSeq = 14200 + Math.floor(Math.random() * 8000);
    const baseTimestamp = 0x2e84a000 + Math.floor(Math.random() * 0x100000);
    const ssrcNum = Math.abs(
      trace.callId.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0x5a1f2b09)
    );
    const ssrcHex = `0x${(ssrcNum >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;

    // Start with capturing state
    setSession({
      ...createInitialDiagnosticSession(trace),
      status: 'capturing',
      durationSeconds: 30,
      remainingSeconds: 30,
      startedAt: new Date().toISOString(),
      packets: []
    });

    let currentSec = 30;
    let accumulatedPackets: RtpPacketHeader[] = [];

    // Tick every 1 second to update countdown and inject a batch of 50 packets per second (50 pkts/sec = 20ms ptime)
    timerRef.current = setInterval(() => {
      currentSec -= 1;

      // Generate 50 packets for this second
      const startIdx = (30 - currentSec - 1) * 50;
      const newBatch: RtpPacketHeader[] = [];
      for (let i = 0; i < 50; i++) {
        const pIdx = startIdx + i;
        const offsetMs = pIdx * 20;
        newBatch.push(generateSingleRtpPacket(pIdx, offsetMs, baseSeq, baseTimestamp, ssrcHex, isOpus));
      }
      accumulatedPackets = [...accumulatedPackets, ...newBatch];

      if (currentSec <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);

        // Compute final metrics
        const totalPackets = accumulatedPackets.length;
        const sumJitter = accumulatedPackets.reduce((acc, p) => acc + p.jitterMs, 0);
        const maxJitter = accumulatedPackets.reduce((max, p) => (p.jitterMs > max ? p.jitterMs : max), 0);
        const avgJitter = parseFloat((sumJitter / (totalPackets || 1)).toFixed(2));

        setSession((prev) => ({
          ...prev,
          status: 'completed',
          remainingSeconds: 0,
          completedAt: new Date().toISOString(),
          packets: accumulatedPackets,
          metrics: {
            ...prev.metrics,
            totalPackets,
            lostPackets: 1,
            lossRatePercent: 0.07,
            avgJitterMs: avgJitter,
            maxJitterMs: parseFloat(maxJitter.toFixed(2)),
            avgLatencyMs: trace.popCode === 'LOS' ? 24 : 32,
            estimatedMos: trace.mosScore
          }
        }));
      } else {
        const totalPackets = accumulatedPackets.length;
        const sumJitter = accumulatedPackets.reduce((acc, p) => acc + p.jitterMs, 0);
        const maxJitter = accumulatedPackets.reduce((max, p) => (p.jitterMs > max ? p.jitterMs : max), 0);
        const avgJitter = parseFloat((sumJitter / (totalPackets || 1)).toFixed(2));

        setSession((prev) => ({
          ...prev,
          remainingSeconds: currentSec,
          packets: accumulatedPackets,
          metrics: {
            ...prev.metrics,
            totalPackets,
            avgJitterMs: avgJitter,
            maxJitterMs: parseFloat(maxJitter.toFixed(2))
          }
        }));
      }
    }, 1000);
  };

  // Handler to stop early and immediately inspect captured packets
  const handleStopCapture = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (session.packets.length === 0) {
      // If stopped immediately, provide standard sample
      const full = generateFull30sCapture(trace);
      setSession(full);
      return;
    }

    const totalPackets = session.packets.length;
    const sumJitter = session.packets.reduce((acc, p) => acc + p.jitterMs, 0);
    const maxJitter = session.packets.reduce((max, p) => (p.jitterMs > max ? p.jitterMs : max), 0);
    const avgJitter = parseFloat((sumJitter / (totalPackets || 1)).toFixed(2));

    setSession((prev) => ({
      ...prev,
      status: 'stopped',
      completedAt: new Date().toISOString(),
      metrics: {
        ...prev.metrics,
        totalPackets,
        avgJitterMs: avgJitter,
        maxJitterMs: parseFloat(maxJitter.toFixed(2))
      }
    }));
  };

  // Instant load full 30s capture for quick analysis
  const handleInstant30sCapture = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const full = generateFull30sCapture(trace);
    setSession(full);
    setSelectedPacketNumber(1);
  };

  const handleCopyHex = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  // Filtered packets list
  const filteredPackets = session.packets.filter((p) => {
    if (markerOnlyFilter && !p.marker) return false;
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      p.sequenceNumber.toString().includes(q) ||
      p.timestamp.toString().includes(q) ||
      p.payloadName.toLowerCase().includes(q) ||
      p.ssrc.toLowerCase().includes(q) ||
      p.packetNumber.toString().includes(q)
    );
  });

  const selectedPacket =
    session.packets.find((p) => p.packetNumber === selectedPacketNumber) ||
    session.packets[0];

  const captureProgressPercent = Math.round(((30 - session.remainingSeconds) / 30) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 text-white border border-zinc-700 w-full max-w-6xl max-h-[92vh] rounded-[4px] shadow-2xl flex flex-col overflow-hidden font-sans">
        {/* Header Bar */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-[2px] bg-amber-400 text-black shrink-0">
              <Activity className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  System 4 SBC Core — Packet Diagnostic (30s RTP Capture)
                </h2>
                <span className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded-[2px] uppercase">
                  RFC 3550 & RFC 5285
                </span>
                <span className="text-[10px] font-mono bg-zinc-800 border border-zinc-700 text-amber-300 px-2 py-0.5 rounded-[2px] uppercase">
                  PoP: {trace.popCode} Anycast
                </span>
              </div>
              <p className="text-[11px] font-mono text-zinc-400 truncate mt-0.5">
                Session Target Call-ID: <span className="text-zinc-200">{trace.callId}</span> · {trace.callerMsisdn} → {trace.calleeMsisdn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 rounded-[2px] hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Close Packet Diagnostic Modal (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Diagnostic Controller Strip: 30s Countdown, Session Telemetry, and Trigger Actions */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono">
          {/* Status & Live Countdown */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  session.status === 'capturing'
                    ? 'bg-amber-400 animate-pulse'
                    : session.status === 'completed'
                    ? 'bg-emerald-400'
                    : 'bg-zinc-600'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                {session.status === 'capturing' && 'CAPTURING LIVE (30s TIMER)'}
                {session.status === 'completed' && 'CAPTURE COMPLETE (30s SESSION)'}
                {session.status === 'stopped' && 'CAPTURE STOPPED'}
                {session.status === 'idle' && 'STANDBY · READY TO CAPTURE'}
              </span>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center gap-2 bg-black border border-zinc-800 px-3 py-1 rounded-[2px] text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-zinc-400">Timer:</span>
              <span className="font-bold tabular-nums text-white text-sm">
                {session.status === 'capturing'
                  ? `${session.remainingSeconds.toString().padStart(2, '0')}s / 30s`
                  : session.status === 'completed'
                  ? '30s / 30s'
                  : '00s / 30s'}
              </span>
            </div>

            {/* Live Packet Counter */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Packets:</span>
              <strong className="text-white tabular-nums">{session.packets.length.toLocaleString()}</strong>
              <span className="text-zinc-600">/ 1,500 target</span>
            </div>

            {/* Codec & SRTP Indicator */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Codec:</span>
              <strong className="text-emerald-400">{trace.codec}</strong>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {session.status === 'capturing' ? (
              <button
                onClick={handleStopCapture}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop & Analyze ({session.packets.length})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleStart30sCapture}
                  className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black rounded-[2px] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  title="Start continuous 30-second live RTP capture session for this SIP call trace"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start 30s Capture</span>
                </button>

                <button
                  onClick={handleInstant30sCapture}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Instantly generate full 30-second capture buffer (1,500 packets) for immediate diagnostic review"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full 30s Sample</span>
                </button>
              </>
            )}

            {session.packets.length > 0 && (
              <>
                <button
                  onClick={() => exportDiagnosticPcapFile(session)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download captured RTP packets as standard Wireshark-compatible .pcap binary file"
                >
                  <Download className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Export PCAP</span>
                </button>

                <button
                  onClick={() => exportDiagnosticJsonFile(session)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-[2px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download session as structured diagnostic JSON file"
                >
                  <FileCode className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Export JSON</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar during Capture */}
        {session.status === 'capturing' && (
          <div className="w-full h-1 bg-zinc-900 overflow-hidden">
            <div
              className="h-full bg-amber-400 transition-all duration-1000 ease-linear"
              style={{ width: `${captureProgressPercent}%` }}
            />
          </div>
        )}

        {/* Main Work Area: Packet Stream Table + RFC 3550 Header Inspector */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4">
          {session.packets.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center border border-dashed border-zinc-800 rounded-[3px] bg-zinc-950/60 my-6">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">
                Traffic Diagnostic Ready for Call {trace.callerMsisdn}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed mb-4">
                Trigger a 30-second traffic capture session to mirror the live RTP audio stream via Kamailio / RTPEngine NG kernel bridge on PoP <strong className="text-white">{trace.popCode}</strong>.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleStart30sCapture}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-[2px] flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start 30-Second Capture</span>
                </button>
                <button
                  onClick={handleInstant30sCapture}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs rounded-[2px] border border-zinc-700 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Full 30s Buffer (1,500 Pkts)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Telemetry KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Packets Captured</div>
                  <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                    {session.packets.length.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">30s session window</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Average Jitter</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 tabular-nums">
                    {session.metrics.avgJitterMs} ms
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">p95: {session.metrics.maxJitterMs} ms</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Packet Loss</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 tabular-nums">
                    {session.metrics.lossRatePercent}%
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">1 dropped / 1,500</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Estimated MOS</div>
                  <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                    {session.metrics.estimatedMos.toFixed(2)} / 5.0
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">HD Carrier Quality</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">Bitrate / ptime</div>
                  <div className="text-sm font-bold text-white mt-0.5 tabular-nums">
                    {session.metrics.bitrateKbps} kbps
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">ptime: 20ms</div>
                </div>

                <div className="p-2.5 rounded-[2px] bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 uppercase">SRTP Security</div>
                  <div className="text-xs font-bold text-amber-300 mt-1 truncate" title={session.metrics.srtpSuite}>
                    SAVPF AES-128
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">HMAC-SHA1-80 Auth</div>
                </div>
              </div>

              {/* Two Column Layout: Left Packet List, Right RFC 3550 Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                {/* Left 5 cols: Packet List Table with Filters */}
                <div className="lg:col-span-5 bg-zinc-900 border border-zinc-800 rounded-[2px] flex flex-col max-h-[580px]">
                  {/* Filter Toolbar */}
                  <div className="p-3 border-b border-zinc-800 flex items-center justify-between gap-2 font-mono text-xs">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        placeholder="Search Seq, Timestamp, SSRC..."
                        value={filterQuery}
                        onChange={(e) => setFilterQuery(e.target.value)}
                        className="bg-black border border-zinc-700 text-xs rounded-[2px] pl-8 pr-3 py-1.5 text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-400 w-full"
                      />
                    </div>
                    <button
                      onClick={() => setMarkerOnlyFilter(!markerOnlyFilter)}
                      className={`px-2 py-1.5 rounded-[2px] border text-[11px] font-bold transition-colors cursor-pointer shrink-0 ${
                        markerOnlyFilter
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-black text-zinc-400 border-zinc-700 hover:text-white'
                      }`}
                      title="Filter packets where Marker Bit M=1 (start of talkspurt)"
                    >
                      M=1 Only
                    </button>
                  </div>

                  {/* Packet Rows Table */}
                  <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 font-mono text-xs">
                    <div className="sticky top-0 bg-zinc-950 px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800 flex items-center justify-between">
                      <span className="w-12"># (Offset)</span>
                      <span className="w-16">Seq No</span>
                      <span className="w-20">Timestamp</span>
                      <span className="w-12 text-center">M-Bit</span>
                      <span className="w-14 text-right">Jitter</span>
                    </div>

                    {filteredPackets.slice(0, 100).map((packet) => {
                      const isSelected = selectedPacket?.packetNumber === packet.packetNumber;

                      return (
                        <div
                          key={packet.packetNumber}
                          onClick={() => setSelectedPacketNumber(packet.packetNumber)}
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-400 text-black font-semibold'
                              : 'hover:bg-zinc-800/60 text-zinc-300'
                          }`}
                        >
                          <div className="w-12 shrink-0">
                            <span className="font-bold">#{packet.packetNumber}</span>
                            <span className={`block text-[10px] ${isSelected ? 'text-black/70' : 'text-zinc-500'}`}>
                              +{packet.captureOffsetMs}ms
                            </span>
                          </div>

                          <div className="w-16 shrink-0 tabular-nums">
                            0x{packet.sequenceNumber.toString(16).toUpperCase()}
                            <span className={`block text-[10px] ${isSelected ? 'text-black/70' : 'text-zinc-400'}`}>
                              ({packet.sequenceNumber})
                            </span>
                          </div>

                          <div className="w-20 shrink-0 tabular-nums text-[11px] truncate">
                            {packet.timestamp}
                          </div>

                          <div className="w-12 text-center shrink-0">
                            {packet.marker ? (
                              <span className={`px-1.5 py-0.5 rounded-[2px] text-[10px] font-bold ${
                                isSelected ? 'bg-black text-amber-300' : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              }`}>
                                M=1
                              </span>
                            ) : (
                              <span className={`text-[10px] ${isSelected ? 'text-black/50' : 'text-zinc-600'}`}>0</span>
                            )}
                          </div>

                          <div className="w-14 text-right shrink-0 tabular-nums text-[11px]">
                            {packet.jitterMs}ms
                          </div>
                        </div>
                      );
                    })}

                    {filteredPackets.length > 100 && (
                      <div className="p-2 text-center text-[11px] text-zinc-500 italic bg-black/40">
                        Showing first 100 of {filteredPackets.length.toLocaleString()} captured packets. Use search to filter.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right 7 cols: Detailed RFC 3550 RTP Header Inspector */}
                {selectedPacket && (
                  <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-[2px] p-4.5 space-y-4 font-mono text-xs">
                    {/* Header bar of Inspector */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white uppercase text-xs">
                          RTP Packet #{selectedPacket.packetNumber} Header Inspector (RFC 3550)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyHex(selectedPacket.hexDump)}
                        className="py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-[2px] border border-zinc-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Copy raw RTP header and extension hex string to clipboard"
                      >
                        {copiedHex ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHex ? 'Copied Hex' : 'Copy Header Hex'}</span>
                      </button>
                    </div>

                    {/* RFC 3550 Visual Bitfield Diagram */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5 flex items-center justify-between">
                        <span>RFC 3550 32-Bit Word Representation</span>
                        <span className="text-zinc-500">Big-Endian (Network Byte Order)</span>
                      </div>

                      <div className="border border-zinc-800 rounded-[2px] overflow-hidden text-[11px] bg-black">
                        {/* Word 0 */}
                        <div className="grid grid-cols-12 divide-x divide-zinc-800 border-b border-zinc-800 py-1.5 px-2 text-center">
                          <div className="col-span-2 text-amber-300" title="Version (2 bits = 2)">V: {selectedPacket.version}</div>
                          <div className="col-span-1 text-zinc-400" title="Padding (1 bit = 0)">P: 0</div>
                          <div className="col-span-1 text-amber-300" title="Extension (1 bit = 1)">X: 1</div>
                          <div className="col-span-2 text-zinc-400" title="CSRC Count (4 bits = 0)">CC: 0</div>
                          <div className="col-span-2 text-amber-300 font-bold" title="Marker bit">
                            M: {selectedPacket.marker ? '1' : '0'}
                          </div>
                          <div className="col-span-4 text-emerald-400 font-bold" title="Payload Type">
                            PT: {selectedPacket.payloadType} ({selectedPacket.payloadName})
                          </div>
                        </div>

                        {/* Word 1: Sequence Number */}
                        <div className="py-1.5 px-2.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
                          <span className="text-zinc-400 text-[10px]">Sequence Number (16 bits):</span>
                          <span className="font-bold text-white">
                            {selectedPacket.sequenceNumber} (0x{selectedPacket.sequenceNumber.toString(16).toUpperCase()})
                          </span>
                        </div>

                        {/* Word 2: Timestamp */}
                        <div className="py-1.5 px-2.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
                          <span className="text-zinc-400 text-[10px]">RTP Timestamp (32 bits):</span>
                          <span className="font-bold text-white">
                            {selectedPacket.timestamp} (0x{selectedPacket.timestamp.toString(16).toUpperCase()})
                          </span>
                        </div>

                        {/* Word 3: SSRC */}
                        <div className="py-1.5 px-2.5 flex items-center justify-between bg-zinc-950/70">
                          <span className="text-zinc-400 text-[10px]">SSRC Identifier (32 bits):</span>
                          <span className="font-bold text-amber-300">{selectedPacket.ssrc}</span>
                        </div>
                      </div>
                    </div>

                    {/* Header Extension Inspection (RFC 5285 Audio Level) */}
                    {selectedPacket.extensionData && (
                      <div className="bg-black/60 border border-zinc-800 p-3 rounded-[2px] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-amber-300 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5" />
                            RFC 5285 Header Extension (One-Byte Profile 0xBEDE)
                          </span>
                          <span className="text-[10px] text-zinc-500">urn:ietf:params:rtp-hdrext:ssrc-audio-level</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="flex items-center justify-between bg-zinc-950 px-2 py-1 rounded-[2px] border border-zinc-800/80">
                            <span className="text-zinc-400">Audio Energy Level:</span>
                            <span className="font-bold text-white tabular-nums">
                              {selectedPacket.extensionData.audioLevelDbov} dBov
                            </span>
                          </div>
                          <div className="flex items-center justify-between bg-zinc-950 px-2 py-1 rounded-[2px] border border-zinc-800/80">
                            <span className="text-zinc-400">Voice Activity (VAD):</span>
                            <span className={`font-bold ${selectedPacket.extensionData.vadActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                              {selectedPacket.extensionData.vadActive ? 'Active Speech' : 'Silence'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Hex Dump Breakdown */}
                    <div>
                      <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1 flex items-center justify-between">
                        <span>Raw Hex Dump (First 32 Bytes on Wire)</span>
                        <span className="text-zinc-500">{selectedPacket.totalSizeBytes} Total Bytes</span>
                      </div>
                      <pre className="bg-black p-3 rounded-[2px] border border-zinc-800 text-[12px] text-amber-300 overflow-x-auto leading-relaxed tracking-wider">
                        {selectedPacket.hexDump}
                      </pre>
                    </div>

                    {/* Network Timing & Jitter Delta */}
                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                      <div className="bg-black px-2.5 py-1.5 rounded-[2px] border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px]">Inter-Packet Delta</span>
                        <span className="font-bold text-white tabular-nums">{selectedPacket.deltaMs} ms</span>
                      </div>
                      <div className="bg-black px-2.5 py-1.5 rounded-[2px] border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px]">Instantaneous Jitter</span>
                        <span className="font-bold text-emerald-400 tabular-nums">{selectedPacket.jitterMs} ms</span>
                      </div>
                      <div className="bg-black px-2.5 py-1.5 rounded-[2px] border border-zinc-800">
                        <span className="text-zinc-500 block text-[10px]">Payload Size</span>
                        <span className="font-bold text-white tabular-nums">{selectedPacket.payloadSizeBytes} Bytes</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>SBC Ingress Mirror: RTPEngine NG (Kernel space eBPF capture on {trace.popCode})</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-zinc-500">30-second capture captures exactly 1,500 frames at 20ms ptime.</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-[2px] font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
