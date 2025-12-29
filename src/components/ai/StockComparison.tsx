import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Scale, Plus, X, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ComparisonResult {
  tickers: string[];
  comparison: string;
  citations: string[];
  generated_at: string;
}

export const StockComparison = () => {
  const { toast } = useToast();
  const [tickers, setTickers] = useState<string[]>(['', '']);
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleTickerChange = (index: number, value: string) => {
    const newTickers = [...tickers];
    newTickers[index] = value.toUpperCase();
    setTickers(newTickers);
  };

  const addTicker = () => {
    if (tickers.length < 3) {
      setTickers([...tickers, '']);
    }
  };

  const removeTicker = (index: number) => {
    if (tickers.length > 2) {
      setTickers(tickers.filter((_, i) => i !== index));
    }
  };

  const handleCompare = async () => {
    const validTickers = tickers.filter(t => t.trim());
    
    if (validTickers.length < 2) {
      toast({
        title: 'Invalid Input',
        description: 'Please enter at least 2 stock tickers to compare.',
        variant: 'destructive',
      });
      return;
    }

    setIsComparing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('compare-stocks', {
        body: { tickers: validTickers }
      });

      if (error) throw error;

      setResult(data);
      toast({
        title: 'Comparison Complete',
        description: `Analyzed ${validTickers.join(', ')}`,
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: 'Comparison Failed',
        description: 'Unable to compare stocks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsComparing(false);
    }
  };

  const ResultSkeleton = () => (
    <div className="space-y-4 mt-6 p-4 rounded-lg bg-secondary/30">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
            <Scale className="h-5 w-5 text-primary-foreground" />
          </div>
          AI Stock Comparison
        </CardTitle>
        <CardDescription>
          Compare 2-3 PSX stocks with AI-powered analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Ticker Inputs */}
        <div className="space-y-3">
          {tickers.map((ticker, index) => (
            <div key={index} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                {index + 1}
              </Badge>
              <Input
                placeholder={`Stock ${index + 1} (e.g., ${['OGDC', 'HBL', 'LUCK'][index] || 'PSO'})`}
                value={ticker}
                onChange={(e) => handleTickerChange(index, e.target.value)}
                className="flex-1"
              />
              {tickers.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTicker(index)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {tickers.length < 3 && (
            <Button variant="outline" size="sm" onClick={addTicker} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Stock
            </Button>
          )}
          <Button 
            onClick={handleCompare} 
            disabled={isComparing || tickers.filter(t => t.trim()).length < 2}
            className="gap-2 ml-auto"
          >
            {isComparing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Comparing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Compare Stocks
              </>
            )}
          </Button>
        </div>

        {/* Loading Skeleton */}
        {isComparing && <ResultSkeleton />}

        {/* Results */}
        {result && !isComparing && (
          <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border/50 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">AI Comparison</p>
                <p className="text-sm text-muted-foreground">
                  {result.tickers.join(' vs ')}
                </p>
              </div>
            </div>
            
            <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-a:text-primary prose-table:text-sm prose-th:bg-secondary/50 prose-th:p-2 prose-td:p-2 prose-tr:border-border">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.comparison}
              </ReactMarkdown>
            </div>

            {result.citations && result.citations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {result.citations.slice(0, 5).map((citation, index) => (
                    <a
                      key={index}
                      href={citation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline hover:scale-105 transition-transform"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Source {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
