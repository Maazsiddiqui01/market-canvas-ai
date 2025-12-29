import { useCallback, useRef } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AISearchWidget, AISearchWidgetRef } from '@/components/ai/AISearchWidget';
import { StockComparison } from '@/components/ai/StockComparison';
import { RecentSearches } from '@/components/dashboard/RecentSearches';

const AIToolsPage = () => {
  const aiSearchRef = useRef<AISearchWidgetRef>(null);

  const handleRecentSearchClick = useCallback((ticker: string) => {
    aiSearchRef.current?.searchTicker(ticker);
  }, []);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="stagger-1">
            <AISearchWidget ref={aiSearchRef} />
          </div>
          <div className="stagger-2">
            <StockComparison />
          </div>
        </div>
        <div className="stagger-3">
          <RecentSearches onSearchClick={handleRecentSearchClick} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIToolsPage;
