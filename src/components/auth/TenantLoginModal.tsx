import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Sparkles
} from 'lucide-react';
import { TenantAccount, SubscriptionTier } from '../../types/multiTenant';
import { SUBSCRIPTION_TIERS } from '../../data/mockMultiTenantData';
import {
  ModalShell,
  Card,
  Badge,
  Button,
  Input,
  Select,
  Tabs
} from '../../design-system';

interface TenantLoginModalProps {
  tenants: TenantAccount[];
  currentTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  onCreateTenant: (newTenant: TenantAccount) => void;
  onClose: () => void;
}

export const TenantLoginModal: React.FC<TenantLoginModalProps> = ({
  tenants,
  currentTenantId,
  onSelectTenant,
  onCreateTenant,
  onClose
}) => {
  const [mode, setMode] = useState<'switch' | 'create'>('switch');
  const [newOrgName, setNewOrgName] = useState('');
  const [newCountry, setNewCountry] = useState('Kenya');
  const [newIndustry, setNewIndustry] = useState('Fintech & Mobile Money');
  const [newEmail, setNewEmail] = useState('');
  const [selectedPlanTier, setSelectedPlanTier] = useState<SubscriptionTier>('fintech_enterprise');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    const slug = newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const plan = SUBSCRIPTION_TIERS[selectedPlanTier];

    const newAccount: TenantAccount = {
      id: `tenant-${slug}-${Date.now().toString().slice(-4)}`,
      name: newOrgName.trim(),
      slug,
      country: newCountry,
      countryCode:
        newCountry === 'Kenya'
          ? 'KE'
          : newCountry === 'Nigeria'
          ? 'NG'
          : newCountry === 'Ghana'
          ? 'GH'
          : 'ZA',
      region: `${newCountry} Regional Edge`,
      industry: newIndustry,
      domain: `${slug}.mandela.africa`,
      logoInitial: newOrgName.trim().charAt(0).toUpperCase(),
      accentColor: 'text-black bg-zinc-100 border-black/20',
      subscription: plan,
      status: 'active',
      dataIsolationMode:
        selectedPlanTier === 'sovereign_telco' || selectedPlanTier === 'fintech_enterprise'
          ? 'dedicated_keyspace'
          : 'logical_schema',
      encryptionKeyAlias: `kms/tenant/${slug}-master`,
      apiKey: `mandela_live_${slug}_${Math.random().toString(36).substring(2, 12)}`,
      registeredAdminEmail: newEmail || `admin@${slug}.com`,
      createdAt: new Date().toISOString().split('T')[0],
      usage: {
        smsDeliveredThisMonth: 0,
        voiceMinutesThisMonth: 0,
        activeDids: 1,
        dataverseRecordsTotal: 0,
        dataverseStorageMb: 0,
        currentMonthSpendUsd: plan.monthlyFeeUsd,
        accountBalanceUsd: 5000.0
      }
    };

    onCreateTenant(newAccount);
    onSelectTenant(newAccount.id);
    onClose();
  };

  return (
    <ModalShell
      isOpen={true}
      onClose={onClose}
      title="Multi-Tenant Identity & Access"
      subtitle="Switch organizational context or onboard an enterprise tenant"
      icon={<Building2 className="w-5 h-5 text-black" />}
      badge={<Badge variant="live">Atelier RBAC</Badge>}
      maxWidth="3xl"
    >
      {/* Mode Switcher Tabs */}
      <Tabs
        tabs={[
          {
            id: 'switch',
            label: `Active Tenants (${tenants.length})`,
            icon: <Building2 className="w-3.5 h-3.5" />
          },
          {
            id: 'create',
            label: 'Onboard New Tenant',
            icon: <Plus className="w-3.5 h-3.5" />
          }
        ]}
        activeId={mode}
        onChange={(id) => setMode(id as 'switch' | 'create')}
      />

      {mode === 'switch' ? (
        <div className="space-y-3 pt-2">
          <p className="text-xs text-black/60 font-sans">
            Select an organization below to authenticate. Features adapt to their active subscription tier.
          </p>

          <div className="space-y-2.5">
            {tenants.map((t) => {
              const isCurrent = t.id === currentTenantId;
              const tier = t.subscription;

              return (
                <Card
                  key={t.id}
                  variant={isCurrent ? 'elevated' : 'interactive'}
                  onClick={() => {
                    onSelectTenant(t.id);
                    onClose();
                  }}
                  className={`p-4 flex items-center justify-between gap-4 transition-all duration-300 ease-out bg-white ${
                    isCurrent ? 'border-2 border-black bg-zinc-50/50' : 'border border-black/15'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-[2px] bg-black text-white flex items-center justify-center font-bold text-sm shrink-0"
                    >
                      {t.logoInitial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-black truncate">
                          {t.name}
                        </span>
                        {isCurrent && (
                          <Badge variant="live" dot>Current</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-black/60 font-sans">
                        <span>{t.country}</span>
                        <span>·</span>
                        <span>{t.industry}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] font-sans">
                        <span className="px-1.5 py-0.2 rounded-[2px] bg-zinc-100 text-black border border-black/10 font-medium">
                          {tier.displayName}
                        </span>
                        <span className="text-black/50">
                          ${tier.monthlyFeeUsd.toLocaleString()}/mo
                        </span>
                        <span className="text-black/30">·</span>
                        <span className="text-black/50 font-mono text-[10px]">
                          {t.dataIsolationMode === 'dedicated_keyspace'
                            ? 'Dedicated HSM'
                            : 'Logical Isolation'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <Button
                      variant={isCurrent ? 'primary' : 'secondary'}
                      size="sm"
                    >
                      {isCurrent ? 'Active' : 'Switch'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
          <Input
            label="Organization / Company Name"
            required
            placeholder="e.g. Stanbic Bank Uganda, Flutterwave Group"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Primary Country"
              value={newCountry}
              onChange={(e) => setNewCountry(e.target.value)}
              options={[
                { value: 'Kenya', label: 'Kenya (+254)' },
                { value: 'Nigeria', label: 'Nigeria (+234)' },
                { value: 'Ghana', label: 'Ghana (+233)' },
                { value: 'South Africa', label: 'South Africa (+27)' },
                { value: 'Tanzania', label: 'Tanzania (+255)' },
                { value: 'Rwanda', label: 'Rwanda (+250)' },
                { value: 'Uganda', label: 'Uganda (+256)' }
              ]}
            />

            <Input
              label="Industry Vertical"
              value={newIndustry}
              onChange={(e) => setNewIndustry(e.target.value)}
              placeholder="e.g. Fintech, Telecom, Banking"
            />
          </div>

          <Input
            label="Technical Contact / Admin Email"
            type="email"
            placeholder="admin@enterprise.africa"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />

          <div className="space-y-2 pt-2">
            <label className="text-[10px] uppercase tracking-[0.18em] font-semibold text-black/70 block">
              Subscription Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(SUBSCRIPTION_TIERS) as SubscriptionTier[])
                .filter((tier) => tier !== 'root_admin')
                .map((tierKey) => {
                  const plan = SUBSCRIPTION_TIERS[tierKey];
                  const isSelected = selectedPlanTier === tierKey;

                  return (
                    <Card
                      key={tierKey}
                      variant="default"
                      onClick={() => setSelectedPlanTier(tierKey)}
                      className={`p-3 transition-all duration-300 ease-out cursor-pointer bg-white ${
                        isSelected ? 'border-2 border-black bg-zinc-50' : 'border border-black/15 hover:border-black/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-black">{plan.displayName}</span>
                        <span className="text-xs font-mono text-black font-semibold">
                          ${plan.monthlyFeeUsd.toLocaleString()}/mo
                        </span>
                      </div>
                      <p className="text-[11px] text-black/60 mt-1 line-clamp-2 leading-relaxed">
                        {plan.features[0]} · {plan.features[1]}
                      </p>
                    </Card>
                  );
                })}
            </div>
          </div>

          <div className="pt-4 border-t border-black/15 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMode('switch')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
            >
              Provision Tenant &amp; Initialize Isolation
            </Button>
          </div>
        </form>
      )}
    </ModalShell>
  );
};
