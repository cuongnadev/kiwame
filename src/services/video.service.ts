import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseWorkerClient } from "@/lib/supabase/worker";
import { getCurrentChannelId } from "./channel.service";

const supabaseWorker = createSupabaseWorkerClient();

export const VideoService = {
  createVideo: async (data: Record<string, unknown>) => {
    const supabaseServer = await createSupabaseServerClient()
    const channel_id = await getCurrentChannelId(supabaseServer);

    const payload = {
      ...data,
      channel_id,
    }

    const { data: inserted, error: errorInserted } = await supabaseWorker
      .from("videos")
      .insert(payload)
      .select()
      .single();

    if (errorInserted) throw new Error("Fail in service(create video):" + errorInserted);

    return inserted;
  },

  selectVideo: async (data: Record<string, unknown>) => {
    const { data: video, error } = await supabaseWorker
      .from("videos")
      .select()
      .eq("id", data.id)
      .single();

    if (error) throw new Error("Fail in service(select video): " + error);

    return video;
  },

  updateVideo: async (data: Record<string, unknown>) => {
    if (!data.id) {
      throw new Error("Missing video id");
    }

    const { id, ...updateData } = data;
    const { data: video, error } = await supabaseWorker
      .from("videos")
      .update({
        updateData
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return video;
  },

  deleteVideo: async (data: Record<string, unknown>) => {
    const { error } = await supabaseWorker
      .from("videos")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error("Fail in service (delete video): " + error);
  },

  selectMyVideos: async () => {
    const supabaseServer = await createSupabaseServerClient()
    const channel_id = await getCurrentChannelId(supabaseServer);

    const { data: listVideos, error: errorListVideos } = await supabaseWorker
      .from('videos')
      .select(`
              *,
              video_items (*)
            `)
      .eq('channel_id', channel_id);

    if (errorListVideos) throw errorListVideos;

    return listVideos;
  },
}
