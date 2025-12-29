import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart3, 
  Brain, 
  Briefcase, 
  Eye, 
  Bell, 
  Newspaper, 
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';

const featureCards = [
  {
    id: 'market',
    title: 'Market Analysis',
    description: 'Live heatmaps, technical & financial analysis, top gainers and losers',
    icon: BarChart3,
    href: '/dashboard/market',
    gradient: 'from-orange-500 to-red-500',
    stats: [
      { label: 'Heatmap', icon: Activity },
      { label: 'Technical', icon: TrendingUp },
      { label: 'Financial', icon: TrendingDown },
    ]
  },
  {
    id: 'ai-tools',
    title: 'AI Tools',
    description: 'AI-powered stock research, market queries, and stock comparison',
    icon: Brain,
    href: '/dashboard/ai-tools',
    gradient: 'from-purple-500 to-pink-500',
    stats: [
      { label: 'AI Search', icon: Zap },
      { label: 'Compare', icon: BarChart3 },
      { label: 'History', icon: Activity },
    ]
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Track your holdings, P&L, sector breakdown, and performance history',
    icon: Briefcase,
    href: '/dashboard/portfolio',
    gradient: 'from-green-500 to-emerald-500',
    stats: [
      { label: 'Holdings', icon: Briefcase },
      { label: 'P&L', icon: TrendingUp },
      { label: 'History', icon: Activity },
    ]
  },
  {
    id: 'watchlist',
    title: 'Watchlist',
    description: 'Monitor your saved stocks with live prices and quick actions',
    icon: Eye,
    href: '/dashboard/watchlist',
    gradient: 'from-blue-500 to-cyan-500',
    stats: [
      { label: 'Stocks', icon: Eye },
      { label: 'Live', icon: Activity },
      { label: 'Alerts', icon: Bell },
    ]
  },
  {
    id: 'alerts',
    title: 'Price Alerts',
    description: 'Set price notifications for target levels on your favorite stocks',
    icon: Bell,
    href: '/dashboard/alerts',
    gradient: 'from-yellow-500 to-orange-500',
    stats: [
      { label: 'Active', icon: Bell },
      { label: 'Triggered', icon: Zap },
      { label: 'Manage', icon: Settings },
    ]
  },
  {
    id: 'news',
    title: 'Market News',
    description: 'Latest market news from PSX sources and financial publications',
    icon: Newspaper,
    href: '/dashboard/news',
    gradient: 'from-indigo-500 to-purple-500',
    stats: [
      { label: 'Latest', icon: Newspaper },
      { label: 'Sources', icon: Activity },
      { label: 'Topics', icon: BarChart3 },
    ]
  },
];

const DashboardHomePage = () => {
  return (
    <DashboardLayout showMarketOverview>
      <div className="space-y-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">+2.4%</p>
                <p className="text-xs text-muted-foreground">Portfolio Today</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Watchlist Stocks</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Bell className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Brain className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">AI Searches</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards Grid */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Explore Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link 
                  key={card.id} 
                  to={card.href}
                  className="group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 animate-fade-in">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient} shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {card.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3">
                        {card.stats.map((stat, idx) => {
                          const StatIcon = stat.icon;
                          return (
                            <div 
                              key={idx}
                              className="flex items-center gap-1.5 text-xs text-muted-foreground"
                            >
                              <StatIcon className="h-3 w-3" />
                              <span>{stat.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Tools Card */}
        <Link to="/dashboard/tools" className="block group">
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 bg-gradient-to-r from-secondary/50 to-muted/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    Tools & Export
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Export your data, manage settings, and access utilities
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHomePage;
