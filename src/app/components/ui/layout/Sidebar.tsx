"use client"

import { guestMenuItems, mainMenuItems, systemMenuItems, titleMenu, userMenuItems } from "@/constants/menu.constants";
import { User } from "@supabase/supabase-js";
import {
  ChevronRight
} from "lucide-react";
import Link from "next/link";
interface SidebarProps {
  expanded?: boolean;
  user: User | null;
}

export default function Sidebar({ expanded, user }: SidebarProps) {
  return (
    <aside className={`flex flex-col bg-[#0f0f0f] transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'} group/sidebar`}>
      {/* Main menu */}
      <nav className={`flex-1 ${!expanded ? "px-1" : "px-3"}  overflow-y-auto overflow-x-hidden scrollbar-hover min-h-0`}>
        <div className={`space-y-1 py-4`}>
          {mainMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center ${!expanded && "justify-center"} gap-4 rounded-lg px-3 ${!expanded ? "py-4" : "py-2"} text-[#f1f1f1] hover:bg-[#222] transition-colors group relative`}
              title={item.label}
            >
              <div className="relative flex flex-col items-center">
                <item.icon size={24} className="flex-shrink-0" />
                {!expanded && <span className="text-[10px] text-nowrap">{item.label}</span>}
                {item.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
              {expanded && <span className="text-base text-nowrap">{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* User menu */}
        {expanded && user && (
          <>
            <div className="border-t border-[#222]" />
            <div className="space-y-1 py-4">
              {userMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                  title={item.label}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <item.icon size={24} className="flex-shrink-0" />
                    )}
                    <span className="text-base text-nowrap">{item.label}</span>
                    {item.showChevron && <ChevronRight size={16} className="text-[#818181]" />}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Guest menu */}
        {expanded && !user && (
          <>
            <div className="border-t border-[#222]" />
            <div className="space-y-1 py-4">
              {guestMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                  title={item.label}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <item.icon size={24} className="flex-shrink-0" />
                    )}
                    <span className="text-base text-nowrap">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {expanded &&
          <>
            {/* Title menu */}
            < div className="border-t border-[#222]" />
            <h2 className="pt-3.5 px-4 text-base text-[#f1f1f1]">Khám phá</h2>
            <div className="space-y-1 py-4">
              {titleMenu.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                  title={item.label}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <item.icon size={24} className="flex-shrink-0" />
                    )}
                    <span className="text-base text-nowrap">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
            {/* System menu */}
            <div className="border-t border-[#222]" />
            <div className="space-y-1 py-4">
              {systemMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[#f1f1f1] hover:bg-[#222] transition-colors"
                  title={item.label}
                >
                  <div className="flex items-center gap-4">
                    {item.icon && (
                      <item.icon size={24} className="flex-shrink-0" />
                    )}
                    <span className="text-base text-nowrap">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        }
      </nav>


    </aside>
  )
}
