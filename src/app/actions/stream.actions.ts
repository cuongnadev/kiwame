"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { StreamRow } from "@/types/stream";
import { ChannelRow } from "@/types/video";

export async function getHomeStreams() {
  const supabase = await createSupabaseServerClient();

  const { data: liveStreams, error } = await supabase
    .from("streams")
    .select(`
      id,
      title,
      room_name,
      is_live,
      thumbnail_url,
      started_at,
      channels (
        id,
        name,
        avatar_url
      )
    `)
    .eq("is_live", true)
    .order("started_at", { ascending: false })
    .limit(10)
    .returns<StreamRow[]>();

  if (error) {
    console.error("Error fetching live streams:", error);
    return [];
  }

  if (!liveStreams) return [];

  return (liveStreams as StreamRow[]).map((stream) => {
    const channel: ChannelRow = stream.channels;

    return {
      streamId: `${stream.id}`,
      title: stream.title || "Live stream",
      channel: channel?.name || "Unknown Channel",
      views: "Đang phát trực tiếp",
      thumbnailUrl: stream.thumbnail_url || "/default-thumbnail.png",
      isLive: true,
      roomName: stream.room_name!,
      avatar: channel?.avatar_url || "https://avatar.iran.liara.run/public",
    };
  });
}

export async function getStream(streamId: string) {
  const supabase = await createSupabaseServerClient();

  const { data: stream } = await supabase
      .from("streams")
      .select("*")
      .eq("id", streamId)
      .maybeSingle();

  return stream;
}
