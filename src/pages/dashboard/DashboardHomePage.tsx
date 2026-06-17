import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useSelectedTicker } from '@/contexts/SelectedTickerContext';
import { useAuth } from '@/contexts/AuthContext';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { AISearchHero } from '@/components/dashboard/AISearchHero';
import { QuickAccessTiles } from '@/components/dashboard/QuickAccessTiles';
import { MobileAnalysisTabs } from '@/components/dashboard/MobileAnalysisTabs';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TopBottom5 from '@/components/TopBottom5';

const DashboardHomePage = () => {
  useDocumentTitle('Market | Market Canvas AI');
  const { selectedTicker, setSelectedTicker } = useSelectedTicker();
  const { user } = useAuth();

  return (
    <DashboardLayout showMarketOverview allowAnonymous>
      <div className="space-y-6 md:space-y-8">
        {user && <OnboardingChecklist />}

        {/* Hero — n8n stock picker (default) + Ask AI tab */}
        <AISearchHero
          selectedTicker={selectedTicker}
          onTickerChange={setSelectedTicker}
        />

        {/* PSX heatmap */}
        <section aria-label="PSX market heatmap" className="stagger-2">
          <TradingViewHeatmap />
        </section>

        {/* Technical + Financial for selected ticker (logged-in only) */}
        {user && (
          <section aria-label="Technical and financial analysis" className="stagger-3">
            <MobileAnalysisTabs ticker={selectedTicker} />
          </section>
        )}

        {/* Top movers */}
        <section aria-label="Top movers" className="stagger-4">
          <TopBottom5 refreshTrigger={0} />
        </section>

        {/* Compact access to everything else (logged-in only) */}
        {user && (
          <section aria-label="More sections" className="pt-2">
            <QuickAccessTiles />
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
