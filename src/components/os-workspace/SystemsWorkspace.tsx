import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react';
import {
  Button,
  SearchInput,
  Tabs,
  ModeSegmentedToggle,
  KeyValueTable,
  CalloutBanner
} from '../../design-system';
import { SYSTEMS_18_CATALOG } from './systemsCatalog';
import { ExperienceMode, OsSectionId, SystemCategory } from './types';
import { TenantAccount } from '../../types/multiTenant';
import { AfricanCountry, AuditLogEntry, PhoneNumberRecord, PortingRequest, SovereignLicense } from '../../types/nms';
import { InterconnectMarginAlert, CarrierRateDeck, CarrierRouteOption, MediatedCdr } from '../../types/interconnect';
import { DataverseAuditLog, DataverseEntitySchema, DataverseEventSubscription, DataverseField, DataverseRecord, DataverseRelationship, DataverseSecurityRole, DataverseTenant, AiDataServicePolicy } from '../../types/dataverse';
import { PopCode, SbcAiAlert, SbcGlobalAcl, SbcHeaderRule, SbcPointOfPresence, SipCallTrace, EnterprisePbxCredential } from '../../types/sbc';
import { AfricanLanguageModel, CallSummaryReport, LiveVoiceCall, VoiceIvrFlow } from '../../types/voice';
import { CarrierQualityMetric, MessageRecord, SmppBind, SmppPduTrace } from '../../types/messaging';

// Existing Live System Product Suites
import { PanAfricaNumberInventoryView } from '../numbers/PanAfricaNumberInventoryView';
import { InventoryBrowser } from '../InventoryBrowser';
import { MyNumbersView } from '../MyNumbersView';
import { PortingEngine } from '../PortingEngine';
import { ComplianceRegistry } from '../ComplianceRegistry';
import { EsimAttestationDashboard } from '../EsimAttestationDashboard';
import { ApiConsole } from '../ApiConsole';

import { NocDashboard } from '../messaging/NocDashboard';
import { CampaignDispatcher } from '../messaging/CampaignDispatcher';
import { FeaturePhoneUssdSimulator } from '../messaging/FeaturePhoneUssdSimulator';
import { SmppBindMonitor } from '../messaging/SmppBindMonitor';
import { RoutingEngineView } from '../messaging/RoutingEngineView';
import { MessagingApiExplorer } from '../messaging/MessagingApiExplorer';

import { VoiceNocDashboard } from '../voice/VoiceNocDashboard';
import { IvrFlowBuilder } from '../voice/IvrFlowBuilder';
import { LiveCallSimulator } from '../voice/LiveCallSimulator';
import { AfricanLanguagesMatrix } from '../voice/AfricanLanguagesMatrix';
import { CallSummariesView } from '../voice/CallSummariesView';

import { SbcNocDashboard } from '../sbc/SbcNocDashboard';
import { PbxConnectWizard } from '../sbc/PbxConnectWizard';
import { SipLadderTraces } from '../sbc/SipLadderTraces';
import { HeaderRulesEditor } from '../sbc/HeaderRulesEditor';
import { SecurityAiEngine } from '../sbc/SecurityAiEngine';

import { RateDeckManager } from '../interconnect/RateDeckManager';
import { LcrRoutingEngine } from '../interconnect/LcrRoutingEngine';
import { CdrMediationStream } from '../interconnect/CdrMediationStream';

import { DataverseOverview } from '../dataverse/DataverseOverview';
import { SchemaDesigner } from '../dataverse/SchemaDesigner';
import { RecordExplorer } from '../dataverse/RecordExplorer';
import { QueryStudio } from '../dataverse/QueryStudio';
import { EventPipeline } from '../dataverse/EventPipeline';
import { GovernanceRbac } from '../dataverse/GovernanceRbac';
import { AiDataService } from '../dataverse/AiDataService';

import { SatelliteNtnSuite } from '../satellite/SatelliteNtnSuite';
import { EdgeDefenseSuite } from '../edge/EdgeDefenseSuite';
import { SiemFabricSuite } from '../edge/SiemFabricSuite';
import { AiAnomalyVoiceSuite } from '../edge/AiAnomalyVoiceSuite';
import { SocC2Suite } from '../edge/SocC2Suite';

import { VisualWorkflowBuilder } from '../agnostic-os/VisualWorkflowBuilder';
import { AgentBuilderStudio } from '../agnostic-os/AgentBuilderStudio';
import { ProviderRegistryView } from '../agnostic-os/ProviderRegistryView';
import { SystemTaskManager } from '../agnostic-os/SystemTaskManager';
import { TelecomFileExplorer } from '../agnostic-os/TelecomFileExplorer';
import { MultiAiMcpGatewaySuite } from '../gateway/MultiAiMcpGatewaySuite';

export interface SystemsFilterState {
  search: string;
  includeMvp: boolean;
  includePlanned: boolean;
  selectedCategories: SystemCategory[];
}

