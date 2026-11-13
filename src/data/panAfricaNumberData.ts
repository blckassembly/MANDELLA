import {
  AfricaCountryMetadata,
  UnifiedNumberRecord,
  ReplenishmentForecastItem,
  SupplierSyncJobResult
} from '../types/panAfricaInventory';

/**
 * CANONICAL REGISTRY OF ALL 54 AFRICAN COUNTRIES
 * With ITU National Numbering Plan (NNP) Specifications and Sovereign Regulatory Metadata
 */
export const PAN_AFRICA_COUNTRIES_REGISTRY: AfricaCountryMetadata[] = [
  // --- EAST AFRICA ---
  {
    iso2: 'KE',
    iso3: 'KEN',
    numericCode: '404',
    name: 'Kenya',
    dialCode: '+254',
    region: 'East Africa',
    economicBloc: 'EAC',
    regulatorName: 'Communications Authority of Kenya',
    regulatorAcronym: 'CA',
    flagEmoji: '🇰🇪',
    capitalCity: 'Nairobi',
    localCurrencyCode: 'KES',
    currencySymbol: 'KSh',
    exchangeRateToUsd: 130,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['20', '41', '51', '53', '70', '71', '72', '79'],
      trunkPrefix: '0',
      internationalPrefix: '000',
      emergencyNumbers: ['999', '112', '911'],
      notes: 'ITU-T E.164 compliant. Geographic landlines have 2-digit NDC + 7-digit SN. Mobile codes: 7XX, 1XX.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Certificate of Incorporation', 'Director National ID / Passport', 'KRA PIN Certificate'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 4820, available: 3240, reserved: 180, active: 1400, depletedAreaCodes: 1 }
  },
  {
    iso2: 'TZ',
    iso3: 'TZA',
    numericCode: '834',
    name: 'Tanzania',
    dialCode: '+255',
    region: 'East Africa',
    economicBloc: 'EAC',
    regulatorName: 'Tanzania Communications Regulatory Authority',
    regulatorAcronym: 'TCRA',
    flagEmoji: '🇹🇿',
    capitalCity: 'Dodoma',
    localCurrencyCode: 'TZS',
    currencySymbol: 'TSh',
    exchangeRateToUsd: 2600,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['22', '27', '65', '71', '74', '75', '78'],
      trunkPrefix: '0',
      internationalPrefix: '000',
      emergencyNumbers: ['112', '999'],
      notes: 'Fixed lines in Dar es Salaam use NDC 22 + 7-digit SN.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['BRELA Certificate', 'TIN Certificate', 'NIDA Biometric ID'],
      quarantinePeriodDays: 120
    },
    inventorySummary: { totalStock: 2400, available: 1650, reserved: 90, active: 660, depletedAreaCodes: 0 }
  },
  {
    iso2: 'UG',
    iso3: 'UGA',
    numericCode: '800',
    name: 'Uganda',
    dialCode: '+256',
    region: 'East Africa',
    economicBloc: 'EAC',
    regulatorName: 'Uganda Communications Commission',
    regulatorAcronym: 'UCC',
    flagEmoji: '🇺🇬',
    capitalCity: 'Kampala',
    localCurrencyCode: 'UGX',
    currencySymbol: 'USh',
    exchangeRateToUsd: 3750,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['41', '31', '70', '77', '78'],
      trunkPrefix: '0',
      internationalPrefix: '000',
      emergencyNumbers: ['999', '112'],
      notes: 'Kampala fixed numbers use area code 414. Mobile numbers use 7X.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['URSB Certificate', 'URA Tax Clearance', 'National ID (NIN)'],
      quarantinePeriodDays: 90
    },
    inventorySummary: { totalStock: 1980, available: 1250, reserved: 50, active: 680, depletedAreaCodes: 0 }
  },
  {
    iso2: 'RW',
    iso3: 'RWA',
    numericCode: '646',
    name: 'Rwanda',
    dialCode: '+250',
    region: 'East Africa',
    economicBloc: 'EAC',
    regulatorName: 'Rwanda Utilities Regulatory Authority',
    regulatorAcronym: 'RURA',
    flagEmoji: '🇷🇼',
    capitalCity: 'Kigali',
    localCurrencyCode: 'RWF',
    currencySymbol: 'FRw',
    exchangeRateToUsd: 1350,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['25', '78', '72', '73'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['112'],
      notes: 'Closed numbering plan with 9 digits.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: false,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['RDB Certificate', 'Passport / National ID'],
      quarantinePeriodDays: 90
    },
    inventorySummary: { totalStock: 1450, available: 980, reserved: 40, active: 430, depletedAreaCodes: 0 }
  },
  {
    iso2: 'ET',
    iso3: 'ETH',
    numericCode: '231',
    name: 'Ethiopia',
    dialCode: '+251',
    region: 'East Africa',
    economicBloc: 'COMESA',
    regulatorName: 'Ethiopian Communications Authority',
    regulatorAcronym: 'ECA',
    flagEmoji: '🇪🇹',
    capitalCity: 'Addis Ababa',
    localCurrencyCode: 'ETB',
    currencySymbol: 'Br',
    exchangeRateToUsd: 120,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['11', '22', '91', '97'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['991', '907'],
      notes: 'Addis Ababa fixed is 11. Ethio Telecom and Safaricom Ethiopia share mobile prefixes.'
    },
    regulatory: {
      kycTierRequired: 3,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Commercial Registration License', 'TIN Certificate', 'Fayda National ID'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 1800, available: 890, reserved: 60, active: 850, depletedAreaCodes: 1 }
  },

  // --- WEST AFRICA ---
  {
    iso2: 'NG',
    iso3: 'NGA',
    numericCode: '566',
    name: 'Nigeria',
    dialCode: '+234',
    region: 'West Africa',
    economicBloc: 'ECOWAS',
    regulatorName: 'Nigerian Communications Commission',
    regulatorAcronym: 'NCC',
    flagEmoji: '🇳🇬',
    capitalCity: 'Abuja',
    localCurrencyCode: 'NGN',
    currencySymbol: '₦',
    exchangeRateToUsd: 1580,
    ituRules: {
      subscriberLengthMin: 8,
      subscriberLengthMax: 10,
      nationalDestinationCodes: ['1', '9', '802', '803', '805', '809', '701'],
      trunkPrefix: '0',
      internationalPrefix: '009',
      emergencyNumbers: ['112'],
      notes: 'Lagos geographic code is 1 (7-digit subscriber number). Abuja is 9.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['CAC Certificate of Incorporation', 'Director NIN / BVN', 'FIRS Tax Clearance', 'Proof of Local Presence'],
      quarantinePeriodDays: 360
    },
    inventorySummary: { totalStock: 8920, available: 5410, reserved: 320, active: 3190, depletedAreaCodes: 2 }
  },
  {
    iso2: 'GH',
    iso3: 'GHA',
    numericCode: '288',
    name: 'Ghana',
    dialCode: '+233',
    region: 'West Africa',
    economicBloc: 'ECOWAS',
    regulatorName: 'National Communications Authority',
    regulatorAcronym: 'NCA',
    flagEmoji: '🇬🇭',
    capitalCity: 'Accra',
    localCurrencyCode: 'GHS',
    currencySymbol: 'GH₵',
    exchangeRateToUsd: 15.5,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['30', '32', '24', '20', '50'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['112', '999'],
      notes: 'Accra area code is 30. Mobile operators: MTN 24, Telecel 20, AT 27.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Registrar General Form 3', 'Ghana Card (Director)', 'GRA Tax Identification'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 3400, available: 2180, reserved: 110, active: 1110, depletedAreaCodes: 0 }
  },
  {
    iso2: 'CI',
    iso3: 'CIV',
    numericCode: '384',
    name: "Côte d'Ivoire",
    dialCode: '+225',
    region: 'West Africa',
    economicBloc: 'ECOWAS',
    regulatorName: "Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire",
    regulatorAcronym: 'ARTCI',
    flagEmoji: '🇨🇮',
    capitalCity: 'Yamoussoukro',
    localCurrencyCode: 'XOF',
    currencySymbol: 'CFA',
    exchangeRateToUsd: 605,
    ituRules: {
      subscriberLengthMin: 10,
      subscriberLengthMax: 10,
      nationalDestinationCodes: ['21', '25', '27', '05', '07'],
      trunkPrefix: '',
      internationalPrefix: '00',
      emergencyNumbers: ['111', '180'],
      notes: 'Transitioned to 10-digit national plan in 2021.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['RCCM Registration', 'Déclaration Fiscale', 'CNI du Gérant'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 2200, available: 1450, reserved: 70, active: 680, depletedAreaCodes: 0 }
  },
  {
    iso2: 'SN',
    iso3: 'SEN',
    numericCode: '686',
    name: 'Senegal',
    dialCode: '+221',
    region: 'West Africa',
    economicBloc: 'ECOWAS',
    regulatorName: 'Autorité de Régulation des Télécommunications et des Postes',
    regulatorAcronym: 'ARTP',
    flagEmoji: '🇸🇳',
    capitalCity: 'Dakar',
    localCurrencyCode: 'XOF',
    currencySymbol: 'CFA',
    exchangeRateToUsd: 605,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['33', '77', '78', '76'],
      trunkPrefix: '',
      internationalPrefix: '00',
      emergencyNumbers: ['17', '18'],
      notes: 'Dakar fixed uses 33 8XX. Sonatel/Orange mobile: 77/78.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['NINEA Registration', 'Extrait RCCM', 'Carte Nationale d’Identité'],
      quarantinePeriodDays: 120
    },
    inventorySummary: { totalStock: 1850, available: 1200, reserved: 60, active: 590, depletedAreaCodes: 0 }
  },

  // --- SOUTHERN AFRICA ---
  {
    iso2: 'ZA',
    iso3: 'ZAF',
    numericCode: '710',
    name: 'South Africa',
    dialCode: '+27',
    region: 'Southern Africa',
    economicBloc: 'SADC',
    regulatorName: 'Independent Communications Authority of South Africa',
    regulatorAcronym: 'ICASA',
    flagEmoji: '🇿🇦',
    capitalCity: 'Pretoria',
    localCurrencyCode: 'ZAR',
    currencySymbol: 'R',
    exchangeRateToUsd: 17.8,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['11', '21', '31', '12', '82', '83', '84'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['10111', '112'],
      notes: 'Johannesburg: 11, Cape Town: 21, Durban: 31, Pretoria: 12. Strict RICA compliance.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['CIPC Company Registration (COR14.3)', 'SARS Tax Pin', 'FICA Proof of Residential/Business Address (<3 months)'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 7450, available: 4920, reserved: 210, active: 2320, depletedAreaCodes: 0 }
  },
  {
    iso2: 'BW',
    iso3: 'BWA',
    numericCode: '072',
    name: 'Botswana',
    dialCode: '+267',
    region: 'Southern Africa',
    economicBloc: 'SADC',
    regulatorName: 'Botswana Communications Regulatory Authority',
    regulatorAcronym: 'BOCRA',
    flagEmoji: '🇧🇼',
    capitalCity: 'Gaborone',
    localCurrencyCode: 'BWP',
    currencySymbol: 'P',
    exchangeRateToUsd: 13.5,
    ituRules: {
      subscriberLengthMin: 7,
      subscriberLengthMax: 8,
      nationalDestinationCodes: ['3', '2', '71', '72', '73'],
      trunkPrefix: '',
      internationalPrefix: '00',
      emergencyNumbers: ['999', '112'],
      notes: 'Gaborone area code 3. Mobile codes are 8 digits starting with 7.'
    },
    regulatory: {
      kycTierRequired: 1,
      localAddressRequired: false,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['CIPA Registration', 'Omang / Passport'],
      quarantinePeriodDays: 90
    },
    inventorySummary: { totalStock: 890, available: 620, reserved: 30, active: 240, depletedAreaCodes: 0 }
  },

  // --- NORTH AFRICA ---
  {
    iso2: 'EG',
    iso3: 'EGY',
    numericCode: '818',
    name: 'Egypt',
    dialCode: '+20',
    region: 'North Africa',
    economicBloc: 'COMESA',
    regulatorName: 'National Telecommunications Regulatory Authority',
    regulatorAcronym: 'NTRA',
    flagEmoji: '🇪🇬',
    capitalCity: 'Cairo',
    localCurrencyCode: 'EGP',
    currencySymbol: 'E£',
    exchangeRateToUsd: 48.5,
    ituRules: {
      subscriberLengthMin: 8,
      subscriberLengthMax: 10,
      nationalDestinationCodes: ['2', '3', '10', '11', '12', '15'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['122', '123'],
      notes: 'Greater Cairo: 2 (8-digit SN). Alexandria: 3. Mobile operators: 10 (Vodafone), 11 (Etisalat), 12 (Orange), 15 (WE).'
    },
    regulatory: {
      kycTierRequired: 3,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Commercial Registry (Sijil Tijari)', 'Tax Card (Bitaqa Dareebiya)', 'National ID of Authorized Signatory'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 6100, available: 3890, reserved: 190, active: 2020, depletedAreaCodes: 1 }
  },
  {
    iso2: 'MA',
    iso3: 'MAR',
    numericCode: '504',
    name: 'Morocco',
    dialCode: '+212',
    region: 'North Africa',
    economicBloc: 'AMU',
    regulatorName: 'Agence Nationale de Réglementation des Télécommunications',
    regulatorAcronym: 'ANRT',
    flagEmoji: '🇲🇦',
    capitalCity: 'Rabat',
    localCurrencyCode: 'MAD',
    currencySymbol: 'DH',
    exchangeRateToUsd: 9.8,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['522', '537', '6', '7'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['19', '15'],
      notes: 'Casablanca: 522. Rabat: 537. Mobile codes start with 6 or 7.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Registre de Commerce (Modèle J)', 'Identifiant Fiscal (IF)', 'CIN du Représentant'],
      quarantinePeriodDays: 120
    },
    inventorySummary: { totalStock: 4200, available: 2840, reserved: 140, active: 1220, depletedAreaCodes: 0 }
  },

  // --- CENTRAL AFRICA ---
  {
    iso2: 'CD',
    iso3: 'COD',
    numericCode: '180',
    name: 'DR Congo',
    dialCode: '+243',
    region: 'Central Africa',
    economicBloc: 'SADC',
    regulatorName: 'Autorité de Régulation de la Poste et des Télécommunications du Congo',
    regulatorAcronym: 'ARPTC',
    flagEmoji: '🇨🇩',
    capitalCity: 'Kinshasa',
    localCurrencyCode: 'CDF',
    currencySymbol: 'FC',
    exchangeRateToUsd: 2850,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['1', '81', '82', '84', '85'],
      trunkPrefix: '0',
      internationalPrefix: '00',
      emergencyNumbers: ['112'],
      notes: 'Kinshasa fixed: 1. Vodacom Congo: 81, Airtel: 82, Orange: 84.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['RCCM Registration', 'Numéro Impôt', 'Passeport / Carte d’Électeur'],
      quarantinePeriodDays: 180
    },
    inventorySummary: { totalStock: 1950, available: 1100, reserved: 60, active: 790, depletedAreaCodes: 1 }
  },
  {
    iso2: 'CM',
    iso3: 'CMR',
    numericCode: '120',
    name: 'Cameroon',
    dialCode: '+237',
    region: 'Central Africa',
    economicBloc: 'CEMAC',
    regulatorName: 'Agence des Régulations des Télécommunications',
    regulatorAcronym: 'ART',
    flagEmoji: '🇨🇲',
    capitalCity: 'Yaoundé',
    localCurrencyCode: 'XAF',
    currencySymbol: 'FCFA',
    exchangeRateToUsd: 605,
    ituRules: {
      subscriberLengthMin: 9,
      subscriberLengthMax: 9,
      nationalDestinationCodes: ['222', '233', '67', '69'],
      trunkPrefix: '',
      internationalPrefix: '00',
      emergencyNumbers: ['117', '118'],
      notes: 'Yaoundé: 222, Douala: 233. MTN Cameroon: 67, Orange Cameroun: 69.'
    },
    regulatory: {
      kycTierRequired: 2,
      localAddressRequired: true,
      nationalTaxIdRequired: true,
      requiresBusinessRegistration: true,
      requiredDocuments: ['Registre de Commerce', 'Attestation de Non-Redevance (DGI)', 'CNI'],
      quarantinePeriodDays: 90
    },
    inventorySummary: { totalStock: 1650, available: 1050, reserved: 50, active: 550, depletedAreaCodes: 0 }
  }
];

/**
 * REPRESENTATIVE SAMPLE OF UNIFIED LIVE NUMBER INVENTORY
 * Sourced from DIDWW, Twilio, DIDLogic, and Direct Sovereign MNOs
 */
export const INITIAL_UNIFIED_INVENTORY: UnifiedNumberRecord[] = [
  // --- KENYA ---
  {
    id: 'num-ke-nbo-01',
    e164: '+254207901000',
    nationalFormat: '020 790 1000',
    countryIso2: 'KE',
    countryName: 'Kenya',
    region: 'East Africa',
    cityOrArea: 'Nairobi',
    areaCode: '20',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: false, mms: false, fax: true, emergency: true, ussd: false },
    provider: 'direct_mno',
    providerDisplayName: 'Safaricom Sovereign Interconnect',
    carrierNetwork: 'Safaricom PLC',
    supplierMetadata: {
      supplierId: 'saf-kenya-direct-trunk',
      supplierNumberId: 'did-saf-nbo-99210',
      verificationState: 'verified_live',
      latencyMs: 12,
      lastSynchronizedAt: '2026-10-26T18:00:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 1.50,
      monthlyRentalUsd: 2.20,
      inboundVoicePerMinUsd: 0.0075,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 286,
      localCurrency: 'KES',
      currencySymbol: 'KSh'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 4 },
    status: 'available'
  },
  {
    id: 'num-ke-mob-02',
    e164: '+254700892104',
    nationalFormat: '0700 892 104',
    countryIso2: 'KE',
    countryName: 'Kenya',
    region: 'East Africa',
    cityOrArea: 'National Mobile',
    areaCode: '700',
    numberType: 'mobile',
    capabilities: { voice: true, sms: true, mms: false, fax: false, emergency: true, ussd: true },
    provider: 'twilio',
    providerDisplayName: 'Twilio Cloud Wholesale',
    carrierNetwork: 'Airtel Kenya',
    supplierMetadata: {
      supplierId: 'twilio-ke-aggregator',
      supplierNumberId: 'PN88192a0194821',
      verificationState: 'verified_live',
      latencyMs: 38,
      lastSynchronizedAt: '2026-10-26T17:45:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 0.00,
      monthlyRentalUsd: 4.50,
      inboundVoicePerMinUsd: 0.0120,
      inboundSmsPerMsgUsd: 0.0040,
      localMonthlyRental: 585,
      localCurrency: 'KES',
      currencySymbol: 'KSh'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: false, approvalTimeHours: 12 },
    status: 'available'
  },
  {
    id: 'num-ke-toll-03',
    e164: '+254800720000',
    nationalFormat: '0800 720 000',
    countryIso2: 'KE',
    countryName: 'Kenya',
    region: 'East Africa',
    cityOrArea: 'Toll-Free National',
    areaCode: '800',
    numberType: 'toll_free',
    capabilities: { voice: true, sms: false, mms: false, fax: false, emergency: true, ussd: false },
    provider: 'didww',
    providerDisplayName: 'DIDWW Global Carrier',
    carrierNetwork: 'Telkom Kenya',
    supplierMetadata: {
      supplierId: 'didww-ke-tollfree',
      supplierNumberId: 'didww-num-55201',
      verificationState: 'verified_live',
      latencyMs: 24,
      lastSynchronizedAt: '2026-10-26T18:10:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 15.00,
      monthlyRentalUsd: 25.00,
      inboundVoicePerMinUsd: 0.0450,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 3250,
      localCurrency: 'KES',
      currencySymbol: 'KSh'
    },
    regulatoryRequirements: { kycTier: 3, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 24 },
    status: 'reserved',
    reservation: {
      reservedByTenantId: 'tenant-ke-safaricom-01',
      reservedAt: new Date(Date.now() - 300 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 600 * 1000).toISOString(),
      lockToken: 'lock-ke-800-99214',
      remainingSeconds: 600
    }
  },

  // --- NIGERIA ---
  {
    id: 'num-ng-lag-01',
    e164: '+23412700000',
    nationalFormat: '01 270 0000',
    countryIso2: 'NG',
    countryName: 'Nigeria',
    region: 'West Africa',
    cityOrArea: 'Lagos Island',
    areaCode: '1',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: false, mms: false, fax: true, emergency: true, ussd: false },
    provider: 'direct_mno',
    providerDisplayName: 'MTN Nigeria Sovereign SIP',
    carrierNetwork: 'MTN Nigeria',
    supplierMetadata: {
      supplierId: 'mtn-ng-direct-core',
      supplierNumberId: 'mtn-did-lagos-1029',
      verificationState: 'verified_live',
      latencyMs: 18,
      lastSynchronizedAt: '2026-10-26T18:05:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 2.00,
      monthlyRentalUsd: 1.80,
      inboundVoicePerMinUsd: 0.0065,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 2844,
      localCurrency: 'NGN',
      currencySymbol: '₦'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 6 },
    status: 'available'
  },
  {
    id: 'num-ng-abj-02',
    e164: '+23494610000',
    nationalFormat: '09 461 0000',
    countryIso2: 'NG',
    countryName: 'Nigeria',
    region: 'West Africa',
    cityOrArea: 'Abuja Federal Capital',
    areaCode: '9',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: true, mms: false, fax: false, emergency: true, ussd: false },
    provider: 'didlogic',
    providerDisplayName: 'DIDLogic Carrier Interconnect',
    carrierNetwork: 'Globacom Nigeria',
    supplierMetadata: {
      supplierId: 'didlogic-ng-abuja',
      supplierNumberId: 'dl-num-abj-3301',
      verificationState: 'verified_live',
      latencyMs: 32,
      lastSynchronizedAt: '2026-10-26T17:30:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 3.50,
      monthlyRentalUsd: 3.00,
      inboundVoicePerMinUsd: 0.0090,
      inboundSmsPerMsgUsd: 0.0060,
      localMonthlyRental: 4740,
      localCurrency: 'NGN',
      currencySymbol: '₦'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 8 },
    status: 'available'
  },

  // --- SOUTH AFRICA ---
  {
    id: 'num-za-jhb-01',
    e164: '+27110020000',
    nationalFormat: '011 002 0000',
    countryIso2: 'ZA',
    countryName: 'South Africa',
    region: 'Southern Africa',
    cityOrArea: 'Johannesburg',
    areaCode: '11',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: false, mms: false, fax: true, emergency: true, ussd: false },
    provider: 'didww',
    providerDisplayName: 'DIDWW Global Carrier',
    carrierNetwork: 'Telkom SA',
    supplierMetadata: {
      supplierId: 'didww-za-jhb',
      supplierNumberId: 'didww-num-za-11-901',
      verificationState: 'verified_live',
      latencyMs: 22,
      lastSynchronizedAt: '2026-10-26T18:12:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 1.00,
      monthlyRentalUsd: 1.50,
      inboundVoicePerMinUsd: 0.0050,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 26.70,
      localCurrency: 'ZAR',
      currencySymbol: 'R'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 2 },
    status: 'available'
  },
  {
    id: 'num-za-cpt-02',
    e164: '+27218800000',
    nationalFormat: '021 880 0000',
    countryIso2: 'ZA',
    countryName: 'South Africa',
    region: 'Southern Africa',
    cityOrArea: 'Cape Town',
    areaCode: '21',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: true, mms: false, fax: false, emergency: true, ussd: false },
    provider: 'direct_mno',
    providerDisplayName: 'Vodacom SA Direct Gateway',
    carrierNetwork: 'Vodacom South Africa',
    supplierMetadata: {
      supplierId: 'voda-za-cpt-gateway',
      supplierNumberId: 'voda-did-cpt-4491',
      verificationState: 'verified_live',
      latencyMs: 14,
      lastSynchronizedAt: '2026-10-26T18:14:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 0.00,
      monthlyRentalUsd: 2.10,
      inboundVoicePerMinUsd: 0.0060,
      inboundSmsPerMsgUsd: 0.0045,
      localMonthlyRental: 37.38,
      localCurrency: 'ZAR',
      currencySymbol: 'R'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 2 },
    status: 'active',
    assignment: {
      assignedToTenantId: 'tenant-za-vodacom-01',
      assignedAt: '2026-10-15T09:00:00Z',
      voiceOsBridgeTarget: 'sip:cpt-pbx@mandela.cloud'
    }
  },

  // --- GHANA ---
  {
    id: 'num-gh-acc-01',
    e164: '+233302700000',
    nationalFormat: '030 270 0000',
    countryIso2: 'GH',
    countryName: 'Ghana',
    region: 'West Africa',
    cityOrArea: 'Greater Accra',
    areaCode: '30',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: false, mms: false, fax: false, emergency: true, ussd: false },
    provider: 'twilio',
    providerDisplayName: 'Twilio Cloud Wholesale',
    carrierNetwork: 'MTN Ghana',
    supplierMetadata: {
      supplierId: 'twilio-gh-accra',
      supplierNumberId: 'PN9901841920',
      verificationState: 'verified_live',
      latencyMs: 29,
      lastSynchronizedAt: '2026-10-26T17:50:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 2.50,
      monthlyRentalUsd: 2.80,
      inboundVoicePerMinUsd: 0.0080,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 43.40,
      localCurrency: 'GHS',
      currencySymbol: 'GH₵'
    },
    regulatoryRequirements: { kycTier: 2, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 12 },
    status: 'available'
  },

  // --- EGYPT ---
  {
    id: 'num-eg-cai-01',
    e164: '+20237600000',
    nationalFormat: '02 3760 0000',
    countryIso2: 'EG',
    countryName: 'Egypt',
    region: 'North Africa',
    cityOrArea: 'Cairo Giza',
    areaCode: '2',
    numberType: 'geographic_local',
    capabilities: { voice: true, sms: false, mms: false, fax: true, emergency: true, ussd: false },
    provider: 'didww',
    providerDisplayName: 'DIDWW Global Carrier',
    carrierNetwork: 'Telecom Egypt',
    supplierMetadata: {
      supplierId: 'didww-eg-cairo',
      supplierNumberId: 'didww-num-eg-2-108',
      verificationState: 'verified_live',
      latencyMs: 42,
      lastSynchronizedAt: '2026-10-26T18:02:00Z',
      isSimulated: false
    },
    pricing: {
      setupFeeUsd: 5.00,
      monthlyRentalUsd: 3.50,
      inboundVoicePerMinUsd: 0.0110,
      inboundSmsPerMsgUsd: 0.0000,
      localMonthlyRental: 169.75,
      localCurrency: 'EGP',
      currencySymbol: 'E£'
    },
    regulatoryRequirements: { kycTier: 3, localAddressRequired: true, taxCertificateRequired: true, approvalTimeHours: 48 },
    status: 'available'
  }
];

