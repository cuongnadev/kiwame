import { Channel } from "./channel"

export interface Video {
  id: string
  title: string
  isDraft: boolean
  date: string
  dateLabel: string
  views: string
  for_children: boolean | null
  comments: string
  likes: string
  channel_id?: string,
  channel?:Channel | null,
  description?: string;
  thumbnail_url?: string;
  duration: string;
  visibility?: string;
  tags?: string[];
  video_items?: VideoItemRow[];
}

export interface VideoItemRow {
  id: string;
  cloud_url: string;
  duration: number;
}

export interface ChannelRow {
  id: string;
  name: string;
  avatar_url: string | null;
}

export interface VideoViewRow {
  count: number;
}

export interface VideoRow {
  id: string;
  title: string | null;
  thumbnail_url: string | null;
  created_at: string;

  video_items: VideoItemRow[];

  channel: ChannelRow | null;

  video_views: VideoViewRow[];
}

export interface VideoPart {
  url: string;
  duration: number; // seconds
}