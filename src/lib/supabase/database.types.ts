export type Database = {
  public: {
    Tables: {
      streams: {
        Row: {
          id: string
          channel_id: string
          stream_key: string
          title: string | null
          description: string | null
          thumbnail_url: string | null
          is_live: boolean
          playback_url: string | null
          vod_url: string | null
          room_name: string | null
          ingress_id: string | null
          whip_url: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
