import { BarChart3, Brain, Briefcase, Eye, Bell, Newspaper, Settings } from 'lucide-react';

const sections = [
  {
    id: 'market',
    icon: BarChart3,
    title: 'Market',
    description: 'Live heatmaps, technical & financial analysis, top gainers/losers',
  },
  {
    id: 'ai-search',
    icon: Brain,
    title: 'AI Tools',
    description: 'AI-powered stock analysis, market queries, stock comparison',
  },
  {
    id: 'portfolio',
    icon: Briefcase,
    title: 'Portfolio',
    description: 'Track holdings, P&L, sector breakdown, performance history',
  },
  {
    id: 'watchlist',
    icon: Eye,
    title: 'Watchlist',
    description: 'Monitor saved stocks with live prices',
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Alerts',
    description: 'Set price notifications for target levels',
  },
  {
    id: 'news',
    icon: Newspaper,
    title: 'News',
    description: 'Latest market news from PSX sources',
  },
  {
    id: 'tools',
    icon: Settings,
    title: 'Tools',
    description: 'Export data and utilities',
  },
];

interface NavigationGuideProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationGuide = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-6">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        
        return (
          <button
            key={section.id}
            onClick={() => onTabChange(section.id)}
            className={`
              group p-3 rounded-lg text-left transition-all duration-200
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]' 
                : 'bg-secondary/50 hover:bg-secondary/80 hover:scale-[1.01]'
              }
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
              <span className="font-medium text-sm">{section.title}</span>
            </div>
            <p className={`text-xs leading-snug ${isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
              {section.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
