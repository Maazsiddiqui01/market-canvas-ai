import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';
import { Briefcase } from 'lucide-react';

const PortfolioPage = () => {
  useDocumentTitle('Portfolio | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Holdings"
      pageTitle="Portfolio"
      pageSubtitle="Track your holdings, live P&L and sector allocation across the Pakistan Stock Exchange."
      pageIcon={Briefcase}
    >
      <PortfolioManager />
    </DashboardLayout>
  );
};

export default PortfolioPage;
