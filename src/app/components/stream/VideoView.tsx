"use client";

import "@livekit/components-styles";
import { ParticipantTile } from "@livekit/components-react";
import { useParticipants, useTracks } from "@livekit/components-react";

export function VideoView() {
  const participants = useParticipants();
  const tracks = useTracks();

  const ingressParticipant = participants.find(p =>
    p.identity.startsWith("ingress_") || p.identity.includes("obs")
  );

  const videoTrack = tracks.find(t =>
    t.participant === ingressParticipant &&
    t.publication?.kind === "video"
  );

  if (!videoTrack) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 to-black text-white">
        <p className="text-md text-gray-400">Đang chờ OBS Start Streaming...</p>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .lk-control-bar, .lk-button, .lk-leave-button, [data-lk-control-bar] {
          display: none !important;
        }
      `}</style>

      <ParticipantTile
        trackRef={videoTrack}
        className="w-full h-full"
        style={{
          objectFit: "contain",
          backgroundColor: "#000",
          aspectRatio: "16/9",
        }}
      />
    </>
  );
}
