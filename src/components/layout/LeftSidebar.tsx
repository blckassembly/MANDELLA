import React, { useState } from 'react';
import {
  PortalMode,
  EnterpriseProduct,
  CustomerProduct,
  TenantAccount,
  InterconnectTab,
  SatelliteTab,
  EdgeDefenseTab,
  SiemFabricTab,
  AiAnomalyTab,
  SocC2Tab
} from '../../types/multiTenant';
import {
  DataverseTab,
  System1Tab,
  System2Tab,
  System3Tab,
  System4Tab
} from '../Header';
import {
  Database,
  Server,
  Zap,
  Mic,
  MessageSquare,
  Phone,
  LayoutDashboard,
  Key,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Lock,
  Satellite,
  Activity,
  Rocket,
  Palette,
  Search,
  Brain,
  Layers,
  ArrowRight,
  Radio,
  ShoppingBag,
  FileText,
  LifeBuoy,
  Globe,
  LayoutGrid
} from 'lucide-react';

export interface PortalArchitectureConfig {
  id: EnterpriseProduct;
  layerNumber: string;
  shortName: string;
  fullName: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  telemetrySummary: string;
  statusText: string;
  subTabs: {
    id: string;
    label: string;
    badge?: string;
  }[];
}

export const PORTAL_ARCHITECTURES: PortalArchitectureConfig[] = [
  {
    id: 'interconnect',
    layerNumber: '01',
    shortName: 'Interconnect',
    fullName: 'Carrier Interconnect & LCR',
    subtitle: 'SS7 / SIGTRAN & Dynamic Rate Decks',
    icon: Zap,
    telemetrySummary: '104 Carriers · 99.98% LCR Rate',
    statusText: 'BGP Carrier Mesh Active',
    subTabs: [
      { id: 'rate_decks', label: 'Rate Deck Ingestion (100+)' },
      { id: 'lcr_engine', label: 'LCR Quality Engine' },
      { id: 'cdr_stream', label: 'Real-time Kafka CDRs' }
    ]
  },
  {
    id: 'satellite_ntn',
    layerNumber: '02',
    shortName: 'Satellite NTN',
    fullName: 'Satellite NTN & Orbital Gateway',
    subtitle: '3GPP Rel-17 NTN & Teleports',
    icon: Satellite,
    telemetrySummary: '18 Earth Stations · LEO Constellation',
    statusText: 'Rel-17 Direct-to-Cell Active',
    subTabs: [
      { id: 'teleport_ground', label: 'Teleports & Earth Stations' },
      { id: 'ntn_direct', label: '3GPP Direct-to-Device' },
      { id: 'orbit_telemetry', label: 'Beam Footprint Tracker' },
      { id: 'maritime_mining', label: 'Offshore & Mining VSAT' }
    ]
  },
  {
    id: 'sbc_core',
    layerNumber: '03',
    shortName: 'SBC Core',
    fullName: 'Carrier SBC & SIP Core',
    subtitle: 'Kamailio + FreeSWITCH Core',
    icon: Server,
    telemetrySummary: '10,000 CPS · 6 African PoPs',
    statusText: 'Anycast SIP Core Online',
    subTabs: [
      { id: 'sbc_noc', label: 'SBC Anycast NOC' },
      { id: 'pbx_connect', label: 'Connect PBX Trunk' },
      { id: 'ladder_traces', label: 'SIP Ladder Traces' },
      { id: 'header_rules', label: 'Header Manipulation' },
      { id: 'security_ai', label: 'Fraud & AI Shield' }
    ]
  },
  {
    id: 'voice_ivr',
    layerNumber: '04',
    shortName: 'Voice & IVR',
    fullName: 'Consumer Voice & Multilingual IVR',
    subtitle: 'FreeSWITCH Media & Neural Speech',
    icon: Mic,
    telemetrySummary: '4,280 Concur. Channels · 50 Languages',
    statusText: 'Neural ASR/TTS Engine Ready',
    subTabs: [
      { id: 'voice_noc', label: 'Voice NOC & Live Calls' },
      { id: 'ivr_builder', label: 'Visual IVR Flow Builder' },
      { id: 'call_simulator', label: 'Call Simulator & Biometrics' },
      { id: 'languages_matrix', label: '50 African ASR/TTS Models' },
      { id: 'call_summaries', label: 'AI Call Summaries' }
    ]
  },
  {
    id: 'messaging_sms',
    layerNumber: '05',
    shortName: 'SMS Gateway',
    fullName: 'Messaging Gateway & USSD',
    subtitle: 'Direct SMPP v5 & Native USSD Core',
    icon: MessageSquare,
    telemetrySummary: '1,500 MPS · 89 Direct Carrier Binds',
    statusText: 'SMPP v5.0 Cluster Active',
    subTabs: [
      { id: 'noc_dashboard', label: 'SMPP & MAP NOC' },
      { id: 'dispatcher', label: 'Campaign Dispatcher' },
      { id: 'phone_simulator', label: 'Feature Phone Simulator' },
      { id: 'smpp_binds', label: 'SMPP Binds & PDU Traces' },
      { id: 'routing_engine', label: 'AI Route Optimizer' },
      { id: 'msg_api', label: 'Messaging API Explorer' }
    ]
  },
  {
    id: 'nms_numbers',
    layerNumber: '06',
    shortName: 'Sovereign NMS',
    fullName: 'Sovereign Number Management',
    subtitle: 'E.164 Inventory, MNP & eSIM Attestation',
    icon: Phone,
    telemetrySummary: '42,850 Active DIDs · 54 Sovereign Nations',
    statusText: 'GSMA SGP.22 & ENUM Verified',
    subTabs: [
      { id: 'command_control', label: 'Command & Control Map' },
      { id: 'pan_africa_inventory', label: 'Pan-Africa ITU Inventory (54)', badge: 'Aggregated' },
      { id: 'inventory', label: 'Regulatory DID Inventory' },
      { id: 'my_numbers', label: 'My Numbers & Routing' },
      { id: 'porting', label: 'MNP Porting Engine' },
      { id: 'compliance', label: 'Sovereign Compliance' },
      { id: 'esim_attestation', label: 'eSIM Attestation Dashboard', badge: 'Critical (<30d)' },
      { id: 'api', label: 'NMS REST API Console' }
    ]
  },
  {
    id: 'dataverse',
    layerNumber: '07',
    shortName: 'Dataverse',
    fullName: 'MANDELA Sovereign Dataverse',
    subtitle: 'Multi-Tenant Cassandra & Parquet Engine',
    icon: Database,
    telemetrySummary: '14 Schemas · 3 Keyspaces · CDC Stream',
    statusText: 'Storage Fabric Synchronized',
    subTabs: [
      { id: 'overview', label: 'Overview & Telemetry' },
      { id: 'schemas', label: 'Entity Schemas & ERD' },
      { id: 'records', label: 'Record Explorer & Audit' },
      { id: 'query', label: 'SQL Query Studio' },
      { id: 'pipeline', label: 'Event Streaming (CDC)' },
      { id: 'governance', label: 'Governance & RBAC' },
      { id: 'ai_data', label: 'AI Data Service' }
    ]
  },
  {
    id: 'edge_defense',
    layerNumber: '08',
    shortName: 'Edge Defense',
    fullName: 'Edge Defense & Signaling Plane',
    subtitle: 'Layer 3/4/7 DDoS Scrubber & STIR/SHAKEN',
    icon: ShieldAlert,
    telemetrySummary: 'eBPF / XDP Scrubber · 0.4ms Latency',
    statusText: 'Inline Signaling Firewall Armed',
    subTabs: [
      { id: 'signaling_firewall', label: 'SS7 & Diameter (FS.11/19)' },
      { id: 'sms_firewall', label: 'SMS & Simjacker Defense' },
      { id: 'stir_shaken', label: 'STIR/SHAKEN & DNO' },
      { id: 'ixp_scrubber', label: 'IXP eBPF/XDP Scrubbing' },
      { id: 'bypass_guardrails', label: 'Optical Bypass & SLAs' },
      { id: 'ai_shadow_spec', label: 'AI Shadow Spec (Rust/Go)' }
    ]
  },
  {
    id: 'siem_fabric',
    layerNumber: '09',
    shortName: 'SIEM Fabric',
    fullName: '18-System SIEM & Normalization',
    subtitle: 'Apache Flink Stateful Correlation',
    icon: Layers,
    telemetrySummary: '2.4M EPS · OCSF Tiered Lakehouse',
    statusText: 'Kafka Ingestion Nominal',
    subTabs: [
      { id: 'connectors_matrix', label: '18-Source Matrix (OCSF)' },
      { id: 'flink_stateful', label: 'Flink 15m State Correlation' },
      { id: 'tiered_storage', label: 'Hot/Graph/Cold Lakehouse' },
      { id: 'ai_shadow_spec', label: 'AI Shadow (Proto/Java/SQL)' }
    ]
  },
  {
    id: 'ai_anomaly_voice',
    layerNumber: '10',
    shortName: 'AI Voice Fraud',
    fullName: 'AI Anomaly & Voice Fraud Engine',
    subtitle: 'RawNet3 Deepfake Biometrics & JA4',
    icon: Brain,
    telemetrySummary: 'RawNet3 Biometrics · 99.4% Accuracy',
    statusText: 'Acoustic Defense Online',
    subTabs: [
      { id: 'phone_velocity', label: 'Geodesic Velocity & Drain' },
      { id: 'tower_simbox', label: 'Tower ST-GNN & SIM-Box' },
      { id: 'ip_ja4', label: 'IP JA4 Fingerprinting' },
      { id: 'voice_deepfake', label: 'Voice Deepfake RawNet3' },
      { id: 'ai_shadow_spec', label: 'AI Shadow Models (Python)' }
    ]
  },
  {
    id: 'soc_c2',
    layerNumber: '11',
    shortName: 'SOC C2',
    fullName: 'SOC Command & Control (C2)',
    subtitle: 'Incident Response & SIM-Swap Lockdown',
    icon: ShieldCheck,
    telemetrySummary: 'Zero Uncontained Incidents · Deck.gl Map',
    statusText: 'C2 Command Authority Armed',
    subTabs: [
      { id: 'threat_matrix', label: 'Threat Overview & Planes' },
      { id: 'simswap_quarantine', label: 'SIM-Swap Quarantine' },
      { id: 'entity_graph', label: 'Multi-Hop Entity Graph' },
      { id: 'geodesic_map', label: 'Threat Geospatial (Deck.gl)' },
      { id: 'acoustic_lab', label: 'Acoustic Deepfake Lab' },
      { id: 'playbook_automation', label: 'AI Mitigation Playbooks' }
    ]
  }
];

