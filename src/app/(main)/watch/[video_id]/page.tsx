'use client'
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings } from 'lucide-react';

export default function WatchPage() {
  const videoData = [
    { id: 1, title: 'Video 1', url: 'https://res.cloudinary.com/digs0j48l/video/upload/v1766335528/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/part_001.mp4', duration: 129 },
    { id: 2, title: 'Video 2', url: 'https://res.cloudinary.com/digs0j48l/video/upload/v1766335552/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/part_002.mp4', duration: 129 },
    { id: 3, title: 'Video 3', url: 'https://res.cloudinary.com/digs0j48l/video/upload/v1766335540/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/videos/daf18966-47b8-4f4d-a95e-d9e7dbc2abd9/part_003.mp4', duration: 127 },
  ];

  const getVideoTimeRanges = () => {
    let startTime = 0;
    return videoData.map(video => {
      const range = { video, start: startTime, end: startTime + video.duration };
      startTime += video.duration;
      return range;
    });
  };

  const videoTimeRanges = getVideoTimeRanges();
  const totalDuration = videoData.reduce((sum, v) => sum + v.duration, 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentVideo = videoData[currentIndex];
  const currentRange = videoTimeRanges[currentIndex];

  const findVideoIndexByTime = (time: number) => {
    return videoTimeRanges.findIndex(range => time >= range.start && time < range.end) || 0;
  };

  // Auto hide controls
  useEffect(() => {
    if (!isPlaying) return;

    const hideControls = () => setShowControls(false);
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);

    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(hideControls, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Handle video ended
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      if (currentIndex < videoData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (autoplay) {
        setCurrentIndex(0);
        setCurrentTime(0);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [currentIndex, videoData.length, autoplay]);

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const videoLocalTime = videoRef.current.currentTime;
      const globalTime = currentRange.start + videoLocalTime;
      setCurrentTime(globalTime);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? volume / 100 : 0;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const globalTime = parseFloat(e.target.value);
    setCurrentTime(globalTime);

    const targetVideoIndex = findVideoIndexByTime(globalTime);
    const targetRange = videoTimeRanges[targetVideoIndex];
    const localTime = globalTime - targetRange.start;

    setCurrentIndex(targetVideoIndex);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = localTime;
        if (isPlaying) {
          videoRef.current.play().catch(err => console.error('Play error:', err));
        }
      }
    }, 100);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < videoData.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentTime(videoTimeRanges[currentIndex + 1].start);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentTime(videoTimeRanges[currentIndex - 1].start);
      setIsPlaying(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(err => console.error('Play error:', err));
    } else {
      video.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 bg-black z-50' : 'bg-black'}`}>
      {/* Video Player Container */}
      <div
        ref={containerRef}
        className="relative w-full bg-black flex items-center justify-center"
        style={{ aspectRatio: '16/9' }}
        onMouseMove={() => setShowControls(true)}
      >
        <video
          ref={videoRef}
          src={currentVideo.url}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          crossOrigin="anonymous"
          style={{ display: 'block' }}
        />

        {/* Play button overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-4 rounded-full transition z-20"
          >
            <Play size={48} className="text-black fill-black" />
          </button>
        )}

        {/* Controls Container */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <input
              type="range"
              min="0"
              max={totalDuration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all accent-red-600"
            />
          </div>

          {/* Control Buttons */}
          <div className="px-4 py-3 space-y-3">
            {/* Top controls */}
            <div className="flex items-center justify-between">
              <div className="text-white text-sm">
                <p className="font-semibold">{currentVideo.title}</p>
                <p className="text-xs text-gray-300">Video {currentIndex + 1} / {videoData.length}</p>
              </div>
              <button className="text-white hover:text-gray-300">
                <Settings size={20} />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-gray-300 transition"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="text-white hover:text-gray-300 disabled:text-gray-600 transition"
                >
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === videoData.length - 1}
                  className="text-white hover:text-gray-300 disabled:text-gray-600 transition"
                >
                  <SkipForward size={20} />
                </button>

                <div className="flex items-center gap-2 ml-2">
                  <button onClick={handleMute} className="text-white hover:text-gray-300">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <span className="text-white text-sm ml-2">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-gray-300 transition"
              >
                <Maximize size={20} />
              </button>
            </div>

            {/* Autoplay toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoplay"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="autoplay" className="text-white text-sm">
                Tự động phát video tiếp theo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      {!isFullscreen && (
        <div className="w-full bg-gray-900 border-t border-gray-700 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-semibold mb-4">Danh sách phát</h3>
            <div className="space-y-2">
              {videoData.map((video, index) => {
                const range = videoTimeRanges[index];
                return (
                  <div
                    key={video.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setCurrentTime(range.start);
                      setIsPlaying(true);
                    }}
                    className={`p-3 rounded cursor-pointer transition ${
                      index === currentIndex
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <p className="font-medium text-sm">{video.title}</p>
                    <p className="text-xs">{formatTime(range.start)} - {formatTime(range.end)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}