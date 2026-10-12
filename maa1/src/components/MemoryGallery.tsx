import React, { useState, useEffect, useRef } from "react";
import { memories, MemoryItem } from "../data/memories";
import { MemoryLightbox } from "./MemoryLightbox";
import { siteContent } from "../content";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import anime from "animejs";

interface MemoryGalleryProps {
  onContinue?: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ onContinue }) => {
  const { chapterFour } = siteContent;
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const galleryGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (galleryGridRef.current) {
      const cards = galleryGridRef.current.querySelectorAll(".gallery-card");
      anime({
        targets: cards,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.96, 1],
        delay: anime.stagger(90),
        duration: 850,
        easing: "easeOutCubic"
      });
    }
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleOpen = (index: number) => {
    setSelectedMemoryIndex(index);
  };

  const handleClose = () => {
    setSelectedMemoryIndex(null);
  };

  const handlePrev = () => {
    if (selectedMemoryIndex === null) return;
    setSelectedMemoryIndex((selectedMemoryIndex - 1 + memories.length) % memories.length);
  };

  const handleNext = () => {
    if (selectedMemoryIndex === null) return;
    setSelectedMemoryIndex((selectedMemoryIndex + 1) % memories.length);
  };

  const handleSelect = (index: number) => {
    setSelectedMemoryIndex(index);
  };

  return (
    <div className="w-full">
      {/* Editorial Photographic Keepsake Grid */}
      <div
        ref={galleryGridRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {memories.map((item: MemoryItem, idx: number) => {
          const isLoaded = !!loadedImages[item.id];

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`View photograph: ${item.placeholderTitle} - ${item.caption}`}
              onClick={() => handleOpen(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpen(idx);
                }
              }}
              className="gallery-card opacity-0 group relative glass-greenery-card p-4 sm:p-5 rounded-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-[0_22px_45px_rgba(20,44,28,0.7)] hover:border-[#E8C170]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
            >
              {/* Photo Frame with Ambient Glow */}
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-[#14221A] border border-[#A8B89A]/20 mb-4 shadow-inner">
                {/* Ambient photo color halo behind */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-lg opacity-35 scale-125 transition-transform duration-700 group-hover:scale-140"
                  style={{ backgroundImage: `url(${item.image})` }}
                />

                {/* Main photograph */}
                <img
                  src={item.image}
                  alt={item.caption}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  style={{ objectPosition: item.objectPosition || "center 22%" }}
                  className={`relative z-10 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(item.id)}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    const fallback = target.parentElement?.querySelector(".gallery-fallback");
                    if (fallback) {
                      (fallback as HTMLElement).style.display = "flex";
                    }
                  }}
                />

                {/* Graceful Archival Keepsake Mat for Missing Images */}
                <div className="gallery-fallback hidden absolute inset-0 z-20 flex flex-col items-center justify-center p-5 text-center bg-gradient-to-br from-[#234B35] via-[#162C20] to-[#354A2C]">
                  <div className="w-12 h-12 rounded-full border border-[#A8B89A]/50 flex items-center justify-center text-[#A8B89A] bg-[#162C20]/80 mb-3 shadow-[0_0_15px_rgba(168,184,154,0.25)]">
                    <ImageIcon className="w-6 h-6 text-[#A8B89A]" />
                  </div>
                  <h5 className="font-serif font-semibold text-base text-[#FFFDF8] leading-tight">
                    {item.placeholderTitle}
                  </h5>
                  <p className="font-serif italic text-xs text-[#A8B89A]/90 mt-1 line-clamp-2">
                    A precious memory held in our hearts
                  </p>
                </div>

                {/* Hover Reveal Action */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-5 backdrop-blur-[2px]">
                  <span className="px-4 py-1.5 bg-[#FFFDF8] text-[#162C20] text-xs font-semibold rounded-full shadow-lg tracking-wider uppercase transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {chapterFour.hoverOverlayText}
                  </span>
                </div>
              </div>

              {/* Tag & Memory Index */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-[11px] tracking-widest uppercase text-[#E8C170] px-2.5 py-0.5 rounded-full bg-[#E8C170]/10 border border-[#E8C170]/25">
                  Memory {String(idx + 1).padStart(2, "0")}
                </span>
                {item.dateOrTag && (
                  <span className="text-[11px] font-sans tracking-wide text-[#A8B89A]/85">
                    {item.dateOrTag}
                  </span>
                )}
              </div>

              {/* Title & Caption */}
              <div className="pt-1">
                <h4 className="font-serif font-semibold text-base sm:text-lg text-[#FFFDF8] group-hover:text-[#E8C170] transition-colors leading-snug mb-1">
                  {item.placeholderTitle}
                </h4>
                <p className="font-serif italic text-[#F5F1E7]/85 text-sm leading-relaxed line-clamp-2">
                  "{item.caption}"
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info & Continue Action */}
      <div className="mt-12 pt-8 border-t border-[#A8B89A]/20 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="flex items-center gap-2 text-xs font-serif italic text-[#A8B89A]">
          <Sparkles className="w-4 h-4 text-[#E8C170]" />
          <span>{chapterFour.footerHint}</span>
        </div>

        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] border border-[#A8B89A]/40 font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
          >
            <span>{chapterFour.continueButton}</span>
          </button>
        )}
      </div>

      {/* Lightbox Component with smooth transitions */}
      <MemoryLightbox
        isOpen={selectedMemoryIndex !== null}
        memory={selectedMemoryIndex !== null ? memories[selectedMemoryIndex] : null}
        memoriesList={memories}
        currentIndex={selectedMemoryIndex ?? 0}
        totalMemories={memories.length}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={handleSelect}
      />
    </div>
  );
};
