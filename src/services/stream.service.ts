import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  IngressClient,
  IngressInput,
  CreateIngressOptions,
  AccessToken,
} from "livekit-server-sdk";
import { kiwameConfig } from "@/config/kiwame.config";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseWorkerClient } from "@/lib/supabase/worker";

const apiKey = kiwameConfig.livekitApiKey;
const apiSecret = kiwameConfig.livekitApiSecret;
const livekitHost = kiwameConfig.livekitURL;

const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);

export const StreamService = {
  getOrCreateStream: async () => {
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
  },

  webhook: async (req: Request) => {
    const supabase = await createSupabaseWorkerClient();

    try {
      const body = await req.json();
      const event = body.event;

      console.log('🔔 LiveKit webhook:', event);

      switch (event) {
        case 'ingress_started': {
          const { streamKey, roomName } = body.ingressInfo;

          if (!streamKey || !roomName) break;

          const { data: stream } = await supabase
            .from("streams")
            .select("id")
            .eq("stream_key", streamKey)
            .single();

          if (!stream) break;

          await supabase
            .from("streams")
            .update({
              is_live: true,
              started_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", stream.id);

          console.log(`Stream ONLINE: ${streamKey}`);
          break;
        }

        case 'ingress_ended': {
          const { streamKey, roomName } = body.ingressInfo;

          if (!streamKey || !roomName) break;

          const { data: stream } = await supabase
            .from("streams")
            .select("id")
            .eq("stream_key", streamKey)
            .single();

          if (!stream) break;

          // 1. update status stream
          await supabase
            .from("streams")
            .update({
              is_live: false,
              ended_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", stream.id);

          // 2. delete chat likes
          await supabase
            .from("stream_chat_likes")
            .delete()
            .eq("stream_id", stream.id);

          // 3. delete chats
          await supabase
            .from("stream_chat")
            .delete()
            .eq("stream_id", stream.id);

          console.log(`Stream OFFLINE: ${streamKey}`);
          break;
        }

        case 'participant_joined': {
          const participant = body.participant;

          if (!participant || participant.kind !== 'STANDARD') break;

          //

          console.log('Viewer joined: ', participant.indentity);
          break;
        }

        case 'participant_left': {
          const participant = body.participant;

          if (!participant || participant.kind !== 'STANDARD') break;

          //

          console.log('Viewer left: ', participant.indentity);
          break;
        }

        default:
          console.log('Ignore event', event);
      }

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return NextResponse.json({ error: 'webhook failed' }, { status: 400 });
    }
  },

  getToken: async (req: NextRequest) => {
    const room = req.nextUrl.searchParams.get("room")!;

    const token = new AccessToken(
      kiwameConfig.livekitApiKey,
      kiwameConfig.livekitApiSecret,
      { identity: "viewer-" + Math.random() }
    );

    token.addGrant({
      room,
      roomJoin: true,
      canPublish: false,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({ token: await token.toJwt() });
  },

  update: async (formData: FormData) => {
    const supabase = await createSupabaseServerClient();

    const { data, error: userError } = await supabase.auth.getUser();

    const user = data?.user;

    if (userError || !user) {
      throw new Error("UNAUTHORIZED");
    }

    const ownerId = user.id;

    const { data: channel } = await supabase
      .from('channels')
      .select('id')
      .eq('owner_id', ownerId)
      .maybeSingle();

    if (!channel) {
      throw new Error("CHANNEL_NOT_FOUND");
    }

    const { data: stream } = await supabase
      .from('streams')
      .select('id')
      .eq('channel_id', channel.id)
      .maybeSingle()

    if (!stream) {
      throw new Error("STREAM_NOT_FOUND");
    }

    const title = formData.get('title') as string;
    const descriptionRaw = formData.get("description") as string | null;
    const description = descriptionRaw?.trim() || null;
    const thumbnailEntry = formData.get('thumbnail') as File | null;

    let thumbnailUrl: string | undefined;

    if (thumbnailEntry instanceof File) {
      const ext = thumbnailEntry.name.split(".").pop();
      const fileName = `thumbnail-${ownerId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('Images')
        .upload(fileName, thumbnailEntry, {
          contentType: thumbnailEntry.type,
        });

      if (uploadError) {
        throw new Error("THUMBNAIL_UPLOAD_FAILED");
      }

      const { data: publicUrl } = supabase.storage
        .from('Images')
        .getPublicUrl(fileName);

      thumbnailUrl = publicUrl.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('streams')
      .update({
        title,
        description,
        ...(thumbnailUrl && { thumbnail_url: thumbnailUrl }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", stream.id);

    if (updateError) {
      throw new Error("UPDATE_STREAM_FAILED");
    }

    return {
      success: true,
    }
  },

  sendChat: async ({ streamId, message }: { streamId: string; message: string }) => {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("UNAUTHORIZED");
    }

    if (!streamId || !message?.trim()) {
      throw new Error("INVALID_PAYLOAD");
    }

    const { data: stream } = await supabase
      .from("streams")
      .select("id, is_live")
      .eq("id", streamId)
      .single();

    if (!stream) {
      throw new Error("STREAM_NOT_FOUND");
    }

    if (!stream.is_live) {
      throw new Error("STREAM_NOT_LIVE");
    }

    const { data: chat, error } = await supabase
      .from("stream_chat")
      .insert({
        stream_id: streamId,
        user_id: user.id,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error("SEND_CHAT_ERROR:", error);
      throw new Error("SEND_CHAT_FAILED");
    }

    return {
      success: true,
      chat,
    };
  }
};
