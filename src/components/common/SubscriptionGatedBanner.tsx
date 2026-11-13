import React from 'react';
import { ArrowUpRight, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { SubscriptionTier, TenantAccount } from '../../types/multiTenant';
import { SUBSCRIPTION_TIERS } from '../../data/mockMultiTenantData';
import { Card, Badge, Button } from '../../design-system';

interface SubscriptionGatedBannerProps {
  currentTenant: TenantAccount;
  requiredTier: SubscriptionTier;
  featureName: string;
  onUpgradeTier: (tier: SubscriptionTier) => void;
}

export const SubscriptionGatedBanner: React.FC<SubscriptionGatedBannerProps> = ({
  currentTenant,
  requiredTier,
  featureName,
  onUpgradeTier
}) => {
  const reqPlan = SUBSCRIPTION_TIERS[requiredTier];
  const curPlan = currentTenant.subscription;

  return (
    <Card variant="elevated" className="p-6 sm:p-8 space-y-6 bg-white border border-black rounded-[2px]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[2px] bg-zinc-100 border border-black/20 flex items-center justify-center text-black shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-black tracking-tight">
                {featureName} is Restricted for {curPlan.displayName}
              </h2>
              <Badge variant="neutral">Tier Locked</Badge>
            </div>
            <p className="text-xs text-black/60 mt-1">
              {currentTenant.name} is currently subscribed to{' '}
              <strong className="text-black">{curPlan.displayName}</strong> (${curPlan.monthlyFeeUsd.toLocaleString()}/mo).
              This capability requires{' '}
              <strong className="text-black underline">{reqPlan.displayName}</strong>.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onUpgradeTier(requiredTier)}
          icon={<Sparkles className="w-4 h-4" />}
          className="whitespace-nowrap shrink-0"
        >
          <span>Upgrade to {reqPlan.displayName} (${reqPlan.monthlyFeeUsd.toLocaleString()}/mo)</span>
          <ArrowUpRight className="w-4 h-4 ml-0.5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="default" className="p-4 space-y-3 bg-zinc-50 border border-black/15">
          <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-black/60 font-semibold block">
            Architectural Gating Policy
          </span>
          <p className="text-xs text-black/70 leading-relaxed">
            Carrier edge routing, anycast BGP AS37105 sessions, and direct SS7/SMPP peering require dedicated sovereign cloud tenancy keys.
          </p>
          <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs text-black/60 font-mono">
            <span>Current Tenant Isolation:</span>
            <span className="text-black font-semibold">{currentTenant.dataIsolationMode}</span>
          </div>
        </Card>

        <Card variant="default" className="p-4 space-y-3 bg-zinc-50 border border-black/15">
          <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-black/60 font-semibold block">
            Included in {reqPlan.displayName}
          </span>
          <ul className="space-y-1.5 text-xs text-black/80">
            {reqPlan.features.slice(0, 4).map((feat, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Card>
  );
};
