import {
  DataverseEntitySchema,
  DataverseRelationship,
  DataverseRecord,
  DataverseTenant,
  DataverseEventSubscription,
  DataverseSecurityRole,
  DataverseAuditLog,
  AiDataServicePolicy
} from '../types/dataverse';

export const INITIAL_TENANTS: DataverseTenant[] = [
  {
    id: 'tenant-fs-8812',
    name: 'Farsight Financial Cloud',
    domain: 'farsight.mandela.africa',
    plan: 'fintech_cloud',
    region: 'West Africa (Lagos Pod-1)',
    dataIsolationMode: 'dedicated_keyspace',
    recordsTotal: 184520,
    storageMb: 1420.5,
    encryptionKeyAlias: 'kms/west-africa/farsight-sovereign-master',
    status: 'active'
  },
  {
    id: 'tenant-mo-9901',
    name: 'Mandela Telecom Core Ops',
    domain: 'telecom.mandela.africa',
    plan: 'sovereign_operator',
    region: 'Pan-African Anycast',
    dataIsolationMode: 'dedicated_keyspace',
    recordsTotal: 549100,
    storageMb: 4210.8,
    encryptionKeyAlias: 'kms/anycast/telecom-core-master',
    status: 'active'
  },
  {
    id: 'tenant-at-4410',
    name: 'Pan-African AgriTrade Union',
    domain: 'agritrade.mandela.africa',
    plan: 'enterprise',
    region: 'East Africa (Nairobi Pod-2)',
    dataIsolationMode: 'logical_schema',
    recordsTotal: 84200,
    storageMb: 610.2,
    encryptionKeyAlias: 'kms/east-africa/agritrade-master',
    status: 'active'
  }
];

