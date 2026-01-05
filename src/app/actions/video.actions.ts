"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentChannelId } from "@/services/channel.service";
import { Channel } from "@/types/channel";
import { Video, VideoRow } from "@/types/video";

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

export async function getMyVideos(): Promise<Video[]> {
  const supabase = await createSupabaseServerClient()
  const channel_id = await getCurrentChannelId(supabase)

  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      channel_id,
      title,
      description,
      thumbnail_url,
      visibility,
      is_draft,
      for_children,
      created_at,
      video_items (
        id,
        cloud_url,
        duration
      ),
      tags,
      video_views(count),
      comments(count),
      video_likes(count)
    `)
    .eq('channel_id', channel_id)

  if (error) {
    console.error(error)
    return []
  }

  if (!data) return []

  return data.map((v): Video => {
    const totalDuration = v.video_items.reduce(
      (total, item) => total + item.duration,
      0
    );
    return ({
      id: v.id,
      title: v.title,
      description: v.description,
      thumbnail_url: v.thumbnail_url,

      isDraft: v.is_draft,
      visibility: v.visibility,
      for_children: v.for_children,

      date: v.created_at,
      dateLabel: new Date(v.created_at).toLocaleDateString("vi-VN"),

      video_items: v.video_items,

      views: String(v.video_views?.[0]?.count ?? 0),
      comments: String(v.comments?.[0]?.count ?? 0),
      likes: String(v.video_likes?.[0]?.count ?? 0),

      channel_id: v.channel_id,
      duration: totalDuration.toString(),
      tags: v.tags,
    })
  })
}

export async function getVideo(video_id: string): Promise<Video | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('videos')
    .select(`
      id,
      channels(
        name,
        avatar_url,
        profile:profiles (
        full_name
        )
      ),
      title,
      description,
      thumbnail_url,
      visibility,
      is_draft,
      for_children,
      created_at,
      video_items (
        id,
        cloud_url,
        duration
      ),
      tags,
      video_views(count),
      comments(count),
      video_likes(count)
    `)
    .eq('id', video_id)
    .single()
  if (error) {
    console.error(error)
    return null
  }
  if (!data) return null

  const totalDuration = data.video_items.reduce(
    (total, item) => total + item.duration,
    0
  );
  const channel = data.channels?.[0] ?? null
  return ({
    id: data.id,
    title: data.title,
    description: data.description,
    thumbnail_url: data.thumbnail_url,
    isDraft: data.is_draft,
    visibility: data.visibility,
    for_children: data.for_children,
    date: data.created_at,
    dateLabel: new Date(data.created_at).toLocaleDateString("vi-VN"),
    video_items: data.video_items,
    views: String(data.video_views?.[0]?.count ?? 0),
    comments: String(data.comments?.[0]?.count ?? 0),
    likes: String(data.video_likes?.[0]?.count ?? 0),
    // channel: channel
    // ? {
    //     name: channel.name,
    //     avatar_url: channel.avatar_url,
    //     owner:auth.user()
    //       ? {
    //           id: owner.id,
    //           profile: profile ?? null,
    //         }
    //       : null,
    //   }
    // : null,
    duration: totalDuration.toString(),
    tags: data.tags,
  })
}