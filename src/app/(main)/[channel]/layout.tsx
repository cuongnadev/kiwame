'use client'
import { use, useState, useEffect } from "react";
import NavigationTabs from "./layout/NavigationTabs"
import ProfileHeader from "./layout/ProfileHeader"
import { usePathname } from "next/navigation";

export default function Layout(
  { children, params }: { children: React.ReactNode, params: Promise<{ channel: string }> }
) {
  const channel = decodeURIComponent(use(params).channel);
  const [activeTab, setActiveTab] = useState('');
  const pathname = usePathname();

  useEffect(() => {

    if (!pathname) return;

    if (pathname === `/${channel}`) {
      setActiveTab("home");
    }

    if (pathname.startsWith(`/${channel}/posts`)) {
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
