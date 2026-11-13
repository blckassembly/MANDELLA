import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
  Cpu,
  Lock,
  Smartphone,
  Copy,
  Check,
  Download,
  Eye,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  FileText,
  Layers,
  Database,
  Radio,
  RefreshCw,
  Camera,
  QrCode,
  PlusCircle,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Badge, Button } from '../../design-system';
import { EuiccQrScannerModal } from './EuiccQrScannerModal';
import {
  generateMockAttestedToken,
  verifyHardwareAttestedToken
} from '../../services/euiccAttestationService';

export interface HardwareAttestationAuditRecord {
  id: string;
  bindingId: string;
  sessionId: string;
  eid: string; // 32-digit GSMA SGP.22 standard
  maskedEid: string;
  timestamp: string; // ISO format
  formattedTime: string;
  carrier: string;
  countryIso: string;
  deviceImei: string;
  imeiChassisLocked: boolean;
  iccidHashHex: string;
  sgp22ProfileState: 'ENABLED' | 'DISABLED' | 'DOWNLOADED';
  keyId: string;
  issuedAt: string;
  expiresAt: string;
  ed25519JwsCompactSig: string;
  attestationLatencyMs: number; // SLA < 400ms
  complianceStatus: 'COMPLIANT_VERIFIED' | 'REVOKED_SOC' | 'EXPIRED_LEASE' | 'CHASSIS_VIOLATION';
  regulatoryFramework: string;
  auditActor: string;
  tamperEvidentLedgerHash: string;
  revocationReason?: string;
}

