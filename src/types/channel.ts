export interface AppUserChannel {
  name: string; // "@Kiwame Studio",
  avatar_url: string | null;
  banner_url: string | null;
}

export interface Channel{
  name: string;
  avatar_url?: string;
  profile: Profile
}

export interface Profile{
  full_name: string;
}