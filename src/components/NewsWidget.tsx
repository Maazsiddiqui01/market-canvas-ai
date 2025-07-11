import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Clock, ExternalLink, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchPSXNews, NewsItem } from '@/services/newsService';

interface NewsWidgetProps {
  refreshTrigger?: number;
}

const NewsWidget = ({ refreshTrigger }: NewsWidgetProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter and limit news based on search and expansion state
  const filteredNews = useMemo(() => {
    let filtered = news;
    
    if (searchTerm.trim()) {
      filtered = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return isExpanded ? filtered : filtered.slice(0, 5);
  }, [news, searchTerm, isExpanded]);

  const totalFilteredCount = useMemo(() => {
    if (searchTerm.trim()) {
      return news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      ).length;
    }
    return news.length;
  }, [news, searchTerm]);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchPSXNews();
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            Latest PSX News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="p-3 rounded-lg bg-muted/30 animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted/60 rounded w-1/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Latest PSX News
        </CardTitle>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news (e.g., Meezan, MEBL)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {searchTerm && (
          <div className="text-sm text-muted-foreground">
            {totalFilteredCount} result{totalFilteredCount !== 1 ? 's' : ''} found
          </div>
        )}
        
        <ScrollArea className={isExpanded ? "h-80" : "h-auto"}>
          <div className="space-y-3">
            {filteredNews.map((item, index) => (
              <a 
                key={index} 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-foreground font-medium text-sm leading-5 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs px-2 py-1">
                      {item.sourceTag || item.source}
                    </Badge>
                    <span className="text-muted-foreground">
                      {item.url.includes('mettisglobal') ? 'Mettis Global' : item.source}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{item.time}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </ScrollArea>

        {!searchTerm && totalFilteredCount > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-3 text-muted-foreground hover:text-primary"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show All ({totalFilteredCount} total)
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
