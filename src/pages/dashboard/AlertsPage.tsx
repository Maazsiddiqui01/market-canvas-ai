import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PriceAlertManager } from '@/components/alerts/PriceAlertManager';

const AlertsPage = () => {
  return (
    <DashboardLayout>
      <PriceAlertManager />
    </DashboardLayout>
  );
};

export default AlertsPage;
