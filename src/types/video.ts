export interface Video {
  id: number
  thumbnail: string
  title: string
  isDraft: boolean
  date: string
  dateLabel: string
  views: string
  comments: string
  likes: string
  channel_id?: string,
  description?: string;
  thumbnail_url?: string;
  duration?: string;
  visibility?: string;
  tags?: string[];
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
