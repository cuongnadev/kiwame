import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppUser } from '@/hooks/useAppUser';
import { getLiveMenuItems, systemMenuItems } from '@/constants/menu.constants';

interface SidebarLiveStreamingProps {
  expanded: boolean,
  user: AppUser | null,
  channel: string,
}

export default function SidebarLiveStreaming({ expanded, user, channel }: SidebarLiveStreamingProps) {
  const liveMenuItems = getLiveMenuItems(channel);
  const pathname = usePathname();

  return (
    <aside className={`flex flex-col items-left bg-[#0f0f0f] transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'} group/sidebar border-r border-white/10`}>
      {/* Main menu */}
      <nav className={` items-left flex-1 ${!expanded ? "px-1" : "px-3"}  overflow-y-auto overflow-x-hidden scrollbar-hover min-h-0`}>
        <div className={`flex-1 space-y-1 py-4`}>
          {liveMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href!}
              className={`flex items-center ${!expanded && "justify-center"} gap-4 rounded-lg px-3 ${!expanded ? "py-4" : "py-2"} text-[#f1f1f1] hover:bg-[#222] ${(pathname === item.href) && 'bg-[#222]'} transition-colors group relative`}

              title={expanded ? '' : item.label}
            >
              <div className="relative flex flex-col items-center">
                {item.icon}
              </div>
              {expanded && <span className="text-base text-nowrap">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* System menu */}
      <div className={`space-y-1 py-4 ${!expanded ? "px-1" : "px-3"}`}>
        {systemMenuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center ${!expanded && "justify-center"} gap-4 rounded-lg px-3 ${!expanded ? "py-4" : "py-2"} text-[#f1f1f1] hover:bg-[#222] transition-colors group relative`}
            title={expanded ? '' : item.label}
          >
            <div className="relative flex flex-col items-center">
              {item.icon && (
                <item.icon size={24} className="flex-shrink-0" />
              )}
            </div>
            {expanded && <span className="text-base text-nowrap">{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  )
}
