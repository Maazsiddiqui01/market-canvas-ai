
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper, Clock } from 'lucide-react';

const NewsWidget = () => {
  const news = [
    {
      title: 'KSE-100 Index Reaches New High Amid Strong Banking Sector Performance',
      time: '2 hours ago',
      source: 'Business Recorder'
    },
    {
      title: 'Oil Prices Impact Energy Sector Stocks in PSX',
      time: '4 hours ago',
      source: 'Dawn News'
    },
    {
      title: 'Textile Exports Drive Market Sentiment Positive',
      time: '6 hours ago',
      source: 'Express Tribune'
    },
    {
      title: 'Foreign Investment Inflows Boost Market Confidence',
      time: '8 hours ago',
      source: 'The News'
    },
    {
      title: 'Technology Sector Shows Promising Growth Trends',
      time: '10 hours ago',
      source: 'ARY News'
    }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {news.map((item, index) => (
          <div key={index} className="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer">
            <h4 className="text-white font-medium text-sm leading-5 mb-2">{item.title}</h4>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{item.source}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsWidget;
