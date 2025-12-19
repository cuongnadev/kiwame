"use server";

import LiveChat from "@/app/components/stream/LiveChat";
import StreamPlayer from "@/app/components/stream/StreamPlayer";
import { getOrCreateStream } from "@/services/stream.service";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default async function LivePage() {
  await sleep(2000);
  const stream = await getOrCreateStream();

  return (
    <div className="flex h-full text-white">
      <div className="flex-1 flex flex-col h-full p-6">
        <StreamPlayer initialStream={stream} />
      </div>

      <div className="w-96 h-full overflow-hidden flex-shrink-0 border-l border-[#303030]">
        <LiveChat />
      </div>
    </div>
  );
}
