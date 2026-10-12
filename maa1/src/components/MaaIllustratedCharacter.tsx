import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";

interface MaaIllustratedCharacterProps {
  imageSrc?: string;
  className?: string;
  onLoaded?: () => void;
}

export const MaaIllustratedCharacter: React.FC<MaaIllustratedCharacterProps> = ({
  imageSrc = "/images/maa-cartoon.png",
  className = "",
  onLoaded
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const characterRef = useRef<HTMLImageElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);

  // Parallax state
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Entrance animation with Anime.js
  useEffect(() => {
    if (!characterRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      anime.set(characterRef.current, { opacity: 1, translateY: 0 });
      return;
    }

    // Smooth upward entrance with a gentle settling motion
    anime({
      targets: characterRef.current,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 1100,
      easing: "easeOutCubic",
      complete: () => {
        // Very subtle idle breathing / settling motion
        anime({
          targets: characterRef.current,
          translateY: [-2.5, 2.5],
          duration: 3400,
          direction: "alternate",
          loop: true,
          easing: "easeInOutSine"
        });
      }
    });

    if (shadowRef.current) {
      anime({
        targets: shadowRef.current,
        opacity: [0, 0.45],
        scaleX: [0.8, 1],
        duration: 1100,
        easing: "easeOutCubic"
      });
    }
  }, [isLoaded]);

  // Subtle 2D cursor parallax tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      const normY = (e.clientY / innerHeight - 0.5) * 2; // -1 to 1

      // Restrained parallax: subtle 8px horizontal, 5px vertical
      setParallax({
        x: normX * 8,
        y: normY * 5
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* Soft Ambient Sunlight Glow behind character */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-80 rounded-full blur-3xl opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(232,193,112,0.4) 0%, rgba(45,90,63,0.2) 65%, transparent 100%)"
        }}
      />

      {/* 2D Illustrated Pixel-Art Character */}
      <div
        className="relative z-10 transition-transform duration-300 ease-out will-change-transform flex items-center justify-center"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`
        }}
      >
        <img
          ref={characterRef}
          src={imageSrc}
          alt="Illustrated portrait of Maa"
          className="w-auto h-[380px] sm:h-[450px] lg:h-[470px] max-w-full object-contain drop-shadow-[0_12px_24px_rgba(10,24,16,0.55)] opacity-0"
          style={{
            imageRendering: "crisp-edges"
          }}
          onLoad={() => {
            setIsLoaded(true);
            if (onLoaded) onLoaded();
          }}
        />
      </div>

      {/* Natural Ground Contact Shadow beneath Maa's feet */}
      <div
        ref={shadowRef}
        className="relative -mt-3 w-40 sm:w-48 h-4 rounded-full bg-black/45 blur-md pointer-events-none opacity-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * 0.4}px, 0, 0)`
        }}
      />
    </div>
  );
};
