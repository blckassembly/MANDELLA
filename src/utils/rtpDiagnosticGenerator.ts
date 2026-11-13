import { SipCallTrace, RtpPacketHeader, PacketDiagnosticSession, PopCode } from '../types/sbc';

/**
 * Utility to generate realistic RFC 3550 RTP packet headers and metrics
 * for the System 4 SBC Core 30-second traffic capture session.
 */

export function createInitialDiagnosticSession(trace: SipCallTrace): PacketDiagnosticSession {
  const isOpus = trace.codec.toLowerCase().includes('opus');
  const payloadType = isOpus ? 111 : trace.codec.toLowerCase().includes('pcma') ? 8 : 0;
  const payloadName = isOpus ? 'Opus (RFC 7587)' : payloadType === 8 ? 'PCMA / G.711a' : 'PCMU / G.711u';

  return {
    id: `diag-sess-${Date.now()}`,
    callTraceId: trace.id,
    callId: trace.callId,
    popCode: trace.popCode,
    callerMsisdn: trace.callerMsisdn,
    calleeMsisdn: trace.calleeMsisdn,
    codec: trace.codec,
    status: 'idle',
    durationSeconds: 30,
    remainingSeconds: 30,
    startedAt: new Date().toISOString(),
    packets: [],
    metrics: {
      totalPackets: 0,
      lostPackets: 0,
      lossRatePercent: 0,
      avgJitterMs: 0,
      maxJitterMs: 0,
      avgLatencyMs: 0,
      estimatedMos: trace.mosScore,
      bitrateKbps: isOpus ? 32.0 : 64.0,
      srtpSuite: 'AES_CM_128_HMAC_SHA1_80 (RFC 3711)'
    }
  };
}

/**
 * Generate a single RTP packet conforming to RFC 3550 and RFC 5285
 */
export function generateSingleRtpPacket(
  packetIndex: number,
  offsetMs: number,
  baseSeq: number,
  baseTimestamp: number,
  ssrcHex: string,
  isOpus: boolean
): RtpPacketHeader {
  const payloadType = isOpus ? 111 : 8;
  const payloadName = isOpus ? 'Opus' : 'PCMA';
  const clockRate = isOpus ? 48000 : 8000;
  const samplesPerPacket = isOpus ? 960 : 160; // 20ms frame
  const seqNum = (baseSeq + packetIndex) % 65536;
  const timestamp = (baseTimestamp + packetIndex * samplesPerPacket) >>> 0;

  // Marker bit set on the very first packet or talkspurt transition (every ~200 packets)
  const isMarker = packetIndex === 0 || packetIndex === 150 || packetIndex === 400 || packetIndex === 850;

  // Realistic jitter simulation: base 1.5ms with small Brownian fluctuations
  const jitterVariation = Math.sin(packetIndex * 0.4) * 0.8 + Math.cos(packetIndex * 0.15) * 0.5;
  const jitterMs = Math.max(0.6, parseFloat((1.8 + jitterVariation).toFixed(2)));
  const deltaMs = 20 + parseFloat(((Math.random() - 0.5) * 1.2).toFixed(1));

  // Audio level in -dBov (0 is loudest, 127 is silence). Typical speech: -24 to -14 dBov
  const audioLevel = isMarker ? -16 : -22 + Math.floor(Math.sin(packetIndex * 0.2) * 6);
  const vadActive = audioLevel > -28;

  const payloadSize = isOpus ? 80 + Math.floor(Math.sin(packetIndex * 0.5) * 20) : 160;
  const headerSize = 12 + 4; // 12-byte RTP header + 4-byte RFC 5285 extension
  const totalSizeBytes = headerSize + payloadSize;

  // Formulate realistic hex dump representation of the RFC 3550 packet header
  // Byte 0: V=2, P=0, X=1, CC=0 -> 0x90
  // Byte 1: M (0x80 if true) | PT -> (isMarker ? 0x80 : 0x00) | payloadType
  const byte0 = 0x90;
  const byte1 = (isMarker ? 0x80 : 0x00) | (payloadType & 0x7f);
  const seqHigh = (seqNum >> 8) & 0xff;
  const seqLow = seqNum & 0xff;
  const tsHex = timestamp.toString(16).padStart(8, '0');
  const ssrcRaw = ssrcHex.replace('0x', '').padStart(8, '0');

  // RFC 5285 One-byte Header Extension (profile 0xBEDE, length 1 word)
  // ID=1, len=0 (1 byte payload): Audio Level byte
  const audioLevelByte = (vadActive ? 0x80 : 0x00) | (Math.abs(audioLevel) & 0x7f);
  const extHex = `bede000101${audioLevelByte.toString(16).padStart(2, '0')}0000`;

  const headerHex = `${byte0.toString(16).padStart(2, '0')}${byte1.toString(16).padStart(2, '0')}${seqHigh.toString(16).padStart(2, '0')}${seqLow.toString(16).padStart(2, '0')}${tsHex}${ssrcRaw}${extHex}`;

  // Formulate a compact preview hex string (first 32 bytes formatted in pairs)
  const fullHexPreview = headerHex.match(/.{1,2}/g)?.join(' ') || headerHex;

  return {
    packetNumber: packetIndex + 1,
    captureOffsetMs: offsetMs,
    version: 2,
    padding: false,
    extension: true,
    csrcCount: 0,
    marker: isMarker,
    payloadType,
    payloadName,
    sequenceNumber: seqNum,
    timestamp,
    ssrc: ssrcHex,
    csrcList: [],
    extensionData: {
      profile: 0xbede,
      lengthWords: 1,
      audioLevelDbov: audioLevel,
      vadActive
    },
    payloadSizeBytes: payloadSize,
    totalSizeBytes,
    deltaMs,
    jitterMs,
    hexDump: fullHexPreview
  };
}