export const INITIAL_SCHEMAS: DataverseEntitySchema[] = [
  {
    id: 'schema-account',
    name: 'fs_account',
    displayName: 'Customer & Enterprise Account',
    category: 'core',
    description: 'Central business entity representing enterprises, institutions, and high-value telco/fintech customers.',
    primaryField: 'account_name',
    recordCount: 1420,
    version: 4,
    tenantScoped: true,
    aiAccessible: true,
    retentionYears: 10,
    createdAt: '2026-01-10',
    updatedAt: '2026-10-10',
    fields: [
      { name: 'id', displayName: 'Account UUID', type: 'string', required: true, unique: true, searchable: true },
      { name: 'account_name', displayName: 'Company / Customer Name', type: 'string', required: true, searchable: true },
      { name: 'sovereign_country', displayName: 'Country ISO', type: 'picklist', required: true, picklistOptions: ['NG', 'KE', 'GH', 'ZA', 'RW', 'EG', 'SN', 'CD'] },
      { name: 'industry', displayName: 'Industry Segment', type: 'picklist', required: true, picklistOptions: ['Commercial Banking', 'Telecommunications', 'Agri-Tech', 'Fintech', 'Government / NGO', 'Logistics'] },
      { name: 'annual_revenue_usd', displayName: 'Annual Revenue (USD)', type: 'decimal', required: false },
      { name: 'primary_msisdn', displayName: 'Primary Sovereign Contact', type: 'string', required: true, searchable: true },
      { name: 'kyc_tier', displayName: 'KYC Regulatory Tier', type: 'picklist', required: true, picklistOptions: ['Tier-1 Basic', 'Tier-2 Verified', 'Tier-3 Sovereign Enterprise'] },
      { name: 'tax_identification_number', displayName: 'Tax ID / BVN / KRA PIN', type: 'encrypted', required: false, isEncrypted: true, fieldLevelSecurityRole: 'compliance_admin' },
      { name: 'credit_limit_usd', displayName: 'Credit Limit (USD)', type: 'decimal', required: false },
      { name: 'active_sip_trunks_count', displayName: 'Provisioned Trunks', type: 'number', required: false, defaultValue: 0 },
      { name: 'assigned_account_manager', displayName: 'Account Manager', type: 'string', required: false }
    ]
  },
  {
    id: 'schema-opportunity',
    name: 'fs_opportunity',
    displayName: 'Sales Opportunity & Deal Pipeline',
    category: 'sales',
    description: 'Tracks revenue pipeline, enterprise voice/SMS interconnect deals, and contract negotiations.',
    primaryField: 'deal_name',
    recordCount: 3840,
    version: 3,
    tenantScoped: true,
    aiAccessible: true,
    retentionYears: 7,
    createdAt: '2026-02-15',
    updatedAt: '2026-10-09',
    fields: [
      { name: 'id', displayName: 'Deal UUID', type: 'string', required: true, unique: true },
      { name: 'deal_name', displayName: 'Opportunity Name', type: 'string', required: true, searchable: true },
      { name: 'account_id', displayName: 'Customer Account', type: 'lookup', required: true, lookupTargetEntity: 'fs_account' },
      { name: 'deal_value_usd', displayName: 'Expected Contract Value (USD)', type: 'decimal', required: true },
      { name: 'stage', displayName: 'Pipeline Stage', type: 'picklist', required: true, picklistOptions: ['Prospecting', 'Qualification', 'Technical Pilot (SIP/SMPP)', 'Negotiation', 'Closed Won', 'Closed Lost'] },
      { name: 'win_probability', displayName: 'Probability (%)', type: 'number', required: true },
      { name: 'target_close_date', displayName: 'Estimated Close Date', type: 'datetime', required: true },
      { name: 'product_category', displayName: 'Telecom Product', type: 'picklist', required: true, picklistOptions: ['Carrier Interconnect', 'Anycast SBC Trunk', 'SMS & USSD Gateway', 'Sovereign DID Range', 'Voice IVR Cloud'] },
      { name: 'minimum_monthly_commitment', displayName: 'Monthly Commitment (USD)', type: 'decimal', required: false }
    ]
  },
  {
    id: 'schema-campaign',
    name: 'fs_campaign',
    displayName: 'Marketing Campaign & Audience',
    category: 'marketing',
    description: 'Manages outbound voice broadcasts, SMS farmer alerts, and USSD financial literacy campaigns.',
    primaryField: 'campaign_name',
    recordCount: 890,
    version: 2,
    tenantScoped: true,
    aiAccessible: true,
    retentionYears: 3,
    createdAt: '2026-03-01',
    updatedAt: '2026-10-08',
    fields: [
      { name: 'id', displayName: 'Campaign UUID', type: 'string', required: true, unique: true },
      { name: 'campaign_name', displayName: 'Campaign Name', type: 'string', required: true, searchable: true },
      { name: 'channel_type', displayName: 'Delivery Channel', type: 'picklist', required: true, picklistOptions: ['SMS Notification', 'Interactive USSD (*384#)', 'Outbound Voice IVR', 'Omnichannel Dual-Track'] },
      { name: 'target_reach_msisdns', displayName: 'Target Audience Size', type: 'number', required: true },
      { name: 'budget_usd', displayName: 'Campaign Budget (USD)', type: 'decimal', required: true },
      { name: 'delivered_count', displayName: 'Confirmed Deliveries', type: 'number', required: false, defaultValue: 0 },
      { name: 'conversion_rate', displayName: 'Response Rate (%)', type: 'decimal', required: false },
      { name: 'status', displayName: 'Campaign Status', type: 'picklist', required: true, picklistOptions: ['Draft', 'Scheduled', 'In Flight', 'Completed', 'Paused'] },
      { name: 'consent_registry_verified', displayName: 'NDPR / DPA Consent Checked', type: 'boolean', required: true, defaultValue: true }
    ]
  },
  {
    id: 'schema-case',
    name: 'fs_case',
    displayName: 'Customer Service & Telecom Support Case',
    category: 'service',
    description: 'Handles support inquiries, network NOC escalations, billing questions, and IVR triage tickets.',
    primaryField: 'ticket_number',
    recordCount: 5120,
    version: 3,
    tenantScoped: true,
    aiAccessible: true,
    retentionYears: 5,
    createdAt: '2026-02-01',
    updatedAt: '2026-10-10',
    fields: [
      { name: 'id', displayName: 'Case UUID', type: 'string', required: true, unique: true },
      { name: 'ticket_number', displayName: 'Ticket Number', type: 'string', required: true, unique: true, searchable: true },
      { name: 'account_id', displayName: 'Customer Account', type: 'lookup', required: true, lookupTargetEntity: 'fs_account' },
      { name: 'subject', displayName: 'Issue Summary', type: 'string', required: true, searchable: true },
      { name: 'priority', displayName: 'Severity Level', type: 'picklist', required: true, picklistOptions: ['Critical P1 (Outage)', 'High P2 (Degraded)', 'Medium P3', 'Low P4'] },
      { name: 'case_category', displayName: 'Category', type: 'picklist', required: true, picklistOptions: ['SIP Trunk Signaling', 'SMS Delivery DLR', 'Voice Quality MOS', 'Number Porting LOA', 'Billing & Margin'] },
      { name: 'status', displayName: 'Ticket Status', type: 'picklist', required: true, picklistOptions: ['New', 'In Investigation', 'Escalated to NOC', 'Pending Customer', 'Resolved', 'Closed'] },
      { name: 'sla_breach_deadline', displayName: 'SLA Resolution Target', type: 'datetime', required: true },
      { name: 'resolution_summary', displayName: 'Resolution Notes', type: 'string', required: false }
    ]
  },
  {
    id: 'schema-telecom-asset',
    name: 'fs_telecom_asset',
    displayName: 'Sovereign Number & Interconnect Asset',
    category: 'telecom',
    description: 'Maps sovereign telecom inventory, Kamailio dispatch trunks, and carrier interconnect bonds to customer accounts.',
    primaryField: 'asset_identifier',
    recordCount: 9450,
    version: 2,
    tenantScoped: true,
    aiAccessible: true,
    retentionYears: 10,
    createdAt: '2026-03-20',
    updatedAt: '2026-10-10',
    fields: [
      { name: 'id', displayName: 'Asset UUID', type: 'string', required: true, unique: true },
      { name: 'asset_identifier', displayName: 'E.164 DID / Trunk Tag', type: 'string', required: true, searchable: true },
      { name: 'account_id', displayName: 'Assigned Customer Account', type: 'lookup', required: true, lookupTargetEntity: 'fs_account' },
      { name: 'asset_type', displayName: 'Asset Type', type: 'picklist', required: true, picklistOptions: ['Sovereign DID Number', 'Dedicated SIP Trunk', 'SMPP v5 Transceiver Bind', 'USSD Short Code', 'Anycast PoP Allocation'] },
      { name: 'sovereign_license_ref', displayName: 'Regulator License Ref', type: 'string', required: false },
      { name: 'monthly_rate_usd', displayName: 'Monthly Recurring Rate (USD)', type: 'decimal', required: true },
      { name: 'provisioned_pop', displayName: 'Primary Edge PoP', type: 'picklist', required: true, picklistOptions: ['LOS (Lagos)', 'NBO (Nairobi)', 'JNB (Johannesburg)', 'CAI (Cairo)', 'DKR (Dakar)', 'FIH (Kinshasa)'] },
      { name: 'status', displayName: 'Asset Lifecycle Status', type: 'picklist', required: true, picklistOptions: ['Active In Service', 'Reserved', 'Porting In Transit', 'Recycling Buffer', 'Suspended'] }
    ]
  }
];

