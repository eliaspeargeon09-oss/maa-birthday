import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Maa3DPortraitProps {
  cutoutSrc?: string;
  depthSrc?: string;
  className?: string;
  onLoaded?: () => void;
}

export const Maa3DPortrait: React.FC<Maa3DPortraitProps> = ({
  cutoutSrc = "/images/maa-cartoon.png",
  depthSrc = "/images/maa-cartoon-depth.png",
  className = "",
  onLoaded
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  // Fallback CSS Parallax state for devices without WebGL
  const [fallbackMouse, setFallbackMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 560;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    container.appendChild(renderer.domElement);

    // Mouse Tracking State
    const mouse = {
      targetX: 0,
      targetY: 0,
      currentX: 0,
      currentY: 0
    };

    let animationFrameId: number;
    let mesh: THREE.Mesh | null = null;
    let planeGeo: THREE.PlaneGeometry | null = null;
    let shaderMat: THREE.ShaderMaterial | null = null;
    let portraitTexture: THREE.Texture | null = null;
    let depthTexture: THREE.Texture | null = null;

    const textureLoader = new THREE.TextureLoader();

    // Shaders for 2.5D optical parallax
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepth;
      uniform bool uHasDepth;
      uniform vec2 uMouse;
      uniform float uDepthScale;
      varying vec2 vUv;

      void main() {
        vec2 uv = vUv;
        if (uHasDepth) {
          float d = texture2D(uDepth, uv).r;
          // Subtle 2.5D optical parallax displacement
          vec2 displacement = uMouse * (d - 0.5) * uDepthScale;
          uv = clamp(uv + displacement, 0.0, 1.0);
        }
        vec4 col = texture2D(uTexture, uv);
        if (col.a < 0.01) discard;
        gl_FragColor = col;
      }
    `;

    // Load Cutout Texture first
    textureLoader.load(
      cutoutSrc,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        portraitTexture = tex;

        const imgWidth = tex.image.width || 263;
        const imgHeight = tex.image.height || 669;
        const aspect = imgWidth / imgHeight;

        // Plane dimensions tailored to preserve exact photographic ratio
        const planeHeight = 1.62;
        const planeWidth = planeHeight * aspect;

        planeGeo = new THREE.PlaneGeometry(planeWidth, planeHeight, 64, 64);

        // Blank 1x1 depth texture initially
        const placeholderDepth = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
        placeholderDepth.needsUpdate = true;

        shaderMat = new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: portraitTexture },
            uDepth: { value: placeholderDepth },
            uHasDepth: { value: false },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uDepthScale: { value: 0.035 }
          },
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false
        });

        mesh = new THREE.Mesh(planeGeo, shaderMat);
        scene.add(mesh);
        onLoaded?.();

        // Load Depth Map asynchronously
        textureLoader.load(
          depthSrc,
          (dTex) => {
            dTex.minFilter = THREE.LinearFilter;
            dTex.magFilter = THREE.LinearFilter;
            dTex.generateMipmaps = false;
            depthTexture = dTex;
            if (shaderMat) {
              shaderMat.uniforms.uDepth.value = depthTexture;
              shaderMat.uniforms.uHasDepth.value = true;
            }
          },
          undefined,
          () => {
            // Depth map not loaded; continues using subtle planar 2.5D mesh tilt
          }
        );
      },
      undefined,
      (err) => {
        console.error("Failed to load portrait texture", err);
        setHasError(true);
      }
    );

    // Pointer Event Handlers
    const handlePointerMove = (e: PointerEvent) => {
      if (prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      mouse.targetX = Math.max(-1, Math.min(1, x));
      mouse.targetY = Math.max(-1, Math.min(1, y));
    };

    const handlePointerLeave = () => {
      // Smoothly return to resting position
      mouse.targetX = 0;
      mouse.targetY = 0;
    };

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Animation Render Loop
    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      // Smooth interpolation (lerping)
      const lerpSpeed = 0.065;
      mouse.currentX += (mouse.targetX - mouse.currentX) * lerpSpeed;
      mouse.currentY += (mouse.targetY - mouse.currentY) * lerpSpeed;

      if (mesh && shaderMat) {
        // Natural subtle 3D camera/mesh response (within ~4.5 degrees)
        mesh.rotation.y = mouse.currentX * 0.08;
        mesh.rotation.x = -mouse.currentY * 0.048;

        shaderMat.uniforms.uMouse.value.set(mouse.currentX, mouse.currentY);
      }

      renderer.render(scene, camera);
    };

    render();

    // Clean up all resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      resizeObserver.disconnect();

      if (mesh) scene.remove(mesh);
      planeGeo?.dispose();
      shaderMat?.dispose();
      portraitTexture?.dispose();
      depthTexture?.dispose();
      renderer.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [cutoutSrc, depthSrc, onLoaded]);

  // Fallback pointer handler for CSS Parallax mode
  const handleFallbackMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
    const y = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
    setFallbackMouse({ x, y });
  };

  const handleFallbackLeave = () => {
    setFallbackMouse({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none ${className}`}
      style={{ touchAction: "pan-y" }}
    >
      {/* Three.js Canvas Container */}
      {webGLSupported && !hasError ? (
        <div
          ref={mountRef}
          className="w-full h-full min-h-[460px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center relative cursor-grab active:cursor-grabbing"
          style={{ willChange: "transform" }}
        />
      ) : (
        /* Graceful CSS 2.5D Parallax Fallback */
        <div
          onPointerMove={handleFallbackMove}
          onPointerLeave={handleFallbackLeave}
          className="w-full h-full min-h-[460px] sm:min-h-[540px] md:min-h-[580px] flex items-center justify-center p-4"
          style={{
            perspective: 800
          }}
        >
          <img
            src={cutoutSrc}
            alt="Maa"
            className="max-h-[520px] w-auto object-contain drop-shadow-2xl transition-transform duration-300 ease-out"
            style={{
              transform: `rotateY(${fallbackMouse.x}deg) rotateX(${fallbackMouse.y}deg)`,
              transformStyle: "preserve-3d"
            }}
          />
        </div>
      )}
    </div>
  );
};
