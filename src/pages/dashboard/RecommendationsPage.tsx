import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { RecommendationsFeed } from '@/components/recommendations/RecommendationsFeed';
import { Sparkles } from 'lucide-react';

const RecommendationsPage = () => {
  useDocumentTitle('Recommendations | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Agent"
      pageTitle="Today's Picks"
      pageSubtitle="Daily Sharia-compliant recommendations from the research agent, across PSX and US markets."
      pageIcon={Sparkles}
    >
      <RecommendationsFeed />
    </DashboardLayout>
  );
};

export default RecommendationsPage;
