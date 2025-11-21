import { createClient } from "@supabase/supabase-js";
import { kiwameConfig } from "@/config/kiwame.config";

// Use this client for calls that originate from the server OUTSIDE the context of a user session.
// See createSupabaseServerClient() for a server-side client that that executes user-originated operations.
export const createSupabaseWorkerClient = () => {
  return createClient(kiwameConfig.supabaseUrl, kiwameConfig.supabaseAdminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
