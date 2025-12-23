export interface Video {
    id: number
    thumbnail: string
    title: string
    isDraft: boolean
    date: string
    dateLabel: string
    views: string
    comments: string
    likes: string
    channel_id?: string,
    description?: string;
    thumbnail_url?: string;
    duration?: string;
    visibility?: string;
    tags?: string[];
}