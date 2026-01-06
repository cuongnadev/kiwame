import { createSupabaseServerClient } from "@/lib/supabase/server";

export const LikeService = {
    likeVideo: async (
        video_id: string,
        user_id: string,
        status: string
    ) => {
        
        const isLike = status === "like"
        const supabase = await createSupabaseServerClient()
        const { data: existing, error: fetchError } = await supabase
            .from("video_likes")
            .select("id, is_like")
            .eq("video_id", video_id)
            .eq("user_id", user_id)
            .maybeSingle()

        if (fetchError) {
            console.error("Fetch like error:", fetchError)
            return null
        }

        if (!existing) {
            const { error } = await supabase
                .from("video_likes")
                .insert({
                    video_id,
                    user_id,
                    is_like: isLike,
                })

            if (error) console.error("Insert like error:", error)
            return { action: "insert", isLike }
        }

        if (existing.is_like === isLike) {
            const { error } = await supabase
                .from("video_likes")
                .delete()
                .eq("id", existing.id)

            if (error) console.error("Delete like error:", error)
            return { action: "delete", isLike: null }
        }

        const { error } = await supabase
            .from("video_likes")
            .update({ is_like: isLike })
            .eq("id", existing.id)

        if (error) console.error("Update like error:", error)

        return { action: "update", isLike }
    },
}