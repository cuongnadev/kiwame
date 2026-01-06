"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Header from "@/app/(main)/layout/Header";
import Sidebar from "@/app/(main)/layout/Sidebar";
import { useAppUser } from "@/hooks/useAppUser";
import { CreateChannelModal } from "@/app/components/ui";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const { user, loading } = useAppUser();

  const channel = user?.channel;

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev);

  useEffect(() => {
    if (loading) return;

    if (
      searchParams.get("openCreateChannel") === "true" &&
      !channel
    ) {
      setShowCreateChannel(true);
    }
  }, [loading, channel, searchParams]);

  return (
    <>
      <div className="flex flex-col h-screen bg-[#0f0f0f]">
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          channel={channel!}
          type="main"
          loading={loading}
          openCreateChannel={() => setShowCreateChannel(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            expanded={sidebarExpanded}
            user={user}
            channel={channel!}
            openCreateChannel={() => setShowCreateChannel(true)}
          />

          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </div>

      <CreateChannelModal
        open={showCreateChannel}
        onOpenChange={setShowCreateChannel}
      />
    </>
  );
}
