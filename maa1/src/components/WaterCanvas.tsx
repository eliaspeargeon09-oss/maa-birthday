import React, { useEffect, useRef, useCallback } from "react";
import { musicManager } from "../utils/audioController";

interface Ripple {
  x: number; // 0..1 normalized (left to right)
  y: number; // 0..1 normalized (bottom to top for WebGL UV)
  startTime: number; // Simulation time in seconds
  intensity: number; // 0..1+
}

interface WaterCanvasProps {
  intensity?: "calm" | "medium" | "luminous";
  className?: string;
}

const MAX_RIPPLES = 24;

export const WaterCanvas: React.FC<WaterCanvasProps> = ({
  intensity = "medium",
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const lastPointerPos = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const isWebGlSupported = useRef<boolean>(true);
  const animFrameId = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());

  const getSimTime = useCallback(() => {
    return (performance.now() - startTimeRef.current) / 1000;
  }, []);

  // Thread-safe ripple dispatcher
  const addRipple = useCallback(
    (normX: number, normY: number, power: number = 0.8) => {
      const now = getSimTime();
      const ripples = ripplesRef.current;

      if (ripples.length >= MAX_RIPPLES) {
        ripples.shift();
      }

      ripples.push({
        x: Math.max(0, Math.min(1, normX)),
        y: Math.max(0, Math.min(1, normY)),
        startTime: now,
        intensity: Math.min(1.8, Math.max(0.2, power))
      });
    },
    [getSimTime]
  );

  // Global event listener for custom button/interaction ripples
  useEffect(() => {
    const handleGlobalRipple = (
      e: CustomEvent<{ x: number; y: number; power?: number }>
    ) => {
      if (e.detail) {
        const normX = e.detail.x / window.innerWidth;
        const normY = 1.0 - e.detail.y / window.innerHeight; // WebGL UV is bottom-up
        addRipple(normX, normY, e.detail.power || 1.2);
      }
    };

    window.addEventListener("trigger-water-ripple" as any, handleGlobalRipple as any);
    return () => {
      window.removeEventListener("trigger-water-ripple" as any, handleGlobalRipple as any);
    };
  }, [addRipple]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let positionBuffer: WebGLBuffer | null = null;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Try WebGL
    try {
      gl = (canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
        depth: false
      }) ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }

    if (!gl) {
      isWebGlSupported.current = false;
    }

    let isRunning = true;

    // -------------------------------------------------------------
    // WebGL Shader Setup
    // -------------------------------------------------------------
    if (gl) {
      const vsSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
          v_uv = (a_position + 1.0) * 0.5;
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;

      const fsSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform float u_intensity;
        uniform vec4 u_ripples[${MAX_RIPPLES}];
        uniform int u_ripple_count;

        // Procedural caustics function with dynamic flowing ripples
        float caustic(vec2 p, float t) {
          vec2 p1 = p * 4.2 + vec2(sin(t * 0.35 + p.y * 1.4), cos(t * 0.38 + p.x * 1.4)) * 0.3;
          float c1 = sin(p1.x + sin(p1.y + t * 0.65));
          float c2 = cos(p1.y + cos(p1.x - t * 0.55));
          float c3 = sin((p1.x + p1.y) * 1.3 + t * 0.8);
          return pow((c1 + c2 + c3 + 3.0) / 6.0, 3.8);
        }

        // Secondary deep water refraction wave
        float waveCaustic(vec2 p, float t) {
          vec2 p2 = p * 7.5 + vec2(t * 0.18, -t * 0.14);
          float w = sin(p2.x * 0.75 + cos(p2.y * 0.55 + t * 0.45));
          return pow(max(0.0, (w + 1.0) * 0.5), 2.8);
        }

        void main() {
          vec2 uv = v_uv;
          float aspect = u_resolution.x / u_resolution.y;
          vec2 aspectUv = vec2(uv.x * aspect, uv.y);

          // Liquid surface normal displacement from cursor ripples
          vec2 displacement = vec2(0.0);
          float totalHighlight = 0.0;

          for (int i = 0; i < ${MAX_RIPPLES}; i++) {
            if (i >= u_ripple_count) break;
            vec4 rip = u_ripples[i];
            vec2 ripPos = vec2(rip.x * aspect, rip.y);
            float age = u_time - rip.z;

            // Only simulate ripples within their natural lifetime (0.0s to 3.0s)
            if (age >= 0.0 && age < 3.0) {
              float d = distance(aspectUv, ripPos);
              float waveSpeed = 1.25;
              float waveRadius = age * waveSpeed;
              float waveDist = d - waveRadius;

              // Gaussian-damped wave packet
              if (abs(waveDist) < 0.28) {
                float envelope = exp(-waveDist * waveDist * 75.0) * exp(-age * 1.15) * exp(-d * 0.65);
                float wave = sin(waveDist * 36.0 - age * 7.0) * envelope * rip.w;
                
                vec2 dir = (d > 0.0001) ? normalize(aspectUv - ripPos) : vec2(0.0);
                displacement += dir * wave * 0.038;
                totalHighlight += max(0.0, wave) * envelope * 2.0;
              }
            }
          }

          vec2 distortedUv = uv + displacement;

          // Deep Blue Liquid Cinema Palette
          // #071A33 - Midnight Abyss
          // #123B70 - Primary Deep Ocean
          // #1769AA - Liquid Sapphire
          // #55B7E8 - Bright Water Azure
          // #D9F2FF - Soft Crystalline Ice
          vec3 deepMidnight = vec3(0.027, 0.102, 0.200);
          vec3 primaryOcean = vec3(0.071, 0.231, 0.439);
          vec3 sapphire = vec3(0.090, 0.412, 0.667);
          vec3 brightWater = vec3(0.333, 0.718, 0.910);
          vec3 crystallineWhite = vec3(0.851, 0.949, 1.000);

          // Ambient fluid wave gradient across viewport
          float gradT = clamp((distortedUv.x * 0.35 + distortedUv.y * 0.65), 0.0, 1.0);
          vec3 baseWater = mix(deepMidnight, primaryOcean, smoothstep(0.0, 0.55, gradT));
          baseWater = mix(baseWater, sapphire, smoothstep(0.5, 0.95, gradT));

          // Atmospheric light rays through water depth
          float lightRay = sin(distortedUv.x * 2.8 - distortedUv.y * 1.8 + u_time * 0.28) * 0.5 + 0.5;
          lightRay = pow(lightRay, 3.2) * 0.22;
          baseWater += brightWater * lightRay;

          // Liquid Caustic Light Patterns
          float caust1 = caustic(distortedUv, u_time);
          float caust2 = waveCaustic(distortedUv, u_time);
          float combinedCaustic = (caust1 * 0.65 + caust2 * 0.35) * u_intensity;

          // Realistic caustic refraction blend
          vec3 waterColor = baseWater + brightWater * (combinedCaustic * 0.42) + crystallineWhite * (combinedCaustic * 0.20);

          // Specular ripples highlight when touched
          waterColor += crystallineWhite * (totalHighlight * 0.70);
          waterColor += brightWater * (totalHighlight * 0.45);

          // Soft cinematic vignette
          float vignette = 1.0 - length((uv - 0.5) * 1.1) * 0.32;
          waterColor *= clamp(vignette, 0.72, 1.0);

          gl_FragColor = vec4(waterColor, 1.0);
        }
      `;

      const createShader = (type: number, source: string) => {
        if (!gl) return null;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.warn("Shader compile error:", gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);

          if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.warn("Program link error:", gl.getProgramInfoLog(program));
            program = null;
          }
        }
      }

      if (program) {
        positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
          -1, -1,
           1, -1,
          -1,  1,
          -1,  1,
           1, -1,
           1,  1
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
      } else {
        isWebGlSupported.current = false;
      }
    }

    // Resize handler
    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (
        canvas.width !== Math.floor(displayWidth * dpr) ||
        canvas.height !== Math.floor(displayHeight * dpr)
      ) {
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;

        if (gl) {
          gl.viewport(0, 0, canvas.width, canvas.height);
        }
      }
    };

    window.addEventListener("resize", resize);
    resize();

    // -------------------------------------------------------------
    // Natural Cursor & Touch Motion Interaction
    // -------------------------------------------------------------
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      // Throttle ripple emission slightly (~40ms) for silky performance
      if (now - lastPointerPos.current.time < 40) return;

      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else return;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const dx = clientX - lastPointerPos.current.x;
      const dy = clientY - lastPointerPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only emit when pointer moves noticeably
      if (dist > 8) {
        const normX = clientX / window.innerWidth;
        const normY = 1.0 - clientY / window.innerHeight;
        const speedFactor = Math.min(dist / 22, 1.3);
        addRipple(normX, normY, 0.4 + speedFactor * 0.35);

        lastPointerPos.current = { x: clientX, y: clientY, time: now };
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;
      if ("touches" in e) {
        if (e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else return;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const normX = clientX / window.innerWidth;
      const normY = 1.0 - clientY / window.innerHeight;
      addRipple(normX, normY, 1.15); // Pronounced, elegant ripple on tap/click
      musicManager.playWaterDrop(); // Subtle synthesized water chime
      lastPointerPos.current = { x: clientX, y: clientY, time: performance.now() };
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("mousedown", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchstart", handlePointerDown, { passive: true });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
      } else {
        isRunning = true;
        loop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // -------------------------------------------------------------
    // Main Render Loop
    // -------------------------------------------------------------
    const uIntensityVal = intensity === "calm" ? 0.45 : intensity === "luminous" ? 0.95 : 0.7;

    const loop = () => {
      if (!isRunning) return;

      const simTime = getSimTime();
      const animTime = prefersReducedMotion ? 0.5 : simTime;

      // Filter dead ripples (> 3.0s)
      ripplesRef.current = ripplesRef.current.filter((r) => simTime - r.startTime < 3.0);

      if (gl && program && positionBuffer) {
        gl.useProgram(program);

        const uRes = gl.getUniformLocation(program, "u_resolution");
        const uTime = gl.getUniformLocation(program, "u_time");
        const uInt = gl.getUniformLocation(program, "u_intensity");
        const uRipCount = gl.getUniformLocation(program, "u_ripple_count");

        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, animTime);
        gl.uniform1f(uInt, uIntensityVal);
        gl.uniform1i(uRipCount, ripplesRef.current.length);

        for (let i = 0; i < MAX_RIPPLES; i++) {
          const loc = gl.getUniformLocation(program, `u_ripples[${i}]`);
          if (i < ripplesRef.current.length) {
            const r = ripplesRef.current[i];
            gl.uniform4f(loc, r.x, r.y, r.startTime, r.intensity);
          } else {
            gl.uniform4f(loc, 0.0, 0.0, -100.0, 0.0);
          }
        }

        const aPos = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(aPos);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else {
        // High quality 2D Canvas Fallback (Soft caustics & organic gradients, NO stroke lines)
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;

          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, "#071A33");
          grad.addColorStop(0.45, "#123B70");
          grad.addColorStop(0.8, "#1769AA");
          grad.addColorStop(1, "#55B7E8");

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          // Flowing caustics
          ctx.save();
          ctx.globalAlpha = 0.14;
          ctx.fillStyle = "#D9F2FF";
          for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const phase = animTime * 0.7 + i * 1.8;
            for (let x = 0; x <= w; x += 40) {
              const y = h * (0.25 + i * 0.25) + Math.sin(x * 0.004 + phase) * 30;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();

          // Soft radial ripple glow (no harsh outline rings!)
          for (const rip of ripplesRef.current) {
            const age = simTime - rip.startTime;
            if (age >= 0 && age < 3.0) {
              const rx = rip.x * w;
              const ry = (1.0 - rip.y) * h;
              const radius = age * (w * 0.28);
              const alpha = Math.max(0, (1 - age / 3.0) * rip.intensity * 0.35);

              ctx.save();
              const rGrad = ctx.createRadialGradient(rx, ry, radius * 0.7, rx, ry, radius);
              rGrad.addColorStop(0, "rgba(85, 183, 232, 0)");
              rGrad.addColorStop(0.7, `rgba(85, 183, 232, ${alpha * 0.6})`);
              rGrad.addColorStop(1, `rgba(217, 242, 255, ${alpha})`);

              ctx.fillStyle = rGrad;
              ctx.beginPath();
              ctx.arc(rx, ry, radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        }
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      isRunning = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [addRipple, intensity, getSimTime]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    />
  );
};

export const triggerWaterRipple = (clientX: number, clientY: number, power: number = 1.2) => {
  const event = new CustomEvent("trigger-water-ripple", {
    detail: { x: clientX, y: clientY, power }
  });
  window.dispatchEvent(event);
};
