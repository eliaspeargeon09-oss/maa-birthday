import React, { useState, useEffect, useRef } from "react";
import { Play, Volume2, VolumeX, SkipForward } from "lucide-react";

interface FullScreenCelebrationVideoProps {
  videoSrc: string;
  onEnded: () => void;
  onSkip?: () => void;
}

export const FullScreenCelebrationVideo: React.FC<FullScreenCelebrationVideoProps> = ({
  videoSrc,
  onEnded,
  onSkip
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const hideControlsTimer = useRef<number | null>(null);

  // Attempt automatic unmuted playback when mounted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset video to start
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setIsAutoplayBlocked(false);
          startHideTimer();
        })
        .catch(() => {
          // Browser prevented unmuted autoplay -> present prominent tap-to-play button
          setIsAutoplayBlocked(true);
          setIsPlaying(false);
        });
    }

    return () => {
      if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    };
  }, []);

  const startHideTimer = () => {
    if (hideControlsTimer.current) window.clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = window.setTimeout(() => {
      setShowControls(false);
    }, 2800);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    startHideTimer();
  };

  const handleManualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play()
      .then(() => {
        setIsPlaying(true);
        setIsAutoplayBlocked(false);
        startHideTimer();
      })
      .catch((err) => {
        console.warn("Manual video play encountered:", err);
      });
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <div
      role="region"
      aria-label="Celebration Film for Maa"
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseMove}
      className="fixed inset-0 z-[100] w-screen h-screen bg-black flex items-center justify-center overflow-hidden select-none animate-fade-in"
    >
      {/* 1. Full-screen Video Player (Preserves aspect ratio with object-contain & black borders) */}
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        preload="auto"
        onEnded={onEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="w-full h-full max-w-full max-h-full object-contain cursor-pointer"
        onClick={() => {
          if (isAutoplayBlocked) {
            handleManualPlay();
          } else if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
            } else {
              videoRef.current.pause();
            }
          }
        }}
      />

      {/* 2. Prominent Tap-to-Play Overlay if Browser Blocks Autoplay */}
      {isAutoplayBlocked && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-xs p-6 text-center">
          <div className="max-w-md w-full flex flex-col items-center space-y-5 animate-fade-in">
            <button
              type="button"
              onClick={handleManualPlay}
              aria-label="Play Maa's Birthday Celebration Film"
              className="group w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#E8C170] to-[#FFFDF8] text-[#162C20] flex items-center justify-center pl-1 shadow-[0_0_50px_rgba(232,193,112,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-10 h-10 sm:w-12 sm:h-12 fill-current" />
            </button>

            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFFDF8] tracking-wide">
                Maa's Birthday Film
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#A8B89A]">
                Tap anywhere to watch with sound
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Discreet Floating In-Video Controls (Fades out when inactive) */}
      {!isAutoplayBlocked && (
        <div
          className={`absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-3 transition-opacity duration-500 ${
            showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Mute/Unmute Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
            className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-black/50 border border-white/20 text-[#FFFDF8] hover:bg-black/70 hover:border-white/40 transition-all cursor-pointer shadow-lg"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/70" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#E8C170]" />
            )}
          </button>

          {/* Skip Directly to Celebration */}
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full backdrop-blur-md bg-black/50 border border-white/20 text-xs font-serif text-[#FFFDF8] hover:bg-black/70 hover:border-[#E8C170]/60 transition-all cursor-pointer shadow-lg"
            >
              <span>Celebration</span>
              <SkipForward className="w-3.5 h-3.5 text-[#E8C170]" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
