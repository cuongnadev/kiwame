'use client'
import React, { use, useState } from 'react'
import SidebarStudio from '@/app/studio/channel/layout/SidebarStudio'
import Header from '@/app/(main)/layout/Header'
import { useAppUser } from '@/hooks/useAppUser'

export default function Layout({ children, params }: { children: React.ReactNode, params: Promise<{ channel: string }> }) {
  const channel = decodeURIComponent(use(params).channel);
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const { user, loading } = useAppUser()

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
