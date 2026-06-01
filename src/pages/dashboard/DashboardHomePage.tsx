import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { AISearchHero } from '@/components/dashboard/AISearchHero';
import { QuickAccessTiles } from '@/components/dashboard/QuickAccessTiles';
import { MobileAnalysisTabs } from '@/components/dashboard/MobileAnalysisTabs';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TopBottom5 from '@/components/TopBottom5';

const DashboardHomePage = () => {
  useDocumentTitle('Dashboard | Market Canvas AI');

  return (
    <DashboardLayout showMarketOverview>
      <div className="space-y-6 md:space-y-8">
        {/* Onboarding for new users only */}
        <OnboardingChecklist />

        {/* Hero — AI search is the centerpiece */}
        <AISearchHero />

        {/* Market context: TradingView heatmap */}
        <section aria-label="PSX market heatmap" className="stagger-2">
          <TradingViewHeatmap />
        </section>

        {/* Technical + Financial — tabs on mobile, side-by-side on desktop */}
        <section aria-label="Technical and financial analysis" className="stagger-3">
          <MobileAnalysisTabs ticker="KSE100" />
        </section>

        {/* Top movers */}
        <section aria-label="Top movers" className="stagger-4">
          <TopBottom5 refreshTrigger={0} />
        </section>

        {/* Compact access to everything else */}
        <section aria-label="More sections" className="pt-2">
          <QuickAccessTiles />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;

