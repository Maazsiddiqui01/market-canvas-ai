import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';

const PortfolioPage = () => {
  return (
    <DashboardLayout>
      <PortfolioManager />
    </DashboardLayout>
  );
};

export default PortfolioPage;
