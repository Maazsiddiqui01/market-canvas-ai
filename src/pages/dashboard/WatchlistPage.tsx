import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';

const WatchlistPage = () => {
  return (
    <DashboardLayout>
      <WatchlistManager />
    </DashboardLayout>
  );
};

export default WatchlistPage;
