import { UserComment } from "./user";

export interface Comment {
    id: string;
    user: UserComment;
    content:string;
    likes: number;
    created_at: string;
}

export interface CommentReply{
    id: string;
    comment_id: string;
    user: UserComment;
    content: string;
    created_at: string;
}