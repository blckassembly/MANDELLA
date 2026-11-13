export type SubscriptionTier =
  | 'starter_sme'
  | 'growth_business'
  | 'fintech_enterprise'
  | 'sovereign_telco'
  | 'satellite_operator'
  | 'root_admin';

export type PortalMode = 'public_landing' | 'enterprise_suite' | 'customer_portal' | 'agnostic_os' | 'mandela_os';

export type EnterpriseProduct =
  | 'dataverse'
  | 'edge_defense'
  | 'siem_fabric'
  | 'ai_anomaly_voice'
  | 'soc_c2'
  | 'sbc_core'
  | 'interconnect'
  | 'satellite_ntn'
  | 'voice_ivr'
  | 'messaging_sms'
  | 'nms_numbers';

export type CustomerProduct =
  | 'overview'
  | 'services'
  | 'storefront'
  | 'cdrs'
  | 'api_keys'
  | 'billing'
  | 'support'
  | 'sla';

export type InterconnectTab = 'rate_decks' | 'lcr_engine' | 'cdr_stream';

export type SatelliteTab =
  | 'teleport_ground'
  | 'ntn_direct'
  | 'orbit_telemetry'
  | 'maritime_mining';

export type EdgeDefenseTab =
  | 'signaling_firewall'
  | 'sms_firewall'
  | 'stir_shaken'
  | 'ixp_scrubber'
  | 'bypass_guardrails'
  | 'ai_shadow_spec';

export type SiemFabricTab =
  | 'connectors_matrix'
  | 'flink_stateful'
  | 'tiered_storage'
  | 'ai_shadow_spec';

export type AiAnomalyTab =
  | 'phone_velocity'
  | 'tower_simbox'
  | 'ip_ja4'
  | 'voice_deepfake'
  | 'ai_shadow_spec';

export type SocC2Tab =
  | 'threat_matrix'
  | 'simswap_quarantine'
  | 'entity_graph'
  | 'geodesic_map'
  | 'acoustic_lab'
  | 'playbook_automation';

export interface SubscriptionPlanDetails {
  tier: SubscriptionTier;
  displayName: string;
  badgeColor: string;
  monthlyFeeUsd: number;
  billingCycle: 'monthly' | 'annual';
  allowedProducts: EnterpriseProduct[];
  limits: {
    maxCps: number;
    monthlySmsQuota: number;
    maxVoiceChannels: number;
    maxDataverseStorageMb: number;
    maxSmppBinds: number;
    didsIncluded: number;
  };
  features: string[];
}

export interface TenantAccount {
  id: string;
  name: string;
  slug: string;
  country: string;
  countryCode: string;
  region: string;
  industry: string;
  domain: string;
  logoInitial: string;
  accentColor: string;
  subscription: SubscriptionPlanDetails;
  status: 'active' | 'trial' | 'over_quota' | 'suspended';
  dataIsolationMode: 'dedicated_keyspace' | 'logical_schema';
  encryptionKeyAlias: string;
  apiKey: string;
  registeredAdminEmail: string;
  createdAt: string;
  usage: {
    smsDeliveredThisMonth: number;
    voiceMinutesThisMonth: number;
    activeDids: number;
    dataverseRecordsTotal: number;
    dataverseStorageMb: number;
    currentMonthSpendUsd: number;
    accountBalanceUsd: number;
  };
}
