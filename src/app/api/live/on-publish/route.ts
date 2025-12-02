import { NextResponse } from 'next/server';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { kiwameConfig } from '@/config/kiwame.config';

const supabase = createSupabaseBrowserClient();

export async function POST(req: Request) {
  const body = await req.json();
  const key = body.stream;

  const playbackUrl = `${kiwameConfig.srsPlayback}/${key}.m3u8`;

  await supabase.from('streams').upsert({
    stream_key: key,
    is_live: true,
    playbackUrl,
    started_at: new Date()
  });

  return NextResponse.json({ ok: true });
}
