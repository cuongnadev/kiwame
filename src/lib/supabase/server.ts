import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { kiwameConfig } from "@/config/kiwame.config";

// Use this client for calls that originate from the server in the context of a user session.
// See createSupabaseWorkerClient() for a headless client that does not carry user-session context.
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  console.log(kiwameConfig.supabaseUrl, kiwameConfig.supabaseAnonKey);

  return createServerClient(
    kiwameConfig.supabaseUrl,
    kiwameConfig.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
