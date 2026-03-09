"use client";

import React, { Suspense, useState } from "react";
import Header from "@/app/(main)/layout/Header";
import Sidebar from "@/app/(main)/layout/Sidebar";
import { useAppUser } from "@/hooks/useAppUser";
import { CreateChannelModal } from "@/app/components/ui";
import { OpenCreateChannelListener } from "@/app/components/common";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const { user, loading } = useAppUser();

  const channel = user?.channel;

  return (
    <>
      <Suspense fallback={null}>
        <OpenCreateChannelListener
          loading={loading}
          hasChannel={!!channel}
          onOpen={() => setShowCreateChannel(true)}
        />
      </Suspense>

      <div className="flex flex-col h-screen bg-[#0f0f0f]">
        <Header
          onMenuClick={() => setSidebarExpanded((p) => !p)}
          user={user}
          channel={channel!}
          type="main"
          loading={loading}
          openCreateChannel={() => setShowCreateChannel(true)}
        />

        <div className="relative flex flex-1 overflow-hidden">
          {/* Desktop: only 1 sidebar, normal zoom in/out */}
          <div className="hidden lg:block">
            <Sidebar
              expanded={sidebarExpanded}
              user={user}
              channel={channel!}
              openCreateChannel={() => setShowCreateChannel(true)}
            />
          </div>

          {/* Mobile/Tablet: The background sidebar always collapses to maintain layout stability. */}
          <div className="block lg:hidden">
            <Sidebar
              expanded={false}
              user={user}
              channel={channel!}
              openCreateChannel={() => setShowCreateChannel(true)}
            />
          </div>

          {/* The overlay sidebar only appears when expanded to < lg */}
          {sidebarExpanded && (
            <div className="absolute left-0 top-0 z-50 h-full lg:hidden">
              <Sidebar
                expanded={true}
                user={user}
                channel={channel!}
                openCreateChannel={() => setShowCreateChannel(true)}
              />
            </div>
          )}

          {/* backdrop optional */}
          {sidebarExpanded && (
            <div
              className="absolute inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarExpanded(false)}
            />
          )}

          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>

      <CreateChannelModal
        open={showCreateChannel}
        onOpenChange={setShowCreateChannel}
      />
    </>
  );
}

