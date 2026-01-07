import React from 'react';

import { getHomeVideos, getHomeStreams } from '@/app/actions';
import { VideoGrid, VideoPreviewCard } from '@/app/components/common';


export default async function UserHome() {
  const liveStreams = await getHomeStreams();
  const listVideos = await getHomeVideos();

  const videoCount = liveStreams.length + listVideos.length;

  return (
    <VideoGrid videoCount={videoCount}>
      {liveStreams.map((stream) => (
        <VideoPreviewCard
          key={stream.streamId}
          videoId={stream.streamId}
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
    </VideoGrid>
  )
}
