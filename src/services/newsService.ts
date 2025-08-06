export interface NewsItem {
  title: string;
  time: string;
  source: string;
  url: string;
  sourceTag?: string;
  description?: string;
}

// Function to extract source tag from URL or source name
const getSourceTag = (url: string, source: string): string => {
  if (url.includes('tribune.com') || source.toLowerCase().includes('tribune')) {
    return 'Tribune';
  }
  if (url.includes('brecorder.com') || source.toLowerCase().includes('business recorder')) {
    return 'Business Recorder';
  }
  if (url.includes('dawn.com') || source.toLowerCase().includes('dawn')) {
    return 'Dawn';
  }
  if (url.includes('thenews.com') || source.toLowerCase().includes('the news')) {
    return 'The News';
  }
  if (url.includes('profit.pakistantoday.com') || source.toLowerCase().includes('profit')) {
    return 'Profit';
  }
  if (url.includes('nation.com') || source.toLowerCase().includes('nation')) {
    return 'The Nation';
  }
  if (url.includes('pakobserver.net') || source.toLowerCase().includes('observer')) {
    return 'Pakistan Observer';
  }
  return source.split(' ')[0] || 'Market News'; // Default to first word of source
};

// Fetch real news from webhook
export const fetchPSXNews = async (): Promise<NewsItem[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch('https://n8n-maaz.duckdns.org/webhook/news-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newsData = await response.json();
    
    // Parse and format the response to match NewsItem interface
    // Return all news items for search and filtering
    const formattedNews: NewsItem[] = newsData.map((item: any) => ({
      title: item.title || item.headline || 'Market Update',
      time: item.time || item.publishedAt || 'Recently',
      source: item.source || item.publisher || 'Market News',
      url: item.url || item.link || '#',
      sourceTag: getSourceTag(item.url || item.link || '#', item.source || item.publisher || 'Market News'),
      description: item.content || item.title || item.headline || 'News Update'
    }));

    // Shuffle array to mix sources instead of grouping by source
    const shuffledNews = formattedNews.sort(() => Math.random() - 0.5);

    return shuffledNews;
  } catch (error) {
    console.warn('News webhook unavailable, using fallback data:', error instanceof Error ? error.message : 'Unknown error');
    
    // Fallback to mock data if webhook fails
    const mockNews: NewsItem[] = [
      {
        title: 'KSE-100 Index Surges to New Record High on Strong Banking Sector Rally',
        time: '1 hour ago',
        source: 'Business Recorder',
        url: 'https://www.brecorder.com',
        sourceTag: 'Business Recorder',
        description: 'The KSE-100 index reached an all-time high driven by strong performance in banking sector stocks as investors showed confidence in economic reforms.'
      },
      {
        title: 'Foreign Investment Inflows Boost PSX Performance Amid Economic Reforms',
        time: '3 hours ago', 
        source: 'Dawn News',
        url: 'https://www.dawn.com/news/business',
        sourceTag: 'Dawn',
        description: 'International investors are showing increased interest in Pakistan Stock Exchange as government implements comprehensive economic reforms.'
      },
      {
        title: 'Textile Sector Stocks Rally on Export Growth Expectations',
        time: '5 hours ago',
        source: 'Express Tribune',
        url: 'https://tribune.com.pk/business',
        sourceTag: 'Tribune',
        description: 'Textile companies see significant gains as export orders increase and global demand for Pakistani textile products rises.'
      },
      {
        title: 'Oil Marketing Companies Post Strong Quarterly Results',
        time: '7 hours ago',
        source: 'The News',
        url: 'https://www.thenews.com.pk/business',
        sourceTag: 'The News',
        description: 'Major oil marketing companies report robust quarterly earnings driven by improved margins and higher fuel demand.'
      },
      {
        title: 'Technology Stocks Show Momentum as Digital Pakistan Initiative Gains Traction',
        time: '9 hours ago',
        source: 'Profit by Pakistan Today',
        url: 'https://profit.pakistantoday.com.pk',
        sourceTag: 'Profit',
        description: 'Technology sector stocks surge as Digital Pakistan initiative accelerates and tech companies secure new contracts.'
      }
    ];

    // Shuffle mock data as well
    return mockNews.sort(() => Math.random() - 0.5);
  }
};