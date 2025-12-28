import { supabase } from '@/integrations/supabase/client';

interface ExportData {
  headers: string[];
  rows: string[][];
}

export const exportToCSV = (data: ExportData, filename: string) => {
  const csvContent = [
    data.headers.join(','),
    ...data.rows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const escaped = String(cell).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')
          ? `"${escaped}"`
          : escaped;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportPortfolio = async (userId: string): Promise<boolean> => {
  try {
    // Fetch portfolios
    const { data: portfolios, error: portfolioError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId);

    if (portfolioError) throw portfolioError;

    if (!portfolios || portfolios.length === 0) {
      return false;
    }

    // Fetch holdings for all portfolios
    const { data: holdings, error: holdingsError } = await supabase
      .from('portfolio_holdings')
      .select('*, portfolios!inner(name)')
      .in('portfolio_id', portfolios.map(p => p.id));

    if (holdingsError) throw holdingsError;

    const exportData: ExportData = {
      headers: ['Portfolio', 'Ticker', 'Stock Name', 'Shares', 'Avg Buy Price', 'Added At'],
      rows: (holdings || []).map(h => [
        (h as any).portfolios?.name || 'Unknown',
        h.ticker,
        h.stock_name || '',
        String(h.shares),
        h.avg_buy_price ? String(h.avg_buy_price) : '',
        new Date(h.added_at).toLocaleDateString()
      ])
    };

    exportToCSV(exportData, 'portfolio');
    return true;
  } catch (error) {
    console.error('Error exporting portfolio:', error);
    return false;
  }
};

export const exportWatchlist = async (userId: string): Promise<boolean> => {
  try {
    const { data: watchlist, error } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });

    if (error) throw error;

    if (!watchlist || watchlist.length === 0) {
      return false;
    }

    const exportData: ExportData = {
      headers: ['Ticker', 'Stock Name', 'Added At'],
      rows: watchlist.map(w => [
        w.ticker,
        w.stock_name || '',
        new Date(w.added_at).toLocaleDateString()
      ])
    };

    exportToCSV(exportData, 'watchlist');
    return true;
  } catch (error) {
    console.error('Error exporting watchlist:', error);
    return false;
  }
};

export const exportSearchHistory = async (userId: string): Promise<boolean> => {
  try {
    const { data: history, error } = await supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false });

    if (error) throw error;

    if (!history || history.length === 0) {
      return false;
    }

    const exportData: ExportData = {
      headers: ['Ticker', 'Stock Name', 'Sector', 'Searched At'],
      rows: history.map(h => [
        h.ticker,
        h.stock_name || '',
        h.sector || '',
        new Date(h.searched_at).toLocaleString()
      ])
    };

    exportToCSV(exportData, 'search_history');
    return true;
  } catch (error) {
    console.error('Error exporting search history:', error);
    return false;
  }
};

export const exportPriceAlerts = async (userId: string): Promise<boolean> => {
  try {
    const { data: alerts, error } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!alerts || alerts.length === 0) {
      return false;
    }

    const exportData: ExportData = {
      headers: ['Ticker', 'Stock Name', 'Target Price', 'Alert Type', 'Triggered', 'Created At'],
      rows: alerts.map(a => [
        a.ticker,
        a.stock_name || '',
        String(a.target_price),
        a.alert_type,
        a.is_triggered ? 'Yes' : 'No',
        new Date(a.created_at).toLocaleString()
      ])
    };

    exportToCSV(exportData, 'price_alerts');
    return true;
  } catch (error) {
    console.error('Error exporting price alerts:', error);
    return false;
  }
};
