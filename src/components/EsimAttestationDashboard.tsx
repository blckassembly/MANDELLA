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
  Unlock,
  Smartphone,
  Copy,
  Check,
  Download,
  Eye,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Layers,
  Database,
  Radio,
  RefreshCw,
  Camera,
  QrCode,
  PlusCircle,
  AlertTriangle,
  Info,
  Terminal,
  FileCheck,
  Zap
} from 'lucide-react';
import { Badge, Button } from '../design-system';
import {
  HardwareAttestedToken,
  generateMockAttestedToken,
  verifyHardwareAttestedToken,
  VerifiedEUICCIdentity
} from '../services/euiccAttestationService';
import { EuiccQrScannerModal } from './dataverse/EuiccQrScannerModal';

/**
 * Status indicator taxonomy based on esim_binder.go metadata:
 * - 'Expired': Current timestamp is past expires_at
 * - 'Critical': Expiring within 30 days of expiry deadline (action required: SM-DP+ Re-bind)
 * - 'Locked': imei_chassis_locked is true (hardware chassis locked to physical device IMEI)
 * - 'Verified': Active unexpired profile with valid Ed25519 signature
 */
export type BindingStatus = 'Verified' | 'Locked' | 'Critical' | 'Expired';

export interface EnrichedAttestedToken extends HardwareAttestedToken {
  id: string;
  carrier: string;
  country_iso: string;
  device_imei: string;
  binding_status: BindingStatus;
  zk_proof_hex?: string;
  raw_eid?: string;
}

export function evaluateBindingStatus(
  expiresAt: string,
  imeiChassisLocked: boolean,
  profileState?: string
): BindingStatus {
  if (!expiresAt || typeof expiresAt !== 'string') {
    return 'Expired';
  }
  const nowMs = Date.now();
  const expMs = new Date(expiresAt).getTime();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  // Unparseable or corrupt dates fail closed as Expired
  if (isNaN(expMs) || !isFinite(expMs)) {
    return 'Expired';
  }
  if (expMs <= nowMs) {
    return 'Expired';
  }
  if (expMs - nowMs <= thirtyDaysMs) {
    return 'Critical';
  }
  if (imeiChassisLocked) {
    return 'Locked';
  }
  return 'Verified';
}

