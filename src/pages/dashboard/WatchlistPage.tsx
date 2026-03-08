import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';

const WatchlistPage = () => {
  useDocumentTitle('Watchlist | Market Canvas AI');
  return (
    <DashboardLayout>
      <WatchlistManager />
    </DashboardLayout>
  );
};

export default WatchlistPage;
