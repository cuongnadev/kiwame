'use client'
import { useEffect, useState } from "react"
import Header from "@/app/components/ui/layout/Header"
import Sidebar from "@/app/components/ui/layout/Sidebar"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user ?? null)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded)

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Header onMenuClick={toggleSidebar} user={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar expanded={sidebarExpanded} user={user} />

        <main className="w-full grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main">
          {children}
        </main>
      </div>
    </div>
  )
}