export interface LiveProductBridgeProps {
  currentTenant: TenantAccount;
  countries: AfricanCountry[];
  numbers: PhoneNumberRecord[];
  selectedCountryCode: string;
  onCountryChange: (code: string) => void;
  onInitiatePurchase: (num: PhoneNumberRecord) => void;
  onOpenAiForecast: (country: AfricanCountry) => void;
  onOpenSoftphone: (num: PhoneNumberRecord) => void;
  onUpdateRouting: (numberId: string, sipUri: string, webhookUrl: string) => void;
  onReleaseNumber: (numberId: string) => void;
  portingRequests: PortingRequest[];
  onSubmitNewPort: (req: PortingRequest) => void;
  onAdvancePortStatus: (id: string) => void;
  licenses: SovereignLicense[];
  auditLogs: AuditLogEntry[];
  onUploadLicense: (lic: SovereignLicense) => void;
  onAdvanceRecycleStep: (id: string) => void;
  // Messaging
  binds: SmppBind[];
  carrierMetrics: CarrierQualityMetric[];
  messages: MessageRecord[];
  pduTraces: SmppPduTrace[];
  onDispatchMessage: (msg: MessageRecord) => void;
  onTriggerRebind: (id: string) => void;
  onBulkRebind?: (bindIds: string[]) => void;
  onSendProbeEnquireLink: (id: string) => void;
  onApplyAiReroute: (carrier: string, route: string) => void;
  // Voice
  ivrFlows: VoiceIvrFlow[];
  liveCalls: LiveVoiceCall[];
  languages: AfricanLanguageModel[];
  onSaveIvrFlow: (flow: VoiceIvrFlow) => void;
  onSupervisorAction: (callId: string, action: 'listening' | 'whispering' | 'barged' | 'none') => void;
  onCallCompleted: (summary: CallSummaryReport) => void;
  // SBC
  pops: SbcPointOfPresence[];
  pbxCredentials: EnterprisePbxCredential[];
  callTraces: SipCallTrace[];
  headerRules: SbcHeaderRule[];
  acls: SbcGlobalAcl[];
  sbcAiAlerts: SbcAiAlert[];
  onDrainPop: (code: PopCode) => void;
  onScalePop: (code: PopCode, count: number) => void;
  onApplyAiAction: (alert: SbcAiAlert) => void;
  onTestRegisterPbx: (pbxId: string) => Promise<PopCode>;
  onCreatePbxCredential: (cred: Partial<EnterprisePbxCredential>) => void;
  onToggleHeaderRule: (id: string) => void;
  onAddHeaderRule: (rule: Omit<SbcHeaderRule, 'id'>) => void;
  onDeleteHeaderRule: (id: string) => void;
  onAddAcl: (acl: Omit<SbcGlobalAcl, 'id' | 'createdAt' | 'syncStatus' | 'matchedPacketsLastHour'>) => void;
  onRemoveAcl: (id: string) => void;
  onResolveAlert: (id: string) => void;
  onQuickBlockCidr: (cidr: string, reason: string) => void;
  // Interconnect
  carrierRoutes: CarrierRouteOption[];
  rateDecks: CarrierRateDeck[];
  mediatedCdrs: MediatedCdr[];
  interconnectAlerts: InterconnectMarginAlert[];
  onUploadRateDeck: (deck: CarrierRateDeck) => void;
  onApplyInterconnectReroute: (alert: InterconnectMarginAlert) => void;
  // Dataverse
  dataverseTenants: DataverseTenant[];
  onSelectTenant: (id: string) => void;
  schemas: DataverseEntitySchema[];
  relationships: DataverseRelationship[];
  records: DataverseRecord[];
  subscriptions: DataverseEventSubscription[];
  roles: DataverseSecurityRole[];
  dataverseAuditLogs: DataverseAuditLog[];
  aiDataPolicy: AiDataServicePolicy;
  onAddSchema: (s: DataverseEntitySchema) => void;
  onAddFieldToSchema: (schemaId: string, f: DataverseField) => void;
  onUpdateRecord: (r: DataverseRecord) => void;
  onCreateRecord: (r: Omit<DataverseRecord, 'id' | 'version' | 'versionHistory' | 'createdAt' | 'updatedAt'>) => void;
  onAddEventSubscription: (s: Omit<DataverseEventSubscription, 'id' | 'dispatchedCount' | 'failureCount'>) => void;
  onToggleEventSubscription: (id: string) => void;
}

