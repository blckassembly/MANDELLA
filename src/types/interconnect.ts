export type RoutingStrategy = 'best_quality' | 'cheapest' | 'balanced' | 'custom_lcrq';

export interface CarrierRouteOption {
  carrierId: string;
  carrierName: string;
  countryCode: string;
  prefix: string;
  destinationName: string;
  costPerMinUsd: number;
  mosScore: number; // 1.0 to 5.0
  asrPercent: number; // Answer Seizure Ratio, 0 to 1.0
  acdSeconds: number; // Average Call Duration
  pddMs: number; // Post Dial Delay
  lcrqScore: number; // calculated: cost * (1/mos) * (1/asr)
  isDirectRoute: boolean;
  isGreyRouteSuspected: boolean;
  greyRouteConfidence: number; // 0 to 100%
  status: 'active' | 'degraded' | 'blocked_margin' | 'quarantined';
  lastRateUpdate: string;
}

export interface CarrierRateDeck {
  id: string;
  carrierId: string;
  carrierName: string;
  version: string;
  format: 'CSV' | 'Excel' | 'XML' | 'Carrier-API';
  effectiveDate: string;
  currency: 'USD' | 'EUR' | 'ZAR' | 'NGN' | 'KES';
  totalDestinations: number;
  increasedRatesCount: number;
  decreasedRatesCount: number;
  status: 'active' | 'pending_review' | 'superseded';
  sourceFile: string;
  ingestedAt: string;
  parsedAccuracyPercent: number;
  marginImpactPercent: number;
}

export interface MediatedCdr {
  id: string;
  callId: string;
  timestamp: string;
  sourceMsisdn: string;
  destinationMsisdn: string;
  countryCode: string;
  selectedCarrier: string;
  routeType: 'direct' | 'lcrq' | 'fallback';
  durationSeconds: number;
  billableMinutes: number;
  carrierCostUsd: number;
  customerBilledUsd: number;
  grossMarginUsd: number;
  grossMarginPercent: number;
  mosScore: number;
  sipResponseCode: number;
  mediationLatencyMs: number; // Target < 5000ms
  kafkaOffset: number;
  status: 'rated_ok' | 'negative_margin_warning' | 'disputed';
}

export interface InterconnectMarginAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  destination: string;
  carrier: string;
  previousMarginPercent: number;
  currentMarginPercent: number;
  detectedAt: string;
  recommendedAction: string;
  autoRerouted: boolean;
  status: 'pending' | 'applied' | 'ignored';
}
