import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface ConfettiCanvasProps {
  triggerKey?: number; // Increment to re-fire
  active?: boolean;
  count?: number;
}

interface Piece {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  wobble: number;
  wobbleSpeed: number;
  shape: "rect" | "circle" | "ribbon";
  opacity: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  triggerKey = 0,
  active = false,
  count = 90
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    if (triggerKey === 0 && !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Oceanic cinematic confetti colors
    const colors = [
      "#55B7E8", // Bright water blue
      "#D9F2FF", // Soft ice blue
      "#F4FAFF", // Pale blue-white
      "#1769AA", // Liquid sapphire
      "#B8D8EA", // Silver-blue
      "#FFFFFF"  // Starlight crystalline white
    ];

    const pieces: Piece[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: Math.random() * width,
        y: Math.random() * -height * 0.7,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 5,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.08 + 0.03,
        shape: Math.random() > 0.6 ? "rect" : Math.random() > 0.3 ? "circle" : "ribbon",
        opacity: 1
      });
    }

    let animationId: number;
    let frameCount = 0;
    const maxFrames = 480;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      let activePieces = 0;

      pieces.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.wobble) * 1.5 + p.speedX;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotationSpeed;

        if (p.y > height - 60) {
          p.opacity -= 0.02;
        }

        if (p.opacity > 0 && p.y < height + 40) {
          activePieces++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;

          if (p.shape === "rect") {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Ribbon shape
            ctx.beginPath();
            ctx.moveTo(-p.size / 2, -p.size);
            ctx.lineTo(p.size / 2, p.size);
            ctx.lineWidth = 3;
            ctx.strokeStyle = p.color;
            ctx.stroke();
          }

          ctx.restore();
        }
      });

      if (activePieces > 0 && frameCount < maxFrames) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [triggerKey, active, reducedMotion]);

  if (reducedMotion || (!active && triggerKey === 0)) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-30 h-full w-full"
      aria-hidden="true"
    />
  );
};
