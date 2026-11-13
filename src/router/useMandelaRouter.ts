import { useState, useEffect, useCallback, useMemo } from 'react';
import { OperatingSystemTier, MandelaApplication, MandelaModule } from '../types/mandelaOS';
import { MANDELA_APPLICATIONS, getMandelaAppById } from '../config/mandelaAppsRegistry';

export interface MandelaRouteState {
  isLaunchpad: boolean;
  tier: OperatingSystemTier;
  appId: string;
  moduleId: string;
  subView?: string;
  recordId?: string;
}

export interface BreadcrumbItem {
  id: string;
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

export const useMandelaRouter = (initialAppId = 'e01_number_mgmt', initialModuleId = 'overview') => {
  // Parse initial route from window.location (hash or pathname)
  const parseCurrentLocation = useCallback((): MandelaRouteState => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '');
      const path = window.location.pathname.replace(/^\//, '');
      const raw = hash || path;

      // Check if user is navigating the 30-app directory launchpad
      if (raw === 'os/directory' || raw === 'directory' || raw === 'launchpad' || !raw) {
        return {
          isLaunchpad: true,
          tier: 'enterprise',
          appId: initialAppId,
          moduleId: initialModuleId
        };
      }

      // Expected format: os/:tier/:appId/:moduleId
      const segments = raw.split('/').filter(Boolean);
      if (segments[0] === 'os' && segments.length >= 3) {
        const tier = (segments[1] as OperatingSystemTier) || 'enterprise';
        const appId = segments[2];
        const moduleId = segments[3] || 'overview';
        return {
          isLaunchpad: false,
          tier,
          appId,
          moduleId,
          subView: segments[4],
          recordId: segments[5]
        };
      }

      // Fallback matching any known app ID
      const directApp = getMandelaAppById(segments[0]);
      if (directApp) {
        return {
          isLaunchpad: false,
          tier: directApp.tier,
          appId: directApp.id,
          moduleId: segments[1] || directApp.defaultModuleId
        };
      }
    } catch {
      // Fallback on error
    }

    return {
      isLaunchpad: true,
      tier: 'enterprise',
      appId: initialAppId,
      moduleId: initialModuleId
    };
  }, [initialAppId, initialModuleId]);

  const [routeState, setRouteState] = useState<MandelaRouteState>(parseCurrentLocation);

  // Sync state to URL hash & HTML5 history without triggering infinite loop
  const syncUrl = useCallback((state: MandelaRouteState) => {
    try {
      if (state.isLaunchpad) {
        const target = '#/os/directory';
        if (window.location.hash !== target) {
          window.history.pushState(null, '', target);
        }
      } else {
        const target = `#/os/${state.tier}/${state.appId}/${state.moduleId}${
          state.subView ? `/${state.subView}` : ''
        }`;
        if (window.location.hash !== target) {
          window.history.pushState(null, '', target);
        }
      }
    } catch {
      // Browser environment security restriction fallback
    }
  }, []);

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseCurrentLocation();
      setRouteState(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [parseCurrentLocation]);

  // Active Application object
  const activeApp: MandelaApplication = useMemo(() => {
    return (
      getMandelaAppById(routeState.appId) ||
      MANDELA_APPLICATIONS[0]
    );
  }, [routeState.appId]);

  // Active Module object
  const activeModule: MandelaModule = useMemo(() => {
    const found = activeApp.modules.find((m) => m.id === routeState.moduleId);
    return found || activeApp.modules[0];
  }, [activeApp, routeState.moduleId]);

  // Actions
  const openLaunchpad = useCallback(() => {
    setRouteState((prev) => {
      const next: MandelaRouteState = { ...prev, isLaunchpad: true };
      syncUrl(next);
      return next;
    });
  }, [syncUrl]);

  const openApp = useCallback(
    (appId: string, targetModuleId?: string, targetSubView?: string) => {
      const app = getMandelaAppById(appId);
      if (!app) return;

      const modId = targetModuleId || app.defaultModuleId;
      setRouteState(() => {
        const next: MandelaRouteState = {
          isLaunchpad: false,
          tier: app.tier,
          appId: app.id,
          moduleId: modId,
          subView: targetSubView
        };
        syncUrl(next);
        return next;
      });
    },
    [syncUrl]
  );

  const selectModule = useCallback(
    (moduleId: string, subView?: string) => {
      setRouteState((prev) => {
        const next: MandelaRouteState = {
          ...prev,
          isLaunchpad: false,
          moduleId,
          subView
        };
        syncUrl(next);
        return next;
      });
    },
    [syncUrl]
  );

  // Generate Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    const list: BreadcrumbItem[] = [
      {
        id: 'os_root',
        label: 'MANDELA OS',
        onClick: openLaunchpad
      }
    ];

    if (routeState.isLaunchpad) {
      list.push({
        id: 'launchpad',
        label: 'Application Directory (30 Apps)',
        isCurrent: true
      });
      return list;
    }

    list.push({
      id: 'tier',
      label: activeApp.tierLabel.split('·')[1]?.trim() || activeApp.tierLabel,
      onClick: openLaunchpad
    });

    list.push({
      id: 'app',
      label: activeApp.name,
      onClick: () => selectModule(activeApp.defaultModuleId)
    });

    if (activeModule) {
      list.push({
        id: 'module',
        label: activeModule.label,
        isCurrent: true
      });
    }

    return list;
  }, [routeState.isLaunchpad, activeApp, activeModule, openLaunchpad, selectModule]);

  return {
    isLaunchpad: routeState.isLaunchpad,
    tier: activeApp.tier,
    activeApp,
    activeModule,
    subView: routeState.subView,
    recordId: routeState.recordId,
    breadcrumbs,
    openLaunchpad,
    openApp,
    selectModule
  };
};
