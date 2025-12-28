import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, Newspaper, Calculator, TrendingDown, Mail, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  onTickerChange?: (ticker: string) => void;
}

const DashboardHeader = ({ onTickerChange }: DashboardHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
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
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-primary/5' 
        : 'bg-background/95 backdrop-blur-sm border-b border-border'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className={`bg-gradient-to-r from-primary to-accent p-2 rounded-lg transition-all duration-300 ${
              isScrolled ? 'scale-75' : 'scale-100'
            }`}>
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className={`font-bold text-foreground transition-all duration-300 ${
                isScrolled ? 'text-base' : 'text-xl'
              }`}>Market Canvas AI</h1>
              {!isScrolled && (
                <p className="text-xs text-muted-foreground">AI-powered market intelligence</p>
              )}
            </div>
          </Link>
          
          {/* Navigation Menu and Auth */}
          <div className="flex items-center space-x-2">
            <nav className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('heatmap')?.scrollIntoView({ behavior: 'smooth' })}>
                <BarChart3 className="h-4 w-4 mr-2" />
                {!isScrolled && "Heatmap"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('technical-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
                <TrendingUp className="h-4 w-4 mr-2" />
                {!isScrolled && "Technical"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('financial-analysis')?.scrollIntoView({ behavior: 'smooth' })}>
                <Calculator className="h-4 w-4 mr-2" />
                {!isScrolled && "Fundamental"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}>
                <Newspaper className="h-4 w-4 mr-2" />
                {!isScrolled && "News"}
              </Button>
              <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground hover:bg-primary/10" onClick={() => document.getElementById('top-bottom-5')?.scrollIntoView({ behavior: 'smooth' })}>
                <TrendingDown className="h-4 w-4 mr-2" />
                {!isScrolled && "Rankings"}
              </Button>
            </nav>
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth buttons */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 hover:bg-primary/20">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size={isScrolled ? "sm" : "default"} className="text-muted-foreground hover:text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size={isScrolled ? "sm" : "default"} className="btn-professional">
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
