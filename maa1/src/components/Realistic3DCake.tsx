import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Realistic3DCakeProps {
  candlesLit: boolean;
  isBlowingOut: boolean;
  isCutting?: boolean;
  cutProgress?: number; // 0 to 1
  onExtinguished?: () => void;
  className?: string;
  allowRotation?: boolean;
}

export const Realistic3DCake: React.FC<Realistic3DCakeProps> = ({
  candlesLit,
  isBlowingOut,
  isCutting = false,
  cutProgress = 0,
  onExtinguished,
  className = "",
  allowRotation = true
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cakeStateRef = useRef({
    candlesLit,
    isBlowingOut,
    isCutting,
    cutProgress,
    onExtinguished,
    allowRotation
  });

  useEffect(() => {
    cakeStateRef.current = {
      candlesLit,
      isBlowingOut,
      isCutting,
      cutProgress,
      onExtinguished,
      allowRotation
    };
  }, [candlesLit, isBlowingOut, isCutting, cutProgress, onExtinguished, allowRotation]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const initialZ = width < 480 ? 6.8 : 5.8;
    camera.position.set(0, 1.8, initialZ);
    camera.lookAt(0, 0.65, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff5ee, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.0);
    keyLight.position.set(3.5, 5.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8d0f5, 0.8);
    fillLight.position.set(-3.5, 3.0, -2.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffe8cc, 0.9);
    rimLight.position.set(0, 3.5, -4.0);
    scene.add(rimLight);

    // Candle flame glow light
    const candlePointLight = new THREE.PointLight(0xffaa44, 2.2, 3.0, 1.5);
    candlePointLight.position.set(0, 1.9, 0);
    scene.add(candlePointLight);

    // 3. Materials Matching Reference B Cake
    // White Ceramic Pedestal Stand
    const standMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.22,
      metalness: 0.04
    });

    // Pastel Pink Cake Body Frosting
    const pinkCakeMat = new THREE.MeshStandardMaterial({
      color: 0xf6a5bf,
      roughness: 0.45,
      metalness: 0.02
    });

    // Darker Luscious Pink Drip Frosting Glaze
    const pinkDripMat = new THREE.MeshStandardMaterial({
      color: 0xee7f9e,
      roughness: 0.25,
      metalness: 0.06
    });

    // Vanilla/Berry Cake Sponge Interior for cut slice
    const cakeInteriorMat = new THREE.MeshStandardMaterial({
      color: 0xfcf3df,
      roughness: 0.65,
      metalness: 0.0
    });

    // Swirl Topper: Turquoise / Cyan
    const cyanTopperMat = new THREE.MeshStandardMaterial({
      color: 0x5cc5d8,
      roughness: 0.32,
      metalness: 0.04
    });

    // Swirl Topper: Purple / Violet
    const purpleTopperMat = new THREE.MeshStandardMaterial({
      color: 0x8a5fb5,
      roughness: 0.32,
      metalness: 0.04
    });

    // Swirl Topper: White Accent Cream
    const whiteCreamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.02
    });

    // Sprinkle Materials
    const sprinkleMats = [
      new THREE.MeshStandardMaterial({ color: 0x8e5db5, roughness: 0.3 }), // Purple
      new THREE.MeshStandardMaterial({ color: 0xf78536, roughness: 0.3 }), // Orange
      new THREE.MeshStandardMaterial({ color: 0xfdd351, roughness: 0.3 }), // Yellow
      new THREE.MeshStandardMaterial({ color: 0x51cbd8, roughness: 0.3 }), // Cyan
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }), // White
      new THREE.MeshStandardMaterial({ color: 0xeb5584, roughness: 0.3 })  // Deep pink
    ];

    // Candle Materials
    const candleWaxMat = new THREE.MeshStandardMaterial({
      color: 0xfff9e6,
      roughness: 0.28,
      metalness: 0.05
    });

    const candleGoldMat = new THREE.MeshStandardMaterial({
      color: 0xe8c170,
      roughness: 0.3,
      metalness: 0.7
    });

    const wickMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9
    });

    // 4. Cake Construction Hierarchy
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- A. Pedestal Stand ---
    const standGroup = new THREE.Group();
    mainGroup.add(standGroup);

    // Stand Base Plate
    const baseGeo = new THREE.CylinderGeometry(1.2, 1.3, 0.1, 48);
    const standBase = new THREE.Mesh(baseGeo, standMat);
    standBase.position.y = -0.55;
    standBase.receiveShadow = true;
    standGroup.add(standBase);

    // Shadow Disc
    const shadowGeo = new THREE.CircleGeometry(1.5, 48);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x050e07,
      transparent: true,
      opacity: 0.35
    });
    const shadowDisc = new THREE.Mesh(shadowGeo, shadowMat);
    shadowDisc.position.y = -0.605;
    standGroup.add(shadowDisc);

    // Stand Stem
    const stemGeo = new THREE.CylinderGeometry(0.32, 0.48, 0.55, 32);
    const standStem = new THREE.Mesh(stemGeo, standMat);
    standStem.position.y = -0.28;
    standStem.castShadow = true;
    standGroup.add(standStem);

    // Stand Platter Top
    const platterGeo = new THREE.CylinderGeometry(1.82, 1.76, 0.12, 64);
    const standPlatter = new THREE.Mesh(platterGeo, standMat);
    standPlatter.position.y = -0.02;
    standPlatter.receiveShadow = true;
    standPlatter.castShadow = true;
    standGroup.add(standPlatter);

    // --- B. Cake Body & Cut Slice ---
    const cakeHeight = 1.35;
    const cakeRadius = 1.32;
    const cakeCenterY = cakeHeight / 2 + 0.04;

    // Main Cake Body (3/4 cylinder when sliced, or full)
    const cakeGroup = new THREE.Group();
    mainGroup.add(cakeGroup);

    const fullCakeGeo = new THREE.CylinderGeometry(cakeRadius, cakeRadius, cakeHeight, 64);
    const fullCake = new THREE.Mesh(fullCakeGeo, pinkCakeMat);
    fullCake.position.y = cakeCenterY;
    fullCake.castShadow = true;
    fullCake.receiveShadow = true;
    cakeGroup.add(fullCake);

    // Cut Slice Group (for slice separation during Step 4)
    const sliceGroup = new THREE.Group();
    sliceGroup.position.set(0, cakeCenterY, 0);
    mainGroup.add(sliceGroup);

    // Slice Wedge Mesh (36-degree wedge)
    const sliceAngle = Math.PI / 5; // 36 degrees
    const sliceGeo = new THREE.CylinderGeometry(
      cakeRadius * 1.005,
      cakeRadius * 1.005,
      cakeHeight * 0.995,
      24,
      1,
      false,
      -sliceAngle / 2,
      sliceAngle
    );
    const sliceMesh = new THREE.Mesh(sliceGeo, pinkCakeMat);
    sliceMesh.castShadow = true;
    sliceGroup.add(sliceMesh);

    // Interior cut face frosting layers
    const sliceInteriorGeo = new THREE.PlaneGeometry(cakeRadius, cakeHeight * 0.99);
    const interiorMesh1 = new THREE.Mesh(sliceInteriorGeo, cakeInteriorMat);
    interiorMesh1.rotation.y = -sliceAngle / 2;
    interiorMesh1.position.set((Math.cos(-sliceAngle / 2) * cakeRadius) / 2, 0, (Math.sin(-sliceAngle / 2) * cakeRadius) / 2);
    sliceGroup.add(interiorMesh1);

    sliceGroup.visible = false; // Revealed only during cutting

    // --- C. Drip Frosting Top & Sides ---
    const topDripCapGeo = new THREE.CylinderGeometry(cakeRadius * 1.01, cakeRadius * 1.01, 0.08, 64);
    const topDripCap = new THREE.Mesh(topDripCapGeo, pinkDripMat);
    topDripCap.position.y = cakeHeight + 0.04;
    topDripCap.castShadow = true;
    cakeGroup.add(topDripCap);

    // 16 Organic Drips cascading down the sides
    const dripCount = 18;
    const dripLengths = [
      0.65, 0.42, 0.88, 0.5, 0.72, 0.35, 0.92, 0.48,
      0.78, 0.55, 0.85, 0.38, 0.68, 0.95, 0.45, 0.6,
      0.75, 0.52
    ];

    for (let i = 0; i < dripCount; i++) {
      const angle = (i / dripCount) * Math.PI * 2;
      const len = dripLengths[i % dripLengths.length];
      const dripY = cakeHeight + 0.04 - len / 2;

      // Drip stream cylinder
      const dripGeo = new THREE.CylinderGeometry(0.055, 0.07, len, 12);
      const dripMesh = new THREE.Mesh(dripGeo, pinkDripMat);
      dripMesh.position.set(
        Math.cos(angle) * (cakeRadius * 1.012),
        dripY,
        Math.sin(angle) * (cakeRadius * 1.012)
      );
      dripMesh.castShadow = true;
      cakeGroup.add(dripMesh);

      // Bulbous droplet at bottom of drip
      const dropletGeo = new THREE.SphereGeometry(0.075, 12, 12);
      const droplet = new THREE.Mesh(dropletGeo, pinkDripMat);
      droplet.position.set(
        Math.cos(angle) * (cakeRadius * 1.015),
        cakeHeight + 0.04 - len,
        Math.sin(angle) * (cakeRadius * 1.015)
      );
      droplet.castShadow = true;
      cakeGroup.add(droplet);
    }

    // --- D. Colorful Sprinkles Matching Reference B ---
    // 1. Pearls around base circumference
    const basePearlCount = 26;
    for (let i = 0; i < basePearlCount; i++) {
      const angle = (i / basePearlCount) * Math.PI * 2;
      const mat = sprinkleMats[i % sprinkleMats.length];
      const pearlGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const pearl = new THREE.Mesh(pearlGeo, mat);
      pearl.position.set(
        Math.cos(angle) * (cakeRadius * 1.04),
        0.08,
        Math.sin(angle) * (cakeRadius * 1.04)
      );
      pearl.castShadow = true;
      cakeGroup.add(pearl);
    }

    // 2. Pearls scattered across drip sides
    for (let i = 0; i < 22; i++) {
      const angle = (i * 1.37) % (Math.PI * 2);
      const y = 0.25 + (i * 0.045) % (cakeHeight * 0.7);
      const mat = sprinkleMats[(i * 2 + 1) % sprinkleMats.length];
      const pearlGeo = new THREE.SphereGeometry(0.05, 10, 10);
      const pearl = new THREE.Mesh(pearlGeo, mat);
      pearl.position.set(
        Math.cos(angle) * (cakeRadius * 1.02),
        y,
        Math.sin(angle) * (cakeRadius * 1.02)
      );
      cakeGroup.add(pearl);
    }

    // 3. Pearls on top surface
    for (let i = 0; i < 14; i++) {
      const r = 0.35 + (i * 0.065) % 0.85;
      const angle = i * 1.6;
      const mat = sprinkleMats[(i + 3) % sprinkleMats.length];
      const pearlGeo = new THREE.SphereGeometry(0.052, 10, 10);
      const pearl = new THREE.Mesh(pearlGeo, mat);
      pearl.position.set(
        Math.cos(angle) * r,
        cakeHeight + 0.1,
        Math.sin(angle) * r
      );
      cakeGroup.add(pearl);
    }

    // --- E. The Two Swirl Meringue Toppers (Reference B Signature) ---
    // Helper function to build a spiral swirl topper
    const createSwirlTopper = (colorMat: THREE.Material, height: number, radius: number) => {
      const topperGroup = new THREE.Group();
      const layers = 8;
      for (let i = 0; i < layers; i++) {
        const t = i / layers;
        const curRadius = radius * (1 - t * 0.82);
        const curY = t * height;
        const twistAngle = t * Math.PI * 2.8;

        // Color tier
        const discGeo = new THREE.CylinderGeometry(curRadius * 0.88, curRadius, height / layers, 20);
        const mat = i % 2 === 0 ? colorMat : whiteCreamMat;
        const disc = new THREE.Mesh(discGeo, mat);
        disc.position.y = curY;
        disc.rotation.y = twistAngle;
        disc.castShadow = true;
        topperGroup.add(disc);
      }
      // Pointy swirl peak tip
      const tipGeo = new THREE.ConeGeometry(radius * 0.22, 0.25, 16);
      const tip = new THREE.Mesh(tipGeo, colorMat);
      tip.position.y = height + 0.1;
      tip.rotation.z = -0.15;
      topperGroup.add(tip);

      return topperGroup;
    };

    // 1. Left Topper: Cyan / Turquoise Swirl Topper
    const leftTopper = createSwirlTopper(cyanTopperMat, 0.72, 0.42);
    leftTopper.position.set(-0.35, cakeHeight + 0.08, 0.05);
    leftTopper.rotation.y = 0.3;
    leftTopper.rotation.z = 0.08;
    cakeGroup.add(leftTopper);

    // 2. Right Topper: Purple / Violet Swirl Topper (taller)
    const rightTopper = createSwirlTopper(purpleTopperMat, 0.9, 0.48);
    rightTopper.position.set(0.32, cakeHeight + 0.08, -0.05);
    rightTopper.rotation.y = -0.4;
    rightTopper.rotation.z = -0.06;
    cakeGroup.add(rightTopper);

    // --- F. Birthday Candles ---
    const candleCount = 3;
    const candlePositions = [
      { x: -0.12, z: 0.48 },
      { x: 0.18, z: 0.46 },
      { x: 0.02, z: -0.42 }
    ];

    const candleFlames: THREE.Mesh[] = [];
    const candleLights: THREE.PointLight[] = [];

    candlePositions.forEach((pos, idx) => {
      // Candle column
      const candleH = 0.55;
      const candleGeo = new THREE.CylinderGeometry(0.045, 0.045, candleH, 16);
      const candle = new THREE.Mesh(candleGeo, candleWaxMat);
      candle.position.set(pos.x, cakeHeight + 0.08 + candleH / 2, pos.z);
      candle.castShadow = true;
      cakeGroup.add(candle);

      // Gold spiral stripe on candle
      const stripeGeo = new THREE.TorusGeometry(0.046, 0.008, 8, 16);
      stripeGeo.rotateX(Math.PI / 2);
      const stripe = new THREE.Mesh(stripeGeo, candleGoldMat);
      stripe.position.set(pos.x, cakeHeight + 0.08 + candleH * 0.65, pos.z);
      cakeGroup.add(stripe);

      // Wick
      const wickGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.07, 8);
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(pos.x, cakeHeight + 0.08 + candleH + 0.035, pos.z);
      cakeGroup.add(wick);

      // Flame Mesh
      const flameGeo = new THREE.ConeGeometry(0.042, 0.16, 12);
      flameGeo.translate(0, 0.08, 0);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xffe070,
        transparent: true,
        opacity: 0.95
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(pos.x, cakeHeight + 0.08 + candleH + 0.06, pos.z);
      cakeGroup.add(flame);
      candleFlames.push(flame);

      // Point light per candle
      const light = new THREE.PointLight(0xff9922, 0.9, 1.8, 1.2);
      light.position.set(pos.x, cakeHeight + 0.08 + candleH + 0.12, pos.z);
      cakeGroup.add(light);
      candleLights.push(light);
    });

    // --- G. Realistic 3D Cake Knife (Step 4 Cutting Animation) ---
    const knifeGroup = new THREE.Group();
    scene.add(knifeGroup);

    // Knife blade
    const bladeGeo = new THREE.BoxGeometry(0.02, 0.28, 1.8);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xe6e9ec,
      metalness: 0.95,
      roughness: 0.15
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0, 0.9);
    blade.castShadow = true;
    knifeGroup.add(blade);

    // Knife handle
    const handleGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.8, 16);
    handleGeo.rotateX(Math.PI / 2);
    const handleMat = new THREE.MeshStandardMaterial({
      color: 0x4a2a1b,
      roughness: 0.45,
      metalness: 0.1
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0, -0.4);
    handle.castShadow = true;
    knifeGroup.add(handle);

    // Bolster (brass ring)
    const bolsterGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.06, 16);
    bolsterGeo.rotateX(Math.PI / 2);
    const bolsterMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.8,
      roughness: 0.3
    });
    const bolster = new THREE.Mesh(bolsterGeo, bolsterMat);
    bolster.position.set(0, 0, 0.01);
    knifeGroup.add(bolster);

    // Initial position of knife: offscreen
    knifeGroup.position.set(4.0, 3.2, 1.5);
    knifeGroup.visible = false;

    // --- H. Drag Interaction for 360-degree rotation ---
    let isDragging = false;
    let prevMouseX = 0;
    let userRotationY = 0;
    let autoRotate = true;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      autoRotate = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      userRotationY += deltaX * 0.01;
      mainGroup.rotation.y = userRotationY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch events for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        autoRotate = false;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      prevMouseX = e.touches[0].clientX;
      userRotationY += deltaX * 0.012;
      mainGroup.rotation.y = userRotationY;
    };
    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 5. Main Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();
    let extinguishTime = 0;
    let hasNotifiedExtinguished = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;
      const state = cakeStateRef.current;

      // 360-degree rotation logic
      if (state.allowRotation && autoRotate && !state.isCutting) {
        userRotationY += 0.005;
        mainGroup.rotation.y = userRotationY;
      }

      // Candle Flame Animations
      if (state.candlesLit && !state.isBlowingOut) {
        // Active dancing flames
        candleFlames.forEach((flame, idx) => {
          flame.visible = true;
          const flicker = Math.sin(time * 12 + idx * 2.1) * 0.12 + Math.cos(time * 18 + idx) * 0.08;
          flame.scale.set(1 + flicker * 0.6, 1 + flicker, 1 + flicker * 0.6);
          flame.rotation.z = Math.sin(time * 6 + idx) * 0.1;
        });
        candleLights.forEach((light, idx) => {
          light.intensity = 0.85 + Math.sin(time * 15 + idx) * 0.25;
        });
        candlePointLight.intensity = 2.2 + Math.sin(time * 10) * 0.4;
      } else if (state.isBlowingOut) {
        // Extinguishing sequence: gentle breeze -> flicker -> shrink -> gone
        extinguishTime += 0.035;
        const fade = Math.max(0, 1 - extinguishTime);

        candleFlames.forEach((flame, idx) => {
          flame.scale.set(fade * 0.8, fade * 0.6, fade * 0.8);
          flame.rotation.z = 0.35 * (1 - fade); // breeze tilt
          if (fade <= 0.05) flame.visible = false;
        });

        candleLights.forEach((light) => {
          light.intensity = fade * 0.8;
        });
        candlePointLight.intensity = fade * 2.0;

        if (fade <= 0.02 && !hasNotifiedExtinguished) {
          hasNotifiedExtinguished = true;
          if (state.onExtinguished) state.onExtinguished();
        }
      } else {
        // Extinguished
        candleFlames.forEach((flame) => (flame.visible = false));
        candleLights.forEach((light) => (light.intensity = 0));
        candlePointLight.intensity = 0.15;
      }

      // Knife Cutting Animation Logic
      if (state.isCutting) {
        knifeGroup.visible = true;
        const progress = Math.min(Math.max(state.cutProgress || 0, 0), 1);

        // Sequence:
        // 0.0 - 0.3: Knife enters smoothly from the right, positions above cake
        // 0.3 - 0.7: Knife rotates into angle and slices vertically through cake
        // 0.7 - 1.0: Slice separates forward, knife lifts up
        if (progress < 0.3) {
          const t = progress / 0.3;
          knifeGroup.position.set(
            THREE.MathUtils.lerp(3.2, 0.4, t),
            THREE.MathUtils.lerp(3.0, 2.2, t),
            THREE.MathUtils.lerp(1.2, 0.2, t)
          );
          knifeGroup.rotation.set(0, Math.PI / 4, THREE.MathUtils.lerp(0.5, 0.1, t));
        } else if (progress < 0.7) {
          const t = (progress - 0.3) / 0.4;
          knifeGroup.position.set(0.4, THREE.MathUtils.lerp(2.2, 0.75, t), 0.2);
          knifeGroup.rotation.set(0, Math.PI / 4, 0.05);

          // Reveal slice wedge
          sliceGroup.visible = true;
        } else {
          const t = (progress - 0.7) / 0.3;
          // Knife lifts slightly
          knifeGroup.position.set(0.4, THREE.MathUtils.lerp(0.75, 1.8, t), 0.2);

          // Slice separates outwards
          sliceGroup.visible = true;
          const separateDist = THREE.MathUtils.lerp(0, 0.32, t);
          sliceGroup.position.set(
            Math.cos(0) * separateDist,
            cakeCenterY,
            Math.sin(0) * separateDist
          );
        }
      } else {
        knifeGroup.visible = false;
        sliceGroup.visible = false;
        sliceGroup.position.set(0, cakeCenterY, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative flex items-center justify-center cursor-grab active:cursor-grabbing ${className}`}
      title="Click and drag to rotate the birthday cake in 360 degrees"
    />
  );
};
