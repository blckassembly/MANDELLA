import { DataSourceMeta } from '../types/mandelaOS';

/**
 * MANDELA OS — Unified Telecom Data Source Registry
 * 
 * Provides typed metadata, connection states, and provenance for all
 * microservices and external interfaces bound to the 30 applications.
 */

export const DATA_SOURCE_REGISTRY: Record<string, DataSourceMeta> = {
  // 1. E.164 & Number Provisioning Core
  ds_itu_e164_redis: {
    sourceId: 'ds_itu_e164_redis',
    providerName: 'Mandela Sovereign ITU-T E.164 Redis Master',
    sourceType: 'itu_e164_redis',
    owningAppId: 'e01_number_mgmt',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 0.8,
    supportedReadOperations: ['LIST_INVENTORY', 'QUERY_RESERVATION', 'SEARCH_PREFIXES'],
    supportedWriteOperations: ['ACQUIRE_LOCK', 'RELEASE_LOCK', 'BIND_TENANT_DID'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'SHA256:49012a9e88ff2001 (National ITU Registry Sync)'
  },
  ds_gsma_esim_vault: {
    sourceId: 'ds_gsma_esim_vault',
    providerName: 'GSMA SGP.22 eSIM Entitlement Server',
    sourceType: 'gsma_esim_vault',
    owningAppId: 'e01_number_mgmt',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 14.2,
    supportedReadOperations: ['GET_PROFILE_STATUS', 'VERIFY_EID_ATTESTATION'],
    supportedWriteOperations: ['PROVISION_SM_DP_PLUS', 'REVOKE_ESIM_PROFILE'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'FIPS 140-3 Level 4 HSM Key Vault (Lagos Pod-1)'
  },

  // 2. Carrier Interconnect & LCR
  ds_carrier_rate_decks: {
    sourceId: 'ds_carrier_rate_decks',
    providerName: '100+ African Carrier Rate Deck Ingestion Plane',
    sourceType: 'rest_openapi',
    owningAppId: 'e02_carrier_lcr',
    tenantScope: 'global_carrier',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 24.0,
    supportedReadOperations: ['QUERY_WHOLESALE_RATES', 'CALCULATE_LCR_MARGINS', 'EXPORT_RATE_SHEET'],
    supportedWriteOperations: ['INGEST_RATE_DECK', 'APPLY_MARGIN_OVERRIDE'],
    authenticationState: 'authenticated',
    auditProvenance: 'Mediated Carrier Wholesale Feeds (MTN, Safaricom, Airtel)'
  },
  ds_mediated_cdr_stream: {
    sourceId: 'ds_mediated_cdr_stream',
    providerName: 'Apache Parquet Mediated CDR Lakehouse',
    sourceType: 'dataverse_lakehouse',
    owningAppId: 'e02_carrier_lcr',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 3.4,
    supportedReadOperations: ['STREAM_RAW_CDRS', 'AGGREGATE_BILLING_LEDS', 'QUERY_MOS_SCORES'],
    supportedWriteOperations: ['INGEST_RTP_STATS', 'APPEND_AUDIT_TRAIL'],
    authenticationState: 'authenticated',
    auditProvenance: 'ClickHouse / Parquet S3 Tiered Storage'
  },

  // 3. SBC & FreeSWITCH Anycast Core
  ds_freeswitch_esl: {
    sourceId: 'ds_freeswitch_esl',
    providerName: 'FreeSWITCH 1.10 Anycast ESL Cluster (10,000 CPS)',
    sourceType: 'sip_freeswitch',
    owningAppId: 'e03_sbc_sip_core',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 1.2,
    supportedReadOperations: ['GET_CHANNELS', 'POLL_EVENT_SOCKET', 'READ_MOS_TELEMETRY'],
    supportedWriteOperations: ['ORIGINATE_CALL', 'EXECUTE_BARGE', 'TERMINATE_CHANNEL'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'Unix Socket: /run/mandela/ipc-c2-noc.sock'
  },
  ds_kamailio_signaling: {
    sourceId: 'ds_kamailio_signaling',
    providerName: 'Kamailio 5.7 RFC 3261 Anycast SIP Proxy',
    sourceType: 'kamailio_anycast',
    owningAppId: 'e03_sbc_sip_core',
    tenantScope: 'global_carrier',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 0.6,
    supportedReadOperations: ['GET_DISPATCHER_TARGETS', 'INSPECT_TRANSACTION_STATE'],
    supportedWriteOperations: ['DISPATCHER_RELOAD', 'SYNC_HTABLE_BLACKLIST'],
    authenticationState: 'authenticated',
    auditProvenance: 'Anycast Ingress PoPs (NBO, LOS, JNB, CAI)'
  },

  // 4. Satellite NTN
  ds_satellite_ntn_gateway: {
    sourceId: 'ds_satellite_ntn_gateway',
    providerName: '3GPP Rel-17 Satellite Direct-to-Device Teleport Bus',
    sourceType: 'satellite_ntn',
    owningAppId: 'e04_satellite_ntn',
    tenantScope: 'global_carrier',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 38.6,
    supportedReadOperations: ['GET_EPHEMERIS_DATA', 'POLL_TELEPORT_GROUND_STATS', 'LIST_BEAM_FOOTPRINTS'],
    supportedWriteOperations: ['ALLOCATE_ORBITAL_BEAM', 'SET_TERMINAL_HANDOFF'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'LEO Constellation Telemetry Feed'
  },

  // 5. Speech & AI
  ds_system7_neural_speech: {
    sourceId: 'ds_system7_neural_speech',
    providerName: 'System 7 Neural Speech (50 African Dialects)',
    sourceType: 'ai_rawnet3_speech',
    owningAppId: 'e05_consumer_voice',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 18.0,
    supportedReadOperations: ['STREAM_ASR_TRANSCRIPT', 'SYNTHESIZE_TTS_AUDIO', 'DETECT_CODE_SWITCH'],
    supportedWriteOperations: ['WARMUP_ACOUSTIC_MODEL'],
    authenticationState: 'authenticated',
    auditProvenance: 'Neural Model Cluster (Swahili, Yoruba, Amharic, Zulu, Hausa)'
  },

  // 6. Messaging & SMPP
  ds_smpp_mno_binds: {
    sourceId: 'ds_smpp_mno_binds',
    providerName: 'Sovereign SMPP v5 & SIGTRAN USSD Gateway',
    sourceType: 'smpp_mno',
    owningAppId: 'e06_sms_ussd',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 12.0,
    supportedReadOperations: ['POLL_DELIVERY_RECEIPTS', 'INSPECT_PDU_STREAM'],
    supportedWriteOperations: ['SUBMIT_SM', 'DISPATCH_USSD_PROMPT'],
    authenticationState: 'authenticated',
    auditProvenance: 'Direct MNO Interconnect Binds (Safaricom, MTN, Vodacom, Glo)'
  },

  // 7. Dataverse Lakehouse
  ds_sovereign_dataverse: {
    sourceId: 'ds_sovereign_dataverse',
    providerName: 'MANDELA Sovereign Dataverse & Lakehouse Fabric',
    sourceType: 'dataverse_lakehouse',
    owningAppId: 'e07_dataverse',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 2.1,
    supportedReadOperations: ['QUERY_TENANT_RECORDS', 'INSPECT_SCHEMA_VERSIONS', 'STREAM_CDC_EVENTS'],
    supportedWriteOperations: ['COMMIT_TRANSACTION', 'CREATE_SCHEMA', 'MIGRATE_PARTITION'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'PostgreSQL Multi-Tenant + Parquet S3'
  },

  // 8. Edge Defense & SIEM
  ds_edge_signaling_firewall: {
    sourceId: 'ds_edge_signaling_firewall',
    providerName: 'Rust SS7/Diameter & eBPF Signaling Firewall',
    sourceType: 'rest_openapi',
    owningAppId: 'e08_edge_defense',
    tenantScope: 'global_carrier',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 0.4,
    supportedReadOperations: ['LIST_BLOCKED_CAT_ATTACKS', 'INSPECT_STIR_SHAKEN_CERTS'],
    supportedWriteOperations: ['INJECT_BGP_BLACKHOLE', 'PUSH_FIREWALL_RULE'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'Inline Edge eBPF Filter Core'
  },
  ds_siem_flink_correlation: {
    sourceId: 'ds_siem_flink_correlation',
    providerName: 'Apache Flink 18-System OCSF Normalization Fabric',
    sourceType: 'siem_flink',
    owningAppId: 'e09_siem_fabric',
    tenantScope: 'global_carrier',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 6.2,
    supportedReadOperations: ['POLL_CORRELATION_EVENTS', 'QUERY_AGGREGATED_STREAM'],
    supportedWriteOperations: ['REGISTER_OCSF_PARSER', 'EMIT_INCIDENT_FLAG'],
    authenticationState: 'authenticated',
    auditProvenance: 'Apache Flink Stateful Stream Correlation Engine'
  },

  // 9. AI Fraud & Biometrics
  ds_ai_rawnet3_biometrics: {
    sourceId: 'ds_ai_rawnet3_biometrics',
    providerName: 'RawNet3 Acoustic Voice Deepfake & SIM-Swap Engine',
    sourceType: 'ai_rawnet3_speech',
    owningAppId: 'e10_ai_fraud',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 28.4,
    supportedReadOperations: ['SCAN_WAVEFORM_SYNTHETIC', 'CALCULATE_GEODESIC_RISK'],
    supportedWriteOperations: ['FLAG_SIM_SWAP_QUARANTINE'],
    authenticationState: 'authenticated',
    auditProvenance: 'RawNet3 Neural Waveform Harvester'
  },

  // 10. n8n DAG Engine
  ds_n8n_dag_engine: {
    sourceId: 'ds_n8n_dag_engine',
    providerName: 'n8n Visual Telecom Graph Orchestrator',
    sourceType: 'n8n_dag_engine',
    owningAppId: 'o02_n8n_workflows',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 4.8,
    supportedReadOperations: ['GET_DAG_TOPOLOGY', 'POLL_EXECUTION_RUNS', 'EXPORT_SPEC'],
    supportedWriteOperations: ['EXECUTE_WORKFLOW_STEP', 'DEPLOY_DAG_DIALPLAN'],
    authenticationState: 'authenticated',
    auditProvenance: 'n8n Telephony DAG Compiler'
  },

  // 11. Mobile Money FinTech Rails
  ds_mpesa_flutterwave: {
    sourceId: 'ds_mpesa_flutterwave',
    providerName: 'Daraja M-Pesa STK & Flutterwave Multi-Currency Hub',
    sourceType: 'mobile_money_mpesa',
    owningAppId: 'c06_wallet_billing',
    tenantScope: 'isolated',
    connectionStatus: 'CONNECTED',
    lastSyncTimestamp: new Date().toISOString(),
    latencyAvgMs: 16.5,
    supportedReadOperations: ['QUERY_WALLET_BALANCE', 'GET_TRANSACTION_STATUS'],
    supportedWriteOperations: ['TRIGGER_STK_PUSH', 'EXECUTE_DISBURSEMENT'],
    authenticationState: 'cert_pinned',
    auditProvenance: 'Safaricom Daraja API + Flutterwave V3'
  }
};
