'use client';
import React, { useRef, useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Minimize2, Pause, Settings, ClosedCaption, Rewind } from 'lucide-react';
import { Button } from '@/app/components/ui/button/Button';
import { Popup } from '@/app/components/ui/popup/Popup';
import { videoSettingsItems } from '@/constants/menu.constants';

interface VideoPlayerProps {
  videoUrl: string;
  preview?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  preview = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
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

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        muted={muted}
        playsInline
        autoPlay={preview}
      />

      {!playing && !preview && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer" onClick={togglePlay}>
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

          <div className="flex-1 h-1 bg-gray-500 rounded mx-2 relative cursor-pointer">
            <div className="h-1 bg-red-600 rounded" style={{ width: `${progress}%` }} />
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
