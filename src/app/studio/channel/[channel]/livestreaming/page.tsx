import LiveChat from "@/app/components/stream/LiveChat";
import StreamPlayer from "@/app/components/stream/StreamPlayer";

export default function LivePage() {
  return (
    <div className="flex h-full overflow-hidden text-white">
      <div className="flex-1 flex flex-col h-full overflow-hidden p-6">
        <StreamPlayer />
      </div>

      <div className="w-96 h-full overflow-hidden flex-shrink-0 border-l border-[#303030]">
        <LiveChat />
      </div>
    </div>
  );
}
