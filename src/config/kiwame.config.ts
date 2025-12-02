export const kiwameConfig = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseAdminKey: process.env.SUPABASE_ADMIN_KEY ?? "",

  // Streaming (SRS)
  streamSecret: process.env.STREAM_SECRET ?? "",
  srsIp: process.env.NEXT_PUBLIC_SRS_IP ?? "",
  srsApi: process.env.NEXT_PUBLIC_SRS_API ?? "",
  srsRtmp: process.env.NEXT_PUBLIC_SRS_RTMP ?? "",
  srsSignaling: process.env.NEXT_PUBLIC_SRS_SIGNALING ?? "",
  srsPlayback: process.env.NEXT_PUBLIC_SRS_PLAYBACK ?? "",
  srsVOD: process.env.NEXT_PUBLIC_SRS_VOD ?? "",
};
