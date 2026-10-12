import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, SkipForward, Music, Check } from "lucide-react";
import { musicManager } from "../utils/audioController";
import type { AudioTrack } from "../data/audioTracks";

export const MusicControl: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack>(musicManager.getCurrentTrack());
  const [showMenu, setShowMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsPlaying(musicManager.getIsPlaying());
    setCurrentTrack(musicManager.getCurrentTrack());

    const unsubscribe = musicManager.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleToggle = () => {
    musicManager.toggle();
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    musicManager.nextTrack();
  };

  const handleSelectTrack = (trackId: string) => {
    musicManager.setTrack(trackId);
    setShowMenu(false);
  };

  const tracks = musicManager.getTracks();

  return (
    <div ref={containerRef} className="relative flex items-center gap-1.5">
      {/* Primary Play/Pause Audio Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? `Pause background music (${currentTrack.title})` : `Play background music (${currentTrack.title})`}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border ${
          isPlaying
            ? "bg-[#234B35]/85 border-[#A8B89A]/70 text-[#A8B89A] shadow-[0_0_15px_rgba(168,184,154,0.35)]"
            : "bg-[#162C20]/60 border-[#A8B89A]/25 text-[#FFFDF8]/60 hover:text-[#FFFDF8] hover:border-[#A8B89A]/50"
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] cursor-pointer`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Volume2 className="w-4 h-4 text-[#A8B89A]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#A8B89A] animate-ping" />
          </div>
        ) : (
          <VolumeX className="w-4 h-4 text-white/60" />
        )}
      </button>

      {/* Selectable Track Button / Menu Trigger */}
      <button
        type="button"
        onClick={() => setShowMenu((prev) => !prev)}
        aria-label="Select background audio track"
        title={currentTrack.title}
        className={`h-9 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-sans transition-all backdrop-blur-md border cursor-pointer ${
          showMenu
            ? "bg-[#234B35] border-[#A8B89A] text-[#FFFDF8]"
            : "bg-[#162C20]/60 border-[#A8B89A]/25 text-[#F5F1E7]/80 hover:text-[#FFFDF8] hover:bg-[#162C20]/80 hover:border-[#A8B89A]/40"
        }`}
      >
        <Music className="w-3.5 h-3.5 text-[#E8C170]" />
        <span className="hidden md:inline-block max-w-[120px] truncate font-serif italic text-xs">
          {currentTrack.title}
        </span>
        <button
          type="button"
          onClick={handleNextTrack}
          title="Switch to next track"
          aria-label="Switch to next track"
          className="p-0.5 hover:text-[#E8C170] transition-colors ml-0.5"
        >
          <SkipForward className="w-3 h-3 text-[#A8B89A]" />
        </button>
      </button>

      {/* Dropdown Menu of Selectable Audio Tracks */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[#162C20]/95 backdrop-blur-xl border border-[#A8B89A]/35 shadow-[0_15px_40px_rgba(12,24,16,0.85)] z-50 animate-fade-in text-left">
          <div className="px-3 py-1.5 border-b border-[#A8B89A]/15 mb-1.5">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#E8C170] font-semibold">
              Background Music
            </span>
          </div>

          <div className="space-y-1">
            {tracks.map((track) => {
              const isSelected = track.id === currentTrack.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectTrack(track.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#234B35] text-[#FFFDF8] border border-[#A8B89A]/30"
                      : "text-[#F5F1E7]/75 hover:bg-[#162C20] hover:text-[#FFFDF8]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-serif font-medium truncate text-[#FFFDF8]">
                      {track.title}
                    </p>
                    {track.subtitle && (
                      <p className="text-[10px] font-sans text-[#A8B89A] truncate">
                        {track.subtitle}
                      </p>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#E8C170] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
