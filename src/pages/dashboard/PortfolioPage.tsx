import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';

const PortfolioPage = () => {
  useDocumentTitle('Portfolio | Market Canvas AI');
  return (
    <DashboardLayout>
      <PortfolioManager />
    </DashboardLayout>
  );
};

export default PortfolioPage;