/**
 * Generate a complete 30-second packet stream capture dataset (1,500 packets @ 20ms ptime)
 */
export function generateFull30sCapture(trace: SipCallTrace): PacketDiagnosticSession {
  const isOpus = trace.codec.toLowerCase().includes('opus');
  const baseSeq = 14200 + Math.floor(Math.random() * 8000);
  const baseTimestamp = 0x2e84a000 + Math.floor(Math.random() * 0x100000);
  const ssrcNum = Math.abs(
    trace.callId.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0x5a1f2b09)
  );
  const ssrcHex = `0x${(ssrcNum >>> 0).toString(16).toUpperCase().padStart(8, '0')}`;

  const totalPackets = 1500; // 30 seconds * 50 packets/sec
  const packets: RtpPacketHeader[] = [];

  let sumJitter = 0;
  let maxJitter = 0;

  for (let i = 0; i < totalPackets; i++) {
    const offsetMs = i * 20;
    const packet = generateSingleRtpPacket(i, offsetMs, baseSeq, baseTimestamp, ssrcHex, isOpus);
    packets.push(packet);
    sumJitter += packet.jitterMs;
    if (packet.jitterMs > maxJitter) maxJitter = packet.jitterMs;
  }

  const avgJitter = parseFloat((sumJitter / totalPackets).toFixed(2));
  // Simulated minor loss (e.g. 1 out of 1500 packets dropped in rural backhaul)
  const lostPackets = 1;
  const lossRatePercent = parseFloat(((lostPackets / totalPackets) * 100).toFixed(2));

  return {
    id: `diag-sess-${Date.now()}`,
    callTraceId: trace.id,
    callId: trace.callId,
    popCode: trace.popCode,
    callerMsisdn: trace.callerMsisdn,
    calleeMsisdn: trace.calleeMsisdn,
    codec: trace.codec,
    status: 'completed',
    durationSeconds: 30,
    remainingSeconds: 0,
    startedAt: new Date(Date.now() - 30000).toISOString(),
    completedAt: new Date().toISOString(),
    packets,
    metrics: {
      totalPackets,
      lostPackets,
      lossRatePercent,
      avgJitterMs: avgJitter,
      maxJitterMs: parseFloat(maxJitter.toFixed(2)),
      avgLatencyMs: trace.popCode === 'LOS' ? 24 : trace.popCode === 'NBO' ? 32 : 28,
      estimatedMos: trace.mosScore,
      bitrateKbps: isOpus ? 32.4 : 64.0,
      srtpSuite: 'AES_CM_128_HMAC_SHA1_80 (SRTP Encrypted)'
    }
  };
}

/**
 * Generate a synthetic Wireshark PCAP binary buffer and trigger browser download
 */
