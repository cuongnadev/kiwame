'use client'
import NavigationTabs from "../../../components/ui/tabs/NavigationTabs"
import CreatePostForm from "./CreatePostForm"
import { use, useState } from "react"
import { useSearchParams } from "next/navigation"
import PostedPage from "./PostedPage"
import SavedPage from "./SavedPage"
import ScheduledPage from "./ScheduledPage"

export default function PostsPage(
  { params }: { params: Promise<{ channel: string }> }
) {
  const channel = decodeURIComponent(use(params).channel)
  const [activeTab, setActiveTab] = useState("posted");
  const searchParams = useSearchParams();
  const postType = searchParams.get('type');

  return (
    <div className="mt-10 ">
      {/* CreatePostForm */}
      <CreatePostForm />
      <div className="border-b border-b-gray-500 w-1/2 mt-4">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} type="posts" channel={channel} />
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
