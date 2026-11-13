import React from 'react';

/**
 * MANDELA OS — Unified 30-Application Type Contracts
 * 
 * Formal definitions for all 30 native applications across the three tiers:
 * Tier 01: Enterprise Telecom Core (11 Applications)
 * Tier 02: Mandela Agnostic OS (11 Applications)
 * Tier 03: Customer Self-Service Portal (8 Applications)
 */

export type OperatingSystemTier = 'enterprise' | 'agnostic' | 'customer';

export type WorkspaceViewType =
  | 'dashboard'
  | 'table'
  | 'topology'
  | 'map'
  | 'editor'
  | 'terminal'
  | 'analytics'
  | 'settings'
  | 'custom';

export type DataSourceStatus = 'CONNECTED' | 'SYNCHRONIZED' | 'DEGRADED' | 'DISCONNECTED';

export interface DataSourceMeta {
  sourceId: string;
  providerName: string;
  sourceType:
    | 'sip_freeswitch'
    | 'kamailio_anycast'
    | 'rtpengine_nat'
    | 'smpp_mno'
    | 'itu_e164_redis'
    | 'gsma_esim_vault'
    | 'satellite_ntn'
    | 'dataverse_lakehouse'
    | 'siem_flink'
    | 'ai_rawnet3_speech'
    | 'mobile_money_mpesa'
    | 'n8n_dag_engine'
    | 'rest_openapi';
  owningAppId: string;
  tenantScope: 'isolated' | 'global_carrier' | 'hybrid';
  connectionStatus: DataSourceStatus;
  lastSyncTimestamp: string;
  latencyAvgMs: number;
  supportedReadOperations: string[];
  supportedWriteOperations: string[];
  authenticationState: 'authenticated' | 'cert_pinned' | 'unverified';
  errorState?: string;
  auditProvenance: string;
}

export interface MandelaModule {
  id: string;
  label: string;
  route: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description: string;
  dataSourceIds: string[];
  requiredPermissions: string[];
  workspaceType: WorkspaceViewType;
  primaryActionLabel?: string;
}

export interface MandelaApplication {
  id: string;
  code: string; // e.g. "E01", "O02", "C03"
  name: string;
  shortName: string;
  tier: OperatingSystemTier;
  tierLabel: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  baseRoute: string;
  description: string;
  strategicFunction: string;
  defaultModuleId: string;
  modules: MandelaModule[];
  dataSources: string[];
  requiredPermissions: string[];
  activeStatus: 'HEALTHY' | 'SYNCHRONIZING' | 'RESTRICTED';
}

export interface AppRouteParams {
  tier: OperatingSystemTier;
  appId: string;
  moduleId: string;
  subView?: string;
  recordId?: string;
}

export interface WorkspaceRecordItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  status: 'ACTIVE' | 'PENDING' | 'WARNING' | 'FAILED' | 'ARCHIVED';
  metrics?: Record<string, string | number>;
  attributes: Record<string, any>;
  lastUpdated: string;
  provenance: string;
}

export interface WorkspaceKpiMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  changePercent?: number;
  isPositiveChange?: boolean;
  status: 'nominal' | 'warning' | 'critical' | 'informational';
  caption?: string;
}
