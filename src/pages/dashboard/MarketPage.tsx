import { useState, useCallback } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import TopBottom5 from '@/components/TopBottom5';
import { BarChart3 } from 'lucide-react';

const MarketPage = () => {
  useDocumentTitle('Market Analysis | Market Canvas AI');
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger] = useState(0);

  const handleTickerChange = useCallback((ticker: string) => {
    setSelectedTicker(ticker);
  }, []);

  return (
    <DashboardLayout 
      showSearch 
      showMarketOverview 
      onTickerChange={handleTickerChange}
      selectedTicker={selectedTicker}
      pageEyebrow="PSX Market"
      pageTitle="Market Analysis"
      pageSubtitle="Live heatmaps, technical signals, and fundamentals for every listed PSX ticker."
      pageIcon={BarChart3}
    >
      <div className="space-y-6">
        <div className="stagger-1">
          <TradingViewHeatmap />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="stagger-2">
            <TechnicalAnalysis ticker={selectedTicker} />
          </div>
          <div className="stagger-3">
            <FinancialAnalysis ticker={selectedTicker} />
          </div>
        </div>
        <div className="stagger-4">
          <TopBottom5 refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPage;
