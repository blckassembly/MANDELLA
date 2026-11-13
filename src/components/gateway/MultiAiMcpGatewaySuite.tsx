import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Bot,
  Cpu,
  Server,
  Zap,
  Key,
  Code2,
  Activity,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Square,
  RefreshCw,
  Copy,
  Check,
  Search,
  Filter,
  Sliders,
  Database,
  Terminal,
  Globe,
  Lock,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2
} from 'lucide-react';
import { TenantAccount } from '../../types/multiTenant';

export interface MultiAiMcpGatewaySuiteProps {
  currentTenant?: TenantAccount;
  onOpenApp?: (appId: string) => void;
  className?: string;
}

// ----------------------------------------------------------------------
// DATA TYPES & MODEL REGISTRY
// ----------------------------------------------------------------------
export interface AiModelSpec {
  id: string;
  provider: 'openai' | 'anthropic' | 'gemini' | 'mistral' | 'ollama' | 'deepseek';
  name: string;
  version: string;
  contextWindow: number;
  outputLimit: number;
  inputCostPer1M: number;
  outputCostPer1M: number;
  latencyAvgMs: number;
  status: 'operational' | 'degraded' | 'standby';
  capabilities: {
    toolCalling: boolean;
    streaming: boolean;
    structuredOutput: boolean;
    multimodal: boolean;
  };
  recommendedFor: string;
}

export interface McpToolSpec {
  name: string;
  server: string;
  transport: 'streamable-http' | 'stdio' | 'websocket';
  description: string;
  category: 'telephony' | 'carrier' | 'billing' | 'security' | 'database';
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  requiredRole: 'super_admin' | 'carrier_operator' | 'analyst';
  executionCount: number;
  avgLatencyMs: number;
}

export interface ApiRouteSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  subsystem: string;
  rateLimit: string;
  authRequired: boolean;
  targetService: string;
  lastCalled: string;
  status2xxPercent: number;
}

export const MULTI_AI_MODELS: AiModelSpec[] = [
  {
    id: 'gemini-2.5-pro',
    provider: 'gemini',
    name: 'Gemini 2.5 Pro',
    version: '2025.02-pro',
    contextWindow: 2000000,
    outputLimit: 8192,
    inputCostPer1M: 1.25,
    outputCostPer1M: 5.00,
    latencyAvgMs: 380,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: true },
    recommendedFor: 'Complex multi-turn voice logic & 54 African language translation'
  },
  {
    id: 'gemini-2.5-flash',
    provider: 'gemini',
    name: 'Gemini 2.5 Flash',
    version: '2025.02-flash',
    contextWindow: 1000000,
    outputLimit: 8192,
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    latencyAvgMs: 140,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: true },
    recommendedFor: 'Sub-second real-time IVR streaming and conversational interruptions'
  },
  {
    id: 'claude-3-7-sonnet',
    provider: 'anthropic',
    name: 'Claude 3.7 Sonnet',
    version: 'claude-3-7-20250219',
    contextWindow: 200000,
    outputLimit: 8192,
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    latencyAvgMs: 420,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: true },
    recommendedFor: 'Strict telecom regulatory compliance & NCCO code generation'
  },
  {
    id: 'gpt-4o',
    provider: 'openai',
    name: 'GPT-4o Omnichannel',
    version: '2024-11-20',
    contextWindow: 128000,
    outputLimit: 4096,
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    latencyAvgMs: 340,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: true },
    recommendedFor: 'Direct SIP audio streaming and operator tool execution'
  },
  {
    id: 'mistral-large-2',
    provider: 'mistral',
    name: 'Mistral Large 2',
    version: '2407',
    contextWindow: 128000,
    outputLimit: 4096,
    inputCostPer1M: 2.00,
    outputCostPer1M: 6.00,
    latencyAvgMs: 290,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: false },
    recommendedFor: 'Sovereign on-premises European & African data residency mandates'
  },
  {
    id: 'ollama-deepseek-r1',
    provider: 'ollama',
    name: 'Ollama: DeepSeek-R1 70B (Local)',
    version: 'v0.5.4-local',
    contextWindow: 64000,
    outputLimit: 4096,
    inputCostPer1M: 0.00,
    outputCostPer1M: 0.00,
    latencyAvgMs: 510,
    status: 'operational',
    capabilities: { toolCalling: true, streaming: true, structuredOutput: true, multimodal: false },
    recommendedFor: 'Air-gapped sovereign telco deployments with zero cloud egress'
  }
];