export const INITIAL_ATTESTATION_AUDIT_LOGS: HardwareAttestationAuditRecord[] = [
  {
    id: 'aud-token-001',
    bindingId: 'bind_euicc_12345678_ke',
    sessionId: 'sess_ke_saf_994821',
    eid: '89049032000001000000000012345678',
    maskedEid: '890490********************123456',
    timestamp: '2026-10-15T10:48:12Z',
    formattedTime: '2026-10-15 10:48:12 UTC',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    countryIso: 'KE',
    deviceImei: '863920048192830',
    imeiChassisLocked: true,
    iccidHashHex: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    sgp22ProfileState: 'ENABLED',
    keyId: 'smdp_root_ke_safaricom_2026_01',
    issuedAt: '2026-10-15T10:48:12Z',
    expiresAt: '2026-10-16T10:48:12Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfc2FmYXJpY29tXzAx',
    attestationLatencyMs: 14,
    complianceStatus: 'COMPLIANT_VERIFIED',
    regulatoryFramework: 'GSMA SGP.22 / Kenya DPA 2019',
    auditActor: 'SM-DP+ Gateway (mTLS ES2+)',
    tamperEvidentLedgerHash: 'sha256:d8491c9e88aa1104e4b789123c'
  },
  {
    id: 'aud-token-002',
    bindingId: 'bind_euicc_98765432_ng',
    sessionId: 'sess_ng_mtn_771822',
    eid: '89023412000002000000000098765432',
    maskedEid: '890234********************987654',
    timestamp: '2026-10-15T10:32:05Z',
    formattedTime: '2026-10-15 10:32:05 UTC',
    carrier: 'MTN Nigeria (NCC Certified SM-DP+)',
    countryIso: 'NG',
    deviceImei: '864901882019482',
    imeiChassisLocked: true,
    iccidHashHex: 'f14d8b9481920391823091829038102938109283019283019283019283019283',
    sgp22ProfileState: 'ENABLED',
    keyId: 'smdp_root_ng_mtn_2026_01',
    issuedAt: '2026-10-15T10:32:05Z',
    expiresAt: '2026-10-16T10:32:05Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfbXRuX25nZXJpYV8wMg',
    attestationLatencyMs: 19,
    complianceStatus: 'COMPLIANT_VERIFIED',
    regulatoryFramework: 'NCC TIRMS & NDPR Framework',
    auditActor: 'POS Agent AG-LOS-0042 (Victoria Island)',
    tamperEvidentLedgerHash: 'sha256:5a91024fbc8890123910293847'
  },
  {
    id: 'aud-token-003',
    bindingId: 'bind_863920048192039_mal',
    sessionId: 'sess_ke_saf_910283_flg',
    eid: '89049032000001000000000088192019',
    maskedEid: '890490********************881920',
    timestamp: '2026-10-15T09:14:40Z',
    formattedTime: '2026-10-15 09:14:40 UTC',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    countryIso: 'KE',
    deviceImei: '863920048192830',
    imeiChassisLocked: true,
    iccidHashHex: 'c771029381029381029381029381029381029381029381029381029381029381',
    sgp22ProfileState: 'ENABLED',
    keyId: 'smdp_root_ke_safaricom_2026_01',
    issuedAt: '2026-10-15T09:14:40Z',
    expiresAt: '2026-10-16T09:14:40Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfcXVhcmFudGluZWRfMDM',
    attestationLatencyMs: 12,
    complianceStatus: 'REVOKED_SOC',
    regulatoryFramework: 'African Union Malabo Cyber Convention',
    auditActor: 'SOC-C2 Automated Playbook (QR-0941)',
    tamperEvidentLedgerHash: 'sha256:1a840019284f11a0bb91823901',
    revocationReason: 'SOC-C2 SIM-Swap Quarantine: Post-swap 86s Ecobank OTP burst followed by proxy IP origin'
  },
  {
    id: 'aud-token-004',
    bindingId: 'bind_euicc_45612378_za',
    sessionId: 'sess_za_vod_554911',
    eid: '89027011000003000000000045612378',
    maskedEid: '890270********************456123',
    timestamp: '2026-10-15T08:22:19Z',
    formattedTime: '2026-10-15 08:22:19 UTC',
    carrier: 'Vodacom South Africa (ICASA Tier 1)',
    countryIso: 'ZA',
    deviceImei: '867102948201940',
    imeiChassisLocked: false,
    iccidHashHex: 'bb10293810293810293810293810293810293810293810293810293810293810',
    sgp22ProfileState: 'DISABLED',
    keyId: 'smdp_root_za_vodacom_2026_01',
    issuedAt: '2026-10-15T08:22:19Z',
    expiresAt: '2026-10-16T08:22:19Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfemFfdm9kYWNvbV8wNA',
    attestationLatencyMs: 24,
    complianceStatus: 'CHASSIS_VIOLATION',
    regulatoryFramework: 'ICASA Act / POPIA South Africa',
    auditActor: 'eUICC Verification Middleware Service',
    tamperEvidentLedgerHash: 'sha256:7761ac901844bb991029384756',
    revocationReason: 'SGP.22 Profile in DISABLED state; subscriber device IMEI lock missing from token payload'
  },
  {
    id: 'aud-token-005',
    bindingId: 'bind_euicc_33221100_gh',
    sessionId: 'sess_gh_tel_441829',
    eid: '89023301000004000000000033221100',
    maskedEid: '890233********************332211',
    timestamp: '2026-10-14T16:05:00Z',
    formattedTime: '2026-10-14 16:05:00 UTC',
    carrier: 'Telecel Ghana (NCA Sovereign Gateway)',
    countryIso: 'GH',
    deviceImei: '863920048192830',
    imeiChassisLocked: true,
    iccidHashHex: 'aa99182390129381029381029381029381029381029381029381029381029381',
    sgp22ProfileState: 'ENABLED',
    keyId: 'smdp_root_gh_telecel_2026_01',
    issuedAt: '2026-10-14T16:05:00Z',
    expiresAt: '2026-10-15T16:05:00Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfZ2hfdGVsZWNlbF8wNQ',
    attestationLatencyMs: 16,
    complianceStatus: 'COMPLIANT_VERIFIED',
    regulatoryFramework: 'NCA Electronic Communications Act 775',
    auditActor: 'Telecel SM-DP+ Primary Cluster',
    tamperEvidentLedgerHash: 'sha256:998811223344556677889900aa'
  },
  {
    id: 'aud-token-006',
    bindingId: 'bind_euicc_00112233_ci',
    sessionId: 'sess_ci_ora_119284',
    eid: '89022501000005000000000000112233',
    maskedEid: '890225********************001122',
    timestamp: '2026-10-13T11:20:00Z',
    formattedTime: '2026-10-13 11:20:00 UTC',
    carrier: 'Orange Côte d\'Ivoire (ARTCI Gateway)',
    countryIso: 'CI',
    deviceImei: '865102938471920',
    imeiChassisLocked: true,
    iccidHashHex: 'dd88291029381029381029381029381029381029381029381029381029381029',
    sgp22ProfileState: 'ENABLED',
    keyId: 'smdp_root_ke_safaricom_2026_01',
    issuedAt: '2026-10-13T11:20:00Z',
    expiresAt: '2026-10-14T11:20:00Z',
    ed25519JwsCompactSig: 'eyJhbGciOiJFZERTQSI...eyJpc3MiOiJtYW5kZWxhLXNtZHA...c2lnX2VkMjU1MTlfb3JhbmdlX2NpXzA2',
    attestationLatencyMs: 22,
    complianceStatus: 'EXPIRED_LEASE',
    regulatoryFramework: 'ARTCI Telecommunications Code 2013',
    auditActor: 'Orange West Africa Sub-Hub',
    tamperEvidentLedgerHash: 'sha256:44556677889900aabbccddeeff',
    revocationReason: '24-hour hardware attestation lease expired without SM-DP+ automated renewal'
  }
];

