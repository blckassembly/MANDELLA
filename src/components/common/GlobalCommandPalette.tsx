import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Command,
  Building2,
  Database,
  ArrowRight,
  Shield,
  ShieldCheck,
  Radio,
  FileText,
  CornerDownLeft,
  Copy,
  Check,
  Globe,
  Key,
  History,
  Lock,
  Layers,
  Activity,
  X,
  ExternalLink,
  Satellite,
  Server,
  Zap,
  Sliders,
  Sparkles,
  ChevronRight,
  Hash,
  AlertCircle,
  ShieldAlert,
  Brain,
  Minimize2,
  Maximize2,
  LayoutGrid,
  Wifi,
  WifiOff
} from 'lucide-react';
import { TenantAccount, PortalMode, EnterpriseProduct } from '../../types/multiTenant';
import { DataverseEntitySchema, DataverseAuditLog } from '../../types/dataverse';
import { PortingRequest, AuditLogEntry, PhoneNumberRecord } from '../../types/nms';
import { DataverseTab, System1Tab, System4Tab } from '../../components/Header';
import { Badge, Button } from '../../design-system';

export type CommandCategory = 'all' | 'tenants' | 'schemas' | 'provisioning' | 'audit_logs' | 'actions';
export type DensityMode = 'compact' | 'standard' | 'spacious';

export interface ExtraProvisioningItem {
  id: string;
  type: 'porting' | 'inventory_allocation' | 'kamailio_trunk' | 'satellite_terminal' | 'smpp_bind';
  title: string;
  subtitle: string;
  status: 'active' | 'in-progress' | 'submitted' | 'completed' | 'recycling' | 'pending';
  countryCode?: string;
  carrier?: string;
  e164?: string;
  slaTarget?: string;
  requestedBy: string;
  timestamp: string;
  details: string;
}

export interface ExtraAuditLogItem {
  id: string;
  source: 'dataverse' | 'nms_telecom' | 'sovereign_kms' | 'routing_lcr' | 'edge_signaling' | 'sms_firewall' | 'ixp_scrubber';
  timestamp: string;
  actor: string;
  userRole?: string;
  action: string;
  target: string;
  ipAddress?: string;
  status: 'SUCCESS' | 'DENIED_RBAC' | 'VALIDATION_FAILED' | 'FLAGGED';
  integrityHash: string;
  details: string;
}

export interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  // Multi-tenant accounts
  tenants: TenantAccount[];
  currentTenantId: string;
  onSelectTenant: (tenant: TenantAccount) => void;
  // Schemas
  schemas: DataverseEntitySchema[];
  onSelectSchema?: (schema: DataverseEntitySchema) => void;
  // Provisioning
  portingRequests: PortingRequest[];
  numbers?: PhoneNumberRecord[];
  onSelectProvisioning?: (req: PortingRequest | ExtraProvisioningItem) => void;
  // System-wide Audit Logs
  dataverseAuditLogs: DataverseAuditLog[];
  nmsAuditLogs: AuditLogEntry[];
  // Navigation Callbacks
  onNavigatePortal?: (mode: PortalMode) => void;
  onNavigateEnterpriseProduct?: (product: EnterpriseProduct) => void;
  onNavigateDataverseTab?: (tab: DataverseTab) => void;
  onNavigateSystem1Tab?: (tab: System1Tab) => void;
  onNavigateSystem4Tab?: (tab: System4Tab) => void;
  onOpenOnboarding?: () => void;
  onOpenStressTest?: () => void;
  onOpenDesignSystem?: () => void;
  onOpenNmcpControlPlane?: () => void;
  onSetTextSize?: (size: 'standard' | 'large' | 'xl') => void;
  // Layout Density Control for 11 Portals
  densityMode?: DensityMode;
  onSetDensityMode?: (mode: DensityMode) => void;
  // Workbox Service Worker & Offline Read-Only Resilience
  isReadOnly?: boolean;
  isSimulatedOffline?: boolean;
  onToggleSimulateOffline?: () => void;
}

// Built-in additional telecom provisioning items to enrich real African carrier workflows
const SYSTEM_PROVISIONING_QUEUE: ExtraProvisioningItem[] = [
  {
    id: 'prov-anycast-lagos-01',
    type: 'kamailio_trunk',
    title: 'Kamailio SIP Trunk Anycast Dispatcher',
    subtitle: 'AS37105 Primary Lagos PoP Interconnect for Ecobank NG',
    status: 'active',
    countryCode: 'NG',
    carrier: 'MainOne / Equinix Lagos',
    slaTarget: '99.999% SLA',
    requestedBy: 'infra-telco@ecobank.com',
    timestamp: '2026-10-14 17:30 UTC',
    details: 'Configured 240 concurrent SIP channels on 197.210.1.4:5060 with SRTP/TLS encryption.'
  },
  {
    id: 'prov-leo-teleport-02',
    type: 'satellite_terminal',
    title: 'Eutelsat OneWeb Teleport Attestation & Terminal Auth',
    subtitle: 'Mwembeshi Teleport Ka-band NTN Ground Terminal Provisioning',
    status: 'in-progress',
    countryCode: 'ZM',
    carrier: 'Mwembeshi Earth Station',
    slaTarget: '4-hour expedited SLA',
    requestedBy: 'teleport-noc@oneweb.net',
    timestamp: '2026-10-14 16:15 UTC',
    details: 'Hardware cryptographic attestation token generated for 3GPP Rel-17 NTN User Equipment gateway.'
  },
  {
    id: 'prov-smpp-bind-03',
    type: 'smpp_bind',
    title: 'SMPP v5 High-Throughput Bind Provisioning',
    subtitle: 'Flutterwave Transactional OTP Gateway (1,500 msg/sec)',
    status: 'active',
    countryCode: 'NG',
    carrier: 'MTN Nigeria Core Bridge',
    slaTarget: 'Under 1.2s delivery SLA',
    requestedBy: 'infra-telco@flutterwave.com',
    timestamp: '2026-10-14 15:40 UTC',
    details: 'Allocated system_id mandela_flw_transact_01 with automated USSD fallback routing.'
  }
];

