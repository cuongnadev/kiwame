import { ChannelRow } from "./video";

export interface Stream {
  room_name: string
  whip_url: string
  stream_key: string
}

export type StreamRow = {
  id: string;
  title: string | null;
  room_name: string;
  is_live: boolean;
  thumbnail_url: string | null;
  started_at: string;
  channels: ChannelRow;
};
