import React from 'react';
import { TrendingUp, BarChart3, PieChart, Bell, Search } from 'lucide-react';

const DashboardMockup = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Glow effect behind the mockup */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl opacity-60" />
      
      {/* Main mockup container */}
      <div className="relative bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden transform perspective-1000 hover:scale-[1.02] transition-all duration-500">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border/50">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1 bg-background/50 rounded-md text-xs text-muted-foreground">
              marketcanvas.ai/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-4 md:p-6 bg-gradient-to-br from-background to-muted/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-card border border-border/50">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="p-2 rounded-lg bg-card border border-border/50">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-card/80 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Portfolio Value</div>
              <div className="text-lg font-bold text-foreground">PKR 2.45M</div>
              <div className="text-xs text-green-500">+12.4%</div>
            </div>
            <div className="p-3 rounded-xl bg-card/80 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Today's P&L</div>
              <div className="text-lg font-bold text-foreground">+PKR 48,230</div>
              <div className="text-xs text-green-500">+1.9%</div>
            </div>
            <div className="p-3 rounded-xl bg-card/80 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Active Alerts</div>
              <div className="text-lg font-bold text-foreground">7</div>
              <div className="text-xs text-primary">2 triggered</div>
            </div>
          </div>

          {/* Chart area */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 p-4 rounded-xl bg-card/80 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Portfolio Performance</span>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              {/* Fake chart bars */}
              <div className="flex items-end gap-2 h-24">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-card/80 border border-border/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground">Allocation</span>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
              {/* Fake pie chart */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-8 border-primary/80" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)' }} />
                <div className="absolute inset-0 rounded-full border-8 border-accent/80" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }} />
                <div className="absolute inset-0 rounded-full border-8 border-muted/50" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 100%, 50% 100%)' }} />
                <div className="absolute inset-2 rounded-full bg-card" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute -right-4 top-1/4 p-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg animate-float">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-foreground">MEBL +2.3%</span>
        </div>
      </div>
      
      <div className="absolute -left-4 bottom-1/3 p-3 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2">
          <Bell className="h-3 w-3 text-primary" />
          <span className="text-xs font-medium text-foreground">Alert triggered</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