export const CUSTOMER_PORTAL_TABS: { id: CustomerProduct; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Usage & Overview', icon: LayoutDashboard },
  { id: 'services', label: 'My Communications', icon: Phone },
  { id: 'storefront', label: 'Order Numbers & eSIM', icon: ShoppingBag },
  { id: 'cdrs', label: 'Live CDRs & Audio', icon: FileText },
  { id: 'api_keys', label: 'API & Webhooks Hub', icon: Key },
  { id: 'billing', label: 'Invoices & Billing', icon: CreditCard },
  { id: 'support', label: 'Support & Incidents', icon: LifeBuoy },
  { id: 'sla', label: 'SLA & Sovereign Terms', icon: ShieldCheck }
];

interface LeftSidebarProps {
  portalMode: PortalMode;
  onSelectPortalMode: (mode: PortalMode) => void;
  onOpenCommandPalette?: () => void;
  activeEnterpriseProduct: EnterpriseProduct;
  onSelectEnterpriseProduct: (prod: EnterpriseProduct) => void;
  activeCustomerTab: CustomerProduct;
  onSelectCustomerTab: (tab: CustomerProduct) => void;
  // Subtabs
  dataverseTab: DataverseTab;
  onSelectDataverseTab: (tab: DataverseTab) => void;
  edgeDefenseTab?: EdgeDefenseTab;
  onSelectEdgeDefenseTab?: (tab: EdgeDefenseTab) => void;
  siemFabricTab?: SiemFabricTab;
  onSelectSiemFabricTab?: (tab: SiemFabricTab) => void;
  aiAnomalyTab?: AiAnomalyTab;
  onSelectAiAnomalyTab?: (tab: AiAnomalyTab) => void;
  socC2Tab?: SocC2Tab;
  onSelectSocC2Tab?: (tab: SocC2Tab) => void;
  system4Tab: System4Tab;
  onSelectSystem4Tab: (tab: System4Tab) => void;
  interconnectTab: InterconnectTab;
  onSelectInterconnectTab: (tab: InterconnectTab) => void;
  satelliteTab?: SatelliteTab;
  onSelectSatelliteTab?: (tab: SatelliteTab) => void;
  system3Tab: System3Tab;
  onSelectSystem3Tab: (tab: System3Tab) => void;
  system2Tab: System2Tab;
  onSelectSystem2Tab: (tab: System2Tab) => void;
  system1Tab: System1Tab;
  onSelectSystem1Tab: (tab: System1Tab) => void;
  // Tenant & Actions
  currentTenant: TenantAccount;
  onOpenTenantModal: () => void;
  onOpenOnboarding?: () => void;
  onOpenStressTest?: () => void;
  onOpenDesignSystem?: () => void;
  onOpenNmcpControlPlane?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  portalMode,
  onSelectPortalMode,
  activeEnterpriseProduct,
  onSelectEnterpriseProduct,
  activeCustomerTab,
  onSelectCustomerTab,
  dataverseTab,
  onSelectDataverseTab,
  edgeDefenseTab = 'signaling_firewall',
  onSelectEdgeDefenseTab,
  siemFabricTab = 'connectors_matrix',
  onSelectSiemFabricTab,
  aiAnomalyTab = 'phone_velocity',
  onSelectAiAnomalyTab,
  socC2Tab = 'threat_matrix',
  onSelectSocC2Tab,
  system4Tab,
  onSelectSystem4Tab,
  interconnectTab,
  onSelectInterconnectTab,
  satelliteTab = 'teleport_ground',
  onSelectSatelliteTab,
  system3Tab,
  onSelectSystem3Tab,
  system2Tab,
  onSelectSystem2Tab,
  system1Tab,
  onSelectSystem1Tab,
  currentTenant,
  onOpenTenantModal,
  onOpenOnboarding,
  onOpenStressTest,
  onOpenDesignSystem,
  onOpenNmcpControlPlane,
  onOpenCommandPalette,
  isCollapsed,
  onToggleCollapse
}) => {
  const [hoveredPortalId, setHoveredPortalId] = useState<string | null>(null);
  const [hoveredPortalTop, setHoveredPortalTop] = useState<number>(100);
  const [hoveredCustomerTab, setHoveredCustomerTab] = useState<string | null>(null);
  const [hoveredCustomerTop, setHoveredCustomerTop] = useState<number>(100);

  const plan = currentTenant.subscription;
  const isProductAllowed = (prod: EnterpriseProduct) => {
    return plan.allowedProducts.includes(prod);
  };

  // Find the currently active portal architecture configuration
  const currentArchitecture = PORTAL_ARCHITECTURES.find(
    (arch) => arch.id === activeEnterpriseProduct
  ) || PORTAL_ARCHITECTURES[5]; // Default to Sovereign NMS (Layer 06)

  // Determine current active subtab for the selected architecture
  const getActiveSubTabForArchitecture = (archId: EnterpriseProduct): string => {
    switch (archId) {
      case 'interconnect':
        return interconnectTab;
      case 'satellite_ntn':
        return satelliteTab;
      case 'sbc_core':
        return system4Tab;
      case 'voice_ivr':
        return system3Tab;
      case 'messaging_sms':
        return system2Tab;
      case 'nms_numbers':
        return system1Tab;
      case 'dataverse':
        return dataverseTab;
      case 'edge_defense':
        return edgeDefenseTab;
      case 'siem_fabric':
        return siemFabricTab;
      case 'ai_anomaly_voice':
        return aiAnomalyTab;
      case 'soc_c2':
        return socC2Tab;
      default:
        return '';
    }
  };

  // Handle changing subtab for the active architecture
  const handleSelectSubTab = (archId: EnterpriseProduct, subTabId: string) => {
    switch (archId) {
      case 'interconnect':
        onSelectInterconnectTab(subTabId as InterconnectTab);
        break;
      case 'satellite_ntn':
        if (onSelectSatelliteTab) onSelectSatelliteTab(subTabId as SatelliteTab);
        break;
      case 'sbc_core':
        onSelectSystem4Tab(subTabId as System4Tab);
        break;
      case 'voice_ivr':
        onSelectSystem3Tab(subTabId as System3Tab);
        break;
      case 'messaging_sms':
        onSelectSystem2Tab(subTabId as System2Tab);
        break;
      case 'nms_numbers':
        onSelectSystem1Tab(subTabId as System1Tab);
        break;
      case 'dataverse':
        onSelectDataverseTab(subTabId as DataverseTab);
        break;
      case 'edge_defense':
        if (onSelectEdgeDefenseTab) onSelectEdgeDefenseTab(subTabId as EdgeDefenseTab);
        break;
      case 'siem_fabric':
        if (onSelectSiemFabricTab) onSelectSiemFabricTab(subTabId as SiemFabricTab);
        break;
      case 'ai_anomaly_voice':
        if (onSelectAiAnomalyTab) onSelectAiAnomalyTab(subTabId as AiAnomalyTab);
        break;
      case 'soc_c2':
        if (onSelectSocC2Tab) onSelectSocC2Tab(subTabId as SocC2Tab);
        break;
    }
  };

  return (
    <>
      {/* =========================================================================
          RAIL 1: SLIM LEFT ICON RAIL (88px)
          Houses Brand, Tenant Switcher, Portal Mode Toggle, 11 Architecture Buttons
          ========================================================================= */}
      <aside
        className="fixed top-0 left-0 z-50 h-screen w-[88px] bg-zinc-950 text-white flex flex-col items-center justify-between py-3.5 border-r border-zinc-800 select-none shadow-sm"
        aria-label="System Architecture Portals"
      >
        {/* Top: Brand Mark & Tenant Switcher */}
        <div className="flex flex-col items-center gap-3 w-full px-2">
          {/* Brand Mark */}
          <div
            className="w-12 h-11 rounded-[4px] bg-white text-black flex items-center justify-center font-black text-lg tracking-tight shrink-0 shadow-sm cursor-default"
            title="Mandela Connect — Sovereign Atelier Operating System"
          >
            M
          </div>

          {/* Tenant Avatar Switcher */}
          <button
            onClick={onOpenTenantModal}
            className="w-[76px] py-1.5 px-1 rounded-[4px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-white text-white flex flex-col items-center justify-center transition-all duration-150 cursor-pointer group relative"
            title={`Active Tenant: ${currentTenant.name} (${plan.displayName}) — Click to Switch`}
          >
            <span className="text-xs font-bold leading-none">{currentTenant.logoInitial}</span>
            <span className="text-[9px] font-mono uppercase text-zinc-300 group-hover:text-white leading-none mt-1">
              {currentTenant.countryCode} · {currentTenant.slug.substring(0, 5).toUpperCase()}
            </span>
          </button>

          {/* Mode Switcher: Enterprise Suite (11 Portals) vs Customer Mode */}
          <div className="w-full pt-1.5 pb-1 border-t border-zinc-800 flex flex-col items-center gap-1.5">
            <button
              onClick={() => onSelectPortalMode('enterprise_suite')}
              className={`w-[76px] h-8 rounded-[3px] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-mono font-medium ${
                portalMode === 'enterprise_suite'
                  ? 'bg-zinc-800 text-white border-l-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Enterprise Multi-Architecture Suite (11 Portals)"
            >
              <Server className="w-3.5 h-3.5 shrink-0" />
              <span>SUITE</span>
            </button>

            <button
              onClick={() => onSelectPortalMode('customer_portal')}
              className={`w-[76px] h-8 rounded-[3px] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-mono font-medium ${
                portalMode === 'customer_portal'
                  ? 'bg-zinc-800 text-white border-l-2 border-white font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
              title="Customer Self-Service Portal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
              <span>CLIENT</span>
            </button>

            <button
              onClick={() => onSelectPortalMode('public_landing')}
              className={`w-[76px] h-8 rounded-[3px] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-mono font-medium ${
                portalMode === 'public_landing'
                  ? 'bg-emerald-950 text-emerald-400 border-l-2 border-emerald-400 font-bold'
                  : 'text-emerald-400/80 hover:text-emerald-300 hover:bg-zinc-900'
              }`}
              title="Enterprise Public Overview & Interactive Tour (Jasper.ai Style)"
            >
              <Globe className="w-3.5 h-3.5 shrink-0" />
              <span>SITE</span>
            </button>

            <button
              onClick={() => onSelectPortalMode('agnostic_os')}
              className={`w-[76px] h-8 rounded-[3px] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-mono font-medium ${
                portalMode === 'agnostic_os'
                  ? 'bg-emerald-900 text-emerald-300 border-l-2 border-emerald-400 font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-emerald-300 hover:bg-zinc-900'
              }`}
              title="Agnostic Communications OS (Carrier/SIP, FreeSWITCH, NCCO Flow Builder, AI Agent Studio)"
            >
              <Radio className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>OS</span>
            </button>

            <button
              onClick={() => onSelectPortalMode('mandela_os')}
              className={`w-[76px] h-8 rounded-[3px] flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] font-mono font-medium ${
                portalMode === 'mandela_os'
                  ? 'bg-amber-950 text-amber-300 border-l-2 border-amber-400 font-bold shadow-xs'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-zinc-900'
              }`}
              title="MANDELA OS Unified 30-Application Navigation & Workspace"
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>30 APPS</span>
            </button>
          </div>
        </div>

        {/* Middle: 11 Dedicated Architecture Portal Buttons */}
        <div className="w-full flex-1 overflow-y-auto px-1.5 py-2 space-y-1.5 scrollbar-thin scrollbar-thumb-zinc-800">
          {portalMode === 'enterprise_suite' ? (
            PORTAL_ARCHITECTURES.map((arch) => {
              const Icon = arch.icon;
              const isActive = activeEnterpriseProduct === arch.id;
              const isAllowed = isProductAllowed(arch.id);

              return (
                <div key={arch.id} className="relative group flex justify-center">
                  <button
                    onClick={() => {
                      onSelectEnterpriseProduct(arch.id);
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredPortalTop(rect.top + rect.height / 2);
                      setHoveredPortalId(arch.id);
                    }}
                    onMouseLeave={() => setHoveredPortalId(null)}
                    className={`w-[76px] min-h-[68px] py-2.5 px-1 rounded-[4px] flex flex-col items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer relative ${
                      isActive
                        ? 'bg-white text-black font-semibold shadow-lg ring-1 ring-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                  >
                    {/* Layer Number Badge */}
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[10px] font-mono font-bold leading-none px-1.5 py-0.5 rounded-[2px] ${
                          isActive ? 'bg-zinc-950 text-white' : 'bg-zinc-900 text-zinc-300 group-hover:bg-zinc-800 group-hover:text-white'
                        }`}
                      >
                        {arch.layerNumber}
                      </span>
                    </div>

                    {/* Architectural Icon */}
                    <Icon className="w-5 h-5 shrink-0" />

                    {/* Short Architecture Title */}
                    <span className="text-[11px] font-sans font-semibold tracking-tight truncate max-w-[72px] text-center leading-tight">
                      {arch.shortName}
                    </span>

                    {/* Subscription Gate indicator if locked */}
                    {!isAllowed && (
                      <div className="absolute top-1 right-1" title="Subscription tier upgrade required">
                        <Lock className={`w-3 h-3 ${isActive ? 'text-zinc-700' : 'text-amber-400'}`} />
                      </div>
                    )}

                    {/* Active Right Indicator Tick */}
                    {isActive && (
                      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-[2px]" />
                    )}
                  </button>

                  {/* Rich Discoverability Hover Tooltip for 11 Portals (Optimized for Compact & Standard Density Modes) */}
                  {hoveredPortalId === arch.id && (
                    <div
                      style={{ top: `${hoveredPortalTop}px`, transform: 'translateY(-50%)' }}
                      className="fixed left-[96px] z-50 pointer-events-none bg-zinc-950 text-white border border-zinc-700/90 p-3.5 rounded-[4px] shadow-2xl text-left min-w-[270px] max-w-[330px] animate-in fade-in zoom-in-95 duration-150"
                    >
                      {/* Left pointer arrow */}
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border-l border-b border-zinc-700/90 rotate-45" />

                      {/* Header line with Layer Badge and Operational Status */}
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2 mb-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="bg-white text-black font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-[2px] shrink-0">
                            PORTAL {arch.layerNumber}
                          </span>
                          <span className="text-zinc-500 text-xs shrink-0">·</span>
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-tight truncate">
                              {arch.statusText}
                            </span>
                          </div>
                        </div>
                        {isActive && (
                          <span className="text-[9px] font-mono bg-zinc-800 text-zinc-200 border border-zinc-700 px-1.5 py-0.5 rounded-[2px] font-bold shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Full System Name */}
                      <div className="text-sm font-bold text-white tracking-tight leading-snug">
                        {arch.fullName}
                      </div>

                      {/* Subtitle / Architectural Category */}
                      <div className="text-xs text-zinc-400 font-sans mt-0.5 leading-normal">
                        {arch.subtitle}
                      </div>

                      {/* Architecture Telemetry & Module Info */}
                      <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex flex-col gap-1 text-[11px] font-mono text-zinc-300">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-zinc-500 uppercase text-[10px]">Telemetry:</span>
                          <span className="text-zinc-200 font-semibold truncate text-right">
                            {arch.telemetrySummary}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-zinc-500 uppercase text-[10px]">Modules:</span>
                          <span className="text-zinc-400">
                            {arch.subTabs.length} Sub-modules available
                          </span>
                        </div>
                      </div>

                      {/* Action Prompt */}
                      <div className="mt-2 pt-1.5 border-t border-zinc-800/40 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>{isActive ? 'Currently viewing workspace' : 'Click to open Portal workspace'}</span>
                        <span className="text-zinc-400 font-semibold">⌘K Search</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Customer Mode Quick Links in Rail
            CUSTOMER_PORTAL_TABS.map((item) => {
              const Icon = item.icon;
              const isActive = activeCustomerTab === item.id;
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    onClick={() => onSelectCustomerTab(item.id)}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCustomerTop(rect.top + rect.height / 2);
                      setHoveredCustomerTab(item.id);
                    }}
                    onMouseLeave={() => setHoveredCustomerTab(null)}
                    className={`w-[76px] h-[54px] rounded-[4px] flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isActive ? 'bg-white text-black font-semibold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="text-[10px] font-sans font-medium tracking-tight truncate max-w-[70px]">
                      {item.label}
                    </span>
                  </button>

                  {/* Customer Tab Tooltip */}
                  {hoveredCustomerTab === item.id && (
                    <div
                      style={{ top: `${hoveredCustomerTop}px`, transform: 'translateY(-50%)' }}
                      className="fixed left-[96px] z-50 pointer-events-none bg-zinc-950 text-white border border-zinc-700/90 p-3 rounded-[4px] shadow-2xl text-left min-w-[220px] animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-950 border-l border-b border-zinc-700/90 rotate-45" />
                      <div className="text-[10px] font-mono uppercase text-zinc-400 font-bold">CUSTOMER WORKSPACE</div>
                      <div className="text-sm font-bold text-white mt-0.5">{item.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">Tenant: {currentTenant.name} ({plan.displayName})</div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom: Global Tools & Submenu Drawer Collapse Toggle */}
        <div className="w-full px-1.5 pt-2 border-t border-zinc-800 flex flex-col items-center gap-1.5">
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="w-[76px] h-8 rounded-[3px] text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Global Search & Command Palette (⌘K)"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
          )}

          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="w-[76px] h-8 rounded-[3px] text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Carrier & Enterprise Onboarding"
            >
              <Rocket className="w-4.5 h-4.5" />
            </button>
          )}

          {onOpenStressTest && (
            <button
              onClick={onOpenStressTest}
              className="w-[76px] h-8 rounded-[3px] text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Network Stress & Architecture Test"
            >
              <Activity className="w-4.5 h-4.5" />
            </button>
          )}

          {onOpenDesignSystem && (
            <button
              onClick={onOpenDesignSystem}
              className="w-[76px] h-8 rounded-[3px] text-zinc-400 hover:text-white hover:bg-zinc-900 flex items-center justify-center transition-colors cursor-pointer"
              title="Atelier Minimalist Design Specification"
            >
              <Palette className="w-4.5 h-4.5" />
            </button>
          )}

          {onOpenNmcpControlPlane && (
            <button
              onClick={onOpenNmcpControlPlane}
              className="w-[76px] h-8 rounded-[3px] bg-zinc-900 hover:bg-zinc-800 text-emerald-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-zinc-700 relative"
              title="Open NMCP AI Control Plane (Multi-Tenant Observability)"
            >
              <Radio className="w-4.5 h-4.5 animate-pulse" />
              <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            </button>
          )}

          {/* Drawer Toggle */}
          <button
            onClick={onToggleCollapse}
            className="w-[76px] h-8 rounded-[3px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer mt-1 text-[11px] font-mono font-medium"
            title={isCollapsed ? 'Expand Architecture Submenu Drawer' : 'Collapse Submenu Drawer'}
          >
            {isCollapsed ? (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>EXP</span>
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>HIDE</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* =========================================================================
          RAIL 2: DYNAMIC SUBMENU DRAWER (292px)
          Represents ONLY the active architecture product portal
          ========================================================================= */}
      {!isCollapsed && (
        <aside
          className="fixed top-0 left-[88px] z-40 h-screen w-[292px] bg-white border-r border-black/15 flex flex-col select-none text-black transition-all duration-300 ease-out shadow-xs"
          aria-label="Active Architecture Navigation"
        >
          {/* Drawer Header: Active Portal Architecture Details */}
          <div className="h-20 px-5 border-b border-black/15 flex items-center justify-between shrink-0 bg-zinc-50">
            {portalMode === 'enterprise_suite' ? (
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-black/60 font-semibold">
                  <span className="bg-black text-white px-2 py-0.5 rounded-[2px] font-bold text-xs">
                    {currentArchitecture.layerNumber}
                  </span>
                  <span className="truncate">PORTAL ARCHITECTURE</span>
                </div>
                <div className="text-base font-bold text-black truncate tracking-tight mt-1">
                  {currentArchitecture.fullName}
                </div>
              </div>
            ) : (
              <div className="min-w-0 pr-2">
                <div className="text-xs font-mono uppercase tracking-wider text-black/60 font-semibold">
                  CLIENT WORKSPACE
                </div>
                <div className="text-base font-bold text-black truncate tracking-tight mt-1">
                  Customer Portal
                </div>
              </div>
            )}

            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-[3px] text-black/40 hover:text-black hover:bg-black/5 transition-colors cursor-pointer shrink-0"
              title="Collapse Drawer"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Architecture Status Banner */}
          {portalMode === 'enterprise_suite' && (
            <div className="px-5 py-3 border-b border-black/10 bg-white">
              <div className="text-xs font-mono font-semibold text-black/80 flex items-center justify-between">
                <span className="truncate">{currentArchitecture.statusText}</span>
              </div>
              <div className="text-xs text-black/60 font-sans truncate mt-1">
                {currentArchitecture.subtitle}
              </div>
            </div>
          )}

          {/* Submenu Navigation Items strictly for this Architecture */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-4.5 space-y-2 sm:space-y-2.5">
            <div className="px-2 pb-2 text-xs sm:text-[13px] font-mono uppercase tracking-wider text-black/70 font-bold flex items-center justify-between">
              <span>{portalMode === 'enterprise_suite' ? 'Architecture Modules' : 'Customer Views'}</span>
              <span className="text-[11px] font-mono text-black/50 font-semibold">
                {portalMode === 'enterprise_suite' ? `${currentArchitecture.subTabs.length} items` : `${CUSTOMER_PORTAL_TABS.length} items`}
              </span>
            </div>

            {portalMode === 'enterprise_suite' ? (
              currentArchitecture.subTabs.map((item) => {
                const activeSubTab = getActiveSubTabForArchitecture(currentArchitecture.id);
                const isSelected = activeSubTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSubTab(currentArchitecture.id, item.id)}
                    className={`w-full text-left px-4 sm:px-4.5 py-3.5 sm:py-4 rounded-[4px] transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer min-h-[52px] sm:min-h-[56px] group ${
                      isSelected
                        ? 'bg-black text-white font-semibold shadow-sm'
                        : 'text-black/85 hover:bg-zinc-100 hover:text-black font-medium'
                    }`}
                  >
                    <span className="text-[15px] sm:text-base font-semibold tracking-tight truncate leading-snug">
                      {item.label}
                    </span>

                    {/* Critical/Attention Alert Badge if applicable */}
                    {item.badge ? (
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-[3px] shrink-0 font-bold ${
                          isSelected
                            ? 'bg-amber-400 text-black'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : isSelected ? (
                      <ArrowRight className="w-5 h-5 shrink-0 text-white group-hover:translate-x-0.5 transition-transform" />
                    ) : null}
                  </button>
                );
              })
            ) : (
              CUSTOMER_PORTAL_TABS.map((item) => {
                const isSelected = activeCustomerTab === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectCustomerTab(item.id)}
                    className={`w-full text-left px-4 sm:px-4.5 py-3.5 sm:py-4 rounded-[4px] transition-all duration-150 flex items-center gap-3.5 cursor-pointer min-h-[52px] sm:min-h-[56px] group ${
                      isSelected
                        ? 'bg-black text-white font-semibold shadow-sm'
                        : 'text-black/85 hover:bg-zinc-100 hover:text-black font-medium'
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0 text-current" />
                    <span className="text-[15px] sm:text-base font-semibold tracking-tight truncate leading-snug">
                      {item.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Architecture Telemetry & Tenant Profile Card */}
          <div className="p-4 border-t border-black/15 bg-zinc-50 shrink-0 space-y-2.5">
            {/* Real-time Architecture summary */}
            <div className="p-3 rounded-[3px] bg-white border border-black/10">
              <div className="text-xs font-mono uppercase tracking-wider text-black/60 font-bold flex items-center justify-between">
                <span>Architecture Telemetry</span>
                <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  PERSISTED
                </span>
              </div>
              <div className="text-xs sm:text-sm font-mono text-black font-semibold mt-1 truncate">
                {portalMode === 'enterprise_suite'
                  ? currentArchitecture.telemetrySummary
                  : `${currentTenant.name} (${plan.displayName})`}
              </div>
            </div>

            {/* Tenant Account Card */}
            <button
              onClick={onOpenTenantModal}
              className="w-full text-left p-3.5 sm:p-4 rounded-[4px] bg-white hover:bg-zinc-100 border border-black/15 hover:border-black transition-colors flex items-center justify-between gap-3 cursor-pointer group min-h-[56px] sm:min-h-[60px]"
              title="Switch Active Tenant Profile"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-[4px] bg-black text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-xs">
                  {currentTenant.logoInitial}
                </div>
                <div className="min-w-0">
                  <div className="text-[15px] sm:text-base font-bold text-black truncate group-hover:text-black leading-tight">
                    {currentTenant.name}
                  </div>
                  <div className="text-xs font-mono text-black/60 truncate mt-0.5">
                    {plan.displayName}
                  </div>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-mono text-black/60 group-hover:text-black shrink-0 font-semibold">
                Switch ▾
              </span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
};