export function getDaysRemaining(expiresAt: string): number {
  if (!expiresAt || typeof expiresAt !== 'string') {
    return 0;
  }
  const expMs = new Date(expiresAt).getTime();
  if (isNaN(expMs) || !isFinite(expMs)) {
    return 0;
  }
  const diffMs = expMs - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

export const INITIAL_ESIM_ATTESTATIONS: EnrichedAttestedToken[] = [
  {
    id: 'tok-001',
    binding_id: 'esim_bnd_89049032_ke',
    session_id: 'sess_ke_saf_994821',
    masked_eid: '890490********************123456',
    raw_eid: '89049032000001000000000012345678',
    iccid_hash_hex: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    imei_chassis_locked: true,
    device_imei: '863920048192830',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    country_iso: 'KE',
    issued_at: '2026-10-15T14:20:00Z',
    expires_at: '2027-10-15T14:20:00Z',
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9rZV9zYWZhcmljb21fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF84OTA0OTAzMl9rZSIsImVpZF9tIjoiODkwNDkwKioqKioqKioqKioqKioqKioqMTIzNDU2Iiwic3ViIjoic2Vzc19rZV9zYWZfOTk0ODIxIn0.c2lnX2VkMjU1MTlfc2FmYXJpY29tXzAx',
    attestation_latency_ms: 14,
    binding_status: 'Locked',
    zk_proof_hex: '0x89a4ff109823471029384710293847102938471029384710'
  },
  {
    id: 'tok-002',
    binding_id: 'esim_bnd_98765432_ng',
    session_id: 'sess_ng_mtn_771822',
    masked_eid: '890234********************987654',
    raw_eid: '89023412000002000000000098765432',
    iccid_hash_hex: 'f14d8b9481920391823091829038102938109283019283019283019283019283',
    imei_chassis_locked: true,
    device_imei: '864901882019482',
    sgp22_profile_state: 'ENABLED',
    carrier: 'MTN Nigeria (NCC Certified SM-DP+)',
    country_iso: 'NG',
    issued_at: '2026-10-15T13:45:10Z',
    expires_at: '2027-10-15T13:45:10Z',
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9uZ19tdG5fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF85ODc2NTQzMl9uZyIsImVpZF9tIjoiODkwMjM0KioqKioqKioqKioqKioqKioqOTg3NjU0Iiwic3ViIjoic2Vzc19uZ19tdG5fNzcxODIyIn0.c2lnX2VkMjU1MTlfbXRuX25nZXJpYV8wMg',
    attestation_latency_ms: 19,
    binding_status: 'Locked',
    zk_proof_hex: '0x71b290123847102938471029384710293847102938471029'
  },
  {
    id: 'tok-003',
    binding_id: 'esim_bnd_45612378_za',
    session_id: 'sess_za_vod_554911',
    masked_eid: '890270********************456123',
    raw_eid: '89027011000003000000000045612378',
    iccid_hash_hex: 'bb10293810293810293810293810293810293810293810293810293810293810',
    imei_chassis_locked: false,
    device_imei: '867102948201940',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Vodacom South Africa (ICASA Tier 1)',
    country_iso: 'ZA',
    issued_at: '2026-10-15T11:15:30Z',
    expires_at: '2027-10-15T11:15:30Z',
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF96YV92b2RhY29tXzIwMjZfMDEiLCJ0eXAiOiJtYW5kZWxhLWVzaW0tYXR0ZXN0ZWQtand0In0.eyJiaWQiOiJlc2ltX2JuZF80NTYxMjM3OF96YSIsImVpZF9tIjoiODkwMjcwKioqKioqKioqKioqKioqKioqNDU2MTIzIiwic3ViIjoic2Vzc196YV92b2RfNTU0OTExIn0.c2lnX2VkMjU1MTlfemFfdm9kYWNvbV8wNA',
    attestation_latency_ms: 22,
    binding_status: 'Verified',
    zk_proof_hex: '0x94cc00192847102938471029384710293847102938471029'
  },
  {
    id: 'tok-004',
    binding_id: 'esim_bnd_33221100_gh',
    session_id: 'sess_gh_tel_441829',
    masked_eid: '890233********************332211',
    raw_eid: '89023301000004000000000033221100',
    iccid_hash_hex: 'aa99182390129381029381029381029381029381029381029381029381029381',
    imei_chassis_locked: false,
    device_imei: '863920048192830',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Telecel Ghana (NCA Sovereign Gateway)',
    country_iso: 'GH',
    issued_at: '2026-10-14T09:30:00Z',
    expires_at: '2027-10-14T09:30:00Z',
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9naF90ZWxlY2VsXzIwMjZfMDEiLCJ0eXAiOiJtYW5kZWxhLWVzaW0tYXR0ZXN0ZWQtand0In0.eyJiaWQiOiJlc2ltX2JuZF8zMzIyMTEwMF9naCIsImVpZF9tIjoiODkwMjMzKioqKioqKioqKioqKioqKioqMzMyMjExIiwic3ViIjoic2Vzc19naF90ZWxfNDQxODI5In0.c2lnX2VkMjU1MTlfZ2hfdGVsZWNlbF8wNQ',
    attestation_latency_ms: 16,
    binding_status: 'Verified',
    zk_proof_hex: '0x55aa12903847102938471029384710293847102938471029'
  },
  {
    id: 'tok-005',
    binding_id: 'esim_bnd_00112233_ci',
    session_id: 'sess_ci_ora_119284',
    masked_eid: '890225********************001122',
    raw_eid: '89022501000005000000000000112233',
    iccid_hash_hex: 'dd88291029381029381029381029381029381029381029381029381029381029',
    imei_chassis_locked: true,
    device_imei: '865102938471920',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Orange Côte d\'Ivoire (ARTCI Gateway)',
    country_iso: 'CI',
    issued_at: '2025-10-10T08:00:00Z',
    expires_at: '2026-10-10T08:00:00Z', // In past relative to Oct 15, 2026
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9rZV9zYWZhcmljb21fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF8wMDExMjIzM19jaSIsImVpZF9tIjoiODkwMjI1KioqKioqKioqKioqKioqKioqMDAxMTIyIiwic3ViIjoic2Vzc19jaV9vcmFfMTE5Mjg0In0.c2lnX2VkMjU1MTlfb3JhbmdlX2NpXzA2',
    attestation_latency_ms: 25,
    binding_status: 'Expired',
    zk_proof_hex: '0x12bb90481920391823901829038102938109283019283019'
  },
  {
    id: 'tok-006',
    binding_id: 'esim_bnd_88192019_ke',
    session_id: 'sess_ke_saf_910283',
    masked_eid: '890490********************881920',
    raw_eid: '89049032000001000000000088192019',
    iccid_hash_hex: 'c771029381029381029381029381029381029381029381029381029381029381',
    imei_chassis_locked: false,
    device_imei: '863920048192830',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    country_iso: 'KE',
    issued_at: '2025-10-12T16:00:00Z',
    expires_at: '2026-10-14T16:00:00Z', // Expired
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9rZV9zYWZhcmljb21fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF84ODE5MjAxOV9rZSIsImVpZF9tIjoiODkwNDkwKioqKioqKioqKioqKioqKioqODgxOTIwIiwic3ViIjoic2Vzc19rZV9zYWZfOTEwMjgzIn0.c2lnX2VkMjU1MTlfc2FmYXJpY29tXzA3',
    attestation_latency_ms: 13,
    binding_status: 'Expired',
    zk_proof_hex: '0x33dd11928301928301928301928301928301928301928301'
  },
  {
    id: 'tok-007',
    binding_id: 'esim_bnd_77665544_ke',
    session_id: 'sess_ke_saf_551920',
    masked_eid: '890490********************776655',
    raw_eid: '89049032000001000000000077665544',
    iccid_hash_hex: '44aa819203918230918290381029381092830192830192830192830192830192',
    imei_chassis_locked: true,
    device_imei: '869910294819284',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    country_iso: 'KE',
    issued_at: '2026-10-15T15:10:00Z',
    expires_at: '2027-10-15T15:10:00Z',
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9rZV9zYWZhcmljb21fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF83NzY2NTU0NF9rZSIsImVpZF9tIjoiODkwNDkwKioqKioqKioqKioqKioqKioqNzc2NjU1Iiwic3ViIjoic2Vzc19rZV9zYWZfNTUxOTIwIn0.c2lnX2VkMjU1MTlfc2FmYXJpY29tXzA4',
    attestation_latency_ms: 15,
    binding_status: 'Locked',
    zk_proof_hex: '0x77ee90182390182903810293810928301928301928301928'
  },
  {
    id: 'tok-008',
    binding_id: 'esim_bnd_19283746_ng',
    session_id: 'sess_ng_mtn_441920',
    masked_eid: '890234********************192837',
    raw_eid: '89023412000002000000000019283746',
    iccid_hash_hex: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    imei_chassis_locked: true,
    device_imei: '864901882019482',
    sgp22_profile_state: 'ENABLED',
    carrier: 'MTN Nigeria (NCC Certified SM-DP+)',
    country_iso: 'NG',
    issued_at: '2025-10-25T10:00:00Z',
    expires_at: '2026-10-22T10:00:00Z', // Expiring in 6 days (< 30 days) -> Critical
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9uZ19tdG5fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF8xOTI4Mzc0Nl9uZyIsInN1YiI6InNlc3NfbmdfbXRuXzQ0MTkyMCJ9.c2lnX2VkMjU1MTlfbXRuX2NyaXRpY2FsXzA4',
    attestation_latency_ms: 18,
    binding_status: 'Critical',
    zk_proof_hex: '0x88cc2211993344556677889900aabbccddeeff0011223344'
  },
  {
    id: 'tok-009',
    binding_id: 'esim_bnd_55443322_ke',
    session_id: 'sess_ke_saf_338811',
    masked_eid: '890490********************554433',
    raw_eid: '89049032000001000000000055443322',
    iccid_hash_hex: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    imei_chassis_locked: false,
    device_imei: '863920048192830',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Safaricom Kenya (Sovereign Core)',
    country_iso: 'KE',
    issued_at: '2025-10-30T14:00:00Z',
    expires_at: '2026-10-31T14:00:00Z', // Expiring in 15 days (< 30 days) -> Critical
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF9rZV9zYWZhcmljb21fMjAyNl8wMSIsInR5cCI6Im1hbmRlbGEtZXNpbS1hdHRlc3RlZCtqd3QifQ.eyJiaWQiOiJlc2ltX2JuZF81NTQ0MzMyMl9rZSIsInN1YiI6InNlc3Nfa2Vfc2FmXzMzODgxMSJ9.c2lnX2VkMjU1MTlfc2FmYXJpY29tX2NyaXRpY2FsXzA5',
    attestation_latency_ms: 15,
    binding_status: 'Critical',
    zk_proof_hex: '0x99dd33220044556677889900aabbccddeeff001122334455'
  },
  {
    id: 'tok-010',
    binding_id: 'esim_bnd_99112233_za',
    session_id: 'sess_za_vod_992211',
    masked_eid: '890270********************991122',
    raw_eid: '89027011000003000000000099112233',
    iccid_hash_hex: 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899',
    imei_chassis_locked: true,
    device_imei: '867102948201940',
    sgp22_profile_state: 'ENABLED',
    carrier: 'Vodacom South Africa (ICASA Tier 1)',
    country_iso: 'ZA',
    issued_at: '2025-11-05T09:00:00Z',
    expires_at: '2026-11-08T09:00:00Z', // Expiring in 23 days (< 30 days) -> Critical
    ed25519_jws_compact_sig:
      'eyJhbGciOiJFZERTQSIsImtpZCI6InNtZHBfcm9vdF96YV92b2RhY29tXzIwMjZfMDEiLCJ0eXAiOiJtYW5kZWxhLWVzaW0tYXR0ZXN0ZWQtand0In0.eyJiaWQiOiJlc2ltX2JuZF85OTExMjIzM196YSIsInN1YiI6InNlc3NfemFfdm9kXzk5MjIxMSJ9.c2lnX2VkMjU1MTlfemFfdm9kYWNvbV9jcml0aWNhbF8xMA',
    attestation_latency_ms: 21,
    binding_status: 'Critical',
    zk_proof_hex: '0xaaee443311556677889900aabbccddeeff00112233445566'
  }
];

export const EsimAttestationDashboard: React.FC = () => {
  const [tokens, setTokens] = useState<EnrichedAttestedToken[]>(INITIAL_ESIM_ATTESTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | BindingStatus>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [selectedToken, setSelectedToken] = useState<EnrichedAttestedToken | null>(null);
  const [revealedEidId, setRevealedEidId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Issue Token Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [newCarrier, setNewCarrier] = useState('Safaricom Kenya (Sovereign Core)');
  const [newCountryIso, setNewCountryIso] = useState('KE');
  const [newEid, setNewEid] = useState('89049032000001000000000099887766');
  const [newImei, setNewImei] = useState('863920048192830');
  const [newIccid, setNewIccid] = useState('8925402100000192837');
  const [newChassisLock, setNewChassisLock] = useState(true);
  const [newForceExpired, setNewForceExpired] = useState(false);
  const [newForceCritical, setNewForceCritical] = useState(false);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  // Selection & Bulk Re-bind State
  const [selectedTokenIds, setSelectedTokenIds] = useState<Set<string>>(new Set());
  const [isRebinding, setIsRebinding] = useState(false);
  const [rebindSuccessMessage, setRebindSuccessMessage] = useState<{
    count: number;
    timestamp: string;
  } | null>(null);

  // Live JWS Verification result cache
  const [verificationResult, setVerificationResult] = useState<VerifiedEUICCIdentity | null>(null);

  // Status Counts & Metrics
  const metrics = useMemo(() => {
    const total = tokens.length;
    const verified = tokens.filter((t) => t.binding_status === 'Verified').length;
    const locked = tokens.filter((t) => t.binding_status === 'Locked').length;
    const critical = tokens.filter((t) => t.binding_status === 'Critical').length;
    const expired = tokens.filter((t) => t.binding_status === 'Expired').length;
    const expiringOrExpired = tokens.filter(
      (t) => t.binding_status === 'Critical' || t.binding_status === 'Expired'
    ).length;
    const avgLatency = Math.round(
      tokens.reduce((acc, t) => acc + t.attestation_latency_ms, 0) / (total || 1)
    );
    return { total, verified, locked, critical, expired, expiringOrExpired, avgLatency };
  }, [tokens]);

  // Filtered tokens
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        token.binding_id.toLowerCase().includes(q) ||
        token.session_id.toLowerCase().includes(q) ||
        token.masked_eid.toLowerCase().includes(q) ||
        (token.raw_eid && token.raw_eid.toLowerCase().includes(q)) ||
        token.carrier.toLowerCase().includes(q) ||
        token.device_imei.toLowerCase().includes(q) ||
        token.iccid_hash_hex.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'ALL' || token.binding_status === statusFilter;

      const matchesCountry =
        countryFilter === 'ALL' || token.country_iso === countryFilter;

      return matchesSearch && matchesStatus && matchesCountry;
    });
  }, [tokens, searchQuery, statusFilter, countryFilter]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleInspectToken = (token: EnrichedAttestedToken) => {
    setSelectedToken(token);
    // Execute live Ed25519 signature & claims verification
    const res = verifyHardwareAttestedToken(token.ed25519_jws_compact_sig, {
      expectedImei: token.device_imei
    });
    setVerificationResult(res);
  };

  const handleScanComplete = (
    scannedEid: string,
    metadata?: {
      carrier?: string;
      countryIso?: string;
      iccid?: string;
      deviceImei?: string;
    }
  ) => {
    setNewEid(scannedEid);
    if (metadata?.carrier) setNewCarrier(metadata.carrier);
    if (metadata?.countryIso) setNewCountryIso(metadata.countryIso);
    if (metadata?.iccid) setNewIccid(metadata.iccid);
    if (metadata?.deviceImei) setNewImei(metadata.deviceImei);
    setIsScannerOpen(false);
    setIsIssueModalOpen(true);
    setFormValidationError(null);
  };

  // Selection handlers
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedTokenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredTokens.map((t) => t.id);
    const allSelected = visibleIds.length > 0 && visibleIds.every((id) => selectedTokenIds.has(id));
    if (allSelected) {
      setSelectedTokenIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedTokenIds((prev) => {
        const next = new Set(prev);
        visibleIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const handleSelectAllExpiringAndExpired = () => {
    const targetIds = tokens
      .filter((t) => t.binding_status === 'Expired' || t.binding_status === 'Critical')
      .map((t) => t.id);
    setSelectedTokenIds(new Set(targetIds));
  };

  // Re-bind token execution (single or bulk)
  const executeRebindTokens = (targetTokenIds: string[]) => {
    if (targetTokenIds.length === 0) return;
    setIsRebinding(true);

    setTimeout(() => {
      const now = new Date();
      const newExpiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString();
      const targetIdSet = new Set(targetTokenIds);

      setTokens((prev) =>
        prev.map((tok) => {
          if (!targetIdSet.has(tok.id)) return tok;

          const newSessionId = `sess_rebind_${tok.country_iso.toLowerCase()}_${Date.now().toString().slice(-6)}`;
          const cleanEid = tok.raw_eid || '89049032000001000000000012345678';

          // Re-issue cryptographic token with fresh 365-day lease
          const reissued = generateMockAttestedToken({
            sessionId: newSessionId,
            eid: cleanEid,
            countryIso: tok.country_iso,
            deviceImei: tok.imei_chassis_locked ? tok.device_imei : '',
            profileState: 'ENABLED',
            isExpired: false
          });

          const newStatus: BindingStatus = tok.imei_chassis_locked ? 'Locked' : 'Verified';

          return {
            ...tok,
            session_id: newSessionId,
            issued_at: now.toISOString(),
            expires_at: newExpiresAt,
            binding_status: newStatus,
            ed25519_jws_compact_sig: reissued.ed25519_jws_compact_sig,
            attestation_latency_ms: Math.floor(Math.random() * 8) + 12
          };
        })
      );

      // If inspector is viewing an updated token, refresh inspection
      setSelectedToken((current) => {
        if (!current || !targetIdSet.has(current.id)) return current;
        const newStatus: BindingStatus = current.imei_chassis_locked ? 'Locked' : 'Verified';
        const refreshed: EnrichedAttestedToken = {
          ...current,
          issued_at: now.toISOString(),
          expires_at: newExpiresAt,
          binding_status: newStatus,
          attestation_latency_ms: Math.floor(Math.random() * 8) + 12
        };
        const verifyRes = verifyHardwareAttestedToken(refreshed.ed25519_jws_compact_sig, {
          expectedImei: refreshed.device_imei
        });
        setVerificationResult(verifyRes);
        return refreshed;
      });

      // Clear selection for re-bound tokens
      setSelectedTokenIds((prev) => {
        const next = new Set(prev);
        targetTokenIds.forEach((id) => next.delete(id));
        return next;
      });

      setIsRebinding(false);
      setRebindSuccessMessage({
        count: targetTokenIds.length,
        timestamp: new Date().toLocaleTimeString()
      });
      setTimeout(() => setRebindSuccessMessage(null), 5000);
    }, 400); // 400ms SLA ceiling simulation
  };

  // Bulk action: Re-bind all Expired or Critical (<30d) tokens
  const handleRebindAllExpiringAndExpired = () => {
    const targetIds = tokens
      .filter((t) => t.binding_status === 'Expired' || t.binding_status === 'Critical')
      .map((t) => t.id);
    executeRebindTokens(targetIds);
  };

  // Bulk action: Re-bind selected tokens
  const handleRebindSelected = () => {
    executeRebindTokens(Array.from(selectedTokenIds));
  };

  // Single token re-bind
  const handleRebindSingle = (token: EnrichedAttestedToken, e?: React.MouseEvent) => {
    e?.stopPropagation();
    executeRebindTokens([token.id]);
  };

  const handleCreateToken = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null);

    const cleanEid = newEid.trim();
    if (!/^[0-9]{32}$/.test(cleanEid)) {
      setFormValidationError('EID must be exactly 32 numeric digits per GSMA SGP.22 standard.');
      return;
    }

    const sessionId = `sess_${newCountryIso.toLowerCase()}_${Date.now().toString().slice(-6)}`;
    const mockToken = generateMockAttestedToken({
      sessionId,
      eid: cleanEid,
      iccid: newIccid,
      countryIso: newCountryIso,
      deviceImei: newChassisLock ? newImei : '',
      profileState: 'ENABLED',
      isExpired: newForceExpired
    });

    let status: BindingStatus;
    let expiresAt = mockToken.expires_at;

    if (newForceExpired) {
      status = 'Expired';
      expiresAt = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    } else if (newForceCritical) {
      status = 'Critical';
      // Set to 14 days from now (< 30 days)
      expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      status = newChassisLock ? 'Locked' : 'Verified';
      expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    }

    const newToken: EnrichedAttestedToken = {
      id: `tok-${Date.now().toString().slice(-4)}`,
      binding_id: mockToken.binding_id,
      session_id: sessionId,
      masked_eid: mockToken.masked_eid,
      raw_eid: cleanEid,
      iccid_hash_hex: mockToken.iccid_hash_hex,
      imei_chassis_locked: newChassisLock,
      device_imei: newImei,
      sgp22_profile_state: 'ENABLED',
      carrier: newCarrier,
      country_iso: newCountryIso,
      issued_at: mockToken.issued_at,
      expires_at: expiresAt,
      ed25519_jws_compact_sig: mockToken.ed25519_jws_compact_sig,
      attestation_latency_ms: Math.floor(Math.random() * 12) + 12,
      binding_status: status,
      zk_proof_hex: '0x' + Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    };

    setTokens((prev) => [newToken, ...prev]);
    setIsIssueModalOpen(false);
    handleInspectToken(newToken);
  };

  const handleExportTokensJson = () => {
    const dataStr = JSON.stringify(tokens, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esim_hardware_attestations_${Date.now()}.json`;
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
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">eSIM Attestation Dashboard</h2>
                <span className="text-xs text-amber-400 font-mono font-medium">· System 1 (NMS Core)</span>
                <span className="bg-slate-950 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono">
                  GSMA SGP.22 / Ed25519
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Live registry of <code className="text-slate-300 font-mono">HardwareAttestedToken</code> issuances binding sovereign phone numbers to eUICC chips. Visual status indicators verify authenticity, detect expired leases, and track physical IMEI chassis locking per <code className="text-amber-300 font-mono">esim_binder.go</code>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Bulk Re-bind Expired & Critical Action Button */}
          <button
            onClick={handleRebindAllExpiringAndExpired}
            disabled={metrics.expiringOrExpired === 0 || isRebinding}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              metrics.expiringOrExpired > 0
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-950/50 cursor-pointer animate-pulse'
                : 'bg-slate-950 border border-slate-800 text-slate-500 cursor-not-allowed'
            }`}
            title="Bulk re-bind all expired and critical (<30d) eSIM tokens with carrier SM-DP+"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRebinding ? 'animate-spin' : ''}`} />
            <span>Re-bind Expired &amp; Critical ({metrics.expiringOrExpired})</span>
          </button>

          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
            title="Scan eUICC packaging QR label using camera"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan QR</span>
          </button>

          <button
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/50"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Issue Attested Token</span>
          </button>

          <button
            onClick={handleExportTokensJson}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
            title="Download full token ledger in JSON format"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Re-bind Success Toast / Notification Banner */}
      {rebindSuccessMessage && (
        <div className="bg-emerald-950/90 border border-emerald-500/60 rounded-xl p-3.5 flex items-center justify-between text-xs font-mono text-emerald-200 shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-white">
                Bulk Re-binding Successful · {rebindSuccessMessage.count} eSIM Token(s) Renewed
              </div>
              <div className="text-[11px] text-emerald-300/80">
                Fresh Ed25519 signatures generated via GSMA SGP.22 ES2+ mTLS interface with 365-day expiry. SLA latency verified &lt; 400ms.
              </div>
            </div>
          </div>
          <button
            onClick={() => setRebindSuccessMessage(null)}
            className="text-emerald-400 hover:text-white p-1 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Tokens */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 cursor-pointer transition-all ${
            statusFilter === 'ALL'
              ? 'border-slate-500 bg-slate-800/40 shadow-md'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-slate-400">Total eSIM Bindings</div>
          <div className="text-xl font-bold font-mono text-white flex items-center justify-between">
            <span>{metrics.total}</span>
            <Database className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-[10px] text-slate-500 font-mono">Carrier SM-DP+ Pool</div>
        </div>

        {/* Verified Status */}
        <div
          onClick={() => setStatusFilter('Verified')}
          className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 cursor-pointer transition-all ${
            statusFilter === 'Verified'
              ? 'border-emerald-500/80 bg-emerald-950/20 shadow-md'
              : 'border-slate-800 hover:border-emerald-500/40'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Verified
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
            <span>{metrics.verified}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">SGP.22 Active · Ed25519</div>
        </div>

        {/* Locked Status */}
        <div
          onClick={() => setStatusFilter('Locked')}
          className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 cursor-pointer transition-all ${
            statusFilter === 'Locked'
              ? 'border-sky-500/80 bg-sky-950/20 shadow-md'
              : 'border-slate-800 hover:border-sky-500/40'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-sky-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Locked (Chassis)
          </div>
          <div className="text-xl font-bold font-mono text-sky-400 flex items-center justify-between">
            <span>{metrics.locked}</span>
            <Lock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-[10px] text-sky-400/80 font-mono">IMEI Hardware Bound</div>
        </div>

        {/* Critical Status (<30d) */}
        <div
          onClick={() => setStatusFilter('Critical')}
          className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 cursor-pointer transition-all ${
            statusFilter === 'Critical'
              ? 'border-amber-500/80 bg-amber-950/30 shadow-md shadow-amber-950/40'
              : 'border-slate-800 hover:border-amber-500/50'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-amber-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Critical (&lt;30d)
          </div>
          <div className="text-xl font-bold font-mono text-amber-400 flex items-center justify-between">
            <span>{metrics.critical}</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-[10px] text-amber-400/80 font-mono">Action: SM-DP+ Re-bind</div>
        </div>

        {/* Expired Status */}
        <div
          onClick={() => setStatusFilter('Expired')}
          className={`bg-slate-900 border rounded-xl p-3.5 space-y-1 cursor-pointer transition-all ${
            statusFilter === 'Expired'
              ? 'border-rose-500/80 bg-rose-950/20 shadow-md'
              : 'border-slate-800 hover:border-rose-500/40'
          }`}
        >
          <div className="text-[10px] uppercase font-mono text-rose-400 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Expired
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 flex items-center justify-between">
            <span>{metrics.expired}</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-[10px] text-rose-400/80 font-mono">Lease Lapsed (&gt; 365d)</div>
        </div>

        {/* SLA Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[10px] uppercase font-mono text-slate-400">Attestation Latency</div>
          <div className="text-xl font-bold font-mono text-amber-300 flex items-center justify-between">
            <span>{metrics.avgLatency} ms</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono">SLA &lt; 400ms Ceiling ✓</div>
        </div>
      </div>

      {/* Bulk Action Bar (When Items Selected) */}
      {selectedTokenIds.size > 0 && (
        <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg shadow-amber-950/30 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono font-bold text-xs">
              {selectedTokenIds.size}
            </div>
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                <span>{selectedTokenIds.size} eSIM Tokens Selected</span>
                {tokens.filter((t) => selectedTokenIds.has(t.id) && (t.binding_status === 'Expired' || t.binding_status === 'Critical')).length > 0 && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                    {tokens.filter((t) => selectedTokenIds.has(t.id) && (t.binding_status === 'Expired' || t.binding_status === 'Critical')).length} require renewal
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Execute bulk carrier SM-DP+ ES2+ renewal and hardware token re-signing.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setSelectedTokenIds(new Set())}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs font-mono transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleRebindSelected}
              disabled={isRebinding}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-md shadow-amber-950/50 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRebinding ? 'animate-spin' : ''}`} />
              <span>{isRebinding ? 'Re-binding via SM-DP+...' : `Re-bind Selected (${selectedTokenIds.size})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Binding ID, Session, Masked EID, Device IMEI, or Carrier..."
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

          {/* Status Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(['ALL', 'Verified', 'Locked', 'Critical', 'Expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ${
                  statusFilter === st
                    ? st === 'Verified'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 font-bold'
                      : st === 'Locked'
                      ? 'bg-sky-950 text-sky-300 border border-sky-500/60 font-bold'
                      : st === 'Critical'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/60 font-bold'
                      : st === 'Expired'
                      ? 'bg-rose-950 text-rose-300 border border-rose-500/60 font-bold'
                      : 'bg-slate-800 text-white border border-slate-600 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
                {st === 'ALL' && ` (${tokens.length})`}
                {st === 'Verified' && ` (${metrics.verified})`}
                {st === 'Locked' && ` (${metrics.locked})`}
                {st === 'Critical' && ` (${metrics.critical})`}
                {st === 'Expired' && ` (${metrics.expired})`}
              </button>
            ))}

            {/* Country Selector */}
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/50 ml-1"
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

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-800/60 gap-2">
          <div className="flex items-center gap-3">
            <span>
              Displaying {filteredTokens.length} of {tokens.length} recent HardwareAttestedToken issuances
            </span>
            {metrics.expiringOrExpired > 0 && (
              <button
                onClick={handleSelectAllExpiringAndExpired}
                className="text-amber-400 hover:text-amber-300 underline font-medium flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                <span>Select all {metrics.expiringOrExpired} Expired / Expiring</span>
              </button>
            )}
          </div>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            GSMA SGP.22 ES2+ Compliant Root
          </span>
        </div>
      </div>

      {/* Main Attestation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-3 w-8 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredTokens.length > 0 &&
                      filteredTokens.every((t) => selectedTokenIds.has(t.id))
                    }
                    onChange={handleSelectAllVisible}
                    title="Select/Deselect all visible tokens"
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Visual Status</th>
                <th className="py-3 px-4">Binding ID &amp; Session</th>
                <th className="py-3 px-4">eUICC EID (GSMA SGP.22)</th>
                <th className="py-3 px-4">Carrier &amp; Authority</th>
                <th className="py-3 px-4">Device IMEI (Chassis)</th>
                <th className="py-3 px-4">Issued / Expires</th>
                <th className="py-3 px-4 text-right">Latency</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 font-sans">
                    No eSIM attestation tokens match the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((tok) => {
                  const isRevealed = revealedEidId === tok.id;
                  const displayEid = isRevealed && tok.raw_eid ? tok.raw_eid : tok.masked_eid;
                  const isSelected = selectedTokenIds.has(tok.id);
                  const isExpiringSoon = tok.binding_status === 'Critical';
                  const isExpired = tok.binding_status === 'Expired';

                  return (
                    <tr
                      key={tok.id}
                      onClick={() => handleInspectToken(tok)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition-colors group ${
                        isSelected ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(tok.id, e as unknown as React.MouseEvent)}
                          className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Visual Status Indicator */}
                      <td className="py-3.5 px-4">
                        {tok.binding_status === 'Verified' && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified</span>
                          </div>
                        )}

                        {tok.binding_status === 'Locked' && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-950/80 text-sky-300 border border-sky-500/50 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-sky-400" />
                            <Lock className="w-3.5 h-3.5 text-sky-400" />
                            <span>Locked</span>
                          </div>
                        )}

                        {tok.binding_status === 'Critical' && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/60 shadow-xs shadow-amber-950/50">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Critical</span>
                          </div>
                        )}

                        {tok.binding_status === 'Expired' && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-xs">
                            <span className="w-2 h-2 rounded-full bg-rose-400" />
                            <Clock className="w-3.5 h-3.5 text-rose-400" />
                            <span>Expired</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1 font-sans">
                          {tok.binding_status === 'Locked' && 'IMEI Chassis Bound'}
                          {tok.binding_status === 'Verified' && 'SGP.22 Active Lease'}
                          {tok.binding_status === 'Critical' && `${getDaysRemaining(tok.expires_at)}d remaining (<30d)`}
                          {tok.binding_status === 'Expired' && 'Lease Past Deadline'}
                        </div>
                      </td>

                      {/* Binding ID & Session */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-amber-300 text-xs group-hover:text-amber-200 transition-colors">
                          {tok.binding_id}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {tok.session_id}
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono truncate max-w-[160px]">
                          Hash: {tok.iccid_hash_hex.slice(0, 16)}...
                        </div>
                      </td>

                      {/* EID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-200 font-semibold">{displayEid}</span>
                          {tok.raw_eid && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setRevealedEidId(isRevealed ? null : tok.id);
                              }}
                              className="text-slate-500 hover:text-white p-0.5"
                              title={isRevealed ? 'Mask EID' : 'Reveal Full 32-digit EID'}
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(`eid-${tok.id}`, tok.raw_eid || tok.masked_eid);
                            }}
                            className="text-slate-500 hover:text-white p-0.5"
                            title="Copy EID"
                          >
                            {copiedKey === `eid-${tok.id}` ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                          Profile: <strong className="text-emerald-400">{tok.sgp22_profile_state}</strong>
                        </div>
                      </td>

                      {/* Carrier & Country */}
                      <td className="py-3.5 px-4">
                        <div className="text-white font-medium font-sans flex items-center gap-1.5">
                          <span>{tok.carrier}</span>
                          <span className="bg-slate-950 px-1.5 py-0.2 rounded border border-slate-800 text-[10px] text-slate-400 font-mono">
                            {tok.country_iso}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          mTLS ES2+ Channel
                        </div>
                      </td>

                      {/* Device IMEI */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200">
                          <Smartphone className="w-3 h-3 text-slate-500" />
                          <span>{tok.device_imei}</span>
                        </div>
                        <div className="text-[10px] mt-0.5 font-sans">
                          {tok.imei_chassis_locked ? (
                            <span className="text-sky-400 flex items-center gap-1 font-medium">
                              <Lock className="w-2.5 h-2.5" /> Chassis Locked
                            </span>
                          ) : (
                            <span className="text-slate-500 flex items-center gap-1">
                              <Unlock className="w-2.5 h-2.5" /> Chassis Free
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Issued / Expires */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 text-[11px]">
                          {new Date(tok.issued_at).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Expires:{' '}
                          <span
                            className={
                              isExpired
                                ? 'text-rose-400 font-bold'
                                : isExpiringSoon
                                ? 'text-amber-400 font-bold'
                                : 'text-slate-400'
                            }
                          >
                            {new Date(tok.expires_at).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        {isExpiringSoon && (
                          <div className="text-[10px] text-amber-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            <span>{getDaysRemaining(tok.expires_at)} days left</span>
                          </div>
                        )}
                        {isExpired && (
                          <div className="text-[10px] text-rose-400 font-mono font-medium flex items-center gap-1 mt-0.5">
                            <XCircle className="w-2.5 h-2.5" />
                            <span>Lease lapsed</span>
                          </div>
                        )}
                      </td>

                      {/* Latency */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="text-amber-300 font-bold">{tok.attestation_latency_ms} ms</div>
                        <div className="text-[9px] text-emerald-400">P99 &lt; 400ms</div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInspectToken(tok);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors text-[11px] font-sans"
                          >
                            Inspect
                          </button>
                          {(isExpiringSoon || isExpired) && (
                            <button
                              onClick={(e) => handleRebindSingle(tok, e)}
                              className="px-2 py-1 rounded bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 hover:text-white transition-colors text-[11px] font-sans flex items-center gap-1"
                              title="Re-bind this eSIM token via carrier SM-DP+"
                            >
                              <RefreshCw className="w-3 h-3 text-amber-400" />
                              <span>Re-bind</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Token Details & Cryptographic Evidence Modal */}
      {selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    selectedToken.binding_status === 'Verified'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : selectedToken.binding_status === 'Locked'
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : selectedToken.binding_status === 'Critical'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">HardwareAttestedToken Inspector</h3>
                    {selectedToken.binding_status === 'Verified' && (
                      <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        VERIFIED · SGP.22 ACTIVE
                      </span>
                    )}
                    {selectedToken.binding_status === 'Locked' && (
                      <span className="bg-sky-950 border border-sky-500/30 text-sky-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        LOCKED · CHASSIS BOUND
                      </span>
                    )}
                    {selectedToken.binding_status === 'Critical' && (
                      <span className="bg-amber-950 border border-amber-500/50 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        CRITICAL · EXPIRING SOON ({getDaysRemaining(selectedToken.expires_at)}D)
                      </span>
                    )}
                    {selectedToken.binding_status === 'Expired' && (
                      <span className="bg-rose-950 border border-rose-500/30 text-rose-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                        EXPIRED LEASE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Binding ID: {selectedToken.binding_id} · Carrier: {selectedToken.carrier}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedToken(null)}
                className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cryptographic Verification Status Banner */}
            {verificationResult && (
              <div
                className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
                  verificationResult.isValid
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {verificationResult.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>
                    Ed25519 Signature Verification:{' '}
                    <strong>{verificationResult.isValid ? 'CRYPTO VALID' : 'INVALID / TAMPERED'}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Verification Latency: <strong>{verificationResult.verificationLatencyUs} µs</strong> (&lt; 2.0ms SLA)
                </div>
              </div>
            )}

            {/* Critical Expiry Alert Banner */}
            {selectedToken.binding_status === 'Critical' && (
              <div className="p-3.5 rounded-xl border border-amber-500/50 bg-amber-950/40 text-amber-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-amber-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-bold text-amber-300">
                      Token Within 30 Days of Expiry ({getDaysRemaining(selectedToken.expires_at)} days remaining)
                    </div>
                    <div className="text-[11px] text-amber-200/80">
                      Carrier SM-DP+ re-binding required to generate new Ed25519 signature before deadline.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRebindSingle(selectedToken)}
                  disabled={isRebinding}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRebinding ? 'animate-spin' : ''}`} />
                  <span>Re-bind via SM-DP+</span>
                </button>
              </div>
            )}

            {/* Expired Lease Alert Banner */}
            {selectedToken.binding_status === 'Expired' && (
              <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-950/40 text-rose-200 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-rose-950/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <XCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <div className="font-bold text-rose-300">
                      Attestation Lease Expired Past Deadline
                    </div>
                    <div className="text-[11px] text-rose-200/80">
                      eSIM profile authentication suspended. Execute SM-DP+ ES2+ renewal to restore valid state.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRebindSingle(selectedToken)}
                  disabled={isRebinding}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono shrink-0 flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRebinding ? 'animate-spin' : ''}`} />
                  <span>Re-bind via SM-DP+</span>
                </button>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">eUICC Identifier (EID)</span>
                <div className="font-bold text-white text-xs break-all flex items-center justify-between">
                  <span>{selectedToken.raw_eid || selectedToken.masked_eid}</span>
                  <button
                    onClick={() => handleCopy('m-eid', selectedToken.raw_eid || selectedToken.masked_eid)}
                    className="text-slate-500 hover:text-white p-1"
                  >
                    {copiedKey === 'm-eid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <div className="text-[10px] text-slate-400">GSMA SGP.22 32-Digit Hardware Root</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">Physical Device IMEI</span>
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>{selectedToken.device_imei}</span>
                  {selectedToken.imei_chassis_locked ? (
                    <span className="text-sky-400 text-[10px] bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                      Chassis Locked
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px]">Chassis Unlocked</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400">Hardware Chassis Binding Anti-Clone</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">SGP.22 Profile State</span>
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{selectedToken.sgp22_profile_state}</span>
                </div>
                <div className="text-[10px] text-slate-400">SM-DP+ mTLS ES2+ Status</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase text-slate-500">Attestation Latency</span>
                <div className="text-amber-300 font-bold flex items-center justify-between">
                  <span>{selectedToken.attestation_latency_ms} ms</span>
                  <span className="text-emerald-400 text-[10px]">SLA &lt; 400ms Ceiling</span>
                </div>
                <div className="text-[10px] text-slate-400">Hard SLA Budget Verified</div>
              </div>
            </div>

            {/* ICCID Privacy Hash & ZK Proof */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-400 text-[10px] uppercase">
                  ICCID + ZK Proof Non-Invertible Hash (SHA-256)
                </span>
                <button
                  onClick={() => handleCopy('m-iccid', selectedToken.iccid_hash_hex)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'm-iccid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-sky-300 break-all">
                {selectedToken.iccid_hash_hex}
              </div>
            </div>

            {/* Ed25519 JWS Compact Signature */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 text-[10px] uppercase">
                  RFC 7515 Compact JWS Signature (Ed25519)
                </span>
                <button
                  onClick={() => handleCopy('m-sig', selectedToken.ed25519_jws_compact_sig)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'm-sig' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Compact JWS</span>
                </button>
              </div>
              <div className="bg-slate-900 p-2.5 rounded border border-slate-800 text-[11px] text-emerald-400 break-all max-h-24 overflow-y-auto">
                {selectedToken.ed25519_jws_compact_sig}
              </div>
              <div className="text-[10px] text-slate-500">
                Issued At: {selectedToken.issued_at} · Expires At: {selectedToken.expires_at}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-500 text-[10px] font-mono">
                Source: services/id-federation/pkg/esim/smdp_identity_binder.go
              </span>
              <div className="flex items-center gap-2">
                {(selectedToken.binding_status === 'Critical' || selectedToken.binding_status === 'Expired') && (
                  <button
                    onClick={() => handleRebindSingle(selectedToken)}
                    disabled={isRebinding}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRebinding ? 'animate-spin' : ''}`} />
                    <span>Re-bind Token</span>
                  </button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setSelectedToken(null)}
                  className="text-xs"
                >
                  Close Inspector
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issue Attested Token Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Issue eSIM HardwareAttestedToken</h3>
                  <p className="text-xs text-slate-400">
                    Bind eUICC chip to sovereign sovereign carrier SM-DP+ within 400ms SLA budget.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {formValidationError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 font-mono">
                {formValidationError}
              </div>
            )}

            <form onSubmit={handleCreateToken} className="space-y-3.5 text-xs font-mono">
              {/* EID */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 font-semibold uppercase text-[10px]">
                    32-Digit GSMA SGP.22 EID *
                  </label>
                  <span
                    className={`text-[10px] ${
                      newEid.trim().length === 32 ? 'text-emerald-400 font-bold' : 'text-amber-400'
                    }`}
                  >
                    {newEid.trim().length}/32 digits
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={newEid}
                    onChange={(e) => setNewEid(e.target.value.replace(/[^0-9]/g, ''))}
                    maxLength={32}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-20 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsIssueModalOpen(false);
                      setIsScannerOpen(true);
                    }}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded text-[10px] font-mono flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3" />
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              {/* Carrier Selection */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase text-[10px]">
                  Issuing SM-DP+ Carrier Authority
                </label>
                <select
                  value={newCarrier}
                  onChange={(e) => {
                    const val = e.target.value;
                    let iso = 'KE';
                    if (val.includes('MTN') || val.includes('Nigeria')) iso = 'NG';
                    else if (val.includes('Vodacom') || val.includes('South Africa')) iso = 'ZA';
                    else if (val.includes('Telecel') || val.includes('Ghana')) iso = 'GH';
                    else if (val.includes('Orange') || val.includes('Ivoire')) iso = 'CI';
                    setNewCarrier(val);
                    setNewCountryIso(iso);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="Safaricom Kenya (Sovereign Core)">Safaricom Kenya (Sovereign Core)</option>
                  <option value="MTN Nigeria (NCC Certified SM-DP+)">MTN Nigeria (NCC Certified SM-DP+)</option>
                  <option value="Vodacom South Africa (ICASA Tier 1)">Vodacom South Africa (ICASA Tier 1)</option>
                  <option value="Telecel Ghana (NCA Sovereign Gateway)">Telecel Ghana (NCA Sovereign Gateway)</option>
                  <option value="Orange Côte d'Ivoire (ARTCI Gateway)">Orange Côte d'Ivoire (ARTCI Gateway)</option>
                </select>
              </div>

              {/* Device IMEI */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase text-[10px]">
                  Device IMEI (Physical Chassis TAC)
                </label>
                <input
                  type="text"
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={16}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Status Simulation Controls */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Status Simulation Options (esim_binder.go)
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChassisLock}
                      onChange={(e) => setNewChassisLock(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
                    />
                    <span>Enforce IMEI Chassis Lock ('Locked')</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newForceCritical}
                      onChange={(e) => {
                        setNewForceCritical(e.target.checked);
                        if (e.target.checked) setNewForceExpired(false);
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                    />
                    <span>Simulate Expiring Soon (&lt; 30d) ('Critical')</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newForceExpired}
                      onChange={(e) => {
                        setNewForceExpired(e.target.checked);
                        if (e.target.checked) setNewForceCritical(false);
                      }}
                      className="rounded border-slate-700 bg-slate-900 text-rose-500 focus:ring-0"
                    />
                    <span>Simulate Expired Lease ('Expired')</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={newEid.trim().length !== 32}
                  className={`px-4 py-1.5 rounded-lg font-bold text-white transition-colors flex items-center gap-1.5 ${
                    newEid.trim().length === 32
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-950/50 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Execute Attestation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* eUICC QR Scanner Modal */}
      <EuiccQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
};
