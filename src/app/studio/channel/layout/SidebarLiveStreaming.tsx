"use client";

import Image from "next/image";
import Link from "next/link";
import { getLiveMenuItems, systemMenuItems } from "@/constants/menu.constants";
import { AppUser } from "@/hooks/useAppUser";
import { SidebarItem } from "@/app/(main)/layout/SidebarItem";
import { AppUserChannel } from "@/types/channel";

interface SidebarLiveStreamingProps {
  expanded: boolean;
  user: AppUser | null;
  channel: AppUserChannel | null;
  channelName?: string;
}

export default function SidebarLiveStreaming({
  expanded,
  user,
  channel,
}: SidebarLiveStreamingProps) {
  const liveItems = getLiveMenuItems(channel);

  return (
    <aside
      className={`flex flex-col bg-[#0f0f0f] transition-all duration-300 ease-in-out ${
        expanded ? "w-64" : "w-20"
      } border-r border-white/10 group/sidebar`}
    >
      {/* Channel Info Header */}
      <div className="p-4 flex flex-col items-center">
        <Link href={channel ? `/${channel?.name}` : "#"} className="block">
          <Image
            src={user?.avatar_url || "https://avatar.iran.liara.run/public"}
            width={expanded ? 88 : 40}
            height={expanded ? 88 : 40}
            alt="Channel avatar"
            className="rounded-full object-cover border-2 border-red-500/30 shadow-lg shadow-red-500/20"
            priority
          />
        </Link>

        {expanded && (
          <div className="mt-3 text-center">
            <p className="font-bold text-white text-lg flex items-center gap-2">
              {channel ? channel?.name : "Kênh của bạn"}
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </p>
            {channel && <p className="text-xs text-red-400 font-mono">LIVE NOW</p>}
          </div>
        )}
      </div>

      {/* Live Streaming Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-hover">
        <div className={`space-y-1 py-3 ${expanded ? "px-3" : "px-1"}`}>
          {liveItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              expanded={expanded}
              user={user}
              channel={channel}
            />
          ))}
        </div>

        {/* Divider */}
        <hr className="border-t border-white/10 mx-3 my-2" />

        {/* System Menu */}
        <div className={`space-y-1 pb-4 ${expanded ? "px-3" : "px-1"}`}>
          {systemMenuItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              expanded={expanded}
              user={user}
              channel={channel}
            />
          ))}
        </div>
      </nav>

      {/* Live Indicator khi thu nhỏ */}
      {!expanded && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse ring-4 ring-red-500/30" />
        </div>
      )}
    </aside>
  );
}
