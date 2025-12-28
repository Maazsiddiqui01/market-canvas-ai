import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, FileSpreadsheet, Briefcase, Eye, History, Bell, Loader2 } from 'lucide-react';
import { exportPortfolio, exportWatchlist, exportSearchHistory, exportPriceAlerts } from '@/utils/exportUtils';

type ExportType = 'portfolio' | 'watchlist' | 'history' | 'alerts';

export const ExportManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [exporting, setExporting] = useState<ExportType | null>(null);

  const handleExport = async (type: ExportType) => {
    if (!user) return;

    setExporting(type);

    try {
      let success = false;
      let label = '';

      switch (type) {
        case 'portfolio':
          success = await exportPortfolio(user.id);
          label = 'Portfolio';
          break;
        case 'watchlist':
          success = await exportWatchlist(user.id);
          label = 'Watchlist';
          break;
        case 'history':
          success = await exportSearchHistory(user.id);
          label = 'Search History';
          break;
        case 'alerts':
          success = await exportPriceAlerts(user.id);
          label = 'Price Alerts';
          break;
      }

      if (success) {
        toast({
          title: 'Export Complete',
          description: `${label} exported successfully.`,
        });
      } else {
        toast({
          title: 'Nothing to Export',
          description: `Your ${label.toLowerCase()} is empty.`,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Unable to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(null);
    }
  };

  const exportOptions = [
    {
      type: 'portfolio' as ExportType,
      label: 'Portfolio',
      description: 'Export all holdings with prices',
      icon: Briefcase,
    },
    {
      type: 'watchlist' as ExportType,
      label: 'Watchlist',
      description: 'Export watched stocks',
      icon: Eye,
    },
    {
      type: 'history' as ExportType,
      label: 'Search History',
      description: 'Export all search history',
      icon: History,
    },
    {
      type: 'alerts' as ExportType,
      label: 'Price Alerts',
      description: 'Export all price alerts',
      icon: Bell,
    },
  ];

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Export Data
        </CardTitle>
        <CardDescription>
          Download your data as CSV files
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {exportOptions.map((option, index) => {
            const Icon = option.icon;
            const isExporting = exporting === option.type;
            
            return (
              <Button
                key={option.type}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-secondary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handleExport(option.type)}
                disabled={exporting !== null}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="p-2 bg-primary/10 rounded">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{option.label}</span>
                  <div className="ml-auto">
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <Download className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground text-left">
                  {option.description}
                </span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
