import React, { useState, useEffect, useCallback } from 'react';
// System 1 Data
import {
  AFRICAN_COUNTRIES,
  INITIAL_NUMBERS,
  CONNECTORS_HEALTH,
  INITIAL_PORTING_REQUESTS,
  SOVEREIGN_LICENSES,
  INITIAL_AUDIT_LOG,
  CURRENT_USER_KYC,
} from './data/mockData';
// System 2 Data
import {
  INITIAL_SMPP_BINDS,
  INITIAL_CARRIER_METRICS,
  INITIAL_MESSAGES,
  INITIAL_PDU_TRACES
} from './data/mockMessagingData';
// System 3 Data
import {
  AFRICAN_LANGUAGE_MODELS,
  INITIAL_IVR_FLOWS,
  INITIAL_LIVE_CALLS,
  INITIAL_CALL_SUMMARIES
} from './data/mockVoiceData';
// System 4 Data
import {
  INITIAL_POPS,
  INITIAL_PBX_CREDENTIALS,
  INITIAL_CALL_TRACES,
  INITIAL_HEADER_RULES,
  INITIAL_GLOBAL_ACLS,
  INITIAL_AI_ALERTS
} from './data/mockSbcData';
// Carrier Interconnect Data
import {
  INITIAL_CARRIER_ROUTES,
  INITIAL_RATE_DECKS,
  INITIAL_MEDIATED_CDRS,
  INITIAL_INTERCONNECT_ALERTS
} from './data/mockInterconnectData';
// MANDELA Dataverse Data
import {
  INITIAL_TENANTS,
  INITIAL_SCHEMAS,
  INITIAL_RELATIONSHIPS,
  INITIAL_RECORDS,
  INITIAL_EVENT_SUBSCRIPTIONS,
  INITIAL_SECURITY_ROLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_AI_DATA_POLICY
} from './data/mockDataverseData';
// Multi-Tenant Data
import {
  INITIAL_TENANT_ACCOUNTS,
  SUBSCRIPTION_TIERS
} from './data/mockMultiTenantData';

// Types
import {
  AfricanCountry,
  PhoneNumberRecord,
  PortingRequest,
  SovereignLicense,
  AuditLogEntry,
} from './types/nms';
import {
  SmppBind,
  CarrierQualityMetric,
  MessageRecord,
  SmppPduTrace
} from './types/messaging';
import {
  VoiceIvrFlow,
  LiveVoiceCall,
  AfricanLanguageModel,
  CallSummaryReport
} from './types/voice';
import {
  SbcPointOfPresence,
  EnterprisePbxCredential,
  SipCallTrace,
  SbcHeaderRule,
  SbcGlobalAcl,
  SbcAiAlert,
  PopCode
} from './types/sbc';
import {
  CarrierRouteOption,
  CarrierRateDeck,
  MediatedCdr,
  InterconnectMarginAlert
} from './types/interconnect';
import {
  DataverseEntitySchema,
  DataverseRelationship,
  DataverseRecord,
  DataverseTenant,
  DataverseEventSubscription,
  DataverseSecurityRole,
  DataverseAuditLog,
  AiDataServicePolicy,
  DataverseField
} from './types/dataverse';
import {
  TenantAccount,
  PortalMode,
  EnterpriseProduct,
  CustomerProduct,
  InterconnectTab,
  SatelliteTab,
  EdgeDefenseTab,
  SiemFabricTab,
  AiAnomalyTab,
  SocC2Tab,
  SubscriptionTier
} from './types/multiTenant';
import {
  Header,
  ConnectSystem,
  DataverseTab,
  System1Tab,
  System2Tab,
  System3Tab,
  System4Tab,
  UserPersona
} from './components/Header';

import { LeftSidebar } from './components/layout/LeftSidebar';
import { TopHeader } from './components/layout/TopHeader';
import { useGlobalSessionPersistence } from './hooks/useGlobalSessionPersistence';
import { TenantLoginModal } from './components/auth/TenantLoginModal';
import { OnboardingWizardModal } from './components/onboarding/OnboardingWizardModal';
import { CustomerPortalView } from './components/customer/CustomerPortalView';
import { CustomerOnboardingModal } from './components/customer/CustomerOnboardingModal';
import { EnterpriseLandingView } from './components/landing/EnterpriseLandingView';
import { AgnosticOsMasterView } from './components/agnostic-os/AgnosticOsMasterView';
import { MandelaAppShell } from './components/shell/MandelaAppShell';
import { MandelaUnifiedShell } from './components/os-workspace/MandelaUnifiedShell';
import { SubscriptionGatedBanner } from './components/common/SubscriptionGatedBanner';
import { UxArchitectureWalkthrough } from './components/stress/UxArchitectureWalkthrough';
import { SatelliteNtnSuite } from './components/satellite/SatelliteNtnSuite';
import { DesignSystemShowcaseModal } from './design-system';
import { GlobalCommandPalette, DensityMode } from './components/common/GlobalCommandPalette';
import { EdgeDefenseSuite } from './components/edge/EdgeDefenseSuite';
import { SiemFabricSuite } from './components/edge/SiemFabricSuite';
import { AiAnomalyVoiceSuite } from './components/edge/AiAnomalyVoiceSuite';
import { SocC2Suite } from './components/edge/SocC2Suite';

// Carrier Interconnect Views
import { RateDeckManager } from './components/interconnect/RateDeckManager';
import { LcrRoutingEngine } from './components/interconnect/LcrRoutingEngine';
import { CdrMediationStream } from './components/interconnect/CdrMediationStream';

// MANDELA Dataverse Views
import { DataverseOverview } from './components/dataverse/DataverseOverview';
import { SchemaDesigner } from './components/dataverse/SchemaDesigner';
import { RecordExplorer } from './components/dataverse/RecordExplorer';
import { QueryStudio } from './components/dataverse/QueryStudio';
import { EventPipeline } from './components/dataverse/EventPipeline';
import { GovernanceRbac } from './components/dataverse/GovernanceRbac';
import { AiDataService } from './components/dataverse/AiDataService';

// System 1 Views
import { CommandControlMap } from './components/CommandControlMap';
import { InventoryBrowser } from './components/InventoryBrowser';
import { MyNumbersView } from './components/MyNumbersView';
import { PortingEngine } from './components/PortingEngine';
import { ComplianceRegistry } from './components/ComplianceRegistry';
import { EsimAttestationDashboard } from './components/EsimAttestationDashboard';
import { ApiConsole } from './components/ApiConsole';
import { PanAfricaNumberInventoryView } from './components/numbers/PanAfricaNumberInventoryView';
import { NumberProvisionModal } from './components/NumberProvisionModal';
import { SoftphoneModal } from './components/SoftphoneModal';
import { AiForecastModal } from './components/AiForecastModal';

// System 2 Views
import { NocDashboard } from './components/messaging/NocDashboard';
import { CampaignDispatcher } from './components/messaging/CampaignDispatcher';
import { FeaturePhoneUssdSimulator } from './components/messaging/FeaturePhoneUssdSimulator';
import { SmppBindMonitor } from './components/messaging/SmppBindMonitor';
import { RoutingEngineView } from './components/messaging/RoutingEngineView';
import { MessagingApiExplorer } from './components/messaging/MessagingApiExplorer';

// System 3 Views
import { VoiceNocDashboard } from './components/voice/VoiceNocDashboard';
import { IvrFlowBuilder } from './components/voice/IvrFlowBuilder';
import { LiveCallSimulator } from './components/voice/LiveCallSimulator';
import { AfricanLanguagesMatrix } from './components/voice/AfricanLanguagesMatrix';
import { CallSummariesView } from './components/voice/CallSummariesView';

// System 4 Views
import { SbcNocDashboard } from './components/sbc/SbcNocDashboard';
import { PbxConnectWizard } from './components/sbc/PbxConnectWizard';
import { SipLadderTraces } from './components/sbc/SipLadderTraces';
import { HeaderRulesEditor } from './components/sbc/HeaderRulesEditor';
import { SecurityAiEngine } from './components/sbc/SecurityAiEngine';
import { GeminiChatbotModal } from './components/chat/GeminiChatbotModal';
import { NmcpControlPlaneModal } from './components/nmcp/NmcpControlPlaneModal';
import { useOnlineStatus } from './hooks/useOnlineStatus';

import { CheckCircle2, Bot, Wifi, WifiOff, AlertTriangle, Database } from 'lucide-react';

