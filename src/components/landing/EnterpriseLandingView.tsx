import React from 'react';
import { LandingTopNav } from './LandingTopNav';
import { LandingHero } from './LandingHero';
import { TrustedCarriersMarquee } from './TrustedCarriersMarquee';
import { InteractiveProductTour } from './InteractiveProductTour';
import { RoiCalculatorSection } from './RoiCalculatorSection';
import { SolutionsByIndustry } from './SolutionsByIndustry';
import { ComparisonMatrix } from './ComparisonMatrix';
import { CaseStudyShowcase } from './CaseStudyShowcase';
import { EnterpriseFaqSection } from './EnterpriseFaqSection';
import { LandingFooter } from './LandingFooter';
import { PortalMode, EnterpriseProduct } from '../../types/multiTenant';

interface EnterpriseLandingViewProps {
  onLaunchConsole: (mode?: PortalMode) => void;
  onOpenCustomerPortal?: () => void;
  onOpenStressTest?: () => void;
  onNavigateProduct?: (product: EnterpriseProduct) => void;
}

export const EnterpriseLandingView: React.FC<EnterpriseLandingViewProps> = ({
  onLaunchConsole,
  onOpenCustomerPortal,
  onOpenStressTest,
  onNavigateProduct
}) => {
  const handleLaunchProduct = (product: EnterpriseProduct) => {
    if (onNavigateProduct) {
      onNavigateProduct(product);
    }
    onLaunchConsole('enterprise_suite');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Compliant 3-Zone Top Bar Navigation */}
      <LandingTopNav
        onLaunchConsole={onLaunchConsole}
        onOpenStressTest={onOpenStressTest}
      />

      {/* 2. Hero Section with Oversized Display Typography & Embedded Live Sandbox */}
      <LandingHero
        onLaunchConsole={onLaunchConsole}
        onOpenTour={() => {
          const el = document.getElementById('tour');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Direct Tier-1 Carrier & Banking Partner Logos */}
      <TrustedCarriersMarquee />

      {/* 4. Interactive 6-Pillar Architecture Studio Tour */}
      <InteractiveProductTour
        onLaunchPillarConsole={handleLaunchProduct}
      />

      {/* 5. Enterprise ROI & TCO Value Arbitrage Calculator */}
      <RoiCalculatorSection
        onLaunchConsole={onLaunchConsole}
      />

      {/* 6. Deep Solutions by Industry (MNO, Fintech, Mining, Defense) */}
      <SolutionsByIndustry
        onLaunchConsole={onLaunchConsole}
      />

      {/* 7. Comprehensive Benchmark Matrix vs Twilio/Infobip & On-Premises Appliances */}
      <ComparisonMatrix
        onLaunchConsole={onLaunchConsole}
      />

      {/* 8. Quantified Enterprise Case Studies */}
      <CaseStudyShowcase
        onLaunchConsole={onLaunchConsole}
      />

      {/* 9. Technical Specifications & Compliance FAQ Accordion */}
      <EnterpriseFaqSection />

      {/* 10. Multi-Column Enterprise Footer */}
      <LandingFooter
        onLaunchConsole={onLaunchConsole}
      />
    </div>
  );
};
