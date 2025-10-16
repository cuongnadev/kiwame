import { createBrowserClient } from "@supabase/ssr";
import { kiwameConfig } from "@/utils/kiwameConfig";

export function createSupabaseBrowserClient() {
  return createBrowserClient(kiwameConfig.supabaseUrl, kiwameConfig.supabaseAnonKey);
}
