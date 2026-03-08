import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PriceAlertManager } from '@/components/alerts/PriceAlertManager';

const AlertsPage = () => {
  useDocumentTitle('Price Alerts | Market Canvas AI');
  return (
    <DashboardLayout>
      <PriceAlertManager />
    </DashboardLayout>
  );
};

export default AlertsPage;
