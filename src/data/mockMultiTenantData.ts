import {
  SubscriptionPlanDetails,
  TenantAccount,
  SubscriptionTier
} from '../types/multiTenant';

export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, SubscriptionPlanDetails> = {
  starter_sme: {
    tier: 'starter_sme',
    displayName: 'Starter SME',
    badgeColor: 'border-slate-700 bg-slate-800 text-slate-300',
    monthlyFeeUsd: 149,
    billingCycle: 'monthly',
    allowedProducts: ['voice_ivr', 'messaging_sms', 'nms_numbers'],
    limits: {
      maxCps: 50,
      monthlySmsQuota: 25000,
      maxVoiceChannels: 10,
      maxDataverseStorageMb: 250,
      maxSmppBinds: 1,
      didsIncluded: 5
    },
    features: [
      'Customer & Self-Service Portal',
      'Local DID routing (up to 5 numbers)',
      'Basic SMS Campaign Dispatcher (25k/mo)',
      'Consumer Voice Hotline (10 concurrent)',
      'Standard Webhook Notifications',
      'Community & Email Support (24h SLA)'
    ]
  },
  growth_business: {
    tier: 'growth_business',
    displayName: 'Growth Business',
    badgeColor: 'border-sky-700 bg-sky-950/60 text-sky-300',
    monthlyFeeUsd: 1200,
    billingCycle: 'monthly',
    allowedProducts: ['dataverse', 'voice_ivr', 'messaging_sms', 'nms_numbers'],
    limits: {
      maxCps: 250,
      monthlySmsQuota: 250000,
      maxVoiceChannels: 60,
      maxDataverseStorageMb: 2000,
      maxSmppBinds: 5,
      didsIncluded: 25
    },
    features: [
      'Customer & Self-Service Portal',
      'MANDELA Dataverse Client (2 GB storage)',
      'Voice IVR with 5 African Languages TTS',
      'USSD Simulator & Session Gateway',
      'SMS Route Failover Engine',
      'Developer API & Custom Webhooks',
      'Phone & Priority Chat Support (4h SLA)'
    ]
  },
  fintech_enterprise: {
    tier: 'fintech_enterprise',
    displayName: 'Enterprise FinTech',
    badgeColor: 'border-emerald-600 bg-emerald-950/60 text-emerald-300',
    monthlyFeeUsd: 4800,
    billingCycle: 'monthly',
    allowedProducts: [
      'dataverse',
      'edge_defense',
      'siem_fabric',
      'ai_anomaly_voice',
      'soc_c2',
      'voice_ivr',
      'messaging_sms',
      'nms_numbers'
    ],
    limits: {
      maxCps: 1500,
      monthlySmsQuota: 2500000,
      maxVoiceChannels: 400,
      maxDataverseStorageMb: 15000,
      maxSmppBinds: 20,
      didsIncluded: 100
    },
    features: [
      'Full MANDELA Dataverse Multi-Tenant Platform',
      'Voice Biometrics Speaker Authentication Layer',
      '50 African Language Models & Code-Switching ASR',
      'Direct SMPP v5 & SIGTRAN MAP Binds (20 binds)',
      'Regulatory NMS Number Inventory & Porting',
      'Automated SMS to USSD Fallback (>98% delivery)',
      'Dedicated Customer Success Manager & 99.99% SLA'
    ]
  },
  sovereign_telco: {
    tier: 'sovereign_telco',
    displayName: 'Sovereign Telco Operator',
    badgeColor: 'border-amber-500 bg-amber-950/70 text-amber-300',
    monthlyFeeUsd: 18500,
    billingCycle: 'monthly',
    allowedProducts: [
      'dataverse',
      'edge_defense',
      'siem_fabric',
      'ai_anomaly_voice',
      'soc_c2',
      'sbc_core',
      'interconnect',
      'voice_ivr',
      'messaging_sms',
      'nms_numbers'
    ],
    limits: {
      maxCps: 10000,
      monthlySmsQuota: 50000000,
      maxVoiceChannels: 5000,
      maxDataverseStorageMb: 100000,
      maxSmppBinds: 200,
      didsIncluded: 1000
    },
    features: [
      'Own Carrier Edge: Kamailio + FreeSWITCH Anycast (6 PoPs)',
      'Carrier Interconnect & LCRq Dynamic Rate Mediation Engine',
      '100+ Carrier Rate Deck Ingestion & Grey Route AI Quarantine',
      'Kafka Real-time CDR Mediation with Margin Protection (<5s)',
      'Dedicated HSM Sovereign Data Residency & Custom KMS',
      'Unlimited Concurrency & 10,000 Calls/sec Peak Throughput',
      '24/7 Dedicated NOC Bridge & 99.999% Telecom Core SLA'
    ]
  },
  satellite_operator: {
    tier: 'satellite_operator',
    displayName: 'Satellite & NTN Carrier Core',
    badgeColor: 'border-sky-500 bg-sky-950/70 text-sky-300',
    monthlyFeeUsd: 26000,
    billingCycle: 'monthly',
    allowedProducts: [
      'dataverse',
      'edge_defense',
      'siem_fabric',
      'ai_anomaly_voice',
      'soc_c2',
      'sbc_core',
      'interconnect',
      'satellite_ntn',
      'voice_ivr',
      'messaging_sms',
      'nms_numbers'
    ],
    limits: {
      maxCps: 15000,
      monthlySmsQuota: 75000000,
      maxVoiceChannels: 8000,
      maxDataverseStorageMb: 250000,
      maxSmppBinds: 250,
      didsIncluded: 2500
    },
    features: [
      'LEO/GEO Teleport Gateway & Ground Station Interconnect',
      '3GPP Rel-17/18 Direct-to-Device (D2D) Satellite Signaling',
      'Doppler Shift Latency Compensation & Adaptive Jitter Buffer',
      'Emergency SOS E-911/112 Regulatory Bypass for Wilderness/Offshore',
      'Dynamic Satellite Beam Handover & Overpass Tracking',
      'Cross-border Landing Rights & Pan-African Frequency Compliance',
      'High-priority Interconnect with 6 African Ground Stations'
    ]
  },
  root_admin: {
    tier: 'root_admin',
    displayName: 'Global Root Multi-Tenant Admin',
    badgeColor: 'border-purple-500 bg-purple-950/80 text-purple-300',
    monthlyFeeUsd: 0,
    billingCycle: 'annual',
    allowedProducts: [
      'dataverse',
      'edge_defense',
      'siem_fabric',
      'ai_anomaly_voice',
      'soc_c2',
      'sbc_core',
      'interconnect',
      'satellite_ntn',
      'voice_ivr',
      'messaging_sms',
      'nms_numbers'
    ],
    limits: {
      maxCps: 50000,
      monthlySmsQuota: 999999999,
      maxVoiceChannels: 50000,
      maxDataverseStorageMb: 500000,
      maxSmppBinds: 1000,
      didsIncluded: 50000
    },
    features: [
      'Full Multi-Tenant Control & Global Platform Orchestration',
      'Cross-Tenant Key Management & Isolation Inspection',
      'Carrier Wholesale Binds, Peering & BGP AS37105 Routing',
      'Global License Registry & Sovereign Compliance Approvals',
      'Full Access Across Enterprise Core & Customer Portals'
    ]
  }
};

