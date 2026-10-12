import React, { useState, useEffect, useCallback } from "react";
import { ChapterLayout } from "./components/ChapterLayout";
import { ChapterNavigation } from "./components/ChapterNavigation";
import { ChapterOne } from "./chapters/ChapterOne";
import { ChapterTwo } from "./chapters/ChapterTwo";
import { ChapterThree } from "./chapters/ChapterThree";
import { ChapterFour } from "./chapters/ChapterFour";
import { ChapterFive } from "./chapters/ChapterFive";
import { ChapterSix } from "./chapters/ChapterSix";
import { ChapterSeven } from "./chapters/ChapterSeven";
import { siteContent } from "./content";

const CHAPTER_TITLES = siteContent.navigation.chapterTitles;

export default function App() {
  const getInitialChapter = () => {
    if (typeof window !== "undefined") {
      const param = new URLSearchParams(window.location.search).get("chapter");
      if (param) {
        const parsed = parseInt(param, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) return parsed;
      }
    }
    return 1;
  };

  const [currentChapter, setCurrentChapter] = useState<number>(getInitialChapter());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Scroll to top smoothly when scene changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentChapter]);

  const changeChapter = useCallback(
    (newChapter: number) => {
      if (newChapter < 1 || newChapter > 7 || newChapter === currentChapter) return;
      if (isTransitioning) return;

      setIsTransitioning(true);
      setCurrentChapter(newChapter);

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    },
    [currentChapter, isTransitioning]
  );

  const handleNext = () => {
    if (currentChapter < 7) {
      changeChapter(currentChapter + 1);
    }
  };

  const handleBack = () => {
    if (currentChapter > 1) {
      changeChapter(currentChapter - 1);
    }
  };

  const handleRestart = () => {
    changeChapter(1);
  };

  const handleRevisitMemories = () => {
    changeChapter(4);
  };

  // Keyboard navigation support for left/right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight" && currentChapter < 7) {
        handleNext();
      } else if (e.key === "ArrowLeft" && currentChapter > 1) {
        handleBack();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentChapter, handleNext, handleBack]);

  const renderCurrentChapter = () => {
    switch (currentChapter) {
      case 1:
        return <ChapterOne onBegin={() => changeChapter(2)} />;
      case 2:
        return <ChapterTwo onContinue={() => changeChapter(3)} />;
      case 3:
        return <ChapterThree onContinue={() => changeChapter(4)} />;
      case 4:
        return <ChapterFour onContinue={() => changeChapter(5)} />;
      case 5:
        return <ChapterFive onContinue={() => changeChapter(6)} />;
      case 6:
        return <ChapterSix onWishCompleted={() => changeChapter(7)} />;
      case 7:
        return (
          <ChapterSeven
            onRevisitMemories={handleRevisitMemories}
            onRestart={handleRestart}
          />
        );
      default:
        return <ChapterOne onBegin={() => changeChapter(2)} />;
    }
  };

  const getNextLabel = () => {
    const labels = siteContent.navigation.nextButtonLabels;
    switch (currentChapter) {
      case 2:
        return labels.chapter2;
      case 3:
        return labels.chapter3;
      case 4:
        return labels.chapter4;
      case 5:
        return labels.chapter5;
      case 6:
        return labels.chapter6;
      default:
        return labels.default;
    }
  };

  return (
    <ChapterLayout
      currentChapter={currentChapter}
      totalChapters={7}
      chapterTitles={CHAPTER_TITLES}
      onSelectChapter={changeChapter}
    >
      {/* Scene Viewport */}
      <div className="w-full transition-opacity duration-500">
        {renderCurrentChapter()}
      </div>

      {/* Floating Story Navigation Controls */}
      <ChapterNavigation
        currentChapter={currentChapter}
        totalChapters={7}
        canGoBack={currentChapter > 1}
        canGoNext={currentChapter < 7}
        nextLabel={getNextLabel()}
        onBack={handleBack}
        onNext={handleNext}
        onRestart={handleRestart}
        isBusy={isTransitioning}
      />
    </ChapterLayout>
  );
}
