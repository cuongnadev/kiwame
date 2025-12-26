import React from 'react'
import { getHomeStreams } from '@/app/actions/stream.actions';
import { getHomeVideos } from '@/app/actions/video.action';
import { VideoPreviewCard } from '@/app/components/common/VideoPreviewCard/VideoPreviewCard'

export default async function UserHome() {
  const liveStreams = await getHomeStreams();
  const listVideos = await getHomeVideos();

  return (
    <>
      {liveStreams.map((stream) => (
          <VideoPreviewCard
            key={stream.videoId}
            videoId={stream.videoId}
            title={stream.title}
            channel={stream.channel}
            views={stream.views}
            thumbnailUrl={stream.thumbnailUrl}
            avatar={stream.avatar}
            isLive={true}
            roomName={stream.roomName}
          />
        ))}

      {listVideos.map((video) => (
        <VideoPreviewCard
          key={video.videoId}
          videoId={video.videoId}
          title={video.title}
          channel={video.channel}
          views={video.views}
          publishedAt={video.publishedAt}
          duration={video.duration}
          thumbnailUrl={video.thumbnailUrl}
          avatar={video.avatar}
          parts={video.parts}
        />
      ))}
    </>
  )
}
