import { useCallback, useRef } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AISearchWidget, AISearchWidgetRef } from '@/components/ai/AISearchWidget';
import { StockComparison } from '@/components/ai/StockComparison';
import { RecentSearches } from '@/components/dashboard/RecentSearches';
import { Brain } from 'lucide-react';

const AIToolsPage = () => {
  useDocumentTitle('AI Tools | Market Canvas AI');
  const aiSearchRef = useRef<AISearchWidgetRef>(null);

  const handleRecentSearchClick = useCallback((ticker: string) => {
    aiSearchRef.current?.searchTicker(ticker);
  }, []);

  return (
    <DashboardLayout
      pageEyebrow="Research"
      pageTitle="AI Tools"
      pageSubtitle="Ask anything about PSX stocks, compare tickers side-by-side, and revisit recent research."
      pageIcon={Brain}
    >
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
