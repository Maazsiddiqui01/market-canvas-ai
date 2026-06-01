import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';
import { Eye } from 'lucide-react';

const WatchlistPage = () => {
  useDocumentTitle('Watchlist | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Saved tickers"
      pageTitle="Watchlist"
      pageSubtitle="Monitor the stocks you care about with live prices and quick research."
      pageIcon={Eye}
    >
      <WatchlistManager />
    </DashboardLayout>
  );
};

export default WatchlistPage;
