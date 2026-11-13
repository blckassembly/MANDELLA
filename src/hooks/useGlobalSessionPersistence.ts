import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PortalMode,
  EnterpriseProduct,
  CustomerProduct,
  InterconnectTab,
  SatelliteTab,
  EdgeDefenseTab,
  SiemFabricTab,
  AiAnomalyTab,
  SocC2Tab
} from '../types/multiTenant';
import {
  DataverseTab,
  System1Tab,
  System2Tab,
  System3Tab,
  System4Tab
} from '../components/Header';

export const GLOBAL_SESSION_STORAGE_KEY = 'mandela_global_portal_session_v2';

export interface PortalSubTabMap {
  interconnect: InterconnectTab; // Layer 01
  satellite_ntn: SatelliteTab; // Layer 02
  sbc_core: System4Tab; // Layer 03
  voice_ivr: System3Tab; // Layer 04
  messaging_sms: System2Tab; // Layer 05
  nms_numbers: System1Tab; // Layer 06
  dataverse: DataverseTab; // Layer 07
  edge_defense: EdgeDefenseTab; // Layer 08
  siem_fabric: SiemFabricTab; // Layer 09
  ai_anomaly_voice: AiAnomalyTab; // Layer 10
  soc_c2: SocC2Tab; // Layer 11
}

export interface GlobalSessionState {
  version: number;
  portalMode: PortalMode;
  activeEnterpriseProduct: EnterpriseProduct;
  activeCustomerTab: CustomerProduct;
  currentTenantId: string;
  isSidebarCollapsed: boolean;
  subTabs: PortalSubTabMap;
  lastUpdated: string;
}

export const DEFAULT_PORTAL_SUB_TABS: PortalSubTabMap = {
  interconnect: 'rate_decks',
  satellite_ntn: 'teleport_ground',
  sbc_core: 'sbc_noc',
  voice_ivr: 'voice_noc',
  messaging_sms: 'noc_dashboard',
  nms_numbers: 'command_control',
  dataverse: 'overview',
  edge_defense: 'signaling_firewall',
  siem_fabric: 'connectors_matrix',
  ai_anomaly_voice: 'phone_velocity',
  soc_c2: 'threat_matrix'
};

export const DEFAULT_SESSION_STATE: GlobalSessionState = {
  version: 2,
  portalMode: 'mandela_os',
  activeEnterpriseProduct: 'nms_numbers', // Default to Sovereign NMS (Layer 06)
  activeCustomerTab: 'overview',
  currentTenantId: 'tenant-ke-safaricom-01',
  isSidebarCollapsed: false,
  subTabs: DEFAULT_PORTAL_SUB_TABS,
  lastUpdated: new Date().toISOString()
};

/**
 * Safely loads the persisted session state from localStorage.
 */