export const INITIAL_RELATIONSHIPS: DataverseRelationship[] = [
  {
    id: 'rel-acc-opp',
    name: 'Account_Has_Opportunities',
    fromEntity: 'fs_account',
    fromField: 'id',
    toEntity: 'fs_opportunity',
    toField: 'account_id',
    type: '1:N',
    cascadeDelete: false,
    description: 'One customer account owns multiple sales pipeline deals and interconnect contracts.'
  },
  {
    id: 'rel-acc-case',
    name: 'Account_Has_Service_Cases',
    fromEntity: 'fs_account',
    fromField: 'id',
    toEntity: 'fs_case',
    toField: 'account_id',
    type: '1:N',
    cascadeDelete: false,
    description: 'One customer account has service tickets and NOC escalation logs.'
  },
  {
    id: 'rel-acc-asset',
    name: 'Account_Owns_Telecom_Assets',
    fromEntity: 'fs_account',
    fromField: 'id',
    toEntity: 'fs_telecom_asset',
    toField: 'account_id',
    type: '1:N',
    cascadeDelete: false,
    description: 'One customer account is bound to sovereign E.164 numbers and Anycast SIP trunks.'
  }
];

export const INITIAL_RECORDS: DataverseRecord[] = [
  {
    id: 'rec-acc-01',
    entityName: 'fs_account',
    tenantId: 'tenant-fs-8812',
    version: 3,
    createdAt: '2026-03-12T10:30:00Z',
    updatedAt: '2026-10-10T14:15:20Z',
    createdBy: 'secops@farsight.mandela.africa',
    attributes: {
      account_name: 'Zenith Commercial Bank PLC',
      sovereign_country: 'NG',
      industry: 'Commercial Banking',
      annual_revenue_usd: 840000000,
      primary_msisdn: '+23412345678',
      kyc_tier: 'Tier-3 Sovereign Enterprise',
      tax_identification_number: 'NG-TIN-8894102941',
      credit_limit_usd: 500000,
      active_sip_trunks_count: 6,
      assigned_account_manager: 'Ngozi Okonjo-Eze'
    },
    versionHistory: [
      {
        versionNumber: 3,
        timestamp: '2026-10-10T14:15:20Z',
        changedBy: 'secops@farsight.mandela.africa',
        action: 'update',
        changes: {
          active_sip_trunks_count: { oldValue: 4, newValue: 6 },
          credit_limit_usd: { oldValue: 350000, newValue: 500000 }
        },
        integrityHash: 'sha256:8f419c9e01ab881d76503c1fa44319b22'
      },
      {
        versionNumber: 2,
        timestamp: '2026-06-20T08:12:00Z',
        changedBy: 'admin@mandela.africa',
        action: 'update',
        changes: {
          kyc_tier: { oldValue: 'Tier-2 Verified', newValue: 'Tier-3 Sovereign Enterprise' }
        },
        integrityHash: 'sha256:7194ab09ff21034cbb66810a991204d01'
      },
      {
        versionNumber: 1,
        timestamp: '2026-03-12T10:30:00Z',
        changedBy: 'system_bootstrap',
        action: 'create',
        changes: {
          account_name: { oldValue: null, newValue: 'Zenith Commercial Bank PLC' }
        },
        integrityHash: 'sha256:1a84f09911e8c04990b7123aa4f8101a9'
      }
    ]
  },
  {
    id: 'rec-acc-02',
    entityName: 'fs_account',
    tenantId: 'tenant-at-4410',
    version: 2,
    createdAt: '2026-04-05T12:00:00Z',
    updatedAt: '2026-09-18T16:40:00Z',
    createdBy: 'onboarding@agritrade.mandela.africa',
    attributes: {
      account_name: 'Kenya Tea Development Agency (KTDA)',
      sovereign_country: 'KE',
      industry: 'Agri-Tech',
      annual_revenue_usd: 145000000,
      primary_msisdn: '+254722550119',
      kyc_tier: 'Tier-3 Sovereign Enterprise',
      tax_identification_number: 'KE-KRA-991823741',
      credit_limit_usd: 250000,
      active_sip_trunks_count: 3,
      assigned_account_manager: 'Kipchoge Mwangi'
    },
    versionHistory: [
      {
        versionNumber: 2,
        timestamp: '2026-09-18T16:40:00Z',
        changedBy: 'onboarding@agritrade.mandela.africa',
        action: 'update',
        changes: {
          active_sip_trunks_count: { oldValue: 1, newValue: 3 }
        },
        integrityHash: 'sha256:5501ba99238f4d89a1c0993efb11094aa'
      },
      {
        versionNumber: 1,
        timestamp: '2026-04-05T12:00:00Z',
        changedBy: 'system_bootstrap',
        action: 'create',
        changes: {
          account_name: { oldValue: null, newValue: 'Kenya Tea Development Agency (KTDA)' }
        },
        integrityHash: 'sha256:3349aa01827cf499110b9918afca99014'
      }
    ]
  },
  {
    id: 'rec-opp-01',
    entityName: 'fs_opportunity',
    tenantId: 'tenant-fs-8812',
    version: 1,
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-10-09T11:20:00Z',
    createdBy: 'sales_lead@farsight.mandela.africa',
    attributes: {
      deal_name: 'Zenith Cross-Border Payment OTP & USSD Push Expansion',
      account_id: 'rec-acc-01',
      deal_value_usd: 480000,
      stage: 'Negotiation',
      win_probability: 85,
      target_close_date: '2026-11-15T00:00:00Z',
      product_category: 'SMS & USSD Gateway',
      minimum_monthly_commitment: 40000
    },
    versionHistory: [
      {
        versionNumber: 1,
        timestamp: '2026-08-10T09:00:00Z',
        changedBy: 'sales_lead@farsight.mandela.africa',
        action: 'create',
        changes: {
          deal_name: { oldValue: null, newValue: 'Zenith Cross-Border Payment OTP & USSD Push Expansion' }
        },
        integrityHash: 'sha256:aa810293ffb019284ca99104081ba0987'
      }
    ]
  },
  {
    id: 'rec-case-01',
    entityName: 'fs_case',
    tenantId: 'tenant-fs-8812',
    version: 2,
    createdAt: '2026-10-10T08:00:00Z',
    updatedAt: '2026-10-10T15:30:00Z',
    createdBy: 'support_noc@farsight.mandela.africa',
    attributes: {
      ticket_number: 'CAS-2026-0941',
      account_id: 'rec-acc-01',
      subject: 'Lagos Anycast PoP TLS Re-handshake Latency Spike',
      priority: 'High P2 (Degraded)',
      case_category: 'SIP Trunk Signaling',
      status: 'In Investigation',
      sla_breach_deadline: '2026-10-11T00:00:00Z',
      resolution_summary: 'Under investigation by Telecom Core engineering. Traffic automatically balanced across JNB and CAI nodes.'
    },
    versionHistory: [
      {
        versionNumber: 2,
        timestamp: '2026-10-10T15:30:00Z',
        changedBy: 'support_noc@farsight.mandela.africa',
        action: 'update',
        changes: {
          status: { oldValue: 'New', newValue: 'In Investigation' }
        },
        integrityHash: 'sha256:990141bbfa01844781ca0982bb7100411'
      },
      {
        versionNumber: 1,
        timestamp: '2026-10-10T08:00:00Z',
        changedBy: 'support_noc@farsight.mandela.africa',
        action: 'create',
        changes: {
          ticket_number: { oldValue: null, newValue: 'CAS-2026-0941' }
        },
        integrityHash: 'sha256:11940a0129cfba889104fae01991045aa'
      }
    ]
  }
];

