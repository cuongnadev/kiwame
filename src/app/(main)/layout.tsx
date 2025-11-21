'use client'
import { useEffect, useState } from "react"
import Header from "@/app/components/ui/layout/Header"
import Sidebar from "@/app/components/ui/layout/Sidebar"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isLogin, setIsLogin] = useState<boolean>(false)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLogin(!!user)
    }

    getUser()

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLogin(!!session?.user)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded)

  if (isLogin === null) {
    return <div className="text-white p-6">Loading...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <Header onMenuClick={toggleSidebar} isLogin={isLogin} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar expanded={sidebarExpanded} isLogin={isLogin} />

        <main className="w-full grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main">
          {children}
        </main>
      </div>
    </div>
  )
}