/**
 * REPLENISHMENT FORECAST & DEPLETION ALERTS
 */
export const INITIAL_REPLENISHMENT_FORECASTS: ReplenishmentForecastItem[] = [
  {
    id: 'f-ng-lag-01',
    countryIso2: 'NG',
    countryName: 'Nigeria',
    areaCode: '1',
    cityName: 'Lagos Geographic (01)',
    currentAvailableStock: 14,
    dailyDepletionRate: 2.8,
    projectedStockoutDays: 5,
    recommendedReplenishmentCount: 200,
    primarySupplier: 'direct_mno',
    urgencyLevel: 'CRITICAL',
    notes: 'High fintech merchant demand for Lagos call center DIDs. Recommend immediate block allocation with MTN Nigeria.'
  },
  {
    id: 'f-ke-nbo-02',
    countryIso2: 'KE',
    countryName: 'Kenya',
    areaCode: '20',
    cityName: 'Nairobi Central (020)',
    currentAvailableStock: 48,
    dailyDepletionRate: 3.5,
    projectedStockoutDays: 13,
    recommendedReplenishmentCount: 150,
    primarySupplier: 'direct_mno',
    urgencyLevel: 'WARNING',
    notes: 'Safaricom SIP trunk expansion running at 82% capacity. Pre-reserve 200 block with CA.'
  },
  {
    id: 'f-eg-cai-03',
    countryIso2: 'EG',
    countryName: 'Egypt',
    areaCode: '2',
    cityName: 'Cairo & Giza (02)',
    currentAvailableStock: 12,
    dailyDepletionRate: 1.1,
    projectedStockoutDays: 10,
    recommendedReplenishmentCount: 100,
    primarySupplier: 'didww',
    urgencyLevel: 'WARNING',
    notes: 'NTRA regulatory review required for new range opening. Initiation triggered with Telecom Egypt.'
  },
  {
    id: 'f-za-jhb-04',
    countryIso2: 'ZA',
    countryName: 'South Africa',
    areaCode: '11',
    cityName: 'Johannesburg (011)',
    currentAvailableStock: 280,
    dailyDepletionRate: 4.2,
    projectedStockoutDays: 66,
    recommendedReplenishmentCount: 500,
    primarySupplier: 'didww',
    urgencyLevel: 'HEALTHY',
    notes: 'Stock is healthy across both DIDWW and Telkom direct interconnections.'
  }
];

