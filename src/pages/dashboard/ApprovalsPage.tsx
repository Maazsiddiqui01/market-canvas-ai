import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ApprovalsFeed } from '@/components/approvals/ApprovalsFeed';
import { ClipboardCheck } from 'lucide-react';

const ApprovalsPage = () => {
  useDocumentTitle('Approvals | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Agent"
      pageTitle="Approvals"
      pageSubtitle="Proposed orders from the research agent. Approve to record the fill in your portfolio, or reject to dismiss."
      pageIcon={ClipboardCheck}
    >
      <ApprovalsFeed />
    </DashboardLayout>
  );
};

export default ApprovalsPage;
