import React, { useEffect, useRef } from "react";
import { siteContent } from "../content";
import { MemoryGallery } from "../components/MemoryGallery";
import { Camera } from "lucide-react";
import anime from "animejs";

interface ChapterFourProps {
  onContinue: () => void;
}

export const ChapterFour: React.FC<ChapterFourProps> = ({ onContinue }) => {
  const { chapterFour } = siteContent;
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      anime({
        targets: headerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 900,
        easing: "easeOutCubic"
      });
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-[#FFFDF8] flex flex-col items-center select-none relative z-10">
      {/* Chapter Header */}
      <div ref={headerRef} className="text-center mb-10 sm:mb-14 max-w-2xl opacity-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#234B35]/70 border border-[#A8B89A]/30 text-[#A8B89A] text-xs font-sans uppercase tracking-widest mb-3 backdrop-blur-md">
          <Camera className="w-3.5 h-3.5 text-[#A8B89A]" />
          <span>{chapterFour.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FFFDF8] tracking-wide mb-3 drop-shadow-md">
          {chapterFour.headline}
        </h2>
        <p className="font-serif italic text-base sm:text-xl text-[#F5F1E7]/85">
          {chapterFour.subheading}
        </p>
      </div>

      {/* Interactive Photographic Gallery */}
      <MemoryGallery onContinue={onContinue} />
    </div>
  );
};
