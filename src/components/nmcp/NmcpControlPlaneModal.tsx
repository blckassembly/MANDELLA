import React from 'react';
import { NmcpControlPlaneView } from './NmcpControlPlaneView';
import { TenantAccount, EnterpriseProduct } from '../../types/multiTenant';

interface NmcpControlPlaneModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenants: TenantAccount[];
  currentTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  onNavigateToPortal?: (product: EnterpriseProduct) => void;
}

export const NmcpControlPlaneModal: React.FC<NmcpControlPlaneModalProps> = ({
  isOpen,
  onClose,
  tenants,
  currentTenantId,
  onSelectTenant,
  onNavigateToPortal
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-xs select-none">
      <div
        className="w-full max-w-6xl h-[92vh] max-h-[920px] bg-white rounded-[2px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <NmcpControlPlaneView
          tenants={tenants}
          currentTenantId={currentTenantId}
          onSelectTenant={onSelectTenant}
          onNavigateToPortal={(prod) => {
            if (onNavigateToPortal) onNavigateToPortal(prod);
            onClose();
          }}
          onClose={onClose}
          className="h-full border-none shadow-none"
        />
      </div>
    </div>
  );
};
