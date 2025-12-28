"use client";

import { useEffect, useState } from "react";
import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import { useAppUser } from "@/hooks/useAppUser";
import { useSearchParams } from "next/navigation";
import CreateChannelModal from "@/app/components/ui/modals/CreateChannelModal";

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


  if (loading) return null;

  return (
    <>
      <div className="flex flex-col h-screen bg-[#0f0f0f]">
        <Header
          onMenuClick={toggleSidebar}
          user={user}
          channel={channel!}
          type="main"
          openCreateChannel={() => setShowCreateChannel(true)}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            expanded={sidebarExpanded}
            user={user}
            channel={channel!}
            openCreateChannel={() => setShowCreateChannel(true)}
          />

          <main className="w-full grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main">
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
