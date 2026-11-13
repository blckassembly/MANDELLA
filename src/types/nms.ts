export type NumberType = 'mobile' | 'fixed' | 'toll-free' | 'short-code';
export type NumberFeature = 'voice' | 'sms' | 'mms' | 'ussd';
export type NumberStatus = 'available' | 'reserved' | 'assigned' | 'porting' | 'recycling' | 'released';

export interface AfricanCountry {
  code: string; // ISO 2 (e.g. 'NG', 'KE', 'GH')
  name: string;
  dialCode: string; // e.g. '+234'
  regulator: string; // e.g. 'NCC (Nigerian Communications Commission)'
  regulatorAcronym: string;
  carriers: string[]; // e.g. ['MTN', 'Airtel', 'Glo', '9mobile']
  availableInventory: number;
  minPriceUsd: number;
  currency: string;
  currencySymbol: string;
  exchangeRateToUsd: number;
  mnpSupported: boolean;
  recyclingPeriodDays: number;
  recyclingRulesSummary: string;
  connectorStatus: 'healthy' | 'degraded' | 'syncing' | 'manual';
  connectorType: 'direct_api' | 'edi_soap' | 'sftp_batch' | 'scrape_fallback';
  lastSyncAt: string;
  kycTierRequired: 1 | 2;
  coordinates: { x: number; y: number }; // Relative coordinates for Africa SVG projection
  flag: string;
}

export interface PhoneNumberRecord {
  id: string;
  e164: string; // e.g. "+2348031234567"
  nationalFormat: string; // e.g. "0803 123 4567"
  countryCode: string;
  countryName: string;
  type: NumberType;
  features: NumberFeature[];
  carrier: string;
  monthlyFeeUsd: number;
  perMinInboundUsd: number;
  perSmsUsd: number;
  status: NumberStatus;
  allocatedTo?: string; // Tenant / User ID
  allocatedAt?: string;
  sipTrunkUri?: string;
  webhookUrl?: string;
  enumRecord?: string; // RFC 3761 E.164 DNS NAPTR record
  kamailioDispatcherId?: number;
  recyclingDueAt?: string;
  lastActivityAt?: string;
  kycVerified: boolean;
}

export interface ConnectorHealth {
  countryCode: string;
  regulator: string;
  connectorType: string;
  status: 'healthy' | 'degraded' | 'syncing' | 'manual';
  latencyMs: number;
  uptime90d: number;
  lastSuccessfulSync: string;
  pendingTransactions: number;
  notes: string;
}

export interface PortingRequest {
  id: string;
  number: string;
  countryCode: string;
  currentCarrier: string;
  targetCarrier: string; // Mandela Kamailio Network
  status: 'requested' | 'submitted' | 'in-progress' | 'completed' | 'rejected';
  submittedAt: string;
  estimatedCompletionAt: string;
  completedAt?: string;
  subscriberName: string;
  loaDocumentName: string;
  nationalIdOrCac: string;
  rejectionReason?: string;
}

export interface SovereignLicense {
  id: string;
  countryCode: string;
  countryName: string;
  licenseNumber: string;
  licenseName: string; // e.g. "National Unified Access Service (UASL)"
  regulator: string;
  issuedAt: string;
  expiresAt: string;
  status: 'active' | 'pending_renewal' | 'under_audit';
  documentUrl: string;
  authorizedRanges: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: 'PROVISION_NUMBER' | 'BIND_SIP_TRUNK' | 'INITIATE_PORT' | 'RECYCLE_TRIGGERED' | 'REGULATORY_REPORT_FILED' | 'LICENSE_UPLOADED';
  e164?: string;
  countryCode: string;
  details: string;
  verificationHash: string;
}

export interface KycProfile {
  id: string;
  entityName: string;
  tier: 0 | 1 | 2; // 0 = unverified, 1 = basic, 2 = enterprise
  registeredCountry: string;
  identificationType: string; // NIN, Ghana Card, CAC, Huduma Namba
  identificationNumber: string;
  status: 'verified' | 'pending' | 'unverified';
  verifiedAt?: string;
}

export interface ProvisioningStep {
  id: string;
  title: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  details?: string;
  durationMs?: number;
}
