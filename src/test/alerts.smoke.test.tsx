import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const insertMock = vi.fn();
let fetchData: any[] = [];

vi.mock("@/integrations/supabase/client", async () => {
  const { makeFrom, makeSupabaseMock } = await import("./utils");
  const from = makeFrom({
    price_alerts: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: fetchData, error: null }),
        }),
      }),
      insert: (row: any) => {
        insertMock(row);
        return Promise.resolve({ error: null });
      },
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
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

import { PriceAlertManager } from "@/components/alerts/PriceAlertManager";

describe("Price alerts smoke flow", () => {
  beforeEach(() => {
    insertMock.mockClear();
    fetchData = [];
  });

  it("renders empty state when no alerts exist", async () => {
    render(<PriceAlertManager />);
    await waitFor(() => {
      expect(screen.getByText(/No price alerts set/i)).toBeInTheDocument();
    });
    // a11y guarantees on the refresh-check icon button
    expect(
      screen.getByLabelText(/Check alerts against current prices/i)
    ).toBeInTheDocument();
  });

  it("renders existing alerts with ticker + target price", async () => {
    fetchData = [
      {
        id: "a1",
        ticker: "HBL",
        stock_name: "Habib Bank",
        target_price: 150,
        alert_type: "above",
        is_triggered: false,
        triggered_at: null,
        created_at: new Date().toISOString(),
      },
    ];
    render(<PriceAlertManager />);
    await waitFor(() => {
      expect(screen.getByText("HBL")).toBeInTheDocument();
    });
    expect(screen.getByText(/Above PKR 150/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Delete alert/i)).toBeInTheDocument();
  });

  it("creates a new alert via the dialog form", async () => {
    const user = userEvent.setup();
    render(<PriceAlertManager />);
    await waitFor(() => screen.getByText(/No price alerts set/i));

    await user.click(screen.getByRole("button", { name: /Add Alert/i }));
    await screen.findByText(/Create Price Alert/i);

    await user.type(screen.getByLabelText(/Stock Ticker/i), "ogdc");
    await user.type(screen.getByLabelText(/Target Price/i), "120.5");

    await user.click(screen.getByRole("button", { name: /^Create Alert$/i }));

    await waitFor(() => expect(insertMock).toHaveBeenCalledTimes(1));
    expect(insertMock.mock.calls[0][0]).toMatchObject({
      user_id: "test-user-id",
      ticker: "OGDC",
      target_price: 120.5,
      alert_type: "above",
    });
  });
});
