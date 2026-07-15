import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_stocks",
  title: "Search stocks",
  description:
    "Search the public Market Canvas AI catalog of PSX (Pakistan Stock Exchange) or US stocks by ticker symbol or company name. Returns up to 20 matches.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Text to match against ticker symbol or company name."),
    market: z.enum(["PSX", "US"]).default("PSX").describe("Which market to search in."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, market }) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Supabase env not configured" }], isError: true };
    }
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const table = market === "US" ? "us_stocks" : "Stocks";
    const { data, error } = await supabase
      .from(table as any)
      .select("symbol, name, sector")
      .or(`symbol.ilike.%${query}%,name.ilike.%${query}%`)
      .order("symbol")
      .limit(20);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = (data ?? []).map((r: any) => ({ ticker: r.symbol, name: r.name, sector: r.sector }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { market, count: rows.length, results: rows },
    };
  },
});
