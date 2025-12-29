import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Home',
  '/dashboard/market': 'Market',
  '/dashboard/ai-tools': 'AI Tools',
  '/dashboard/portfolio': 'Portfolio',
  '/dashboard/watchlist': 'Watchlist',
  '/dashboard/alerts': 'Alerts',
  '/dashboard/news': 'News',
  '/dashboard/tools': 'Tools',
};

export const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Build breadcrumb items
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = routeLabels[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const isLast = index === pathSegments.length - 1;
    
    return { path, label, isLast };
  });

  // Don't show breadcrumbs on main dashboard home
  if (location.pathname === '/dashboard') {
    return null;
  }

  return (
    <nav className="flex items-center gap-1 text-sm mb-4 animate-fade-in">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>Home</span>
      </Link>
      
      {breadcrumbs.slice(1).map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link 
              to={crumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};
