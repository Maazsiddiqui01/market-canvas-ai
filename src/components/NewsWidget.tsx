import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';
import { fetchPSXNews, NewsItem } from '@/services/newsService';

interface NewsWidgetProps {
  refreshTrigger?: number;
}

const NewsWidget = ({ refreshTrigger }: NewsWidgetProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchPSXNews();
        setNews(newsData);
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // Fallback to empty array if fetch fails
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
      </CardHeader>
      <CardContent className="space-y-3">
        {news.map((item, index) => (
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
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.source}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{item.time}</span>
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
