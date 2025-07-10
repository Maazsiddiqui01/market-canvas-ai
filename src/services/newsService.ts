export interface NewsItem {
  title: string;
  time: string;
  source: string;
  url: string;
}

// Fetch real news from webhook
export const fetchPSXNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('https://n8n-maaz.duckdns.org/webhook/news-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newsData = await response.json();
    
    // Parse and format the response to match NewsItem interface
    // Take only top 5 most relevant news
    const formattedNews: NewsItem[] = newsData.slice(0, 5).map((item: any) => ({
      title: item.title || item.headline || 'News Update',
      time: item.time || item.publishedAt || 'Recently',
      source: item.source || item.publisher || 'PSX News',
      url: item.url || item.link || '#'
    }));

    return formattedNews;
  } catch (error) {
    console.error('Failed to fetch news from webhook:', error);
    
    // Fallback to mock data if webhook fails
    const mockNews: NewsItem[] = [
      {
        title: 'KSE-100 Index Surges to New Record High on Strong Banking Sector Rally',
        time: '1 hour ago',
        source: 'Business Recorder',
        url: 'https://www.brecorder.com'
      },
      {
        title: 'Foreign Investment Inflows Boost PSX Performance Amid Economic Reforms',
        time: '3 hours ago', 
        source: 'Dawn News',
        url: 'https://www.dawn.com/news/business'
      },
      {
        title: 'Textile Sector Stocks Rally on Export Growth Expectations',
        time: '5 hours ago',
        source: 'Express Tribune',
        url: 'https://tribune.com.pk/business'
      },
      {
        title: 'Oil Marketing Companies Post Strong Quarterly Results',
        time: '7 hours ago',
        source: 'The News',
        url: 'https://www.thenews.com.pk/business'
      },
      {
        title: 'Technology Stocks Show Momentum as Digital Pakistan Initiative Gains Traction',
        time: '9 hours ago',
        source: 'Profit by Pakistan Today',
        url: 'https://profit.pakistantoday.com.pk'
      }
    ];

    return mockNews;
  }
};