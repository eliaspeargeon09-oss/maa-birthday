import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { MaaIllustratedCharacter } from "../components/MaaIllustratedCharacter";
import { Sparkles, Heart, Smile, Sun, Shield, Award, Church, ArrowRight } from "lucide-react";
import { siteContent } from "../content";

interface ChapterTwoProps {
  onContinue: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  sun: Sun,
  shield: Shield,
  smile: Smile,
  award: Award,
  church: Church
};

export const ChapterTwo: React.FC<ChapterTwoProps> = ({ onContinue }) => {
  const { chapterTwo } = siteContent;
  const messages = chapterTwo.messages.map((m) => ({
    ...m,
    icon: ICON_MAP[m.iconType] || Heart
  }));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animStartedRef = useRef<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    // Prevent duplicate triggers and React StrictMode double invocations
    if (animStartedRef.current || !containerRef.current) return;
    animStartedRef.current = true;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const headline = containerRef.current.querySelectorAll(".ch2-headline");
    const portrait = containerRef.current.querySelectorAll(".ch2-portrait");
    const desktopCards = containerRef.current.querySelectorAll(".desktop-view .ch2-card");
    const mobileCards = containerRef.current.querySelectorAll(".mobile-view .ch2-card");
    const lines = containerRef.current.querySelectorAll(".ch2-line");
    const dots = containerRef.current.querySelectorAll(".ch2-dot");
    const continueBtn = containerRef.current.querySelectorAll(".ch2-continue");

    if (prefersReducedMotion) {
      setHasAnimated(true);
      return;
    }

    // Set clean initial hidden state
    anime.set([headline, portrait, desktopCards, mobileCards, dots, continueBtn], { opacity: 0 });
    anime.set(portrait, { scale: 0.92 });
    anime.set(headline, { translateY: 16 });
    anime.set([desktopCards, mobileCards], { translateY: 14 });
    anime.set(continueBtn, { translateY: 12 });
    if (lines.length > 0) {
      anime.set(lines, { opacity: 0, strokeDashoffset: anime.setDashoffset });
    }

    // Determine active cards based on current screen size so we animate exactly 6 cards (not 12 in two waves)
    const isDesktop = window.innerWidth >= 1024;
    const activeCards = isDesktop ? desktopCards : mobileCards;

    // Anime.js v3 coordinated timeline
    // SEQUENCE REQUIREMENT: FIRST MAA ARRIVES, THEN AFTERWARDS THE QUALITIES ARRIVE
    const tl = anime.timeline({
      easing: "easeOutCubic",
      complete: () => {
        setHasAnimated(true);
      }
    });

    // 1. FIRST: Maa's portrait arrives and settles into place
    tl.add({
      targets: portrait,
      opacity: [0, 1],
      scale: [0.92, 1],
      duration: 850,
      easing: "easeOutCubic"
    });

    // 2. AFTER Maa settles: The headline appears above her
    tl.add(
      {
        targets: headline,
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 500
      },
      "+=120"
    );

    // 3. THEN: The qualities (the 6 message cards) reveal around her in a single clean wave
    tl.add(
      {
        targets: activeCards,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 500,
        delay: anime.stagger(90)
      },
      "+=80"
    );

    // 4. Delicate golden connector lines draw from each card toward Maa
    if (lines.length > 0 && isDesktop) {
      tl.add(
        {
          targets: lines,
          strokeDashoffset: [anime.setDashoffset, 0],
          opacity: [0, 0.85],
          duration: 600,
          delay: anime.stagger(50),
          easing: "easeInOutQuad"
        },
        "-=350"
      );
    }

    // 5. Glowing anchor connector dots appear
    if (dots.length > 0 && isDesktop) {
      tl.add(
        {
          targets: dots,
          opacity: [0, 1],
          scale: [0, 1],
          duration: 350,
          delay: anime.stagger(30)
        },
        "-=300"
      );
    }

    // 6. Finally: The Continue button appears
    tl.add(
      {
        targets: continueBtn,
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 450
      },
      "+=100"
    );

    return () => {
      tl.pause();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen py-6 sm:py-8 px-4 sm:px-6 flex flex-col items-center justify-between text-[#FFFDF8] z-10 select-none overflow-hidden"
    >
      {/* Warm Ambient Sunlight Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none rounded-full blur-[140px] opacity-25"
        style={{
          background: "radial-gradient(circle, #E6D2A8 0%, #2D5A3F 70%, transparent 100%)"
        }}
      />

      {/* Headline Header */}
      <div className="ch2-headline text-center max-w-2xl mx-auto mb-2 sm:mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102318]/80 border border-[#D4AF37]/35 text-[#E6D2A8] text-xs font-sans uppercase tracking-[0.22em] mb-1.5 backdrop-blur-md shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{chapterTwo.badge}</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-[#FFFDF8] tracking-wide mb-1 drop-shadow-md">
          {chapterTwo.title}
        </h2>
        <p className="font-serif italic text-base sm:text-lg text-[#F5F1E7]/85 max-w-xl mx-auto">
          {chapterTwo.subtitle}
        </p>
      </div>

      {/* Main Interactive Composition Stage */}
      <div className="relative w-full max-w-6xl mx-auto flex-1 flex flex-col items-center justify-center my-1">
        {/* DESKTOP VIEW: Center Portrait + 6 Flanking Messages + SVG Connectors */}
        <div className="desktop-view hidden lg:block relative w-full h-[510px]">
          {/* SVG Connector Lines Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 510"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6" />
              </linearGradient>
            </defs>

            {messages.map((msg) => (
              <g key={`svg-group-${msg.id}`}>
                <line
                  x1={msg.line.x1}
                  y1={msg.line.y1}
                  x2={msg.line.x2}
                  y2={msg.line.y2}
                  stroke="url(#goldGlow)"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  className="ch2-line"
                />
                {/* Anchor Dot at Card */}
                <circle
                  cx={msg.line.x1}
                  cy={msg.line.y1}
                  r="3.5"
                  fill="#FFF2D6"
                  className="ch2-dot"
                />
                {/* Anchor Dot near Portrait */}
                <circle
                  cx={msg.line.x2}
                  cy={msg.line.y2}
                  r="3"
                  fill="#D4AF37"
                  className="ch2-dot"
                />
              </g>
            ))}
          </svg>

          {/* Left Column Messages (3 cards evenly spaced) */}
          <div className="absolute left-6 top-0 bottom-0 w-[275px] flex flex-col justify-between py-1 z-20">
            {messages.filter((m) => m.position.includes("left")).map((msg) => {
              const IconComp = msg.icon;
              return (
                <div
                  key={msg.id}
                  className="ch2-card group relative p-3.5 rounded-2xl bg-[#0f2417]/92 border border-[#D4AF37]/35 backdrop-blur-md shadow-2xl hover:border-[#D4AF37]/75 hover:bg-[#13301f]/95 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6.5 h-6.5 rounded-full bg-[#1b432a] border border-[#D4AF37]/50 flex items-center justify-center text-[#E6D2A8]">
                      <IconComp className="w-3.5 h-3.5 text-[#E6D2A8]" />
                    </div>
                    <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[#E6D2A8]">
                      {msg.title}
                    </span>
                  </div>
                  <p className="font-serif italic text-sm text-[#F5F1E7]/95 leading-relaxed pl-1">
                    "{msg.quote}"
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center: 2D Illustrated Character with Restrained Anime.js Motion & Parallax */}
          <div className="ch2-portrait absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[500px] z-10 flex items-center justify-center">
            <MaaIllustratedCharacter
              imageSrc="/images/maa-cartoon.png"
              className="w-full h-full"
            />
          </div>

          {/* Right Column Messages (3 cards evenly spaced) */}
          <div className="absolute right-6 top-0 bottom-0 w-[275px] flex flex-col justify-between py-1 z-20">
            {messages.filter((m) => m.position.includes("right")).map((msg) => {
              const IconComp = msg.icon;
              return (
                <div
                  key={msg.id}
                  className="ch2-card group relative p-3.5 rounded-2xl bg-[#0f2417]/92 border border-[#D4AF37]/35 backdrop-blur-md shadow-2xl hover:border-[#D4AF37]/75 hover:bg-[#13301f]/95 transition-all duration-300 transform hover:-translate-y-1 text-right"
                >
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-[#E6D2A8]">
                      {msg.title}
                    </span>
                    <div className="w-6.5 h-6.5 rounded-full bg-[#1b432a] border border-[#D4AF37]/50 flex items-center justify-center text-[#E6D2A8]">
                      <IconComp className="w-3.5 h-3.5 text-[#E6D2A8]" />
                    </div>
                  </div>
                  <p className="font-serif italic text-sm text-[#F5F1E7]/95 leading-relaxed pr-1">
                    "{msg.quote}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE & TABLET RESPONSIVE VIEW: Stacked Clean Layout */}
        <div className="mobile-view lg:hidden w-full flex flex-col items-center space-y-5">
          {/* Portrait at Top */}
          <div className="ch2-portrait w-full max-w-[280px] sm:max-w-[320px] h-[400px] sm:h-[440px] relative flex items-center justify-center">
            <MaaIllustratedCharacter
              imageSrc="/images/maa-cartoon.png"
              className="w-full h-full"
            />
          </div>

          {/* 6 Messages in Responsive Grid */}
          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3 px-2">
            {messages.map((msg) => {
              const IconComp = msg.icon;
              return (
                <div
                  key={`mobile-${msg.id}`}
                  className="ch2-card p-3 rounded-xl bg-[#0f2417]/92 border border-[#D4AF37]/35 backdrop-blur-md shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#1b432a] border border-[#D4AF37]/50 flex items-center justify-center text-[#E6D2A8]">
                      <IconComp className="w-3 h-3 text-[#E6D2A8]" />
                    </div>
                    <span className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-[#E6D2A8]">
                      {msg.title}
                    </span>
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm text-[#F5F1E7]/95 leading-snug">
                    "{msg.quote}"
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Action: Continue Button */}
      <div className="mt-3 mb-1 text-center z-20">
        <button
          onClick={onContinue}
          className="ch2-continue group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#173825] to-[#255638] border border-[#D4AF37]/45 text-[#FFFDF8] font-serif text-base tracking-wider shadow-2xl hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <span>{chapterTwo.continueButton}</span>
          <ArrowRight className="w-4 h-4 text-[#E6D2A8] transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
