import { useState, useImperativeHandle, forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Brain, Search, Sparkles, Loader2, ExternalLink, TrendingUp, Globe } from 'lucide-react';

interface SearchResult {
  answer: string;
  citations?: string[];
  ticker?: string;
}

export interface AISearchWidgetRef {
  searchTicker: (ticker: string) => void;
}

interface AISearchWidgetProps {
  onSearchComplete?: () => void;
}

const stockSuggestions = ['OGDC outlook', 'HBL analysis', 'Top gainers today', 'Market sentiment'];
const generalSuggestions = ['Banking sector outlook', 'Best dividend stocks in PSX', 'Cement sector analysis', 'Interest rate impact on stocks'];

export const AISearchWidget = forwardRef<AISearchWidgetRef, AISearchWidgetProps>(
  ({ onSearchComplete }, ref) => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [query, setQuery] = useState('');
    const [searchType, setSearchType] = useState<'stock' | 'general'>('stock');
    const [isSearching, setIsSearching] = useState(false);
    const [result, setResult] = useState<SearchResult | null>(null);

    // Expose method to parent
    useImperativeHandle(ref, () => ({
      searchTicker: (ticker: string) => {
        setQuery(ticker);
        setSearchType('stock');
        setTimeout(() => handleSearchWithQuery(ticker, 'stock'), 100);
      }
    }));

    const handleSearchWithQuery = async (searchQuery: string, type: 'stock' | 'general') => {
      if (!searchQuery.trim()) return;

      setIsSearching(true);
      setResult(null);

      try {
        // Save search to history for stock searches
        if (user && type === 'stock') {
          const tickerMatch = searchQuery.toUpperCase().match(/([A-Z]{2,6})/);
          const ticker = tickerMatch ? tickerMatch[1] : searchQuery.split(' ')[0].toUpperCase();
          
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
          const { data: existing } = await supabase
            .from('search_history')
            .select('id')
            .eq('user_id', user.id)
            .eq('ticker', ticker)
            .gte('searched_at', fiveMinutesAgo)
            .limit(1);
          
          if (existing && existing.length > 0) {
            await supabase
              .from('search_history')
              .update({ searched_at: new Date().toISOString() })
              .eq('id', existing[0].id);
          } else {
            await supabase.from('search_history').insert({
              user_id: user.id,
              ticker: ticker,
              stock_name: searchQuery,
            });
          }
        }

        // Call AI search edge function
        const { data, error } = await supabase.functions.invoke('ai-search', {
          body: { query: searchQuery, type },
        });

        if (error) throw error;

        setResult({
          answer: data.answer || data.content || 'No results found.',
          citations: data.citations || [],
          ticker: data.ticker,
        });

        onSearchComplete?.();
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

    const handleSearch = async () => {
      await handleSearchWithQuery(query, searchType);
    };

    const suggestions = searchType === 'stock' ? stockSuggestions : generalSuggestions;

    const ResultSkeleton = () => (
      <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50">
        <div className="flex items-start gap-3 mb-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
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
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            AI Search
          </CardTitle>
          <CardDescription>
            Ask about specific stocks or get general market insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Type Tabs */}
          <Tabs value={searchType} onValueChange={(v) => setSearchType(v as 'stock' | 'general')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="stock" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Stock Search
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2">
                <Globe className="h-4 w-4" />
                General Query
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchType === 'stock' 
                  ? "e.g., What's happening with OGDC?" 
                  : "e.g., What's the outlook on banking sector?"}
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
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(suggestion);
                  setTimeout(() => handleSearchWithQuery(suggestion, searchType), 100);
                }}
                className="text-xs hover:scale-105 transition-transform"
                disabled={isSearching}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Loading Skeleton */}
          {isSearching && <ResultSkeleton />}

          {/* Results */}
          {result && !isSearching && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border/50 animate-fade-in">
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
  }
);

AISearchWidget.displayName = 'AISearchWidget';
