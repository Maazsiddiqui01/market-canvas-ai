import { supabase } from '@/integrations/supabase/client';

export interface Stock {
  ticker: string;
  name: string;
  sector: string;
}

export const SECTORS = [
  'AUTOMOBILE ASSEMBLER',
  'AUTOMOBILE PARTS & ACCESSORIES',
  'CABLE & ELECTRICAL GOODS',
  'CEMENT',
  'CHEMICAL',
  'CLOSE - END MUTUAL FUND',
  'COMMERCIAL BANKS',
  'ENGINEERING',
  'EXCHANGE TRADED FUNDS',
  'FERTILIZER',
  'FOOD & PERSONAL CARE PRODUCTS',
  'GLASS & CERAMICS',
  'INSURANCE',
  'INV. BANKS / INV. COS. / SECURITIES COS.',
  'LEASING COMPANIES',
  'LEATHER & TANNERIES',
  'MISCELLANEOUS',
  'MODARABAS',
  'OIL & GAS EXPLORATION COMPANIES',
  'OIL & GAS MARKETING COMPANIES',
  'PAPER, BOARD & PACKAGING',
  'PHARMACEUTICALS',
  'POWER GENERATION & DISTRIBUTION',
  'PROPERTY',
  'REAL ESTATE INVESTMENT TRUST',
  'REFINERY',
  'SUGAR & ALLIED INDUSTRIES',
  'SYNTHETIC & RAYON',
  'TECHNOLOGY & COMMUNICATION',
  'TEXTILE COMPOSITE',
  'TEXTILE SPINNING',
  'TEXTILE WEAVING',
  'TOBACCO',
  'TRANSPORT',
  'VANASPATI & ALLIED INDUSTRIES',
  'WOOLLEN'
];

// Cache for stocks data to avoid repeated database calls
let stocksCache: Stock[] | null = null;

// Function to fetch all stocks from database
export const getAllStocks = async (): Promise<Stock[]> => {
  if (stocksCache) {
    return stocksCache;
  }

  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('symbol, name, sector')
      .order('symbol');

    if (error) {
      console.error('Error fetching stocks:', error);
      return [];
    }

    // Transform data to match our interface
    stocksCache = data.map(stock => ({
      ticker: stock.symbol,
      name: stock.name,
      sector: stock.sector
    }));

    return stocksCache;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return [];
  }
};

// Utility functions
export const getStocksBySector = async (sector: string): Promise<Stock[]> => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('symbol, name, sector')
      .eq('sector', sector)
      .order('symbol');

    if (error) {
      console.error('Error fetching stocks by sector:', error);
      return [];
    }

    return data.map(stock => ({
      ticker: stock.symbol,
      name: stock.name,
      sector: stock.sector
    }));
  } catch (error) {
    console.error('Error fetching stocks by sector:', error);
    return [];
  }
};

export const searchStocks = async (query: string, selectedSector?: string): Promise<Stock[]> => {
  try {
    let supabaseQuery = supabase
      .from('stocks')
      .select('symbol, name, sector');

    // Add sector filter if provided
    if (selectedSector) {
      supabaseQuery = supabaseQuery.eq('sector', selectedSector);
    }

    // Add text search
    supabaseQuery = supabaseQuery.or(
      `symbol.ilike.%${query}%,name.ilike.%${query}%`
    );

    supabaseQuery = supabaseQuery.order('symbol').limit(20);

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching stocks:', error);
      return [];
    }

    return data.map(stock => ({
      ticker: stock.symbol,
      name: stock.name,
      sector: stock.sector
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

export const getAllTickers = async (): Promise<string[]> => {
  const stocks = await getAllStocks();
  return stocks.map(stock => stock.ticker);
};

export const getStockByTicker = async (ticker: string): Promise<Stock | undefined> => {
  try {
    const { data, error } = await supabase
      .from('stocks')
      .select('symbol, name, sector')
      .eq('symbol', ticker.toUpperCase())
      .single();

    if (error || !data) {
      console.error('Error fetching stock by ticker:', error);
      return undefined;
    }

    return {
      ticker: data.symbol,
      name: data.name,
      sector: data.sector
    };
  } catch (error) {
    console.error('Error fetching stock by ticker:', error);
    return undefined;
  }
};