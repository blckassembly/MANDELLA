import { EnterpriseProduct, TenantAccount } from './multiTenant';

export type NmcpLayerStatus = 'nominal' | 'degraded' | 'critical' | 'quarantined';

export interface NmcpLayerState {
  layerId: string; // '01' through '11'
  productId: EnterpriseProduct;
  name: string;
  category: string;
  status: NmcpLayerStatus;
  healthScore: number; // 0 - 100
  latencyMs: number;
  throughputPps: number;
  activeAlarms: string[];
  keyMetrics: Record<string, string | number>;
  lastHeartbeat: string;
}

export interface NmcpTenantSlice {
  tenantId: string;
  tenantName: string;
  countryCode: string;
  isolationMode: 'dedicated_keyspace' | 'logical_schema';
  keyspace: string;
  allocatedCps: number;
  currentCps: number;
  cpsUtilizationPct: number;
  activeDids: number;
  activeBinds: number;
  monthlySpendUsd: number;
  quarantineStatus: 'clean' | 'monitoring' | 'quarantined';
  slaCompliancePct: number;
  anomaliesDetected: number;
}

export interface NmcpAnomalyEvent {
  id: string;
  layerId: string;
  layerName: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedTenantId: string;
  timestamp: string;
  recommendedPlaybook: string;
  remediationActionKey: string;
  resolved: boolean;
}

export interface NmcpAiUnderstanding {
  situationHeadline: string;
  executiveSummary: string;
  riskLevel: 'LOW' | 'ELEVATED' | 'CRITICAL';
  rootCauseAnalysis: string;
  crossLayerCorrelations: string[];
  immediateActionItems: {
    id: string;
    action: string;
    targetLayer: string;
    automated: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
  lastAnalyzedAt: string;
  confidenceScore: number; // 0 - 1
  reasoningModel: string;
}

export interface NmcpContextSnapshot {
  controlPlaneVersion: string;
  epoch: number;
  timestamp: string;
  globalHealthScore: number;
  securityPostureIndex: number; // 0 - 100
  activeTenantId: string;
  totalActiveTenants: number;
  aggregateCps: number;
  aggregateTrafficGbps: number;
  layers: Record<string, NmcpLayerState>;
  tenantSlices: NmcpTenantSlice[];
  activeAnomalies: NmcpAnomalyEvent[];
  aiUnderstanding: NmcpAiUnderstanding;
}

export interface NmcpReasoningRequest {
  snapshot?: NmcpContextSnapshot;
  userPrompt?: string;
  targetTenantId?: string;
  model?: 'gemini-3.8-flash' | 'gemini-4-argon' | 'gemini-3.1-flash-lite';
}

export interface NmcpReasoningResponse {
  understanding: NmcpAiUnderstanding;
  model: string;
  latencyMs: number;
  timestamp: string;
}
