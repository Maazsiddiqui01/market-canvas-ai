import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Search, Sparkles, Loader2, ExternalLink } from 'lucide-react';

interface SearchResult {
  answer: string;
  citations?: string[];
  ticker?: string;
}

export const AISearchWidget = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setResult(null);

    try {
      // Save search to history
      if (user) {
        const tickerMatch = query.toUpperCase().match(/([A-Z]{2,6})/);
        const ticker = tickerMatch ? tickerMatch[1] : query.split(' ')[0].toUpperCase();
        
        await supabase.from('search_history').insert({
          user_id: user.id,
          ticker: ticker,
          stock_name: query,
        });
      }

      // Call AI search edge function
      const { data, error } = await supabase.functions.invoke('ai-search', {
        body: { query, type: 'stock' },
      });

      if (error) throw error;

      setResult({
        answer: data.answer || data.content || 'No results found.',
        citations: data.citations || [],
        ticker: data.ticker,
      });
    } catch (error) {
      console.error('AI Search error:', error);
      toast({
        title: 'Search failed',
        description: 'Unable to complete search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          AI Stock Search
        </CardTitle>
        <CardDescription>
          Ask anything about PSX stocks, market trends, or financial analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="e.g., What's happening with OGDC? or Analysis of banking sector"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleSearch} 
            disabled={isSearching || !query.trim()}
            className="gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap gap-2">
          {['OGDC outlook', 'Banking sector analysis', 'Top gainers today', 'Market sentiment'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery(suggestion);
                setTimeout(handleSearch, 100);
              }}
              className="text-xs"
            >
              {suggestion}
            </Button>
          ))}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in-scale">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">AI Analysis</p>
                {result.ticker && (
                  <p className="text-sm text-muted-foreground">About: {result.ticker}</p>
                )}
              </div>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{result.answer}</p>
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
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
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
