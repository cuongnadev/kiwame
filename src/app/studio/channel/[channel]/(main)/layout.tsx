"use client";

import { useState } from "react";
import Header from "@/app/(main)/layout/Header";
import { useAppUser } from "@/hooks/useAppUser";
import SidebarStudio from "@/app/studio/channel/layout/SidebarStudio";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { user, loading } = useAppUser();

  const channel = user?.channel;

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  if (loading) return null;

  return (
    <>
      <div className="flex flex-col h-screen bg-[#0f0f0f]">
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          channel={channel!}
          type="studio"
          className="shadow-lg shadow-black/50"
        />

        <div className="flex flex-1 overflow-hidden">
          <SidebarStudio
            expanded={sidebarExpanded}
            user={user}
            channel={channel!}
          />

          <main className="flex-1 overflow-y-auto scrollbar-main px-6 py-4 bg-[#0f0f0f]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
