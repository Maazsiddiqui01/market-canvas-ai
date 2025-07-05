export interface NewsItem {
  title: string;
  time: string;
  source: string;
  url: string;
}

// Mock news service for PSX/Pakistani stock market
// In a real implementation, you would fetch from a news API
export const fetchPSXNews = async (): Promise<NewsItem[]> => {
  // Since we can't make external API calls easily, we'll simulate real news
  // In production, you'd integrate with news APIs like NewsAPI, Google News, etc.
  
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

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockNews;
};