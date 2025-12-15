"use client";

import { useCallback, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type AppUser = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  channel?: {
    name: string; // "@Kiwame Studio"
  } | null;
};

export function useAppUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    setLoading(true);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, full_name, avatar_url")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Lỗi lấy profile:", profileError);
    }

    let channelData = null;
    if (authUser.id) {
      const { data: channel, error: channelError } = await supabase
        .from("channels")
        .select("name")
        .eq("owner_id", authUser.id)
        .maybeSingle();

      if (channelError && channelError.code !== "PGRST116") {
        console.error("Lỗi lấy channel:", channelError);
      }

      if (channel) {
        channelData = {
          name: channel.name,
        };
      }
    }

    setUser({
      id: authUser.id,
      email: authUser.email!,
      username: profile?.username ?? authUser.email!.split("@")[0],
      full_name: profile?.full_name ?? "",
      avatar_url: profile?.avatar_url ?? null,
      channel: channelData,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
      } else {
        loadUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  return { user, loading, refetch: loadUser };
}
