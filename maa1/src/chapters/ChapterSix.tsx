import React, { useEffect, useRef } from "react";
import { siteContent } from "../content";
import { BirthdayCake } from "../components/BirthdayCake";
import anime from "animejs";

interface ChapterSixProps {
  onWishCompleted: () => void;
}

export const ChapterSix: React.FC<ChapterSixProps> = ({ onWishCompleted }) => {
  const { chapterSix } = siteContent;
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
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 text-[#FFFDF8] flex flex-col items-center text-center select-none relative z-10">
      {/* Chapter Subtitle Header */}
      <div ref={headerRef} className="mb-4 opacity-0">
        <span className="font-sans uppercase text-[11px] tracking-widest text-[#E8C170] font-semibold">
          {chapterSix.badge}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FFFDF8] mt-1 mb-2 tracking-wide drop-shadow-md">
          {chapterSix.headline}
        </h2>
        <p className="font-serif italic text-base sm:text-xl text-[#F5F1E7]/85">
          {chapterSix.supportingText}
        </p>
      </div>

      {/* Interactive Birthday Cake with Candle Blow & Countdown */}
      <BirthdayCake onWishMade={onWishCompleted} />
    </div>
  );
};
