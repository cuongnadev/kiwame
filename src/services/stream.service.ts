"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  IngressClient,
  IngressInput,
  CreateIngressOptions,
} from "livekit-server-sdk";
import { kiwameConfig } from "@/config/kiwame.config";

const apiKey = kiwameConfig.livekitApiKey;
const apiSecret = kiwameConfig.livekitApiSecret;
const livekitHost = kiwameConfig.livekitURL;

const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);

export async function getOrCreateStream() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: channel } = await supabase
    .from("channels")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!channel) throw new Error("Channel not found");

  const roomName = `channel_${channel.id}`;

  const { data: streamExist } = await supabase
    .from("streams")
    .select("*")
    .eq("channel_id", channel.id)
    .is("ended_at", null)
    .maybeSingle();

  if (streamExist?.ingress_id && streamExist.whip_url && streamExist.stream_key) {
    return streamExist;
  }

  const ingressList = await ingressClient.listIngress();

  for (const ingress of ingressList) {
    if (ingress.roomName === roomName) {
      await ingressClient.deleteIngress(ingress.ingressId);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  const opts: CreateIngressOptions = {
    name: `${roomName}-obs`,
    roomName,
    participantIdentity: "obs-streamer",
    participantName: "OBS Stream",
    bypassTranscoding: false,
  };

  const ingress = await ingressClient.createIngress(
    IngressInput.WHIP_INPUT,
    opts
  );

  if (streamExist) {
    const { data: updated } = await supabase
      .from("streams")
      .update({
        ingress_id: ingress.ingressId,
        whip_url: ingress.url,
        stream_key: ingress.streamKey,
        updated_at: new Date().toISOString(),
      })
      .eq("id", streamExist.id)
      .select()
      .single();

    return updated;
  }

  const { data: stream } = await supabase
    .from("streams")
    .insert({
      channel_id: channel.id,
      title: "Live stream",
      stream_key: ingress.streamKey,
      ingress_id: ingress.ingressId,
      whip_url: ingress.url,
      room_name: roomName,
      is_live: false,
    })
    .select()
    .single();

  return stream;
}
