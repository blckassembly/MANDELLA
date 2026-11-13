import React, { useState, useMemo } from 'react';
import {
  MandelaApplication,
  MandelaModule,
  WorkspaceRecordItem,
  WorkspaceKpiMetric
} from '../../types/mandelaOS';
import { TenantAccount } from '../../types/multiTenant';
import { WorkspaceHeader } from './WorkspaceHeader';
import { OperationalKpiCards } from './OperationalKpiCards';
import { HighDensityTable } from './HighDensityTable';
import { RecordDetailsDrawer } from './RecordDetailsDrawer';

// Specialized Existing Views
import { PanAfricaNumberInventoryView } from '../numbers/PanAfricaNumberInventoryView';
import { VisualWorkflowBuilder } from '../agnostic-os/VisualWorkflowBuilder';
import { CommandControlDashboard } from '../agnostic-os/CommandControlDashboard';
import { AgentBuilderStudio } from '../agnostic-os/AgentBuilderStudio';
import { MandelaShellTerminal } from '../agnostic-os/MandelaShellTerminal';
import { ProviderRegistryView } from '../agnostic-os/ProviderRegistryView';
import { SystemTaskManager } from '../agnostic-os/SystemTaskManager';
import { TelecomFileExplorer } from '../agnostic-os/TelecomFileExplorer';
import { CallRecordingsAnalyticsView } from '../agnostic-os/CallRecordingsAnalyticsView';
import { DeveloperConsoleView } from '../agnostic-os/DeveloperConsoleView';

// Enterprise Existing Suites
import { RateDeckManager } from '../interconnect/RateDeckManager';
import { LcrRoutingEngine } from '../interconnect/LcrRoutingEngine';
import { CdrMediationStream } from '../interconnect/CdrMediationStream';
import { SatelliteNtnSuite } from '../satellite/SatelliteNtnSuite';
import { EdgeDefenseSuite } from '../edge/EdgeDefenseSuite';
import { SiemFabricSuite } from '../edge/SiemFabricSuite';
import { AiAnomalyVoiceSuite } from '../edge/AiAnomalyVoiceSuite';
import { SocC2Suite } from '../edge/SocC2Suite';
import { CustomerPortalView } from '../customer/CustomerPortalView';

// Mock Domain Data
import { AFRICAN_COUNTRIES, INITIAL_NUMBERS, INITIAL_PORTING_REQUESTS } from '../../data/mockData';
import {
  INITIAL_RATE_DECKS,
  INITIAL_CARRIER_ROUTES,
  INITIAL_MEDIATED_CDRS,
  INITIAL_INTERCONNECT_ALERTS
} from '../../data/mockInterconnectData';
import { INITIAL_SMPP_BINDS, INITIAL_MESSAGES } from '../../data/mockMessagingData';

export interface AppWorkspaceProps {
  application: MandelaApplication;
  module: MandelaModule;
  currentTenant: TenantAccount;
  onOpenSoftphone?: (number?: string) => void;
  onOpenOnboarding?: () => void;
  onSelectSubView?: (subView: string) => void;
}

