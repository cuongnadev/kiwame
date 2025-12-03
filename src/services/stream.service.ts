import { Stream } from "@/types/stream";

export async function startStream(roomName: string): Promise<Stream> {
  const res = await fetch("/api/live/ingress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomName }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Không thể tạo ingress");
  }

  return res.json();
}
