import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ExportManager } from '@/components/export/ExportManager';
import { Settings } from 'lucide-react';

const ToolsPage = () => {
  useDocumentTitle('Tools & Export | Market Canvas AI');
  return (
    <DashboardLayout
      pageEyebrow="Utilities"
      pageTitle="Tools & Export"
      pageSubtitle="Export your data, manage preferences, and access additional utilities."
      pageIcon={Settings}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExportManager />
      </div>
    </DashboardLayout>
  );
};

export default ToolsPage;
