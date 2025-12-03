import { NextRequest, NextResponse } from 'next/server';
import {
  IngressClient,
  IngressInput,
  CreateIngressOptions,
} from 'livekit-server-sdk';
import { kiwameConfig } from '@/config/kiwame.config';

const apiKey = kiwameConfig.livekitApiKey;
const apiSecret = kiwameConfig.livekitApiSecret;
const livekitHost = kiwameConfig.livekitURL;

const ingressClient = new IngressClient(livekitHost, apiKey, apiSecret);

export async function POST(req: NextRequest) {
  const { roomName } = await req.json();

  const opts: CreateIngressOptions = {
    name: `${roomName}-obs-ingress`,
    roomName,
    participantIdentity: 'obs-streamer',
    participantName: 'OBS Stream',
    bypassTranscoding: false,
  };

  try {
    const existingIngress = await ingressClient.listIngress()
    for (const ingress of existingIngress) {
      await ingressClient.deleteIngress(ingress.ingressId);
      await new Promise(r => setTimeout(r, 2000));
    }
    const info = await ingressClient.createIngress(
      IngressInput.WHIP_INPUT,
      opts
    );

    return NextResponse.json({
      whipUrl: info.url,
      streamKey: info.streamKey,
      roomName: roomName,
    });


  } catch (error) {
    console.error('Failed to create Ingress:', error);
    return NextResponse.json(
      { error: 'Failed to create stream' },
      { status: 500 }
    );
  }
}
