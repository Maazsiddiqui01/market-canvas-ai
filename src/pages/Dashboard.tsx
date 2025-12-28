import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import { PortfolioManager } from '@/components/portfolio/PortfolioManager';
import { WatchlistManager } from '@/components/watchlist/WatchlistManager';
import { AISearchWidget } from '@/components/ai/AISearchWidget';
import { RecentSearches } from '@/components/dashboard/RecentSearches';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Eye, Brain, History, TrendingUp, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <TrendingUp className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-scale">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">
              Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your portfolio, track stocks, and get AI-powered insights
          </p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="ai-search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid gap-2">
            <TabsTrigger value="ai-search" className="gap-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Search</span>
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Portfolio</span>
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="gap-2">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Watchlist</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-search" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AISearchWidget />
              </div>
              <div>
                <RecentSearches />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioManager />
          </TabsContent>

          <TabsContent value="watchlist">
            <WatchlistManager />
          </TabsContent>

          <TabsContent value="history">
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Search History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentSearches showAll />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
