
const TRADINGVIEW_API_BASE = 'https://scanner.tradingview.com/pakistan/scan';

export interface StockData {
  name: string;
  close: number;
  change: number;
  change_abs: number;
  volume: number;
  market_cap_basic?: number;
}

export interface TradingViewResponse {
  data: {
    d: (string | number)[][];
  };
}

// Fetch KSE-100 data
export const fetchKSE100Data = async (): Promise<StockData | null> => {
  try {
    const payload = {
      symbols: {
        tickers: ["PSX:KSE100"],
        query: {
          types: []
        }
      },
      columns: ["name", "close", "change", "change_abs", "volume"]
    };

    const response = await fetch(TRADINGVIEW_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch KSE-100 data');
    }

    const data: TradingViewResponse = await response.json();
    
    if (data.data && data.data.d && data.data.d.length > 0) {
      const stockData = data.data.d[0];
      return {
        name: stockData[0] as string,
        close: stockData[1] as number,
        change: stockData[2] as number,
        change_abs: stockData[3] as number,
        volume: stockData[4] as number
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching KSE-100 data:', error);
    return null;
  }
};

// Fetch top gainers and losers
export const fetchTopStocks = async (sortOrder: 'desc' | 'asc' = 'desc'): Promise<StockData[]> => {
  try {
    const payload = {
      filter: [],
      symbols: {
        query: {
          types: []
        },
        tickers: []
      },
      columns: ["name", "close", "change", "change_abs", "volume", "market_cap_basic"],
      sort: {
        sortBy: "change",
        sortOrder: sortOrder
      },
      options: {
        lang: "en"
      }
    };

    const response = await fetch(TRADINGVIEW_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data: TradingViewResponse = await response.json();
    
    if (data.data && data.data.d) {
      return data.data.d.slice(0, 5).map(stock => ({
        name: stock[0] as string,
        close: stock[1] as number,
        change: stock[2] as number,
        change_abs: stock[3] as number,
        volume: stock[4] as number,
        market_cap_basic: stock[5] as number
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return [];
  }
};

// Fetch top gainers
export const fetchTopGainers = () => fetchTopStocks('desc');

// Fetch top losers
export const fetchTopLosers = () => fetchTopStocks('asc');