export const INITIAL_EVENT_SUBSCRIPTIONS: DataverseEventSubscription[] = [
  {
    id: 'sub-01',
    name: 'Kafka Change Data Capture — Telecom Core Sync',
    targetEntity: '*',
    eventType: 'all',
    destinationType: 'kafka_topic',
    destinationEndpoint: 'kafka://cluster.mandela.internal:9092/dataverse.cdc.events',
    status: 'active',
    retryPolicy: 'exponential_backoff',
    dispatchedCount: 148920,
    failureCount: 0,
    lastFired: '2 mins ago'
  },
  {
    id: 'sub-02',
    name: 'Salesforce & SAP Enterprise Webhook Dispatcher',
    targetEntity: 'fs_account',
    eventType: 'update',
    destinationType: 'webhook',
    destinationEndpoint: 'https://api.farsight.africa/integrations/crm/webhook',
    status: 'active',
    retryPolicy: 'exponential_backoff',
    dispatchedCount: 12430,
    failureCount: 4,
    lastFired: '14 mins ago'
  },
  {
    id: 'sub-03',
    name: 'Negative Margin Detection & Auto-Reroute Trigger',
    targetEntity: 'fs_telecom_asset',
    eventType: 'update',
    destinationType: 'internal_workflow',
    destinationEndpoint: 'workflow://mandela.routing.lcrq/evaluate_margin',
    status: 'active',
    retryPolicy: 'immediate',
    dispatchedCount: 4210,
    failureCount: 0,
    lastFired: '1 hour ago'
  }
];