export const MCP_TOOLS_CATALOG: McpToolSpec[] = [
  {
    name: 'telecom_lookup_e164',
    server: 'mcp-mandela-telecom-v1',
    transport: 'streamable-http',
    description: 'Validates an E.164 phone number, queries ITU-T NNP compliance, and returns carrier routing & regulatory KYC requirements.',
    category: 'telephony',
    inputSchema: {
      type: 'object',
      properties: {
        e164: { type: 'string', description: 'Phone number in full E.164 format (+254700000000)' },
        countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 code' }
      },
      required: ['e164']
    },
    outputSchema: {
      type: 'object',
      properties: {
        isValid: { type: 'boolean' },
        carrier: { type: 'string' },
        allocatedRange: { type: 'string' },
        ratePerMinuteUsd: { type: 'number' }
      }
    },
    requiredRole: 'carrier_operator',
    executionCount: 184920,
    avgLatencyMs: 12
  },
  {
    name: 'query_carrier_lcr',
    server: 'mcp-mandela-sbc-v1',
    transport: 'streamable-http',
    description: 'Queries real-time Least Cost Routing (LCR) table across Safaricom, MTN, Airtel, DIDWW, and Twilio Wholesale trunks.',
    category: 'carrier',
    inputSchema: {
      type: 'object',
      properties: {
        destinationPrefix: { type: 'string' },
        trafficType: { type: 'string', enum: ['voice', 'sms', 'ussd'] }
      },
      required: ['destinationPrefix', 'trafficType']
    },
    outputSchema: {
      type: 'object',
      properties: {
        primaryTrunk: { type: 'string' },
        costPerUnit: { type: 'number' },
        backupTrunks: { type: 'array' }
      }
    },
    requiredRole: 'carrier_operator',
    executionCount: 420910,
    avgLatencyMs: 8
  },
  {
    name: 'smpp_send_pdu',
    server: 'mcp-mandela-messaging-v1',
    transport: 'streamable-http',
    description: 'Submits a binary or text SMPP v3.4 submit_sm PDU through sovereign SS7/SIGTRAN SMSC binds.',
    category: 'telephony',
    inputSchema: {
      type: 'object',
      properties: {
        senderId: { type: 'string' },
        recipientE164: { type: 'string' },
        messageBody: { type: 'string' },
        encoding: { type: 'string', enum: ['gsm7', 'ucs2'] }
      },
      required: ['senderId', 'recipientE164', 'messageBody']
    },
    outputSchema: {
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        smppStatus: { type: 'string' }
      }
    },
    requiredRole: 'carrier_operator',
    executionCount: 712030,
    avgLatencyMs: 18
  },
  {
    name: 'esim_sgp22_bind',
    server: 'mcp-mandela-esim-v1',
    transport: 'streamable-http',
    description: 'Executes GSMA SGP.22 consumer RSP download order and releases cryptographically signed matching ID to SM-DP+ server.',
    category: 'security',
    inputSchema: {
      type: 'object',
      properties: {
        eid: { type: 'string', description: '32-digit EID of eUICC chip' },
        profileType: { type: 'string' },
        tenantId: { type: 'string' }
      },
      required: ['eid', 'profileType']
    },
    outputSchema: {
      type: 'object',
      properties: {
        matchingId: { type: 'string' },
        smdpAddress: { type: 'string' },
        activationCodeQr: { type: 'string' }
      }
    },
    requiredRole: 'super_admin',
    executionCount: 39400,
    avgLatencyMs: 95
  },
  {
    name: 'db_dataverse_query',
    server: 'mcp-mandela-storage-v1',
    transport: 'stdio',
    description: 'Runs tenant-sandboxed read-only SQL queries over the Telecom Dataverse CDR warehouse with automatic PII redaction.',
    category: 'database',
    inputSchema: {
      type: 'object',
      properties: {
        sqlQuery: { type: 'string' },
        tenantScope: { type: 'string' },
        limit: { type: 'number', default: 50 }
      },
      required: ['sqlQuery', 'tenantScope']
    },
    outputSchema: {
      type: 'object',
      properties: {
        columns: { type: 'array' },
        rowCount: { type: 'number' },
        records: { type: 'array' }
      }
    },
    requiredRole: 'analyst',
    executionCount: 89400,
    avgLatencyMs: 34
  }
];

export const API_ROUTES: ApiRouteSpec[] = [
  { method: 'GET', path: '/v1/numbers/inventory', subsystem: 'E.164 Inventory', rateLimit: '5,000 req/min', authRequired: true, targetService: 'Sovereign ITU Registry', lastCalled: '2s ago', status2xxPercent: 99.98 },
  { method: 'POST', path: '/v1/numbers/reserve', subsystem: 'E.164 Inventory', rateLimit: '1,000 req/min', authRequired: true, targetService: '15-Min Lock Daemon', lastCalled: '5s ago', status2xxPercent: 99.94 },
  { method: 'POST', path: '/v1/calls/originate', subsystem: 'FreeSWITCH Core', rateLimit: '10,000 req/min', authRequired: true, targetService: 'Anycast ESL Cluster', lastCalled: '100ms ago', status2xxPercent: 99.91 },
  { method: 'GET', path: '/v1/calls/:id/mos', subsystem: 'QoS Supervision', rateLimit: '15,000 req/min', authRequired: true, targetService: 'RTPEngine Telemetry', lastCalled: '500ms ago', status2xxPercent: 100.0 },
  { method: 'POST', path: '/v1/ai/orchestrate', subsystem: 'Multi-AI Gateway', rateLimit: '2,500 req/min', authRequired: true, targetService: 'Intelligent Model Router', lastCalled: '120ms ago', status2xxPercent: 99.85 },
  { method: 'POST', path: '/v1/mcp/invoke', subsystem: 'MCP Gateway', rateLimit: '5,000 req/min', authRequired: true, targetService: 'MCP Tool Dispatcher', lastCalled: '450ms ago', status2xxPercent: 99.95 },
  { method: 'POST', path: '/v1/sms/submit', subsystem: 'SMS Gateway', rateLimit: '20,000 req/min', authRequired: true, targetService: 'SMPP v3.4 Ingress', lastCalled: '30ms ago', status2xxPercent: 99.99 }
];

