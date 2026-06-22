import { useState, useEffect } from 'react';
import { Home, Brain, Briefcase, Newspaper, Settings, MoreHorizontal, PieChart, Sparkles, ClipboardCheck, GraduationCap, Calculator, BookOpen } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const analyticsSection = { id: 'analytics', icon: PieChart, title: 'Analytics', description: 'Admin Stats' };

const baseAllSections = [
  { id: 'home', icon: Home, title: 'Home', description: 'Dashboard Overview' },
  { id: 'ai-search', icon: Brain, title: 'AI Tools', description: 'AI Stock Research' },
  { id: 'recommendations', icon: Sparkles, title: 'Picks', description: "Today's Picks" },
  { id: 'portfolio', icon: Briefcase, title: 'Portfolio', description: 'Track Holdings' },
  { id: 'approvals', icon: ClipboardCheck, title: 'Approvals', description: 'Approve Agent Orders' },
  { id: 'news', icon: Newspaper, title: 'News', description: 'Market Updates' },
  { id: 'tools', icon: Settings, title: 'Tools', description: 'Export & Utilities' },
];

// External links to the learning site, surfaced inside the app header.
const LEARN_LINKS = [
  { label: 'Learn', href: 'https://learn.marketcanvasai.com/learn/', icon: GraduationCap },
  { label: 'Calculators', href: 'https://learn.marketcanvasai.com/tools/', icon: Calculator },
  { label: 'Blog', href: 'https://learn.marketcanvasai.com/blog/', icon: BookOpen },
];

interface NavigationGuideProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function useAllSections() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => {
      setIsAdmin(!!data);
    });
  }, [user]);
  return isAdmin ? [...baseAllSections, analyticsSection] : baseAllSections;
}

/** Desktop inline pill nav, intended to live inside the top header. */
export const DesktopNavPill = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  const allSections = useAllSections();
  const groupMarkets = allSections.filter(s => ['home', 'ai-search', 'recommendations', 'news'].includes(s.id));
  const groupMine = allSections.filter(s => ['portfolio'].includes(s.id));
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
              relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
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

  const renderLearn = () => (
    <div className="flex items-center gap-0.5">
      {LEARN_LINKS.map((l) => {
        const Icon = l.icon;
        return (
          <a
            key={l.href}
            href={l.href}
            aria-label={`Open ${l.label} on the learn site`}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap text-muted-foreground hover:text-foreground hover:bg-foreground/5"
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium text-xs">{l.label}</span>
          </a>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center gap-1.5 glass rounded-2xl px-1.5 py-1">
      {renderGroup(groupMarkets)}
      <span className="h-5 w-px bg-foreground/10" />
      {renderGroup(groupMine)}
      {groupTools.length > 0 && <span className="h-5 w-px bg-foreground/10" />}
      {renderGroup(groupTools)}
      <span className="h-5 w-px bg-foreground/10" />
      {renderLearn()}
    </div>
  );
};

/** Native-app style fixed bottom tab bar for mobile. */
export const MobileBottomNav = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const allSections = useAllSections();

  const primary = [
    { id: 'home', icon: Home, title: 'Home' },
    { id: 'recommendations', icon: Sparkles, title: 'Picks' },
    { id: 'ai-search', icon: Brain, title: 'AI' },
    { id: 'portfolio', icon: Briefcase, title: 'Portfolio' },
  ];
  const secondary = allSections.filter(s => !primary.some(p => p.id === s.id));
  const isSecondaryActive = secondary.some(s => s.id === activeTab);

  const Tab = ({
    id,
    icon: Icon,
    title,
    isActive,
    onClick,
  }: {
    id: string;
    icon: typeof Home;
    title: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      key={id}
      aria-label={`Navigate to ${title}`}
      onClick={onClick}
      className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] transition-colors
        ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Icon className={`h-5 w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-medium leading-none">{title}</span>
      {isActive && (
        <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
      )}
    </button>
  );

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass-strong hairline-t md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch px-1">
        {primary.map((s) => (
          <Tab
            key={s.id}
            id={s.id}
            icon={s.icon}
            title={s.title}
            isActive={activeTab === s.id}
            onClick={() => onTabChange(s.id)}
          />
        ))}
        <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="More navigation options"
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] transition-colors
                ${isSecondaryActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">More</span>
              {isSecondaryActive && (
                <span className="absolute bottom-0 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-8">
            <SheetHeader>
              <SheetTitle>More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {secondary.map((section) => {
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
                      }`}
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
};

/** Back-compat wrapper: chooses the right nav based on viewport. */
export const NavigationGuide = ({ activeTab, onTabChange }: NavigationGuideProps) => {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileBottomNav activeTab={activeTab} onTabChange={onTabChange} />;
  return (
    <nav className="sticky top-16 z-20 -mx-4 px-4 py-3 mb-6 flex justify-center">
      <DesktopNavPill activeTab={activeTab} onTabChange={onTabChange} />
    </nav>
  );
};
