export type AfricaRegion = 'East Africa' | 'West Africa' | 'Southern Africa' | 'North Africa' | 'Central Africa';

export type UnifiedNumberType =
  | 'geographic_local'
  | 'national'
  | 'toll_free'
  | 'mobile'
  | 'alphanumeric_sender_id';

export type NumberCapability = 'voice' | 'sms' | 'mms' | 'fax' | 'emergency' | 'ussd';

export type InventoryStatus = 'available' | 'reserved' | 'active' | 'depleted' | 'quarantined';

export type SupplierProviderId = 'didww' | 'twilio' | 'didlogic' | 'direct_mno';

export type SupplierVerificationState = 'verified_live' | 'stale_cached' | 'unverified_warning';

export interface AfricaCountryMetadata {
  iso2: string; // e.g. "KE"
  iso3: string; // e.g. "KEN"
  numericCode: string; // e.g. "404"
  name: string;
  dialCode: string; // e.g. "+254"
  region: AfricaRegion;
  economicBloc: string; // e.g. "EAC", "ECOWAS", "SADC", "COMESA", "AMU"
  regulatorName: string; // e.g. "Communications Authority of Kenya (CA)"
  regulatorAcronym: string;
  flagEmoji: string;
  capitalCity: string;
  localCurrencyCode: string; // e.g. "KES"
  currencySymbol: string;
  exchangeRateToUsd: number;
  // ITU National Numbering Plan (NNP) Specifications
  ituRules: {
    subscriberLengthMin: number;
    subscriberLengthMax: number;
    nationalDestinationCodes: string[]; // e.g. ["20" (Nairobi), "41" (Mombasa), "70" (Mobile)]
    trunkPrefix: string; // e.g. "0"
    internationalPrefix: string; // e.g. "000" or "+"
    emergencyNumbers: string[]; // e.g. ["999", "112"]
    notes: string;
  };
  // Sovereign Regulatory Compliance Requirements
  regulatory: {
    kycTierRequired: 1 | 2 | 3;
    localAddressRequired: boolean;
    nationalTaxIdRequired: boolean;
    requiresBusinessRegistration: boolean;
    requiredDocuments: string[]; // e.g. ["Certificate of Incorporation", "Director National ID", "Utility Bill"]
    quarantinePeriodDays: number;
  };
  inventorySummary: {
    totalStock: number;
    available: number;
    reserved: number;
    active: number;
    depletedAreaCodes: number;
  };
}

export interface UnifiedNumberRecord {
  id: string;
  e164: string; // e.g. "+254207901000"
  nationalFormat: string; // e.g. "020 790 1000"
  countryIso2: string;
  countryName: string;
  region: AfricaRegion;
  cityOrArea: string; // e.g. "Nairobi", "Lagos", "Johannesburg"
  areaCode: string; // e.g. "20", "1", "11"
  numberType: UnifiedNumberType;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
    fax: boolean;
    emergency: boolean;
    ussd: boolean;
  };
  provider: SupplierProviderId;
  providerDisplayName: string;
  carrierNetwork: string; // e.g. "Safaricom PLC", "MTN Nigeria", "Vodacom SA"
  supplierMetadata: {
    supplierId: string;
    supplierNumberId: string;
    verificationState: SupplierVerificationState;
    latencyMs: number;
    lastSynchronizedAt: string;
    isSimulated: boolean;
  };
  pricing: {
    setupFeeUsd: number;
    monthlyRentalUsd: number;
    inboundVoicePerMinUsd: number;
    inboundSmsPerMsgUsd: number;
    localMonthlyRental: number;
    localCurrency: string;
    currencySymbol: string;
  };
  regulatoryRequirements: {
    kycTier: 1 | 2 | 3;
    localAddressRequired: boolean;
    taxCertificateRequired: boolean;
    approvalTimeHours: number;
  };
  status: InventoryStatus;
  reservation?: {
    reservedByTenantId: string;
    reservedAt: string;
    expiresAt: string;
    lockToken: string;
    remainingSeconds: number;
  };
  assignment?: {
    assignedToTenantId: string;
    assignedAt: string;
    voiceOsBridgeTarget?: string; // SIP Trunk or FreeSWITCH IVR flow ID
    messagingOsTarget?: string; // SMPP bind ID or Webhook URL
  };
}

export interface SupplierSyncJobResult {
  jobId: string;
  startedAt: string;
  completedAt: string;
  status: 'completed' | 'running' | 'failed';
  providersSynced: {
    provider: SupplierProviderId;
    name: string;
    numbersDiscovered: number;
    numbersUpdated: number;
    durationMs: number;
    status: 'ok' | 'degraded' | 'error';
    message: string;
  }[];
  totalInventoryCount: number;
  cacheTtlSeconds: number;
}

export interface ReplenishmentForecastItem {
  id: string;
  countryIso2: string;
  countryName: string;
  areaCode: string;
  cityName: string;
  currentAvailableStock: number;
  dailyDepletionRate: number;
  projectedStockoutDays: number;
  recommendedReplenishmentCount: number;
  primarySupplier: SupplierProviderId;
  urgencyLevel: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  notes: string;
}
