import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChapterNavigationProps {
  currentChapter: number;
  totalChapters: number;
  canGoBack?: boolean;
  canGoNext?: boolean;
  nextLabel?: string;
  backLabel?: string;
  onBack: () => void;
  onNext: () => void;
  onRestart?: () => void;
  isBusy?: boolean;
}

export const ChapterNavigation: React.FC<ChapterNavigationProps> = ({
  currentChapter,
  totalChapters,
  canGoBack = true,
  canGoNext = true,
  nextLabel = "Continue",
  backLabel = "Back",
  onBack,
  onNext,
  isBusy = false
}) => {
  // Opening film (1) and Final reveal (totalChapters) have their own cinematic in-scene actions
  if (currentChapter === 1 || currentChapter === totalChapters) {
    return null;
  }

  return (
    <nav
      aria-label="Story Navigation"
      className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-40 px-4 sm:px-8 pointer-events-none"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 pointer-events-auto">
        {/* Back Action */}
        <div>
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              disabled={isBusy}
              aria-label="Return to previous scene"
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-serif italic rounded-full transition-all cursor-pointer backdrop-blur-md bg-[#162C20]/70 border border-[#A8B89A]/25 text-[#F5F1E7] hover:text-[#FFFDF8] hover:bg-[#234B35]/80 hover:border-[#A8B89A]/50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none shadow-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-[#A8B89A]" />
              <span>{backLabel}</span>
            </button>
          ) : (
            <div />
          )}
        </div>

        {/* Forward Action */}
        <div>
          {canGoNext && (
            <button
              type="button"
              onClick={onNext}
              disabled={isBusy}
              aria-label="Proceed to next scene"
              className="group flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 shadow-[0_6px_25px_rgba(22,44,32,0.6)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] border border-[#A8B89A]/40 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>{nextLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#A8B89A]" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
