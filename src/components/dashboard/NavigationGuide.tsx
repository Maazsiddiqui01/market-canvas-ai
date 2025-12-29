import { Home, BarChart3, Brain, Briefcase, Eye, Bell, Newspaper, Settings } from 'lucide-react';

const sections = [
  {
    id: 'home',
    icon: Home,
    title: 'Home',
    description: 'Dashboard Overview',
  },
  {
    id: 'market',
    icon: BarChart3,
    title: 'Market',
    description: 'Heatmaps & Analysis',
  },
  {
    id: 'ai-search',
    icon: Brain,
    title: 'AI Tools',
    description: 'AI Stock Research',
  },
  {
    id: 'portfolio',
    icon: Briefcase,
    title: 'Portfolio',
    description: 'Track Holdings',
  },
  {
    id: 'watchlist',
    icon: Eye,
    title: 'Watchlist',
    description: 'Monitor Stocks',
  },
  {
    id: 'alerts',
    icon: Bell,
    title: 'Alerts',
    description: 'Price Notifications',
  },
  {
    id: 'news',
    icon: Newspaper,
    title: 'News',
    description: 'Market Updates',
  },
  {
    id: 'tools',
    icon: Settings,
    title: 'Tools',
    description: 'Export & Utilities',
  },
];

interface NavigationGuideProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationGuide = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  return (
    <nav className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeTab === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => onTabChange(section.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`
                relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl
                transition-all duration-300 min-w-[70px] animate-fade-in
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }
              `}
            >
              <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className="font-medium text-xs whitespace-nowrap">{section.title}</span>
              
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
