'use client'
import React, { use, useEffect, useState } from 'react'
import SidebarStudio from '@/app/studio/channel/layout/SidebarStudio'
import { User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import Header from '@/app/(main)/layout/Header'

export default function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ channel: string }> }) {
  const channel = decodeURIComponent(use(params).channel);
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
      <Header onMenuClick={toggleSidebar} user={user} isStudio={true} channel={channel} className="shadow-md shadow-black/40" />
      <div className="flex flex-1 overflow-hidden">
        <SidebarStudio expanded={sidebarExpanded} user={user} channel={channel} />

        <main className="w-full grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6 px-6 py-4 bg-[#0f0f0f] overflow-y-auto overflow-x-hidden scrollbar-main">
          {children}
        </main>
      </div>
    </div>
  )
}
