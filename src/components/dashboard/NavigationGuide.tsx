import { useState, useEffect } from 'react';
import { Home, BarChart3, Brain, Briefcase, Eye, Bell, Newspaper, Settings, History, MoreHorizontal, PieChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const primarySections = [
  { id: 'home', icon: Home, title: 'Home' },
  { id: 'ai-search', icon: Brain, title: 'AI' },
  { id: 'portfolio', icon: Briefcase, title: 'Portfolio' },
];

const baseSections = [
  { id: 'watchlist', icon: Eye, title: 'Watchlist', description: 'Monitor Stocks' },
  { id: 'alerts', icon: Bell, title: 'Alerts', description: 'Price Notifications' },
  { id: 'news', icon: Newspaper, title: 'News', description: 'Market Updates' },
  { id: 'history', icon: History, title: 'History', description: 'Activity Log' },
  { id: 'tools', icon: Settings, title: 'Tools', description: 'Export & Utilities' },
];

const analyticsSection = { id: 'analytics', icon: PieChart, title: 'Analytics', description: 'Admin Stats' };

const baseAllSections = [
  { id: 'home', icon: Home, title: 'Home', description: 'Dashboard Overview' },
  { id: 'ai-search', icon: Brain, title: 'AI Tools', description: 'AI Stock Research' },
  { id: 'portfolio', icon: Briefcase, title: 'Portfolio', description: 'Track Holdings' },
  { id: 'watchlist', icon: Eye, title: 'Watchlist', description: 'Monitor Stocks' },
  { id: 'alerts', icon: Bell, title: 'Alerts', description: 'Price Notifications' },
  { id: 'news', icon: Newspaper, title: 'News', description: 'Market Updates' },
  { id: 'history', icon: History, title: 'History', description: 'Activity Log' },
  { id: 'tools', icon: Settings, title: 'Tools', description: 'Export & Utilities' },
];

interface NavigationGuideProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationGuide = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  const isMobile = useIsMobile();
  const [moreOpen, setMoreOpen] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);

  const secondarySections = isAdmin ? [...baseSections, analyticsSection] : baseSections;
  const allSections = isAdmin ? [...baseAllSections, analyticsSection] : baseAllSections;

  const isSecondaryActive = secondarySections.some(s => s.id === activeTab);

  if (isMobile) {
    return (
      <nav className="sticky top-14 z-30 -mx-4 px-3 py-2 bg-background/90 backdrop-blur-xl hairline-b mb-4">
        <div className="flex items-center justify-between gap-1.5">
          {primarySections.map((section) => {
            const Icon = section.icon;
            const isActive = activeTab === section.id;
            return (
              <button
                key={section.id}
                aria-label={`Navigate to ${section.title}`}
                onClick={() => onTabChange(section.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-all min-h-[40px]
                  ${isActive
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{section.title}</span>
              </button>
            );
          })}

          {/* More button */}
          <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="More navigation options"
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg transition-all min-h-[40px]
                  ${isSecondaryActive ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="text-xs font-medium">More</span>
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


  // Desktop: grouped glass nav (Markets · My Stuff · Tools)
  const groupMarkets = allSections.filter(s => ['home', 'market', 'ai-search', 'news'].includes(s.id));
  const groupMine = allSections.filter(s => ['portfolio', 'watchlist', 'alerts', 'history'].includes(s.id));
  const groupTools = allSections.filter(s => ['tools', 'analytics'].includes(s.id));

  const renderGroup = (items: typeof allSections) => (
    <div className="flex items-center gap-0.5">
      {items.map((section) => {
        const Icon = section.icon;
        const isActive = activeTab === section.id;
        return (
          <button
            key={section.id}
            aria-label={`Navigate to ${section.title}`}
            onClick={() => onTabChange(section.id)}
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-lg
              transition-all duration-200 whitespace-nowrap
              ${isActive
                ? 'bg-primary/12 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]'
                : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
              }
            `}
          >
            <Icon className={`h-4 w-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="font-medium text-xs">{section.title}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <nav className="sticky top-16 z-20 -mx-4 px-4 py-3 mb-6">
      <div className="mx-auto flex w-fit items-center gap-2 glass rounded-2xl px-2 py-1.5">
        {renderGroup(groupMarkets)}
        <span className="h-5 w-px bg-foreground/10" />
        {renderGroup(groupMine)}
        {groupTools.length > 0 && <span className="h-5 w-px bg-foreground/10" />}
        {renderGroup(groupTools)}
      </div>
    </nav>
  );
};

