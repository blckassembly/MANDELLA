export type DataverseFieldType =
  | 'string'
  | 'number'
  | 'decimal'
  | 'boolean'
  | 'datetime'
  | 'lookup'
  | 'picklist'
  | 'json'
  | 'encrypted';

export interface DataverseField {
  name: string;
  displayName: string;
  type: DataverseFieldType;
  required: boolean;
  unique?: boolean;
  searchable?: boolean;
  lookupTargetEntity?: string; // If type is lookup
  picklistOptions?: string[]; // If type is picklist
  isEncrypted?: boolean;
  fieldLevelSecurityRole?: string; // e.g. 'compliance_admin'
  description?: string;
  defaultValue?: any;
}

export interface DataverseEntitySchema {
  id: string;
  name: string; // e.g. 'fs_account', 'fs_opportunity', 'fs_case'
  displayName: string;
  category: 'core' | 'sales' | 'marketing' | 'service' | 'telecom' | 'custom';
  description: string;
  primaryField: string;
  fields: DataverseField[];
  recordCount: number;
  version: number;
  tenantScoped: boolean;
  aiAccessible: boolean;
  retentionYears: number;
  createdAt: string;
  updatedAt: string;
}

export interface DataverseRelationship {
  id: string;
  name: string;
  fromEntity: string;
  fromField: string;
  toEntity: string;
  toField: string;
  type: '1:N' | 'N:1' | 'N:N';
  cascadeDelete: boolean;
  description: string;
}

export interface RecordVersionHistory {
  versionNumber: number;
  timestamp: string;
  changedBy: string;
  action: 'create' | 'update' | 'restore';
  changes: Record<string, { oldValue: any; newValue: any }>;
  integrityHash: string; // SHA-256 for tampering detection
}

export interface DataverseRecord {
  id: string;
  entityName: string;
  tenantId: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  attributes: Record<string, any>;
  versionHistory: RecordVersionHistory[];
}

export interface DataverseTenant {
  id: string;
  name: string;
  domain: string;
  plan: 'enterprise' | 'sovereign_operator' | 'fintech_cloud';
  region: string;
  dataIsolationMode: 'logical_schema' | 'dedicated_keyspace';
  recordsTotal: number;
  storageMb: number;
  encryptionKeyAlias: string;
  status: 'active' | 'suspended';
}

export interface DataverseEventSubscription {
  id: string;
  name: string;
  targetEntity: string; // or '*'
  eventType: 'create' | 'update' | 'delete' | 'all';
  destinationType: 'webhook' | 'kafka_topic' | 'internal_workflow';
  destinationEndpoint: string;
  status: 'active' | 'paused';
  retryPolicy: 'immediate' | 'exponential_backoff';
  dispatchedCount: number;
  failureCount: number;
  lastFired?: string;
}

export interface DataverseSecurityRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: {
    entity: string; // or '*'
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canExport: boolean;
    canExecuteAi: boolean;
  }[];
}

export interface DataverseAuditLog {
  id: string;
  timestamp: string;
  tenantId: string;
  userId: string;
  userRole: string;
  action: 'QUERY' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SCHEMA_ALTER' | 'AI_ACCESS' | 'EXPORT';
  entityName: string;
  recordId?: string;
  ipAddress: string;
  status: 'SUCCESS' | 'DENIED_RBAC' | 'VALIDATION_FAILED';
  hashVerification: string;
  details: string;
}

export interface AiDataServicePolicy {
  id: string;
  serviceName: string;
  allowedEntities: string[];
  deniedFields: string[]; // e.g. ['bvn_tax_id', 'bank_account_number']
  maxRowsPerQuery: number;
  requireDualApprovalForWrites: boolean;
  semanticSearchActive: boolean;
  status: 'enforcing' | 'monitoring';
}
