'use client';
import { MenuChild, MenuItem } from '@/constants/menu.constants'
import { User } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

export interface UserMenuProps {
  menu: MenuItem[];
  onLogout: () => void;
  user: User | null;
  channel?: string | null;
  isStudio?: boolean;
  onToGoChannel?: () => void;
  onMenuClick: (item: MenuItem) => void;
}

export function UserMenu({ menu, onLogout, user , channel, isStudio = false, onToGoChannel, onMenuClick }: UserMenuProps) {
  const [currentMenu, setCurrentMenu] = useState<MenuItem[] | MenuChild[]>(menu);
  const [history, setHistory] = useState<(MenuItem[] | MenuChild[])[]>([]);

  const isSubmenu = history.length > 0;

  const isMenuItem = (item: MenuItem | MenuChild): item is MenuItem => {
    return (item as MenuItem).icon !== undefined;
  }

  const handleOpenSubmenu = (item: MenuItem) => {
    if (item.children) {
      setHistory((prev) => [...prev, currentMenu]);
      setCurrentMenu(item.children);
    }
  }

  const handleBack = () => {
    const prev = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentMenu(prev);
  }

  return (
    <div className='p-2 text-white space-y-1 w-full'>
      {isSubmenu ? (
        <div
          onClick={handleBack}
          className='flex items-center gap-2 hover:bg-white/10 rounded-lg p-1 cursor-pointer'
        >
          <ChevronLeft size={18} />
          <span className='font-semibold'>Quay lại</span>
        </div>
      ) : (
        <div className='p-2 border-b border-white/10'>
          <p className="font-semibold">Tên người dùng</p>
          <p className="text-sm text-gray-400">{isStudio ? channel :user?.email}</p>
          <span className='text-sm font-medium text-blue-400 cursor-pointer' onClick={onToGoChannel}>Xem kênh của bạn</span>
        </div>
      )}

      {currentMenu.map((item, index) => {
        if (isMenuItem(item)) {
          if (item.label === "Đăng xuất") {
            return (
              <div
                key={index}
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            )
          }

          if (item.children) {
            return (
              <div
                key={index}
                onClick={() => handleOpenSubmenu(item)}
                className="flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <ChevronRight size={18} />
              </div>
            );
          }

            return (
              <div
                key={index}
                onClick={() => onMenuClick(item)}
                className='flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer'
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            );
        }

        return (
          <div
            key={index}
            className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
