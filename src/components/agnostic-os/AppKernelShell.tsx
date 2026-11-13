import React, { useState, useEffect } from 'react';
import {
  Terminal,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  Building2,
  ShieldCheck,
  Globe,
  Users,
  Key,
  Layers,
  Lock,
  ExternalLink,
  Activity,
  Server,
  Zap,
  Check,
  CheckCircle2,
  Radio,
  CreditCard,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { TenantAccount, PortalMode } from '../../types/multiTenant';
import { OsApplicationManifest, OS_APPLICATIONS_REGISTRY } from '../../config/osAppsRegistry';

export interface KernelBootProfile {
  pid: number;
  subsystemDriver: string;
  memoryFootprint: string;
  ipcSocket: string;
  threads: number;
  bootLogs: { text: string; offsetMs: number; status: 'ok' | 'info' | 'warn' }[];
  subViews: { id: string; label: string; icon?: React.ComponentType<{ className?: string }> }[];
}

export const APP_KERNEL_PROFILES: Record<string, KernelBootProfile> = {
  pan_africa_numbers: {
    pid: 3892,
    subsystemDriver: 'driver_itu_nnp_v54.ko',
    memoryFootprint: '46.4 MB (RSS) · 128 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-africa-numbers.sock',
    threads: 8,
    bootLogs: [
      { text: '[kinit] Allocating ringbuffer for 54 African country ITU rules...', offsetMs: 30, status: 'ok' },
      { text: '[aggregator] Mounting DIDWW, Twilio, and DIDLogic wholesale connectors...', offsetMs: 120, status: 'ok' },
      { text: '[mno] Direct Sovereign MNO SS7/SIGTRAN links verified (Safaricom, MTN, Vodacom)...', offsetMs: 250, status: 'ok' },
      { text: '[cache] Redis 15-minute temporary reservation lock engine armed...', offsetMs: 380, status: 'ok' },
      { text: '[regulatory] ITU-T E.164 dial plan & KYC compliance engine verified...', offsetMs: 510, status: 'ok' },
      { text: '[kernel] Pan-African Number Inventory Subsystem ready. Handing off to UI viewport.', offsetMs: 650, status: 'ok' }
    ],
    subViews: [
      { id: 'product_landing', label: '⭐ Product Overview' },
      { id: 'all_inventory', label: '54 ITU Registries & Stock' },
      { id: 'reservations', label: '15-Min Reservation Locks' },
      { id: 'aggregators', label: 'Wholesale Aggregators' },
      { id: 'forecasting', label: 'Replenishment Forecast' }
    ]
  },
  command_control: {
    pid: 1042,
    subsystemDriver: 'mod_freeswitch_esl.ko',
    memoryFootprint: '84.2 MB (RSS) · 256 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-c2-noc.sock',
    threads: 32,
    bootLogs: [
      { text: '[kinit] Binding FreeSWITCH ESL socket on 127.0.0.1:8021...', offsetMs: 40, status: 'ok' },
      { text: '[rtpengine] Kernel NAT packet forwarding plane active (Lagos, Nairobi, JNB)...', offsetMs: 140, status: 'ok' },
      { text: '[telecom] Kamailio 5.7 SIP RFC 3261 signaling proxy synchronized...', offsetMs: 280, status: 'ok' },
      { text: '[speech] System 7 Neural Speech pipeline online (50 African languages)...', offsetMs: 410, status: 'ok' },
      { text: '[c2] FreeSWITCH Media Engine initialized @ 1,000 CPS per node.', offsetMs: 580, status: 'ok' }
    ],
    subViews: [
      { id: 'live_sessions', label: 'Live SIP Sessions (C2)' },
      { id: 'media_bridges', label: 'FreeSWITCH Audio Bridges' },
      { id: 'mos_asr', label: 'MOS Scores & Neural ASR' },
      { id: 'pop_nodes', label: 'Anycast Edge Nodes' }
    ]
  },
  agent_builder: {
    pid: 2104,
    subsystemDriver: 'engine_gemini_voice_mesh.ko',
    memoryFootprint: '62.1 MB (RSS) · 180 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-agent-studio.sock',
    threads: 16,
    bootLogs: [
      { text: '[kinit] Initializing @google/genai Gemini 3.8 Flash SDK gateway...', offsetMs: 40, status: 'ok' },
      { text: '[speech] Mounting neural streaming acoustic models for 50 African languages...', offsetMs: 160, status: 'ok' },
      { text: '[ncco] VoiceXML 2.1 / NCCO grammar compiler verified...', offsetMs: 290, status: 'ok' },
      { text: '[guardrail] Human-in-the-loop review pipeline & PII redaction active...', offsetMs: 420, status: 'ok' },
      { text: '[kernel] AI Agent Creation Studio sandbox ready.', offsetMs: 600, status: 'ok' }
    ],
    subViews: [
      { id: 'prompt_studio', label: 'Natural Language Studio' },
      { id: 'models_gateway', label: 'Model Gateway & Tokens' },
      { id: 'biometrics', label: 'Voice Biometrics & Safety' },
      { id: 'sim_testbed', label: 'Dry-Run Simulator' }
    ]
  },
  workflow_builder: {
    pid: 3312,
    subsystemDriver: 'engine_n8n_telecom_dag.ko',
    memoryFootprint: '48.6 MB (RSS) · 128 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-n8n-workflow.sock',
    threads: 16,
    bootLogs: [
      { text: '[kinit] Initializing n8n telecom visual DAG engine with reactive event bus...', offsetMs: 30, status: 'ok' },
      { text: '[dag] Mounted 30+ African infrastructure connectors (FreeSWITCH, Gemini 3.8, M-Pesa)...', offsetMs: 140, status: 'ok' },
      { text: '[ncco] Live bidirectional compiler active (n8n JSON <-> VoiceXML 2.1 <-> NCCO)...', offsetMs: 280, status: 'ok' },
      { text: '[kernel] n8n Workflow Automation Canvas ready on socket /run/mandela/ipc-n8n-workflow.sock.', offsetMs: 500, status: 'ok' }
    ],
    subViews: [
      { id: 'canvas', label: 'Interactive n8n Canvas' },
      { id: 'node_catalog', label: 'Node Library (30+ Connectors)' },
      { id: 'executions', label: 'Execution Runs & Logs' },
      { id: 'ncco_export', label: 'n8n & NCCO JSON Spec' }
    ]
  },
  providers: {
    pid: 4510,
    subsystemDriver: 'driver_carrier_adapters.ko',
    memoryFootprint: '41.2 MB (RSS) · 112 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-provider-registry.sock',
    threads: 12,
    bootLogs: [
      { text: '[kinit] Scanning vendor-agnostic telecommunications adapters...', offsetMs: 40, status: 'ok' },
      { text: '[sip_probe] Probing SIP OPTIONS ping to Kamailio & Twilio endpoints...', offsetMs: 180, status: 'ok' },
      { text: '[speech_probe] Testing gRPC latency to System 7 Neural Speech cluster...', offsetMs: 310, status: 'ok' },
      { text: '[vault] Sovereign credential vault unlocked (AES-256-GCM)...', offsetMs: 440, status: 'ok' },
      { text: '[kernel] Provider Registry active with 100% adapter health.', offsetMs: 620, status: 'ok' }
    ],
    subViews: [
      { id: 'carrier_mesh', label: 'Telephony & SIP Carriers' },
      { id: 'speech_engines', label: 'Neural Speech (ASR/TTS)' },
      { id: 'ai_gateways', label: 'AI Model Gateways' },
      { id: 'latency_probes', label: 'Live Probing & Latency' }
    ]
  },
  recordings: {
    pid: 5201,
    subsystemDriver: 'vfs_lakehouse_cdr.ko',
    memoryFootprint: '52.8 MB (RSS) · 140 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-recordings.sock',
    threads: 10,
    bootLogs: [
      { text: '[kinit] Mounting /var/recordings encrypted S3 lakehouse stream...', offsetMs: 40, status: 'ok' },
      { text: '[dsp] 16kHz Opus / AMR-WB audio decoder pipeline loaded...', offsetMs: 160, status: 'ok' },
      { text: '[diarization] Multi-speaker diarization and PII mask engine verified...', offsetMs: 320, status: 'ok' },
      { text: '[kernel] Audio recordings & searchable transcripts workspace ready.', offsetMs: 540, status: 'ok' }
    ],
    subViews: [
      { id: 'recordings_list', label: 'Audio Recordings & Waveforms' },
      { id: 'transcripts', label: 'Diarized Transcripts' },
      { id: 'pcap_traces', label: 'SIP/RTP Packet PCAPs' },
      { id: 'compliance', label: 'PII Redaction Audit' }
    ]
  },
  dev_console: {
    pid: 6100,
    subsystemDriver: 'api_mandela_v1.ko',
    memoryFootprint: '34.5 MB (RSS) · 88 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-dev-console.sock',
    threads: 6,
    bootLogs: [
      { text: '[kinit] Loading OpenAPI 3.1 schema definition for /api/v1...', offsetMs: 30, status: 'ok' },
      { text: '[hmac] Initializing HMAC-SHA256 signature generator for webhooks...', offsetMs: 150, status: 'ok' },
      { text: '[kernel] Developer Console and API explorer ready.', offsetMs: 450, status: 'ok' }
    ],
    subViews: [
      { id: 'openapi_ref', label: 'OpenAPI 3.1 Spec' },
      { id: 'webhook_tester', label: 'Webhook Event Tester' },
      { id: 'sdk_snippets', label: 'SDK Snippets (cURL, TS, Py)' },
      { id: 'hmac_vault', label: 'API Keys & Secrets' }
    ]
  },
  terminal: {
    pid: 1000,
    subsystemDriver: 'tty_pty_master.ko',
    memoryFootprint: '22.0 MB (RSS) · 64 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-msh-pts0.sock',
    threads: 4,
    bootLogs: [
      { text: '[kinit] Spawning /bin/msh (Mandela Shell v2.4 LTS) on /dev/pts/0...', offsetMs: 20, status: 'ok' },
      { text: '[env] Exporting TENANT_ID, FREESWITCH_ESL, KAMAILIO_SOCKET...', offsetMs: 90, status: 'ok' },
      { text: '[kernel] Telecommunication root CLI interactive session active.', offsetMs: 250, status: 'ok' }
    ],
    subViews: [
      { id: 'interactive_shell', label: 'Interactive Shell (pts/0)' },
      { id: 'cli_manual', label: 'Command Reference (man)' },
      { id: 'session_buffer', label: 'Buffer History' }
    ]
  },
  task_manager: {
    pid: 80,
    subsystemDriver: 'cgroups_v2_monitor.ko',
    memoryFootprint: '18.4 MB (RSS) · 48 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-taskmgr.sock',
    threads: 4,
    bootLogs: [
      { text: '[kinit] Attaching to Linux kernel 6.8 /proc and cgroups v2...', offsetMs: 25, status: 'ok' },
      { text: '[threads] Polling FreeSWITCH 1,000 CPS audio worker thread pools...', offsetMs: 110, status: 'ok' },
      { text: '[kernel] System Task & Resource Manager active.', offsetMs: 300, status: 'ok' }
    ],
    subViews: [
      { id: 'process_tree', label: 'Processes & Thread Pools' },
      { id: 'cpu_memory', label: 'CPU & RAM Cgroups' },
      { id: 'socket_io', label: 'SIP & RTP Sockets' }
    ]
  },
  file_explorer: {
    pid: 1420,
    subsystemDriver: 'vfs_sovereign_posix.ko',
    memoryFootprint: '26.8 MB (RSS) · 72 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-vfs-explorer.sock',
    threads: 6,
    bootLogs: [
      { text: '[kinit] Mounting /etc/mandela, /var/log/cdr, /var/recordings VFS...', offsetMs: 30, status: 'ok' },
      { text: '[parquet] Initializing Apache Parquet CDR columnar reader...', offsetMs: 130, status: 'ok' },
      { text: '[kernel] Sovereign Storage Explorer ready.', offsetMs: 350, status: 'ok' }
    ],
    subViews: [
      { id: 'vfs_tree', label: 'VFS Directory Tree' },
      { id: 'config_files', label: 'Config Files (/etc)' },
      { id: 'cdr_storage', label: 'CDR Parquet Storage' },
      { id: 'pcap_dumps', label: 'PCAP Packet Dumps' }
    ]
  },
  architecture: {
    pid: 9000,
    subsystemDriver: 'spec_telecom_mesh.ko',
    memoryFootprint: '16.0 MB (RSS) · 40 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-blueprint.sock',
    threads: 2,
    bootLogs: [
      { text: '[kinit] Loading end-to-end signaling & media architecture diagram...', offsetMs: 30, status: 'ok' },
      { text: '[kernel] Architecture Blueprint specification loaded.', offsetMs: 180, status: 'ok' }
    ],
    subViews: [
      { id: 'diagram', label: 'System Architecture Blueprint' },
      { id: 'spec_notes', label: 'Signaling & Media Specs' }
    ]
  },
  multi_ai_gateway: {
    pid: 4108,
    subsystemDriver: 'driver_multi_ai_mesh.ko',
    memoryFootprint: '58.2 MB (RSS) · 160 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-multi-ai-gateway.sock',
    threads: 16,
    bootLogs: [
      { text: '[kinit] Initializing Multi-AI intelligent provider router...', offsetMs: 25, status: 'ok' },
      { text: '[adapters] Mounting OpenAI, Anthropic Claude, Gemini 2.5, Mistral, Ollama...', offsetMs: 95, status: 'ok' },
      { text: '[residency] Enforcing data residency & sovereign African privacy rules...', offsetMs: 180, status: 'ok' },
      { text: '[failover] Dynamic latency & error-rate failover policy active...', offsetMs: 270, status: 'ok' },
      { text: '[kernel] Multi-AI Provider Gateway operational.', offsetMs: 380, status: 'ok' }
    ],
    subViews: [
      { id: 'ai_router', label: 'Multi-AI Model Registry & Router' },
      { id: 'inference_sandbox', label: 'Live Inference Tester' },
      { id: 'cost_latency', label: 'Cost & Latency Benchmarks' }
    ]
  },
  mcp_gateway: {
    pid: 5210,
    subsystemDriver: 'mod_mcp_streamable_rpc.ko',
    memoryFootprint: '42.6 MB (RSS) · 112 MB (VIRT)',
    ipcSocket: '/run/mandela/ipc-mcp-protocol.sock',
    threads: 12,
    bootLogs: [
      { text: '[kinit] Binding Model Context Protocol Streamable HTTP & stdio transports...', offsetMs: 30, status: 'ok' },
      { text: '[discovery] Advertising 5 telecom tools (E.164 lookup, LCR, SMPP, eSIM, Dataverse)...', offsetMs: 120, status: 'ok' },
      { text: '[security] Enforcing cryptographic execution audit logging...', offsetMs: 210, status: 'ok' },
      { text: '[kernel] MCP Architecture Gateway ready for AI agent tool invocations.', offsetMs: 320, status: 'ok' }
    ],
    subViews: [
      { id: 'mcp_tools', label: 'Advertised MCP Tools' },
      { id: 'tool_sandbox', label: 'Interactive RPC Invocation' },
      { id: 'audit_logs', label: 'Cryptographic Audit Trail' }
    ]
  }
};

export type TenantRolePositionId =
  | 'super_admin'
  | 'kyc_compliance'
  | 'noc_engineer'
  | 'billing_treasury'
  | 'api_developer';

export interface TenantRolePosition {
  id: TenantRolePositionId;
  title: string;
  shortTitle: string;
  badge: string;
  roleScope: string;
  description: string;
  permissions: string[];
  recommendedPortals: {
    label: string;
    subtext: string;
    targetMode?: PortalMode;
    targetAppId?: string;
    badge: string;
  }[];
}

export const ROLE_POSITIONS: TenantRolePosition[] = [
  {
    id: 'super_admin',
    title: 'Super Admin (Telecom Operator)',
    shortTitle: 'Super Admin',
    badge: 'ROOT · TIER 0',
    roleScope: 'Full Sovereign Authority',
    description: 'Unrestricted provisioning of 54 African country DIDs, SS7/SIGTRAN carrier routing, and multi-tenant quotas.',
    permissions: ['ALL_STOCK_RW', 'PROVISION_SS7', 'LCR_ROUTING', 'TENANT_QUOTAS'],
    recommendedPortals: [
      { label: 'Pan-Africa Number Inventory', subtext: 'Stock allocation & DID reservation', targetAppId: 'pan_africa_numbers', badge: 'Active' },
      { label: 'FreeSWITCH C2 & SIP Nodes', subtext: '1,000 CPS Anycast Media Bridges', targetAppId: 'command_control', badge: 'Core' },
      { label: 'Carrier Interconnect (LCR)', subtext: 'Rate decks & margin analysis', targetMode: 'enterprise_suite', badge: 'Telco' },
      { label: 'Customer Self-Service Portal', subtext: 'Tenant view & wallet ledger', targetMode: 'customer_portal', badge: 'Billing' }
    ]
  },
  {
    id: 'kyc_compliance',
    title: 'Regulatory & KYC Officer',
    shortTitle: 'KYC Officer',
    badge: 'ITU-T · COMPLY',
    roleScope: 'Sovereign Compliance & Audits',
    description: 'National numbering plan enforcement, KYC tier 1-3 document approval, and quarantine hold management.',
    permissions: ['ITU_NNP_AUDIT', 'KYC_TIER_APPROVE', 'QUARANTINE_OVERRIDE'],
    recommendedPortals: [
      { label: '54 ITU Dialing Registries', subtext: 'Official ITU-T formatting & rules', targetAppId: 'pan_africa_numbers', badge: 'ITU' },
      { label: 'Customer Verification Desk', subtext: 'ID, Tax PIN & Carrier Licenses', targetMode: 'customer_portal', badge: 'KYC' },
      { label: 'Regulatory Audit Trail', subtext: 'Immutable compliance ledger', targetMode: 'enterprise_suite', badge: 'Audit' }
    ]
  },
  {
    id: 'noc_engineer',
    title: 'NOC Infrastructure Engineer',
    shortTitle: 'NOC Lead',
    badge: 'NOC · 1000 CPS',
    roleScope: 'Signaling & Media Mesh',
    description: 'Real-time carrier health, Redis temporary lock latency, SIP OPTIONS probing, and edge scrubbers.',
    permissions: ['SIP_OPTIONS_PING', 'RTPENGINE_NAT', 'CARRIER_PROBE', 'REDIS_LOCKS'],
    recommendedPortals: [
      { label: 'Wholesale Aggregators & Stock', subtext: 'DIDWW, Twilio, DIDLogic, MNOs', targetAppId: 'pan_africa_numbers', badge: 'Trunks' },
      { label: 'FreeSWITCH NOC Dashboard', subtext: 'Live SIP sessions & MOS telemetry', targetAppId: 'command_control', badge: 'Live' },
      { label: 'Edge Defense & Signaling Guard', subtext: 'SIP DDoS & SS7 attack isolation', targetMode: 'enterprise_suite', badge: 'SecOps' }
    ]
  },
  {
    id: 'billing_treasury',
    title: 'FinTech Treasury & Billing Lead',
    shortTitle: 'Treasury Lead',
    badge: 'TREASURY · FX',
    roleScope: 'Capital & Tariff Settlement',
    description: 'Multi-currency wallets (USD, KES, NGN, ZAR), rental tariffs, replenishment forecasting, and top-ups.',
    permissions: ['WALLET_TOPUP', 'TARIFF_CALC', 'REPLENISH_FORECAST', 'SETTLEMENT_NGN_KES'],
    recommendedPortals: [
      { label: 'Replenishment Forecast & Pricing', subtext: 'Stockout runout AI predictions', targetAppId: 'pan_africa_numbers', badge: 'Forecasting' },
      { label: 'Customer Invoices & Quotas', subtext: 'Prepaid balance & billing drafts', targetMode: 'customer_portal', badge: 'Invoices' },
      { label: 'MANDELA Dataverse Billing', subtext: 'Financial record explorer', targetMode: 'enterprise_suite', badge: 'Ledger' }
    ]
  },
  {
    id: 'api_developer',
    title: 'Developer & System Integrator',
    shortTitle: 'API Dev',
    badge: 'OPENAPI · 3.1',
    roleScope: 'Programmable Communications',
    description: 'OpenAPI 3.1 schema exploration, webhook event testing, HMAC keys, and SDK code generation.',
    permissions: ['WEBHOOK_DISPATCH', 'HMAC_KEYS', 'OPENAPI_SPEC', 'SDK_CONSUME'],
    recommendedPortals: [
      { label: 'Developer Console & OpenAPI', subtext: '/api/v1 endpoints & live testbed', targetAppId: 'dev_console', badge: 'REST' },
      { label: 'Telecom Shell Terminal (msh)', subtext: 'Root CLI interactive session', targetAppId: 'terminal', badge: 'CLI' },
      { label: 'API Keys & Webhooks Desk', subtext: 'HMAC signature configuration', targetMode: 'customer_portal', badge: 'Webhooks' }
    ]
  }
];

interface AppKernelShellProps {
  appId: string;
  appName: string;
  strategicFunction: string;
  currentTenant: TenantAccount;
  children: React.ReactNode;
  onClose?: () => void;
  onMaximize?: () => void;
  onSwitchPortalMode?: (mode: PortalMode) => void;
  onOpenTenantModal?: () => void;
  onOpenOnboarding?: () => void;
  onOpenApp?: (appId: string) => void;
}

export const AppKernelShell: React.FC<AppKernelShellProps> = ({
  appId,
  appName,
  currentTenant,
  children,
  onClose,
  onSwitchPortalMode,
  onOpenTenantModal,
  onOpenOnboarding,
  onOpenApp
}) => {
  const profile = APP_KERNEL_PROFILES[appId] || {
    pid: 2000,
    subsystemDriver: 'driver_generic.ko',
    memoryFootprint: '32.0 MB (RSS)',
    ipcSocket: `/run/mandela/ipc-${appId}.sock`,
    threads: 4,
    bootLogs: [
      { text: `[kinit] Initializing subsystem driver for ${appName}...`, offsetMs: 40, status: 'ok' },
      { text: '[kernel] Subsystem verified and online.', offsetMs: 250, status: 'ok' }
    ],
    subViews: [{ id: 'main', label: 'Main Workspace' }]
  };

  const appManifest = OS_APPLICATIONS_REGISTRY.find((a) => a.appId === appId);

  // Kernel Boot Lifecycle: 'booting' -> 'running' (with warm reload option)
  const [bootState, setBootState] = useState<'booting' | 'running'>('booting');
  const [visibleLogs, setVisibleLogs] = useState<{ text: string; status: string; ts: string }[]>([]);
  const [bootProgress, setBootProgress] = useState(0);
  const [activeSubView, setActiveSubView] = useState<string>(profile.subViews[0]?.id || 'main');
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<TenantRolePositionId>('super_admin');
  const [showPositionSelector, setShowPositionSelector] = useState(false);

  const activePosition = ROLE_POSITIONS.find((p) => p.id === selectedPositionId) || ROLE_POSITIONS[0];

  // Active Menu Dropdown ('file' | 'edit' | 'view' | 'subsystem' | 'kernel' | 'help' | null)
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Execute authentic boot sequence
  useEffect(() => {
    let isCancelled = false;
    setVisibleLogs([]);
    setBootProgress(0);
    setBootState('booting');

    const totalDuration = profile.bootLogs[profile.bootLogs.length - 1]?.offsetMs || 500;
    const progressInterval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 98) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 12;
      });
    }, 45);

    profile.bootLogs.forEach((log) => {
      setTimeout(() => {
        if (!isCancelled) {
          const ts = (log.offsetMs / 1000).toFixed(3);
          setVisibleLogs((prev) => [
            ...prev,
            { text: log.text, status: log.status, ts: `+${ts}s` }
          ]);
        }
      }, log.offsetMs);
    });

    const completionTimer = setTimeout(() => {
      if (!isCancelled) {
        setBootProgress(100);
        setBootState('running');
      }
    }, totalDuration + 150);

    return () => {
      isCancelled = true;
      clearInterval(progressInterval);
      clearTimeout(completionTimer);
    };
  }, [appId]);

  const handleSkipBoot = () => {
    setBootProgress(100);
    setBootState('running');
  };

  const handleRebootKernel = () => {
    setActiveMenu(null);
    setBootState('booting');
    setVisibleLogs([]);
    setBootProgress(0);

    const totalDuration = profile.bootLogs[profile.bootLogs.length - 1]?.offsetMs || 500;
    profile.bootLogs.forEach((log) => {
      setTimeout(() => {
        const ts = (log.offsetMs / 1000).toFixed(3);
        setVisibleLogs((prev) => [
          ...prev,
          { text: log.text, status: log.status, ts: `+${ts}s` }
        ]);
      }, log.offsetMs);
    });

    setTimeout(() => {
      setBootProgress(100);
      setBootState('running');
      setStatusMessage('Kernel subsystem rebooted successfully.');
      setTimeout(() => setStatusMessage(null), 3000);
    }, totalDuration + 100);
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setStatusMessage('Subsystem synchronized with active microservices.');
      setTimeout(() => setStatusMessage(null), 2500);
    }, 500);
  };

  // 1. BOOTING VIEW: Authentic OS Startup Kernel
  if (bootState === 'booting') {
    return (
      <div className="flex flex-col h-full bg-zinc-950 text-zinc-200 font-mono select-none p-5 sm:p-7 relative overflow-hidden">
        {/* Subtle background grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #10b981 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Kernel Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-750 flex items-center justify-center text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm tracking-wide">
                  MANDELA KERNEL v6.8-rt
                </span>
                <span className="text-[11px] text-zinc-500">·</span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  {appName}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400">
                PID: <strong className="text-zinc-200">{profile.pid}</strong>
                <span className="mx-1.5 opacity-40">·</span>
                Driver: <strong className="text-zinc-200">{profile.subsystemDriver}</strong>
                <span className="mx-1.5 opacity-40">·</span>
                Tenant: <strong className="text-emerald-400">{currentTenant.slug}</strong>
              </div>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleSkipBoot}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-emerald-400 border border-zinc-700/80 hover:border-emerald-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Bypass boot animation"
          >
            <span>Skip to Workspace</span>
            <span className="text-[10px] text-zinc-500">↵</span>
          </button>
        </div>

        {/* Startup Progress Bar */}
        <div className="my-4 shrink-0 relative z-10">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              Initializing Subsystem &amp; Microservices ({bootProgress}%)
            </span>
            <span className="text-emerald-400 font-semibold">{profile.memoryFootprint}</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-100 ease-out shadow-sm shadow-emerald-500/50"
              style={{ width: `${bootProgress}%` }}
            />
          </div>
        </div>

        {/* Live Kernel Boot Log Window */}
        <div className="flex-1 bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 overflow-y-auto font-mono text-xs space-y-2 relative z-10 shadow-inner">
          <div className="text-zinc-500 text-[11px] pb-2 border-b border-zinc-800/80 flex items-center justify-between">
            <span>KERNEL SUBSYSTEM BOOT TRACE:</span>
            <span>IPC: {profile.ipcSocket}</span>
          </div>

          {visibleLogs.map((log, index) => (
            <div key={index} className="flex items-start gap-2.5 leading-relaxed">
              <span className="text-zinc-500 text-[11px] shrink-0 font-mono select-none">
                {log.ts}
              </span>
              <span className="text-emerald-400 shrink-0">✔</span>
              <span className="text-zinc-200">{log.text}</span>
            </div>
          ))}

          {bootProgress < 100 && (
            <div className="flex items-center gap-2 pt-1 text-zinc-500 text-xs animate-pulse">
              <span>...</span>
              <span>binding microservices</span>
            </div>
          )}
        </div>

        {/* Microservices Manifest at bottom */}
        {appManifest && appManifest.externalMicroservices.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex flex-wrap items-center gap-x-3 gap-y-1 relative z-10">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
              Microservices:
            </span>
            {appManifest.externalMicroservices.map((svc, idx) => (
              <span key={idx} className="flex items-center gap-1 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {svc}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 2. RUNNING VIEW: Fully Loaded Application with First-Principle Navigation
  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 font-sans select-text">
      {/* 2.1 First-Principle Native Menu Bar */}
      <div className="bg-zinc-900/95 border-b border-zinc-800/80 px-3 py-1 flex items-center justify-between text-xs text-zinc-300 font-sans select-none shrink-0 relative z-30">
        {/* Left: Classic OS Menu Items */}
        <div className="flex items-center gap-1 font-medium">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'file' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div
                className="absolute top-6 left-0 w-48 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl py-1 text-xs text-zinc-200 z-50"
                onClick={() => setActiveMenu(null)}
              >
                <button
                  onClick={handleManualRefresh}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Sync Subsystem</span>
                  <span className="text-[10px] text-zinc-400">⌘R</span>
                </button>
                <button
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute('href', dataStr);
                    downloadAnchor.setAttribute('download', `${appId}-telemetry.json`);
                    downloadAnchor.click();
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                >
                  <span>Export Telemetry</span>
                  <span className="text-[10px] text-zinc-400">JSON</span>
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <button
                  onClick={onClose}
                  className="w-full px-3 py-1.5 text-left hover:bg-red-600 hover:text-white flex items-center justify-between cursor-pointer text-red-400"
                >
                  <span>Close Window</span>
                  <span className="text-[10px] text-zinc-400">⌘W</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'view' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div
                className="absolute top-6 left-0 w-52 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl py-1 text-xs text-zinc-200 z-50"
                onClick={() => setActiveMenu(null)}
              >
                {profile.subViews.map((sv) => (
                  <button
                    key={sv.id}
                    onClick={() => setActiveSubView(sv.id)}
                    className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer"
                  >
                    <span>{sv.label}</span>
                    {activeSubView === sv.id && <span className="text-emerald-400">✔</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Subsystem Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'subsystem' ? null : 'subsystem')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'subsystem' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              Subsystem
            </button>
            {activeMenu === 'subsystem' && (
              <div
                className="absolute top-6 left-0 w-64 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl py-1 text-xs text-zinc-200 z-50"
                onClick={() => setActiveMenu(null)}
              >
                <div className="px-3 py-1 text-[10px] font-mono text-zinc-400 uppercase border-b border-zinc-800">
                  IPC Socket: {profile.ipcSocket}
                </div>
                <button
                  onClick={handleManualRefresh}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white cursor-pointer"
                >
                  Flush Socket Ringbuffers
                </button>
                <button
                  onClick={() => {
                    setStatusMessage('Probed 4 microservices: 100% responsive.');
                    setTimeout(() => setStatusMessage(null), 3000);
                  }}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white cursor-pointer"
                >
                  Probe External Microservices
                </button>
              </div>
            )}
          </div>

          {/* Kernel Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'kernel' ? null : 'kernel')}
              className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                activeMenu === 'kernel' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-800/70 hover:text-white'
              }`}
            >
              Kernel
            </button>
            {activeMenu === 'kernel' && (
              <div
                className="absolute top-6 left-0 w-60 rounded-lg bg-zinc-900 border border-zinc-750 shadow-2xl py-1 text-xs text-zinc-200 z-50"
                onClick={() => setActiveMenu(null)}
              >
                <button
                  onClick={handleRebootKernel}
                  className="w-full px-3 py-1.5 text-left hover:bg-emerald-600 hover:text-white flex items-center justify-between cursor-pointer text-emerald-400"
                >
                  <span>Reboot Subsystem Kernel</span>
                  <span className="text-[10px] font-mono">⌥⌘R</span>
                </button>
                <div className="my-1 border-t border-zinc-800" />
                <div className="px-3 py-1 text-[10px] font-mono text-zinc-400">
                  PID: {profile.pid} · Threads: {profile.threads}
                </div>
                <div className="px-3 py-1 text-[10px] font-mono text-zinc-400">
                  Memory: {profile.memoryFootprint}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tenant Context & Microservice Status */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          {statusMessage ? (
            <span className="text-emerald-400 font-bold animate-in fade-in">
              {statusMessage}
            </span>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>PID {profile.pid}</span>
              <span className="opacity-40">·</span>
              <span className="text-zinc-300 font-semibold">{currentTenant.slug}</span>
            </div>
          )}

          <button
            onClick={handleManualRefresh}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh Subsystem"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2.2 First-Principle Navigation Sub-Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        {/* Left: Breadcrumbs & Strategic Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5 shrink-0 font-medium">
            <span>Mandela Core</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-200">{appManifest?.category || 'telephony'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="font-bold text-white truncate">{appName}</span>
          </div>
        </div>

        {/* Center / Right: Interactive Segmented Sub-View Switcher (Zero-Pill Discipline) */}
        {profile.subViews.length > 1 && (
          <div className="flex items-center gap-1 p-0.5 bg-zinc-900 border border-zinc-800 rounded-lg overflow-x-auto scrollbar-none shrink-0">
            {profile.subViews.map((subView) => {
              const isActive = activeSubView === subView.id;
              return (
                <button
                  key={subView.id}
                  onClick={() => setActiveSubView(subView.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-sm font-semibold border-b-2 border-emerald-400'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  {subView.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2.3 Main Viewport with Left-Side Multi-Tenant Navigation */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT-SIDE MULTI-TENANT & ROLE-BASED NAVIGATION SIDEBAR */}
        <aside
          className={`${
            isNavCollapsed ? 'w-14' : 'w-80 sm:w-88'
          } shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col transition-all duration-200 select-none z-20 overflow-y-auto font-sans`}
        >
          {/* Header & Collapse Toggle */}
          <div className="p-3.5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            {!isNavCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold font-mono tracking-wider text-zinc-100 uppercase">
                  Multi-Tenant OS
                </span>
              </div>
            )}
            <button
              onClick={() => setIsNavCollapsed(!isNavCollapsed)}
              className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer mx-auto border border-zinc-800 hover:border-zinc-700"
              title={isNavCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
            >
              {isNavCollapsed ? <ChevronRight className="w-4.5 h-4.5" /> : <ChevronLeft className="w-4.5 h-4.5" />}
            </button>
          </div>

          {/* If Collapsed: Compact Icon Strip */}
          {isNavCollapsed ? (
            <div className="flex-1 p-2 space-y-3 flex flex-col items-center">
              <button
                onClick={onOpenTenantModal}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-emerald-400 hover:scale-105 transition-transform cursor-pointer"
                title={`Tenant: ${currentTenant.name} (${currentTenant.region})`}
              >
                <Building2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowPositionSelector(true)}
                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-750 flex items-center justify-center text-zinc-300 hover:text-emerald-400 hover:scale-105 transition-transform cursor-pointer"
                title={`Role Position: ${activePosition.title}`}
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
              <div className="w-6 h-[1px] bg-zinc-800 my-1" />
              {profile.subViews.map((sv) => (
                <button
                  key={sv.id}
                  onClick={() => setActiveSubView(sv.id)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    activeSubView === sv.id
                      ? 'bg-zinc-800 text-emerald-400 ring-1 ring-emerald-500/50 shadow-md'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-850'
                  }`}
                  title={sv.label}
                >
                  <Activity className="w-4 h-4" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex-1 p-3.5 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800">
              {/* 1. Multi-Tenant Organization Switcher Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400 font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Active Tenant</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-750 font-bold text-[11px]">
                    {currentTenant.countryCode || 'PAN-AFRICA'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-white text-sm sm:text-base tracking-tight truncate" title={currentTenant.name}>
                    {currentTenant.name}
                  </div>
                  <div className="text-xs text-zinc-300 font-mono flex items-center gap-1.5 mt-1">
                    <span>{currentTenant.region}</span>
                    <span className="opacity-40">·</span>
                    <span className="text-emerald-400 font-semibold">{currentTenant.subscription.displayName}</span>
                  </div>
                </div>
                <div className="space-y-2 pt-1">
                  {onOpenTenantModal && (
                    <button
                      onClick={onOpenTenantModal}
                      className="w-full py-2 px-3 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch Organization...</span>
                    </button>
                  )}
                  {onOpenOnboarding && (
                    <button
                      onClick={onOpenOnboarding}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white border border-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                      title="Launch Guided Onboarding with Wallet Top-Up & KYC"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Guided Onboarding &amp; KYC</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Role-Based Position / Login Card */}
              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400 font-bold">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Role Position</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 text-[11px]">
                    {activePosition.badge}
                  </span>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowPositionSelector(!showPositionSelector)}
                    className="w-full p-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-left flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-white text-sm truncate">
                        {activePosition.title}
                      </div>
                      <div className="text-xs text-zinc-300 truncate mt-0.5">
                        {activePosition.roleScope}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  </button>

                  {/* Position Switcher Dropdown */}
                  {showPositionSelector && (
                    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-1.5 z-50 space-y-1">
                      <div className="px-2.5 py-1 text-xs font-mono text-zinc-400 uppercase font-bold border-b border-zinc-800">
                        Select Authorized Position
                      </div>
                      {ROLE_POSITIONS.map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => {
                            setSelectedPositionId(pos.id);
                            setShowPositionSelector(false);
                            setStatusMessage(`Authenticated as ${pos.title}`);
                            setTimeout(() => setStatusMessage(null), 2500);
                          }}
                          className={`w-full p-2.5 rounded-lg text-left transition-colors flex flex-col gap-0.5 cursor-pointer ${
                            selectedPositionId === pos.id
                              ? 'bg-zinc-800 text-white border-l-2 border-emerald-400'
                              : 'hover:bg-zinc-800/60 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold">{pos.shortTitle}</span>
                            <span className="text-xs font-mono text-emerald-400 font-bold">{pos.badge}</span>
                          </div>
                          <span className="text-xs text-zinc-400">{pos.roleScope}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role Capabilities / Permissions Tokens */}
                <div className="pt-1">
                  <div className="text-xs uppercase font-mono text-zinc-400 font-bold mb-1.5">
                    Granted Permissions:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activePosition.permissions.map((perm) => (
                      <span
                        key={perm}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Application Sub-Views Navigation (Flagship / Subsystem) */}
              <div className="space-y-1.5">
                <div className="text-xs uppercase font-mono text-zinc-300 font-bold px-1 mb-1.5 flex items-center justify-between">
                  <span>Application Workspaces</span>
                  <span className="text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded text-[11px] font-mono border border-zinc-800">{profile.subViews.length} views</span>
                </div>
                {profile.subViews.map((subView) => {
                  const isActive = activeSubView === subView.id;
                  return (
                    <button
                      key={subView.id}
                      onClick={() => setActiveSubView(subView.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-850 text-white font-bold border-l-3 border-emerald-400 shadow-md ring-1 ring-zinc-800'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-900/80'
                      }`}
                    >
                      <span className="truncate">{subView.label}</span>
                      {isActive && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* 4. Multi-Tenant Cross-Portal Navigation Matrix (Role-Based Routing) */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="text-xs uppercase font-mono text-zinc-300 font-bold px-1 mb-1.5 flex items-center justify-between">
                  <span>Role-Authorized Portals</span>
                  <span className="text-emerald-400 text-xs font-mono font-bold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">RBAC</span>
                </div>
                {activePosition.recommendedPortals.map((portal, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (portal.targetAppId && onOpenApp) {
                        onOpenApp(portal.targetAppId);
                      } else if (portal.targetMode && onSwitchPortalMode) {
                        onSwitchPortalMode(portal.targetMode);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl text-left bg-zinc-900/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center justify-between group cursor-pointer shadow-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-300 truncate">
                        {portal.label}
                      </div>
                      <div className="text-xs text-zinc-400 truncate mt-0.5">
                        {portal.subtext}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 shrink-0 group-hover:text-emerald-400 group-hover:bg-zinc-750 border border-zinc-750">
                      {portal.badge}
                    </span>
                  </button>
                ))}
              </div>

              {/* 5. Subsystem Telemetry Card */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs font-mono text-zinc-300 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Driver:</span>
                  <span className="text-zinc-200 truncate max-w-[150px] font-semibold">{profile.subsystemDriver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Redis Resv:</span>
                  <span className="text-emerald-400 font-semibold">0.4ms (OK)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Database:</span>
                  <span className="text-emerald-400 font-semibold">PostgreSQL (Multi-Tenant)</span>
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT: MAIN APPLICATION WORKSPACE CANVAS */}
        <main className="flex-1 overflow-auto bg-zinc-950 relative min-w-0">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<any>, {
                activeSubView,
                onSelectSubView: setActiveSubView
              })
            : children}
        </main>
      </div>

      {/* 2.4 Bottom Kernel Status Bar */}
      <div className="h-6 bg-zinc-900/95 border-t border-zinc-800/80 px-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 select-none shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-300 font-semibold">KERNEL RUNNING</span>
          </div>
          <span className="opacity-30">|</span>
          <span>PID: {profile.pid}</span>
          <span className="opacity-30">|</span>
          <span>DRIVER: {profile.subsystemDriver}</span>
          <span className="opacity-30">|</span>
          <span className="hidden md:inline">SOCKET: {profile.ipcSocket}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">MEM: {profile.memoryFootprint.split('·')[0].trim()}</span>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span>THREADS: {profile.threads}</span>
          <span className="opacity-30">|</span>
          <span className="text-emerald-400 font-bold">{currentTenant.subscription.displayName}</span>
        </div>
      </div>
    </div>
  );
};
