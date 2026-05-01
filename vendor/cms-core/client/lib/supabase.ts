import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl
    && supabaseAnonKey
    && /^https?:\/\//.test(supabaseUrl),
);

export const supabaseConfigError = new Error(
  "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
);

function createQueryStub(result: { data: null; error: Error }) {
  const promise = Promise.resolve(result);

  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (prop === "then") {
          return promise.then.bind(promise);
        }

        if (prop === "catch") {
          return promise.catch.bind(promise);
        }

        if (prop === "finally") {
          return promise.finally.bind(promise);
        }

        return () => createQueryStub(result);
      },
    },
  );
}

const unconfiguredSupabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({
      data: {
        subscription: {
          unsubscribe: () => undefined,
        },
      },
    }),
  },
  from: () => createQueryStub({ data: null, error: supabaseConfigError }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: supabaseConfigError }),
      update: async () => ({ data: null, error: supabaseConfigError }),
      remove: async () => ({ data: null, error: supabaseConfigError }),
      list: async () => ({ data: null, error: supabaseConfigError }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
} as unknown as SupabaseClient;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: sessionStorage,
        persistSession: true,
      },
    })
  : unconfiguredSupabase;
