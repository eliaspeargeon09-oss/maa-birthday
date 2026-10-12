import React, { useEffect, useRef } from "react";
import anime from "animejs";

interface LiquidTransitionProps {
  isTransitioning: boolean;
  onTransitionMiddle?: () => void;
  onTransitionEnd?: () => void;
}

export const LiquidTransition: React.FC<LiquidTransitionProps> = ({
  isTransitioning
}) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isTransitioning || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const ring = ringRef.current;

    const tl = anime.timeline({
      easing: "easeInOutQuart"
    });

    tl.add({
      targets: overlay,
      opacity: [0, 0.95],
      duration: 360
    })
      .add(
        {
          targets: ring,
          scale: [0.1, 2.5],
          opacity: [0.8, 0],
          duration: 650,
          easing: "easeOutCubic"
        },
        "-=300"
      )
      .add({
        targets: overlay,
        opacity: [0.95, 0],
        duration: 450,
        easing: "easeInCubic"
      });

    return () => {
      tl.pause();
    };
  }, [isTransitioning]);

  if (!isTransitioning) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-gradient-to-b from-[#071A33]/90 via-[#123B70]/90 to-[#071A33]/90 backdrop-blur-md opacity-0"
      aria-hidden="true"
    >
      {/* Expanding water wave ring */}
      <div
        ref={ringRef}
        className="w-96 h-96 rounded-full border-4 border-[#55B7E8]/60 shadow-[0_0_80px_rgba(85,183,232,0.8)]"
      />
    </div>
  );
};
