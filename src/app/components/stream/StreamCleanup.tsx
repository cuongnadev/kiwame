"use client";

import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";

export default function StreamCleanup() {
  const room = useRoomContext();

  useEffect(() => {
    return () => {
      room?.disconnect();
    };
  }, [room]);

  return null;
}
