import { useState } from 'react';
import { Home, BarChart3, Brain, Briefcase, Eye, Bell, Newspaper, Settings, History, MoreHorizontal, PieChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const primarySections = [
  { id: 'home', icon: Home, title: 'Home' },
  { id: 'market', icon: BarChart3, title: 'Market' },
  { id: 'ai-search', icon: Brain, title: 'AI' },
  { id: 'portfolio', icon: Briefcase, title: 'Portfolio' },
];

const secondarySections = [
  { id: 'watchlist', icon: Eye, title: 'Watchlist', description: 'Monitor Stocks' },
  { id: 'alerts', icon: Bell, title: 'Alerts', description: 'Price Notifications' },
  { id: 'news', icon: Newspaper, title: 'News', description: 'Market Updates' },
  { id: 'history', icon: History, title: 'History', description: 'Activity Log' },
  { id: 'tools', icon: Settings, title: 'Tools', description: 'Export & Utilities' },
  { id: 'analytics', icon: PieChart, title: 'Analytics', description: 'Admin Stats' },
];

const allSections = [
  { id: 'home', icon: Home, title: 'Home', description: 'Dashboard Overview' },
  { id: 'market', icon: BarChart3, title: 'Market', description: 'Heatmaps & Analysis' },
  { id: 'ai-search', icon: Brain, title: 'AI Tools', description: 'AI Stock Research' },
  { id: 'portfolio', icon: Briefcase, title: 'Portfolio', description: 'Track Holdings' },
  { id: 'watchlist', icon: Eye, title: 'Watchlist', description: 'Monitor Stocks' },
  { id: 'alerts', icon: Bell, title: 'Alerts', description: 'Price Notifications' },
  { id: 'news', icon: Newspaper, title: 'News', description: 'Market Updates' },
  { id: 'history', icon: History, title: 'History', description: 'Activity Log' },
  { id: 'tools', icon: Settings, title: 'Tools', description: 'Export & Utilities' },
  { id: 'analytics', icon: PieChart, title: 'Analytics', description: 'Admin Stats' },
];

interface NavigationGuideProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationGuide = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);

  const isSecondaryActive = secondarySections.some(s => s.id === activeTab);

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1.5">
          {primarySections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                aria-label={`Navigate to ${section.title}`}
                onClick={() => onTabChange(section.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium">{section.title}</span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}

          {/* More button */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="More navigation options"
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px] relative
                  ${isSecondaryActive ? 'text-primary' : 'text-muted-foreground'}
                `}
              >
                <MoreHorizontal className="h-5 w-5" />
                <span className="text-[10px] font-medium">More</span>
                {isSecondaryActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl pb-8">
              <SheetHeader>
                <SheetTitle>More Options</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {secondarySections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeTab === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        onTabChange(section.id);
                        setMoreOpen(false);
                      }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200
                        ${isActive
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'bg-secondary/50 text-foreground hover:bg-secondary'
                        }
                      `}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-medium">{section.title}</span>
                      <span className={`text-[10px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {section.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    );
  }

  // Desktop: keep original horizontal nav
  return (
    <nav className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-center gap-1 overflow-x-auto scrollbar-hide">
        {allSections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeTab === section.id;
          
          return (
            <button
              key={section.id}
              aria-label={`Navigate to ${section.title}`}
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
              <Icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
              <span className="font-medium text-xs whitespace-nowrap">{section.title}</span>
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
