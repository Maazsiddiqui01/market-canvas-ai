import { defineMcp } from "@lovable.dev/mcp-js";
import getStockPrice from "./tools/get-stock-price";
import searchStocks from "./tools/search-stocks";

export default defineMcp({
  name: "market-canvas-ai-mcp",
  title: "Market Canvas AI",
  version: "0.1.0",
  instructions:
    "Public tools for Market Canvas AI. Use `search_stocks` to find a PSX or US ticker by symbol or company name, and `get_stock_price` to fetch the latest price, absolute change, and percent change for a ticker. This server exposes only public market data — no user portfolios, watchlists, or alerts.",
  tools: [searchStocks, getStockPrice],
});
