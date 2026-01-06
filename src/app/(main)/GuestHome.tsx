import React from 'react';

import { getHomeVideos } from '@/app/actions';
import { VideoGrid, VideoPreviewCard } from '@/app/components/common';

export default async function GuestHome() {
  const listVideos = await getHomeVideos();

  const videoCount = listVideos.length;

  return (
    <VideoGrid videoCount={videoCount}>
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
    </VideoGrid>
  )
}
