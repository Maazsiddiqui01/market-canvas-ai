import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { AISearchHero } from '@/components/dashboard/AISearchHero';
import { QuickAccessTiles } from '@/components/dashboard/QuickAccessTiles';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import TopBottom5 from '@/components/TopBottom5';

const DashboardHomePage = () => {
  useDocumentTitle('Dashboard | Market Canvas AI');

  return (
    <DashboardLayout showMarketOverview>
      <div className="space-y-8">
        {/* Onboarding for new users only */}
        <OnboardingChecklist />

        {/* Hero — AI search is the centerpiece */}
        <AISearchHero />

        {/* Market context: TradingView heatmap */}
        <section aria-label="PSX market heatmap" className="stagger-2">
          <TradingViewHeatmap />
        </section>

        {/* Technical + Financial side-by-side */}
        <section
          aria-label="Technical and financial analysis"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-3"
        >
          <TechnicalAnalysis ticker="KSE100" />
          <FinancialAnalysis ticker="KSE100" />
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