export const AppWorkspace: React.FC<AppWorkspaceProps> = ({
  application,
  module,
  currentTenant,
  onOpenSoftphone,
  onOpenOnboarding,
  onSelectSubView
}) => {
  const [selectedRecord, setSelectedRecord] = useState<WorkspaceRecordItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Generate Default Dynamic KPI Metrics per module
  const kpiMetrics: WorkspaceKpiMetric[] = useMemo(() => {
    switch (application.id) {
      case 'e01_number_mgmt':
      case 'o01_number_registry':
        return [
          { id: '1', label: 'Allocated Lines', value: 14820, unit: 'DIDs', changePercent: 8.4, status: 'nominal' },
          { id: '2', label: 'Country Coverage', value: '54 / 54', unit: 'Nations', changePercent: 0, status: 'nominal' },
          { id: '3', label: '15-Min Locks', value: 42, unit: 'Active', changePercent: 12.0, status: 'nominal' },
          { id: '4', label: 'KYC Verified', value: '99.2%', unit: 'Rate', changePercent: 0.4, status: 'nominal' },
          { id: '5', label: 'eSIM SM-DP+', value: 3810, unit: 'Vault', changePercent: 15.2, status: 'nominal' },
          { id: '6', label: 'Redis Resv', value: '0.8ms', unit: 'Latency', changePercent: -4.0, status: 'nominal' }
        ];
      case 'e02_carrier_lcr':
        return [
          { id: '1', label: 'Wholesale Carriers', value: 104, unit: 'Trunks', changePercent: 2.1, status: 'nominal' },
          { id: '2', label: 'Avg ASR Ratio', value: '74.2%', unit: 'ASR', changePercent: 1.8, status: 'nominal' },
          { id: '3', label: 'LCR Margin', value: '23.8%', unit: 'Margin', changePercent: 3.2, status: 'nominal' },
          { id: '4', label: 'Grey Routes Quarantined', value: 12, unit: 'FAS', changePercent: -15.0, status: 'nominal' },
          { id: '5', label: 'Active Prefixes', value: '18,420', unit: 'Rules', changePercent: 0.8, status: 'nominal' },
          { id: '6', label: 'Mediation Lag', value: '3.4ms', unit: 'Lag', changePercent: 0, status: 'nominal' }
        ];
      case 'e03_sbc_sip_core':
      case 'o03_noc_c2':
        return [
          { id: '1', label: 'Active Channels', value: 1842, unit: 'CPS: 320', changePercent: 14.1, status: 'nominal' },
          { id: '2', label: 'Global MOS Score', value: '4.42', unit: '/ 5.0', changePercent: 0.2, status: 'nominal' },
          { id: '3', label: 'Edge PoPs Online', value: '6 / 6', unit: 'Anycast', changePercent: 0, status: 'nominal' },
          { id: '4', label: 'Packet Loss', value: '0.02%', unit: 'Loss', changePercent: -0.01, status: 'nominal' },
          { id: '5', label: 'TLS Handshake', value: '14.2ms', unit: 'Time', changePercent: -1.2, status: 'nominal' },
          { id: '6', label: 'FreeSWITCH Threads', value: 128, unit: 'Active', changePercent: 0, status: 'nominal' }
        ];
      default:
        return [
          { id: '1', label: 'Service State', value: 'ACTIVE', unit: '100%', changePercent: 0, status: 'nominal' },
          { id: '2', label: 'Connected Sources', value: application.dataSources.length, unit: 'Binds', changePercent: 0, status: 'nominal' },
          { id: '3', label: 'Active Tenant', value: currentTenant.region, unit: 'Region', changePercent: 0, status: 'nominal' },
          { id: '4', label: 'SLA Availability', value: '99.999%', unit: 'Uptime', changePercent: 0, status: 'nominal' }
        ];
    }
  }, [application.id, currentTenant.region, application.dataSources.length]);

  // Generate Table Records if fallback data workspace is used
  const tableRecords: WorkspaceRecordItem[] = useMemo(() => {
    switch (application.id) {
      case 'e01_number_mgmt':
      case 'o01_number_registry':
        return INITIAL_NUMBERS.map((n) => ({
          id: n.id,
          title: n.e164,
          subtitle: `${n.countryName} (${n.countryCode}) · ${n.type.toUpperCase()}`,
          category: n.type,
          status: (n.status === 'assigned' ? 'ACTIVE' : n.status === 'reserved' ? 'WARNING' : 'ACTIVE') as WorkspaceRecordItem['status'],
          lastUpdated: n.lastActivityAt || '2026-11-09',
          provenance: n.enumRecord || 'ITU-T National Allocation',
          attributes: {
            country: n.countryName,
            e164: n.e164,
            monthlyFeeUsd: `$${n.monthlyFeeUsd.toFixed(2)}`,
            inboundRatePerMin: `$${n.perMinInboundUsd.toFixed(4)}`,
            assignedTenant: n.allocatedTo || 'Unassigned Pool',
            features: n.features.join(', '),
            routingTrunk: n.sipTrunkUri || 'Kamailio-Anycast-01'
          }
        }));

      case 'e02_carrier_lcr':
        return INITIAL_RATE_DECKS.map((r) => ({
          id: r.id,
          title: r.carrierName,
          subtitle: `Version ${r.version} · Format: ${r.format}`,
          category: 'Rate Deck',
          status: (r.status === 'active' ? 'ACTIVE' : 'WARNING') as WorkspaceRecordItem['status'],
          lastUpdated: r.effectiveDate,
          provenance: 'Wholesale Carrier Rate Engine',
          attributes: {
            carrierName: r.carrierName,
            format: r.format,
            effectiveDate: r.effectiveDate,
            currency: r.currency,
            totalDestinations: r.totalDestinations,
            marginImpactPercent: `${r.marginImpactPercent}%`
          }
        }));

      case 'e06_sms_ussd':
        return INITIAL_SMPP_BINDS.map((b) => ({
          id: b.id,
          title: b.carrierName,
          subtitle: `${b.operator} (${b.countryCode}) · System ID: ${b.systemId}`,
          category: 'SMPP Bind',
          status: (b.state === 'BOUND' ? 'ACTIVE' : 'WARNING') as WorkspaceRecordItem['status'],
          lastUpdated: b.lastEnquireLink,
          provenance: `Direct MNO Interconnect (${b.operator})`,
          attributes: {
            carrierName: b.carrierName,
            operator: b.operator,
            systemId: b.systemId,
            host: `${b.host}:${b.port}`,
            protocol: b.protocol,
            bindType: b.bindType,
            maxTps: `${b.maxTps} msg/sec`
          }
        }));

      default:
        return [
          {
            id: 'rec-1',
            title: `${application.shortName} · Primary Microservice Node`,
            subtitle: `Active microservice binding for ${module.label}`,
            category: application.category,
            status: 'ACTIVE' as const,
            lastUpdated: new Date().toLocaleDateString(),
            provenance: application.dataSources[0] || 'Mandela Core IPC Socket',
            attributes: {
              owningApplication: application.name,
              moduleName: module.label,
              tenantId: currentTenant.id,
              tenantName: currentTenant.name,
              runtimeDriver: 'Linux 6.8 RT-PREEMPT',
              encryptionState: 'AES-256-GCM / TLS 1.3'
            }
          },
          {
            id: 'rec-2',
            title: `${application.shortName} · Failover Cluster Standby`,
            subtitle: `Secondary disaster recovery mirror in Johannesburg`,
            category: application.category,
            status: 'ACTIVE' as const,
            lastUpdated: new Date().toLocaleDateString(),
            provenance: 'Anycast Sync Replication Bus',
            attributes: {
              clusterRegion: 'Johannesburg (JINX)',
              replicationMode: 'Synchronous Multi-Region',
              rpoTarget: '0 seconds',
              rtoTarget: '< 400 milliseconds'
            }
          }
        ];
    }
  }, [application, module, currentTenant]);

  // =========================================================================
  // VIEW ROUTER: Check if existing specialized view is mounted for this app/module
  // =========================================================================

  // 1. TIER 01: Sovereign Number Management (E01)
  if (application.id === 'e01_number_mgmt') {
    let subView = 'product_landing';
    if (module.id === 'inventory' || module.id === 'country_registry') {
      subView = 'all_inventory';
    } else if (module.id === 'portability') {
      subView = 'reservations';
    } else if (module.id === 'provisioning_queue') {
      subView = 'aggregators';
    } else if (module.id === 'overview') {
      subView = 'product_landing';
    }

    if (['overview', 'inventory', 'country_registry', 'portability', 'provisioning_queue'].includes(module.id)) {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
          <PanAfricaNumberInventoryView
            currentTenant={currentTenant}
            activeSubView={subView}
            onSelectSubView={(v) => {
              if (onSelectSubView) {
                if (v === 'product_landing') onSelectSubView('overview');
                else if (v === 'all_inventory') onSelectSubView('inventory');
                else if (v === 'reservations') onSelectSubView('portability');
                else if (v === 'aggregators') onSelectSubView('provisioning_queue');
                else if (v === 'forecasting') onSelectSubView('overview');
              }
            }}
            onOpenSoftphone={onOpenSoftphone}
          />
        </div>
      );
    }
  }

  // 2. Carrier Interconnect (E02)
  if (application.id === 'e02_carrier_lcr') {
    if (module.id === 'rate_decks') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
          <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          <div className="flex-1 overflow-y-auto p-6">
            <RateDeckManager rateDecks={INITIAL_RATE_DECKS} onUploadRateDeck={() => {}} />
          </div>
        </div>
      );
    }
    if (module.id === 'lcr_simulator' || module.id === 'route_policies' || module.id === 'dashboard') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
          <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          <div className="flex-1 overflow-y-auto p-6">
            <LcrRoutingEngine routes={INITIAL_CARRIER_ROUTES} alerts={INITIAL_INTERCONNECT_ALERTS} onApplyReroute={() => {}} />
          </div>
        </div>
      );
    }
    if (module.id === 'traffic_stream') {
      return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
          <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
          <div className="flex-1 overflow-y-auto p-6">
            <CdrMediationStream cdrs={INITIAL_MEDIATED_CDRS} />
          </div>
        </div>
      );
    }
  }

  // 3. Satellite NTN (E04)
  if (application.id === 'e04_satellite_ntn') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto p-6">
          <SatelliteNtnSuite activeTab="teleport_ground" />
        </div>
      </div>
    );
  }

  // 4. Edge Defense (E08)
  if (application.id === 'e08_edge_defense') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto p-6">
          <EdgeDefenseSuite currentTenantId={currentTenant.id} />
        </div>
      </div>
    );
  }

  // 5. SIEM Fabric (E09)
  if (application.id === 'e09_siem_fabric') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto p-6">
          <SiemFabricSuite currentTenantId={currentTenant.id} />
        </div>
      </div>
    );
  }

  // 6. AI Fraud (E10)
  if (application.id === 'e10_ai_fraud') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto p-6">
          <AiAnomalyVoiceSuite currentTenantId={currentTenant.id} />
        </div>
      </div>
    );
  }

  // 7. SOC C2 (E11)
  if (application.id === 'e11_soc_c2') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto p-6">
          <SocC2Suite currentTenantId={currentTenant.id} />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. TIER 02: Mandela Agnostic OS Applications (O01 to O11)
  // =========================================================================

  if (application.id === 'o01_number_registry') {
    let subView = 'product_landing';
    if (module.id === 'countries' || module.id === 'inventory_pool') {
      subView = 'all_inventory';
    } else if (module.id === 'portability') {
      subView = 'reservations';
    } else if (module.id === 'provisioning') {
      subView = 'aggregators';
    } else if (module.id === 'overview') {
      subView = 'product_landing';
    }

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <PanAfricaNumberInventoryView
          currentTenant={currentTenant}
          activeSubView={subView}
          onSelectSubView={(v) => {
            if (onSelectSubView) {
              if (v === 'product_landing') onSelectSubView('overview');
              else if (v === 'all_inventory') onSelectSubView('inventory_pool');
              else if (v === 'reservations') onSelectSubView('portability');
              else if (v === 'aggregators') onSelectSubView('provisioning');
              else if (v === 'forecasting') onSelectSubView('overview');
            }
          }}
          onOpenSoftphone={onOpenSoftphone}
        />
      </div>
    );
  }

  if (application.id === 'o02_n8n_workflows') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <VisualWorkflowBuilder onOpenSoftphone={onOpenSoftphone} onOpenOnboarding={onOpenOnboarding} />
      </div>
    );
  }

  if (application.id === 'o03_noc_c2') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <CommandControlDashboard />
      </div>
    );
  }

  if (application.id === 'o04_agent_studio') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <AgentBuilderStudio />
      </div>
    );
  }

  if (application.id === 'o05_mandela_shell') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <MandelaShellTerminal />
      </div>
    );
  }

  if (application.id === 'o06_providers') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <ProviderRegistryView />
      </div>
    );
  }

  if (application.id === 'o07_task_manager') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <SystemTaskManager />
      </div>
    );
  }

  if (application.id === 'o08_storage_explorer') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <TelecomFileExplorer />
      </div>
    );
  }

  if (application.id === 'o09_recordings') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
        <CallRecordingsAnalyticsView />
      </div>
    );
  }

  if (application.id === 'o10_dev_console') {
    return (
      <div className="flex-1 flex flex-col h-full overflow-y-auto bg-zinc-950 p-6">
        <DeveloperConsoleView />
      </div>
    );
  }

  // =========================================================================
  // 3. TIER 03: Customer Self-Service Portal (C01 to C08)
  // =========================================================================
  if (application.tier === 'customer') {
    const tabMapping: Record<string, any> = {
      dashboard: 'overview',
      usage: 'overview',
      spending: 'billing',
      my_numbers: 'services',
      sip_credentials: 'services',
      destinations: 'services',
      countries: 'storefront',
      search_numbers: 'storefront',
      cart: 'storefront',
      history: 'cdrs',
      live_calls: 'cdrs',
      credentials: 'api_keys',
      webhooks: 'api_keys',
      balance: 'billing',
      top_up: 'billing',
      invoices: 'billing',
      verification: 'support',
      kyc_tiers: 'support',
      overview: 'sla',
      uptime: 'sla'
    };

    const targetCustomerTab = tabMapping[module.id] || 'overview';

    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50">
        <WorkspaceHeader application={application} module={module} onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        <div className="flex-1 overflow-y-auto">
          <CustomerPortalView
            currentTenant={currentTenant}
            activeCustomerTab={targetCustomerTab as any}
            onSelectCustomerTab={(t) => onSelectSubView && onSelectSubView(t)}
            assignedNumbers={INITIAL_NUMBERS.slice(0, 5)}
            onOpenSoftphone={(numRecord) => onOpenSoftphone && onOpenSoftphone(numRecord as any)}
            onUpgradeSubscription={() => {}}
            onDispatchTestSms={() => {}}
            onOrderNumber={() => {}}
            onTopUpBalance={() => {}}
            onOpenOnboarding={onOpenOnboarding}
          />
        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. STANDARDIZED ENTERPRISE HIGH-DENSITY DATA WORKSPACE
  // =========================================================================
  return (
    <div className="flex-1 flex overflow-hidden bg-neutral-50 relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <WorkspaceHeader
          application={application}
          module={module}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onPrimaryAction={() => {}}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <OperationalKpiCards metrics={kpiMetrics} />

          <HighDensityTable
            records={tableRecords}
            onSelectRecord={(rec) => setSelectedRecord(rec)}
            selectedRecordId={selectedRecord?.id}
            searchPlaceholder={`Filter ${module.label} records across ${currentTenant.name}...`}
          />
        </div>
      </div>

      {selectedRecord && (
        <RecordDetailsDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onAction={(action, rec) => {
            alert(`Executed operation "${action}" on record: ${rec.title}`);
          }}
        />
      )}
    </div>
  );
};
