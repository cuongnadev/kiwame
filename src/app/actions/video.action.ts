
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VideoRow } from "@/types/video";

export async function getHomeVideos() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("videos")
    .select(`
      id,
      title,
      thumbnail_url,
      created_at,
      video_items (
        id,
        cloud_url,
        duration
      ),
      channel:channels!videos_channel_id_fkey (
        id,
        name,
        avatar_url
      ),
      video_views(count)
    `)
    .order("created_at", { ascending: false })
    .limit(20)
    .returns<VideoRow[]>();

  if (error || !data) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return (data as VideoRow[]).map((video) => {
    const views = video.video_views[0]?.count ?? 0;
    const channel = video.channel;

    const totalDuration = video.video_items.reduce(
      (total, item) => total + item.duration,
      0
    );

    return {
      videoId: video.id,
      title: video.title ?? "Untitled video",
      channel: channel?.name ?? "Unknown channel",
      avatar: channel?.avatar_url ?? undefined,
      thumbnailUrl: video.thumbnail_url ?? "/default-thumbnail.png",
      publishedAt: new Date(video.created_at).toLocaleDateString("vi-VN"),
      views: `${views.toLocaleString()} lượt xem`,
      isLive: false,
      duration: totalDuration.toString(),
      parts: video.video_items.map((item) => ({
        url: item.cloud_url,
        duration: item.duration,
      })),
    };
  });
}
