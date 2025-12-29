import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import NewsWidget from '@/components/NewsWidget';

const NewsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <DashboardLayout>
      <NewsWidget refreshTrigger={refreshTrigger} />
    </DashboardLayout>
  );
};

export default NewsPage;
