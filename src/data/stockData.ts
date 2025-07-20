// Stock data organized by sectors
// You can replace this with your actual Excel data

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

// Sample stock data - replace with your actual data from Excel
export const STOCKS: Stock[] = [
  // COMMERCIAL BANKS
  { ticker: 'HBL', name: 'Habib Bank Limited', sector: 'COMMERCIAL BANKS' },
  { ticker: 'UBL', name: 'United Bank Limited', sector: 'COMMERCIAL BANKS' },
  { ticker: 'MEBL', name: 'Muslim Commercial Bank Limited', sector: 'COMMERCIAL BANKS' },
  { ticker: 'NBP', name: 'National Bank of Pakistan', sector: 'COMMERCIAL BANKS' },
  { ticker: 'ABL', name: 'Allied Bank Limited', sector: 'COMMERCIAL BANKS' },
  { ticker: 'BAFL', name: 'Bank Alfalah Limited', sector: 'COMMERCIAL BANKS' },
  
  // FERTILIZER
  { ticker: 'ENGRO', name: 'Engro Corporation Limited', sector: 'FERTILIZER' },
  { ticker: 'FFC', name: 'Fauji Fertilizer Company Limited', sector: 'FERTILIZER' },
  { ticker: 'FFBL', name: 'Fauji Fertilizer Bin Qasim Limited', sector: 'FERTILIZER' },
  
  // CEMENT
  { ticker: 'LUCK', name: 'Lucky Cement Limited', sector: 'CEMENT' },
  { ticker: 'DGKC', name: 'D. G. Khan Cement Company Limited', sector: 'CEMENT' },
  { ticker: 'MLCF', name: 'Maple Leaf Cement Factory Limited', sector: 'CEMENT' },
  
  // OIL & GAS MARKETING COMPANIES
  { ticker: 'PSO', name: 'Pakistan State Oil Company Limited', sector: 'OIL & GAS MARKETING COMPANIES' },
  { ticker: 'HASCOL', name: 'Hascol Petroleum Limited', sector: 'OIL & GAS MARKETING COMPANIES' },
  { ticker: 'SHEL', name: 'Shell Pakistan Limited', sector: 'OIL & GAS MARKETING COMPANIES' },
  
  // OIL & GAS EXPLORATION COMPANIES
  { ticker: 'OGDC', name: 'Oil and Gas Development Company Limited', sector: 'OIL & GAS EXPLORATION COMPANIES' },
  { ticker: 'PPL', name: 'Pakistan Petroleum Limited', sector: 'OIL & GAS EXPLORATION COMPANIES' },
  { ticker: 'MARI', name: 'Mari Petroleum Company Limited', sector: 'OIL & GAS EXPLORATION COMPANIES' },
  
  // POWER GENERATION & DISTRIBUTION
  { ticker: 'HUBC', name: 'Hub Power Company Limited', sector: 'POWER GENERATION & DISTRIBUTION' },
  { ticker: 'KAPCO', name: 'Kot Addu Power Company Limited', sector: 'POWER GENERATION & DISTRIBUTION' },
  { ticker: 'SNGP', name: 'Sui Northern Gas Pipelines Limited', sector: 'POWER GENERATION & DISTRIBUTION' },
  { ticker: 'SSGC', name: 'Sui Southern Gas Company Limited', sector: 'POWER GENERATION & DISTRIBUTION' },
  
  // FOOD & PERSONAL CARE PRODUCTS
  { ticker: 'NESTLE', name: 'Nestlé Pakistan Limited', sector: 'FOOD & PERSONAL CARE PRODUCTS' },
  { ticker: 'UFL', name: 'Unity Foods Limited', sector: 'FOOD & PERSONAL CARE PRODUCTS' },
  { ticker: 'COLG', name: 'Colgate Palmolive (Pakistan) Limited', sector: 'FOOD & PERSONAL CARE PRODUCTS' },
  
  // TECHNOLOGY & COMMUNICATION
  { ticker: 'TRG', name: 'The Resource Group Limited', sector: 'TECHNOLOGY & COMMUNICATION' },
  { ticker: 'PTCL', name: 'Pakistan Telecommunication Company Limited', sector: 'TECHNOLOGY & COMMUNICATION' },
  { ticker: 'NETSOL', name: 'NetSol Technologies Limited', sector: 'TECHNOLOGY & COMMUNICATION' },
  
  // AUTOMOBILE ASSEMBLER
  { ticker: 'INDU', name: 'Indus Motor Company Limited', sector: 'AUTOMOBILE ASSEMBLER' },
  { ticker: 'PSMC', name: 'Pak Suzuki Motor Company Limited', sector: 'AUTOMOBILE ASSEMBLER' },
  { ticker: 'HCAR', name: 'Honda Atlas Cars (Pakistan) Limited', sector: 'AUTOMOBILE ASSEMBLER' },
  
  // TEXTILE COMPOSITE
  { ticker: 'GADT', name: 'Gul Ahmed Textile Mills Limited', sector: 'TEXTILE COMPOSITE' },
  { ticker: 'KTML', name: 'Kohinoor Textile Mills Limited', sector: 'TEXTILE COMPOSITE' },
  { ticker: 'DAWH', name: 'D.A.W.H. Textile Mills Limited', sector: 'TEXTILE COMPOSITE' },
  
  // PHARMACEUTICALS
  { ticker: 'SEARL', name: 'The Searle Company Limited', sector: 'PHARMACEUTICALS' },
  { ticker: 'GLAXO', name: 'GlaxoSmithKline Pakistan Limited', sector: 'PHARMACEUTICALS' },
  { ticker: 'ABBOTT', name: 'Abbott Laboratories (Pakistan) Limited', sector: 'PHARMACEUTICALS' },
  
  // CHEMICAL
  { ticker: 'ICI', name: 'ICI Pakistan Limited', sector: 'CHEMICAL' },
  { ticker: 'LOTTE', name: 'Lotte Chemical Pakistan Limited', sector: 'CHEMICAL' },
  { ticker: 'BIPL', name: 'Berger Paints Pakistan Limited', sector: 'CHEMICAL' },
  
  // Add KSE100 as miscellaneous for index
  { ticker: 'KSE100', name: 'KSE-100 Index', sector: 'MISCELLANEOUS' },
  
  // INSURANCE
  { ticker: 'ADAMJEE', name: 'Adamjee Insurance Company Limited', sector: 'INSURANCE' },
  { ticker: 'EFOODS', name: 'EFU Life Assurance Limited', sector: 'INSURANCE' },
  { ticker: 'ILP', name: 'IGI Life Insurance Limited', sector: 'INSURANCE' },
];

// Utility functions
export const getStocksBySector = (sector: string): Stock[] => {
  return STOCKS.filter(stock => stock.sector === sector);
};

export const searchStocks = (query: string, selectedSector?: string): Stock[] => {
  const searchQuery = query.toLowerCase();
  let filteredStocks = selectedSector 
    ? STOCKS.filter(stock => stock.sector === selectedSector)
    : STOCKS;
  
  return filteredStocks.filter(stock => 
    stock.ticker.toLowerCase().includes(searchQuery) ||
    stock.name.toLowerCase().includes(searchQuery)
  );
};

export const getAllTickers = (): string[] => {
  return STOCKS.map(stock => stock.ticker);
};

export const getStockByTicker = (ticker: string): Stock | undefined => {
  return STOCKS.find(stock => stock.ticker.toLowerCase() === ticker.toLowerCase());
};