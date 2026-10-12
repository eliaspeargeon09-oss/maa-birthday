import React from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { MusicControl } from "./MusicControl";
import { GreeneryBackground } from "./GreeneryBackground";
import { siteContent } from "../content";

interface ChapterLayoutProps {
  currentChapter: number;
  totalChapters: number;
  chapterTitles: string[];
  onSelectChapter: (index: number) => void;
  children: React.ReactNode;
}

export const ChapterLayout: React.FC<ChapterLayoutProps> = ({
  currentChapter,
  totalChapters,
  chapterTitles,
  onSelectChapter,
  children
}) => {
  const isOpeningFilm = currentChapter === 1;

  return (
    <div className="relative min-h-screen flex flex-col bg-[#14221A] text-[#FFFDF8] overflow-x-hidden selection:bg-[#A8B89A]/30 selection:text-[#FFFDF8]">
      {/* Natural Greenery Photographic Scenery (Active for Part Two) */}
      <GreeneryBackground currentChapter={currentChapter} />

      {/* Part Two: Floating ethereal top status bar (Hidden during Opening Video) */}
      {!isOpeningFilm && (
        <header className="fixed top-4 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 p-2.5 sm:px-5 sm:py-2 rounded-full backdrop-blur-md bg-[#162C20]/70 border border-[#A8B89A]/25 shadow-[0_8px_32px_rgba(12,24,16,0.6)] pointer-events-auto">
            {/* Wordmark */}
            <button
              type="button"
              onClick={() => onSelectChapter(1)}
              className="group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] rounded-md px-1"
              aria-label="Return to beginning film"
            >
              <span className="font-serif italic text-base sm:text-lg font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] via-[#F5F1E7] to-[#A8B89A] group-hover:brightness-110 transition-all">
                {siteContent.navigation.brandName}
              </span>
            </button>

            {/* Discreet progress indicator */}
            <ProgressIndicator
              currentChapter={currentChapter}
              totalChapters={totalChapters}
              chapterTitles={chapterTitles}
              onSelectChapter={onSelectChapter}
            />

            {/* Quiet sound toggle */}
            <MusicControl />
          </div>
        </header>
      )}

      {/* Main Content Viewport */}
      <main
        role="main"
        aria-live="polite"
        className={`relative z-10 flex-1 flex flex-col justify-center w-full ${
          isOpeningFilm
            ? "p-0 min-h-screen"
            : "px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-20 max-w-6xl mx-auto"
        }`}
      >
        {children}
      </main>
    </div>
  );
};
