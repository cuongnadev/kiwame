"use client";

import { useState } from "react";

import Header from "@/app/(main)/layout/Header";
import { useAppUser } from "@/hooks/useAppUser";
import SidebarLiveStreaming from "@/app/studio/channel/layout/SidebarLiveStreaming";

export default function LiveStreamingLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { user, loading } = useAppUser();

  const channel = user?.channel;
  const channelName = user?.channel?.name || "Phát trực tiếp";

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#0f0f0f]">
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          channel={channel!}
          type="studio"
          loading={loading}
          className="shadow-2xl shadow-red-900/20 border-b border-red-500/20"
        />

        <div className="flex flex-1 overflow-hidden">
          <SidebarLiveStreaming
            expanded={sidebarExpanded}
            user={user}
            channel={channel!}
          />

          <main className="w-full bg-[#0f0f0f]">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
