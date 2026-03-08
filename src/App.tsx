import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { usePageTracking } from "@/hooks/usePageTracking";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { AnimatePresence } from "framer-motion";
import React, { Suspense } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy-loaded dashboard pages
const DashboardHomePage = React.lazy(() => import("./pages/dashboard/DashboardHomePage"));
const MarketPage = React.lazy(() => import("./pages/dashboard/MarketPage"));
const AIToolsPage = React.lazy(() => import("./pages/dashboard/AIToolsPage"));
const PortfolioPage = React.lazy(() => import("./pages/dashboard/PortfolioPage"));
const WatchlistPage = React.lazy(() => import("./pages/dashboard/WatchlistPage"));
const AlertsPage = React.lazy(() => import("./pages/dashboard/AlertsPage"));
const NewsPage = React.lazy(() => import("./pages/dashboard/NewsPage"));
const ToolsPage = React.lazy(() => import("./pages/dashboard/ToolsPage"));
const HistoryPage = React.lazy(() => import("./pages/dashboard/HistoryPage"));
const AdminAnalyticsPage = React.lazy(() => import("./pages/dashboard/AdminAnalyticsPage"));

const queryClient = new QueryClient();

const PageTracker = () => {
  usePageTracking();
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Dashboard routes - lazy loaded */}
        <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen />}><DashboardHomePage /></Suspense>} />
        <Route path="/dashboard/market" element={<Suspense fallback={<LoadingScreen />}><MarketPage /></Suspense>} />
        <Route path="/dashboard/ai-tools" element={<Suspense fallback={<LoadingScreen />}><AIToolsPage /></Suspense>} />
        <Route path="/dashboard/portfolio" element={<Suspense fallback={<LoadingScreen />}><PortfolioPage /></Suspense>} />
        <Route path="/dashboard/watchlist" element={<Suspense fallback={<LoadingScreen />}><WatchlistPage /></Suspense>} />
        <Route path="/dashboard/alerts" element={<Suspense fallback={<LoadingScreen />}><AlertsPage /></Suspense>} />
        <Route path="/dashboard/news" element={<Suspense fallback={<LoadingScreen />}><NewsPage /></Suspense>} />
        <Route path="/dashboard/tools" element={<Suspense fallback={<LoadingScreen />}><ToolsPage /></Suspense>} />
        <Route path="/dashboard/history" element={<Suspense fallback={<LoadingScreen />}><HistoryPage /></Suspense>} />
        <Route path="/dashboard/analytics" element={<Suspense fallback={<LoadingScreen />}><AdminAnalyticsPage /></Suspense>} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker />
          <PWAInstallPrompt />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