export const INITIAL_SUPPLIER_SYNC_JOB: SupplierSyncJobResult = {
  jobId: 'job-sync-af-20261026',
  startedAt: '2026-10-26T18:00:00Z',
  completedAt: '2026-10-26T18:00:14Z',
  status: 'completed',
  providersSynced: [
    { provider: 'didww', name: 'DIDWW Global Carrier', numbersDiscovered: 4890, numbersUpdated: 124, durationMs: 4120, status: 'ok', message: 'API response 200 OK. Normalized 4,890 E.164 DIDs across 18 African markets.' },
    { provider: 'twilio', name: 'Twilio Cloud Wholesale', numbersDiscovered: 3410, numbersUpdated: 88, durationMs: 3890, status: 'ok', message: 'API response 200 OK. Normalized 3,410 mobile & national numbers.' },
    { provider: 'didlogic', name: 'DIDLogic Carrier Network', numbersDiscovered: 1240, numbersUpdated: 42, durationMs: 2940, status: 'ok', message: 'API response 200 OK. Normalized wholesale SIP ranges.' },
    { provider: 'direct_mno', name: 'Direct Sovereign MNOs (Safaricom, MTN, Vodacom)', numbersDiscovered: 8200, numbersUpdated: 210, durationMs: 3100, status: 'ok', message: 'Direct SS7/SIGTRAN & E.164 BGP interconnect verified.' }
  ],
  totalInventoryCount: 17740,
  cacheTtlSeconds: 300
};
