import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const insertPortfolioMock = vi.fn();
let portfoliosData: any[] = [];

vi.mock("@/integrations/supabase/client", async () => {
  const { makeFrom, makeSupabaseMock, createQueryMock } = await import("./utils");
  const from = makeFrom({
    portfolios: () => ({
      select: () => ({
        order: () => Promise.resolve({ data: portfoliosData, error: null }),
      }),
      insert: (row: any) => {
        insertPortfolioMock(row);
        return {
          select: () => ({
            single: () =>
              Promise.resolve({
                data: { id: "p-new", name: row.name, created_at: new Date().toISOString() },
                error: null,
              }),
          }),
        };
      },
    }),
    portfolio_holdings: () => createQueryMock({ data: [], error: null }),
    portfolio_positions: () => createQueryMock({ data: [], error: null }),
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

// Heavy chart children — not under test
vi.mock("@/components/portfolio/PortfolioCharts", () => ({
  PortfolioCharts: () => null,
}));
vi.mock("@/components/portfolio/PortfolioHistoryChart", () => ({
  PortfolioHistoryChart: () => null,
}));
vi.mock("@/components/portfolio/SectorBreakdown", () => ({
  SectorBreakdown: () => null,
}));
vi.mock("@/data/stockData", () => ({
  getStockByTicker: vi.fn(async () => null),
}));

import { PortfolioManager } from "@/components/portfolio/PortfolioManager";

describe("Portfolio smoke flow", () => {
  beforeEach(() => {
    insertPortfolioMock.mockClear();
    portfoliosData = [];
  });

  it("shows the empty state when user has no portfolio", async () => {
    render(<PortfolioManager />);
    await waitFor(() => {
      expect(screen.getByText(/No Portfolios Yet/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Create Portfolio/i })).toBeInTheDocument();
  });

  it("saves a new portfolio via supabase when the user clicks Create", async () => {
    const user = userEvent.setup();
    render(<PortfolioManager />);
    await screen.findByText(/No Portfolios Yet/i);

    await user.click(screen.getByRole("button", { name: /Create Portfolio/i }));

    await waitFor(() => expect(insertPortfolioMock).toHaveBeenCalledTimes(1));
    expect(insertPortfolioMock.mock.calls[0][0]).toMatchObject({
      user_id: "test-user-id",
      name: "My Portfolio",
    });
  });

  it("renders portfolio summary when portfolios exist", async () => {
    portfoliosData = [{ id: "p1", name: "Main", created_at: new Date().toISOString() }];
    render(<PortfolioManager />);
    await waitFor(() => {
      expect(screen.getByText(/Current Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Total P&L/i)).toBeInTheDocument();
    });
  });
});
