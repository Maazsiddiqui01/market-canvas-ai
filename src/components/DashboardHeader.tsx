import React, { useState, useEffect } from 'react';
import { User, LogOut, LayoutDashboard, Search, Command, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DesktopNavPill } from '@/components/dashboard/NavigationGuide';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onTickerChange?: (ticker: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

// Single source of truth for the shared resource nav (mirrors the learn site's top bar).
const RESOURCE_LINKS = [
  { label: 'Learn', href: 'https://learn.marketcanvasai.com/learn/' },
  { label: 'Tools', href: 'https://learn.marketcanvasai.com/tools/' },
  { label: 'Picks', href: 'https://learn.marketcanvasai.com/stock-picks/' },
  { label: 'Blog', href: 'https://learn.marketcanvasai.com/blog/' },
];

const DashboardHeader = ({ activeTab, onTabChange }: DashboardHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'glass-strong hairline-b py-1.5'
        : 'bg-background/40 backdrop-blur-md hairline-b py-2.5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group shrink-0">
            <div className={`transition-all duration-300 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
              <Logo size="sm" />
            </div>
          </Link>

          {/* Shared resource nav -> learn site (matches the learn site's top bar exactly) */}
          {!(activeTab && onTabChange) && (
            <nav className="hidden md:flex ml-auto items-center gap-5 lg:gap-7 text-sm">
              {RESOURCE_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="whitespace-nowrap text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>
              ))}
            </nav>
          )}

          {/* Desktop inline nav */}
          {user && activeTab && onTabChange && (
            <div className="hidden md:flex flex-1 justify-center min-w-0">
              <DesktopNavPill activeTab={activeTab} onTabChange={onTabChange} />
            </div>
          )}

          {/* Right side: Mobile menu + ⌘K + Theme + Auth */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile resource menu (same links as the learn site) — always available, incl. inside the dashboard */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {RESOURCE_LINKS.map((l) => (
                    <DropdownMenuItem asChild key={l.href}>
                      <a href={l.href} className="w-full cursor-pointer">{l.label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {user && (
              <button
                onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
                aria-label="Open command palette"
                className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass-subtle text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Search…</span>
                <kbd className="ml-2 inline-flex items-center gap-0.5 rounded border border-border/60 bg-background/60 px-1.5 py-0.5 text-[10px] font-mono">
                  <Command className="h-2.5 w-2.5" />K
                </kbd>
              </button>
            )}
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    aria-label="User menu"
                    className="rounded-full bg-primary/10 hover:bg-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 animate-fade-in">
                  <DropdownMenuItem className="text-muted-foreground text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="btn-professional">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