export const INITIAL_SECURITY_ROLES: DataverseSecurityRole[] = [
  {
    id: 'role-admin',
    name: 'Tenant Administrator',
    description: 'Full schema modification, record lifecycle, export, and security policy control within tenant scope.',
    isSystem: true,
    permissions: [
      { entity: '*', canRead: true, canCreate: true, canUpdate: true, canDelete: true, canExport: true, canExecuteAi: true }
    ]
  },
  {
    id: 'role-steward',
    name: 'Data Steward & Architect',
    description: 'Can define schemas, build relationships, manage retention policies, and monitor data validation.',
    isSystem: true,
    permissions: [
      { entity: '*', canRead: true, canCreate: true, canUpdate: true, canDelete: false, canExport: true, canExecuteAi: true }
    ]
  },
  {
    id: 'role-support',
    name: 'Customer Support Representative',
    description: 'Read-only access to customer accounts and full read/write to service support cases. Encrypted fields hidden.',
    isSystem: false,
    permissions: [
      { entity: 'fs_account', canRead: true, canCreate: false, canUpdate: false, canDelete: false, canExport: false, canExecuteAi: false },
      { entity: 'fs_case', canRead: true, canCreate: true, canUpdate: true, canDelete: false, canExport: false, canExecuteAi: true }
    ]
  },
  {
    id: 'role-ai-agent',
    name: 'AI Agent Service Principal',
    description: 'Restricted programmatic service account for AI assistance with strict field-level guardrails.',
    isSystem: true,
    permissions: [
      { entity: '*', canRead: true, canCreate: false, canUpdate: false, canDelete: false, canExport: false, canExecuteAi: true }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: DataverseAuditLog[] = [
  {
    id: 'aud-01',
    timestamp: '2026-10-11 10:45:12 UTC',
    tenantId: 'tenant-fs-8812',
    userId: 'user_agent_kwame@farsight.africa',
    userRole: 'Tenant Administrator',
    action: 'UPDATE',
    entityName: 'fs_account',
    recordId: 'rec-acc-01',
    ipAddress: '197.210.64.12',
    status: 'SUCCESS',
    hashVerification: 'sha256:d8491c9e88aa1104',
    details: 'Increased credit limit to $500,000 USD for Zenith Commercial Bank PLC. Version incremented to 3.'
  },
  {
    id: 'aud-02',
    timestamp: '2026-10-11 10:30:05 UTC',
    tenantId: 'tenant-fs-8812',
    userId: 'ai_copilot_assistant@mandela.internal',
    userRole: 'AI Agent Service Principal',
    action: 'AI_ACCESS',
    entityName: 'fs_case',
    recordId: 'rec-case-01',
    ipAddress: '10.240.12.88',
    status: 'SUCCESS',
    hashVerification: 'sha256:1a840019284f11a0',
    details: 'Semantic search retrieval for ticket CAS-2026-0941. Sensitive BVN/Tax fields masked by AI policy.'
  },
  {
    id: 'aud-03',
    timestamp: '2026-10-11 09:12:40 UTC',
    tenantId: 'tenant-at-4410',
    userId: 'operator_amara@agritrade.africa',
    userRole: 'Customer Support Representative',
    action: 'CREATE',
    entityName: 'fs_case',
    recordId: 'rec-case-02',
    ipAddress: '105.160.22.45',
    status: 'SUCCESS',
    hashVerification: 'sha256:7761ac901844bb99',
    details: 'Created case ticket for KTDA tea farmer audio prompt failure in Swahili.'
  }
];

export const INITIAL_AI_DATA_POLICY: AiDataServicePolicy = {
  id: 'policy-default',
  serviceName: 'Farsight AI Data Core',
  allowedEntities: ['fs_account', 'fs_opportunity', 'fs_case', 'fs_campaign', 'fs_telecom_asset'],
  deniedFields: ['tax_identification_number', 'encryptionKeyAlias', 'bank_routing_token'],
  maxRowsPerQuery: 50,
  requireDualApprovalForWrites: true,
  semanticSearchActive: true,
  status: 'enforcing'
};
