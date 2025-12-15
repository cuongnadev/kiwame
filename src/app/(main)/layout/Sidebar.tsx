"use client";

import { SidebarItem } from "./SidebarItem";
import {
  mainMenuItems,
  getUserMenuItems,
  guestMenuItems,
  exploreMenuItems,
  systemMenuItems,
} from "@/constants/menu.constants";
import { AppUser } from "@/hooks/useAppUser";

interface SidebarProps {
  expanded: boolean;
  user: AppUser | null;
  channel: string | null;
  openCreateChannel: () => void;
}

export default function Sidebar({ expanded, user, channel, openCreateChannel }: SidebarProps) {
  const userMenuItems = getUserMenuItems(channel);

  return (
    <aside className={`flex flex-col bg-[#0f0f0f] transition-all duration-300 ${expanded ? 'w-64' : 'w-20'} group/sidebar`}>
      <nav className={`flex-1 overflow-y-auto scrollbar-hover ${expanded ? 'px-3' : 'px-1'} py-4 space-y-6`}>
        <div className="space-y-1">
          {mainMenuItems.map((item) => (
            <SidebarItem
              key={item.label}
              item={item}
              expanded={expanded}
              user={user}
              channel={channel}
              openCreateChannel={openCreateChannel}
            />
          ))}
        </div>

        {expanded && user && (
          <>
            <hr className="border-[#222] my-2" />
            <div className="space-y-1">
              {userMenuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  expanded={expanded}
                  user={user}
                  channel={channel}
                  openCreateChannel={openCreateChannel}
                />
              ))}
            </div>
          </>
        )}

        {expanded && !user && (
          <>
            <hr className="border-[#222] my-2" />
            <div className="space-y-1">
              {guestMenuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  expanded={expanded}
                  user={user}
                  channel={channel}
                  openCreateChannel={openCreateChannel}
                />
              ))}
            </div>
          </>
        )}

        {expanded && (
          <>
            <hr className="border-[#222] my-2" />
            <h2 className="px-4 text-sm font-semibold text-[#aaa]">Khám phá</h2>
            <div className="space-y-1">
              {exploreMenuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  expanded={expanded}
                  user={user}
                  channel={channel}
                  openCreateChannel={openCreateChannel}
                />
              ))}
            </div>

            <hr className="border-[#222] my-2" />
            <div className="space-y-1">
              {systemMenuItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  item={item}
                  expanded={expanded}
                  user={user}
                  channel={channel}
                  openCreateChannel={openCreateChannel}
                />
              ))}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
