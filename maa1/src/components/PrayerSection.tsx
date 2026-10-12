import React, { useEffect, useRef } from "react";
import { siteContent } from "../content";
import { BookOpen } from "lucide-react";
import anime from "animejs";

interface PrayerSectionProps {
  onContinue?: () => void;
}

export const PrayerSection: React.FC<PrayerSectionProps> = ({ onContinue }) => {
  const prayer = siteContent.chapterFive;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const items = containerRef.current.querySelectorAll(".prayer-line");
      anime({
        targets: items,
        opacity: [0, 1],
        translateY: [15, 0],
        delay: anime.stagger(130),
        duration: 800,
        easing: "easeOutCubic"
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-3xl mx-auto flex flex-col items-center select-none relative z-10"
    >
      {/* Reverent Card Container */}
      <div className="w-full glass-greenery-card bg-[#162C20]/90 text-[#FFFDF8] rounded-2xl sm:rounded-3xl p-7 sm:p-12 shadow-[0_25px_60px_rgba(12,24,16,0.95)] border border-[#A8B89A]/30 relative overflow-hidden">
        {/* Soft morning sunbeam glow in background */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E8C170]/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Reverent icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#A8B89A]/50 bg-[#234B35]/60 flex items-center justify-center text-[#A8B89A] shadow-[0_0_20px_rgba(168,184,154,0.25)]">
            <BookOpen className="w-5 h-5 text-[#A8B89A]" />
          </div>
        </div>

        {/* Introduction */}
        <p className="prayer-line opacity-0 text-center font-serif italic text-base sm:text-xl text-[#F5F1E7] mb-8 max-w-xl mx-auto leading-relaxed">
          "{prayer.introduction}"
        </p>

        {/* Prayer Body */}
        <div className="space-y-4 font-serif text-[#FFFDF8] text-base sm:text-lg leading-relaxed sm:leading-loose text-left sm:text-justify max-w-2xl mx-auto">
          {prayer.body.map((line, idx) => {
            const isFirst = idx === 0;
            const isAmen = idx === prayer.body.length - 1;

            return (
              <p
                key={idx}
                className={`prayer-line opacity-0 ${
                  isFirst
                    ? "font-bold text-xl sm:text-2xl text-[#E8C170] italic"
                    : isAmen
                    ? "font-bold text-lg sm:text-xl text-[#E8C170] pt-2"
                    : "text-[#F5F1E7]/95"
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>

        {/* Divider with subtle blessing ribbon */}
        <div className="my-10 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-[#A8B89A]/30" />
          <span className="font-serif text-[#A8B89A] text-xs uppercase tracking-widest">
            {prayer.scriptureBadge}
          </span>
          <div className="h-px w-16 bg-[#A8B89A]/30" />
        </div>

        {/* Numbers 6:24-26 Scripture Card */}
        <div className="prayer-line opacity-0 bg-[#234B35]/70 rounded-2xl p-6 sm:p-8 border border-[#A8B89A]/30 text-center max-w-2xl mx-auto shadow-inner">
          <div className="space-y-1.5 font-serif text-lg sm:text-xl text-[#FFFDF8] leading-relaxed italic">
            {prayer.verse.lines.map((vLine, vIdx) => (
              <p key={vIdx}>{vLine}</p>
            ))}
          </div>
          <p className="mt-4 font-sans text-xs uppercase tracking-widest text-[#E8C170] font-semibold">
            {prayer.verse.reference}
          </p>
        </div>

        {/* Continue Action */}
        {onContinue && (
          <div className="mt-10 pt-6 border-t border-[#A8B89A]/20 flex justify-center">
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] border border-[#A8B89A]/40 font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-md hover:scale-105 cursor-pointer"
            >
              <span>{prayer.continueButton}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
