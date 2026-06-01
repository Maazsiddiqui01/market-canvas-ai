import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---- Mocks (must be declared before importing the SUT) ----
const insertMock = vi.fn();
const deleteMock = vi.fn();
const fetchResult = {
  data: [
    { id: "w1", ticker: "OGDC", stock_name: "Oil & Gas", added_at: new Date().toISOString() },
    { id: "w2", ticker: "MEBL", stock_name: null, added_at: new Date().toISOString() },
  ],
  error: null,
};

vi.mock("@/integrations/supabase/client", async () => {
  const { createQueryMock, makeSupabaseMock, makeFrom } = await import("./utils");
  const from = makeFrom({
    watchlists: () => {
      // chainable query supporting select().order(), insert().select().single(), delete().eq()
      const handler = {
        select: () => ({ order: () => Promise.resolve(fetchResult) }),
        insert: (row: any) => {
          insertMock(row);
          return {
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    id: "new-id",
                    ticker: row.ticker,
                    stock_name: row.stock_name,
                    added_at: new Date().toISOString(),
                  },
                  error: null,
                }),
            }),
          };
        },
        delete: () => ({
          eq: (_col: string, id: string) => {
            deleteMock(id);
            return Promise.resolve({ error: null });
          },
        }),
      };
      return handler;
    },
  });
  return { supabase: makeSupabaseMock({ from }) };
});

vi.mock("@/contexts/AuthContext", async () => {
  const { mockAuthContext } = await import("./utils");
  return mockAuthContext();
});

vi.mock("@/hooks/useActivityLog", () => ({
  useActivityLog: () => ({ logActivity: vi.fn() }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

import { WatchlistManager } from "@/components/watchlist/WatchlistManager";

describe("Watchlist smoke flow", () => {
  beforeEach(() => {
    insertMock.mockClear();
    deleteMock.mockClear();
  });

  it("loads and renders watchlist items from supabase", async () => {
    render(<WatchlistManager />);
    await waitFor(() => {
      expect(screen.getByText("OGDC")).toBeInTheDocument();
      expect(screen.getByText("MEBL")).toBeInTheDocument();
    });
    expect(screen.getByText(/2 stocks being watched/i)).toBeInTheDocument();
  });

  it("adds a new ticker via the input + Add button", async () => {
    const user = userEvent.setup();
    render(<WatchlistManager />);
    await screen.findByText("OGDC");

    await user.type(screen.getByPlaceholderText(/Ticker/i), "engro");
    await user.click(screen.getByRole("button", { name: /^Add$/i }));

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledTimes(1);
    });
    // ensures we uppercase + only send ticker (no company-only payload corruption)
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      ticker: "ENGRO",
      user_id: "test-user-id",
    });
  });

  it("preserves the a11y label for the remove button", async () => {
    render(<WatchlistManager />);
    await waitFor(() =>
      expect(screen.getByLabelText("Remove OGDC from watchlist")).toBeInTheDocument()
    );
  });
});
