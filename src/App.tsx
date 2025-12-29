import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Dashboard pages
import MarketPage from "./pages/dashboard/MarketPage";
import AIToolsPage from "./pages/dashboard/AIToolsPage";
import PortfolioPage from "./pages/dashboard/PortfolioPage";
import WatchlistPage from "./pages/dashboard/WatchlistPage";
import AlertsPage from "./pages/dashboard/AlertsPage";
import NewsPage from "./pages/dashboard/NewsPage";
import ToolsPage from "./pages/dashboard/ToolsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<MarketPage />} />
            <Route path="/dashboard/market" element={<MarketPage />} />
            <Route path="/dashboard/ai-tools" element={<AIToolsPage />} />
            <Route path="/dashboard/portfolio" element={<PortfolioPage />} />
            <Route path="/dashboard/watchlist" element={<WatchlistPage />} />
            <Route path="/dashboard/alerts" element={<AlertsPage />} />
            <Route path="/dashboard/news" element={<NewsPage />} />
            <Route path="/dashboard/tools" element={<ToolsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
