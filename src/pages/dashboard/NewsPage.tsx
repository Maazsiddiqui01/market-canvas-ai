import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import NewsWidget from '@/components/NewsWidget';

const NewsPage = () => {
  useDocumentTitle('Market News | Market Canvas AI');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <DashboardLayout>
      <NewsWidget refreshTrigger={refreshTrigger} />
    </DashboardLayout>
  );
};

export default NewsPage;
