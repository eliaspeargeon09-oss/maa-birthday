import React, { useState } from "react";
import { WaterCanvas } from "./WaterCanvas";
import { ParticleBackground } from "./ParticleBackground";

interface LiquidBackgroundProps {
  currentChapter: number;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ currentChapter }) => {
  const [videoError, setVideoError] = useState(false);

  // Chapter specific video configuration (optional fallback to shader)
  const videoSrc =
    currentChapter === 1
      ? "/videos/ocean-intro.mp4"
      : currentChapter === 8
      ? "/videos/birthday-finale.mp4"
      : "/videos/water-reflections.mp4";

  // Water intensity
  const waterIntensity = currentChapter === 1 || currentChapter === 8 ? "luminous" : "medium";

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Primary Living Water Canvas (WebGL Shader + Cursor Ripples) */}
      <WaterCanvas intensity={waterIntensity} />

      {/* 2. Optional local video layer (muted, looped, gracefully hidden if missing) */}
      {!videoError && (
        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-screen pointer-events-none transition-opacity duration-1000"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* 3. Volumetric underwater light rays */}
      <div
        className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#55B7E8]/10 to-transparent pointer-events-none animate-water-shimmer"
        style={{ animationDuration: "14s" }}
      />

      {/* 4. Subtle top sunlight highlight */}
      <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-[#55B7E8]/15 via-[#1769AA]/08 to-transparent pointer-events-none" />

      {/* 5. Deep corner vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(7,26,51,0.68)_100%)] pointer-events-none" />

      {/* 6. Subtle celebratory starlight only on the finale Chapter 8 */}
      {currentChapter === 8 && (
        <ParticleBackground intensity="celebration" isDarkTheme={true} />
      )}
    </div>
  );
};