export const HardwareAttestationAudit: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<HardwareAttestationAuditRecord[]>(
    INITIAL_ATTESTATION_AUDIT_LOGS
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<HardwareAttestationAuditRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFullEid, setShowFullEid] = useState<boolean>(false);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.eid.toLowerCase().includes(q) ||
        log.maskedEid.toLowerCase().includes(q) ||
        log.bindingId.toLowerCase().includes(q) ||
        log.sessionId.toLowerCase().includes(q) ||
        log.carrier.toLowerCase().includes(q) ||
        log.countryIso.toLowerCase().includes(q) ||
        log.deviceImei.toLowerCase().includes(q) ||
        log.auditActor.toLowerCase().includes(q) ||
        log.timestamp.toLowerCase().includes(q);

      const matchesStatus =
        selectedStatus === 'ALL' || log.complianceStatus === selectedStatus;

      const matchesCountry =
        selectedCountry === 'ALL' || log.countryIso === selectedCountry;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [auditLogs, searchQuery, selectedStatus, selectedCountry]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const total = auditLogs.length;
    const verified = auditLogs.filter((l) => l.complianceStatus === 'COMPLIANT_VERIFIED').length;
    const revoked = auditLogs.filter((l) => l.complianceStatus === 'REVOKED_SOC').length;
    const avgLatency = Math.round(
      auditLogs.reduce((acc, curr) => acc + curr.attestationLatencyMs, 0) / (total || 1)
    );

    return { total, verified, revoked, avgLatency };
  }, [auditLogs]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportEvidence = (record: HardwareAttestationAuditRecord) => {
    const evidenceJson = JSON.stringify(record, null, 2);
    const blob = new Blob([evidenceJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance_audit_evidence_${record.bindingId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Hardware Attestation Audit</h2>
                <span className="text-xs text-emerald-400 font-mono font-medium">· GSMA SGP.22 &amp; eUICC Compliance</span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                  Ed25519 Immutable Ledger
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Immutable, searchable audit trail of all <code className="text-slate-300 font-mono">HardwareAttestedToken</code> issuance events, linking sovereign eUICC chip EIDs and timestamps to carrier SM-DP+ cryptographic signatures.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowFullEid(!showFullEid)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 ${
              showFullEid
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle full 32-digit EID display for forensic compliance audit"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showFullEid ? 'Mask EID (Privacy)' : 'Reveal Full 32-Digit EID'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-500">Total Attested Tokens</div>
          <div className="text-xl font-bold font-mono text-white flex items-center justify-between">
            <span>{kpis.total}</span>
            <Database className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Across 5 Pan-African carrier roots</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-500">Genuine &amp; Verified EIDs</div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
            <span>{kpis.verified}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">100% Ed25519 signature match</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-500">Revoked / Quarantined</div>
          <div className="text-xl font-bold font-mono text-rose-400 flex items-center justify-between">
            <span>{kpis.revoked}</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-[10px] text-rose-400/80 font-mono">SOC-C2 SIM-swap blacklist</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-500">Mean Attestation Latency</div>
          <div className="text-xl font-bold font-mono text-sky-400 flex items-center justify-between">
            <span>{kpis.avgLatency} ms</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-[10px] text-sky-400/80 font-mono">GSMA Rel-18 SLA: &lt; 400ms P99</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by 32-digit EID, Binding ID, Session ID, Device IMEI, Carrier, or Timestamp..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="ALL">All Statuses ({auditLogs.length})</option>
              <option value="COMPLIANT_VERIFIED">Compliant &amp; Verified</option>
              <option value="REVOKED_SOC">Revoked by SOC-C2</option>
              <option value="EXPIRED_LEASE">Expired Lease</option>
              <option value="CHASSIS_VIOLATION">Chassis Violation</option>
            </select>

            {/* Country Filter */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50"
            >
              <option value="ALL">All Countries</option>
              <option value="KE">Kenya (KE)</option>
              <option value="NG">Nigeria (NG)</option>
              <option value="ZA">South Africa (ZA)</option>
              <option value="GH">Ghana (GH)</option>
              <option value="CI">Côte d&apos;Ivoire (CI)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono pt-1">
          <span>Showing {filteredLogs.length} of {auditLogs.length} attestation records</span>
          <span>Cryptographic Proof: Ed25519 SHA-256 Ledger Verified</span>
        </div>
      </div>

      {/* Attestation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">eUICC EID (32-Digit Chip ID)</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Binding ID &amp; Session</th>
                <th className="py-3 px-4">Carrier &amp; Authority</th>
                <th className="py-3 px-4">Device IMEI (Chassis Lock)</th>
                <th className="py-3 px-4 text-right">Latency</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                    No hardware attestation records matched your search query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isVerified = log.complianceStatus === 'COMPLIANT_VERIFIED';
                  const isRevoked = log.complianceStatus === 'REVOKED_SOC';
                  const displayEid = showFullEid ? log.eid : log.maskedEid;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedRecord(log)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isVerified
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                              : isRevoked
                              ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {isVerified ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <ShieldAlert className="w-3 h-3 text-rose-400" />
                          )}
                          <span>
                            {log.complianceStatus === 'COMPLIANT_VERIFIED'
                              ? 'VERIFIED'
                              : log.complianceStatus === 'REVOKED_SOC'
                              ? 'REVOKED'
                              : log.complianceStatus === 'EXPIRED_LEASE'
                              ? 'EXPIRED'
                              : 'CHASSIS ERR'}
                          </span>
                        </span>
                      </td>

                      {/* EID */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white tracking-wider">
                            {displayEid}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(log.id, log.eid);
                            }}
                            className="text-slate-500 hover:text-white transition-colors"
                            title="Copy full 32-digit EID"
                          >
                            {copiedId === log.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                          GSMA SGP.22 eUICC · {log.regulatoryFramework}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-semibold">{log.formattedTime}</div>
                        <div className="text-[10px] text-slate-500">
                          Expires: {new Date(log.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Binding ID */}
                      <td className="py-3 px-4">
                        <div className="text-amber-300 font-mono text-[11px] truncate max-w-[150px]">
                          {log.bindingId}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                          {log.sessionId}
                        </div>
                      </td>

                      {/* Carrier */}
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-semibold font-sans">{log.carrier}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Key ID: {log.keyId.split('_').slice(2).join('_')}
                        </div>
                      </td>

                      {/* Device IMEI */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span>{log.deviceImei}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          {log.imeiChassisLocked ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Chassis Locked
                            </span>
                          ) : (
                            <span className="text-amber-400">Unlocked</span>
                          )}
                        </div>
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-4 text-right">
                        <span className="text-sky-400 font-bold">{log.attestationLatencyMs} ms</span>
                        <div className="text-[9px] text-emerald-400/80">SLA &lt; 400ms</div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(log);
                          }}
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                          title="Inspect Compliance Evidence"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Audit Evidence Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  selectedRecord.complianceStatus === 'COMPLIANT_VERIFIED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">eUICC Hardware Attestation Audit Evidence</h3>
                    <Badge variant="telco" className="text-[10px] font-mono">
                      GSMA SGP.22
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">
                    Audit Record ID: {selectedRecord.id} · Timestamp: {selectedRecord.formattedTime}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Status Banner */}
            <div className={`p-3.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
              selectedRecord.complianceStatus === 'COMPLIANT_VERIFIED'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {selectedRecord.complianceStatus === 'COMPLIANT_VERIFIED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                )}
                <span>Compliance Verdict: <strong>{selectedRecord.complianceStatus}</strong></span>
              </div>
              <span>Framework: {selectedRecord.regulatoryFramework}</span>
            </div>

            {selectedRecord.revocationReason && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 space-y-1">
                <div className="font-bold text-rose-400 uppercase font-mono text-[10px]">Quarantine / Revocation Rationale:</div>
                <p className="font-sans">{selectedRecord.revocationReason}</p>
              </div>
            )}

            {/* Core Linked Identifiers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">eUICC Identifier (EID)</span>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs break-all">{selectedRecord.eid}</span>
                  <button
                    onClick={() => handleCopy('modal-eid', selectedRecord.eid)}
                    className="text-slate-500 hover:text-white shrink-0 ml-2"
                  >
                    {copiedId === 'modal-eid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">Attestation Timestamp &amp; Lease</span>
                <div className="text-slate-200">
                  <div>Issued: <strong className="text-white">{selectedRecord.formattedTime}</strong></div>
                  <div>Expires: <strong className="text-amber-300">{selectedRecord.expiresAt}</strong></div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">Bound Device IMEI (Chassis)</span>
                <div className="text-white font-bold flex items-center justify-between">
                  <span>{selectedRecord.deviceImei}</span>
                  <span className="text-emerald-400 text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Chassis Locked
                  </span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">Issuing Carrier Authority</span>
                <div className="text-white font-bold">{selectedRecord.carrier}</div>
                <div className="text-[10px] text-slate-500">Key ID: {selectedRecord.keyId}</div>
              </div>
            </div>

            {/* Cryptographic JWS Signature Evidence */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 uppercase text-[10px]">
                  HardwareAttestedToken Ed25519 Compact JWS Signature
                </span>
                <button
                  onClick={() => handleCopy('modal-sig', selectedRecord.ed25519JwsCompactSig)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedId === 'modal-sig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'modal-sig' ? 'Copied' : 'Copy Full Signature'}</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80 text-[11px] text-emerald-400 break-all max-h-24 overflow-y-auto">
                {selectedRecord.ed25519JwsCompactSig}
              </div>
              <div className="text-[10px] text-slate-500">
                Ledger Proof Hash: <code className="text-slate-400">{selectedRecord.tamperEvidentLedgerHash}</code>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-slate-500 text-[10px] font-mono">
                Audit Actor: {selectedRecord.auditActor}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExportEvidence(selectedRecord)}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Audit Evidence (JSON)</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