export default function App() {
  // Workbox Service Worker & Remote African Infrastructure Connectivity (Read-Only Mode)
  const {
    isOnline,
    isBrowserOnline,
    isSimulatedOffline,
    isReadOnly,
    lastOnlineAt,
    offlineSince,
    toggleSimulateOffline
  } = useOnlineStatus();

  // Global Session Persistence across all 11 System Portals (Saved & Restored via localStorage)
  const {
    portalMode,
    setPortalMode,
    activeEnterpriseProduct,
    setActiveEnterpriseProduct,
    activeCustomerTab,
    setActiveCustomerTab,
    currentTenantId,
    setCurrentTenantId,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    interconnectTab,
    setInterconnectTab,
    satelliteTab,
    setSatelliteTab,
    system4Tab,
    setSystem4Tab,
    system3Tab,
    setSystem3Tab,
    system2Tab,
    setSystem2Tab,
    system1Tab,
    setSystem1Tab,
    dataverseTab,
    setDataverseTab,
    edgeDefenseTab,
    setEdgeDefenseTab,
    siemFabricTab,
    setSiemFabricTab,
    aiAnomalyTab,
    setAiAnomalyTab,
    socC2Tab,
    setSocC2Tab,
    resetSessionPersistence,
    sessionLastUpdated
  } = useGlobalSessionPersistence();

  const [showTenantModal, setShowTenantModal] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showCustomerOnboardingModal, setShowCustomerOnboardingModal] = useState<boolean>(false);
  const [showStressTestModal, setShowStressTestModal] = useState<boolean>(false);
  const [showDesignSystemModal, setShowDesignSystemModal] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const [showGeminiChat, setShowGeminiChat] = useState<boolean>(false);
  const [showNmcpModal, setShowNmcpModal] = useState<boolean>(false);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CSS Root Variable Density Mode Control ('compact' | 'standard' | 'spacious')
  const [densityMode, setDensityMode] = useState<DensityMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mandela_ui_density');
      if (saved === 'compact' || saved === 'standard' || saved === 'spacious') {
        return saved;
      }
    }
    return 'standard';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-density', densityMode);
    localStorage.setItem('mandela_ui_density', densityMode);
  }, [densityMode]);

  const [activePersona, setActivePersona] = useState<UserPersona>('ops');

  // ================= MULTI-TENANT ARCHITECTURE =================
  const [tenantAccounts, setTenantAccounts] = useState<TenantAccount[]>(INITIAL_TENANT_ACCOUNTS);

  const currentTenant = tenantAccounts.find((t) => t.id === currentTenantId) || tenantAccounts[0];

  // Map tenant accounts to dataverse tenants for DataverseOverview
  const dataverseTenants: DataverseTenant[] = tenantAccounts.map((t) => ({
    id: t.id,
    name: t.name,
    domain: t.domain,
    plan:
      t.subscription.tier === 'sovereign_telco'
        ? 'sovereign_operator'
        : t.subscription.tier === 'fintech_enterprise'
        ? 'fintech_cloud'
        : 'enterprise',
    region: t.region,
    dataIsolationMode: t.dataIsolationMode,
    recordsTotal: t.usage.dataverseRecordsTotal,
    storageMb: t.usage.dataverseStorageMb,
    encryptionKeyAlias: t.encryptionKeyAlias,
    status: t.status === 'suspended' ? 'suspended' : 'active'
  }));

  // ================= CARRIER INTERCONNECT DATA =================
  const [carrierRoutes, setCarrierRoutes] = useState<CarrierRouteOption[]>(INITIAL_CARRIER_ROUTES);
  const [rateDecks, setRateDecks] = useState<CarrierRateDeck[]>(INITIAL_RATE_DECKS);
  const [mediatedCdrs, setMediatedCdrs] = useState<MediatedCdr[]>(INITIAL_MEDIATED_CDRS);
  const [interconnectAlerts, setInterconnectAlerts] = useState<InterconnectMarginAlert[]>(INITIAL_INTERCONNECT_ALERTS);

  // ================= MANDELA DATAVERSE DATA =================
  const [schemas, setSchemas] = useState<DataverseEntitySchema[]>(INITIAL_SCHEMAS);
  const [relationships, setRelationships] = useState<DataverseRelationship[]>(INITIAL_RELATIONSHIPS);
  const [records, setRecords] = useState<DataverseRecord[]>(INITIAL_RECORDS);
  const [subscriptions, setSubscriptions] = useState<DataverseEventSubscription[]>(INITIAL_EVENT_SUBSCRIPTIONS);
  const [roles] = useState<DataverseSecurityRole[]>(INITIAL_SECURITY_ROLES);
  const [dataverseAuditLogs, setDataverseAuditLogs] = useState<DataverseAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [aiDataPolicy, setAiDataPolicy] = useState<AiDataServicePolicy>(INITIAL_AI_DATA_POLICY);

  // ================= SYSTEM 1 DATA =================
  const [countries, setCountries] = useState<AfricanCountry[]>(AFRICAN_COUNTRIES);
  const [numbers, setNumbers] = useState<PhoneNumberRecord[]>(INITIAL_NUMBERS);
  const [connectors] = useState(CONNECTORS_HEALTH);
  const [portingRequests, setPortingRequests] = useState<PortingRequest[]>(INITIAL_PORTING_REQUESTS);
  const [licenses, setLicenses] = useState<SovereignLicense[]>(SOVEREIGN_LICENSES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOG);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('NG');

  // System 1 Modals
  const [provisioningNumber, setProvisioningNumber] = useState<PhoneNumberRecord | null>(null);
  const [softphoneTargetNumber, setSoftphoneTargetNumber] = useState<PhoneNumberRecord | null>(null);
  const [aiForecastCountry, setAiForecastCountry] = useState<AfricanCountry | null>(null);

  // ================= SYSTEM 2 DATA =================
  const [binds, setBinds] = useState<SmppBind[]>(INITIAL_SMPP_BINDS);
  const [carrierMetrics, setCarrierMetrics] = useState<CarrierQualityMetric[]>(INITIAL_CARRIER_METRICS);
  const [messages, setMessages] = useState<MessageRecord[]>(INITIAL_MESSAGES);
  const [pduTraces, setPduTraces] = useState<SmppPduTrace[]>(INITIAL_PDU_TRACES);
  const [phoneSimMsisdn, setPhoneSimMsisdn] = useState<string>('+233244123890');

  // ================= SYSTEM 3 DATA =================
  const [ivrFlows, setIvrFlows] = useState<VoiceIvrFlow[]>(INITIAL_IVR_FLOWS);
  const [liveCalls, setLiveCalls] = useState<LiveVoiceCall[]>(INITIAL_LIVE_CALLS);
  const [languages] = useState<AfricanLanguageModel[]>(AFRICAN_LANGUAGE_MODELS);
  const [callSummaries, setCallSummaries] = useState<CallSummaryReport[]>(INITIAL_CALL_SUMMARIES);
  const [simulatorTargetCall, setSimulatorTargetCall] = useState<LiveVoiceCall | undefined>(undefined);
  const [simulatorTargetFlowId, setSimulatorTargetFlowId] = useState<string | undefined>(undefined);

  // ================= SYSTEM 4 DATA =================
  const [pops, setPops] = useState<SbcPointOfPresence[]>(INITIAL_POPS);
  const [pbxCredentials, setPbxCredentials] = useState<EnterprisePbxCredential[]>(INITIAL_PBX_CREDENTIALS);
  const [callTraces, setCallTraces] = useState<SipCallTrace[]>(INITIAL_CALL_TRACES);
  const [headerRules, setHeaderRules] = useState<SbcHeaderRule[]>(INITIAL_HEADER_RULES);
  const [acls, setAcls] = useState<SbcGlobalAcl[]>(INITIAL_GLOBAL_ACLS);
  const [sbcAiAlerts, setSbcAiAlerts] = useState<SbcAiAlert[]>(INITIAL_AI_ALERTS);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // ================= SINGLE ACTIVE WINDOW MANAGEMENT CONTROLLER =================
  // Tracks active portal or application state and ensures opening a new module automatically clears or unmounts the previous one.
  const [activeWindow, setActiveWindow] = useState<{
    id: string;
    displayName: string;
    portalMode: PortalMode;
    enterpriseProduct?: EnterpriseProduct;
    customerTab?: CustomerProduct;
    subTab?: string;
    openedAt: number;
    instanceId: string;
  }>(() => {
    const defaultName =
      portalMode === 'mandela_os'
        ? 'MANDELA OS · 30-Application Telecom Workspace'
        : portalMode === 'agnostic_os'
        ? 'Mandela OS Console (Single Flagship)'
        : portalMode === 'public_landing'
        ? 'Enterprise Showcase Landing'
        : portalMode === 'customer_portal'
        ? `Customer Self-Service · ${activeCustomerTab.toUpperCase()}`
        : `Enterprise Suite · ${activeEnterpriseProduct.toUpperCase()}`;

    return {
      id: `module-${portalMode}-${activeEnterpriseProduct || activeCustomerTab}`,
      displayName: defaultName,
      portalMode,
      enterpriseProduct: activeEnterpriseProduct,
      customerTab: activeCustomerTab,
      subTab: system1Tab,
      openedAt: Date.now(),
      instanceId: `inst-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    };
  });

  const openSingleActiveModule = useCallback(
    ({
      portalMode: targetPortalMode,
      enterpriseProduct: targetProduct,
      customerTab: targetCustomerTab,
      subTab: targetSubTab,
      displayName: customName
    }: {
      portalMode: PortalMode;
      enterpriseProduct?: EnterpriseProduct;
      customerTab?: CustomerProduct;
      subTab?: string;
      displayName?: string;
    }) => {
      // 1. Explicitly clear and reset all sub-component states to a clean slate
      setProvisioningNumber(null);
      setSoftphoneTargetNumber(null);
      setAiForecastCountry(null);
      setSimulatorTargetCall(undefined);
      setSimulatorTargetFlowId(undefined);
      setPhoneSimMsisdn('+233244123890');
      setShowTenantModal(false);
      setShowOnboardingModal(false);
      setShowCustomerOnboardingModal(false);
      setShowStressTestModal(false);
      setShowDesignSystemModal(false);
      setShowCommandPalette(false);
      setShowGeminiChat(false);
      setShowNmcpModal(false);

      // 2. Derive intuitive display name
      const name =
        customName ||
        (targetPortalMode === 'mandela_os'
          ? 'MANDELA OS · 30-Application Telecom Workspace'
          : targetPortalMode === 'agnostic_os'
          ? 'Mandela Communications OS'
          : targetPortalMode === 'public_landing'
          ? 'Public Enterprise Showcase'
          : targetPortalMode === 'customer_portal'
          ? `Customer Self-Service · ${(targetCustomerTab || activeCustomerTab).toUpperCase()}`
          : `Enterprise Suite · ${(targetProduct || activeEnterpriseProduct).toUpperCase()}`);

      // 3. Atomically update session persistence and state
      setPortalMode(targetPortalMode);
      if (targetProduct) {
        setActiveEnterpriseProduct(targetProduct);
      }
      if (targetCustomerTab) {
        setActiveCustomerTab(targetCustomerTab);
      }
      if (targetSubTab && targetProduct) {
        if (targetProduct === 'nms_numbers') setSystem1Tab(targetSubTab as System1Tab);
        else if (targetProduct === 'messaging_sms') setSystem2Tab(targetSubTab as System2Tab);
        else if (targetProduct === 'voice_ivr') setSystem3Tab(targetSubTab as System3Tab);
        else if (targetProduct === 'sbc_core') setSystem4Tab(targetSubTab as System4Tab);
        else if (targetProduct === 'dataverse') setDataverseTab(targetSubTab as DataverseTab);
        else if (targetProduct === 'interconnect') setInterconnectTab(targetSubTab as InterconnectTab);
        else if (targetProduct === 'satellite_ntn') setSatelliteTab(targetSubTab as SatelliteTab);
        else if (targetProduct === 'edge_defense') setEdgeDefenseTab(targetSubTab as EdgeDefenseTab);
        else if (targetProduct === 'siem_fabric') setSiemFabricTab(targetSubTab as SiemFabricTab);
        else if (targetProduct === 'ai_anomaly_voice') setAiAnomalyTab(targetSubTab as AiAnomalyTab);
        else if (targetProduct === 'soc_c2') setSocC2Tab(targetSubTab as SocC2Tab);
      }

      // 4. Update the Single Active Window tracking state with new unique instanceId
      // Changing instanceId forces React key reconciliation to unmount the previous component.
      const newInstanceId = `win-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setActiveWindow({
        id: `module-${targetPortalMode}-${targetProduct || targetCustomerTab || 'main'}`,
        displayName: name,
        portalMode: targetPortalMode,
        enterpriseProduct: targetProduct,
        customerTab: targetCustomerTab,
        subTab: targetSubTab,
        openedAt: Date.now(),
        instanceId: newInstanceId
      });

      showToast(`[Single Active Window] Mounted ${name} · Previous module cleared.`);
    },
    [
      setPortalMode,
      setActiveEnterpriseProduct,
      setActiveCustomerTab,
      setSystem1Tab,
      setSystem2Tab,
      setSystem3Tab,
      setSystem4Tab,
      setDataverseTab,
      setInterconnectTab,
      setSatelliteTab,
      setEdgeDefenseTab,
      setSiemFabricTab,
      setAiAnomalyTab,
      setSocC2Tab,
      activeCustomerTab,
      activeEnterpriseProduct
    ]
  );

  // Workbox Offline Read-Only Mode Guard: prevents data mutations when disconnected
  const guardReadOnly = (actionDesc: string): boolean => {
    if (isReadOnly) {
      showToast(`Action blocked: ${actionDesc} is disabled in Read-Only Mode. Workbox offline cache active.`);
      return true;
    }
    return false;
  };

  // ================= MANDELA DATAVERSE HANDLERS =================
  const handleAddSchema = (newSchema: DataverseEntitySchema) => {
    if (guardReadOnly('Schema creation')) return;
    setSchemas((prev) => [newSchema, ...prev]);
    const auditEntry: DataverseAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      tenantId: currentTenantId,
      userId: 'architect_lead@mandela.africa',
      userRole: 'Data Steward & Architect',
      action: 'SCHEMA_ALTER',
      entityName: newSchema.name,
      ipAddress: '197.210.64.12',
      status: 'SUCCESS',
      hashVerification: `sha256:${Math.random().toString(16).substring(2, 18)}`,
      details: `Created new entity schema "${newSchema.displayName}" (${newSchema.name}) with ${newSchema.fields.length} attributes.`
    };
    setDataverseAuditLogs((prev) => [auditEntry, ...prev]);
    showToast(`Schema "${newSchema.displayName}" registered in MANDELA Dataverse.`);
  };

  const handleAddFieldToSchema = (schemaId: string, field: DataverseField) => {
    if (guardReadOnly('Schema attribute modification')) return;
    setSchemas((prev) =>
      prev.map((s) => {
        if (s.id === schemaId) {
          return {
            ...s,
            fields: [...s.fields, field],
            version: s.version + 1,
            updatedAt: new Date().toISOString().slice(0, 10)
          };
        }
        return s;
      })
    );
    const target = schemas.find((s) => s.id === schemaId);
    if (target) {
      const auditEntry: DataverseAuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        tenantId: currentTenantId,
        userId: 'architect_lead@mandela.africa',
        userRole: 'Data Steward & Architect',
        action: 'SCHEMA_ALTER',
        entityName: target.name,
        ipAddress: '197.210.64.12',
        status: 'SUCCESS',
        hashVerification: `sha256:${Math.random().toString(16).substring(2, 18)}`,
        details: `Added attribute "${field.displayName}" (${field.type}) to entity ${target.name}. Incremented schema version to ${target.version + 1}.`
      };
      setDataverseAuditLogs((prev) => [auditEntry, ...prev]);
    }
    showToast(`Attribute "${field.displayName}" committed to Dataverse schema.`);
  };

  const handleCreateRecord = (
    newRecordData: Omit<DataverseRecord, 'id' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>
  ) => {
    if (guardReadOnly('Record creation')) return;
    const newId = `rec-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();
    const primaryAttrVal = Object.values(newRecordData.attributes)[0] || newId;
    const initialHash = `sha256:${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;

    const newRec: DataverseRecord = {
      ...newRecordData,
      id: newId,
      version: 1,
      createdAt: nowIso,
      updatedAt: nowIso,
      versionHistory: [
        {
          versionNumber: 1,
          timestamp: nowIso,
          changedBy: newRecordData.createdBy || 'current_user@mandela.africa',
          action: 'create',
          changes: { [newRecordData.entityName]: { oldValue: null, newValue: primaryAttrVal } },
          integrityHash: initialHash
        }
      ]
    };

    setRecords((prev) => [newRec, ...prev]);
    setSchemas((prev) =>
      prev.map((s) => (s.name === newRecordData.entityName ? { ...s, recordCount: s.recordCount + 1 } : s))
    );

    const auditEntry: DataverseAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      tenantId: newRecordData.tenantId,
      userId: newRecordData.createdBy || 'current_user@mandela.africa',
      userRole: 'Tenant Administrator',
      action: 'CREATE',
      entityName: newRecordData.entityName,
      recordId: newId,
      ipAddress: '197.210.64.12',
      status: 'SUCCESS',
      hashVerification: initialHash,
      details: `Created new ${newRecordData.entityName} record ID ${newId}. Cryptographic seal verified.`
    };
    setDataverseAuditLogs((prev) => [auditEntry, ...prev]);
    showToast(`New ${newRecordData.entityName} record created with tamper-evident cryptographic hash.`);
  };

  const handleUpdateRecord = (updatedRecord: DataverseRecord) => {
    if (guardReadOnly('Record modification')) return;
    const prevRecord = records.find((r) => r.id === updatedRecord.id);
    const nowIso = new Date().toISOString();
    const newVersion = (prevRecord?.version || 1) + 1;
    const newHash = `sha256:${Math.random().toString(16).substring(2, 18)}${Math.random().toString(16).substring(2, 18)}`;

    const diffChanges: Record<string, { oldValue: any; newValue: any }> = {};
    if (prevRecord) {
      Object.keys(updatedRecord.attributes).forEach((key) => {
        if (prevRecord.attributes[key] !== updatedRecord.attributes[key]) {
          diffChanges[key] = {
            oldValue: prevRecord.attributes[key],
            newValue: updatedRecord.attributes[key]
          };
        }
      });
    }

    const versionRecord = {
      versionNumber: newVersion,
      timestamp: nowIso,
      changedBy: 'user_active@farsight.africa',
      action: 'update' as const,
      changes: Object.keys(diffChanges).length > 0 ? diffChanges : { attributes: { oldValue: 'v' + (newVersion - 1), newValue: 'v' + newVersion } },
      integrityHash: newHash
    };

    const finalRecord: DataverseRecord = {
      ...updatedRecord,
      version: newVersion,
      updatedAt: nowIso,
      versionHistory: [versionRecord, ...(prevRecord?.versionHistory || [])]
    };

    setRecords((prev) => prev.map((r) => (r.id === updatedRecord.id ? finalRecord : r)));

    const auditEntry: DataverseAuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      tenantId: updatedRecord.tenantId,
      userId: 'user_active@farsight.africa',
      userRole: 'Tenant Administrator',
      action: 'UPDATE',
      entityName: updatedRecord.entityName,
      recordId: updatedRecord.id,
      ipAddress: '197.210.64.12',
      status: 'SUCCESS',
      hashVerification: newHash,
      details: `Updated ${updatedRecord.entityName} record ${updatedRecord.id}. Incremented to version ${newVersion}. CDC event published.`
    };
    setDataverseAuditLogs((prev) => [auditEntry, ...prev]);
    showToast(`Record ${updatedRecord.id} updated (v${newVersion}) and broadcasted to Kafka CDC pipeline.`);
  };

  const handleAddEventSubscription = (
    newSub: Omit<DataverseEventSubscription, 'id' | 'dispatchedCount' | 'failureCount'>
  ) => {
    if (guardReadOnly('CDC pipeline registration')) return;
    const subRecord: DataverseEventSubscription = {
      ...newSub,
      id: `sub-${Date.now()}`,
      dispatchedCount: 0,
      failureCount: 0,
      lastFired: 'Never'
    };
    setSubscriptions((prev) => [subRecord, ...prev]);
    showToast(`CDC Subscription "${newSub.name}" registered to ${newSub.destinationType} pipeline.`);
  };

  const handleToggleEventSubscription = (id: string) => {
    if (guardReadOnly('CDC pipeline state change')) return;
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s))
    );
    showToast(`CDC event stream toggle applied.`);
  };

  // ================= SYSTEM 4 HANDLERS =================
  const handleDrainPop = (code: PopCode) => {
    if (guardReadOnly('BGP Anycast routing toggle')) return;
    setPops((prev) =>
      prev.map((p) =>
        p.code === code
          ? { ...p, status: p.status === 'draining' ? 'healthy' : 'draining' }
          : p
      )
    );
    showToast(`BGP Anycast routing updated: PoP ${code} traffic state toggled.`);
  };

  const handleScalePop = (code: PopCode, podsCount: number) => {
    if (guardReadOnly('Kamailio pod scaling')) return;
    setPops((prev) =>
      prev.map((p) =>
        p.code === code ? { ...p, kamailioPods: podsCount } : p
      )
    );
    showToast(`Scaled Kamailio pods in ${code} PoP to ${podsCount} pods via System 7 (Mandela Cloud).`);
  };

  const handleApplyAiAction = (alert: SbcAiAlert) => {
    if (guardReadOnly('AI Auto-remediation deployment')) return;
    setSbcAiAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, status: 'resolved', autoRemediated: true } : a))
    );
    if (alert.actionPayload?.actionType === 'block_ip') {
      const newAcl: SbcGlobalAcl = {
        id: `acl-${Date.now()}`,
        cidr: alert.actionPayload.target,
        action: 'block',
        reason: alert.title,
        appliedBy: 'AI Threat Guard (Auto-Remediated)',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH'],
        syncStatus: 'synced_all_pops',
        matchedPacketsLastHour: 240
      };
      setAcls((prev) => [newAcl, ...prev]);
      showToast(`AI Auto-Remediation: Global ACL applied for ${alert.actionPayload.target} across all 6 PoPs in < 30s.`);
    } else if (alert.actionPayload?.actionType === 'scale_pods') {
      handleScalePop(alert.affectedPop as PopCode, 14);
    } else {
      showToast(`Action applied: ${alert.suggestedAction}`);
    }
  };

  const handleTestRegisterPbx = async (pbxId: string): Promise<PopCode> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setPbxCredentials((prev) =>
          prev.map((c) =>
            c.id === pbxId
              ? {
                  ...c,
                  registrationStatus: 'registered',
                  lastRegisterTime: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'
                }
              : c
          )
        );
        showToast('✓ PBX registered from Lagos PoP via Anycast BGP AS37105');
        resolve('LOS');
      }, 1000);
    });
  };

  const handleToggleHeaderRule = (id: string) => {
    setHeaderRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'active' ? 'disabled' : 'active' } : r
      )
    );
    showToast(`Header rule state updated and synced to Kamailio clusters.`);
  };

  const handleAddHeaderRule = (rule: Omit<SbcHeaderRule, 'id'>) => {
    const newRule: SbcHeaderRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    setHeaderRules((prev) => [...prev, newRule]);
    showToast(`Header rule "${rule.name}" deployed across 6 PoPs.`);
  };

  const handleDeleteHeaderRule = (id: string) => {
    setHeaderRules((prev) => prev.filter((r) => r.id !== id));
    showToast(`Header rule removed from Kamailio config.`);
  };

  const handleAddAcl = (acl: Omit<SbcGlobalAcl, 'id' | 'createdAt' | 'syncStatus' | 'matchedPacketsLastHour'>) => {
    const newEntry: SbcGlobalAcl = {
      ...acl,
      id: `acl-${Date.now()}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      syncStatus: 'synced_all_pops',
      matchedPacketsLastHour: 0
    };
    setAcls((prev) => [newEntry, ...prev]);
    showToast(`Global ACL rule for ${acl.cidr} broadcast to 6 PoPs in 1.2s.`);
  };

  const handleRemoveAcl = (id: string) => {
    setAcls((prev) => prev.filter((a) => a.id !== id));
    showToast(`ACL rule revoked across all 6 PoPs.`);
  };

  const handleResolveAlert = (id: string) => {
    setSbcAiAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'resolved' } : a))
    );
    showToast(`AI Alert marked as resolved.`);
  };

  const handleQuickBlockCidr = (cidr: string, reason: string) => {
    const newEntry: SbcGlobalAcl = {
      id: `acl-${Date.now()}`,
      cidr,
      action: 'block',
      reason,
      appliedBy: 'SecOps 1-Click Action',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      activePops: ['LOS', 'NBO', 'JNB', 'CAI', 'DKR', 'FIH'],
      syncStatus: 'synced_all_pops',
      matchedPacketsLastHour: 120
    };
    setAcls((prev) => [newEntry, ...prev]);
    showToast(`Emergency ACL block pushed for ${cidr} across all 6 African PoPs in < 30s.`);
  };

  // ================= SYSTEM 3 HANDLERS =================
  const handleSaveIvrFlow = (updatedFlow: VoiceIvrFlow) => {
    if (guardReadOnly('Call flow deployment')) return;
    setIvrFlows((prev) =>
      prev.map((f) => (f.id === updatedFlow.id ? updatedFlow : f))
    );
    showToast(`Call flow "${updatedFlow.name}" saved and published to FreeSWITCH cluster.`);
  };

  const handleTestFlowInSimulator = (flow: VoiceIvrFlow) => {
    setSimulatorTargetFlowId(flow.id);
    setSystem3Tab('call_simulator');
    showToast(`Testing flow "${flow.name}" on sovereign line ${flow.assignedE164}.`);
  };

  const handleSupervisorAction = (callId: string, action: 'listening' | 'whispering' | 'barged' | 'none') => {
    setLiveCalls((prev) =>
      prev.map((c) => (c.id === callId ? { ...c, supervisorMode: action } : c))
    );
    showToast(`Supervisor mode set to "${action.toUpperCase()}" for call ${callId}. Audit logged.`);
  };

  const handleCallCompletedInSimulator = (summary: any) => {
    const newSummary: CallSummaryReport = {
      callId: summary.callId,
      callerMsisdn: summary.callerMsisdn,
      didE164: summary.didE164,
      language: summary.language,
      durationSec: summary.durationSec,
      intent: summary.intent,
      structuredOutcome: summary.structuredOutcome,
      sentiment: summary.sentiment,
      transcriptSummary: summary.summaryNotes,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      recordingWaveform: [30, 55, 75, 90, 80, 60, 45, 85, 70, 50, 40, 20]
    };
    setCallSummaries((prev) => [newSummary, ...prev]);
    showToast(`Call summarized and stored. Structured intent extracted.`);
  };

  // ================= SYSTEM 2 HANDLERS =================
  const handleDispatchMessage = (newMsg: MessageRecord) => {
    if (guardReadOnly('SMS message dispatch')) return;
    setMessages((prev) => [newMsg, ...prev]);
    const newPdu: SmppPduTrace = {
      id: `pdu-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      command: 'DELIVER_SM',
      direction: 'inbound',
      commandStatus: 'ESME_ROK',
      sequenceNumber: newMsg.smppSequenceNumber,
      sourceAddr: newMsg.to,
      destAddr: newMsg.from,
      hexDump: `00 00 00 68 00 00 00 05 00 00 00 00 ... stat:DELIVRD`,
      decodedSummary: `SMPP DELIVER_SM (DLR): stat=DELIVRD, latency=${newMsg.latencyMs || 2400}ms`
    };
    setPduTraces((prev) => [newPdu, ...prev]);
    showToast(`Dispatched message to ${newMsg.to}. Correlated DLR status: DELIVRD.`);
  };

  const handleTriggerRebind = (bindId: string) => {
    setBinds((prev) =>
      prev.map((b) => (b.id === bindId ? { ...b, state: 'BOUND', lastEnquireLink: 'Just now' } : b))
    );
    showToast(`SMPP bind ${bindId} re-established successfully.`);
  };

  const handleBulkRebind = (bindIds: string[]) => {
    if (bindIds.length === 0) return;
    const idSet = new Set(bindIds);
    setBinds((prev) =>
      prev.map((b) =>
        idSet.has(b.id)
          ? { ...b, state: 'BOUND', lastEnquireLink: 'Just now', tps: b.tps || Math.round(b.maxTps * 0.45), latencyMs: b.latencyMs || 48 }
          : b
      )
    );
    showToast(`Bulk rebind completed: ${bindIds.length} SMPP bind(s) re-established to BOUND.`);
  };

  const handleSendProbeEnquireLink = (bindId: string) => {
    showToast(`Heartbeat probe ENQUIRE_LINK acknowledged on ${bindId} (RTT: 38ms).`);
  };

  const handleApplyAiReroute = (carrier: string, failoverRoute: string) => {
    setCarrierMetrics((prev) =>
      prev.map((c) =>
        c.carrier === carrier
          ? { ...c, status: 'rerouted', currentDeliveryRate: 98.5, activeAlert: undefined }
          : c
      )
    );
    showToast(`Rerouted ${carrier} traffic to ${failoverRoute}. Restored delivery SLA to 98.5%.`);
  };

  // ================= SYSTEM 1 HANDLERS =================
  const handleSelectCountryFromMap = (country: AfricanCountry) => {
    setSelectedCountryCode(country.code);
    setSystem1Tab('inventory');
  };

  const handleInitiatePurchase = (number: PhoneNumberRecord) => {
    setProvisioningNumber(number);
  };

  const handleCompleteProvisioning = (updatedNumber: PhoneNumberRecord) => {
    if (guardReadOnly('Number provisioning')) return;
    setNumbers((prev) =>
      prev.map((num) => (num.id === updatedNumber.id ? updatedNumber : num))
    );
    setProvisioningNumber(null);
    setCountries((prev) =>
      prev.map((c) =>
        c.code === updatedNumber.countryCode
          ? { ...c, availableInventory: Math.max(0, c.availableInventory - 1) }
          : c
      )
    );
    showToast(`Number ${updatedNumber.e164} successfully provisioned to Mandela SIP fabric in under 60 seconds.`);
  };

  const handleUpdateRouting = (numberId: string, sipUri: string, webhookUrl: string) => {
    if (guardReadOnly('Number routing update')) return;
    setNumbers((prev) =>
      prev.map((n) => (n.id === numberId ? { ...n, sipTrunkUri: sipUri, webhookUrl } : n))
    );
    showToast(`Live routing updated for number ID: ${numberId}`);
  };

  const handleReleaseNumber = (numberId: string) => {
    if (guardReadOnly('Number recycling release')) return;
    setNumbers((prev) =>
      prev.map((n) => (n.id === numberId ? { ...n, status: 'recycling' } : n))
    );
    showToast(`Number placed into statutory recycling quarantine.`);
  };

  const handleTriggerAutoOrder = (countryCode: string, count: number) => {
    if (guardReadOnly('Regulatory inventory order')) return;
    setCountries((prev) =>
      prev.map((c) =>
        c.code === countryCode
          ? { ...c, availableInventory: c.availableInventory + count }
          : c
      )
    );
    showToast(`Replenished +${count.toLocaleString()} E.164 ranges for ${countryCode} regulatory buffer.`);
  };

  const handleSubmitNewPort = (newReq: PortingRequest) => {
    if (guardReadOnly('Porting request submission')) return;
    setPortingRequests((prev) => [newReq, ...prev]);
    showToast(`Port request for ${newReq.number} submitted to regulatory clearinghouse.`);
  };

  const handleAdvancePortStatus = (requestId: string) => {
    if (guardReadOnly('Port status update')) return;
    setPortingRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const nextStatus = req.status === 'submitted' ? 'in-progress' : 'completed';
          return { ...req, status: nextStatus };
        }
        return req;
      })
    );
  };

  const handleUploadLicense = (license: SovereignLicense) => {
    if (guardReadOnly('License registration')) return;
    setLicenses((prev) => [license, ...prev]);
    showToast(`License ${license.licenseNumber} registered for ${license.countryName}.`);
  };

  const handleAdvanceRecycleStep = (numberId: string) => {
    if (guardReadOnly('Quarantine release')) return;
    setNumbers((prev) =>
      prev.map((n) => (n.id === numberId ? { ...n, status: 'available' } : n))
    );
    showToast(`Quarantine cleared. Number returned to available inventory buffer.`);
  };

  // ================= CARRIER INTERCONNECT HANDLERS =================
  const handleUploadRateDeck = (newDeck: CarrierRateDeck) => {
    if (guardReadOnly('Carrier rate deck ingestion')) return;
    setRateDecks((prev) => [newDeck, ...prev]);
    showToast(`Carrier rate deck for ${newDeck.carrierName} ingested. Parsed accuracy: ${newDeck.parsedAccuracyPercent}%`);
  };

  const handleApplyInterconnectReroute = (alert: InterconnectMarginAlert) => {
    if (guardReadOnly('Carrier reroute execution')) return;
    setInterconnectAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, status: 'applied' } : a))
    );
    showToast(`Traffic for ${alert.destination} rerouted away from ${alert.carrier}. Margin protected.`);
  };

  // ================= MULTI-TENANT & SUBSCRIPTION HANDLERS =================
  const handleUpgradeSubscription = (targetTier: SubscriptionTier) => {
    if (guardReadOnly('Subscription upgrade')) return;
    const newPlan = SUBSCRIPTION_TIERS[targetTier];
    setTenantAccounts((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            subscription: newPlan,
            dataIsolationMode:
              targetTier === 'sovereign_telco' || targetTier === 'fintech_enterprise'
                ? 'dedicated_keyspace'
                : t.dataIsolationMode,
            usage: {
              ...t.usage,
              currentMonthSpendUsd: t.usage.currentMonthSpendUsd + newPlan.monthlyFeeUsd
            }
          };
        }
        return t;
      })
    );
    showToast(`Tenant upgraded to ${newPlan.displayName}! All carrier-grade features unlocked.`);
  };

  const handleCreateTenant = (newTenant: TenantAccount) => {
    if (guardReadOnly('Tenant creation')) return;
    setTenantAccounts((prev) => [newTenant, ...prev]);
    setCurrentTenantId(newTenant.id);
    showToast(`Tenant "${newTenant.name}" registered and authenticated.`);
  };

  const handleDispatchTestSms = (recipient: string, text: string) => {
    if (guardReadOnly('Test SMS dispatch')) return;
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      to: recipient,
      from: 'MANDELA-SECURE',
      body: text,
      type: 'transactional',
      channel: 'sms',
      status: 'delivered',
      countryCode: 'KE',
      carrier: 'Safaricom Direct Interconnect',
      bindId: 'bind-01',
      smppSequenceNumber: Math.floor(Math.random() * 10000) + 1,
      dlrStatus: 'DELIVRD',
      submittedAt: new Date().toISOString(),
      deliveredAt: new Date().toISOString(),
      latencyMs: 38,
      attempts: 1,
      maxAttempts: 3,
      aiPredictedFailure: false,
      costUsd: 0.0042,
      hlrReachable: true,
      handsetDeviceType: 'smartphone_3g_4g'
    };
    setMessages((prev) => [newMsg, ...prev]);
    setTenantAccounts((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            usage: {
              ...t.usage,
              smsDeliveredThisMonth: t.usage.smsDeliveredThisMonth + 1,
              currentMonthSpendUsd: t.usage.currentMonthSpendUsd + 0.0042
            }
          };
        }
        return t;
      })
    );
    showToast(`SMS to ${recipient} delivered via Direct SMPP!`);
  };

  const handleOrderStorefrontNumber = (newNumber: PhoneNumberRecord) => {
    if (guardReadOnly('Number purchase')) return;
    setNumbers((prev) => [newNumber, ...prev]);
    showToast(`Sovereign DID ${newNumber.e164} successfully provisioned to ${currentTenant.name}!`);
  };

  const handleTopUpBalance = (amountUsd: number) => {
    if (guardReadOnly('Balance top-up')) return;
    setTenantAccounts((prev) =>
      prev.map((t) => {
        if (t.id === currentTenantId) {
          return {
            ...t,
            usage: {
              ...t.usage,
              accountBalanceUsd: t.usage.accountBalanceUsd + amountUsd
            }
          };
        }
        return t;
      })
    );
    showToast(`Prepaid balance topped up by $${amountUsd.toLocaleString()} USD!`);
  };

  const isCurrentProductAllowed = (prod: EnterpriseProduct): boolean => {
    return currentTenant.subscription.allowedProducts.includes(prod);
  };

  const assignedNumbers = numbers.filter((n) => n.status === 'assigned');
  const quarantinedNumbers = numbers.filter((n) => n.status === 'recycling');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* ================= PORTAL 0: PUBLIC ENTERPRISE SHOWCASE ================= */}
      {portalMode === 'public_landing' && (
        <div key={activeWindow.instanceId} className="min-h-screen bg-slate-950 text-slate-100 font-sans">
          <EnterpriseLandingView
            onLaunchConsole={(mode) => openSingleActiveModule({ portalMode: mode || 'mandela_os' })}
            onOpenCustomerPortal={() => openSingleActiveModule({ portalMode: 'customer_portal' })}
            onOpenStressTest={() => setShowStressTestModal(true)}
            onNavigateProduct={(prod) => {
              openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: prod });
            }}
          />
        </div>
      )}

      {/* ================= PORTAL: AGNOSTIC COMMUNICATIONS OS ================= */}
      {portalMode === 'agnostic_os' && (
        <div key={activeWindow.instanceId} className="min-h-screen bg-zinc-800 text-zinc-100 font-sans">
          <AgnosticOsMasterView
            currentTenant={currentTenant}
            onSwitchPortalMode={(mode) => openSingleActiveModule({ portalMode: mode })}
            onOpenTenantModal={() => setShowTenantModal(true)}
            onOpenStressTest={() => setShowStressTestModal(true)}
            onOpenOnboarding={() => setShowCustomerOnboardingModal(true)}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
            onOpenSoftphone={(num) => setSoftphoneTargetNumber(num)}
            onOpenDesignSystem={() => setShowDesignSystemModal(true)}
          />
        </div>
      )}

      {/* ================= PORTAL: REFACTORED MANDELA OS UNIFIED WORKSPACE ================= */}
      {portalMode === 'mandela_os' && (
        <div key={activeWindow.instanceId} className="min-h-screen bg-white text-black font-sans">
          <MandelaUnifiedShell
            bridge={{
              currentTenant,
              countries,
              numbers,
              selectedCountryCode,
              onCountryChange: setSelectedCountryCode,
              onInitiatePurchase: handleInitiatePurchase,
              onOpenAiForecast: (c) => setAiForecastCountry(c),
              onOpenSoftphone: (num) => setSoftphoneTargetNumber(num),
              onUpdateRouting: handleUpdateRouting,
              onReleaseNumber: handleReleaseNumber,
              portingRequests,
              onSubmitNewPort: handleSubmitNewPort,
              onAdvancePortStatus: handleAdvancePortStatus,
              licenses,
              auditLogs,
              onUploadLicense: handleUploadLicense,
              onAdvanceRecycleStep: handleAdvanceRecycleStep,
              binds,
              carrierMetrics,
              messages,
              pduTraces,
              onDispatchMessage: handleDispatchMessage,
              onTriggerRebind: handleTriggerRebind,
              onBulkRebind: handleBulkRebind,
              onSendProbeEnquireLink: handleSendProbeEnquireLink,
              onApplyAiReroute: handleApplyAiReroute,
              ivrFlows,
              liveCalls,
              languages,
              onSaveIvrFlow: handleSaveIvrFlow,
              onSupervisorAction: handleSupervisorAction,
              onCallCompleted: handleCallCompletedInSimulator,
              pops,
              pbxCredentials,
              callTraces,
              headerRules,
              acls,
              sbcAiAlerts,
              onDrainPop: handleDrainPop,
              onScalePop: handleScalePop,
              onApplyAiAction: handleApplyAiAction,
              onTestRegisterPbx: handleTestRegisterPbx,
              onCreatePbxCredential: (cred) => {
                const newCred = {
                  ...cred,
                  id: `pbx-${Date.now()}`,
                  registrationStatus: 'unregistered'
                } as EnterprisePbxCredential;
                setPbxCredentials((prev) => [...prev, newCred]);
                showToast('PBX trunk credentials generated.');
              },
              onToggleHeaderRule: handleToggleHeaderRule,
              onAddHeaderRule: handleAddHeaderRule,
              onDeleteHeaderRule: handleDeleteHeaderRule,
              onAddAcl: handleAddAcl,
              onRemoveAcl: handleRemoveAcl,
              onResolveAlert: handleResolveAlert,
              onQuickBlockCidr: handleQuickBlockCidr,
              carrierRoutes,
              rateDecks,
              mediatedCdrs,
              interconnectAlerts,
              onUploadRateDeck: handleUploadRateDeck,
              onApplyInterconnectReroute: handleApplyInterconnectReroute,
              dataverseTenants,
              onSelectTenant: setCurrentTenantId,
              schemas,
              relationships,
              records,
              subscriptions,
              roles,
              dataverseAuditLogs,
              aiDataPolicy,
              onAddSchema: handleAddSchema,
              onAddFieldToSchema: handleAddFieldToSchema,
              onUpdateRecord: handleUpdateRecord,
              onCreateRecord: handleCreateRecord,
              onAddEventSubscription: handleAddEventSubscription,
              onToggleEventSubscription: handleToggleEventSubscription
            }}
            connectors={connectors}
            activeCustomerTab={activeCustomerTab}
            onSelectCustomerTab={(tab) => setActiveCustomerTab(tab)}
            assignedNumbers={assignedNumbers}
            onUpgradeSubscription={handleUpgradeSubscription}
            onDispatchTestSms={handleDispatchTestSms}
            onOrderNumber={handleOrderStorefrontNumber}
            onTopUpBalance={handleTopUpBalance}
            onOpenTenantModal={() => setShowTenantModal(true)}
            onOpenCommandPalette={() => setShowCommandPalette(true)}
            onOpenDesignSystem={() => setShowDesignSystemModal(true)}
            onOpenStressTest={() => setShowStressTestModal(true)}
            onOpenNmcpControlPlane={() => setShowNmcpModal(true)}
            onOpenGeminiChat={() => setShowGeminiChat(true)}
            onOpenPublicLanding={() => openSingleActiveModule({ portalMode: 'public_landing' })}
            onOpenLegacyDesktop={() => openSingleActiveModule({ portalMode: 'agnostic_os' })}
            onOpenCustomerOnboarding={() => setShowCustomerOnboardingModal(true)}
            isReadOnly={isReadOnly}
            onToggleSimulateOffline={() => {
              toggleSimulateOffline();
              showToast(
                !isSimulatedOffline
                  ? 'Workbox Read-Only Cache Enabled (Simulated Offline).'
                  : 'Reconnected to live network.'
              );
            }}
            onShowToast={showToast}
          />
        </div>
      )}

      {/* ================= PORTAL 1 & 2: ENTERPRISE SUITE & CUSTOMER PORTAL ================= */}
      {(portalMode === 'enterprise_suite' || portalMode === 'customer_portal') && (
        <div className="min-h-screen bg-white text-black flex font-sans selection:bg-black selection:text-white">
          {/* 1. Left Navigation Sidebar */}
          <LeftSidebar
        portalMode={portalMode}
        onSelectPortalMode={(mode) => openSingleActiveModule({ portalMode: mode })}
        activeEnterpriseProduct={activeEnterpriseProduct}
        onSelectEnterpriseProduct={(prod) =>
          openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: prod })
        }
        activeCustomerTab={activeCustomerTab}
        onSelectCustomerTab={(tab) =>
          openSingleActiveModule({ portalMode: 'customer_portal', customerTab: tab })
        }
        dataverseTab={dataverseTab}
        onSelectDataverseTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'dataverse',
            subTab: tab,
            displayName: `Dataverse · ${tab.toUpperCase()}`
          })
        }
        edgeDefenseTab={edgeDefenseTab}
        onSelectEdgeDefenseTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'edge_defense',
            subTab: tab,
            displayName: `Edge Defense · ${tab.toUpperCase()}`
          })
        }
        siemFabricTab={siemFabricTab}
        onSelectSiemFabricTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'siem_fabric',
            subTab: tab,
            displayName: `SIEM Fabric · ${tab.toUpperCase()}`
          })
        }
        aiAnomalyTab={aiAnomalyTab}
        onSelectAiAnomalyTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'ai_anomaly_voice',
            subTab: tab,
            displayName: `AI Anomaly · ${tab.toUpperCase()}`
          })
        }
        socC2Tab={socC2Tab}
        onSelectSocC2Tab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'soc_c2',
            subTab: tab,
            displayName: `SOC C2 · ${tab.toUpperCase()}`
          })
        }
        system4Tab={system4Tab}
        onSelectSystem4Tab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'sbc_core',
            subTab: tab,
            displayName: `SBC Core · ${tab.toUpperCase()}`
          })
        }
        interconnectTab={interconnectTab}
        onSelectInterconnectTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'interconnect',
            subTab: tab,
            displayName: `Interconnect · ${tab.toUpperCase()}`
          })
        }
        satelliteTab={satelliteTab}
        onSelectSatelliteTab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'satellite_ntn',
            subTab: tab,
            displayName: `Satellite NTN · ${tab.toUpperCase()}`
          })
        }
        system3Tab={system3Tab}
        onSelectSystem3Tab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'voice_ivr',
            subTab: tab,
            displayName: `Voice & IVR · ${tab.toUpperCase()}`
          })
        }
        system2Tab={system2Tab}
        onSelectSystem2Tab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'messaging_sms',
            subTab: tab,
            displayName: `Messaging Gateway · ${tab.toUpperCase()}`
          })
        }
        system1Tab={system1Tab}
        onSelectSystem1Tab={(tab) =>
          openSingleActiveModule({
            portalMode: 'enterprise_suite',
            enterpriseProduct: 'nms_numbers',
            subTab: tab,
            displayName: `Sovereign NMS · ${tab.toUpperCase()}`
          })
        }
        currentTenant={currentTenant}
        onOpenTenantModal={() => setShowTenantModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenStressTest={() => setShowStressTestModal(true)}
        onOpenDesignSystem={() => setShowDesignSystemModal(true)}
        onOpenNmcpControlPlane={() => setShowNmcpModal(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Main App Content Container shifted by dual-rail sidebar width */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? 'pl-[88px]' : 'pl-[380px]'
        }`}
      >
        {/* Top Header */}
        <TopHeader
          portalMode={portalMode}
          activeEnterpriseProduct={activeEnterpriseProduct}
          activeCustomerTab={activeCustomerTab}
          currentTenant={currentTenant}
          onOpenTenantModal={() => setShowTenantModal(true)}
          onOpenOnboarding={() => setShowOnboardingModal(true)}
          onOpenStressTest={() => setShowStressTestModal(true)}
          onOpenDesignSystem={() => setShowDesignSystemModal(true)}
          onOpenNmcpControlPlane={() => setShowNmcpModal(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          onOpenGeminiChat={() => setShowGeminiChat(true)}
          onSwitchToLanding={() => openSingleActiveModule({ portalMode: 'public_landing' })}
          onSwitchToAgnosticOs={() => openSingleActiveModule({ portalMode: 'agnostic_os' })}
          activePersona={activePersona}
          onSelectPersona={(persona) => {
            setActivePersona(persona);
            if (activeEnterpriseProduct === 'dataverse') {
              if (persona === 'ops') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'dataverse', subTab: 'overview' });
              if (persona === 'novice') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'dataverse', subTab: 'records' });
              if (persona === 'developer') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'dataverse', subTab: 'query' });
              if (persona === 'enterprise') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'dataverse', subTab: 'schemas' });
            } else if (activeEnterpriseProduct === 'sbc_core') {
              if (persona === 'ops') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'sbc_core', subTab: 'sbc_noc' });
              if (persona === 'novice') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'sbc_core', subTab: 'pbx_connect' });
              if (persona === 'developer') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'sbc_core', subTab: 'ladder_traces' });
              if (persona === 'enterprise') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'sbc_core', subTab: 'header_rules' });
            } else if (activeEnterpriseProduct === 'voice_ivr') {
              if (persona === 'ops') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'voice_ivr', subTab: 'voice_noc' });
              if (persona === 'novice') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'voice_ivr', subTab: 'ivr_builder' });
              if (persona === 'developer') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'voice_ivr', subTab: 'ivr_builder' });
              if (persona === 'enterprise') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'voice_ivr', subTab: 'call_summaries' });
            } else if (activeEnterpriseProduct === 'messaging_sms') {
              if (persona === 'ops') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'messaging_sms', subTab: 'noc_dashboard' });
              if (persona === 'novice') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'messaging_sms', subTab: 'dispatcher' });
              if (persona === 'developer') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'messaging_sms', subTab: 'smpp_binds' });
              if (persona === 'enterprise') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'messaging_sms', subTab: 'routing_engine' });
            } else if (activeEnterpriseProduct === 'nms_numbers') {
              if (persona === 'ops') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'nms_numbers', subTab: 'command_control' });
              if (persona === 'novice') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'nms_numbers', subTab: 'inventory' });
              if (persona === 'developer') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'nms_numbers', subTab: 'api' });
              if (persona === 'enterprise') openSingleActiveModule({ portalMode: 'enterprise_suite', enterpriseProduct: 'nms_numbers', subTab: 'porting' });
            }
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          onUpgradeTier={() => setShowTenantModal(true)}
        />

        {/* Offline Read-Only Banner powered by Workbox Service Worker */}
        {isReadOnly && (
          <div className="bg-amber-500 text-zinc-950 px-4 sm:px-6 lg:px-8 py-2.5 border-b border-amber-600 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-sans transition-all">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-black/10 text-zinc-950">
                <WifiOff className="w-4 h-4 shrink-0" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[11px] uppercase tracking-wider font-mono bg-black text-amber-300 px-1.5 py-0.5 rounded-[2px]">
                    OFFLINE READ-ONLY MODE
                  </span>
                  <span className="text-xs font-semibold">
                    Workbox Service Worker Active · Remote African Infrastructure Resilient
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-900 mt-0.5 leading-snug">
                  Network connection disconnected {offlineSince ? `since ${new Date(offlineSince).toLocaleTimeString()}` : ''}. Serving cached static bundles and critical telemetry across all 11 portals. Mutations and write operations are locked.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => {
                  toggleSimulateOffline();
                  showToast(
                    isSimulatedOffline
                      ? 'Reconnected to remote African telecom network: Live mode restored.'
                      : 'Simulating remote network outage: Workbox read-only cache active.'
                  );
                }}
                className="px-3 py-1 bg-black text-white hover:bg-zinc-800 text-xs font-mono font-semibold rounded-[2px] transition-colors cursor-pointer"
              >
                {isSimulatedOffline ? 'RECONNECT (END SIMULATION)' : 'RETRY CONNECTION'}
              </button>
            </div>
          </div>
        )}

        {/* Suite Context Strip */}
        <div className="bg-zinc-50 border-b border-black/10 px-4 sm:px-6 lg:px-8 py-3 text-xs sm:text-[13px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-black/75">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-bold text-black text-sm">
                {portalMode === 'customer_portal' && 'Customer Workspace:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'interconnect' && 'Portal 01 · Carrier Interconnect & LCR Rate Engine:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'satellite_ntn' && 'Portal 02 · Satellite NTN & Orbital Teleport Gateway:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'sbc_core' && 'Portal 03 · Carrier SBC & Anycast SIP Core:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'voice_ivr' && 'Portal 04 · Consumer Voice & Multilingual IVR Cluster:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'messaging_sms' && 'Portal 05 · SMS & USSD Messaging Gateway:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'nms_numbers' && 'Portal 06 · Sovereign Number Management (NMS):'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'dataverse' && 'Portal 07 · MANDELA Sovereign Dataverse & Storage Fabric:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'edge_defense' && 'Portal 08 · Inline Signaling & Edge Defense Plane:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'siem_fabric' && 'Portal 09 · 18-System SIEM Ingestion & Normalization Fabric:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'ai_anomaly_voice' && 'Portal 10 · AI Anomaly & Voice Fraud Detection:'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'soc_c2' && 'Portal 11 · SOC Command & Control (C2) Real-Time UI:'}
              </span>
              <span className="text-black/60 hidden md:inline font-sans text-xs sm:text-[13px]">
                {portalMode === 'customer_portal' && `Tenant: ${currentTenant.name} (${currentTenant.subscription.displayName}). Provisioned lines & consumption.`}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'interconnect' && 'Real-time LCR optimization across 100+ carriers with automated grey route quarantine.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'satellite_ntn' && 'Direct-to-device LEO satellite constellations and telemetry ground teleports.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'sbc_core' && 'Carrier edge Kamailio + FreeSWITCH + RTPEngine across 6 African PoPs (10,000 CPS).'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'voice_ivr' && 'FreeSWITCH media cluster with 50 African languages neural ASR/TTS.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'messaging_sms' && 'Direct SMPP v5 binds to African MNOs + native USSD gateway over SIGTRAN.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'nms_numbers' && 'Foundational E.164 sovereign inventory, MNP, and GSMA SGP.22 eSIM cryptographic binding.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'dataverse' && 'Multi-tenant isolation, shared schemas, record versioning, and CDC pipelines.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'edge_defense' && 'SS7/Diameter signaling firewall, STIR/SHAKEN verification, and IXP eBPF scrubbing.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'siem_fabric' && 'Apache Flink 15-minute state correlation, OCSF connectors, and tiered lakehouse.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'ai_anomaly_voice' && 'Geodesic velocity engine, SIM-box ST-GNN, and RawNet3 acoustic voice deepfake scanner.'}
                {portalMode === 'enterprise_suite' && activeEnterpriseProduct === 'soc_c2' && 'Sovereign incident response, multi-hop entity graph, and SIM-swap quarantine lockdown.'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs font-mono shrink-0 flex-wrap">
              {/* Workbox Service Worker Cache & Connection Status */}
              <span
                className={`font-semibold uppercase tracking-wider border px-2.5 py-1 rounded-[2px] flex items-center gap-1.5 ${
                  isReadOnly
                    ? 'text-amber-900 bg-amber-50 border-amber-300'
                    : 'text-black/80 bg-white border-black/15'
                }`}
                title={
                  isReadOnly
                    ? `Remote network disconnected. Serving cached static assets and critical responses from Workbox cache.`
                    : 'Workbox Service Worker active: static assets, fonts, and critical /api/* responses cached for offline operations.'
                }
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full inline-block ${
                    isReadOnly ? 'bg-amber-600 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                WORKBOX: {isReadOnly ? 'READ-ONLY (OFFLINE)' : 'CACHE READY (ONLINE)'}
              </span>

              {/* Simulation Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  toggleSimulateOffline();
                  showToast(
                    !isSimulatedOffline
                      ? 'Simulating remote African network disconnect: Workbox read-only mode active.'
                      : 'Reconnected to network: Live bi-directional mode restored.'
                  );
                }}
                className="text-black font-semibold uppercase tracking-wider bg-white hover:bg-zinc-100 border border-black/15 px-2 py-1 rounded-[2px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Toggle network simulation to test Workbox offline caching and read-only safeguards"
              >
                {isSimulatedOffline ? <Wifi className="w-3 h-3 text-emerald-600" /> : <WifiOff className="w-3 h-3 text-amber-600" />}
                <span className="text-[10px]">{isSimulatedOffline ? 'RECONNECT' : 'TEST OFFLINE'}</span>
              </button>

              <span
                className="text-black/80 font-semibold uppercase tracking-wider bg-white border border-black/15 px-2.5 py-1 rounded-[2px] flex items-center gap-1.5"
                title="Active sub-tabs across all 11 system architecture portals are automatically persisted to localStorage and restored on switch"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                SESSION PERSISTENCE: 11 PORTALS SYNCED
              </span>
              <button
                type="button"
                onClick={() => {
                  const next: DensityMode =
                    densityMode === 'compact' ? 'standard' : densityMode === 'standard' ? 'spacious' : 'compact';
                  setDensityMode(next);
                  showToast(`Density mode switched to ${next.toUpperCase()}`);
                }}
                className="text-black font-semibold uppercase tracking-wider bg-white hover:bg-zinc-100 border border-black/15 px-2.5 py-1 rounded-[2px] flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Click to cycle layout density ('compact' | 'standard' | 'spacious') or open Command Palette (⌘K) to toggle"
              >
                <span className="text-black/50 font-normal">DENSITY:</span>
                <span className="text-black font-bold">{densityMode.toUpperCase()}</span>
              </button>
              <span className="text-black font-semibold uppercase tracking-wider bg-white border border-black/15 px-2.5 py-1 rounded-[2px]">
                TENANT: {currentTenant.slug.toUpperCase()} · TIER: {currentTenant.subscription.tier.toUpperCase()} · STATUS: OK
              </span>

              {/* Single Active Window State & Enforcement Indicator */}
              <span
                className="text-black font-mono font-semibold uppercase tracking-wider bg-white border border-emerald-500/50 px-2.5 py-1 rounded-[2px] flex items-center gap-1.5 shadow-xs"
                title="Single Active Window Enforcement: Opening a new module automatically clears and unmounts the previous one."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-black/50 font-normal">ACTIVE WINDOW:</span>
                <span className="text-emerald-700 font-bold">{activeWindow.displayName}</span>
                <span className="text-[10px] text-black/40 font-normal">· AUTO-UNMOUNT: ON</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Area: Enforces Single Active Window unmounting via key={activeWindow.instanceId} */}
        <main
          key={activeWindow.instanceId}
          className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-in fade-in duration-150"
        >
          {/* ================= PORTAL 1: CUSTOMER SELF-SERVICE PORTAL ================= */}
          {portalMode === 'customer_portal' && (
            <CustomerPortalView
              key={activeWindow.instanceId}
              currentTenant={currentTenant}
              activeCustomerTab={activeCustomerTab}
              onSelectCustomerTab={(tab) =>
                openSingleActiveModule({ portalMode: 'customer_portal', customerTab: tab })
              }
              assignedNumbers={assignedNumbers}
              onOpenSoftphone={(num) => setSoftphoneTargetNumber(num)}
              onUpgradeSubscription={handleUpgradeSubscription}
              onDispatchTestSms={handleDispatchTestSms}
              onOrderNumber={handleOrderStorefrontNumber}
              onTopUpBalance={handleTopUpBalance}
              onOpenStressTest={() => setShowStressTestModal(true)}
              onOpenOnboarding={() => setShowCustomerOnboardingModal(true)}
            />
          )}

          {/* ================= PORTAL 2: ENTERPRISE SUITE ================= */}
          {portalMode === 'enterprise_suite' && (
            <>
              {/* Check if product is allowed under tenant subscription */}
              {!isCurrentProductAllowed(activeEnterpriseProduct) ? (
                <SubscriptionGatedBanner
                  currentTenant={currentTenant}
                  requiredTier={
                    activeEnterpriseProduct === 'satellite_ntn'
                      ? 'satellite_operator'
                      : activeEnterpriseProduct === 'sbc_core' || activeEnterpriseProduct === 'interconnect'
                      ? 'sovereign_telco'
                      : 'fintech_enterprise'
                  }
                  featureName={
                    activeEnterpriseProduct === 'satellite_ntn'
                      ? 'Satellite Carrier Core & 3GPP Rel-17 NTN Gateway'
                      : activeEnterpriseProduct === 'sbc_core'
                      ? 'System 4: Sovereign SIP Core & Kamailio SBC'
                      : activeEnterpriseProduct === 'interconnect'
                      ? 'Carrier Interconnect & LCRq Dynamic Rate Engine'
                      : activeEnterpriseProduct === 'dataverse'
                      ? 'MANDELA Dataverse'
                      : 'Enterprise Telecom Capability'
                  }
                  onUpgradeTier={handleUpgradeSubscription}
                />
              ) : (
                <>
                  {/* PRODUCT 1: MANDELA DATAVERSE */}
                  {activeEnterpriseProduct === 'dataverse' && (
                    <>
                      {dataverseTab === 'overview' && (
                        <DataverseOverview
                          tenants={dataverseTenants}
                          currentTenantId={currentTenantId}
                          onSelectTenant={setCurrentTenantId}
                          schemas={schemas}
                          records={records}
                          events={subscriptions}
                          onNavigateTab={(tab) => setDataverseTab(tab)}
                        />
                      )}

                      {dataverseTab === 'schemas' && (
                        <SchemaDesigner
                          schemas={schemas}
                          relationships={relationships}
                          onAddSchema={handleAddSchema}
                          onAddFieldToSchema={handleAddFieldToSchema}
                        />
                      )}

                      {dataverseTab === 'records' && (
                        <RecordExplorer
                          schemas={schemas}
                          records={records}
                          currentTenantId={currentTenantId}
                          onUpdateRecord={handleUpdateRecord}
                          onCreateRecord={handleCreateRecord}
                        />
                      )}

                      {dataverseTab === 'query' && (
                        <QueryStudio
                          schemas={schemas}
                          records={records}
                          currentTenantId={currentTenantId}
                        />
                      )}

                      {dataverseTab === 'events' && (
                        <EventPipeline
                          subscriptions={subscriptions}
                          onAddSubscription={handleAddEventSubscription}
                          onToggleSubscription={handleToggleEventSubscription}
                        />
                      )}

                      {dataverseTab === 'governance' && (
                        <GovernanceRbac
                          roles={roles}
                          auditLogs={dataverseAuditLogs}
                        />
                      )}

                      {dataverseTab === 'ai_data' && (
                        <AiDataService
                          policy={aiDataPolicy}
                          schemas={schemas}
                          records={records}
                        />
                      )}
                    </>
                  )}

                  {/* PRODUCT: EDGE DEFENSE PLANE (MODULE 1) */}
                  {activeEnterpriseProduct === 'edge_defense' && (
                    <EdgeDefenseSuite currentTenantId={currentTenantId} />
                  )}

                  {/* PRODUCT: SIEM & NORMALIZATION FABRIC (MODULE 2) */}
                  {activeEnterpriseProduct === 'siem_fabric' && (
                    <SiemFabricSuite currentTenantId={currentTenantId} />
                  )}

                  {/* PRODUCT: AI ANOMALY & VOICE FRAUD (MODULE 3) */}
                  {activeEnterpriseProduct === 'ai_anomaly_voice' && (
                    <AiAnomalyVoiceSuite currentTenantId={currentTenantId} />
                  )}

                  {/* PRODUCT: SOC COMMAND & CONTROL (MODULE 4) */}
                  {activeEnterpriseProduct === 'soc_c2' && (
                    <SocC2Suite
                      currentTenantId={currentTenantId}
                      onNavigateToModule={(mod) =>
                        openSingleActiveModule({
                          portalMode: 'enterprise_suite',
                          enterpriseProduct: mod as EnterpriseProduct,
                          displayName: `Enterprise Suite · ${(mod as string).toUpperCase()}`
                        })
                      }
                    />
                  )}

                  {/* PRODUCT 2: SYSTEM 4 SBC CORE */}
                  {activeEnterpriseProduct === 'sbc_core' && (
                    <>
                      {system4Tab === 'sbc_noc' && (
                        <SbcNocDashboard
                          pops={pops}
                          aiAlerts={sbcAiAlerts}
                          onDrainPop={handleDrainPop}
                          onScalePop={handleScalePop}
                          onApplyAiAction={handleApplyAiAction}
                          onOpenLadderTraces={() => setSystem4Tab('ladder_traces')}
                          onOpenPbxConnect={() => setSystem4Tab('pbx_connect')}
                          onOpenAclSecurity={() => setSystem4Tab('security_ai')}
                        />
                      )}

                      {system4Tab === 'pbx_connect' && (
                        <PbxConnectWizard
                          credentials={pbxCredentials}
                          onTestRegister={handleTestRegisterPbx}
                          onCreateCredential={(cred) => {
                            const newCred = {
                              ...cred,
                              id: `pbx-${Date.now()}`,
                              registrationStatus: 'unregistered'
                            } as EnterprisePbxCredential;
                            setPbxCredentials((prev) => [...prev, newCred]);
                            showToast('PBX trunk credentials generated.');
                          }}
                        />
                      )}

                      {system4Tab === 'ladder_traces' && (
                        <SipLadderTraces traces={callTraces} />
                      )}

                      {system4Tab === 'header_rules' && (
                        <HeaderRulesEditor
                          rules={headerRules}
                          onToggleRule={handleToggleHeaderRule}
                          onAddRule={handleAddHeaderRule}
                          onDeleteRule={handleDeleteHeaderRule}
                        />
                      )}

                      {system4Tab === 'security_ai' && (
                        <SecurityAiEngine
                          acls={acls}
                          alerts={sbcAiAlerts}
                          onAddAcl={handleAddAcl}
                          onRemoveAcl={handleRemoveAcl}
                          onResolveAlert={handleResolveAlert}
                          onQuickBlockCidr={handleQuickBlockCidr}
                        />
                      )}
                    </>
                  )}

                  {/* PRODUCT 3: CARRIER INTERCONNECT & LCRq */}
                  {activeEnterpriseProduct === 'interconnect' && (
                    <>
                      {interconnectTab === 'rate_decks' && (
                        <RateDeckManager
                          rateDecks={rateDecks}
                          onUploadRateDeck={handleUploadRateDeck}
                        />
                      )}

                      {interconnectTab === 'lcr_engine' && (
                        <LcrRoutingEngine
                          routes={carrierRoutes}
                          alerts={interconnectAlerts}
                          onApplyReroute={handleApplyInterconnectReroute}
                        />
                      )}

                      {interconnectTab === 'cdr_stream' && (
                        <CdrMediationStream cdrs={mediatedCdrs} />
                      )}
                    </>
                  )}

                  {/* PRODUCT: SATELLITE CARRIER & NTN GATEWAY */}
                  {activeEnterpriseProduct === 'satellite_ntn' && (
                    <SatelliteNtnSuite
                      activeTab={satelliteTab}
                      onSelectTab={setSatelliteTab}
                    />
                  )}

                  {/* PRODUCT 4: SYSTEM 3 VOICE & IVR */}
                  {activeEnterpriseProduct === 'voice_ivr' && (
                    <>
                      {system3Tab === 'voice_noc' && (
                        <VoiceNocDashboard
                          liveCalls={liveCalls}
                          languages={languages}
                          onOpenFlowBuilder={() => setSystem3Tab('ivr_builder')}
                          onOpenCallSimulator={(c) => {
                            setSimulatorTargetCall(c);
                            setSystem3Tab('call_simulator');
                          }}
                          onOpenLanguages={() => setSystem3Tab('languages_matrix')}
                          onSupervisorAction={handleSupervisorAction}
                        />
                      )}

                      {system3Tab === 'ivr_builder' && (
                        <IvrFlowBuilder
                          flows={ivrFlows}
                          availableNumbers={numbers}
                          onSaveFlow={handleSaveIvrFlow}
                          onTestFlow={handleTestFlowInSimulator}
                        />
                      )}

                      {system3Tab === 'call_simulator' && (
                        <LiveCallSimulator
                          flows={ivrFlows}
                          initialCall={simulatorTargetCall}
                          initialFlowId={simulatorTargetFlowId}
                          onCallCompleted={handleCallCompletedInSimulator}
                        />
                      )}

                      {system3Tab === 'languages_matrix' && <AfricanLanguagesMatrix />}

                      {system3Tab === 'call_summaries' && <CallSummariesView />}
                    </>
                  )}

                  {/* PRODUCT 5: SYSTEM 2 MESSAGING GATEWAY */}
                  {activeEnterpriseProduct === 'messaging_sms' && (
                    <>
                      {system2Tab === 'noc_dashboard' && (
                        <NocDashboard
                          carrierMetrics={carrierMetrics}
                          binds={binds}
                          onOpenDispatcher={() => setSystem2Tab('dispatcher')}
                          onOpenPhoneSimulator={() => setSystem2Tab('phone_simulator')}
                          onOpenBinds={() => setSystem2Tab('smpp_binds')}
                          onApplyAiReroute={handleApplyAiReroute}
                        />
                      )}

                      {system2Tab === 'dispatcher' && (
                        <CampaignDispatcher
                          messages={messages}
                          onDispatchMessage={handleDispatchMessage}
                          onOpenPhoneSimulatorWithMsisdn={(msisdn) => {
                            setPhoneSimMsisdn(msisdn);
                            setSystem2Tab('phone_simulator');
                          }}
                        />
                      )}

                      {system2Tab === 'phone_simulator' && (
                        <FeaturePhoneUssdSimulator initialMsisdn={phoneSimMsisdn} />
                      )}

                      {system2Tab === 'smpp_binds' && (
                        <SmppBindMonitor
                          binds={binds}
                          pduTraces={pduTraces}
                          onTriggerRebind={handleTriggerRebind}
                          onBulkRebind={handleBulkRebind}
                          onSendProbeEnquireLink={handleSendProbeEnquireLink}
                        />
                      )}

                      {system2Tab === 'routing_engine' && <RoutingEngineView />}

                      {system2Tab === 'msg_api' && <MessagingApiExplorer />}
                    </>
                  )}

                  {/* PRODUCT 6: SYSTEM 1 REGULATORY NMS */}
                  {activeEnterpriseProduct === 'nms_numbers' && (
                    <>
                      {system1Tab === 'command_control' && (
                        <CommandControlMap
                          countries={countries}
                          connectors={connectors}
                          onSelectCountry={handleSelectCountryFromMap}
                          onOpenAiForecast={(c) => setAiForecastCountry(c)}
                          onTriggerAutoOrder={handleTriggerAutoOrder}
                          onGenerateReport={() => setSystem1Tab('compliance')}
                        />
                      )}

                      {system1Tab === 'pan_africa_inventory' && (
                        <PanAfricaNumberInventoryView
                          currentTenant={currentTenant}
                          onOpenSoftphone={(num) => setSoftphoneTargetNumber(num as any)}
                          onOpenVoiceIvr={() => {
                            openSingleActiveModule({
                              portalMode: 'enterprise_suite',
                              enterpriseProduct: 'voice_ivr',
                              subTab: 'ivr_builder',
                              displayName: 'Voice & IVR · IVR BUILDER'
                            });
                          }}
                          onOpenMessaging={() => {
                            openSingleActiveModule({
                              portalMode: 'enterprise_suite',
                              enterpriseProduct: 'messaging_sms',
                              subTab: 'dispatcher',
                              displayName: 'Messaging Gateway · DISPATCHER'
                            });
                          }}
                        />
                      )}

                      {system1Tab === 'inventory' && (
                        <InventoryBrowser
                          countries={countries}
                          numbers={numbers}
                          selectedCountryCode={selectedCountryCode}
                          onCountryChange={setSelectedCountryCode}
                          onInitiatePurchase={handleInitiatePurchase}
                          onOpenAiForecast={(c) => setAiForecastCountry(c)}
                        />
                      )}

                      {system1Tab === 'my_numbers' && (
                        <MyNumbersView
                          numbers={numbers}
                          onOpenSoftphone={(num) => setSoftphoneTargetNumber(num)}
                          onUpdateRouting={handleUpdateRouting}
                          onReleaseNumber={handleReleaseNumber}
                          onNavigateToInventory={() => setSystem1Tab('inventory')}
                        />
                      )}

                      {system1Tab === 'porting' && (
                        <PortingEngine
                          portingRequests={portingRequests}
                          countries={countries}
                          onSubmitNewPort={handleSubmitNewPort}
                          onAdvancePortStatus={handleAdvancePortStatus}
                        />
                      )}

                      {system1Tab === 'compliance' && (
                        <ComplianceRegistry
                          licenses={licenses}
                          auditLogs={auditLogs}
                          quarantinedNumbers={quarantinedNumbers}
                          countries={countries}
                          onUploadLicense={handleUploadLicense}
                          onAdvanceRecycleStep={handleAdvanceRecycleStep}
                        />
                      )}

                      {system1Tab === 'esim_attestation' && (
                        <EsimAttestationDashboard />
                      )}

                      {system1Tab === 'api' && <ApiConsole />}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-black/10 bg-white py-6 px-4 sm:px-6 lg:px-8 text-xs sm:text-[13px] text-black/60 font-sans">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-black font-semibold">Mandela Connect — The Atelier Edition</span>
              <span className="text-black/30">·</span>
              <span>Executive Operating System</span>
              <span className="text-black/30">·</span>
              <span>Multi-Tenant Architecture</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-black/70 flex-wrap">
              <span>FreeSWITCH + Kamailio</span>
              <span className="text-black/20">·</span>
              <span>MANDELA Dataverse</span>
              <span className="text-black/20">·</span>
              <span>Precision Telemetry</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )}

  {/* Global Modals */}
      {showTenantModal && (
        <TenantLoginModal
          tenants={tenantAccounts}
          currentTenantId={currentTenantId}
          onSelectTenant={setCurrentTenantId}
          onCreateTenant={handleCreateTenant}
          onClose={() => setShowTenantModal(false)}
        />
      )}

      {showOnboardingModal && (
        <OnboardingWizardModal
          isOpen={showOnboardingModal}
          onClose={() => setShowOnboardingModal(false)}
          onCompleteOnboarding={(newTenant) => {
            handleCreateTenant(newTenant);
            showToast(`Tenant ${newTenant.name} provisioned! Launched workspace.`);
          }}
        />
      )}

      {showCustomerOnboardingModal && (
        <CustomerOnboardingModal
          isOpen={showCustomerOnboardingModal}
          onClose={() => setShowCustomerOnboardingModal(false)}
          currentTenant={currentTenant}
          onComplete={(updatedTenant) => {
            setTenantAccounts((prev) =>
              prev.map((t) => (t.id === updatedTenant.id ? updatedTenant : t))
            );
            showToast(`KYC & Wallet Confirmed for ${updatedTenant.name}! Ready for Pan-Africa number provisioning.`);
          }}
        />
      )}

      {showStressTestModal && (
        <UxArchitectureWalkthrough
          isOpen={showStressTestModal}
          onClose={() => setShowStressTestModal(false)}
          activeTenant={currentTenant}
          allTenants={tenantAccounts}
          onSelectTenant={(t) => setCurrentTenantId(t.id)}
          portalMode={portalMode}
          onSelectPortalMode={(m) => openSingleActiveModule({ portalMode: m })}
          activePersona={activePersona}
          onSelectPersona={(p) => setActivePersona(p)}
          onLaunchOnboarding={() => {
            setShowStressTestModal(false);
            setShowOnboardingModal(true);
          }}
        />
      )}

      {showDesignSystemModal && (
        <DesignSystemShowcaseModal
          isOpen={showDesignSystemModal}
          onClose={() => setShowDesignSystemModal(false)}
        />
      )}

      {showCommandPalette && (
        <GlobalCommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          tenants={tenantAccounts}
          currentTenantId={currentTenantId}
          onSelectTenant={(t) => {
            setCurrentTenantId(t.id);
            showToast(`Switched active workspace to ${t.name}`);
          }}
          schemas={schemas}
          onSelectSchema={() => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: 'dataverse',
              subTab: 'schemas',
              displayName: 'Dataverse · SCHEMAS'
            });
          }}
          portingRequests={portingRequests}
          numbers={numbers}
          onSelectProvisioning={() => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: 'nms_numbers',
              subTab: 'porting',
              displayName: 'Sovereign NMS · PORTING'
            });
          }}
          dataverseAuditLogs={dataverseAuditLogs}
          nmsAuditLogs={auditLogs}
          onNavigatePortal={(mode) => openSingleActiveModule({ portalMode: mode })}
          onNavigateEnterpriseProduct={(prod) => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: prod,
              displayName: `Enterprise Suite · ${prod.toUpperCase()}`
            });
          }}
          onNavigateDataverseTab={(tab) => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: 'dataverse',
              subTab: tab,
              displayName: `Dataverse · ${tab.toUpperCase()}`
            });
          }}
          onNavigateSystem1Tab={(tab) => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: 'nms_numbers',
              subTab: tab,
              displayName: `Sovereign NMS · ${tab.toUpperCase()}`
            });
          }}
          onNavigateSystem4Tab={(tab) => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: 'sbc_core',
              subTab: tab,
              displayName: `SBC Core · ${tab.toUpperCase()}`
            });
          }}
          onOpenOnboarding={() => setShowOnboardingModal(true)}
          onOpenStressTest={() => setShowStressTestModal(true)}
          onOpenDesignSystem={() => setShowDesignSystemModal(true)}
          onOpenNmcpControlPlane={() => setShowNmcpModal(true)}
          onSetTextSize={(sz) => {
            document.documentElement.setAttribute('data-text-size', sz);
            localStorage.setItem('atelier-text-size', sz);
          }}
          densityMode={densityMode}
          onSetDensityMode={setDensityMode}
          isReadOnly={isReadOnly}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulateOffline={toggleSimulateOffline}
        />
      )}

      {/* NMCP Multi-Tenant AI Infrastructure Control Plane Modal */}
      {showNmcpModal && (
        <NmcpControlPlaneModal
          isOpen={showNmcpModal}
          onClose={() => setShowNmcpModal(false)}
          tenants={tenantAccounts}
          currentTenantId={currentTenantId}
          onSelectTenant={(tId) => {
            setCurrentTenantId(tId);
            showToast(`Switched active tenant to ${tId}`);
          }}
          onNavigateToPortal={(prod) => {
            openSingleActiveModule({
              portalMode: 'enterprise_suite',
              enterpriseProduct: prod,
              displayName: `Enterprise Suite · ${prod.toUpperCase()}`
            });
          }}
        />
      )}

      {provisioningNumber && (
        <NumberProvisionModal
          number={provisioningNumber}
          kycProfile={CURRENT_USER_KYC}
          onComplete={handleCompleteProvisioning}
          onCancel={() => setProvisioningNumber(null)}
          onOpenSoftphone={(num) => {
            setProvisioningNumber(null);
            setSoftphoneTargetNumber(num);
          }}
        />
      )}

      {softphoneTargetNumber && (
        <SoftphoneModal
          number={softphoneTargetNumber}
          onClose={() => setSoftphoneTargetNumber(null)}
        />
      )}

      {aiForecastCountry && (
        <AiForecastModal
          country={aiForecastCountry}
          onClose={() => setAiForecastCountry(null)}
          onApplyReorder={handleTriggerAutoOrder}
        />
      )}

      {/* Gemini Multi-Turn AI Telecom Copilot Modal (Accessible via Profile/Tools Menu) */}
      <GeminiChatbotModal
        isOpen={showGeminiChat}
        onClose={() => setShowGeminiChat(false)}
      />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-black border border-black text-white px-4 py-3 rounded-[2px] shadow-xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
          <span className="font-medium text-white font-sans">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white ml-2 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
