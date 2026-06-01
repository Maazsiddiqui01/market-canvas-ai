import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Eye,
  Bell,
  Newspaper,
  History as HistoryIcon,
  Settings,
} from 'lucide-react';

const tiles = [
  { href: '/dashboard/portfolio', label: 'Portfolio', icon: Briefcase },
  { href: '/dashboard/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/dashboard/alerts', label: 'Alerts', icon: Bell },
  { href: '/dashboard/news', label: 'News', icon: Newspaper },
  { href: '/dashboard/history', label: 'History', icon: HistoryIcon },
  { href: '/dashboard/tools', label: 'Tools', icon: Settings },
];

/**
 * Compact secondary nav for the dashboard home. Keeps every section
 * one click away without crowding the AI-search-first hero.
 */
export const QuickAccessTiles = () => {
  return (
    <nav
      aria-label="Quick access"
      className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3"
    >
      {tiles.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          to={href}
          className="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl glass-subtle border border-border/40 hover:border-primary/40 hover:bg-primary/5 transition-colors"
        >
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover:text-foreground">
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
};

export default QuickAccessTiles;
