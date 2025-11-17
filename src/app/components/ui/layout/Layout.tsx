'use client'

import Header from "./Header"
import Sidebar from "./Sidebar"
import { useState } from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isLogin, setIsLogin] = useState(true);

    const toggleSidebar = () => {
        setSidebarExpanded(!sidebarExpanded);
    };
    return (
        <div className="flex flex-col h-screen bg-[#0f0f0f]">
            <Header onMenuClick={toggleSidebar} isLogin={isLogin} />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar expanded={sidebarExpanded} isLogin={isLogin} />
                {children}
            </div>
        </div>
    )
}