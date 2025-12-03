'use client'
import { use, useEffect, useState } from "react"
import Header from "@/app/(main)/layout/Header"
import Sidebar from "@/app/(main)/layout/Sidebar"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [channel, setChannel] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const getUserAndChannel = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);

      if (!user) return;

      const { data: channelData } = await supabase
        .from("channels")
        .select("name")
        .eq("owner_id", user.id)
        .single();

      setChannel(channelData?.name ?? null);
    }

    getUserAndChannel()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded)

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Header onMenuClick={toggleSidebar} user={user} channel={channel}/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar expanded={sidebarExpanded} user={user} />

        <main className="w-full grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main">
          {children}
        </main>
      </div>
    </div>
  )
}