export const INITIAL_TENANT_ACCOUNTS: TenantAccount[] = [
  {
    id: 'tenant-ke-safaricom-01',
    name: 'Safaricom Enterprise & Wholesale',
    slug: 'safaricom-ke',
    country: 'Kenya',
    countryCode: 'KE',
    region: 'East Africa (Nairobi Hub AS37105)',
    industry: 'Telecommunications & Carrier Wholesale',
    domain: 'safaricom.co.ke',
    logoInitial: 'S',
    accentColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800',
    subscription: SUBSCRIPTION_TIERS.sovereign_telco,
    status: 'active',
    dataIsolationMode: 'dedicated_keyspace',
    encryptionKeyAlias: 'kms/east-africa/safaricom-sovereign-master',
    apiKey: 'mandela_live_sfcm_99a8b1c4e7230198f4',
    registeredAdminEmail: 'telco-core@safaricom.co.ke',
    createdAt: '2025-11-15',
    usage: {
      smsDeliveredThisMonth: 14890200,
      voiceMinutesThisMonth: 3420800,
      activeDids: 480,
      dataverseRecordsTotal: 549100,
      dataverseStorageMb: 4210.8,
      currentMonthSpendUsd: 22450.0,
      accountBalanceUsd: 142800.0
    }
  },
  {
    id: 'tenant-ng-ecobank-02',
    name: 'Ecobank Pan-Africa Payments',
    slug: 'ecobank-group',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'West Africa (Lagos Pod-1)',
    industry: 'Banking & Financial Technology',
    domain: 'ecobank.com',
    logoInitial: 'E',
    accentColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-800',
    subscription: SUBSCRIPTION_TIERS.fintech_enterprise,
    status: 'active',
    dataIsolationMode: 'dedicated_keyspace',
    encryptionKeyAlias: 'kms/west-africa/ecobank-fintech-master',
    apiKey: 'mandela_live_ecob_77f4e190ba329482ca',
    registeredAdminEmail: 'security-infosec@ecobank.com',
    createdAt: '2026-01-20',
    usage: {
      smsDeliveredThisMonth: 1845200,
      voiceMinutesThisMonth: 182400,
      activeDids: 45,
      dataverseRecordsTotal: 184520,
      dataverseStorageMb: 1420.5,
      currentMonthSpendUsd: 6420.0,
      accountBalanceUsd: 38500.0
    }
  },
  {
    id: 'tenant-gh-bima-03',
    name: 'BIMA Health & Microinsurance',
    slug: 'bima-ghana',
    country: 'Ghana',
    countryCode: 'GH',
    region: 'West Africa (Accra Pod-2)',
    industry: 'InsurTech & Rural Health Services',
    domain: 'bima.com.gh',
    logoInitial: 'B',
    accentColor: 'text-sky-400 bg-sky-950/40 border-sky-800',
    subscription: SUBSCRIPTION_TIERS.growth_business,
    status: 'active',
    dataIsolationMode: 'logical_schema',
    encryptionKeyAlias: 'kms/west-africa/bima-gh-master',
    apiKey: 'mandela_live_bima_55cd3812fa901238aa',
    registeredAdminEmail: 'ops@bima.com.gh',
    createdAt: '2026-03-05',
    usage: {
      smsDeliveredThisMonth: 142800,
      voiceMinutesThisMonth: 48900,
      activeDids: 18,
      dataverseRecordsTotal: 34100,
      dataverseStorageMb: 310.4,
      currentMonthSpendUsd: 1840.0,
      accountBalanceUsd: 12400.0
    }
  },
  {
    id: 'tenant-tz-agrikikapu-04',
    name: 'AgriKikapu Farmers Cooperative',
    slug: 'agrikikapu-tz',
    country: 'Tanzania',
    countryCode: 'TZ',
    region: 'East Africa (Dar es Salaam Edge)',
    industry: 'Agriculture & Rural Cooperatives',
    domain: 'agrikikapu.co.tz',
    logoInitial: 'A',
    accentColor: 'text-amber-400 bg-amber-950/40 border-amber-800',
    subscription: SUBSCRIPTION_TIERS.starter_sme,
    status: 'active',
    dataIsolationMode: 'logical_schema',
    encryptionKeyAlias: 'kms/east-africa/agrikikapu-master',
    apiKey: 'mandela_live_agri_11ab8832ef749103ee',
    registeredAdminEmail: 'info@agrikikapu.co.tz',
    createdAt: '2026-05-12',
    usage: {
      smsDeliveredThisMonth: 18400,
      voiceMinutesThisMonth: 8200,
      activeDids: 4,
      dataverseRecordsTotal: 8420,
      dataverseStorageMb: 85.0,
      currentMonthSpendUsd: 310.0,
      accountBalanceUsd: 2800.0
    }
  },
  {
    id: 'tenant-sat-oneweb-05',
    name: 'Eutelsat OneWeb & LEO NTN Gateway',
    slug: 'oneweb-space-ntn',
    country: 'Pan-Africa (LEO Constellation)',
    countryCode: 'SAT',
    region: 'LEO Orbit Constellation (Mwembeshi Teleport)',
    industry: 'Satellite Constellation & Non-Terrestrial Network',
    domain: 'oneweb.net',
    logoInitial: 'O',
    accentColor: 'text-sky-400 bg-sky-950/40 border-sky-800',
    subscription: SUBSCRIPTION_TIERS.satellite_operator,
    status: 'active',
    dataIsolationMode: 'dedicated_keyspace',
    encryptionKeyAlias: 'kms/space/oneweb-ntn-sovereign-vault',
    apiKey: 'mandela_live_sat_leo_908812cba1192837ff',
    registeredAdminEmail: 'teleport-noc@oneweb.net',
    createdAt: '2026-02-10',
    usage: {
      smsDeliveredThisMonth: 8940000,
      voiceMinutesThisMonth: 1240000,
      activeDids: 320,
      dataverseRecordsTotal: 412000,
      dataverseStorageMb: 3840.5,
      currentMonthSpendUsd: 31200.0,
      accountBalanceUsd: 210000.0
    }
  },
  {
    id: 'tenant-ng-flutterwave-06',
    name: 'Flutterwave Scale FinTech & Commerce',
    slug: 'flutterwave-hq',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'West Africa (Lagos AS37105)',
    industry: 'FinTech Startup & Pan-African Payments',
    domain: 'flutterwave.com',
    logoInitial: 'F',
    accentColor: 'text-amber-400 bg-amber-950/40 border-amber-800',
    subscription: SUBSCRIPTION_TIERS.fintech_enterprise,
    status: 'active',
    dataIsolationMode: 'dedicated_keyspace',
    encryptionKeyAlias: 'kms/west-africa/flw-vault-primary',
    apiKey: 'mandela_live_flw_sec_884177209144faec99',
    registeredAdminEmail: 'infra-telco@flutterwave.com',
    createdAt: '2026-04-01',
    usage: {
      smsDeliveredThisMonth: 4890000,
      voiceMinutesThisMonth: 340000,
      activeDids: 88,
      dataverseRecordsTotal: 650000,
      dataverseStorageMb: 5200.0,
      currentMonthSpendUsd: 14200.0,
      accountBalanceUsd: 95000.0
    }
  },
  {
    id: 'tenant-root-farsight-00',
    name: 'Mandela Sovereign Telecom Root',
    slug: 'mandela-root',
    country: 'Pan-Africa',
    countryCode: 'AF',
    region: 'Pan-African Anycast Cloud (6 PoPs)',
    industry: 'Sovereign Telecommunications & Infrastructure',
    domain: 'mandela.africa',
    logoInitial: 'M',
    accentColor: 'text-purple-400 bg-purple-950/40 border-purple-800',
    subscription: SUBSCRIPTION_TIERS.root_admin,
    status: 'active',
    dataIsolationMode: 'dedicated_keyspace',
    encryptionKeyAlias: 'kms/root/sovereign-master-key-01',
    apiKey: 'mandela_live_root_00masteradmin77329188',
    registeredAdminEmail: 'root-admin@mandela.africa',
    createdAt: '2025-01-01',
    usage: {
      smsDeliveredThisMonth: 42100000,
      voiceMinutesThisMonth: 9800000,
      activeDids: 1850,
      dataverseRecordsTotal: 980000,
      dataverseStorageMb: 8400.0,
      currentMonthSpendUsd: 0,
      accountBalanceUsd: 1000000.0
    }
  }
];
