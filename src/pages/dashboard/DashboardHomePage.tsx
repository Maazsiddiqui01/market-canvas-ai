import { useState, useCallback } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { OnboardingChecklist } from '@/components/dashboard/OnboardingChecklist';
import { AISearchHero } from '@/components/dashboard/AISearchHero';
import { QuickAccessTiles } from '@/components/dashboard/QuickAccessTiles';
import { MobileAnalysisTabs } from '@/components/dashboard/MobileAnalysisTabs';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TopBottom5 from '@/components/TopBottom5';

const DashboardHomePage = () => {
  useDocumentTitle('Market | Market Canvas AI');
  const [selectedTicker, setSelectedTicker] = useState('KSE100');

  const handleTickerChange = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
  }, []);

  return (
    <DashboardLayout showMarketOverview>
      <div className="space-y-6 md:space-y-8">
        <OnboardingChecklist />

        {/* Hero — n8n stock picker (default) + Ask AI tab */}
        <AISearchHero
          selectedTicker={selectedTicker}
          onTickerChange={handleTickerChange}
        />

        {/* PSX heatmap */}
        <section aria-label="PSX market heatmap" className="stagger-2">
          <TradingViewHeatmap />
        </section>

        {/* Technical + Financial for selected ticker */}
        <section aria-label="Technical and financial analysis" className="stagger-3">
          <MobileAnalysisTabs ticker={selectedTicker} />
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
