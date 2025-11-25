import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { User } from '@supabase/supabase-js'
import { getStudioMenuItems, systemMenuItems } from '@/constants/menu.constants'
import { usePathname } from 'next/navigation';


interface SidebarStudioProps {
  expanded: boolean,
  user: User | null,
  channel: string,
}

export default function SidebarStudio({ expanded, user, channel }: SidebarStudioProps) {
  const studioMenuItems = getStudioMenuItems(channel);
  const pathname = usePathname();

  return (
    <aside className={`flex flex-col items-left bg-[#0f0f0f] transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-20'} group/sidebar border-r border-white/10`}>
      {/* user */}
      <div className='w-full p-4 flex flex-col items-center gap-2'>
        <Link href={"/"} className="flex items-center justify-start rounded-full">
          <Image
            src={"https://avatar.iran.liara.run/public"}
            width={expanded ? 100 : 40}
            height={expanded ? 100 : 40}
            alt="Kiwame Logo"
            className='rounded-full'
          />
        </Link>

        {expanded && (<div className='flex flex-col items-center gap-1'>
          <p className='text-white font-bold'>Kênh của bạn</p>
          <p className='text-white text-xs font-mono'>Tên người dùng</p>
        </div>
        )}
      </div>

      {/* Main menu */}
      <nav className={` items-left flex-1 ${!expanded ? "px-1" : "px-3"}  overflow-y-auto overflow-x-hidden scrollbar-hover min-h-0`}>
        <div className={`flex-1 space-y-1 py-4`}>
          {studioMenuItems.map((item) => (
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
