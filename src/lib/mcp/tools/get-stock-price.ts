import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_stock_price",
  title: "Get stock price",
  description:
    "Get the latest price, absolute change, and percent change for a PSX (Pakistan Stock Exchange) or US stock ticker.",
  inputSchema: {
    ticker: z.string().trim().min(1).describe("Ticker symbol, e.g. \"OGDC\" for PSX or \"AAPL\" for US."),
    market: z.enum(["PSX", "US"]).default("PSX").describe("Which market the ticker belongs to."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ ticker, market }) => {
    const base = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (!base || !anon) {
      return { content: [{ type: "text", text: "Supabase env not configured" }], isError: true };
    }
    try {
      const r = await fetch(`${base}/functions/v1/get-stock-prices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anon}`,
          apikey: anon,
        },
        body: JSON.stringify({ tickers: [ticker.toUpperCase()], market }),
      });
      const text = await r.text();
      if (!r.ok) {
        return { content: [{ type: "text", text: `Upstream ${r.status}: ${text}` }], isError: true };
      }
      return {
        content: [{ type: "text", text }],
        structuredContent: { raw: safeJson(text) },
      };
    } catch (e) {
      return { content: [{ type: "text", text: `Fetch failed: ${(e as Error).message}` }], isError: true };
    }
  },
});

function safeJson(t: string): unknown {
  try { return JSON.parse(t); } catch { return t; }
}
