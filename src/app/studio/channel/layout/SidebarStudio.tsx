"use client";

import Image from "next/image";
import Link from "next/link";
import { getStudioMenuItems, systemMenuItems } from "@/constants/menu.constants";
import { AppUser } from "@/hooks/useAppUser";
import { SidebarItem } from "@/app/(main)/layout/SidebarItem";
import { AppUserChannel } from "@/types/channel";

interface SidebarStudioProps {
  expanded: boolean;
  user: AppUser | null;
  channel: AppUserChannel | null;
}

export default function SidebarStudio({
  expanded,
  user,
  channel = { name: "Kênh của bạn", avatar_url: null, banner_url: null },
}: SidebarStudioProps) {
  const studioItems = getStudioMenuItems(channel);

  return (
    <aside
      className={`flex flex-col bg-[#0f0f0f] transition-all duration-300 ease-in-out ${expanded ? "w-64" : "w-20"
        } border-r border-white/10 group/sidebar`}
    >
      {/* Channel Header */}
      <div className="p-4 flex flex-col items-center">
        <Link href={channel ? `/${channel.name}` : "#"} className="block">
          <Image
            src={channel?.avatar_url || "https://avatar.iran.liara.run/public"}
            width={expanded ? 88 : 40}
            height={expanded ? 88 : 40}
            alt="Channel avatar"
            className={`rounded-full ${expanded ? "w-22 h-22" : "w-10 h-10"} object-cover border-2 border-white/10`}
            priority
          />
        </Link>

        {expanded && (
          <div className="mt-3 text-center">
            {channel && <p className="text-xs text-gray-400 font-mono">{channel.name}</p>}
          </div>
        )}
      </div>

      {/* Studio Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-hover">
        <div className={`space-y-1 py-3 ${expanded ? "px-3" : "px-1"}`}>
          {studioItems.map((item) => (
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
    </aside>
  );
}
