'use client';

import { useState } from "react";
import { ListFilter } from "lucide-react";

import { Button, Input, NavigationTabs } from "@/app/components/ui";
import { useAppUser } from "@/hooks/useAppUser";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAppUser();

  const channelName = user?.channel?.name || "Phát trực tiếp";
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="flex flex-col overflow-hidden relative h-full">
      <h2 className="font-bold p-3 text-2xl">
        Nội dung của kênh
      </h2>
      <div className="border-b border-b-gray-500">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          type="content"
          channelName={channelName}
        />
      </div>
      <div className="flex items-center py-2 border-b border-b-gray-500">
        <Button
          icon={<ListFilter size={24} />}
          variant="outline"
          className="border-none p-2!"
        />
        <Input
          type="text"
          placeholder="Lọc"
          variant="bare"
        />
      </div>
      <main className="pt-4 h-full">
        {children}
      </main>
    </div>
  );
}
