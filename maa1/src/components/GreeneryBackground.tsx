import React from "react";

interface GreeneryBackgroundProps {
  currentChapter: number;
}

export const GreeneryBackground: React.FC<GreeneryBackgroundProps> = ({ currentChapter }) => {
  // Opening scene (chapter 1) uses the full-screen cinematic video itself!
  if (currentChapter === 1) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Photorealistic Greenery Meadow Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: "url('/images/greenery-bg.jpg')",
          filter: "brightness(0.68) contrast(1.05) saturate(1.1)"
        }}
      />

      {/* 2. Warm Sunbeam Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-[#162C20]/80 via-transparent to-[#E8C170]/15 pointer-events-none mix-blend-soft-light"
      />

      {/* 3. Deep Earthy Forest Vignette */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(18,34,24,0.85)_100%)] pointer-events-none"
      />

      {/* 4. Gentle Morning Sunbeam Drift */}
      <div
        className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#E8C170]/12 to-transparent blur-3xl pointer-events-none animate-sunlight"
      />
    </div>
  );
};
