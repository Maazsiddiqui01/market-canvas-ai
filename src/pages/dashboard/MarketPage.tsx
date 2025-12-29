import { useState, useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import TradingViewHeatmap from '@/components/TradingViewHeatmap';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import FinancialAnalysis from '@/components/FinancialAnalysis';
import TopBottom5 from '@/components/TopBottom5';

const MarketPage = () => {
  const [selectedTicker, setSelectedTicker] = useState('KSE100');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <DashboardLayout showSearch showMarketOverview>
      <div className="space-y-6">
        {/* Heatmap */}
        <div className="stagger-1">
          <TradingViewHeatmap />
        </div>

        {/* Technical and Financial Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="stagger-2">
            <TechnicalAnalysis ticker={selectedTicker} />
          </div>
          <div className="stagger-3">
            <FinancialAnalysis ticker={selectedTicker} />
          </div>
        </div>

        {/* Top/Bottom 5 */}
        <div className="stagger-4">
          <TopBottom5 refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarketPage;
