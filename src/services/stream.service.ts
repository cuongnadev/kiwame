"use server";

import { kiwameConfig } from "@/config/kiwame.config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Stream } from "@/types/stream";

export async function startStream(): Promise<Stream> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Authentication");
  }

  const res = await fetch(
    `${kiwameConfig.nextPublicSiteUrl}/api/live/ingress`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomName: `Room_${user.id}` }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Không thể tạo ingress");
  }

  return res.json();
}
