import React, { useState } from 'react';
import { useMandelaRouter } from '../../router/useMandelaRouter';
import { TenantAccount } from '../../types/multiTenant';
import { AppHeader } from './AppHeader';
import { AppSidebar } from './AppSidebar';
import { AppWorkspace } from './AppWorkspace';
import { AppDirectoryLaunchpad } from './AppDirectoryLaunchpad';

export interface MandelaAppShellProps {
  currentTenant: TenantAccount;
  onOpenTenantModal?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenSoftphone?: (number?: string) => void;
  onOpenOnboarding?: () => void;
  initialAppId?: string;
  initialModuleId?: string;
}

export const MandelaAppShell: React.FC<MandelaAppShellProps> = ({
  currentTenant,
  onOpenTenantModal,
  onOpenCommandPalette,
  onOpenSoftphone,
  onOpenOnboarding,
  initialAppId = 'e01_number_mgmt',
  initialModuleId = 'overview'
}) => {
  const router = useMandelaRouter(initialAppId, initialModuleId);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-900 font-sans select-none text-zinc-100">
      {/* 1. Universal Top Header (56px) */}
      <AppHeader
        breadcrumbs={router.breadcrumbs}
        currentTenant={currentTenant}
        onOpenTenantModal={onOpenTenantModal}
        onOpenCommandPalette={onOpenCommandPalette}
        onOpenSoftphone={() => onOpenSoftphone && onOpenSoftphone()}
        onOpenLaunchpad={router.openLaunchpad}
        onOpenOnboarding={onOpenOnboarding}
      />

      {/* 2. Main Operating System Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {router.isLaunchpad ? (
          /* Global 30-Application Directory Launchpad */
          <AppDirectoryLaunchpad
            onOpenApp={(appId, moduleId) => router.openApp(appId, moduleId)}
          />
        ) : (
          /* Application Workspace with Left Persistent Navigation Portal */
          <>
            <AppSidebar
              application={router.activeApp}
              activeModuleId={router.activeModule.id}
              onSelectModule={(moduleId) => router.selectModule(moduleId)}
              onReturnToLaunchpad={router.openLaunchpad}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

            <main className="flex-1 overflow-hidden flex flex-col bg-neutral-50 relative min-w-0">
              <AppWorkspace
                application={router.activeApp}
                module={router.activeModule}
                currentTenant={currentTenant}
                onOpenSoftphone={onOpenSoftphone}
                onOpenOnboarding={onOpenOnboarding}
                onSelectSubView={(subView) => router.selectModule(router.activeModule.id, subView)}
              />
            </main>
          </>
        )}
      </div>
    </div>
  );
};
