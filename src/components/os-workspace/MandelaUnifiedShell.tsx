import React, { useState } from 'react';
import {
  ExperienceMode,
  OsInterfaceMode,
  OsNotificationItem,
  OsSectionId,
  DeploymentScenarioConfig
} from './types';
import { INITIAL_OS_NOTIFICATIONS, SYSTEMS_18_CATALOG } from './systemsCatalog';
import { OsChrome } from './OsChrome';
import {
  DesktopSubView,
  DesktopWorkspace,
  useDesktopSidebar
} from './DesktopWorkspace';
import {
  MissionControlWorkspace,
  useMissionControlSidebar
} from './MissionControlWorkspace';
import {
  LiveProductBridgeProps,
  SystemsFilterState,
  SystemsWorkspace,
  useSystemsSidebar
} from './SystemsWorkspace';
import {
  InfrastructureWorkspace,
  useInfrastructureSidebar
} from './InfrastructureWorkspace';
import {
  GoldenCommandSubView,
  GoldenCommandWorkspace,
  useGoldenCommandSidebar
} from './GoldenCommandWorkspace';
import {
  DeploymentsSubView,
  DeploymentsWorkspace,
  useDeploymentsSidebar
} from './DeploymentsWorkspace';
import {
  ExpertConsoleTab,
  ExpertConsoleWorkspace,
  useExpertConsoleSidebar
} from './ExpertConsoleWorkspace';
import {
  CustomerOrderDraft,
  CustomerPortalScreenId,
  CustomerPortalWorkspace,
  INITIAL_CUSTOMER_ORDER,
  useCustomerPortalSidebar
} from './CustomerPortalWorkspace';
import {
  INITIAL_OPS_ORDERS,
  OperatorOperationsWorkspace,
  OperatorOpsTabId,
  ProvisioningOrderItem,
  useOperatorOperationsSidebar
} from './OperatorOperationsWorkspace';
import { NotificationDrawer } from './NotificationDrawer';
import { OnboardingFlowModal } from './OnboardingFlowModal';
import { CustomerProduct, SubscriptionTier, TenantAccount } from '../../types/multiTenant';
import { AfricanCountry, PhoneNumberRecord } from '../../types/nms';

interface MandelaUnifiedShellProps {
  bridge: LiveProductBridgeProps;
  connectors: any[];
  // Customer Portal callbacks
  activeCustomerTab: CustomerProduct;
  onSelectCustomerTab: (tab: CustomerProduct) => void;
  assignedNumbers: PhoneNumberRecord[];
  onUpgradeSubscription: (tier: SubscriptionTier) => void;
  onDispatchTestSms?: (recipient: string, text: string) => void;
  onOrderNumber?: (newNumber: PhoneNumberRecord) => void;
  onTopUpBalance?: (amountUsd: number) => void;
  // Global modals / commands from App
  onOpenTenantModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenDesignSystem: () => void;
  onOpenStressTest: () => void;
  onOpenNmcpControlPlane: () => void;
  onOpenGeminiChat: () => void;
  onOpenPublicLanding: () => void;
  onOpenLegacyDesktop?: () => void;
  onOpenCustomerOnboarding?: () => void;
  isReadOnly?: boolean;
  onToggleSimulateOffline?: () => void;
  onShowToast: (msg: string) => void;
  // Sync deep navigation if triggered externally
  initialInterfaceMode?: OsInterfaceMode;
}

