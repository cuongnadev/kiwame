"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AppUser = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
};

export function useAppUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      setUser({
        id: user.id,
        email: user.email!,
        username: profile?.username ?? "",
        full_name: profile?.full_name ?? "",
        avatar_url: profile?.avatar_url ?? null,
      });

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { user, loading };
}
