import React, { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { MemoryItem } from "../data/memories";

interface MemoryLightboxProps {
  memory: MemoryItem | null;
  memoriesList?: MemoryItem[];
  currentIndex: number;
  totalMemories: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect?: (index: number) => void;
}

export const MemoryLightbox: React.FC<MemoryLightboxProps> = ({
  memory,
  memoriesList = [],
  currentIndex,
  totalMemories,
  isOpen,
  onClose,
  onPrev,
  onNext,
  onSelect
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, onPrev, onNext]);

  // Subtle image transition trigger on index change
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!isOpen || !memory) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-[#0D1812]/92 backdrop-blur-xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full bg-[#162C20]/95 text-[#FFFDF8] rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_70px_rgba(8,18,12,0.95)] border border-[#A8B89A]/30 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with count, tag & close */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-[#A8B89A]/20 bg-[#162C20]/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-serif tracking-widest text-xs uppercase text-[#E8C170] px-2.5 py-0.5 rounded-full bg-[#E8C170]/15 border border-[#E8C170]/30 font-semibold">
              Memory {currentIndex + 1} of {totalMemories}
            </span>
            {memory.dateOrTag && (
              <span className="hidden sm:inline-block text-xs font-sans text-[#A8B89A] border-l border-[#A8B89A]/30 pl-3">
                {memory.dateOrTag}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image lightbox"
            className="p-1.5 rounded-full text-[#FFFDF8]/80 hover:text-[#FFFDF8] hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display Area with Ambient Glow & Zero-Crop Sizing */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[420px] max-h-[62vh] bg-[#0F1D15] flex items-center justify-center overflow-hidden p-3 sm:p-6">
          {/* Ambient Blurred Colored Halo behind the photograph */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-35 scale-125 transition-all duration-700 pointer-events-none"
            style={{ backgroundImage: `url(${memory.image})` }}
          />

          {/* Photograph itself with smooth fade-scale transition */}
          <img
            key={memory.id}
            src={memory.image}
            alt={memory.caption}
            referrerPolicy="no-referrer"
            className={`relative z-10 max-h-[55vh] sm:max-h-[58vh] w-auto max-w-full object-contain mx-auto rounded-xl shadow-2xl transition-all duration-300 ease-out ${
              isAnimating ? "opacity-75 scale-[0.98]" : "opacity-100 scale-100"
            }`}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const fallback = target.parentElement?.querySelector(".fallback-card");
              if (fallback) {
                (fallback as HTMLElement).style.display = "flex";
              }
            }}
          />

          {/* Graceful Archival Keepsake Fallback */}
          <div className="fallback-card hidden absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#234B35] via-[#162C20] to-[#354A2C]">
            <div className="w-16 h-16 rounded-full border-2 border-[#A8B89A] flex items-center justify-center mb-4 text-[#A8B89A] bg-[#162C20]/80 shadow-[0_0_20px_rgba(168,184,154,0.3)]">
              <Heart className="w-7 h-7 text-[#E8C170] fill-[#E8C170]/20" />
            </div>
            <h4 className="font-serif text-2xl text-[#FFFDF8] mb-2 font-semibold">
              {memory.placeholderTitle}
            </h4>
            <p className="font-serif italic text-sm text-[#A8B89A] max-w-md">
              A photograph of love, laughter, and timeless warmth
            </p>
          </div>

          {/* Previous / Next Navigation Arrows */}
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous photograph"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#162C20]/85 text-[#FFFDF8] hover:bg-[#234B35] hover:text-[#E8C170] border border-[#A8B89A]/30 backdrop-blur-md transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next photograph"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-[#162C20]/85 text-[#FFFDF8] hover:bg-[#234B35] hover:text-[#E8C170] border border-[#A8B89A]/30 backdrop-blur-md transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Thumbnail Filmstrip Navigation */}
        {memoriesList.length > 1 && (
          <div className="px-4 py-2.5 bg-[#12231A] border-t border-[#A8B89A]/15 overflow-x-auto flex items-center gap-2 scrollbar-thin">
            {memoriesList.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect && onSelect(i)}
                aria-label={`Go to photograph ${i + 1}`}
                className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  i === currentIndex
                    ? "border-[#E8C170] ring-2 ring-[#E8C170]/40 scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-102"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Caption and Title Footer */}
        <div className="p-4 sm:p-6 bg-[#162C20] border-t border-[#A8B89A]/20 shrink-0">
          <h4 className="font-serif font-semibold text-base sm:text-lg text-[#E8C170] mb-1">
            {memory.placeholderTitle}
          </h4>
          <p
            id="lightbox-title"
            className="font-serif italic text-base sm:text-xl text-[#FFFDF8] leading-relaxed"
          >
            "{memory.caption}"
          </p>
        </div>
      </div>
    </div>
  );
};
