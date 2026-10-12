import React, { useEffect, useRef } from "react";
import { LetterEnvelope } from "../components/LetterEnvelope";
import { Mail } from "lucide-react";
import anime from "animejs";
import { siteContent } from "../content";

interface ChapterThreeProps {
  onContinue: () => void;
}

export const ChapterThree: React.FC<ChapterThreeProps> = ({ onContinue }) => {
  const { chapterThree } = siteContent;
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (headerRef.current) {
      anime({
        targets: headerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 850,
        easing: "easeOutCubic"
      });
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-[#FFFDF8] flex flex-col items-center select-none relative z-10">
      {/* Chapter Subtitle Header */}
      <div ref={headerRef} className="text-center mb-8 sm:mb-12 opacity-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#234B35]/70 border border-[#A8B89A]/30 text-[#A8B89A] text-xs font-sans uppercase tracking-widest mb-3 backdrop-blur-md">
          <Mail className="w-3.5 h-3.5 text-[#A8B89A]" />
          <span>{chapterThree.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FFFDF8] tracking-wide mb-2 drop-shadow-md">
          {chapterThree.title}
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F5F1E7]/85">
          {chapterThree.subtitle}
        </p>
      </div>

      {/* Interactive Letter Envelope & Parchment */}
      <LetterEnvelope onContinue={onContinue} />
    </div>
  );
};
