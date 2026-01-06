'use client'

import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import { ThumbsUp, ThumbsDown, Download, Bookmark,  Send,  MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button, Input, ShareIcon } from '@/app/components/ui';
import { VideoPlayer } from '@/app/components/common';
import { Video, VideoItemRow, VideoPart } from "@/types/video"
import { addComment, getComments, getVideo } from "@/app/actions"
import { useParams } from 'next/navigation';
import TextareaAutosize from "react-textarea-autosize";
import { useAppUser } from '@/hooks/useAppUser';
import { Comment } from '@/types/comment';
import { CommentItem } from '@/app/components/common/comment/CommentItem';

export default function WatchPage() {
  const params = useParams();
  const video_id = params.video_id as string;
  const [activeTab, setActiveTab] = useState("all");
  const [video, setVideo] = useState<Video | null>(null);
  const [parts, setParts] = useState<VideoPart[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAppUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [countVideoLike, setCountVideoLike] = useState<number>(0)
  const [likeVideo, setLikeVideo] = useState<boolean | null>(null)
  const [likedComments, setLikedComments] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  const [videoFeed, setVideoFeed] = useState([
    { id: "all", label: "Tất cả" },
    { id: "channel", label: "Của ..." },
    { id: "related", label: "Video có liên quan" },
    { id: "for_you", label: "Dành cho bạn" },
    { id: "watch_later", label: "Xem sau" },
  ]);


  useEffect(() => {
    if (!video_id) return;
    const fetchVideo = async () => {
      console.log("Video id:", video_id);
      const data = await getVideo(video_id);
      console.log("Video data:", data);
      setVideo(data);

    };

    fetchVideo();
  }, [video_id]);

  // useEffect(()=>{

  // }, [activeTab])

  useEffect(() => {
    if (!video?.channel) return;

    setVideoFeed((prev) =>
      prev.map((feed) =>
        feed.id === "channel"
          ? { ...feed, label: `Của ${video.channel?.profile.full_name}` }
          : feed
      )
    );
    setCountVideoLike(parseInt(video.likes))
    setLikeVideo(video.isLike ?? null)
  }, [video]);

  useEffect(() => {
    if (!video?.id) return
    const fetchComment = async () => {
      const data = await getComments(video.id)
      console.log(data)
      setComments(data)
    }
    fetchComment()
  }, [video])

  useEffect(() => {
    if (video?.video_items) {
      const video_parts: VideoPart[] = video.video_items.map((item: VideoItemRow) => ({
        url: item.cloud_url,
        duration: item.duration,
      }));
      setParts(video_parts);
    } else {
      setParts([]);
    }
  }, [video?.video_items]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user?.id) {
      return
    }
    setIsSubmittingComment(true)
    try {
      const newCommentData = await addComment(video_id, user.id, newComment)
      if (newCommentData) {
        setComments([newCommentData, ...comments])
        setNewComment("")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  };

  const handleLikeVideo = (status: string) => {
    if (likeVideo === null && status === "like") {
      setLikeVideo(true)
      setCountVideoLike(countVideoLike+1)
    } else if (likeVideo === null && status === "dislike") {
      setLikeVideo(false)
    } else if(likeVideo === true && status === "dislike") {
      setCountVideoLike(countVideoLike-1)
      setLikeVideo(false)
    }else if(likeVideo === false && status === "like") {
      setCountVideoLike(countVideoLike+1)
      setLikeVideo(true)
    }else if(likeVideo === true && status=== "like") {
      setCountVideoLike(countVideoLike-1)
      setLikeVideo(null)
    }else {
      setLikeVideo(null)
    }
    const user_id = user?.id ? user.id : "";
    const like = async () => {
      await fetch("/api/like/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_id,
          user_id: user_id,
          status,
        }),
      })
    }
    like()
  }

  const handleLikeComment = (commentId: string) => {

  }

  const handleDislikeComment = (commentId: string) => {
  }

  const scroll = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      const scrollAmount = 150; // Dịch mỗi lần 150px thay vì 300px
      const maxScroll = container.scrollWidth - container.clientWidth;
      const newPosition = direction === 'left'
        ? Math.max(container.scrollLeft - scrollAmount, 0)
        : Math.min(container.scrollLeft + scrollAmount, maxScroll);

      container.scrollLeft = newPosition;

      // Update arrow visibility
      setCanScrollLeft(newPosition > 0);
      setCanScrollRight(newPosition < maxScroll);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tabsContainerRef.current) return;
    setIsDragging(true);
    setDragStart(e.clientX + tabsContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const x = e.clientX;
    const walk = dragStart - x;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const newScrollLeft = Math.max(0, Math.min(walk, maxScroll));

    container.scrollLeft = newScrollLeft;
    updateArrowVisibility(newScrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateArrowVisibility = (scrollLeft: number) => {
    if (!tabsContainerRef.current) return;
    const container = tabsContainerRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < maxScroll);
  };

  useEffect(() => {
    if (tabsContainerRef.current) {
      const maxScroll = tabsContainerRef.current.scrollWidth - tabsContainerRef.current.clientWidth;
      setCanScrollLeft(false);
      setCanScrollRight(maxScroll > 0);
    }
  }, []);

  const getVideoList = async () => {
    if (activeTab === "channel") {

    }
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabsContainerRef.current) {
      const activeTabElement = tabsContainerRef.current.querySelector(`[data-tab-id="${tabId}"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };


  const subcribe = () => {

  };

  return (
    <main className="flex h-[620px] w-full bg-black text-white group/sidebar">
      {/* Main Content */}
      <div className="w-3/4 h-full overflow-y-auto scrollbar-hover">
        <div className="p-4 space-y-4">
          {/* Video Player */}
          <div className="aspect-video w-full rounded-xl bg-black overflow-hidden">
            <VideoPlayer parts={parts} />
          </div>

          {/* Video Info */}
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold leading-tight text-balance">
              {video?.title || "Nhạc Chill Quán Cafe - Những Ca Khúc Lofi Nhẹ Nhàng Hay Nhất Dành Cho Quán Cafe - Nhạc Lofi Chill"}
            </h2>

            {/* Channel Info & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src={video?.channel?.avatar_url || '/default-avatar.png'}
                  alt="channel avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col justify-center mr-4">
                  <span className="font-semibold text-sm">{video?.channel?.profile.full_name || "Soul Tracks"}</span>
                  <span className="text-xs text-gray-400">186 N người đăng ký</span>
                </div>
                <Button
                  text="Đăng ký"
                  variant="outline"
                  radius="full"
                  className="py-2! px-4! text-sm bg-white! text-black! hover:bg-gray-200!"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <div className="flex items-center rounded-full">
                  <Button
                    icon={<ThumbsUp size={18} className={`${likeVideo ? 'text-blue-500' : ''}`} />}
                    text={countVideoLike.toString()}
                    onClick={() => { handleLikeVideo("like") }}
                    variant="outline"
                    className={`text-sm rounded-r-none! py-2! pr-2! border-2! ${likeVideo && 'text-blue-500!'}`}
                    radius="full"
                  />
                  <span className="h-9 w-[1px] bg-white/60"></span>
                  <Button
                    icon={<ThumbsDown size={18} className={`w-5 h-5 ${likeVideo === false ? 'text-blue-500' : ''}`} />}
                    onClick={() => { handleLikeVideo("dislike") }}
                    variant="outline"
                    className={`text-sm rounded-l-none! pl-2! py-2! border-2!`}
                    radius="full"
                  />
                </div>
                <Button
                  icon={<ShareIcon className="w-5 h-5 text-white fill-white" />}
                  text="Chia sẻ"
                  variant="outline"
                  className={`text-sm border-2! py-2! px-2!`}
                  radius='full'
                />
                <Button
                  icon={<Bookmark size={18} />}
                  text="Lưu"
                  variant="outline"
                  className={`text-sm border-2! py-2! px-2!`}
                  radius='full'
                />
                <Button
                  icon={<Download size={18} />}
                  text="Tải xuống"
                  variant="outline"
                  className={`text-sm border-2! py-2! px-2!`}
                  radius='full'
                />
                <Button
                  icon={<MoreHorizontal size={20} />}
                  variant="outline"
                  className={`text-xs border-2! py-2! px-[8px]!`}
                  radius='full'
                />
              </div>

            </div>
          </div>

          {/* Description */}
          {video?.description && (
            <div className="bg-gray-900 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-sm">Mô tả</h3>
              <p className="text-sm text-gray-300">{video.description}</p>
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-8 pb-8">
            <h2 className="text-lg font-bold mb-6">Bình luận ({comments.length})</h2>

            {/* Add Comment */}
            <div className="flex items-start gap-4 mb-8">
              <Image
                src={user?.avatar_url || '/default-avatar.png'}
                alt="user avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
                onClick={() => { }}
              />
              <div className="flex-1">
                <TextareaAutosize
                  value={newComment}
                  onChange={(e) => { setNewComment(e.target.value) }}
                  minRows={1}
                  placeholder="Viết bình luận"
                  className="w-full bg-transparent text-white pb-1 mt-2 resize-none border-b border-white focus:outline-1   "
                />
                {newComment && (
                  <div className="flex gap-2 mt-4 justify-end">
                    <Button
                      onClick={() => setNewComment("")}
                      text='Hủy'
                      variant="outline"
                      radius='full'
                    />
                    <Button
                      text="Bình luận"
                      icon={<Send size={16} />}
                      variant="primary"
                      className="text-sm"
                      radius="full"
                      loading={isSubmittingComment}
                      onClick={handleAddComment}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-neutral-500 font-bold text-md">Chưa có bình luận nào.</p>
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    liked={likedComments.includes(comment.id)}
                    handleDislike={handleDislikeComment}
                    deleteComment={() => { }}
                    user_id={user?.id || ''}
                  />
                )))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Related Videos */}
      <aside className="w-1/4 h-full flex flex-col overflow-y-auto scrollbar-hover bg-black">
        <div className='sticky top-0 bg-black py-3 z-10'>
          <div className="flex items-center gap-2 px-2">
            {canScrollLeft && (
              <Button
                icon={<ChevronLeft size={20} />}
                onClick={() => scroll('left')}
                variant='outline'
                radius='full'
                className='p-2! border-none'
              />
            )}
            <div
              ref={tabsContainerRef}
              className="flex-1 overflow-hidden flex items-center gap-3"
              style={{ scrollBehavior: 'smooth' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {videoFeed.map((tab) => (
                <Button
                  key={tab.id}
                  text={tab.label}
                  variant={activeTab === tab.id ? "ghost" : "outline"}
                  radius="md"
                  className={`text-sm py-1! px-2! border-none flex-shrink-0 ${activeTab === tab.id ? 'bg-white! text-black!' : 'bg-neutral-800! hover:bg-neutral-700!'}`}
                  onClick={() => handleTabClick(tab.id)}
                />
              ))}

            </div>
            {canScrollRight && (
              <Button
                icon={<ChevronRight size={20} />}
                onClick={() => scroll('right')}
                variant='outline'
                radius='full'
                className='p-2! border-none'
              />
            )}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {videoList.length > 0 ? (
            videoList.map((video) => (
              <div key={video.id}></div>
            ))
          ) : (
            <div>Chưa có video nào</div>
          )}
        </div>
      </aside>
    </main >
  )
}