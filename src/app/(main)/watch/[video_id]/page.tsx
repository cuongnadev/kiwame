'use client'

import Image from 'next/image';
import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Download, Bookmark } from 'lucide-react'

import { Button, ShareIcon } from '@/app/components/ui';
import { VideoPlayer } from '@/app/components/common';
import { Video, VideoItemRow, VideoPart } from "@/types/video"
import { getVideo } from "@/app/actions/video.actions"

interface WatchPagePros {
  video_id: string
}

export default function WatchPage({ video_id }: WatchPagePros) {
  const [activeTab, setActiveTab] = useState("all");
  const [video, setVideo] = useState<Video | null>(null);
  const [parts, setParts] = useState<VideoPart[]>([]);
  useEffect(() => {
    const fetchVideo = async () => {
      const data = await getVideo(video_id);
      setVideo(data);
      const video_parts: VideoPart[] = video?.video_items
        ? video.video_items.map((item: VideoItemRow) => ({
          url: item.cloud_url,
          duration: item.duration,
        }))
        : [];
      setParts(video_parts);
    }
    fetchVideo();
  })

  const videoFeed = [
    { id: "all", label: "Tất cả" },
    { id: "channel", label: "Của ..." },
    { id: "related", label: "Video có liên quan" },
    { id: "for_you", label: "Dành cho bạn" },
    { id: "watch_later", label: "Xem sau" },
  ]

  const subcribe = () => { }

  return (
    <main className="flex">
      <div className="w-3/4 flex-col">
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <VideoPlayer parts={parts} />
        </div>
        {/* Video-Info */}
        <div className="flex flex-col gap-3 mt-3">
          <h2 className="text-xl font-semibold leading-tight text-balance">
            Nhạc Chill Quán Cafe - Những Ca Khúc Lofi Nhẹ Nhàng Hay Nhất Dành Cho Quán Cafe - Nhạc Lofi Chill
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={"https://yt3.ggpht.com/jfdkxkmC2zz4-RkYZKSb4k3PtCWAp4E1ti52THQgigTeY07EFZcJaTfs_TTpzrMi1_DnZXZhTQ=s48-c-k-c0x00ffffff-no-rj"}
                alt=""
                width={400}
                height={400}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col justify-center mr-4">
                <span className="font-semibold">Kẻ lụy tình</span>
                <span className="text-xs text-gray-400">155 N người đăng ký</span>
              </div>
              <Button
                text="Đăng ký"
                variant="outline"
                radius="full"
                className="py-1! px-2! text-sm bg-white! text-black!"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center">
                <Button
                  icon={<ThumbsUp size={20} />}
                  text="6N"
                  variant="outline"
                  className={`border-none text-sm rounded-r-none pr-2 border-r-2 border-r-white`}
                  radius="full"
                />
                <Button
                  icon={<ThumbsDown size={20} />}
                  variant="outline"
                  className={`border-none text-sm rounded-l-none border-l-2 border-l-white`}
                  radius="full"
                />
              </div>
              <Button
                text="Chia sẻ"
                icon={<ShareIcon className="w-10 h-10" />}
                variant="outline"
              />
              <Button
                text="Tải xuống"
                icon={<Download size={20} />}
              />
              <Button
                text="Lưu"
                icon={<Bookmark size={20} />}
              />
              <Button
                text=""
              />
            </div>
          </div>
        </div>
      </div>
      <aside className="shrink-0">

      </aside>
    </main>
  )
}
