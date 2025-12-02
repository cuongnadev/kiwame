-- ==============================
-- ENUMs
-- ==============================
create type video_visibility as enum ('public','private','unlisted');
create type notification_type as enum ('new_video','comment','livestream','system');

-- ==============================
-- PROFILES
-- ==============================
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username varchar(50) unique not null,
    full_name varchar(100),
    avatar_url text,
    bio text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================
-- CHANNELS
-- ==============================
create table public.channels (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references auth.users(id) on delete cascade,
    name varchar(100) not null,
    description text,
    avatar_url text,
    banner_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(name)
);
create index idx_channels_owner_id on public.channels(owner_id);

-- ==============================
-- VIDEOS
-- ==============================
create table public.videos (
    id uuid primary key default gen_random_uuid(),
    channel_id uuid references public.channels(id) on delete set null,
    title varchar(200) not null,
    description text,
    video_url text not null,
    thumbnail_url text,
    duration integer,
    visibility video_visibility default 'public',
    tags text[],
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index idx_videos_channel_id on public.videos(channel_id);
create index idx_videos_visibility on public.videos(visibility);

-- ==============================
-- VIDEO VIEWS
-- ==============================
create table public.video_views (
    id bigserial primary key,
    video_id uuid references public.videos(id) on delete cascade,
    user_id uuid references auth.users(id),
    viewed_at timestamptz default now()
);
create index idx_video_views_video_id on public.video_views(video_id);

-- ==============================
-- VIDEO LIKES
-- ==============================
create table public.video_likes (
    id bigserial primary key,
    video_id uuid references public.videos(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    is_like boolean not null,
    created_at timestamptz default now(),
    unique(video_id, user_id)
);
create index idx_video_likes_video_id on public.video_likes(video_id);

-- ==============================
-- COMMENTS
-- ==============================
create table public.comments (
    id uuid primary key default gen_random_uuid(),
    video_id uuid references public.videos(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index idx_comments_video_id_created_at on public.comments(video_id, created_at);

-- ==============================
-- COMMENT REPLIES
-- ==============================
create table public.comment_replies (
    id uuid primary key default gen_random_uuid(),
    comment_id uuid references public.comments(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index idx_comment_replies_comment_id_created_at on public.comment_replies(comment_id, created_at);

-- ==============================
-- SUBSCRIPTIONS
-- ==============================
create table public.subscriptions (
    id bigserial primary key,
    subscriber_id uuid references auth.users(id) on delete cascade,
    channel_id uuid references public.channels(id) on delete cascade,
    created_at timestamptz default now(),
    unique(subscriber_id, channel_id)
);
create index idx_subscriptions_channel_id on public.subscriptions(channel_id);

-- ==============================
-- PLAYLISTS
-- ==============================
create table public.playlists (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid references auth.users(id) on delete cascade,
    name varchar(150) not null,
    description text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================
-- PLAYLIST ITEMS
-- ==============================
create table public.playlist_items (
    id bigserial primary key,
    playlist_id uuid references public.playlists(id) on delete cascade,
    video_id uuid references public.videos(id),
    added_at timestamptz default now(),
    unique(playlist_id, video_id)
);
create index idx_playlist_items_playlist_id on public.playlist_items(playlist_id);

-- ==============================
-- WATCH HISTORY
-- ==============================
create table public.watch_history (
    id bigserial primary key,
    user_id uuid references auth.users(id),
    video_id uuid references public.videos(id),
    watched_at timestamptz default now()
);
create index idx_watch_history_user_id on public.watch_history(user_id);
create index idx_watch_history_video_id on public.watch_history(video_id);

-- ==============================
-- NOTIFICATIONS
-- ==============================
create table public.notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    type notification_type not null,
    message text,
    metadata jsonb,
    created_at timestamptz default now(),
    is_read boolean default false
);
create index idx_notifications_user_id_created_at on public.notifications(user_id, created_at);

-- ==============================
-- STREAMS
-- ==============================
create table public.streams (
    id uuid primary key default gen_random_uuid(),
    channel_id uuid references public.channels(id) not null,
    stream_key text unique not null,
    title varchar(200),
    description text,
    thumbnail_url text,
    is_live boolean default false,
    playback_url text,
    vod_url text,
    started_at timestamptz,
    ended_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index idx_streams_is_live on public.streams(is_live);
create index idx_streams_channel_id on public.streams(channel_id);

-- ==============================
-- STREAM CHAT
-- ==============================
create table public.stream_chat (
    id bigserial primary key,
    stream_id uuid references public.streams(id) on delete cascade,
    user_id uuid references auth.users(id),
    message text not null,
    sent_at timestamptz default now()
);
create index idx_stream_chat_stream_id_sent_at on public.stream_chat(stream_id, sent_at);

-- ==============================
-- VIDEO METADATA AI
-- ==============================
create table public.video_metadata_ai (
    id uuid primary key default gen_random_uuid(),
    video_id uuid references public.videos(id) on delete cascade,
    topics text[],
    sentiment text,
    keywords text[],
    score float,
    created_at timestamptz default now()
);
create index idx_video_metadata_ai_video_id on public.video_metadata_ai(video_id);

-- ==============================
-- POSTS
-- ==============================
create table public.posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    content text,
    image_url text,
    attached_video_id uuid references public.videos(id) on delete set null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- ==============================
-- POST LIKES
-- ==============================
create table public.post_likes (
    id bigserial primary key,
    post_id uuid references public.posts(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    is_like boolean not null,
    created_at timestamptz default now(),
    unique(post_id, user_id)
);
create index idx_post_likes_post_id on public.post_likes(post_id);

-- ==============================
-- POST COMMENTS
-- ==============================
create table public.post_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.posts(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    content text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create index idx_post_comments_post_id_created_at on public.post_comments(post_id, created_at);

-- ==============================
-- POST POLLS
-- ==============================
create table public.post_polls (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.posts(id) on delete cascade,
    question text not null
);

create table public.post_poll_options (
    id uuid primary key default gen_random_uuid(),
    poll_id uuid references public.post_polls(id) on delete cascade,
    option_text text not null
);

create table public.post_poll_votes (
    id bigserial primary key,
    option_id uuid references public.post_poll_options(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    voted_at timestamptz default now(),
    unique(option_id, user_id)
);
create index idx_post_poll_votes_option_id on public.post_poll_votes(option_id);
