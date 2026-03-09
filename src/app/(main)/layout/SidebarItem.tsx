"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { AppUser } from "@/hooks/useAppUser";
import { AppUserChannel } from "@/types/channel";
import { useMenuNavigation } from "@/hooks/useMenuNavigation";
import { MenuItem, canAccess } from "@/constants/menu.constants";

interface Props {
  item: MenuItem;
  expanded: boolean;
  user: AppUser | null;
  channel: AppUserChannel | null;
  openCreateChannel?: () => void;
}

export function SidebarItem({ item, expanded, user, channel, openCreateChannel }: Props) {
  const pathname = usePathname();
  const navigate = useMenuNavigation(user, channel, openCreateChannel);

  const { allowed } = canAccess(item, user, channel);
  const isActive = item.href ? pathname === item.href : false;

  const handleClick = (e: React.MouseEvent) => {
    if (!allowed) {
      e.preventDefault();
      navigate(item);
    }
  };

  return (
    <Link
      href={allowed && item.href ? item.href : "#"}
      aria-disabled={!item.href}
      onClick={handleClick}
      className={`flex items-center gap-4 rounded-lg transition-all group relative
        ${expanded ? "px-3 py-2 justify-start" : "py-4 justify-center"}
        ${isActive ? "bg-[#222]" : "hover:bg-[#222]"}
        text-[#f1f1f1] ${!allowed ? "opacity-60" : ""}
      `}
      title={!expanded ? item.label : undefined}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        {item.icon || <div className="w-6 h-6" />}
        {!expanded && <span className="text-[10px] mt-1 whitespace-nowrap">{item.label}</span>}
      </div>
      {expanded && <span className="text-base">{item.label}</span>}
      {expanded && item.showChevron && <ChevronRight size={16} className="ml-auto text-[#888]" />}
    </Link>
  );
}