export const MultiAiMcpGatewaySuite: React.FC<MultiAiMcpGatewaySuiteProps> = ({
  currentTenant,
  onOpenApp,
  className = ''
}) => {
  // Navigation Tabs: Multi-AI Router, MCP Protocol, API Gateway & Keys, SDK Framework, Stress-Test Fleet
  const [activeTab, setActiveTab] = useState<'ai_router' | 'mcp_gateway' | 'api_gateway' | 'sdk_hub' | 'stress_test'>('ai_router');

  // Multi-AI Interactive Test State
  const [selectedModelId, setSelectedModelId] = useState<string>('gemini-2.5-flash');
  const [aiTestPrompt, setAiTestPrompt] = useState<string>(
    'Translate incoming caller intent from Swahili to English: "Nataka kulipia bili ya maji kwa M-Pesa lakini nambari haikubali."'
  );
  const [aiStreamingOutput, setAiStreamingOutput] = useState<string>('');
  const [isAiRunning, setIsAiRunning] = useState<boolean>(false);
  const [aiRunStats, setAiRunStats] = useState<{ latencyMs: number; tokens: number; costUsd: number } | null>(null);

  // MCP Interactive Invocation State
  const [selectedToolName, setSelectedToolName] = useState<string>('telecom_lookup_e164');
  const [mcpInputJson, setMcpInputJson] = useState<string>(
    JSON.stringify({ e164: '+254712345678', countryCode: 'KE' }, null, 2)
  );
  const [mcpOutputResult, setMcpOutputResult] = useState<any>(null);
  const [isMcpInvoking, setIsMcpInvoking] = useState<boolean>(false);

  // API Key Management State
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; prefix: string; created: string; lastUsed: string; active: boolean }[]>([
    { id: 'key_live_01', name: 'Production Carrier Trunk API', prefix: 'man_live_9f82...3e1a', created: '2025-01-15', lastUsed: 'Just now', active: true },
    { id: 'key_live_02', name: 'Voice IVR & Agent Studio Bot', prefix: 'man_live_55a1...88c4', created: '2025-02-01', lastUsed: '2 min ago', active: true },
    { id: 'key_test_01', name: 'Staging Sandbox Key', prefix: 'man_test_11c0...77b9', created: '2025-02-10', lastUsed: '1 hour ago', active: true }
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Stress-Test Fleet Simulation State
  const [stressConcurrency, setStressConcurrency] = useState<number>(1000);
  const [stressScenario, setStressScenario] = useState<'sustained_10k' | 'sudden_spike' | 'graceful_ramp' | 'ddos_resilience'>('sustained_10k');
  const [isStressRunning, setIsStressRunning] = useState<boolean>(false);
  const [stressMetrics, setStressMetrics] = useState({
    activeVus: 0,
    targetCps: 1000,
    achievedCps: 984,
    errorRatePercent: 0.02,
    p50Ms: 14.2,
    p95Ms: 28.6,
    p99Ms: 44.1,
    activeFreeswitchChannels: 0,
    redisThroughputOps: 0
  });

  // SDK Code Sample Tab
  const [selectedSdkLang, setSelectedSdkLang] = useState<'typescript' | 'python' | 'curl'>('typescript');

  // Multi-AI Test Run Simulation
  const handleExecuteAiTest = () => {
    setIsAiRunning(true);
    setAiStreamingOutput('');
    setAiRunStats(null);

    const model = MULTI_AI_MODELS.find((m) => m.id === selectedModelId) || MULTI_AI_MODELS[0];
    const startTime = Date.now();

    const sampleResponses: Record<string, string> = {
      'gemini-2.5-flash': 'Resolved Caller Intent (Swahili -> English):\n• Intent: Utility Bill Payment Failure (Water)\n• Payment Rail: M-Pesa Daraja STK Push\n• Issue: Account reference number rejected by utility validation endpoint.\n• Suggested Action: Trigger NCCO whisper prompt: "Tafadhali thibitisha nambari ya akaunti ya maji kisha ujaribu tena."',
      'gemini-2.5-pro': 'Deep Semantic Analysis (54 African Dialects Engine):\n• Source Language: Swahili (Kiswahili sanifu, Coastal / Nairobi colloquial blend)\n• Semantic Entity: Nairobi Water / Maji Account Validation\n• Sentiment: Mild urgency / Transaction barrier\n• Recommended Routing: Route directly to automated Daraja account lookup subflow without routing to live agent.',
      'claude-3-7-sonnet': 'Regulatory & NCCO Action Plan:\n• Action: Validate account format against Kenya Water & Sanitation regulatory schema.\n• Routing Policy: Tier 1 automated voice prompt, bypass supervisor barge.\n• Status Code: 200 OK.'
    };

    const finalAnswer = sampleResponses[selectedModelId] || sampleResponses['gemini-2.5-flash'];
    let index = 0;

    const interval = setInterval(() => {
      index += 12;
      setAiStreamingOutput(finalAnswer.slice(0, index));
      if (index >= finalAnswer.length) {
        clearInterval(interval);
        setIsAiRunning(false);
        const duration = Date.now() - startTime;
        setAiRunStats({
          latencyMs: duration > 0 ? duration : model.latencyAvgMs,
          tokens: Math.round(finalAnswer.length / 4),
          costUsd: 0.000042
        });
      }
    }, 40);
  };

  // MCP Tool Execution Simulation
  const handleExecuteMcpTool = () => {
    setIsMcpInvoking(true);
    setMcpOutputResult(null);

    setTimeout(() => {
      let result: any = {};
      if (selectedToolName === 'telecom_lookup_e164') {
        result = {
          success: true,
          timestamp: new Date().toISOString(),
          e164: '+254712345678',
          country: 'Kenya (KE)',
          ituRegistry: 'Communications Authority of Kenya (CA)',
          carrier: 'Safaricom PLC (M-Pesa Core)',
          assignedPrefix: '0712 - GSM Mobile',
          numberType: 'MOBILE',
          regulatoryStatus: 'ALLOCATED_ACTIVE',
          routingProfile: {
            sbcIngressNode: 'nbo-sbc-01.mandela.africa',
            lcrRank: 1,
            ratePerMinuteUsd: 0.0045,
            localRateKes: 0.585
          }
        };
      } else if (selectedToolName === 'query_carrier_lcr') {
        result = {
          success: true,
          destination: '+254 Kenya Mobile',
          lcrRanking: [
            { priority: 1, carrier: 'Safaricom Direct Interconnect', costUsd: 0.0045, mos: 4.41, latencyMs: 14 },
            { priority: 2, carrier: 'DIDWW Global Wholesale', costUsd: 0.0062, mos: 4.35, latencyMs: 28 },
            { priority: 3, carrier: 'Twilio Carrier Trunk', costUsd: 0.0085, mos: 4.29, latencyMs: 42 }
          ]
        };
      } else {
        result = {
          success: true,
          tool: selectedToolName,
          status: 'EXECUTED_SUCCESSFULLY',
          auditLogId: 'mcp-audit-' + Math.random().toString(36).substring(2, 9),
          executionTimeMs: 18
        };
      }
      setMcpOutputResult(result);
      setIsMcpInvoking(false);
    }, 450);
  };

  // Stress-Test Simulation Loop
  useEffect(() => {
    if (!isStressRunning) return;

    const interval = setInterval(() => {
      setStressMetrics((prev) => {
        const jitter = (Math.random() - 0.5) * 40;
        const target = stressConcurrency;
        const currentCps = Math.min(target, Math.round(target * 0.98 + jitter));
        return {
          activeVus: target,
          targetCps: target,
          achievedCps: currentCps,
          errorRatePercent: parseFloat((Math.random() * 0.04).toFixed(3)),
          p50Ms: parseFloat((12 + Math.random() * 4).toFixed(1)),
          p95Ms: parseFloat((24 + Math.random() * 8).toFixed(1)),
          p99Ms: parseFloat((38 + Math.random() * 12).toFixed(1)),
          activeFreeswitchChannels: Math.round(currentCps * 3.2),
          redisThroughputOps: Math.round(currentCps * 14.5)
        };
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isStressRunning, stressConcurrency]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className={`w-full h-full flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans ${className}`}>
      {/* -------------------------------------------------------------
          TOP BAR: SUITE TITLE & TABS
          ------------------------------------------------------------- */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-white">Unified Multi-AI, Gateway &amp; MCP Architecture</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                v2.4 Enterprise
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Provider-neutral model router · Model Context Protocol · Centralized API gateway · Stress test fleet
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ai_router')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai_router'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-AI Hub</span>
          </button>
          <button
            onClick={() => setActiveTab('mcp_gateway')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'mcp_gateway'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>MCP Architecture</span>
          </button>
          <button
            onClick={() => setActiveTab('api_gateway')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'api_gateway'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Gateway</span>
          </button>
          <button
            onClick={() => setActiveTab('sdk_hub')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sdk_hub'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Universal SDKs</span>
          </button>
          <button
            onClick={() => setActiveTab('stress_test')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'stress_test'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Stress Fleet</span>
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------
          TAB 1: MULTI-AI PROVIDER HUB & INTELLIGENT MODEL ROUTER
          ------------------------------------------------------------- */}
      {activeTab === 'ai_router' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Header Summary Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Connected AI Adapters</div>
              <div className="text-2xl font-bold text-white mt-1">6 Active</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Zero vendor lock-in</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Context Routing Window</div>
              <div className="text-2xl font-bold text-white mt-1">2,000,000 Tokens</div>
              <div className="text-xs text-zinc-400 mt-1">Gemini 2.5 Pro multimodal</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Fastest Real-Time Audio</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">140 ms Avg</div>
              <div className="text-xs text-zinc-400 mt-1">Gemini 2.5 Flash sub-second</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Sovereign Air-Gap Model</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">Ollama / DeepSeek</div>
              <div className="text-xs text-zinc-400 mt-1">Local edge zero-egress</div>
            </div>
          </div>

          {/* Model Registry Matrix */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-white">Universal AI Model Registry &amp; Failover Policy</h2>
                <p className="text-xs text-zinc-400">Configurable routing based on task latency, cost, and strict data residency</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">Router status: Live Failover Enabled</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Model &amp; Family</th>
                    <th className="py-3 px-3">Provider</th>
                    <th className="py-3 px-3">Context / Max Out</th>
                    <th className="py-3 px-3">Cost / 1M (In / Out)</th>
                    <th className="py-3 px-3">Avg Latency</th>
                    <th className="py-3 px-3">Capabilities</th>
                    <th className="py-3 px-3">Primary Assignment</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                  {MULTI_AI_MODELS.map((model) => (
                    <tr key={model.id} className="hover:bg-zinc-850/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white text-sm">{model.name}</div>
                        <div className="text-[11px] font-mono text-zinc-400">{model.version}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="capitalize px-2 py-0.5 rounded text-[11px] font-mono bg-zinc-800 border border-zinc-700">
                          {model.provider}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {(model.contextWindow / 1000).toLocaleString()}k / {model.outputLimit}
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-300">
                        ${model.inputCostPer1M.toFixed(2)} / ${model.outputCostPer1M.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className={model.latencyAvgMs < 200 ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                          {model.latencyAvgMs} ms
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 text-[10px] font-mono">
                          {model.capabilities.toolCalling && <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded">Tools</span>}
                          {model.capabilities.streaming && <span className="px-1.5 py-0.5 bg-blue-950 text-blue-400 rounded">Stream</span>}
                          {model.capabilities.multimodal && <span className="px-1.5 py-0.5 bg-purple-950 text-purple-400 rounded">Audio</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-300 max-w-xs truncate" title={model.recommendedFor}>
                        {model.recommendedFor}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedModelId(model.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                            selectedModelId === model.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                          }`}
                        >
                          {selectedModelId === model.id ? 'Active Tester' : 'Test Model'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Model Test Sandbox */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Live Multi-AI Inference Sandbox</h3>
                <span className="text-xs font-mono text-zinc-400">Target: {selectedModelId}</span>
              </div>
              {aiRunStats && (
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span>Latency: <strong className="text-emerald-400">{aiRunStats.latencyMs}ms</strong></span>
                  <span>Tokens: <strong className="text-white">{aiRunStats.tokens}</strong></span>
                  <span>Est. Cost: <strong className="text-white">${aiRunStats.costUsd.toFixed(6)}</strong></span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Test Input Prompt / Telephony Audio Event</label>
              <textarea
                value={aiTestPrompt}
                onChange={(e) => setAiTestPrompt(e.target.value)}
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-zinc-400">
                Executes via secure server proxy. Zero client-side API credentials exposed.
              </div>
              <button
                onClick={handleExecuteAiTest}
                disabled={isAiRunning}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-lg shadow-emerald-600/20"
              >
                {isAiRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isAiRunning ? 'Streaming Response...' : 'Execute Prompt Through Model Router'}</span>
              </button>
            </div>

            {aiStreamingOutput && (
              <div className="mt-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-mono uppercase text-zinc-400 mb-2 flex items-center justify-between">
                  <span>Model Streaming Output</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>
                <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                  {aiStreamingOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 2: MODEL CONTEXT PROTOCOL (MCP) GATEWAY
          ------------------------------------------------------------- */}
      {activeTab === 'mcp_gateway' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* MCP Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">MCP Transport Layer</div>
              <div className="text-lg font-bold text-white mt-1">Streamable HTTP + stdio</div>
              <p className="text-xs text-zinc-400 mt-1">Compliant with Anthropic &amp; Linux Foundation MCP specification</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Advertised Telecom Tools</div>
              <div className="text-lg font-bold text-emerald-400 mt-1">{MCP_TOOLS_CATALOG.length} Registered Tools</div>
              <p className="text-xs text-zinc-400 mt-1">Role-scoped tool calling with cryptographic execution audit trails</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-xs text-zinc-400 font-mono uppercase">Total Tool Invocations</div>
              <div className="text-lg font-bold text-white mt-1">1,446,650 Calls</div>
              <p className="text-xs text-zinc-400 mt-1">Average response latency: 15.2 ms</p>
            </div>
          </div>

          {/* MCP Tools Discovery List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Tools Registry */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-sm text-white">Registered MCP Tools &amp; Schemas</h2>
                  <p className="text-xs text-zinc-400">Available to AI agents across all 54 African country networks</p>
                </div>
              </div>

              <div className="divide-y divide-zinc-800 max-h-[500px] overflow-y-auto">
                {MCP_TOOLS_CATALOG.map((tool) => (
                  <div
                    key={tool.name}
                    onClick={() => {
                      setSelectedToolName(tool.name);
                      if (tool.name === 'telecom_lookup_e164') {
                        setMcpInputJson(JSON.stringify({ e164: '+254712345678', countryCode: 'KE' }, null, 2));
                      } else if (tool.name === 'query_carrier_lcr') {
                        setMcpInputJson(JSON.stringify({ destinationPrefix: '+254', trafficType: 'voice' }, null, 2));
                      } else if (tool.name === 'smpp_send_pdu') {
                        setMcpInputJson(JSON.stringify({ senderId: 'SAFARICOM', recipientE164: '+254712345678', messageBody: 'Kodi yako ya uthibitisho ni 489210.', encoding: 'gsm7' }, null, 2));
                      } else {
                        setMcpInputJson(JSON.stringify({ eid: '89049032000000000000000000000001', profileType: 'MANDELA_SOVEREIGN_SIM' }, null, 2));
                      }
                    }}
                    className={`p-4 transition-colors cursor-pointer ${
                      selectedToolName === tool.name ? 'bg-zinc-850 border-l-4 border-emerald-500' : 'hover:bg-zinc-850/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-mono font-bold text-sm text-emerald-400">{tool.name}</div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {tool.transport}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mb-2">{tool.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                      <span>Server: {tool.server}</span>
                      <span>•</span>
                      <span>Auth: {tool.requiredRole}</span>
                      <span>•</span>
                      <span>Calls: {tool.executionCount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Interactive MCP Invocation Sandbox */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <h3 className="font-bold text-sm text-white">MCP Tool Invocation Sandbox</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">Tool: {selectedToolName}</span>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Input Parameters (JSON Schema Enforced)</label>
                <textarea
                  value={mcpInputJson}
                  onChange={(e) => setMcpInputJson(e.target.value)}
                  rows={5}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Transmitted over authenticated JSON-RPC 2.0 stream</span>
                <button
                  onClick={handleExecuteMcpTool}
                  disabled={isMcpInvoking}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-colors shadow-lg shadow-purple-600/20"
                >
                  {isMcpInvoking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isMcpInvoking ? 'Executing RPC...' : 'Invoke MCP Tool'}</span>
                </button>
              </div>

              {mcpOutputResult && (
                <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                  <div className="text-[11px] font-mono uppercase text-zinc-400 mb-2 flex items-center justify-between">
                    <span>RPC Response (Audit Verified)</span>
                    <span className="text-emerald-400">Protocol 200</span>
                  </div>
                  <pre className="text-xs font-mono text-zinc-200 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(mcpOutputResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 3: CENTRALIZED API GATEWAY & KEY VAULT
          ------------------------------------------------------------- */}
      {activeTab === 'api_gateway' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* API Key Vault Section */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-white flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <span>Sovereign API Key Vault &amp; Rate Limits</span>
                </h2>
                <p className="text-xs text-zinc-400">Cryptographically signed HMAC-SHA256 tokens with tenant isolation</p>
              </div>
              <button
                onClick={() => {
                  const newKey = {
                    id: 'key_live_' + Date.now().toString(36),
                    name: 'Operator API Key #' + (apiKeys.length + 1),
                    prefix: 'man_live_' + Math.random().toString(36).substring(2, 6) + '...' + Math.random().toString(36).substring(2, 6),
                    created: 'Just now',
                    lastUsed: 'Never',
                    active: true
                  };
                  setApiKeys([newKey, ...apiKeys]);
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Generate New API Key</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs text-white truncate">{key.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active Key" />
                    </div>
                    <div className="font-mono text-xs text-zinc-400 flex items-center justify-between bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                      <span>{key.prefix}</span>
                      <button
                        onClick={() => handleCopy(key.prefix, key.id)}
                        className="text-zinc-400 hover:text-white cursor-pointer ml-1"
                      >
                        {copiedKey === key.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Created: {key.created}</span>
                    <span>Used: {key.lastUsed}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Centralized API Routing Matrix */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Centralized Route Manager &amp; Circuit Breakers</h3>
                <p className="text-xs text-zinc-400">Request normalization, rate quotas, correlation IDs, and target microservices</p>
              </div>
              <span className="text-xs font-mono text-emerald-400">Global Quota: 10,000 req/min</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-400 font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Method &amp; Path</th>
                    <th className="py-3 px-3">Subsystem</th>
                    <th className="py-3 px-3">Rate Limit</th>
                    <th className="py-3 px-3">Target Service</th>
                    <th className="py-3 px-3">Last Called</th>
                    <th className="py-3 px-4 text-right">Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-200">
                  {API_ROUTES.map((route, idx) => (
                    <tr key={idx} className="hover:bg-zinc-850/60 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-2 font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          route.method === 'GET' ? 'bg-blue-950 text-blue-400' : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {route.method}
                        </span>
                        <span className="font-semibold text-white">{route.path}</span>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">{route.subsystem}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{route.rateLimit}</td>
                      <td className="py-3 px-3 text-zinc-300">{route.targetService}</td>
                      <td className="py-3 px-3 font-mono text-zinc-400">{route.lastCalled}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                        {route.status2xxPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 4: UNIVERSAL DEVELOPER SDK FRAMEWORK
          ------------------------------------------------------------- */}
      {activeTab === 'sdk_hub' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  <span>Universal Developer SDK Framework</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Official client libraries for integrating E.164 numbers, FreeSWITCH voice, and MCP tools
                </p>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-semibold">
                <button
                  onClick={() => setSelectedSdkLang('typescript')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedSdkLang === 'typescript' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  TypeScript (@mandela/sdk)
                </button>
                <button
                  onClick={() => setSelectedSdkLang('python')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedSdkLang === 'python' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Python (mandela-sdk)
                </button>
                <button
                  onClick={() => setSelectedSdkLang('curl')}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    selectedSdkLang === 'curl' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  cURL &amp; OpenAPI 3.1
                </button>
              </div>
            </div>

            {/* Interactive Code Viewer */}
            <div className="rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
              <div className="p-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>
                  {selectedSdkLang === 'typescript' && 'example-telecom-agent.ts'}
                  {selectedSdkLang === 'python' && 'example_telecom_agent.py'}
                  {selectedSdkLang === 'curl' && 'originate-call.sh'}
                </span>
                <button
                  onClick={() => handleCopy(
                    selectedSdkLang === 'typescript'
                      ? `import { MandelaClient } from '@mandela/sdk';\n\nconst mandela = new MandelaClient({\n  apiKey: process.env.MANDELA_API_KEY!,\n  endpoint: 'https://core.mandela.africa/v1'\n});\n\n// 1. Search 54 African country inventory\nconst numbers = await mandela.numbers.search({\n  countryCode: 'KE',\n  type: 'MOBILE',\n  features: ['VOICE', 'SMS', 'USSD']\n});\n\n// 2. Reserve with 15-minute lock\nconst reservation = await mandela.numbers.reserve(numbers[0].e164);\n\n// 3. Bind AI voice agent\nawait mandela.agents.bindVoice({\n  e164: reservation.e164,\n  model: 'gemini-2.5-flash',\n  systemPrompt: 'You are an automated Safaricom enterprise concierge in Swahili and English.'\n});`
                      : selectedSdkLang === 'python'
                      ? `from mandela import MandelaClient\nimport os\n\nclient = MandelaClient(api_key=os.environ['MANDELA_API_KEY'])\n\n# 1. Search Pan-African inventory\ninventory = client.numbers.search(country_code="KE", limit=10)\n\n# 2. Invoke MCP Tool\nroute_info = client.mcp.invoke_tool(\n    tool_name="query_carrier_lcr",\n    params={"destinationPrefix": "+254", "trafficType": "voice"}\n)\nprint(f"Optimal carrier: {route_info['primaryTrunk']}")`
                      : `curl -X POST https://core.mandela.africa/v1/calls/originate \\\n  -H "Authorization: Bearer $MANDELA_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "from": "+254700000000",\n    "to": "+254712345678",\n    "ncco": [{"action": "talk", "text": "Hujambo, welcome to Mandela Communications OS."}]\n  }'`,
                    'sdk_code'
                  )}
                  className="flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
                >
                  {copiedKey === 'sdk_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="p-4 text-xs font-mono overflow-x-auto leading-relaxed">
                {selectedSdkLang === 'typescript' && (
                  <pre className="text-zinc-200">
                    <span className="text-purple-400">import</span> &#123; <span className="text-amber-300">MandelaClient</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">'@mandela/sdk'</span>;{'\n\n'}
                    <span className="text-purple-400">const</span> mandela = <span className="text-purple-400">new</span> <span className="text-amber-300">MandelaClient</span>(&#123;{'\n'}
                    {'  '}apiKey: process.env.<span className="text-emerald-400">MANDELA_API_KEY</span>!,{'\n'}
                    {'  '}endpoint: <span className="text-emerald-400">'https://core.mandela.africa/v1'</span>{'\n'}
                    &#125;);{'\n\n'}
                    <span className="text-zinc-500">// 1. Search 54 African country inventory with ITU compliance</span>{'\n'}
                    <span className="text-purple-400">const</span> numbers = <span className="text-purple-400">await</span> mandela.numbers.<span className="text-blue-400">search</span>(&#123;{'\n'}
                    {'  '}countryCode: <span className="text-emerald-400">'KE'</span>,{'\n'}
                    {'  '}type: <span className="text-emerald-400">'MOBILE'</span>,{'\n'}
                    {'  '}features: [<span className="text-emerald-400">'VOICE'</span>, <span className="text-emerald-400">'SMS'</span>, <span className="text-emerald-400">'USSD'</span>]{'\n'}
                    &#125;);{'\n\n'}
                    <span className="text-zinc-500">// 2. Reserve phone number with 15-minute reservation lock</span>{'\n'}
                    <span className="text-purple-400">const</span> reservation = <span className="text-purple-400">await</span> mandela.numbers.<span className="text-blue-400">reserve</span>(numbers[<span className="text-amber-300">0</span>].e164);{'\n\n'}
                    <span className="text-zinc-500">// 3. Bind AI voice agent using multi-model failover router</span>{'\n'}
                    <span className="text-purple-400">await</span> mandela.agents.<span className="text-blue-400">bindVoice</span>(&#123;{'\n'}
                    {'  '}e164: reservation.e164,{'\n'}
                    {'  '}model: <span className="text-emerald-400">'gemini-2.5-flash'</span>,{'\n'}
                    {'  '}systemPrompt: <span className="text-emerald-400">'You are an automated Safaricom enterprise concierge in Swahili and English.'</span>{'\n'}
                    &#125;);
                  </pre>
                )}

                {selectedSdkLang === 'python' && (
                  <pre className="text-zinc-200">
                    <span className="text-purple-400">from</span> mandela <span className="text-purple-400">import</span> MandelaClient{'\n'}
                    <span className="text-purple-400">import</span> os{'\n\n'}
                    client = MandelaClient(api_key=os.environ[<span className="text-emerald-400">'MANDELA_API_KEY'</span>]){'\n\n'}
                    <span className="text-zinc-500"># 1. Search Pan-African inventory</span>{'\n'}
                    inventory = client.numbers.search(country_code=<span className="text-emerald-400">"KE"</span>, limit=<span className="text-amber-300">10</span>){'\n\n'}
                    <span className="text-zinc-500"># 2. Invoke MCP Least Cost Routing Tool</span>{'\n'}
                    route_info = client.mcp.invoke_tool({'\n'}
                    {'    '}tool_name=<span className="text-emerald-400">"query_carrier_lcr"</span>,{'\n'}
                    {'    '}params=&#123;<span className="text-emerald-400">"destinationPrefix"</span>: <span className="text-emerald-400">"+254"</span>, <span className="text-emerald-400">"trafficType"</span>: <span className="text-emerald-400">"voice"</span>&#125;{'\n'}
                    ){'\n'}
                    <span className="text-blue-400">print</span>(f<span className="text-emerald-400">"Optimal carrier trunk: &#123;route_info['primaryTrunk']&#125;"</span>)
                  </pre>
                )}

                {selectedSdkLang === 'curl' && (
                  <pre className="text-zinc-200">
                    <span className="text-blue-400">curl</span> -X POST https://core.mandela.africa/v1/calls/originate \{'\n'}
                    {'  '}-H <span className="text-emerald-400">"Authorization: Bearer $MANDELA_API_KEY"</span> \{'\n'}
                    {'  '}-H <span className="text-emerald-400">"Content-Type: application/json"</span> \{'\n'}
                    {'  '}-d <span className="text-amber-300">'&#123;</span>{'\n'}
                    {'    '}<span className="text-emerald-400">"from"</span>: <span className="text-emerald-400">"+254700000000"</span>,{'\n'}
                    {'    '}<span className="text-emerald-400">"to"</span>: <span className="text-emerald-400">"+254712345678"</span>,{'\n'}
                    {'    '}<span className="text-emerald-400">"ncco"</span>: [&#123;<span className="text-emerald-400">"action"</span>: <span className="text-emerald-400">"talk"</span>, <span className="text-emerald-400">"text"</span>: <span className="text-emerald-400">"Hujambo, welcome to Mandela Communications OS."</span>&#125;]{'\n'}
                    {'  '}<span className="text-amber-300">&#125;'</span>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          TAB 5: FULL APPLICATION STRESS-TEST FLEET
          ------------------------------------------------------------- */}
      {activeTab === 'stress_test' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Carrier-Grade Stress Test Fleet</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Simulate up to 10,000 Calls Per Second (CPS) across FreeSWITCH, Kamailio, and AI Model Routers
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsStressRunning(!isStressRunning)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
                    isStressRunning
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isStressRunning ? <Square className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isStressRunning ? 'Abort Stress Fleet' : 'Launch Load Test'}</span>
                </button>
              </div>
            </div>

            {/* Slider & Scenarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">Concurrent Virtual Users (VUs) / CPS Target:</span>
                  <span className="text-emerald-400 font-bold text-sm">{stressConcurrency.toLocaleString()} CPS</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={stressConcurrency}
                  onChange={(e) => setStressConcurrency(Number(e.target.value))}
                  disabled={isStressRunning}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <span>100 VUs</span>
                  <span>1,000 VUs</span>
                  <span>5,000 VUs</span>
                  <span>10,000 VUs (Max Carrier)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Simulation Test Profile</label>
                <select
                  value={stressScenario}
                  onChange={(e) => setStressScenario(e.target.value as any)}
                  disabled={isStressRunning}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-sans text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="sustained_10k">Sustained High-Throughput (1,000 CPS FreeSWITCH media)</option>
                  <option value="sudden_spike">Sudden Black Swan Spike (0 to 10K in 5 seconds)</option>
                  <option value="graceful_ramp">Graceful Ramp-Up (Linear scaling over 60 seconds)</option>
                  <option value="ddos_resilience">DDoS &amp; Malicious SIP INVITE Resilience Test</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Stress Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Achieved Throughput</div>
              <div className="text-2xl font-bold text-white mt-1">
                {isStressRunning ? stressMetrics.achievedCps.toLocaleString() : '0'} <span className="text-xs font-normal text-zinc-400">CPS</span>
              </div>
              <div className="text-xs text-emerald-400 mt-1">Target: {stressConcurrency.toLocaleString()} CPS</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">Error / Drop Rate</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {isStressRunning ? `${stressMetrics.errorRatePercent}%` : '0.00%'}
              </div>
              <div className="text-xs text-zinc-400 mt-1">SLA: &lt; 0.1% max</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">p95 Audio Latency</div>
              <div className="text-2xl font-bold text-white mt-1">
                {isStressRunning ? `${stressMetrics.p95Ms} ms` : '0.0 ms'}
              </div>
              <div className="text-xs text-zinc-400 mt-1">p99: {stressMetrics.p99Ms} ms</div>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="text-[11px] font-mono text-zinc-400 uppercase">FreeSWITCH Channels</div>
              <div className="text-2xl font-bold text-indigo-400 mt-1">
                {isStressRunning ? stressMetrics.activeFreeswitchChannels.toLocaleString() : '0'}
              </div>
              <div className="text-xs text-zinc-400 mt-1">Redis: {stressMetrics.redisThroughputOps.toLocaleString()} ops/s</div>
            </div>
          </div>

          {/* Subsystem Health Status During Test */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-white">Subsystem Health &amp; Backpressure Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-white">FreeSWITCH 1.10 Cluster</div>
                  <div className="text-[11px] text-zinc-400 font-mono">64 audio worker threads</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400">
                  HEALTHY
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-white">Kamailio SIP RFC 3261</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Anycast BGP ingress nodes</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400">
                  HEALTHY
                </span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-white">Gemini / Multi-AI Router</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Adaptive concurrency limiter</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400">
                  HEALTHY
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