export const GlobalCommandPalette: React.FC<GlobalCommandPaletteProps> = ({
  isOpen,
  onClose,
  tenants,
  currentTenantId,
  onSelectTenant,
  schemas,
  onSelectSchema,
  portingRequests,
  numbers = [],
  onSelectProvisioning,
  dataverseAuditLogs,
  nmsAuditLogs,
  onNavigatePortal,
  onNavigateEnterpriseProduct,
  onNavigateDataverseTab,
  onNavigateSystem1Tab,
  onNavigateSystem4Tab,
  onOpenOnboarding,
  onOpenStressTest,
  onOpenDesignSystem,
  onOpenNmcpControlPlane,
  onSetTextSize,
  densityMode = 'standard',
  onSetDensityMode,
  isReadOnly = false,
  isSimulatedOffline = false,
  onToggleSimulateOffline
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CommandCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2800);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    showToast(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Compile unified system-wide audit logs
  const combinedAuditLogs: ExtraAuditLogItem[] = useMemo(() => {
    const list: ExtraAuditLogItem[] = [];

    // From Dataverse
    dataverseAuditLogs.forEach((log) => {
      list.push({
        id: log.id,
        source: 'dataverse',
        timestamp: log.timestamp,
        actor: log.userId,
        userRole: log.userRole,
        action: log.action,
        target: `${log.entityName}${log.recordId ? ` (${log.recordId})` : ''}`,
        ipAddress: log.ipAddress,
        status: log.status === 'SUCCESS' ? 'SUCCESS' : 'FLAGGED',
        integrityHash: log.hashVerification,
        details: log.details
      });
    });

    // From Telecom NMS
    nmsAuditLogs.forEach((log) => {
      list.push({
        id: log.id,
        source: 'nms_telecom',
        timestamp: log.timestamp,
        actor: log.actor,
        action: log.action,
        target: log.e164 || `Country ${log.countryCode}`,
        status: 'SUCCESS',
        integrityHash: log.verificationHash,
        details: log.details
      });
    });

    // Add sovereign KMS invariant security audit events
    list.push(
      {
        id: 'aud-kms-rot-01',
        source: 'sovereign_kms',
        timestamp: '2026-10-14 14:12:00 UTC',
        actor: 'kms.master_hardware_attestor',
        action: 'KMS_KEY_ATTESTATION',
        target: 'kms/west-africa/ecobank-fintech-master',
        ipAddress: '10.240.0.12',
        status: 'SUCCESS',
        integrityHash: 'sha256:49c011928dfa320188b4ea1109912048aa',
        details: 'Hardware Security Module (HSM) FIPS 140-3 Level 4 key integrity verified for Lagos Pod-1.'
      },
      {
        id: 'aud-lcr-failover-02',
        source: 'routing_lcr',
        timestamp: '2026-10-14 13:45:18 UTC',
        actor: 'lcr.margin_guard_daemon',
        action: 'GREY_ROUTE_QUARANTINE',
        target: 'Route #8812 (West Africa FAS)',
        ipAddress: '10.240.2.8',
        status: 'SUCCESS',
        integrityHash: 'sha256:77b102948ca128001fa9102488bbd11099',
        details: 'Automatically quarantined route due to False Answer Supervision (FAS) detection.'
      },
      {
        id: 'aud-edge-ss7-cat1-03',
        source: 'edge_signaling',
        timestamp: '2026-10-14 14:48:10 UTC',
        actor: 'rust.ss7_diameter_filter',
        action: 'SS7_FS11_CAT1_BLOCK',
        target: 'STP-01 (Mombasa Interconnect) -> MAP_InsertSubscriberData',
        ipAddress: '196.201.214.18',
        status: 'SUCCESS',
        integrityHash: 'sha256:88e0112948ca1b9921ef00219488aab1099',
        details: 'Blocked unauthorized MAP_InsertSubscriberData across international interconnect in 1,420 µs (< 1800 µs SLA budget).'
      },
      {
        id: 'aud-edge-ixp-flowspec-04',
        source: 'ixp_scrubber',
        timestamp: '2026-10-14 14:42:05 UTC',
        actor: 'gobgp.flowspec_engine',
        action: 'IXP_BGP_FLOWSPEC_DROP',
        target: 'KIXP Nairobi -> UDP 2152 (GTP-U Flood)',
        ipAddress: '196.201.214.0/24',
        status: 'SUCCESS',
        integrityHash: 'sha256:99c1182049102948fa11099238475619283',
        details: 'Deployed automated BGP FlowSpec traffic-rate 0 in 1.8s. eBPF XDP kernel driver dropped 24.5M pkts/s at NIC ring buffer.'
      },
      {
        id: 'aud-edge-sms-simjacker-05',
        source: 'sms_firewall',
        timestamp: '2026-10-14 14:39:20 UTC',
        actor: 'rust.ota_inspector',
        action: 'SIMJACKER_0x7F_STRIPPED',
        target: 'SMPP v3.4 -> +254 712 345678',
        ipAddress: '10.240.4.11',
        status: 'SUCCESS',
        integrityHash: 'sha256:33a0194881029bca1128475619283746501',
        details: 'Simjacker 0x7F SIM Toolkit UDH envelope stripped in 2.1ms (< 5.0ms SLA). Home Routing IMSI virtualization active.'
      }
    );

    return list;
  }, [dataverseAuditLogs, nmsAuditLogs]);

  // Compile combined provisioning requests
  const combinedProvisioning: ExtraProvisioningItem[] = useMemo(() => {
    const list: ExtraProvisioningItem[] = [...SYSTEM_PROVISIONING_QUEUE];

    portingRequests.forEach((req) => {
      list.push({
        id: req.id,
        type: 'porting',
        title: `Port ${req.number} (${req.subscriberName})`,
        subtitle: `${req.currentCarrier} → ${req.targetCarrier}`,
        status: req.status === 'in-progress' ? 'in-progress' : req.status === 'completed' ? 'completed' : 'submitted',
        countryCode: req.countryCode,
        carrier: req.currentCarrier,
        e164: req.number,
        slaTarget: req.estimatedCompletionAt,
        requestedBy: req.nationalIdOrCac,
        timestamp: req.submittedAt,
        details: `LOA document: ${req.loaDocumentName}. Subscriber: ${req.subscriberName}.`
      });
    });

    numbers.filter((n) => n.status === 'assigned' || n.status === 'porting' || n.status === 'reserved').forEach((num) => {
      list.push({
        id: `prov-num-${num.id}`,
        type: 'inventory_allocation',
        title: `DID ${num.e164} (${num.countryName})`,
        subtitle: `Carrier: ${num.carrier} · Status: ${num.status.toUpperCase()}`,
        status: num.status === 'assigned' ? 'active' : num.status === 'porting' ? 'in-progress' : 'pending',
        countryCode: num.countryCode,
        carrier: num.carrier,
        e164: num.e164,
        slaTarget: num.recyclingDueAt ? `Recycling hold until ${num.recyclingDueAt}` : 'Active DID line',
        requestedBy: num.allocatedTo || 'System Pool',
        timestamp: num.allocatedAt || num.lastActivityAt || '2026-10-10',
        details: `Features: ${num.features.join(', ')}. Rate: $${num.monthlyFeeUsd}/mo. ENUM: ${num.enumRecord || 'NAPTR pending'}.`
      });
    });

    return list;
  }, [portingRequests, numbers]);

  // System Action Commands
  const systemActions = useMemo(() => [
    {
      id: 'cmd-open-nmcp',
      title: 'Open NMCP AI Control Plane (Multi-Tenant Observability)',
      subtitle: 'Real-time multi-tenant telemetry and AI situational understanding across all 11 system layers',
      category: 'actions' as const,
      icon: <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />,
      run: () => {
        onOpenNmcpControlPlane?.();
        showToast('Opened NMCP Multi-Tenant AI Control Plane');
        onClose();
      }
    },
    {
      id: 'cmd-portal-mandela-os',
      title: 'Open MANDELA OS (30 Applications Directory)',
      subtitle: 'Universal navigation shell with persistent left portals across all 30 telecom products',
      category: 'actions' as const,
      icon: <Layers className="w-4 h-4 text-amber-600" />,
      run: () => {
        onNavigatePortal?.('mandela_os');
        showToast('Opened MANDELA OS 30-Application Directory');
        onClose();
      }
    },
    {
      id: 'cmd-n8n-workflow-automation',
      title: 'Open n8n Workflow Automation Engine',
      subtitle: 'Visual node graph DAG orchestrating FreeSWITCH, Gemini 3.8 AI, M-Pesa, and Pan-African Numbers',
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-emerald-600" />,
      run: () => {
        onNavigatePortal?.('agnostic_os');
        showToast('Opened n8n Workflow Automation Engine');
        onClose();
      }
    },
    {
      id: 'cmd-portal-customer',
      title: 'Switch to Customer Self-Service Portal',
      subtitle: 'View self-service billing, active DID inventory, and usage telemetry',
      category: 'actions' as const,
      icon: <Building2 className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('customer_portal');
        showToast('Switched to Customer Self-Service Portal');
        onClose();
      }
    },
    {
      id: 'cmd-portal-enterprise',
      title: 'Switch to Enterprise Core Suite',
      subtitle: 'Access Dataverse, SBC Anycast, LCR dynamic routing, and satellite NTN',
      category: 'actions' as const,
      icon: <Server className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        showToast('Switched to Enterprise Core Suite');
        onClose();
      }
    },
    {
      id: 'cmd-prod-dataverse',
      title: 'Open MANDELA Dataverse Business Engine',
      subtitle: 'Manage entity schemas, relationships, records, and event pipelines',
      category: 'actions' as const,
      icon: <Database className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('dataverse');
        showToast('Opened MANDELA Dataverse');
        onClose();
      }
    },
    {
      id: 'cmd-prod-edge-defense',
      title: 'Open Module 1: Inline Signaling & Edge Defense Plane',
      subtitle: 'SS7 & Diameter GSMA FS.11/19 firewalls, SMS Simjacker defense, STIR/SHAKEN, IXP eBPF scrubbing',
      category: 'actions' as const,
      icon: <ShieldAlert className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('edge_defense');
        showToast('Opened Inline Signaling & Edge Defense Plane');
        onClose();
      }
    },
    {
      id: 'cmd-prod-siem-fabric',
      title: 'Open Module 2: 18-System SIEM & Stateful Normalization Fabric',
      subtitle: '18 telecom feeds, OCSF telecom extension, Apache Flink 15m sliding window, ClickHouse hot tier',
      category: 'actions' as const,
      icon: <Layers className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('siem_fabric');
        showToast('Opened 18-System SIEM & Normalization Fabric');
        onClose();
      }
    },
    {
      id: 'cmd-prod-ai-fraud',
      title: 'Open Module 3: Multi-Entity AI Anomaly & Voice Fraud Engine',
      subtitle: 'Geodesic velocity detector, tower ST-GNN simbox isolation, IP JA4, RawNet3 acoustic deepfake lab',
      category: 'actions' as const,
      icon: <Brain className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('ai_anomaly_voice');
        showToast('Opened AI Anomaly & Voice Fraud Engine');
        onClose();
      }
    },
    {
      id: 'cmd-prod-soc-c2',
      title: 'Open Module 4: SOC Command & Control (C2) Real-Time UI',
      subtitle: 'Live attack counters, fraud $ blocked ticker, SIM-swap quarantine queue, entity graph, playbooks',
      category: 'actions' as const,
      icon: <ShieldCheck className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('soc_c2');
        showToast('Opened SOC Command & Control (C2)');
        onClose();
      }
    },
    {
      id: 'cmd-prod-interconnect',
      title: 'Open Carrier Interconnect & LCR Rate Engine',
      subtitle: 'Carrier rate decks, margin alerts, real-time CDR mediation stream',
      category: 'actions' as const,
      icon: <Layers className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('interconnect');
        showToast('Opened Carrier Interconnect & LCR Engine');
        onClose();
      }
    },
    {
      id: 'cmd-prod-satellite',
      title: 'Open Satellite Carrier & NTN Gateway',
      subtitle: 'Mwembeshi Teleport ground station, LEO constellation telemetry',
      category: 'actions' as const,
      icon: <Satellite className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('satellite_ntn');
        showToast('Opened Satellite & NTN Gateway');
        onClose();
      }
    },
    {
      id: 'cmd-prod-sbc',
      title: 'Open System 4: Carrier SBC & Anycast SIP Core',
      subtitle: 'Kamailio dispatcher table, FreeSWITCH media nodes, SIP inspection',
      category: 'actions' as const,
      icon: <Zap className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('sbc_core');
        showToast('Opened System 4: Carrier SBC');
        onClose();
      }
    },
    {
      id: 'cmd-packet-diagnostic-sbc',
      title: 'Trigger Packet Diagnostic: 30s RTP Capture Session (System 4 SBC)',
      subtitle: 'Capture and inspect live RFC 3550 RTP headers, SSRC, jitter, marker bits, and RFC 5285 audio levels for SIP call traces',
      category: 'actions' as const,
      icon: <Activity className="w-4 h-4 text-amber-500" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('sbc_core');
        onNavigateSystem4Tab?.('ladder_traces');
        showToast('Opened System 4 SBC Core: Packet Diagnostic & SIP Traces ready.');
        onClose();
      }
    },
    {
      id: 'cmd-prod-nms',
      title: 'Open System 1: Number Management & Sovereign Porting',
      subtitle: 'African inventory browser, MNP porting engine, regulatory compliance',
      category: 'actions' as const,
      icon: <Radio className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('nms_numbers');
        showToast('Opened Number Management & Porting');
        onClose();
      }
    },
    {
      id: 'cmd-esim-attestation',
      title: 'Open System 1: eSIM Attestation Dashboard',
      subtitle: 'HardwareAttestedToken issuances, GSMA SGP.22 bindings, Verified/Expired/Locked status',
      category: 'actions' as const,
      icon: <Radio className="w-4 h-4 text-emerald-600" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('nms_numbers');
        onNavigateSystem1Tab?.('esim_attestation');
        showToast('Opened eSIM Attestation Dashboard');
        onClose();
      }
    },
    {
      id: 'cmd-prod-messaging',
      title: 'Open System 2: Messaging Gateway · SMPP v5 & USSD',
      subtitle: 'NOC throughput dashboard, feature-phone USSD session simulator',
      category: 'actions' as const,
      icon: <FileText className="w-4 h-4 text-black" />,
      run: () => {
        onNavigatePortal?.('enterprise_suite');
        onNavigateEnterpriseProduct?.('messaging_sms');
        showToast('Opened Messaging & USSD Gateway');
        onClose();
      }
    },
    {
      id: 'cmd-open-onboarding',
      title: 'Launch Multi-Tenant Onboarding Wizard',
      subtitle: 'Provision new sovereign carrier, fintech tenant, or satellite teleport',
      category: 'actions' as const,
      icon: <Sparkles className="w-4 h-4 text-black" />,
      run: () => {
        onOpenOnboarding?.();
        onClose();
      }
    },
    {
      id: 'cmd-open-stress-test',
      title: 'Launch Multi-Tenant UX Stress Test Studio',
      subtitle: 'Simulate signup-to-product journey, data isolation, and load tests',
      category: 'actions' as const,
      icon: <Activity className="w-4 h-4 text-black" />,
      run: () => {
        onOpenStressTest?.();
        onClose();
      }
    },
    {
      id: 'cmd-open-design-system',
      title: 'Open The Atelier Design System Catalog',
      subtitle: 'Inspect luxury minimalist components, typography tokens, and guidelines',
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-black" />,
      run: () => {
        onOpenDesignSystem?.();
        onClose();
      }
    },
    {
      id: 'cmd-text-size-standard',
      title: 'Set Typography Scale: Standard (15px)',
      subtitle: 'Default compact telemetry font sizing',
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-black" />,
      run: () => {
        onSetTextSize?.('standard');
        showToast('Typography scale set to Standard');
        onClose();
      }
    },
    {
      id: 'cmd-text-size-large',
      title: 'Set Typography Scale: Large Comfortable (16.5px)',
      subtitle: 'Recommended enhanced readability scale',
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-black" />,
      run: () => {
        onSetTextSize?.('large');
        showToast('Typography scale set to Large');
        onClose();
      }
    },
    {
      id: 'cmd-text-size-xl',
      title: 'Set Typography Scale: Extra Large (18px)',
      subtitle: 'Maximum accessibility and executive presentation scale',
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-black" />,
      run: () => {
        onSetTextSize?.('xl');
        showToast('Typography scale set to Extra Large');
        onClose();
      }
    },
    // CSS Root Variable Density Controls across 11 Portals
    {
      id: 'cmd-density-compact',
      title: 'Set Layout Density: Compact (High-Density Operations)',
      subtitle: 'Condensed spacing & padding (14.5px font, 6px padding) for NOC/SOC telemetry and high-throughput data',
      category: 'actions' as const,
      icon: <Minimize2 className="w-4 h-4 text-black" />,
      run: () => {
        onSetDensityMode?.('compact');
        showToast('Layout density set to Compact (NOC Operations)');
        onClose();
      }
    },
    {
      id: 'cmd-density-standard',
      title: 'Set Layout Density: Standard (Balanced Atelier)',
      subtitle: 'Balanced executive spacing (16px base font, 10px padding) and optimal data density across all 11 portals',
      category: 'actions' as const,
      icon: <LayoutGrid className="w-4 h-4 text-black" />,
      run: () => {
        onSetDensityMode?.('standard');
        showToast('Layout density set to Standard');
        onClose();
      }
    },
    {
      id: 'cmd-density-spacious',
      title: 'Set Layout Density: Spacious (Enhanced Legibility & Touch)',
      subtitle: 'Relaxed breathing room (17.5px font, 14px padding) and large touch targets across all 11 portals',
      category: 'actions' as const,
      icon: <Maximize2 className="w-4 h-4 text-black" />,
      run: () => {
        onSetDensityMode?.('spacious');
        showToast('Layout density set to Spacious (Enhanced Legibility)');
        onClose();
      }
    },
    {
      id: 'cmd-density-cycle',
      title: 'Toggle Layout Density (Cycle: Compact ↔ Standard ↔ Spacious)',
      subtitle: `Active density: ${densityMode.toUpperCase()}. Toggle to next density mode across 11 portals`,
      category: 'actions' as const,
      icon: <Sliders className="w-4 h-4 text-black" />,
      run: () => {
        const next: DensityMode =
          densityMode === 'compact' ? 'standard' : densityMode === 'standard' ? 'spacious' : 'compact';
        onSetDensityMode?.(next);
        showToast(`Layout density toggled to ${next.toUpperCase()}`);
        onClose();
      }
    },
    // Workbox Service Worker & Remote African Infrastructure Offline Simulation
    {
      id: 'cmd-toggle-offline-simulation',
      title: isReadOnly
        ? 'Reconnect: Restore Remote African Telecom Network (Live Mode)'
        : 'Simulate Offline Disconnection: Workbox Read-Only State',
      subtitle: isReadOnly
        ? 'Resume live telemetry streaming, bi-directional signaling, and unlock write operations across 11 portals'
        : 'Simulate African remote infrastructure network outage; Workbox caches maintain complete read-only portal access',
      category: 'actions' as const,
      icon: isReadOnly ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-amber-600" />,
      run: () => {
        if (onToggleSimulateOffline) {
          onToggleSimulateOffline();
          showToast(
            isReadOnly
              ? 'Reconnected to network. Live streaming and write mutations restored.'
              : 'Offline simulation engaged. Workbox read-only mode active across 11 portals.'
          );
        } else {
          showToast('Offline simulation toggle not available.');
        }
        onClose();
      }
    },
    {
      id: 'cmd-inspect-workbox-cache',
      title: 'Inspect Workbox Cache & PWA Service Worker Status',
      subtitle: `Status: ${isReadOnly ? 'OFFLINE (READ-ONLY CACHE)' : 'ONLINE (PRECACHED)'} · Static assets, fonts, & critical /api/* responses ready`,
      category: 'actions' as const,
      icon: <Database className="w-4 h-4 text-black" />,
      run: () => {
        showToast(
          isReadOnly
            ? 'Workbox Cache Active: Serving 11 architecture portals in protected read-only mode.'
            : 'Workbox Service Worker Active: Static assets & critical telecom API responses precached.'
        );
        onClose();
      }
    }
  ], [
    onNavigatePortal,
    onNavigateEnterpriseProduct,
    onOpenOnboarding,
    onOpenStressTest,
    onOpenDesignSystem,
    onSetTextSize,
    densityMode,
    onSetDensityMode,
    isReadOnly,
    isSimulatedOffline,
    onToggleSimulateOffline,
    onNavigateSystem4Tab,
    onClose
  ]);

  // Unified Search Results Aggregator
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();

    // 1. Tenants
    const tenantResults = tenants.map((t) => {
      const match =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.country.toLowerCase().includes(q) ||
        t.region.toLowerCase().includes(q) ||
        t.domain.toLowerCase().includes(q) ||
        t.subscription.displayName.toLowerCase().includes(q) ||
        t.dataIsolationMode.toLowerCase().includes(q) ||
        t.encryptionKeyAlias.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);

      return {
        item: t,
        category: 'tenants' as const,
        id: `tenant-${t.id}`,
        title: t.name,
        subtitle: `${t.country} · ${t.region} · ${t.domain}`,
        badges: [
          t.subscription.displayName,
          t.dataIsolationMode === 'dedicated_keyspace' ? 'Dedicated Keyspace' : 'Logical Schema',
          t.status.toUpperCase()
        ],
        icon: <Building2 className="w-4 h-4 text-black" />,
        isMatch: match
      };
    }).filter((r) => r.isMatch);

    // 2. Schemas
    const schemaResults = schemas.map((s) => {
      const fieldMatches = s.fields.some(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.displayName.toLowerCase().includes(q) ||
          f.type.toLowerCase().includes(q)
      );

      const match =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.displayName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        fieldMatches;

      return {
        item: s,
        category: 'schemas' as const,
        id: `schema-${s.id}`,
        title: s.displayName,
        subtitle: `${s.name} · ${s.fields.length} fields · ${s.recordCount.toLocaleString()} records · Primary: ${s.primaryField}`,
        badges: [
          `Category: ${s.category.toUpperCase()}`,
          `v${s.version}`,
          s.tenantScoped ? 'Tenant Scoped' : 'Global'
        ],
        icon: <Database className="w-4 h-4 text-black" />,
        isMatch: match
      };
    }).filter((r) => r.isMatch);

    // 3. Provisioning
    const provResults = combinedProvisioning.map((p) => {
      const match =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        (p.e164 && p.e164.toLowerCase().includes(q)) ||
        (p.carrier && p.carrier.toLowerCase().includes(q)) ||
        (p.countryCode && p.countryCode.toLowerCase().includes(q)) ||
        p.requestedBy.toLowerCase().includes(q) ||
        p.details.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);

      return {
        item: p,
        category: 'provisioning' as const,
        id: `prov-${p.id}`,
        title: p.title,
        subtitle: `${p.subtitle} · Requested by ${p.requestedBy}`,
        badges: [
          p.status.toUpperCase(),
          p.type.replace('_', ' ').toUpperCase(),
          p.countryCode || 'PAN-AFRICA'
        ],
        icon: <Radio className="w-4 h-4 text-black" />,
        isMatch: match
      };
    }).filter((r) => r.isMatch);

    // 4. Audit Logs
    const auditResults = combinedAuditLogs.map((a) => {
      const match =
        !q ||
        a.action.toLowerCase().includes(q) ||
        a.actor.toLowerCase().includes(q) ||
        a.target.toLowerCase().includes(q) ||
        (a.ipAddress && a.ipAddress.toLowerCase().includes(q)) ||
        a.integrityHash.toLowerCase().includes(q) ||
        a.details.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);

      return {
        item: a,
        category: 'audit_logs' as const,
        id: `audit-${a.id}`,
        title: `${a.action} on ${a.target}`,
        subtitle: `${a.timestamp} · Actor: ${a.actor}${a.ipAddress ? ` (${a.ipAddress})` : ''}`,
        badges: [
          a.source.replace('_', ' ').toUpperCase(),
          a.status,
          a.integrityHash.substring(0, 16) + '...'
        ],
        icon: <History className="w-4 h-4 text-black" />,
        isMatch: match
      };
    }).filter((r) => r.isMatch);

    // 5. Actions
    const actionResults = systemActions.map((act) => {
      const match =
        !q ||
        act.title.toLowerCase().includes(q) ||
        act.subtitle.toLowerCase().includes(q) ||
        act.id.toLowerCase().includes(q);

      return {
        item: act,
        category: 'actions' as const,
        id: act.id,
        title: act.title,
        subtitle: act.subtitle,
        badges: ['ACTION'],
        icon: act.icon,
        isMatch: match
      };
    }).filter((r) => r.isMatch);

    // Filter by active category
    if (activeCategory === 'tenants') return tenantResults;
    if (activeCategory === 'schemas') return schemaResults;
    if (activeCategory === 'provisioning') return provResults;
    if (activeCategory === 'audit_logs') return auditResults;
    if (activeCategory === 'actions') return actionResults;

    // 'all' category: combine results with priority
    return [
      ...tenantResults,
      ...schemaResults,
      ...provResults,
      ...auditResults,
      ...actionResults
    ];
  }, [
    query,
    activeCategory,
    tenants,
    schemas,
    combinedProvisioning,
    combinedAuditLogs,
    systemActions
  ]);

  // Keep selected index within bounds
  useEffect(() => {
    if (selectedIndex >= searchResults.length) {
      setSelectedIndex(Math.max(0, searchResults.length - 1));
    }
  }, [searchResults.length, selectedIndex]);

  // Keyboard navigation inside palette
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, searchResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleExecute(searchResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const categories: CommandCategory[] = ['all', 'tenants', 'schemas', 'provisioning', 'audit_logs', 'actions'];
      const currentIndex = categories.indexOf(activeCategory);
      const nextIndex = e.shiftKey
        ? (currentIndex - 1 + categories.length) % categories.length
        : (currentIndex + 1) % categories.length;
      setActiveCategory(categories[nextIndex]);
      setSelectedIndex(0);
    }
  };

  // Execution handler
  const handleExecute = (result: (typeof searchResults)[0]) => {
    if (result.category === 'tenants') {
      const tenant = result.item as TenantAccount;
      onSelectTenant(tenant);
      showToast(`Switched active workspace to ${tenant.name}`);
      onClose();
    } else if (result.category === 'schemas') {
      const schema = result.item as DataverseEntitySchema;
      onNavigatePortal?.('enterprise_suite');
      onNavigateEnterpriseProduct?.('dataverse');
      onNavigateDataverseTab?.('schemas');
      onSelectSchema?.(schema);
      showToast(`Opened schema "${schema.displayName}" in Schema Designer`);
      onClose();
    } else if (result.category === 'provisioning') {
      const prov = result.item as ExtraProvisioningItem;
      onNavigatePortal?.('enterprise_suite');
      onNavigateEnterpriseProduct?.('nms_numbers');
      onNavigateSystem1Tab?.('porting');
      onSelectProvisioning?.(prov);
      showToast(`Opened provisioning request ${prov.title}`);
      onClose();
    } else if (result.category === 'audit_logs') {
      const audit = result.item as ExtraAuditLogItem;
      copyToClipboard(audit.integrityHash, 'SHA-256 Hash');
    } else if (result.category === 'actions') {
      const action = result.item as (typeof systemActions)[0];
      action.run();
    }
  };

  const selectedItem = searchResults[selectedIndex];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 p-4 bg-black/60 backdrop-blur-sm transition-all duration-200"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 bg-black text-white border border-black/20 px-4 py-2 rounded-[2px] shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-sans font-medium animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2Icon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Command Palette Modal */}
      <div
        className="w-full max-w-4xl bg-white border-2 border-black rounded-[2px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] font-sans animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Title Strip matching WF-10 */}
        <div className="px-4 py-2.5 border-b border-black bg-white flex items-center justify-between text-xs">
          <span className="font-extrabold text-base tracking-tight text-black">
            Global Command Search
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-700">
            CTRL / CMD + K
          </span>
        </div>

        {/* Top Search Input Bar */}
        <div className="relative border-b border-black bg-white p-3.5 sm:p-4 flex items-center gap-3">
          <Search className="w-5 h-5 text-black/60 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search across tenants, schemas, provisioning requests, and audit logs..."
            className="w-full text-base sm:text-lg text-black placeholder-black/40 focus:outline-none bg-transparent font-sans font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1 rounded-[2px] hover:bg-zinc-100 text-black/50 hover:text-black cursor-pointer transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-black/10">
            <kbd className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-zinc-100 text-black/70 border border-black/15 rounded-[2px]">
              ESC
            </kbd>
          </div>
        </div>

        {/* Category Filters Bar & Root CSS Density Control */}
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-zinc-50 border-b border-black/10 overflow-x-auto text-xs no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Results', count: searchResults.length },
              { id: 'tenants', label: 'Tenants', icon: <Building2 className="w-3.5 h-3.5" /> },
              { id: 'schemas', label: 'Schemas', icon: <Database className="w-3.5 h-3.5" /> },
              { id: 'provisioning', label: 'Provisioning', icon: <Radio className="w-3.5 h-3.5" /> },
              { id: 'audit_logs', label: 'Audit Logs', icon: <History className="w-3.5 h-3.5" /> },
              { id: 'actions', label: 'Commands', icon: <Command className="w-3.5 h-3.5" /> }
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id as CommandCategory);
                    setSelectedIndex(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-[2px] cursor-pointer transition-all duration-200 font-medium text-xs whitespace-nowrap ${
                    isActive
                      ? 'bg-black text-white font-semibold'
                      : 'bg-white text-black/70 hover:text-black hover:bg-zinc-100 border border-black/15'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Root CSS Density Mode Controller across all 11 Portals */}
          {onSetDensityMode && (
            <div className="flex items-center gap-1 bg-white border border-black/15 px-2 py-0.5 rounded-[2px] shrink-0">
              <span className="text-[10px] font-mono text-black/50 uppercase font-bold tracking-wider mr-1">
                DENSITY:
              </span>
              {(['compact', 'standard', 'spacious'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    onSetDensityMode(mode);
                    showToast(`Layout density set to ${mode.toUpperCase()}`);
                  }}
                  className={`px-2 py-0.5 rounded-[2px] text-[11px] font-mono transition-all cursor-pointer font-medium ${
                    densityMode === mode
                      ? 'bg-black text-white font-bold shadow-xs'
                      : 'text-black/60 hover:text-black hover:bg-zinc-100'
                  }`}
                  title={`Switch to ${mode} density mode across all 11 portals`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Middle: Split Results + Live Detail Inspector */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-[360px] max-h-[500px] overflow-hidden">
          {/* Left Column: Search Results List (7 cols) */}
          <div
            ref={listRef}
            className="md:col-span-7 border-r border-black/15 overflow-y-auto divide-y divide-black/10 bg-white"
          >
            {searchResults.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
                <AlertCircle className="w-8 h-8 text-black/30" />
                <div className="text-sm font-semibold text-black uppercase tracking-wider">No matching records</div>
                <p className="text-xs text-black/60 max-w-xs leading-relaxed">
                  No tenants, schemas, provisioning requests, or audit logs matched your query &ldquo;{query}&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-2 text-xs font-mono underline text-black hover:opacity-75 cursor-pointer"
                >
                  Reset filters & view all items
                </button>
              </div>
            ) : (
              searchResults.map((result, idx) => {
                const isSelected = idx === selectedIndex;
                const isCurrentActiveTenant =
                  result.category === 'tenants' &&
                  (result.item as TenantAccount).id === currentTenantId;

                return (
                  <div
                    key={result.id}
                    onClick={() => {
                      setSelectedIndex(idx);
                      handleExecute(result);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-3 sm:p-3.5 flex items-start justify-between gap-3 cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'bg-white text-black hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div
                        className={`p-2 rounded-[2px] shrink-0 mt-0.5 border ${
                          isSelected
                            ? 'bg-zinc-900 border-white/20 text-white'
                            : 'bg-zinc-100 border-black/15 text-black'
                        }`}
                      >
                        {result.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-sm truncate ${
                              isSelected ? 'text-white' : 'text-black'
                            }`}
                          >
                            {result.title}
                          </span>
                          {isCurrentActiveTenant && (
                            <span
                              className={`px-1.5 py-0.2 text-[10px] font-mono uppercase tracking-wider font-bold rounded-[2px] border ${
                                isSelected
                                  ? 'bg-white text-black border-white'
                                  : 'bg-black text-white border-black'
                              }`}
                            >
                              Active Workspace
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 truncate ${
                            isSelected ? 'text-white/80' : 'text-black/60'
                          }`}
                        >
                          {result.subtitle}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          {result.badges.map((b, bIdx) => (
                            <span
                              key={bIdx}
                              className={`px-2 py-0.5 rounded-[2px] text-[10px] font-mono uppercase tracking-wider font-medium border ${
                                isSelected
                                  ? 'bg-zinc-800 text-white/90 border-white/20'
                                  : 'bg-zinc-100 text-black/80 border-black/10'
                              }`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 mt-1">
                      <kbd
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] border ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'bg-zinc-100 text-black/50 border-black/15'
                        }`}
                      >
                        ↵
                      </kbd>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Live Architectural Inspector (5 cols) */}
          <div className="hidden md:flex md:col-span-5 bg-zinc-50 flex-col p-4 overflow-y-auto space-y-4">
            {selectedItem ? (
              <>
                <div className="flex items-center justify-between border-b border-black/10 pb-2.5">
                  <span className="text-[11px] uppercase font-bold tracking-[0.16em] text-black/60 font-sans flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Metadata Inspector</span>
                  </span>
                  <span className="text-[10px] font-mono text-black/50 uppercase">
                    {selectedItem.category}
                  </span>
                </div>

                {/* TENANT DETAIL VIEW */}
                {selectedItem.category === 'tenants' && (() => {
                  const t = selectedItem.item as TenantAccount;
                  const isActive = t.id === currentTenantId;

                  return (
                    <div className="space-y-3.5 text-xs">
                      <div>
                        <div className="text-sm font-bold text-black flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-black" />
                          <span>{t.name}</span>
                        </div>
                        <div className="text-black/60 text-xs mt-0.5">{t.domain} · {t.industry}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                        <div className="p-2 bg-white border border-black/15 rounded-[2px]">
                          <div className="text-[10px] text-black/50 uppercase">Isolation Mode</div>
                          <div className="font-semibold text-black mt-0.5">
                            {t.dataIsolationMode === 'dedicated_keyspace' ? 'Dedicated Keyspace' : 'Logical Schema'}
                          </div>
                        </div>
                        <div className="p-2 bg-white border border-black/15 rounded-[2px]">
                          <div className="text-[10px] text-black/50 uppercase">PoP / Region</div>
                          <div className="font-semibold text-black mt-0.5 truncate">{t.region}</div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] space-y-1 font-mono">
                        <div className="flex items-center justify-between text-[10px] text-black/50 uppercase">
                          <span className="flex items-center gap-1">
                            <Key className="w-3 h-3" />
                            <span>KMS Key Alias</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(t.encryptionKeyAlias, 'KMS Alias')}
                            className="hover:text-black cursor-pointer"
                            title="Copy Key Alias"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-black font-semibold truncate">
                          {t.encryptionKeyAlias}
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] space-y-1 font-mono">
                        <div className="flex items-center justify-between text-[10px] text-black/50 uppercase">
                          <span className="flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Live API Key</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(t.apiKey, 'API Key')}
                            className="hover:text-black cursor-pointer"
                            title="Copy API Key"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-black truncate">
                          {t.apiKey}
                        </div>
                      </div>

                      <div className="space-y-1 pt-1 font-mono text-black/80">
                        <div className="flex justify-between">
                          <span className="text-black/50">Storage Used:</span>
                          <span className="font-semibold text-black">{t.usage.dataverseStorageMb} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/50">Dataverse Records:</span>
                          <span className="font-semibold text-black">{t.usage.dataverseRecordsTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/50">Active DIDs:</span>
                          <span className="font-semibold text-black">{t.usage.activeDids} numbers</span>
                        </div>
                      </div>

                      <Button
                        variant={isActive ? 'secondary' : 'primary'}
                        size="sm"
                        onClick={() => handleExecute(selectedItem)}
                        className="w-full mt-2"
                        icon={<CornerDownLeft className="w-3.5 h-3.5" />}
                      >
                        {isActive ? 'Keep Active Workspace' : `Switch to ${t.name}`}
                      </Button>
                    </div>
                  );
                })()}

                {/* SCHEMA DETAIL VIEW */}
                {selectedItem.category === 'schemas' && (() => {
                  const s = selectedItem.item as DataverseEntitySchema;

                  return (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-sm font-bold text-black flex items-center gap-2">
                          <Database className="w-4 h-4 text-black" />
                          <span>{s.displayName}</span>
                        </div>
                        <div className="text-black/60 font-mono text-[11px] mt-0.5">{s.name} · v{s.version}</div>
                      </div>

                      <p className="text-xs text-black/75 leading-relaxed bg-white p-2.5 border border-black/15 rounded-[2px]">
                        {s.description}
                      </p>

                      <div className="space-y-1 font-mono">
                        <div className="text-[10px] text-black/50 uppercase font-sans font-bold">Fields Breakdown ({s.fields.length})</div>
                        <div className="bg-white border border-black/15 rounded-[2px] divide-y divide-black/10 max-h-40 overflow-y-auto">
                          {s.fields.map((f, fIdx) => (
                            <div key={fIdx} className="p-1.5 flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-black truncate">{f.name}</span>
                              <span className="text-black/60 uppercase text-[10px] px-1 py-0.2 bg-zinc-100 rounded-[2px] border border-black/5">
                                {f.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleExecute(selectedItem)}
                        className="w-full mt-2"
                        icon={<Database className="w-3.5 h-3.5" />}
                      >
                        Open in Schema Designer
                      </Button>
                    </div>
                  );
                })()}

                {/* PROVISIONING DETAIL VIEW */}
                {selectedItem.category === 'provisioning' && (() => {
                  const p = selectedItem.item as ExtraProvisioningItem;

                  return (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-sm font-bold text-black flex items-center gap-2">
                          <Radio className="w-4 h-4 text-black" />
                          <span>{p.title}</span>
                        </div>
                        <div className="text-black/60 font-mono text-[11px] mt-0.5">{p.subtitle}</div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] space-y-2 font-mono">
                        <div className="flex justify-between items-center">
                          <span className="text-black/50">Status:</span>
                          <span className="font-bold text-black uppercase">{p.status}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black/50">SLA Target:</span>
                          <span className="text-black font-semibold">{p.slaTarget || '24h Standard'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black/50">Carrier / Gate:</span>
                          <span className="text-black">{p.carrier || 'Mandela Core'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-black/50">Timestamp:</span>
                          <span className="text-black/70">{p.timestamp}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] text-xs text-black/80 font-sans">
                        <div className="text-[10px] uppercase font-bold text-black/50 font-sans mb-1">Provisioning Log</div>
                        {p.details}
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleExecute(selectedItem)}
                        className="w-full mt-2"
                        icon={<CornerDownLeft className="w-3.5 h-3.5" />}
                      >
                        Inspect Full Lifecycle
                      </Button>
                    </div>
                  );
                })()}

                {/* AUDIT LOG DETAIL VIEW */}
                {selectedItem.category === 'audit_logs' && (() => {
                  const a = selectedItem.item as ExtraAuditLogItem;

                  return (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-sm font-bold text-black flex items-center gap-2">
                          <History className="w-4 h-4 text-black" />
                          <span>{a.action}</span>
                        </div>
                        <div className="text-black/60 font-mono text-[11px] mt-0.5">{a.target}</div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] space-y-1.5 font-mono">
                        <div className="flex justify-between">
                          <span className="text-black/50">Timestamp:</span>
                          <span className="text-black">{a.timestamp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-black/50">Actor:</span>
                          <span className="text-black font-semibold">{a.actor}</span>
                        </div>
                        {a.ipAddress && (
                          <div className="flex justify-between">
                            <span className="text-black/50">IP Address:</span>
                            <span className="text-black">{a.ipAddress}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-black/50">Source:</span>
                          <span className="text-black uppercase">{a.source}</span>
                        </div>
                      </div>

                      {/* Cryptographic SHA-256 verification hash */}
                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-[10px] text-black/50 uppercase">
                          <span className="flex items-center gap-1 font-bold text-black">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>SHA-256 Tamper Proof</span>
                          </span>
                          <button
                            onClick={() => copyToClipboard(a.integrityHash, 'SHA-256 Integrity Hash')}
                            className="hover:text-black cursor-pointer flex items-center gap-1 text-[10px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        </div>
                        <div className="text-[11px] break-all bg-zinc-50 p-1.5 rounded-[2px] border border-black/5 text-black">
                          {a.integrityHash}
                        </div>
                      </div>

                      <div className="p-2.5 bg-white border border-black/15 rounded-[2px] text-xs text-black/80 font-sans">
                        <div className="text-[10px] uppercase font-bold text-black/50 font-sans mb-1">Payload Audit Trail</div>
                        {a.details}
                      </div>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(a.integrityHash, 'SHA-256 Hash')}
                        className="w-full mt-2"
                        icon={<Copy className="w-3.5 h-3.5" />}
                      >
                        Copy Cryptographic Hash
                      </Button>
                    </div>
                  );
                })()}

                {/* COMMAND ACTION DETAIL VIEW */}
                {selectedItem.category === 'actions' && (() => {
                  const act = selectedItem.item as (typeof systemActions)[0];

                  return (
                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="text-sm font-bold text-black flex items-center gap-2">
                          <Command className="w-4 h-4 text-black" />
                          <span>{act.title}</span>
                        </div>
                        <div className="text-black/60 text-xs mt-1 leading-relaxed">{act.subtitle}</div>
                      </div>

                      <div className="p-3 bg-white border border-black/15 rounded-[2px] space-y-2 text-xs font-sans text-black/70">
                        <p>
                          Execute this operational command to switch portal views, launch modals, or adjust system accessibility scales.
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleExecute(selectedItem)}
                        className="w-full mt-2"
                        icon={<CornerDownLeft className="w-3.5 h-3.5" />}
                      >
                        Execute Command
                      </Button>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-black/40 text-xs font-sans">
                <Sliders className="w-8 h-8 mb-2 opacity-30" />
                <span>Select an item to view metadata & cryptographic proofs</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Status & Shortcut Legend Footer */}
        <div className="px-4 py-2.5 bg-white border-t border-black flex items-center justify-between text-[11px] text-black font-mono uppercase font-bold tracking-wider">
          <div className="flex items-center gap-4 flex-wrap">
            <span>↑ ↓ UP / DOWN TO NAVIGATE</span>
            <span className="text-black/30">|</span>
            <span>ENTER TO OPEN</span>
            <span className="text-black/30">|</span>
            <span>ESC TO CLOSE</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px]">
            <span>MANDELA OS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function CheckCircle2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
