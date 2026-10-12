import anime from "animejs";

/**
 * Checks if user prefers reduced motion
 */
export const isReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Animate a text element or node with a smooth cinematic fade and slide up
 */
export const animateTextReveal = (
  target: HTMLElement | string | null,
  options: { delay?: number; duration?: number; translateY?: number } = {}
): anime.AnimeInstance | null => {
  if (!target) return null;
  if (isReducedMotion()) {
    if (typeof target !== "string") {
      target.style.opacity = "1";
      target.style.transform = "none";
    }
    return null;
  }

  const { delay = 0, duration = 1200, translateY = 24 } = options;

  return anime({
    targets: target,
    opacity: [0, 1],
    translateY: [translateY, 0],
    easing: "easeOutCubic",
    duration,
    delay
  });
};

/**
 * Stagger child elements (e.g. paragraphs, gallery items, reasons cards)
 */
export const animateStaggerChildren = (
  targets: HTMLElement[] | NodeListOf<HTMLElement> | string,
  options: { delay?: number; stagger?: number; duration?: number } = {}
): anime.AnimeInstance | null => {
  if (!targets) return null;
  if (isReducedMotion()) {
    if (typeof targets !== "string" && "forEach" in targets) {
      (targets as any).forEach((el: HTMLElement) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
    }
    return null;
  }

  const { delay = 100, stagger = 140, duration = 900 } = options;

  return anime({
    targets,
    opacity: [0, 1],
    translateY: [20, 0],
    scale: [0.97, 1],
    delay: anime.stagger(stagger, { start: delay }),
    duration,
    easing: "easeOutQuart"
  });
};

/**
 * Liquid Wave chapter transition animation
 */
export const animateChapterTransition = (
  overlay: HTMLElement | null,
  onHalfway: () => void,
  onComplete: () => void
): anime.AnimeTimelineInstance | null => {
  if (!overlay) {
    onHalfway();
    onComplete();
    return null;
  }

  if (isReducedMotion()) {
    onHalfway();
    onComplete();
    return null;
  }

  const tl = anime.timeline({
    easing: "easeInOutCubic",
    complete: () => onComplete()
  });

  tl.add({
    targets: overlay,
    opacity: [0, 1],
    scale: [0.95, 1],
    duration: 380,
    begin: () => {
      overlay.style.pointerEvents = "all";
    },
    complete: () => {
      onHalfway();
    }
  }).add({
    targets: overlay,
    opacity: [1, 0],
    duration: 450,
    delay: 80,
    complete: () => {
      overlay.style.pointerEvents = "none";
    }
  });

  return tl;
};

/**
 * Envelope opening cinematic sequence
 */
export const animateLetterOpening = (
  envelopeElement: HTMLElement | null,
  letterElement: HTMLElement | null,
  onComplete?: () => void
): anime.AnimeTimelineInstance | null => {
  if (!envelopeElement || !letterElement) {
    if (onComplete) onComplete();
    return null;
  }

  if (isReducedMotion()) {
    envelopeElement.style.display = "none";
    letterElement.style.opacity = "1";
    if (onComplete) onComplete();
    return null;
  }

  const tl = anime.timeline({
    easing: "easeOutCubic",
    complete: () => {
      if (onComplete) onComplete();
    }
  });

  tl.add({
    targets: envelopeElement,
    scale: [1, 0.95],
    opacity: [1, 0.4],
    duration: 400
  })
    .add({
      targets: letterElement,
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.94, 1],
      duration: 800,
      offset: "-=200"
    });

  return tl;
};

/**
 * Countdown number entrance & exit
 */
export const animateCountdownNumber = (
  element: HTMLElement | null,
  onComplete?: () => void
): anime.AnimeInstance | null => {
  if (!element) return null;

  if (isReducedMotion()) {
    element.style.opacity = "1";
    element.style.transform = "none";
    if (onComplete) onComplete();
    return null;
  }

  return anime({
    targets: element,
    scale: [0.4, 1.15, 1],
    opacity: [0, 1],
    duration: 850,
    easing: "easeOutElastic(1, .6)",
    complete: () => {
      if (onComplete) onComplete();
    }
  });
};

/**
 * Extinguish candle flames with soft smoke dissipation
 */
export const animateCandleExtinguish = (
  flames: (SVGElement | HTMLElement)[],
  smokes: (SVGElement | HTMLElement)[],
  onComplete?: () => void
): anime.AnimeTimelineInstance | null => {
  const tl = anime.timeline({
    complete: () => {
      if (onComplete) onComplete();
    }
  });

  tl.add({
    targets: flames,
    scaleY: [1, 0.2],
    opacity: [1, 0],
    duration: 350,
    easing: "easeOutQuad"
  }).add({
    targets: smokes,
    opacity: [0, 0.8, 0],
    translateY: [0, -25],
    duration: 900,
    easing: "easeOutCubic",
    offset: "-=100"
  });

  return tl;
};

/**
 * Final grand reveal sequence choreography
 */
export const animateFinalCelebration = (
  tagElement: HTMLElement | null,
  greetingElement: HTMLElement | null,
  nameElement: HTMLElement | null,
  portraitElement: HTMLElement | null,
  messageElement: HTMLElement | null,
  onComplete?: () => void
): anime.AnimeTimelineInstance | null => {
  const tl = anime.timeline({
    easing: "easeOutCubic",
    complete: () => {
      if (onComplete) onComplete();
    }
  });

  if (isReducedMotion()) {
    [tagElement, greetingElement, nameElement, portraitElement, messageElement].forEach((el) => {
      if (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
    if (onComplete) onComplete();
    return null;
  }

  // 1. Tag "AND NOW..."
  if (tagElement) {
    tl.add({
      targets: tagElement,
      opacity: [0, 1],
      translateY: [15, 0],
      duration: 800
    });
  }

  // 2. Main greeting "HAPPY BIRTHDAY"
  if (greetingElement) {
    tl.add({
      targets: greetingElement,
      opacity: [0, 1],
      translateY: [25, 0],
      duration: 1000,
      offset: "-=300"
    });
  }

  // 3. Name "MAA ❤️"
  if (nameElement) {
    tl.add({
      targets: nameElement,
      scale: [0.85, 1],
      opacity: [0, 1],
      duration: 1100,
      easing: "easeOutBack",
      offset: "-=400"
    });
  }

  // 4. Portrait frame
  if (portraitElement) {
    tl.add({
      targets: portraitElement,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.96, 1],
      duration: 1000,
      offset: "-=500"
    });
  }

  // 5. Personal emotional message
  if (messageElement) {
    tl.add({
      targets: messageElement,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 1000,
      offset: "-=400"
    });
  }

  return tl;
};
