import React, { useEffect, useRef } from "react";
import { siteContent } from "../content";
import { PrayerSection } from "../components/PrayerSection";
import anime from "animejs";

interface ChapterFiveProps {
  onContinue: () => void;
}

export const ChapterFive: React.FC<ChapterFiveProps> = ({ onContinue }) => {
  const { chapterFive } = siteContent;
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
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-[#FFFDF8] flex flex-col items-center select-none relative z-10">
      {/* Chapter Subtitle Header */}
      <div ref={headerRef} className="text-center mb-8 sm:mb-12 opacity-0">
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FFFDF8] tracking-wide mb-2 drop-shadow-md">
          {chapterFive.headline}
        </h2>
      </div>

      {/* Reverent Prayer & Scripture */}
      <PrayerSection onContinue={onContinue} />
    </div>
  );
};
