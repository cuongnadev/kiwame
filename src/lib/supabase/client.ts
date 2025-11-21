import { createBrowserClient } from "@supabase/ssr";
import { kiwameConfig } from "@/config/kiwame.config";

export function createSupabaseBrowserClient() {
  return createBrowserClient(kiwameConfig.supabaseUrl, kiwameConfig.supabaseAnonKey);
}