function loadPersistedSession(): GlobalSessionState {
  if (typeof window === 'undefined') {
    return DEFAULT_SESSION_STATE;
  }

  try {
    const raw = localStorage.getItem(GLOBAL_SESSION_STORAGE_KEY);
    if (!raw) return DEFAULT_SESSION_STATE;

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return DEFAULT_SESSION_STATE;

    return {
      version: parsed.version || 1,
      portalMode:
        parsed.portalMode === 'enterprise_suite' ||
        parsed.portalMode === 'customer_portal' ||
        parsed.portalMode === 'public_landing' ||
        parsed.portalMode === 'agnostic_os' ||
        parsed.portalMode === 'mandela_os'
          ? parsed.portalMode
          : 'mandela_os',
      activeEnterpriseProduct: parsed.activeEnterpriseProduct || DEFAULT_SESSION_STATE.activeEnterpriseProduct,
      activeCustomerTab: parsed.activeCustomerTab || DEFAULT_SESSION_STATE.activeCustomerTab,
      currentTenantId: parsed.currentTenantId || DEFAULT_SESSION_STATE.currentTenantId,
      isSidebarCollapsed: Boolean(parsed.isSidebarCollapsed),
      subTabs: {
        ...DEFAULT_PORTAL_SUB_TABS,
        ...(parsed.subTabs || {})
      },
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch (err) {
    console.warn('[GlobalSessionPersistence] Failed to parse localStorage state; falling back to default:', err);
    return DEFAULT_SESSION_STATE;
  }
}

/**
 * Safely writes the session state to localStorage.
 */
function persistSession(state: GlobalSessionState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(GLOBAL_SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[GlobalSessionPersistence] Failed to save session to localStorage:', err);
  }
}

/**
 * Global Session Persistence Hook
 * Saves and restores active portal & sub-tab states across all 11 system layers.
 */
export function useGlobalSessionPersistence() {
  // Load initially persisted state synchronously to prevent UI flash
  const [session, setSession] = useState<GlobalSessionState>(loadPersistedSession);
  const saveTimeoutRef = useRef<number | null>(null);

  // Debounced auto-save to localStorage whenever session state changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      persistSession(session);
    }, 100);

    // Synchronous save on page unload/navigation to avoid losing sub-tab changes
    const handleBeforeUnload = () => {
      persistSession(session);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cross-tab synchronization via storage event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === GLOBAL_SESSION_STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (updated && typeof updated === 'object') {
            setSession((prev) => ({
              ...prev,
              ...updated,
              subTabs: {
                ...DEFAULT_PORTAL_SUB_TABS,
                ...(updated.subTabs || {})
              }
            }));
          }
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [session]);

  // Update top-level portal mode
  const setPortalMode = useCallback((mode: PortalMode) => {
    setSession((prev) => ({
      ...prev,
      portalMode: mode,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Update active enterprise product portal (Layer 01 through 11)
  const setActiveEnterpriseProduct = useCallback((product: EnterpriseProduct) => {
    setSession((prev) => ({
      ...prev,
      activeEnterpriseProduct: product,
      portalMode: 'enterprise_suite',
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Update active customer tab
  const setActiveCustomerTab = useCallback((tab: CustomerProduct) => {
    setSession((prev) => ({
      ...prev,
      activeCustomerTab: tab,
      portalMode: 'customer_portal',
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Update active tenant
  const setCurrentTenantId = useCallback((tenantId: string) => {
    setSession((prev) => ({
      ...prev,
      currentTenantId: tenantId,
      lastUpdated: new Date().toISOString()
    }));
  }, []);

  // Update sidebar collapsed state
  const setIsSidebarCollapsed = useCallback((collapsed: boolean | ((prev: boolean) => boolean)) => {
    setSession((prev) => {
      const nextVal = typeof collapsed === 'function' ? collapsed(prev.isSidebarCollapsed) : collapsed;
      return {
        ...prev,
        isSidebarCollapsed: nextVal,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);

  // Set subtab for any given portal dynamically
  const setSubTabForPortal = useCallback(
    <P extends EnterpriseProduct>(portal: P, subTab: PortalSubTabMap[P]) => {
      setSession((prev) => ({
        ...prev,
        subTabs: {
          ...prev.subTabs,
          [portal]: subTab
        },
        lastUpdated: new Date().toISOString()
      }));
    },
    []
  );

  // Dedicated setters for all 11 system layers
  const setInterconnectTab = useCallback((tab: InterconnectTab) => {
    setSubTabForPortal('interconnect', tab);
  }, [setSubTabForPortal]);

  const setSatelliteTab = useCallback((tab: SatelliteTab) => {
    setSubTabForPortal('satellite_ntn', tab);
  }, [setSubTabForPortal]);

  const setSystem4Tab = useCallback((tab: System4Tab) => {
    setSubTabForPortal('sbc_core', tab);
  }, [setSubTabForPortal]);

  const setSystem3Tab = useCallback((tab: System3Tab) => {
    setSubTabForPortal('voice_ivr', tab);
  }, [setSubTabForPortal]);

  const setSystem2Tab = useCallback((tab: System2Tab) => {
    setSubTabForPortal('messaging_sms', tab);
  }, [setSubTabForPortal]);

  const setSystem1Tab = useCallback((tab: System1Tab) => {
    setSubTabForPortal('nms_numbers', tab);
  }, [setSubTabForPortal]);

  const setDataverseTab = useCallback((tab: DataverseTab) => {
    setSubTabForPortal('dataverse', tab);
  }, [setSubTabForPortal]);

  const setEdgeDefenseTab = useCallback((tab: EdgeDefenseTab) => {
    setSubTabForPortal('edge_defense', tab);
  }, [setSubTabForPortal]);

  const setSiemFabricTab = useCallback((tab: SiemFabricTab) => {
    setSubTabForPortal('siem_fabric', tab);
  }, [setSubTabForPortal]);

  const setAiAnomalyTab = useCallback((tab: AiAnomalyTab) => {
    setSubTabForPortal('ai_anomaly_voice', tab);
  }, [setSubTabForPortal]);

  const setSocC2Tab = useCallback((tab: SocC2Tab) => {
    setSubTabForPortal('soc_c2', tab);
  }, [setSubTabForPortal]);

  // Reset persistence to factory defaults
  const resetSessionPersistence = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(GLOBAL_SESSION_STORAGE_KEY);
      } catch (e) {
        console.warn(e);
      }
    }
    setSession({
      ...DEFAULT_SESSION_STATE,
      lastUpdated: new Date().toISOString()
    });
  }, []);

  return {
    // Current Global Session States
    portalMode: session.portalMode,
    setPortalMode,
    activeEnterpriseProduct: session.activeEnterpriseProduct,
    setActiveEnterpriseProduct,
    activeCustomerTab: session.activeCustomerTab,
    setActiveCustomerTab,
    currentTenantId: session.currentTenantId,
    setCurrentTenantId,
    isSidebarCollapsed: session.isSidebarCollapsed,
    setIsSidebarCollapsed,

    // All 11 Portal Sub-Tab States
    interconnectTab: session.subTabs.interconnect,
    setInterconnectTab,
    satelliteTab: session.subTabs.satellite_ntn,
    setSatelliteTab,
    system4Tab: session.subTabs.sbc_core,
    setSystem4Tab,
    system3Tab: session.subTabs.voice_ivr,
    setSystem3Tab,
    system2Tab: session.subTabs.messaging_sms,
    setSystem2Tab,
    system1Tab: session.subTabs.nms_numbers,
    setSystem1Tab,
    dataverseTab: session.subTabs.dataverse,
    setDataverseTab,
    edgeDefenseTab: session.subTabs.edge_defense,
    setEdgeDefenseTab,
    siemFabricTab: session.subTabs.siem_fabric,
    setSiemFabricTab,
    aiAnomalyTab: session.subTabs.ai_anomaly_voice,
    setAiAnomalyTab,
    socC2Tab: session.subTabs.soc_c2,
    setSocC2Tab,

    // Helpers
    subTabsMap: session.subTabs,
    setSubTabForPortal,
    resetSessionPersistence,
    sessionLastUpdated: session.lastUpdated
  };
}
