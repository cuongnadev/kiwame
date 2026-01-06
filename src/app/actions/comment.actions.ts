"use server"

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Comment } from "@/types/comment";

export async function addComment(video_id: string, user_id: string, content: string): Promise<Comment | null> {
    const supabase = await createSupabaseServerClient()
    const { data: comment, error } = await supabase
        .from("comments")
        .insert({
            video_id: video_id,
            user_id: user_id,
            content: content
        })
        .select()
        .single();
    if (error) {
        console.error("Add comment error:", error);
        return null;
    }
    console.log(comment)

    if (!comment) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', comment.user_id)
        .single();

    const { data: channel } = await supabase
        .from('channels')
        .select('name')
        .eq('owner_id', comment.user_id)
        .single();


    return {
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        likes: comment.comment_likes?.[0]?.count ?? 0,
        user: {
            id: comment.user_id,
            name: profile?.full_name,
            avatar_url: profile?.avatar_url,
            channelName: channel?.name,
        },
    };
}

export async function getComments(video_id: string): Promise<Comment[] | []> {
    const supabase = await createSupabaseServerClient()

    const { data: comments, error } = await supabase
        .from("comments")
        .select()
        .eq("video_id", video_id)

    if (error) console.log("Fail get comments : ", video_id);
    if (!comments) return [];

    const result = await Promise.all(
        comments.map(async (comment) => {
            const { data: profile } = await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', comment.user_id)
                .single()

            const { data: channel } = await supabase
                .from('channels')
                .select('name')
                .eq('owner_id', comment.user_id)
                .single()

            return {
                id: comment.id,
                content: comment.content,
                created_at: comment.created_at,
                likes: comment.comment_likes?.[0]?.count ?? 0,
                user: {
                    id: comment.user_id,
                    name: profile?.full_name,
                    avatar_url: profile?.avatar_url,
                    channelName: channel?.name,
                },
            }
        })
    )

    return result
}
