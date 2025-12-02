import { NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { kiwameConfig } from '@/config/kiwame.config';

const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  const body = await req.json();
  const key = body.stream;

  const vodUrl = `${kiwameConfig.srsVOD}/${key}.mp4`;

  await supabase.from('streams').update({
    is_live: false,
    ended_at: new Date(),
    vod_url: vodUrl
  }).eq('stream_key', key);

  return NextResponse.json({ ok: true });
}
