import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event;

    console.log('🔔 LiveKit webhook:', event);

    switch(event) {
      case 'ingress_started': {
        const streamKey = body.ingressInfo?.streamKey;

        if(!streamKey) {
          console.warn('Missing streamKey');
          break;
        }

        //

        console.log('Stream LIVE: ', streamKey);
        break;
      }

      case 'ingress_ended': {
        const streamKey = body.ingressInfo?.streamKey;

        if(!streamKey) {
          console.warn('Missing streamKey');
          break;
        }

        //

        console.log('Stream OFFLINE: ', streamKey);
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

        if(!participant || participant.kind !== 'STANDARD') break;

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
}
