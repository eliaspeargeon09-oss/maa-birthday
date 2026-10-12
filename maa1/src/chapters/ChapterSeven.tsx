import React from "react";
import { BirthdayReveal } from "../components/BirthdayReveal";

interface ChapterSevenProps {
  onRevisitMemories: () => void;
  onRestart: () => void;
}

export const ChapterSeven: React.FC<ChapterSevenProps> = ({
  onRevisitMemories,
  onRestart
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 text-[#FFFDF8] flex flex-col items-center">
      <BirthdayReveal
        onRevisitMemories={onRevisitMemories}
        onRestart={onRestart}
      />
    </div>
  );
};
