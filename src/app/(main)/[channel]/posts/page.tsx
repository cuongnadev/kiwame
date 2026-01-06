'use client'

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAppUser } from "@/hooks/useAppUser";
import { NavigationTabs } from "@/app/components/ui";
import CreatePostForm from "@/app/(main)/[channel]/posts/CreatePostForm";
import PostedPage from "@/app/(main)/[channel]/posts/PostedPage";
import SavedPage from "@/app/(main)/[channel]/posts/SavedPage";
import ScheduledPage from "@/app/(main)/[channel]/posts/ScheduledPage";

export default function PostsPage() {
  const [activeTab, setActiveTab] = useState("posted");
  const searchParams = useSearchParams();
  const postType = searchParams.get('type');

  const { user, loading } = useAppUser();

  const channelName = user?.channel?.name || null;

  return (
    <div className="mt-10 ">
      {/* CreatePostForm */}
      <CreatePostForm />
      <div className="border-b border-b-gray-500 w-1/2 mt-4">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} type="posts" channelName={channelName} />
      </div>
      <div>
        {postType === 'posted' || postType === null && (
          <PostedPage />
        )}
        {postType === 'saved' && (
          <SavedPage />
        )}
        {postType === 'scheduled' && (
          <ScheduledPage />
        )}
      </div>
    </div>
  )
}
