import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ExportManager } from '@/components/export/ExportManager';

const ToolsPage = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExportManager />
      </div>
    </DashboardLayout>
  );
};

export default ToolsPage;
