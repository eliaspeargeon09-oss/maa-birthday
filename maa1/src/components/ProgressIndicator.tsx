import React from "react";

interface ProgressIndicatorProps {
  currentChapter: number;
  totalChapters: number;
  chapterTitles: string[];
  onSelectChapter?: (chapterIndex: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentChapter,
  totalChapters,
  chapterTitles,
  onSelectChapter
}) => {
  const currentTitle = chapterTitles[currentChapter - 1] || "";
  const formattedIndex = String(currentChapter).padStart(2, "0");
  const formattedTotal = String(totalChapters).padStart(2, "0");

  return (
    <div className="flex items-center gap-3 md:gap-5 select-none">
      <div className="flex items-center gap-2">
        <span className="font-serif tracking-widest text-[11px] uppercase text-[#A8B89A] font-bold">
          Scene {formattedIndex} <span className="opacity-40">/</span> {formattedTotal}
        </span>
        <span
          className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#A8B89A]/40"
          aria-hidden="true"
        />
        <span className="hidden sm:inline font-serif italic text-xs tracking-wide text-[#FFFDF8]/90">
          {currentTitle}
        </span>
      </div>

      {/* Discreet chapter dots */}
      <div
        className="flex items-center gap-1.5"
        role="tablist"
        aria-label="Scene progress"
      >
        {Array.from({ length: totalChapters }, (_, i) => {
          const chapterNum = i + 1;
          const isActive = chapterNum === currentChapter;
          const isPassed = chapterNum < currentChapter;

          return (
            <button
              key={chapterNum}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Jump to Scene ${chapterNum}: ${chapterTitles[i]}`}
              onClick={() => onSelectChapter && onSelectChapter(chapterNum)}
              className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] ${
                isActive
                  ? "w-6 bg-[#A8B89A] shadow-[0_0_12px_rgba(168,184,154,0.9)]"
                  : isPassed
                  ? "w-2 bg-[#234B35] hover:bg-[#A8B89A]/70"
                  : "w-2 bg-[#162C20]/80 hover:bg-[#A8B89A]/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