export function exportDiagnosticPcapFile(session: PacketDiagnosticSession) {
  // Libpcap File Format Specification (RFC / tcpdump format)
  // Global Header (24 bytes):
  // Magic Number: 0xa1b2c3d4 (little endian), Major 2, Minor 4, Timezone 0, Sigfigs 0, Snaplen 65535, Linktype 1 (Ethernet)
  const headerBuf = new ArrayBuffer(24);
  const headerView = new DataView(headerBuf);

  headerView.setUint32(0, 0xa1b2c3d4, true); // Magic
  headerView.setUint16(4, 2, true); // Version Major
  headerView.setUint16(6, 4, true); // Version Minor
  headerView.setInt32(8, 0, true); // Thiszone
  headerView.setUint32(12, 0, true); // Sigfigs
  headerView.setUint32(16, 65535, true); // Snaplen
  headerView.setUint32(20, 1, true); // Network (Ethernet)

  // Construct binary chunks for each captured packet (Ethernet + IPv4 + UDP + RTP)
  const chunks: ArrayBuffer[] = [headerBuf];

  const startTimeSec = Math.floor(new Date(session.startedAt).getTime() / 1000);

  // Take sample of packets to create a crisp ~250KB PCAP
  const exportPackets = session.packets.slice(0, 300);

  exportPackets.forEach((p, idx) => {
    const packetTimeSec = startTimeSec + Math.floor(p.captureOffsetMs / 1000);
    const packetTimeUsec = (p.captureOffsetMs % 1000) * 1000;

    // Total packet on wire: Ethernet (14) + IP (20) + UDP (8) + RTP header (16) + dummy payload (64) = 122 bytes
    const totalLen = 14 + 20 + 8 + 16 + 64;

    const pcapRecordHeader = new ArrayBuffer(16);
    const rhView = new DataView(pcapRecordHeader);
    rhView.setUint32(0, packetTimeSec, true);
    rhView.setUint32(4, packetTimeUsec, true);
    rhView.setUint32(8, totalLen, true); // Captured length
    rhView.setUint32(12, totalLen, true); // Original wire length
    chunks.push(pcapRecordHeader);

    // Packet payload
    const packetData = new Uint8Array(totalLen);
    // Ethernet header: Dst MAC (6) + Src MAC (6) + EtherType 0x0800 (IPv4)
    packetData.set([0x00, 0x16, 0x3e, 0x42, 0x11, 0x01, 0x00, 0x16, 0x3e, 0x42, 0x11, 0x02, 0x08, 0x00], 0);

    // IPv4 header (20 bytes): Version 4, IHL 5, Total Length totalLen - 14, Protocol 17 (UDP)
    const ipLen = totalLen - 14;
    packetData.set([0x45, 0x00, (ipLen >> 8) & 0xff, ipLen & 0xff, 0x10, 0x24, 0x40, 0x00, 0x40, 0x11, 0x00, 0x00], 14);
    // Src IP: 197.210.64.12, Dst IP: 102.134.88.10
    packetData.set([197, 210, 64, 12, 102, 134, 88, 10], 26);

    // UDP header (8 bytes): Src Port 16420, Dst Port 32100, Length ipLen - 20, Checksum 0
    const udpLen = ipLen - 20;
    packetData.set([0x40, 0x24, 0x7d, 0x64, (udpLen >> 8) & 0xff, udpLen & 0xff, 0x00, 0x00], 34);

    // RTP Header (12 bytes) starting at byte 42
    packetData[42] = 0x90; // V=2, X=1
    packetData[43] = (p.marker ? 0x80 : 0x00) | (p.payloadType & 0x7f);
    packetData[44] = (p.sequenceNumber >> 8) & 0xff;
    packetData[45] = p.sequenceNumber & 0xff;
    packetData[46] = (p.timestamp >> 24) & 0xff;
    packetData[47] = (p.timestamp >> 16) & 0xff;
    packetData[48] = (p.timestamp >> 8) & 0xff;
    packetData[49] = p.timestamp & 0xff;
    // SSRC
    const ssrcVal = parseInt(p.ssrc.replace('0x', ''), 16);
    packetData[50] = (ssrcVal >> 24) & 0xff;
    packetData[51] = (ssrcVal >> 16) & 0xff;
    packetData[52] = (ssrcVal >> 8) & 0xff;
    packetData[53] = ssrcVal & 0xff;

    // Extension header (4 bytes)
    packetData[54] = 0xbe;
    packetData[55] = 0xde;
    packetData[56] = 0x00;
    packetData[57] = 0x01;

    chunks.push(packetData.buffer);
  });

  const blob = new Blob(chunks, { type: 'application/vnd.tcpdump.pcap' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sbc-rtp-diag-${session.callTraceId}-${session.popCode}-30s.pcap`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export diagnostic session data as structured JSON file
 */
export function exportDiagnosticJsonFile(session: PacketDiagnosticSession) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
  const a = document.createElement('a');
  a.href = dataStr;
  a.download = `sbc-rtp-diagnostic-${session.callTraceId}-30s.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
