'use client'
import { use, useState, useEffect } from "react";
import NavigationTabs from "./layout/NavigationTabs"
import ProfileHeader from "./layout/ProfileHeader"
import { usePathname } from "next/navigation";
import { useAppUser } from "@/hooks/useAppUser";

export default function Layout(
  { children }: { children: React.ReactNode }
) {
  const [activeTab, setActiveTab] = useState('');
  const pathname = usePathname();
  const { user, loading } = useAppUser();

  const channel = user?.channel?.name || null;

  useEffect(() => {

    if (!pathname) return;

    if (pathname === `/@${channel}`) {
      setActiveTab("home");
    }

    if (pathname.startsWith(`/@${channel}/posts`)) {
      setActiveTab("posts");
    }
  }, [pathname, channel]);

  return (
    <div className="bg-[#0f0f0f] -translate-x-4">
      <ProfileHeader channel={channel} />
      <div className="border-b border-b-gray-500 pl-12">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          type="main"
          channel={channel}
        />
      </div>
      <div className="pl-12">
        {children}
      </div>
    </div>
  )
}
