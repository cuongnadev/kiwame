"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ParticipantTile,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { kiwameConfig } from "@/config/kiwame.config";

interface LiveKitPlayerProps {
  roomName: string;
  className?: string;
}

export const LiveKitPlayer: React.FC<LiveKitPlayerProps> = ({
  roomName,
  className = "",
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomName) return;

    const fetchToken = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/live/token?room=${encodeURIComponent(roomName)}`);
        if (!res.ok) throw new Error("Không thể lấy token");
        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error("Token error:", err);
        setError("Không thể kết nối đến stream");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [roomName]);

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Đang tải stream...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white text-xl">
        {error || "Stream không khả dụng"}
      </div>
    );
  }

  return (
    <LiveKitRoom serverUrl={kiwameConfig.nextPublicLivekitURL} token={token} connect={true}>
      <div
        ref={containerRef}
        className={`relative w-full h-full bg-black overflow-hidden ${className}`}
      >
        <OBSStreamerTile />
        <RoomAudioRenderer />
      </div>
    </LiveKitRoom>
  );
};

const OBSStreamerTile: React.FC = () => {
  const participants = useParticipants();
  const tracks = useTracks();

  const ingressParticipant = participants.find((p) =>
    p.identity === "obs-streamer" ||
    p.identity.startsWith("ingress_") ||
    p.identity.includes("obs")
  );

  const videoTrack = tracks.find(t =>
    t.participant === ingressParticipant &&
    t.publication?.kind === "video"
  );

  if (!videoTrack) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg">Đang chờ streamer bắt đầu phát sóng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .lk-control-bar,
        .lk-button-group,
        .lk-leave-button,
        [data-lk-control-bar],
        .lk-participant-tile .lk-button {
          display: none !important;
        }
      `}</style>

      <ParticipantTile
        trackRef={videoTrack}
        className="w-full h-full"
        style={{
          objectFit: "contain",
          backgroundColor: "#000000",
        }}
      />
    </>
  );
};
