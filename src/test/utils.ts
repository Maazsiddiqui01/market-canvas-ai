import { vi } from "vitest";

/**
 * Builds a chainable query mock that resolves to a configurable result.
 * Supports the subset of supabase-js used by the app: select/insert/update/delete,
 * eq/in/order/single, and is awaitable (thenable).
 */
export function createQueryMock(result: { data?: any; error?: any } = { data: [], error: null }) {
  const promise = Promise.resolve(result);
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === "then") return promise.then.bind(promise);
      if (prop === "catch") return promise.catch.bind(promise);
      if (prop === "finally") return promise.finally.bind(promise);
      // any chain method returns the same proxy
      return () => proxy;
    },
  };
  const proxy: any = new Proxy(function () {}, handler);
  return proxy;
}

export type TableHandler = (table: string) => any;

/**
 * Creates a vi.fn() `from` that dispatches by table name.
 * Tables not in the map default to an empty success result.
 */
export function makeFrom(handlers: Record<string, () => any>) {
  return vi.fn((table: string) => {
    const fn = handlers[table];
    return fn ? fn() : createQueryMock({ data: [], error: null });
  });
}

export function makeSupabaseMock(opts: {
  from?: ReturnType<typeof makeFrom>;
  invoke?: ReturnType<typeof vi.fn>;
} = {}) {
  return {
    from: opts.from ?? vi.fn(() => createQueryMock()),
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(async () => ({ data: { session: null } })),
    },
    functions: {
      invoke: opts.invoke ?? vi.fn(async () => ({ data: { prices: {} }, error: null })),
    },
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    })),
    removeChannel: vi.fn(),
  };
}

export const mockUser = { id: "test-user-id", email: "test@example.com" };

export function mockAuthContext(user: any = mockUser) {
  return {
    useAuth: () => ({
      user,
      session: user ? { user } : null,
      loading: false,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  };
}
