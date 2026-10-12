import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ParticleBackgroundProps {
  intensity?: "low" | "medium" | "celebration";
  isDarkTheme?: boolean;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  intensity = "low",
  isDarkTheme = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const count = reducedMotion
      ? 16
      : intensity === "celebration"
      ? 65
      : intensity === "medium"
      ? 40
      : 24;

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      alpha: number;
      alphaTarget: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    // Water bioluminescent & pale light droplet colors
    const colors = [
      "rgba(85, 183, 232, ",   // Bright water blue #55B7E8
      "rgba(217, 242, 255, ",  // Soft ice blue #D9F2FF
      "rgba(244, 250, 255, ",  // Pale blue-white #F4FAFF
      "rgba(184, 216, 234, "   // Silver blue #B8D8EA
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.9,
        // Buoyancy: water particles gently float upwards
        speedY: (Math.random() * 0.35 + 0.1) * (reducedMotion ? 0.05 : 1),
        speedX: (Math.random() * 0.18 - 0.09) * (reducedMotion ? 0.05 : 1),
        alpha: Math.random() * 0.5 + 0.15,
        alphaTarget: Math.random() * 0.7 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.wobble += p.wobbleSpeed;
        p.x += p.speedX + Math.sin(p.wobble) * 0.25;

        // Wrap around smoothly
        if (p.y < -15) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x < -15) p.x = width + 15;
        if (p.x > width + 15) p.x = -15;

        // Soft twinkling alpha transition
        if (Math.abs(p.alpha - p.alphaTarget) < 0.02) {
          p.alphaTarget = Math.random() * 0.6 + 0.15;
        } else {
          p.alpha += (p.alphaTarget - p.alpha) * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.shadowBlur = p.radius * 4;
        ctx.shadowColor = "rgba(85, 183, 232, 0.45)";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [intensity, isDarkTheme, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      aria-hidden="true"
    />
  );
};
