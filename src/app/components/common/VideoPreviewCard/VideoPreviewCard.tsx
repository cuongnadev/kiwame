import { Bookmark, Dot, EllipsisVertical, Play } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { LiveIcon } from '@/app/components/ui/icons/LiveIcon';
import { Button } from '../../ui/button/Button';
import { Popup } from '../../ui/popup/Popup';
import { ShareIcon } from '../../ui/icons/ShareIcon';
import { VideoPlayer } from '../videoPlayer/VideoPlayer';

interface VideoPreviewCardProps {
  videoId: string;
  title: string;
  channel: string;
  views: string;
  publishedAt: string;
  duration?: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  isLive?: boolean;
  avatar?: string;
}

export const VideoPreviewCard: React.FC<VideoPreviewCardProps> = ({
  videoId,
  title,
  channel,
  views,
  publishedAt,
  duration,
  thumbnailUrl,
  previewUrl,
  isLive = false,
  avatar = '/apple-touch-icon.png'
}: VideoPreviewCardProps) => {
  const [hovered, setHovered] = useState(false);
  const hoverTimeout = useRef<NodeJS.Timeout>(null)
  // const router = useRouter();

  const handleClick = () => {
    // router.push(`/watch/${videoId}`);
  }

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => { setHovered(true) }, 800);
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setHovered(false);
  }


  return (
    <div
      onClick={handleClick}
      className='w-full flex flex-col gap-2 cursor-pointer'
    >
      <div
        className='relative w-full rounded-xl aspect-video overflow-hidden bg-black group'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hovered && previewUrl ? (
          <VideoPlayer
            videoUrl={previewUrl}
            preview={false}
          />
        ) : (
          <Image
            src={thumbnailUrl || '/video-placeholder.png'}
            alt={title}
            width={1280}
            height={720}
            className='w-full h-full'
          />
        )}

        {!hovered && (
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
            <Play size={48} className="text-white" />
          </span>
        )}

        {duration && !isLive && (
          <span className='absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded'>
            {duration}
          </span>
        )}

        {isLive && (
          <span className='absolute flex items-center gap-1 bottom-2 right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded'>
            <LiveIcon className='w-4 h-4 fill-white' /> LIVE
          </span>
        )}
      </div>

      <div className='flex items-start gap-2'>
        <Image src={avatar} width={400} height={400} alt={avatar} className='w-[40px] h-[40px] rounded-full' />
        <div className='flex-1 text-ms text-gray-600'>
          <p className='font-bold line-clamp-2'>{title}</p>
          <p>{channel}</p>
          <div className='flex items-center'>
            <p>{views}</p>
            <Dot/>
            <p>{publishedAt}</p>
          </div>
        </div>

        <Popup
          trigger={
            <Button
              icon={<EllipsisVertical width={18} height={18} className='text-gray-500' />}
              radius='full'
              variant='ghost'
              className='w-[32px] h-[32px] hover:!bg-black/10'
            />
          }

          position='right'
        >
          <div className='flex items-center py-2 px-4 gap-2 hover:bg-white/10'>
            <Bookmark className='w-5 h-5  my-[-16px]' /> Lưu vào danh sách phát
          </div>
          <div className='flex items-center py-2 px-4 gap-2 hover:bg-white/10'>
            <ShareIcon className='w-5 h-5 fill-white my-[-16px]' /> Chia sẻ
          </div>
        </Popup>
      </div>
    </div>
  )
}

