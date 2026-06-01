import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import NewsWidget from '@/components/NewsWidget';
import { Newspaper } from 'lucide-react';

const NewsPage = () => {
  useDocumentTitle('Market News | Market Canvas AI');
  const [refreshTrigger] = useState(0);

  return (
    <DashboardLayout
      pageEyebrow="Today"
      pageTitle="Market News"
      pageSubtitle="The latest PSX coverage from Pakistan's leading financial newsrooms."
      pageIcon={Newspaper}
    >
      <NewsWidget refreshTrigger={refreshTrigger} />
    </DashboardLayout>
  );
};

export default NewsPage;
