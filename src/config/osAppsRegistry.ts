import React from 'react';
import {
  Activity,
  Bot,
  Sliders,
  Server,
  Database,
  Terminal as TerminalIcon,
  HardDrive,
  FileText,
  SlidersHorizontal,
  PhoneCall,
  ShieldAlert,
  Radio,
  Cpu,
  Globe,
  Sparkles
} from 'lucide-react';

/**
 * MANDELA COMMUNICATIONS OS — APPLICATION MANIFEST & REGISTRY
 * 
 * Every feature, endpoint, and interface in this operating system is assigned
 * to a dedicated, strategically bound application.
 * 
 * When new code is added, it MUST belong to one of these registered apps.
 */

export interface OsApplicationManifest {
  appId: string;
  appName: string;
  shortName: string;
  category: 'telephony' | 'ai_orchestration' | 'developer_core' | 'system_tools' | 'storage_logs';
  strategicFunction: string;
  externalMicroservices: string[];
  multiTenantScope: string;
  defaultWindowSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  icon: React.ComponentType<{ className?: string }>;
  accentColor: 'emerald'; // Centralized Two-Color System: Sovereign Emerald
}

export const OS_APPLICATIONS_REGISTRY: OsApplicationManifest[] = [
  {
    appId: 'pan_africa_numbers',
    appName: 'Pan-African Number Inventory & ITU Registry',
    shortName: 'Africa Numbers',
    category: 'telephony',
    strategicFunction: 'Searchable E.164 inventory across 54 African countries aggregating DIDWW, Twilio, DIDLogic, and Direct MNOs with ITU numbering plans and 15-minute reservation locks.',
    externalMicroservices: [
      'DIDWW Wholesale Carrier API',
      'Twilio Cloud Wholesale Ingress',
      'DIDLogic Carrier Interconnect',
      'Direct Sovereign MNO SS7/SIGTRAN (Safaricom, MTN, Vodacom)',
      'ITU-T E.164 National Numbering Plan Validator'
    ],
    multiTenantScope: 'Tenant isolated inventory reservations, regulatory KYC document validation, multi-currency wallet billing.',
    defaultWindowSize: { width: 980, height: 620 },
    defaultPosition: { x: 50, y: 50 },
    icon: Globe,
    accentColor: 'emerald'
  },
  {
    appId: 'command_control',
    appName: 'NOC Command & Control',
    shortName: 'NOC C2',
    category: 'telephony',
    strategicFunction: 'Real-time FreeSWITCH media session supervision (Listen, Whisper, Barge), live MOS scores, active channel map, and ASR anomaly alerts.',
    externalMicroservices: [
      'FreeSWITCH Anycast ESL (1000 CPS per node)',
      'Kamailio 5.7 SIP RFC 3261 Signaling Engine',
      'RTPEngine NAT Traversal & Media Forwarding'
    ],
    multiTenantScope: 'Tenant-scoped channels, supervisor credentials, isolated bridge ports.',
    defaultWindowSize: { width: 960, height: 580 },
    defaultPosition: { x: 70, y: 65 },
    icon: Activity,
    accentColor: 'emerald'
  },
  {
    appId: 'terminal',
    appName: 'Mandela Shell (msh)',
    shortName: 'Linux CLI',
    category: 'developer_core',
    strategicFunction: 'Interactive Linux telecom core terminal CLI supporting process management (ps, top), live SIP inspection (call list, barge, tcpdump), and dotfile configs.',
    externalMicroservices: [
      'Linux 6.8 RT-PREEMPT Kernel',
      'Kamailio Anycast Daemon',
      'FreeSWITCH ESL Interface',
      'RTPEngine Control Socket'
    ],
    multiTenantScope: 'Tenant root context, scoped process tree, sandboxed file execution.',
    defaultWindowSize: { width: 800, height: 500 },
    defaultPosition: { x: 380, y: 150 },
    icon: TerminalIcon,
    accentColor: 'emerald'
  },
  {
    appId: 'agent_builder',
    appName: 'AI Agent Creation Studio',
    shortName: 'Agent Studio',
    category: 'ai_orchestration',
    strategicFunction: 'Translates natural-language operator prompts into reviewable multi-lingual conversational voice agents with provider capability checks and simulation traces.',
    externalMicroservices: [
      '@google/genai Gemini 3.8 Flash SDK Gateway',
      '50 African Languages Neural Streaming ASR/TTS',
      'NCCO / VoiceXML Dynamic Flow Compiler'
    ],
    multiTenantScope: 'Tenant knowledge base, custom tool catalogs, approved telephony numbers.',
    defaultWindowSize: { width: 940, height: 600 },
    defaultPosition: { x: 90, y: 70 },
    icon: Bot,
    accentColor: 'emerald'
  },
  {
    appId: 'workflow_builder',
    appName: 'n8n Workflow Automation Engine',
    shortName: 'n8n Workflows',
    category: 'telephony',
    strategicFunction: 'n8n-style visual graph automation orchestrating Pan-African Numbers, FreeSWITCH SIP, Gemini 3.8 AI, M-Pesa payments, and SBC core routing.',
    externalMicroservices: [
      'n8n Visual DAG Execution Engine',
      'VoiceXML 2.1 & NCCO Compiler',
      'FreeSWITCH ESL & SIP Webhook Bus',
      'Daraja M-Pesa & Flutterwave Rails'
    ],
    multiTenantScope: 'Tenant workflow schemas, isolated dialplans, entry phone number binding, execution traces.',
    defaultWindowSize: { width: 1040, height: 640 },
    defaultPosition: { x: 90, y: 70 },
    icon: Sliders,
    accentColor: 'emerald'
  },
  {
    appId: 'providers',
    appName: 'Agnostic Provider Registry',
    shortName: 'Providers',
    category: 'developer_core',
    strategicFunction: 'Pluggable vendor-agnostic adapter hub across Telephony Trunks, Media Engines, ASR, TTS, AI LLMs, and S3 Storage with live connection testing.',
    externalMicroservices: [
      'SIP OPTIONS Health Prober',
      'AWS / MinIO S3 Object Vault',
      'Neural Speech Gateway'
    ],
    multiTenantScope: 'Tenant credential vault keys, custom carrier SIP credentials, billing meter.',
    defaultWindowSize: { width: 900, height: 560 },
    defaultPosition: { x: 130, y: 90 },
    icon: Server,
    accentColor: 'emerald'
  },
  {
    appId: 'task_manager',
    appName: 'System Task & Resource Manager',
    shortName: 'Task Manager',
    category: 'system_tools',
    strategicFunction: 'Windows-familiar system monitor tracking CPU/RAM saturation, FreeSWITCH 1,000 CPS thread pools, daemon lifecycle (Restart/Kill), and kernel threads.',
    externalMicroservices: [
      'Linux cgroups / procfs Telemetry',
      'FreeSWITCH Core Thread Monitor',
      'Kafka CDR Queue Metrics'
    ],
    multiTenantScope: 'Host & container compute isolation, tenant quota consumption monitors.',
    defaultWindowSize: { width: 840, height: 520 },
    defaultPosition: { x: 200, y: 120 },
    icon: Cpu,
    accentColor: 'emerald'
  },
  {
    appId: 'file_explorer',
    appName: 'Sovereign Storage Explorer',
    shortName: 'Storage Files',
    category: 'storage_logs',
    strategicFunction: 'Dual-pane file browser for telecommunication configurations (/etc/mandela), raw packet traces (/var/log/*.pcap), and mediated CDR parquet files.',
    externalMicroservices: [
      'POSIX Sovereign Virtual File System',
      'Apache Parquet Stream Reader',
      'Libpcap Packet Capture Decoder'
    ],
    multiTenantScope: 'Tenant isolated virtual directories, encrypted recording storage.',
    defaultWindowSize: { width: 860, height: 530 },
    defaultPosition: { x: 220, y: 130 },
    icon: HardDrive,
    accentColor: 'emerald'
  },
  {
    appId: 'recordings',
    appName: 'Call Recordings & Transcripts',
    shortName: 'Recordings',
    category: 'storage_logs',
    strategicFunction: 'Audio waveform player with multi-speaker diarization, real-time PII redaction (account & card masking), and raw PCAP packet trace export.',
    externalMicroservices: [
      'RTPEngine Recording Stream',
      'S3 AES-GCM-256 Vault',
      'Diarization & PII Sanitizer'
    ],
    multiTenantScope: 'Tenant regulatory retention policies, legal hold flags, encrypted access.',
    defaultWindowSize: { width: 940, height: 580 },
    defaultPosition: { x: 150, y: 100 },
    icon: Database,
    accentColor: 'emerald'
  },
  {
    appId: 'dev_console',
    appName: 'Developer Console & OpenAPI',
    shortName: 'Dev Console',
    category: 'developer_core',
    strategicFunction: 'Interactive OpenAPI 3.1 REST documentation, copyable cURL snippets, and live HMAC-SHA256 webhook signing tester.',
    externalMicroservices: [
      'Mandela Versioned REST API (v1)',
      'HMAC-SHA256 Crypto Engine',
      'OpenAPI 3.1 Schema Generator'
    ],
    multiTenantScope: 'Tenant API keys, webhook endpoint subscriptions, rate-limiting tokens.',
    defaultWindowSize: { width: 880, height: 540 },
    defaultPosition: { x: 170, y: 110 },
    icon: TerminalIcon,
    accentColor: 'emerald'
  },
  {
    appId: 'architecture',
    appName: 'Architecture Blueprint Viewer',
    shortName: 'Blueprint',
    category: 'system_tools',
    strategicFunction: 'End-to-end interactive telecommunications architecture diagram showing the carrier trunk, FreeSWITCH media server, ASR/TTS, and AI layer pipeline.',
    externalMicroservices: [
      'Mandela Telecom Core System 1 (Numbers)',
      'System 4 (Carrier SBC Core)',
      'System 7/9 (Speech & Cloud)'
    ],
    multiTenantScope: 'System-wide architectural specification.',
    defaultWindowSize: { width: 960, height: 600 },
    defaultPosition: { x: 70, y: 60 },
    icon: FileText,
    accentColor: 'emerald'
  },
  {
    appId: 'multi_ai_gateway',
    appName: 'Multi-AI Gateway & Router',
    shortName: 'Multi-AI Hub',
    category: 'ai_orchestration',
    strategicFunction: 'Provider-neutral intelligent model routing across Gemini 2.5, Claude 3.7, GPT-4o, and Mistral with cost optimization and fallback policies.',
    externalMicroservices: [
      'Gemini 2.5 Pro / Flash Router',
      'Claude 3.7 Sonnet Adapter',
      'OpenAI GPT-4o Omnichannel',
      'Mistral Large 2 European Gateway',
      'Local Ollama / DeepSeek Edge'
    ],
    multiTenantScope: 'Tenant token quotas, data residency governance, model selection overrides.',
    defaultWindowSize: { width: 980, height: 620 },
    defaultPosition: { x: 80, y: 55 },
    icon: Sparkles,
    accentColor: 'emerald'
  },
  {
    appId: 'mcp_gateway',
    appName: 'Model Context Protocol (MCP) Gateway',
    shortName: 'MCP Tools',
    category: 'ai_orchestration',
    strategicFunction: 'Linux Foundation & Anthropic MCP integration layer providing tool discovery, schema inspection, and authenticated RPC execution.',
    externalMicroservices: [
      'MCP Streamable HTTP Server',
      'stdio Child Process Bridge',
      'Role-Based Tool Authorization Engine',
      'Audit Logging & PII Sanitizer'
    ],
    multiTenantScope: 'Tenant isolated MCP tool execution sandbox, cryptographically signed audit trail.',
    defaultWindowSize: { width: 960, height: 600 },
    defaultPosition: { x: 100, y: 75 },
    icon: Cpu,
    accentColor: 'emerald'
  }
];
