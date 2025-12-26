'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Minimize2, Pause, Settings, ClosedCaption, Rewind } from 'lucide-react';
import { Button } from '@/app/components/ui/button/Button';
import { Popup } from '@/app/components/ui/popup/Popup';
import { videoSettingsItems } from '@/constants/menu.constants';
import { LiveKitPlayer } from '@/app/components/common/livekitPlayer/LiveKitPlayer';
import { vi } from 'vitest';

export interface VideoPart {
  url: string;
  duration: number; // seconds
}

interface VideoPlayerProps {
  parts?: VideoPart[];
  isLive?: boolean;
  roomName?: string;
  preview?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  parts = [],
  isLive = false,
  roomName,
  preview = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pendingSeekRef = useRef<number | null>(null);

  const [currentPart, setCurrentPart] = useState(0);
  const [virtualTime, setVirtualTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);

  const totalDurations = parts?.reduce((acc, part) => acc + part.duration, 0) || 0;

  const handlePlay = () => {
    setPlaying(true);
    setShowPlayOverlay(false);
  };

  const handlePause = () => {
    setPlaying(false);
    setShowPlayOverlay(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const findPartByTime = (time: number) => {
    let acc = 0;

    for (let i = 0; i < parts.length; i++) {
      if (time < acc + parts[i].duration) {
        return { index: i, offset: time - acc };
      }
      acc += parts[i].duration;
    }

    return { index: parts.length - 1, offset: parts[parts.length - 1].duration };
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;

    let time = current;

    for (let i = 0; i < currentPart; i++) {
      time += parts[i].duration;
    }

    setVirtualTime(time);
    const prog = totalDurations > 0 ? (time / totalDurations) * 100 : 0;
    setProgress(prog);
  };

  const handleEnded = () => {
    if (currentPart < parts.length - 1) {
      setCurrentPart((p) => p + 1);
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  };

  const handleSeek = (percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    const targetTime = (clamped / 100) * totalDurations;
    const { index, offset } = findPartByTime(targetTime);

    if (index === currentPart && videoRef.current) {
      videoRef.current.currentTime = offset;
      if (playing) videoRef.current.play().catch(() => { });
    } else {
      pendingSeekRef.current = offset;
      setCurrentPart(index);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playing) return;

    const tryPlay = () => {
      video.play().catch(() => { });
    };

    tryPlay();

    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);

    return () => {
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
    };
  }, [currentPart, playing]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => {
      if (pendingSeekRef.current !== null) {
        video.currentTime = pendingSeekRef.current;
        pendingSeekRef.current = null;

        if (playing) {
          video.play().catch(() => { });
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoaded);
    video.addEventListener('canplay', handleLoaded);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoaded);
      video.removeEventListener('canplay', handleLoaded);
    };
  }, [currentPart, playing]);

  if (!isLive && parts.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black rounded-xl overflow-hidden group"
    >
      {isLive && roomName ? (
        <LiveKitPlayer roomName={roomName!} />
      ) : (
        <>
          <video
            ref={videoRef}
            src={parts[currentPart]?.url}
            className="w-full h-full object-cover"
            playsInline
            muted={muted}
            autoPlay={preview}
            preload="auto"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPlay={handlePlay}
            onPause={handlePause}
          />

          {/* Preload part tiếp theo để chuyển mượt */}
          {currentPart < parts.length - 1 && (
            <video
              src={parts[currentPart + 1].url}
              preload="auto"
              style={{ display: 'none' }}
            />
          )}
        </>
      )}

      {!playing && !preview && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
        >
          <Play size={48} className="text-white" />
        </div>
      )}

      {!preview && (
        <div className="absolute bottom-0 left-0 w-full p-2 bg-black/50 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className='flex items-center gap-0.5'>
            <Button
              variant='ghost'
              radius='full'
              icon={<Rewind size={20} className="text-white" />}
              onClick={togglePlay}
            />
            <Button
              variant='ghost'
              radius='full'
              icon={playing ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white" />}
              onClick={togglePlay}
            />
            <Button
              variant='ghost'
              radius='full'
              icon={<Rewind size={20} className="text-white rotate-180" />}
              onClick={togglePlay}
            />
          </div>

          <div className="flex items-center flex-1 mx-4">
            <div
              className="relative h-1 bg-gray-600 rounded-full flex-1 cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = (x / rect.width) * 100;
                handleSeek(Math.max(0, Math.min(100, percent))); // clamp 0-100
              }}
            >
              <div
                className="absolute h-full bg-red-600 rounded-full pointer-events-none"
                style={{ width: `${progress}%` }}
              />
              <div
                className="absolute w-3 h-3 bg-red-600 rounded-full -translate-y-1 -translate-x-1/2 pointer-events-none"
                style={{ left: `${progress}%` }}
              />
            </div>
          </div>

          <div className='flex items-center gap-0.5'>
            <Button
              variant='ghost'
              radius='full'
              icon={<ClosedCaption size={20} className="text-white" />}
            />
            <Popup
              trigger={
                <Button
                  variant='ghost'
                  radius='full'
                  icon={<Settings size={20} className="text-white" />}
                />
              }
              position='top'
            >
              {videoSettingsItems.map((item, index) => (
                <div key={index} className='flex items-center justify-between py-2 px-4 gap-2 hover:bg-white/10'>
                  <div className='flex items-center gap-1'>
                    {item.icon_1}
                    <p className='leading-[18px] text-white'>{item.label_1}</p>
                  </div>
                  <div className='flex items-center gap-1'>
                    <p className='leading-[18px] text-white'>{item.label_2}</p>
                    {item.icons_2}
                  </div>
                </div>
              ))}
            </Popup>
            <Button
              variant='ghost'
              radius='full'
              icon={muted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
              onClick={toggleMute}
            />
            <Button
              variant='ghost'
              radius='full'
              icon={fullscreen ? <Minimize2 size={20} className="text-white" /> : <Maximize2 size={20} className="text-white" />}
              onClick={toggleFullscreen}
            />
          </div>
        </div>
      )}
    </div>
  );
};
