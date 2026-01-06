"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OpenCreateChannelListener({
  hasChannel,
  loading,
  onOpen,
}: {
  hasChannel: boolean;
  loading: boolean;
  onOpen: () => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) return;

    if (
      searchParams.get("openCreateChannel") === "true" &&
      !hasChannel
    ) {
      onOpen();
    }
  }, [searchParams, loading, hasChannel, onOpen]);

  return null;
}