export const MandelaUnifiedShell: React.FC<MandelaUnifiedShellProps> = ({
  bridge,
  connectors,
  activeCustomerTab,
  onSelectCustomerTab,
  assignedNumbers,
  onUpgradeSubscription,
  onDispatchTestSms,
  onOrderNumber,
  onTopUpBalance,
  onOpenTenantModal,
  onOpenCommandPalette,
  onOpenDesignSystem,
  onOpenStressTest,
  onOpenNmcpControlPlane,
  onOpenGeminiChat,
  onOpenPublicLanding,
  onOpenLegacyDesktop,
  onOpenCustomerOnboarding,
  isReadOnly,
  onToggleSimulateOffline,
  onShowToast,
  initialInterfaceMode = 'os_workspace'
}) => {
  // Top-level Navigation State
  const [interfaceMode, setInterfaceMode] = useState<OsInterfaceMode>(initialInterfaceMode);
  const [activeSection, setActiveSection] = useState<OsSectionId>('desktop');
  const [experienceMode, setExperienceMode] = useState<ExperienceMode>('guided');

  // Shared Deployment Scenario State (Golden Command + Deployments + Expert Console)
  const [scenario, setScenario] = useState<DeploymentScenarioConfig>({
    project: 'DRC Clinic',
    site: 'Rural Clinic — Lukunga, DRC',
    country: 'DRC',
    deploymentId: 'DEMO-001',
    version: 'v1',
    objective: 'Resilient primary-care clinic connectivity & sovereign SIP voice.',
    connectivity: '20 Mbps Satellite-first (LEO Conditional)',
    power: '2 kW Solar PV + 24h Battery Storage',
    compute: '1x Local Ruggedized Edge Micro-Node',
    communications: '1x Local SIP / Sovereign Business Line',
    priority: 'Standard',
    selectedPlan: 'A',
    planGenerated: true,
    planApproved: false,
    simulationStatus: 'paused',
    activeStageIndex: 2
  });

  // Section Sub-States
  const [desktopSubView, setDesktopSubView] = useState<DesktopSubView>('desktop');

  // Mission Control filters
  const [mcCountry, setMcCountry] = useState('ALL');
  const [mcLayer, setMcLayer] = useState('ALL');
  const [mcStatus, setMcStatus] = useState('ALL');

  // Systems (18 Systems)
  const [selectedSystemNumber, setSelectedSystemNumber] = useState<string | null>(null);
  const [systemModuleOpen, setSystemModuleOpen] = useState<boolean>(true);
  const [systemFilters, setSystemFilters] = useState<SystemsFilterState>({
    search: '',
    includeMvp: true,
    includePlanned: true,
    selectedCategories: []
  });

  // Infrastructure Map
  const [infraSubView, setInfraSubView] = useState<'map' | 'site_inspector' | 'readiness'>('map');
  const [infraCountry, setInfraCountry] = useState('ALL');
  const [infraRegion, setInfraRegion] = useState('ALL');
  const [infraLayer, setInfraLayer] = useState('ALL');

  // Golden Command
  const [goldenSubView, setGoldenSubView] = useState<GoldenCommandSubView>('scenario');

  // Deployments
  const [deploySubView, setDeploySubView] = useState<DeploymentsSubView>('timeline');
  const [selectedStageNum, setSelectedStageNum] = useState<number>(3);

  // Expert Console
  const [expertTab, setExpertTab] = useState<ExpertConsoleTab>('logs');
  const [expertSystem, setExpertSystem] = useState('11');
  const [expertStage, setExpertStage] = useState('3');
  const [expertCategory, setExpertCategory] = useState('ALL');

  // Notifications & Modals
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<OsNotificationItem[]>(INITIAL_OS_NOTIFICATIONS);
  const [onboardingModalView, setOnboardingModalView] = useState<
    null | 'signin' | 'org_setup' | 'choose_experience' | 'orientation'
  >(null);

  // Client Self-Service Portal State
  const [customerScreen, setCustomerScreen] = useState<CustomerPortalScreenId>('find_number');
  const [customerOrder, setCustomerOrder] = useState<CustomerOrderDraft>(INITIAL_CUSTOMER_ORDER);

  // Operator Operations (MVP-001) State
  const [opsTab, setOpsTab] = useState<OperatorOpsTabId>('provisioning');
  const [opsOrders, setOpsOrders] = useState<ProvisioningOrderItem[]>(INITIAL_OPS_ORDERS);
  const [selectedOpsOrderId, setSelectedOpsOrderId] = useState<string>(INITIAL_OPS_ORDERS[0].id);

  // Helper Handlers
  const updateScenario = (patch: Partial<DeploymentScenarioConfig>) => {
    setScenario((prev) => ({ ...prev, ...patch }));
  };

  const handleCreateNewProject = () => {
    setActiveSection('golden_command');
    setGoldenSubView('scenario');
    onShowToast('Opened Golden Command scenario builder for new deployment project.');
  };

  const handleApprovePlan = () => {
    updateScenario({ planApproved: true, version: 'v2' });
    onShowToast('DRC Clinic deployment plan approved (v2 — Demo).');
  };

  const handleOpenSystem = (sysNum: string) => {
    setInterfaceMode('os_workspace');
    setActiveSection('systems');
    setSelectedSystemNumber(sysNum);
    setSystemModuleOpen(true);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  // Operator Queue Handlers
  const handleChangeOpsOwner = (orderId: string, owner: string) => {
    setOpsOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, owner } : o)));
    onShowToast(`Assigned ${orderId} to ${owner}`);
  };

  const handleReconcileOrder = (orderId: string) => {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOpsOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              reconciled: true,
              stage: 'route_ok',
              auditEvents: [
                ...o.auditEvents,
                { timestamp: ts, event: 'Provider status reconciled via S04 SBC health probe' }
              ]
            }
          : o
      )
    );
    onShowToast(`${orderId}: Upstream provider status reconciled.`);
  };

  const handleRetryRouteOrder = (orderId: string) => {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOpsOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              stage: 'test',
              auditEvents: [
                ...o.auditEvents,
                { timestamp: ts, event: 'SIP & LCR route provisioned successfully (Kamailio TLS)' }
              ]
            }
          : o
      )
    );
    onShowToast(`${orderId}: Route provisioned. Ready for test call verification.`);
  };

  const handleAdvanceOrderToActive = (orderId: string) => {
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 16);
    setOpsOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              stage: 'active',
              auditEvents: [
                ...o.auditEvents,
                { timestamp: ts, event: 'Inbound test call verified & business line activated' }
              ]
            }
          : o
      )
    );
    if (orderId === customerOrder.orderId) {
      setCustomerOrder((prev) => ({
        ...prev,
        verificationStatus: 'Approved',
        testPassed: true,
        activated: true
      }));
    }
    onShowToast(`${orderId}: Line test passed and service activated.`);
  };

  // Derive Workflow Footer Code & Title matching attached screens
  const getWorkflowMeta = (): { code: string; title: string } => {
    if (interfaceMode === 'customer_portal') {
      const titles: Record<CustomerPortalScreenId, { code: string; title: string }> = {
        overview: { code: 'MVP-C01', title: 'Business Line Setup Overview' },
        find_number: { code: 'CONCEPT 001', title: 'Find a Business Number' },
        configure_destination: { code: 'MVP-C01', title: 'Call Destination Setup' },
        review_order: { code: 'CONCEPT 002', title: 'Review Business Line Order' },
        track_order: { code: 'ORD-001', title: 'Track Business Line Setup' },
        test_activate: { code: 'CONCEPT 005', title: 'Test and Activate Business Line' },
        manage_line: { code: 'CONCEPT 006', title: 'Manage Business Line' },
        usage_billing: { code: 'CONCEPT 007', title: 'Usage & Billing Overview' },
        full_portal: { code: 'CLIENT SUITE', title: 'Full Enterprise Tenant Console' }
      };
      return titles[customerScreen];
    }

    if (interfaceMode === 'operator_ops') {
      return { code: 'MVP-001', title: 'Operator Provisioning & Operations' };
    }

    if (activeSection === 'desktop') return { code: 'WF-06', title: 'Desktop Workspace' };
    if (activeSection === 'mission_control') return { code: 'WF-07', title: 'Infrastructure Operations' };
    if (activeSection === 'systems') {
      if (selectedSystemNumber) {
        const sys = SYSTEMS_18_CATALOG.find((s) => s.number === selectedSystemNumber);
        return { code: sys?.workflowId || 'WF-38', title: sys?.name || 'System Inspector' };
      }
      return { code: 'WF-08', title: '18 Systems Library' };
    }
    if (activeSection === 'infrastructure') return { code: 'WF-12', title: 'Continental Infrastructure Explorer' };
    if (activeSection === 'golden_command') return { code: 'WF-17', title: 'Golden Command Deployment Scenario' };
    if (activeSection === 'deployments') {
      if (deploySubView === 'complete') return { code: 'WF-29', title: 'Simulation Complete' };
      if (deploySubView === 'blocked_recovery') return { code: 'WF-26', title: 'Blocked Dependency Recovery' };
      if (deploySubView === 'stage_inspector') return { code: 'WF-25', title: 'Stage Inspector' };
      return { code: 'WF-24', title: 'Deployment Execution Timeline' };
    }
    return { code: 'WF-30', title: 'Infrastructure Engineering Workspace' };
  };

  const { code: workflowCode, title: workflowTitle } = getWorkflowMeta();

  // Compute Left Sidebar for current mode & section
  let leftSidebar: React.ReactNode = null;
  if (interfaceMode === 'customer_portal') {
    leftSidebar = useCustomerPortalSidebar(
      customerScreen,
      setCustomerScreen,
      customerOrder,
      bridge.currentTenant
    );
  } else if (interfaceMode === 'operator_ops') {
    leftSidebar = useOperatorOperationsSidebar(
      opsOrders,
      selectedOpsOrderId,
      setSelectedOpsOrderId,
      handleChangeOpsOwner
    );
  } else {
    switch (activeSection) {
      case 'desktop':
        leftSidebar = useDesktopSidebar(
          desktopSubView,
          setDesktopSubView,
          bridge.currentTenant,
          scenario,
          experienceMode,
          setExperienceMode,
          setActiveSection,
          handleCreateNewProject
        );
        break;
      case 'mission_control':
        leftSidebar = useMissionControlSidebar(
          bridge.currentTenant,
          scenario,
          mcCountry,
          setMcCountry,
          mcLayer,
          setMcLayer,
          mcStatus,
          setMcStatus,
          () => {
            setMcCountry('ALL');
            setMcLayer('ALL');
            setMcStatus('ALL');
          }
        );
        break;
      case 'systems':
        leftSidebar = useSystemsSidebar(
          selectedSystemNumber,
          () => setSelectedSystemNumber(null),
          systemFilters,
          setSystemFilters,
          experienceMode,
          setExperienceMode,
          setActiveSection,
          () => setSystemModuleOpen(true)
        );
        break;
      case 'infrastructure':
        leftSidebar = useInfrastructureSidebar(
          infraSubView,
          setInfraSubView,
          infraCountry,
          setInfraCountry,
          infraRegion,
          setInfraRegion,
          infraLayer,
          setInfraLayer
        );
        break;
      case 'golden_command':
        leftSidebar = useGoldenCommandSidebar(
          goldenSubView,
          setGoldenSubView,
          scenario,
          updateScenario
        );
        break;
      case 'deployments':
        leftSidebar = useDeploymentsSidebar(
          deploySubView,
          setDeploySubView,
          bridge.currentTenant,
          scenario,
          selectedStageNum,
          setActiveSection
        );
        break;
      case 'expert_console':
        leftSidebar = useExpertConsoleSidebar(
          bridge.currentTenant,
          scenario,
          expertSystem,
          setExpertSystem,
          expertStage,
          setExpertStage,
          expertCategory,
          setExpertCategory,
          setActiveSection
        );
        break;
    }
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <>
      <OsChrome
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setInterfaceMode('os_workspace');
          setActiveSection(sec);
        }}
        experienceMode={experienceMode}
        onChangeExperienceMode={setExperienceMode}
        interfaceMode={interfaceMode}
        onChangeInterfaceMode={(m) => {
          setInterfaceMode(m);
          if (m === 'os_workspace' && activeSection === 'expert_console' && experienceMode === 'guided') {
            setExperienceMode('expert');
          }
        }}
        currentTenant={bridge.currentTenant}
        onOpenTenantModal={onOpenTenantModal}
        onOpenCommandPalette={onOpenCommandPalette}
        onToggleNotifications={() => setNotificationsOpen((p) => !p)}
        unreadNotifications={unreadCount}
        workflowCode={workflowCode}
        workflowTitle={workflowTitle}
        projectLabel={scenario.project}
        onOpenOnboarding={() => setOnboardingModalView('signin')}
        onOpenOrientationTour={() => setOnboardingModalView('orientation')}
        onOpenDesignSystem={onOpenDesignSystem}
        onOpenStressTest={onOpenStressTest}
        onOpenNmcpControlPlane={onOpenNmcpControlPlane}
        onOpenGeminiChat={onOpenGeminiChat}
        onOpenPublicLanding={onOpenPublicLanding}
        onOpenLegacyDesktop={onOpenLegacyDesktop}
        isReadOnly={isReadOnly}
        onToggleSimulateOffline={onToggleSimulateOffline}
        leftSidebar={leftSidebar}
      >
        {interfaceMode === 'customer_portal' && (
          <CustomerPortalWorkspace
            screen={customerScreen}
            onSelectScreen={setCustomerScreen}
            order={customerOrder}
            onUpdateOrder={setCustomerOrder}
            currentTenant={bridge.currentTenant}
            activeCustomerTab={activeCustomerTab}
            onSelectCustomerTab={onSelectCustomerTab}
            assignedNumbers={assignedNumbers}
            onOpenSoftphone={bridge.onOpenSoftphone}
            onUpgradeSubscription={onUpgradeSubscription}
            onDispatchTestSms={onDispatchTestSms}
            onOrderNumber={onOrderNumber}
            onTopUpBalance={onTopUpBalance}
            onOpenStressTest={onOpenStressTest}
            onOpenOnboarding={onOpenCustomerOnboarding}
            onSwitchToOperatorOps={() => setInterfaceMode('operator_ops')}
            onShowToast={onShowToast}
          />
        )}

        {interfaceMode === 'operator_ops' && (
          <OperatorOperationsWorkspace
            activeTab={opsTab}
            onSelectTab={setOpsTab}
            orders={opsOrders}
            selectedOrderId={selectedOpsOrderId}
            onSelectOrderId={setSelectedOpsOrderId}
            onReconcileOrder={handleReconcileOrder}
            onRetryRouteOrder={handleRetryRouteOrder}
            onAdvanceOrderToActive={handleAdvanceOrderToActive}
            onOpenSystemDetail={handleOpenSystem}
            portingRequests={bridge.portingRequests}
            countries={bridge.countries}
            onSubmitNewPort={bridge.onSubmitNewPort}
            onAdvancePortStatus={bridge.onAdvancePortStatus}
            licenses={bridge.licenses}
            auditLogs={bridge.auditLogs}
            quarantinedNumbers={bridge.numbers.filter((n) => n.status === 'recycling')}
            onUploadLicense={bridge.onUploadLicense}
            onAdvanceRecycleStep={bridge.onAdvanceRecycleStep}
          />
        )}

        {interfaceMode === 'os_workspace' && (
          <>
            {activeSection === 'desktop' && (
              <DesktopWorkspace
                subView={desktopSubView}
                onChangeSubView={setDesktopSubView}
                currentTenant={bridge.currentTenant}
                scenario={scenario}
                experienceMode={experienceMode}
                onChangeExperienceMode={setExperienceMode}
                onSelectSection={setActiveSection}
                onOpenSystem={handleOpenSystem}
                onOpenTenantModal={onOpenTenantModal}
                onCreateNewProject={handleCreateNewProject}
                onApprovePlan={handleApprovePlan}
                onOpenNmcp={onOpenNmcpControlPlane}
                onOpenStressTest={onOpenStressTest}
              />
            )}

            {activeSection === 'mission_control' && (
              <MissionControlWorkspace
                currentTenant={bridge.currentTenant}
                scenario={scenario}
                portingRequests={bridge.portingRequests}
                auditLogs={bridge.auditLogs}
                onSelectSection={setActiveSection}
                onCreateNewProject={handleCreateNewProject}
                onApprovePlan={handleApprovePlan}
              />
            )}

            {activeSection === 'systems' && (
              <SystemsWorkspace
                selectedSystemNumber={selectedSystemNumber}
                onSelectSystemNumber={(num) => {
                  setSelectedSystemNumber(num);
                  setSystemModuleOpen(true);
                }}
                filters={systemFilters}
                onSelectSection={setActiveSection}
                bridge={bridge}
                activeModuleOpen={systemModuleOpen}
                onSetActiveModuleOpen={setSystemModuleOpen}
              />
            )}

            {activeSection === 'infrastructure' && (
              <InfrastructureWorkspace
                infraSubView={infraSubView}
                setInfraSubView={setInfraSubView}
                filterCountry={infraCountry}
                filterLayer={infraLayer}
                countries={bridge.countries}
                connectors={connectors}
                selectedCountryCode={bridge.selectedCountryCode}
                onSelectCountryCode={bridge.onCountryChange}
                onSelectSection={setActiveSection}
                onOpenAiForecast={bridge.onOpenAiForecast}
                onTriggerAutoOrder={(cc, count) => {
                  onShowToast(`Triggered auto-order replenish (+${count} DIDs) for ${cc}.`);
                }}
              />
            )}

            {activeSection === 'golden_command' && (
              <GoldenCommandWorkspace
                subView={goldenSubView}
                setSubView={setGoldenSubView}
                scenario={scenario}
                onUpdateScenario={updateScenario}
                onGeneratePlan={() => {
                  setGoldenSubView('proposed_plan');
                  onShowToast('Generated proposed deployment plan for ' + scenario.project);
                }}
                onApprovePlan={() => {
                  handleApprovePlan();
                  setActiveSection('deployments');
                  setDeploySubView('timeline');
                }}
                onSelectSection={setActiveSection}
              />
            )}

            {activeSection === 'deployments' && (
              <DeploymentsWorkspace
                subView={deploySubView}
                setSubView={setDeploySubView}
                selectedStageNum={selectedStageNum}
                setSelectedStageNum={setSelectedStageNum}
                currentTenant={bridge.currentTenant}
                scenario={scenario}
                onUpdateScenario={updateScenario}
                onSelectSection={setActiveSection}
              />
            )}

            {activeSection === 'expert_console' && (
              <ExpertConsoleWorkspace
                currentTenant={bridge.currentTenant}
                scenario={scenario}
                activeTab={expertTab}
                onChangeTab={setExpertTab}
                onSelectSection={setActiveSection}
                selectedSystem={expertSystem}
                selectedStage={expertStage}
                eventCategory={expertCategory}
              />
            )}
          </>
        )}
      </OsChrome>

      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationRead}
        onNavigateSection={(sec) => {
          setInterfaceMode('os_workspace');
          setActiveSection(sec);
          setNotificationsOpen(false);
        }}
      />

      {onboardingModalView && (
        <OnboardingFlowModal
          isOpen={Boolean(onboardingModalView)}
          initialView={onboardingModalView}
          onClose={() => setOnboardingModalView(null)}
          experienceMode={experienceMode}
          onSelectExperienceMode={(mode) => {
            setExperienceMode(mode);
            if (mode === 'expert') {
              setInterfaceMode('os_workspace');
              setActiveSection('expert_console');
            }
          }}
          onCreateOrg={(orgName, country) => {
            onShowToast(`Created demo organization "${orgName}" (${country})`);
          }}
          onNavigateTarget={(sec) => {
            setInterfaceMode('os_workspace');
            setActiveSection(sec);
          }}
        />
      )}
    </>
  );
};
