import { kiwameConfig } from "@/config/kiwame.config";

export async function startStream(signalingUrl: string, key: string, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const streamurl = `${signalingUrl}/${key}`;
  const body = {
    api: kiwameConfig.srsApi,
    streamurl,
    clientip: null,
    sdp: ""
  };

  const pc = new RTCPeerConnection();

  pc.ontrack = (event) => {
    const stream = event.streams[0];
    if(stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };

  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await pc.setLocalDescription(offer);
    body.sdp = offer.sdp || "";

    const res = await fetch(body.api, {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();

    await pc.setRemoteDescription({ type: 'answer', sdp: data.sdp } as RTCSessionDescriptionInit);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Không thể kết nối đến SRS server. Kiểm tra lại biến môi trường." }
  }
}
