import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseWorkerClient } from "@/lib/supabase/worker"

const supabase = createSupabaseWorkerClient();

export const VideoService = {
    createVideo: async (data: Record<string, unknown>) => {
        const browserClient = await createSupabaseServerClient()
        const userRes = await browserClient.auth.getUser();
        const owner_id = userRes.data.user?.id;
        if (!owner_id) throw new Error("User not authenticated");
        const { data: channel, error: errorChannel } = await supabase
            .from('channels')
            .select('id')
            .eq('owner_id', owner_id)
            .single();
        if (errorChannel) throw errorChannel;
        const channel_id = channel.id;
        const payload = {
            ...data,
            channel_id,
        }
        const { data: inserted, error: errorInserted } = await supabase
            .from("videos")
            .insert(payload)
            .select()
            .single();
        if (errorInserted) throw new Error("Fail in service(create video):" + errorInserted);
        return inserted;
    },
    selectVideo: async (data: Record<string, unknown>) => {
        const { data: video, error } = await supabase
            .from("videos")
            .select()
            .eq("id", data.id)
            .single();
        if (error) throw new Error("Fail in service(select video): " + error);
        return video
    },
    updateVideo: async (data: Record<string, unknown>) => {
        if (!data.id) {
            throw new Error("Missing video id");
        }
        const { id, ...updateData } = data;
        const { data: video, error } = await supabase
            .from("videos")
            .update({
                updateData
            })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return video;
    }
    ,
    deleteVideo: async (data: Record<string, unknown>) => {
        const { error } = await supabase
            .from("videos")
            .delete()
            .eq("id", data.id)
        if (error) throw new Error("Fail in service (delete video): " + error)
    }
    ,
    selectMyVideos: async () => {
        const browserClient = await createSupabaseServerClient()
        const userRes = await browserClient.auth.getUser();
        const owner_id = userRes.data.user?.id;
        if (!owner_id) throw new Error("User not authenticated");
        const { data: channel, error: errorChannel } = await supabase
            .from('channels')
            .select('id')
            .eq('owner_id', owner_id)
            .single();
        if (errorChannel) throw errorChannel;
        const channel_id = channel.id;
        const { data: listVideos, error: errorListVideos } = await supabase
            .from('videos')
            .select(`
              *,
              video_items (*)
            `)
            .eq('channel_id', channel_id)
        if (errorListVideos) throw errorListVideos;
        return listVideos;
    }
}