export const useSystemsSidebar = (
  selectedSystemNumber: string | null,
  onClearSelectedSystem: () => void,
  filters: SystemsFilterState,
  setFilters: React.Dispatch<React.SetStateAction<SystemsFilterState>>,
  experienceMode: ExperienceMode,
  onChangeExperienceMode: (m: ExperienceMode) => void,
  onSelectSection: (s: OsSectionId) => void,
  onOpenModuleDrawer: () => void
) => {
  if (selectedSystemNumber) {
    const sys = SYSTEMS_18_CATALOG.find((s) => s.number === selectedSystemNumber) || SYSTEMS_18_CATALOG[3];
    return (
      <div className="p-4 space-y-4">
        <button
          type="button"
          onClick={onClearSelectedSystem}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-black hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to 18 Systems</span>
        </button>

        <div className="border-t border-black pt-3">
          <div className="font-mono text-[11px] font-bold uppercase text-zinc-600">
            {sys.workflowId}
          </div>
          <h2 className="text-xl font-extrabold text-black tracking-tight mt-0.5 uppercase">
            {sys.name}
          </h2>
        </div>

        <KeyValueTable
          title={sys.inspectorTitle}
          rows={sys.statusMetrics.map((m) => ({ key: m.key, value: m.value }))}
        />

        <div className="space-y-2 border-t border-black pt-3">
          <Button variant="primary" size="sm" className="w-full" onClick={onOpenModuleDrawer}>
            OPEN LIVE MODULE WORKSPACE
          </Button>
          <Button variant="secondary" size="sm" className="w-full" onClick={() => onSelectSection('expert_console')}>
            VIEW PREREQUISITES
          </Button>
        </div>

        <div className="border-t border-black pt-3 space-y-2">
          <ModeSegmentedToggle mode={experienceMode} onChange={onChangeExperienceMode} />
        </div>

        <div className="space-y-1.5">
          <div className="font-mono text-[11px] font-bold uppercase text-black">GUIDED SUMMARY</div>
          <div className="border border-black p-3 text-xs text-zinc-800 leading-relaxed bg-white">
            {sys.shortDesc}
          </div>
        </div>
      </div>
    );
  }

  const categoryCounts: { cat: SystemCategory; label: string; count: number }[] = [
    { cat: 'CONNECT', label: 'Connect', count: 3 },
    { cat: 'TELECOM', label: 'Telecom', count: 3 },
    { cat: 'CLOUD', label: 'Cloud', count: 3 },
    { cat: 'ORBIT', label: 'Orbit', count: 2 },
    { cat: 'GRID', label: 'Grid', count: 2 },
    { cat: 'FIBER', label: 'Fiber', count: 2 },
    { cat: 'SECURE', label: 'Secure', count: 3 }
  ];

  const toggleCategory = (cat: SystemCategory) => {
    setFilters((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat]
    }));
  };

  return (
    <div className="p-4 space-y-5">
      <div>
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          SYSTEM LIBRARY
        </div>
        <h2 className="text-2xl font-extrabold text-black tracking-tight">Systems</h2>
        <p className="font-mono text-[10px] uppercase text-zinc-600 mt-0.5">
          BROWSE, FILTER, AND OPEN MANDELA OS SYSTEMS.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="font-mono text-[11px] font-bold uppercase text-black">SEARCH</div>
        <SearchInput
          placeholder="Search systems (e.g., SIP, solar, KYC)"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />
      </div>

      <div className="space-y-2 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase text-black">LAYER FILTERS</div>
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, includeMvp: !p.includeMvp }))}
            className="flex items-center gap-2 cursor-pointer w-full text-left"
          >
            {filters.includeMvp ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
            <span>Available in MVP (12)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, includePlanned: !p.includePlanned }))}
            className="flex items-center gap-2 cursor-pointer w-full text-left"
          >
            {filters.includePlanned ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
            <span>Planned integrations (6)</span>
          </button>
          <button
            type="button"
            onClick={() => setFilters((p) => ({ ...p, selectedCategories: [] }))}
            className="flex items-center gap-2 cursor-pointer w-full text-left"
          >
            {filters.selectedCategories.length === 0 ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
            <span>All layers (18)</span>
          </button>

          {categoryCounts.map((item) => {
            const checked = filters.selectedCategories.includes(item.cat);
            return (
              <button
                key={item.cat}
                type="button"
                onClick={() => toggleCategory(item.cat)}
                className="flex items-center gap-2 cursor-pointer w-full text-left"
              >
                {checked ? <CheckSquare className="w-4 h-4 shrink-0" /> : <Square className="w-4 h-4 shrink-0" />}
                <span>
                  {item.label} ({item.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 border-t border-black pt-3">
        <div className="font-mono text-[11px] font-bold uppercase text-black">SYSTEM STATUS</div>
        <div className="border border-black divide-y divide-black text-xs font-mono font-bold">
          <div className="px-3 py-2 flex items-center justify-between">
            <span>AVAILABLE IN MVP</span>
            <span className="tabular-nums">12</span>
          </div>
          <div className="px-3 py-2 flex items-center justify-between">
            <span>PLANNED INTEGRATIONS</span>
            <span className="tabular-nums">6</span>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() =>
            setFilters({
              search: '',
              includeMvp: true,
              includePlanned: true,
              selectedCategories: []
            })
          }
        >
          RESET FILTERS
        </Button>
      </div>
    </div>
  );
};

interface SystemsWorkspaceProps {
  selectedSystemNumber: string | null;
  onSelectSystemNumber: (num: string | null) => void;
  filters: SystemsFilterState;
  onSelectSection: (section: OsSectionId) => void;
  bridge: LiveProductBridgeProps;
  activeModuleOpen: boolean;
  onSetActiveModuleOpen: (v: boolean) => void;
}

export const SystemsWorkspace: React.FC<SystemsWorkspaceProps> = ({
  selectedSystemNumber,
  onSelectSystemNumber,
  filters,
  onSelectSection,
  bridge,
  activeModuleOpen,
  onSetActiveModuleOpen
}) => {
  const [libraryTab, setLibraryTab] = useState<'all' | 'mvp' | 'planned'>('all');
  const [detailTab, setDetailTab] = useState<'overview' | 'live_module' | 'signaling' | 'dependencies' | 'events'>('overview');
  const [subFeatureTab, setSubFeatureTab] = useState<string>('default');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // ================== VIEW 1: 18 SYSTEMS LIBRARY (WF-08) ==================
  if (!selectedSystemNumber) {
    const visibleSystems = SYSTEMS_18_CATALOG.filter((sys) => {
      if (libraryTab === 'mvp' && sys.availability !== 'mvp') return false;
      if (libraryTab === 'planned' && sys.availability !== 'planned') return false;
      if (!filters.includeMvp && sys.availability === 'mvp') return false;
      if (!filters.includePlanned && sys.availability === 'planned') return false;
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(sys.category)) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        return (
          sys.name.toLowerCase().includes(q) ||
          sys.shortDesc.toLowerCase().includes(q) ||
          sys.number.includes(q) ||
          sys.category.toLowerCase().includes(q)
        );
      }
      return true;
    });

    const groups: SystemCategory[] = ['CONNECT', 'TELECOM', 'CLOUD', 'ORBIT', 'GRID', 'FIBER', 'SECURE'];

    return (
      <div className="p-5 sm:p-8 max-w-6xl space-y-6">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-zinc-600">
            SYSTEM LIBRARY (18)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mt-0.5">
            18 Systems. One Operating System.
          </h1>
          <p className="font-mono text-xs uppercase tracking-wide text-zinc-700 mt-1">
            A UNIFIED, LAYERED PLATFORM FOR CONNECTIVITY, COMPUTE, ENERGY, AND TRUST.
          </p>
        </div>

        <Tabs
          tabs={[
            { id: 'all', label: 'ALL SYSTEMS (18)' },
            { id: 'mvp', label: 'AVAILABLE IN MVP (12)' },
            { id: 'planned', label: 'PLANNED INTEGRATIONS (6)' }
          ]}
          activeId={libraryTab}
          onChange={(id) => setLibraryTab(id as any)}
        />

        {/* 6 Primary Layer Boxes Grid (CONNECT, TELECOM, CLOUD, ORBIT, GRID, FIBER) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups
            .filter((g) => g !== 'SECURE')
            .map((cat) => {
              const items = visibleSystems.filter((s) => s.category === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="border border-black bg-white p-4 space-y-3">
                  <div className="font-extrabold text-lg uppercase tracking-tight text-black">
                    {cat}
                  </div>
                  <div className="border border-black divide-y divide-black">
                    {items.map((sys) => (
                      <button
                        key={sys.id}
                        type="button"
                        onClick={() => {
                          onSelectSystemNumber(sys.number);
                          setDetailTab('live_module');
                          setSubFeatureTab('default');
                          onSetActiveModuleOpen(true);
                        }}
                        className="w-full text-left px-3 py-2.5 bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-between gap-2 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono font-extrabold text-xs tabular-nums shrink-0">
                            {sys.number}
                          </span>
                          <span className="opacity-35">|</span>
                          <span className="text-xs sm:text-sm font-semibold truncate">{sys.name}</span>
                        </div>
                        <span className="font-mono text-[10px] uppercase opacity-70 shrink-0">
                          {sys.availability === 'mvp' ? 'MVP' : 'PLAN'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Full-Width SECURE Box */}
        {visibleSystems.some((s) => s.category === 'SECURE') && (
          <div className="border border-black bg-white p-4 space-y-3">
            <div className="font-extrabold text-lg uppercase tracking-tight text-black">SECURE</div>
            <div className="border border-black divide-y divide-black">
              {visibleSystems
                .filter((s) => s.category === 'SECURE')
                .map((sys) => (
                  <div
                    key={sys.id}
                    className="px-3 py-2.5 bg-white hover:bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSystemNumber(sys.number);
                        setDetailTab('live_module');
                        setSubFeatureTab('default');
                        onSetActiveModuleOpen(true);
                      }}
                      className="flex items-center gap-2.5 text-left cursor-pointer hover:underline"
                    >
                      <span className="font-mono font-extrabold text-xs tabular-nums">{sys.number}</span>
                      <span className="opacity-35">|</span>
                      <span className="text-sm font-semibold">{sys.name}</span>
                    </button>

                    <div className="flex items-center gap-3 shrink-0">
                      {sys.number === '18' ? (
                        <>
                          <span className="font-mono text-[11px] font-bold uppercase text-zinc-700">
                            FUNCTIONAL DEMO
                          </span>
                          <span className="text-black/30">|</span>
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => onSelectSection('golden_command')}
                          >
                            OPEN GOLDEN COMMAND
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => {
                            onSelectSystemNumber(sys.number);
                            setDetailTab('live_module');
                            onSetActiveModuleOpen(true);
                          }}
                        >
                          OPEN SYSTEM {sys.number}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-700">
          SYSTEMS 01–18: CLICK ANY SYSTEM TO INSPECT CONFIGURATION OR LAUNCH ITS LIVE INTERACTIVE MODULE.
        </div>
      </div>
    );
  }

  // ================== VIEW 2: SELECTED SYSTEM WORKSPACE (WF-38 .. WF-45 + LIVE SUITE) ==================
  const system = SYSTEMS_18_CATALOG.find((s) => s.number === selectedSystemNumber) || SYSTEMS_18_CATALOG[3];
  const currentTab = activeModuleOpen ? 'live_module' : detailTab;

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderLiveSystemModule = () => {
    switch (system.number) {
      case '01': {
        const mode = subFeatureTab === 'default' ? 'pan_africa' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'pan_africa', label: 'PAN-AFRICA ITU REGISTRY (54)' },
                { id: 'inventory', label: 'DID BROWSER' },
                { id: 'my_numbers', label: 'MY NUMBERS' },
                { id: 'porting', label: 'MNP PORTING' },
                { id: 'esim', label: 'ESIM ATTESTATION' },
                { id: 'api', label: 'NMS REST API' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'pan_africa' && (
              <PanAfricaNumberInventoryView
                currentTenant={bridge.currentTenant}
                onOpenSoftphone={(n) => bridge.onOpenSoftphone(n as any)}
                onOpenVoiceIvr={() => onSelectSystemNumber('03')}
                onOpenMessaging={() => onSelectSystemNumber('02')}
              />
            )}
            {mode === 'inventory' && (
              <InventoryBrowser
                countries={bridge.countries}
                numbers={bridge.numbers}
                selectedCountryCode={bridge.selectedCountryCode}
                onCountryChange={bridge.onCountryChange}
                onInitiatePurchase={bridge.onInitiatePurchase}
                onOpenAiForecast={bridge.onOpenAiForecast}
              />
            )}
            {mode === 'my_numbers' && (
              <MyNumbersView
                numbers={bridge.numbers}
                onOpenSoftphone={bridge.onOpenSoftphone}
                onUpdateRouting={bridge.onUpdateRouting}
                onReleaseNumber={bridge.onReleaseNumber}
                onNavigateToInventory={() => setSubFeatureTab('inventory')}
              />
            )}
            {mode === 'porting' && (
              <PortingEngine
                portingRequests={bridge.portingRequests}
                countries={bridge.countries}
                onSubmitNewPort={bridge.onSubmitNewPort}
                onAdvancePortStatus={bridge.onAdvancePortStatus}
              />
            )}
            {mode === 'esim' && <EsimAttestationDashboard />}
            {mode === 'api' && <ApiConsole />}
          </div>
        );
      }

      case '02': {
        const mode = subFeatureTab === 'default' ? 'noc' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'noc', label: 'SMPP & MAP NOC' },
                { id: 'dispatcher', label: 'CAMPAIGN DISPATCHER' },
                { id: 'ussd', label: 'FEATURE PHONE USSD' },
                { id: 'binds', label: 'SMPP BINDS & PDU' },
                { id: 'routing', label: 'AI ROUTE OPTIMIZER' },
                { id: 'api', label: 'MESSAGING API' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'noc' && (
              <NocDashboard
                carrierMetrics={bridge.carrierMetrics}
                binds={bridge.binds}
                onOpenDispatcher={() => setSubFeatureTab('dispatcher')}
                onOpenPhoneSimulator={() => setSubFeatureTab('ussd')}
                onOpenBinds={() => setSubFeatureTab('binds')}
                onApplyAiReroute={bridge.onApplyAiReroute}
              />
            )}
            {mode === 'dispatcher' && (
              <CampaignDispatcher
                messages={bridge.messages}
                onDispatchMessage={bridge.onDispatchMessage}
                onOpenPhoneSimulatorWithMsisdn={() => setSubFeatureTab('ussd')}
              />
            )}
            {mode === 'ussd' && <FeaturePhoneUssdSimulator initialMsisdn="+233244123890" />}
            {mode === 'binds' && (
              <SmppBindMonitor
                binds={bridge.binds}
                pduTraces={bridge.pduTraces}
                onTriggerRebind={bridge.onTriggerRebind}
                onBulkRebind={bridge.onBulkRebind}
                onSendProbeEnquireLink={bridge.onSendProbeEnquireLink}
              />
            )}
            {mode === 'routing' && <RoutingEngineView />}
            {mode === 'api' && <MessagingApiExplorer />}
          </div>
        );
      }

      case '03': {
        const mode = subFeatureTab === 'default' ? 'voice_noc' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'voice_noc', label: 'VOICE NOC' },
                { id: 'ivr_builder', label: 'IVR FLOW BUILDER' },
                { id: 'simulator', label: 'CALL SIMULATOR' },
                { id: 'languages', label: '50 AFRICAN LANGUAGES' },
                { id: 'summaries', label: 'AI CALL SUMMARIES' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'voice_noc' && (
              <VoiceNocDashboard
                liveCalls={bridge.liveCalls}
                languages={bridge.languages}
                onOpenFlowBuilder={() => setSubFeatureTab('ivr_builder')}
                onOpenCallSimulator={() => setSubFeatureTab('simulator')}
                onOpenLanguages={() => setSubFeatureTab('languages')}
                onSupervisorAction={bridge.onSupervisorAction}
              />
            )}
            {mode === 'ivr_builder' && (
              <IvrFlowBuilder
                flows={bridge.ivrFlows}
                availableNumbers={bridge.numbers}
                onSaveFlow={bridge.onSaveIvrFlow}
                onTestFlow={() => setSubFeatureTab('simulator')}
              />
            )}
            {mode === 'simulator' && (
              <LiveCallSimulator flows={bridge.ivrFlows} onCallCompleted={bridge.onCallCompleted} />
            )}
            {mode === 'languages' && <AfricanLanguagesMatrix />}
            {mode === 'summaries' && <CallSummariesView />}
          </div>
        );
      }

      case '04': {
        const mode = subFeatureTab === 'default' ? 'sbc_noc' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'sbc_noc', label: 'SBC ANYCAST NOC' },
                { id: 'pbx_connect', label: 'PBX TRUNK WIZARD' },
                { id: 'ladder', label: 'SIP LADDER TRACES' },
                { id: 'headers', label: 'HEADER RULES' },
                { id: 'security', label: 'FRAUD & AI SHIELD' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'sbc_noc' && (
              <SbcNocDashboard
                pops={bridge.pops}
                aiAlerts={bridge.sbcAiAlerts}
                onDrainPop={bridge.onDrainPop}
                onScalePop={bridge.onScalePop}
                onApplyAiAction={bridge.onApplyAiAction}
                onOpenLadderTraces={() => setSubFeatureTab('ladder')}
                onOpenPbxConnect={() => setSubFeatureTab('pbx_connect')}
                onOpenAclSecurity={() => setSubFeatureTab('security')}
              />
            )}
            {mode === 'pbx_connect' && (
              <PbxConnectWizard
                credentials={bridge.pbxCredentials}
                onTestRegister={bridge.onTestRegisterPbx}
                onCreateCredential={bridge.onCreatePbxCredential}
              />
            )}
            {mode === 'ladder' && <SipLadderTraces traces={bridge.callTraces} />}
            {mode === 'headers' && (
              <HeaderRulesEditor
                rules={bridge.headerRules}
                onToggleRule={bridge.onToggleHeaderRule}
                onAddRule={bridge.onAddHeaderRule}
                onDeleteRule={bridge.onDeleteHeaderRule}
              />
            )}
            {mode === 'security' && (
              <SecurityAiEngine
                acls={bridge.acls}
                alerts={bridge.sbcAiAlerts}
                onAddAcl={bridge.onAddAcl}
                onRemoveAcl={bridge.onRemoveAcl}
                onResolveAlert={bridge.onResolveAlert}
                onQuickBlockCidr={bridge.onQuickBlockCidr}
              />
            )}
          </div>
        );
      }

      case '05': {
        const mode = subFeatureTab === 'default' ? 'lcr' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'lcr', label: 'LCR QUALITY ENGINE' },
                { id: 'decks', label: 'RATE DECKS (100+)' },
                { id: 'cdrs', label: 'CDR MEDIATION STREAM' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'lcr' && (
              <LcrRoutingEngine
                routes={bridge.carrierRoutes}
                alerts={bridge.interconnectAlerts}
                onApplyReroute={bridge.onApplyInterconnectReroute}
              />
            )}
            {mode === 'decks' && (
              <RateDeckManager rateDecks={bridge.rateDecks} onUploadRateDeck={bridge.onUploadRateDeck} />
            )}
            {mode === 'cdrs' && <CdrMediationStream cdrs={bridge.mediatedCdrs} />}
          </div>
        );
      }

      case '06': {
        const mode = subFeatureTab === 'default' ? 'workflow' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'workflow', label: 'VISUAL CALLFLOW (NCCO)' },
                { id: 'agents', label: 'AI AGENT STUDIO' },
                { id: 'providers', label: 'PROVIDER REGISTRY' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            <div className="bg-zinc-950 p-4 rounded-[2px] border border-black text-zinc-100">
              {mode === 'workflow' && <VisualWorkflowBuilder />}
              {mode === 'agents' && <AgentBuilderStudio />}
              {mode === 'providers' && <ProviderRegistryView />}
            </div>
          </div>
        );
      }

      case '07':
        return (
          <div className="bg-zinc-950 p-4 rounded-[2px] border border-black text-zinc-100">
            <SystemTaskManager />
          </div>
        );

      case '08': {
        const mode = subFeatureTab === 'default' ? 'overview' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'overview', label: 'DATAVERSE OVERVIEW' },
                { id: 'schemas', label: 'ENTITY SCHEMAS' },
                { id: 'records', label: 'RECORD EXPLORER' },
                { id: 'query', label: 'SQL QUERY STUDIO' },
                { id: 'events', label: 'CDC PIPELINE' },
                { id: 'governance', label: 'GOVERNANCE & RBAC' },
                { id: 'ai_data', label: 'AI DATA SERVICE' },
                { id: 'files', label: 'STORAGE EXPLORER' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'overview' && (
              <DataverseOverview
                tenants={bridge.dataverseTenants}
                currentTenantId={bridge.currentTenant.id}
                onSelectTenant={bridge.onSelectTenant}
                schemas={bridge.schemas}
                records={bridge.records}
                events={bridge.subscriptions}
                onNavigateTab={(t) => setSubFeatureTab(t)}
              />
            )}
            {mode === 'schemas' && (
              <SchemaDesigner
                schemas={bridge.schemas}
                relationships={bridge.relationships}
                onAddSchema={bridge.onAddSchema}
                onAddFieldToSchema={bridge.onAddFieldToSchema}
              />
            )}
            {mode === 'records' && (
              <RecordExplorer
                schemas={bridge.schemas}
                records={bridge.records}
                currentTenantId={bridge.currentTenant.id}
                onUpdateRecord={bridge.onUpdateRecord}
                onCreateRecord={bridge.onCreateRecord}
              />
            )}
            {mode === 'query' && (
              <QueryStudio
                schemas={bridge.schemas}
                records={bridge.records}
                currentTenantId={bridge.currentTenant.id}
              />
            )}
            {mode === 'events' && (
              <EventPipeline
                subscriptions={bridge.subscriptions}
                onAddSubscription={bridge.onAddEventSubscription}
                onToggleSubscription={bridge.onToggleEventSubscription}
              />
            )}
            {mode === 'governance' && (
              <GovernanceRbac roles={bridge.roles} auditLogs={bridge.dataverseAuditLogs} />
            )}
            {mode === 'ai_data' && (
              <AiDataService policy={bridge.aiDataPolicy} schemas={bridge.schemas} records={bridge.records} />
            )}
            {mode === 'files' && (
              <div className="bg-zinc-950 p-4 rounded-[2px] border border-black text-zinc-100">
                <TelecomFileExplorer />
              </div>
            )}
          </div>
        );
      }

      case '09':
        return <EdgeDefenseSuite currentTenantId={bridge.currentTenant.id} />;

      case '10':
        return <SatelliteNtnSuite />;

      case '16':
        return (
          <ComplianceRegistry
            licenses={bridge.licenses}
            auditLogs={bridge.auditLogs}
            quarantinedNumbers={bridge.numbers.filter((n) => n.status === 'recycling')}
            countries={bridge.countries}
            onUploadLicense={bridge.onUploadLicense}
            onAdvanceRecycleStep={bridge.onAdvanceRecycleStep}
          />
        );

      case '17': {
        const mode = subFeatureTab === 'default' ? 'soc' : subFeatureTab;
        return (
          <div className="space-y-4">
            <Tabs
              variant="boxed"
              tabs={[
                { id: 'soc', label: 'SOC COMMAND (C2)' },
                { id: 'siem', label: 'SIEM FABRIC (OCSF)' },
                { id: 'ai_voice', label: 'AI ANOMALY & VOICE FRAUD' }
              ]}
              activeId={mode}
              onChange={setSubFeatureTab}
            />
            {mode === 'soc' && <SocC2Suite currentTenantId={bridge.currentTenant.id} />}
            {mode === 'siem' && <SiemFabricSuite currentTenantId={bridge.currentTenant.id} />}
            {mode === 'ai_voice' && <AiAnomalyVoiceSuite currentTenantId={bridge.currentTenant.id} />}
          </div>
        );
      }

      case '18':
        return (
          <div className="bg-zinc-950 p-4 rounded-[2px] border border-black text-zinc-100">
            <MultiAiMcpGatewaySuite />
          </div>
        );

      default:
        return (
          <div className="border border-black p-6 space-y-4">
            <div className="font-mono text-xs font-bold uppercase">
              SYSTEM {system.number} — PLANNING &amp; TOPOLOGY PREVIEW
            </div>
            <p className="text-sm text-zinc-700">{system.shortDesc}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm" onClick={() => onSelectSection('golden_command')}>
                CONFIGURE IN GOLDEN COMMAND
              </Button>
              <Button variant="secondary" size="sm" onClick={() => onSelectSection('deployments')}>
                VIEW EXECUTION STAGE
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-5 sm:p-8 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black pb-3">
        <div>
          <div className="font-mono text-xs font-bold uppercase text-zinc-600">{system.workflowId}</div>
          <h1 className="text-3xl font-extrabold text-black tracking-tight uppercase">{system.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => onSelectSystemNumber(null)}>
            ← All 18 Systems
          </Button>
        </div>
      </div>

      <Tabs
        variant="boxed"
        tabs={[
          { id: 'live_module', label: 'LIVE WORKSPACE' },
          { id: 'overview', label: 'CHECKLIST & COMPONENTS' },
          { id: 'dependencies', label: 'DEPENDENCIES' },
          { id: 'events', label: 'EVENTS' }
        ]}
        activeId={currentTab}
        onChange={(id) => {
          setDetailTab(id as any);
          onSetActiveModuleOpen(id === 'live_module');
        }}
      />

      {currentTab === 'live_module' && renderLiveSystemModule()}

      {currentTab === 'overview' && (
        <div className="space-y-6">
          {/* Checklist Table (WF-38 style) */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold uppercase text-black">
              READINESS CHECKLIST
            </div>
            <div className="border border-black divide-y divide-black/20">
              {[
                { key: 'creds', label: 'CREDENTIALS & CONFIGURATION', state: 'Ready' },
                { key: 'reach', label: 'NETWORK REACHABILITY', state: 'Simulated Nominal' },
                { key: 'tls', label: 'TLS / IDENTITY CERTIFICATE', state: 'Verified' },
                { key: 'assign', label: 'RESOURCE ALLOCATION', state: 'Assigned to Demo' },
                { key: 'test', label: 'END-TO-END VERIFICATION', state: 'Pass (Simulated)' }
              ].map((row) => {
                const isChecked = Boolean(checkedItems[row.key]);
                return (
                  <button
                    key={row.key}
                    type="button"
                    onClick={() => toggleCheck(row.key)}
                    className="w-full text-left grid grid-cols-12 px-4 py-2.5 hover:bg-zinc-50 cursor-pointer items-center text-xs"
                  >
                    <div className="col-span-7 flex items-center gap-3 font-mono font-bold uppercase text-black">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      <span>{row.label}</span>
                    </div>
                    <div className="col-span-5 text-zinc-700 font-sans">
                      {isChecked ? 'Verified by operator' : row.state}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Components Matrix */}
          <div className="space-y-2">
            <div className="font-mono text-xs font-bold uppercase text-black">COMPONENTS</div>
            <div className="border border-black divide-y divide-black/20">
              {system.components.map((c) => (
                <div key={c.name} className="grid grid-cols-12 px-4 py-2.5 text-xs">
                  <div className="col-span-4 font-mono font-bold uppercase text-black">{c.name}</div>
                  <div className="col-span-8 text-zinc-700">{c.role}</div>
                </div>
              ))}
            </div>
          </div>

          <CalloutBanner symbol="i" text={system.shortDesc} />
        </div>
      )}

      {currentTab === 'dependencies' && (
        <div className="space-y-4">
          <div className="font-mono text-xs font-bold uppercase text-black">DEPENDENCY LINKS</div>
          <div className="border border-black divide-y divide-black">
            {system.dependencies.map((dep) => (
              <div key={dep} className="px-4 py-3 text-xs font-mono font-bold uppercase text-black">
                {dep}
              </div>
            ))}
          </div>
          <Button variant="primary" size="sm" onClick={() => onSelectSection('expert_console')}>
            OPEN FULL DEPENDENCY GRAPH
          </Button>
        </div>
      )}

      {currentTab === 'events' && (
        <div className="border border-black divide-y divide-black/15 text-xs tabular-nums">
          <div className="grid grid-cols-12 px-4 py-2.5 bg-zinc-50 font-mono font-bold uppercase">
            <div className="col-span-3">TIMESTAMP</div>
            <div className="col-span-3">COMPONENT</div>
            <div className="col-span-6">EVENT</div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2.5">
            <div className="col-span-3 font-mono">2025-03-01 10:14:21</div>
            <div className="col-span-3 font-mono font-bold">SYSTEM {system.number}</div>
            <div className="col-span-6">System health verified in demo planning environment.</div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2.5">
            <div className="col-span-3 font-mono">2025-03-01 10:12:04</div>
            <div className="col-span-3 font-mono font-bold">ORCHESTRATOR</div>
            <div className="col-span-6">Linked {system.name} to DRC Clinic scenario.</div>
          </div>
        </div>
      )}
    </div>
  );
};
