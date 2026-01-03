'use client'

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { useAppUser } from "@/hooks/useAppUser";
import { NavigationTabs } from "@/app/components/ui";
import ProfileHeader from "@/app/(main)/[channel]/layout/ProfileHeader";

export default function Layout(
  { children }: { children: React.ReactNode }
) {
  const [activeTab, setActiveTab] = useState('');
  const pathname = usePathname();
  const { user, loading } = useAppUser();

  const channelName = user?.channel?.name || null;

  useEffect(() => {

    if (!pathname) return;

    if (pathname === `/@${channelName}`) {
      setActiveTab("home");
    }

    if (pathname.startsWith(`/@${channelName}/posts`)) {
      setActiveTab("posts");
    }
  }, [pathname, channelName]);

  return (
    <div className="bg-[#0f0f0f] -translate-x-4">
      <ProfileHeader channelName={channelName} loading={loading} />
      <div className="border-b border-b-gray-500 pl-12">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          type="main"
          channelName={channelName}
        />
      </div>
      <main className="pl-12">
        {children}
      </main>
    </div>
  )
}
