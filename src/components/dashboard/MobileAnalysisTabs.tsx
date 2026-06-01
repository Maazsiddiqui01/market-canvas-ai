import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, DollarSign } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import TechnicalAnalysis from '@/components/TechnicalAnalysis';
import FinancialAnalysis from '@/components/FinancialAnalysis';

interface Props {
  ticker?: string;
}

/**
 * Renders Technical + Financial analysis side-by-side on lg+,
 * tabbed on mobile so only one TradingView iframe mounts at a time
 * (saves ~500px of scroll and one heavy embed on phones).
 */
export const MobileAnalysisTabs = ({ ticker = 'KSE100' }: Props) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechnicalAnalysis ticker={ticker} />
        <FinancialAnalysis ticker={ticker} />
      </div>
    );
  }

  return (
    <Tabs defaultValue="technical" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-10">
        <TabsTrigger value="technical" className="gap-1.5 text-xs">
          <TrendingUp className="h-3.5 w-3.5" />
          Technical
        </TabsTrigger>
        <TabsTrigger value="financial" className="gap-1.5 text-xs">
          <DollarSign className="h-3.5 w-3.5" />
          Financial
        </TabsTrigger>
      </TabsList>
      <TabsContent value="technical" className="mt-4">
        <TechnicalAnalysis ticker={ticker} />
      </TabsContent>
      <TabsContent value="financial" className="mt-4">
        <FinancialAnalysis ticker={ticker} />
      </TabsContent>
    </Tabs>
  );
};

export default MobileAnalysisTabs;
