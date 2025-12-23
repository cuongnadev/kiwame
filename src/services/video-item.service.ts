import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseWorkerClient } from "@/lib/supabase/worker"

const supabase = createSupabaseWorkerClient();

export const VideoItemService = {
    createVideoItem: async (data: Record<string, unknown>) => {
        const { data: inserted, error: errorInserted } = await supabase
            .from("video_items")
            .insert(data)
            .select()
            .single();
        if (errorInserted) throw new Error("Fail in service(create video item):" + errorInserted);
        return inserted
    },
    selectAllVideoItems: async (data: Record<string, unknown>) => {
        const { data: video_items, error: error } = await supabase
            .from("video_items")
            .select()
            .eq("video_id", data.id);
        if (error) throw new Error("Fail in service(select all video item): " + error);
        return video_items
    },
    deleteVideoItems: async (data: Record<string, unknown>) =>{
        const {error} = await supabase
        .from("video_items")
        .delete()
        .eq("video_id", data.id)
        if (error) throw new Error("Fail in service(delete video items): " + error)
    }
}