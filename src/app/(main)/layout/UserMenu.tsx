"use client";

import { MenuItem } from "@/constants/menu.constants";
import { AppUser } from "@/hooks/useAppUser";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface UserMenuProps {
  items: MenuItem[];
  onNavigate: (item: MenuItem) => void;
  onLogout?: () => void;
  user?: AppUser | null;
  channel?: string | null;
  onToGoChannel?: () => void;
  type: "main" | "studio";
}

export function UserMenu({
  items,
  onNavigate,
  onLogout,
  user,
  channel,
  onToGoChannel,
  type,
}: UserMenuProps) {
  const [stack, setStack] = useState<MenuItem[][]>([items]);
  const currentMenu = stack[stack.length - 1];

  const goBack = () => setStack(prev => prev.slice(0, -1));
  const goInto = (children: MenuItem[]) => setStack(prev => [...prev, children]);

  const isRoot = stack.length === 1;

  return (
    <div className="w-72 bg-[#1a1a1a] text-white rounded-xl shadow-2xl overflow-hidden group/sidebar">
      {isRoot && user && (
        <div className="px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image
              src={user.avatar_url || "/default-avatar.png"}
              width={48}
              height={48}
              alt="Avatar"
              className="rounded-full"
            />
            <div>
              <p className="font-semibold">{type === "main" ? user.full_name : user.channel?.name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
          </div>
          {channel && onToGoChannel && (
            <span
              onClick={onToGoChannel}
              className="mt-3 text-sm text-blue-400 hover:underline cursor-pointer"
            >
              Xem kênh của bạn
            </span>
          )}
        </div>
      )}

      {!isRoot && (
        <div
          onClick={goBack}
          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/10 transition"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Quay lại</span>
        </div>
      )}

      <div className="max-h-96 overflow-y-auto scrollbar-hover">
        {currentMenu.map((item, i) => {
          if (item.label === "Đăng xuất") {
            return (
              <div
                key={i}
                onClick={onLogout}
                className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer transition"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
          }

          if (type === "studio" && item.label === "Kiwame Studio") return;
          if (type === "main" && item.label === "Kiwame") return;

          if (item.children) {
            return (
              <div
                key={i}
                onClick={() => goInto(item.children!)}
                className="flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            );
          }

          return (
            <div
              key={i}
              onClick={() => onNavigate(item)}
              className="flex items-center gap-4 px-4 py-3 hover:bg-white/10 cursor-pointer transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
