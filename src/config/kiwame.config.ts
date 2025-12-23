export const kiwameConfig = {
  nextPublicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseAdminKey: process.env.SUPABASE_ADMIN_KEY ?? "",

  // Streaming (SRS)
  streamSecret: process.env.STREAM_SECRET ?? "",

  nextPublicLivekitURL: process.env.NEXT_PUBLIC_LIVEKIT_URL ?? "",

  livekitURL: process.env.LIVEKIT_URL ?? "",
  livekitApiKey: process.env.LIVEKIT_API_KEY ?? "",
  livekitApiSecret: process.env.LIVEKIT_API_SECRET ?? "",

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
};
