import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PriceAlertManager } from '@/components/alerts/PriceAlertManager';
import { Bell } from 'lucide-react';

const AlertsPage = () => {
  useDocumentTitle('Price Alerts | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Notifications"
      pageTitle="Price Alerts"
      pageSubtitle="Get notified the moment your favourite PSX tickers hit your target price."
      pageIcon={Bell}
    >
      <PriceAlertManager />
    </DashboardLayout>
  );
};

export default AlertsPage;
