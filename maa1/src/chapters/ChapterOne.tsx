import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";
import { siteContent } from "../content";
import anime from "animejs";

interface ChapterOneProps {
  onBegin: () => void;
}

export const ChapterOne: React.FC<ChapterOneProps> = ({ onBegin }) => {
  const opening = siteContent.chapterOne;
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Sequences:
  // 1: Sequence One (Lines 1, 2, 3)
  // 2: Sequence Two (Lines 4, 5)
  // 3: Sequence Three (Climax: "u r always my best" / "mom ever and ever" + "CONTINUE OUR STORY")
  const [currentSeq, setCurrentSeq] = useState<1 | 2 | 3>(1);
  const [seq1Line, setSeq1Line] = useState<number>(0); // 0 = none, 1 = line1, 2 = line2, 3 = line3
  const [seq2Line, setSeq2Line] = useState<number>(0); // 0 = none, 1 = line4, 2 = line5
  const [isTransitioningOut, setIsTransitioningOut] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const climaxRef = useRef<HTMLDivElement | null>(null);

  // Play video with autoplay handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Video autoplay prevented or file loading issue:", err);
      });
    }
  }, []);

  // Choreographed Anime.js Timeline for Opening Sequence
  useEffect(() => {
    // Timing progression:
    // 0.8s -> Line 1
    // 2.6s -> Line 2
    // 4.4s -> Line 3
    // 6.8s -> Sequence 1 disappears smoothly
    // 7.8s -> Sequence 2 begins: Line 4
    // 9.6s -> Line 5
    // 11.8s -> Sequence 2 disappears smoothly
    // 12.8s -> Sequence 3 (Final Climax) appears and stays visible

    const t1 = setTimeout(() => setSeq1Line(1), 800);
    const t2 = setTimeout(() => setSeq1Line(2), 2600);
    const t3 = setTimeout(() => setSeq1Line(3), 4400);

    const t4 = setTimeout(() => {
      // Disappear Sequence 1
      setIsTransitioningOut(true);
      setTimeout(() => {
        setCurrentSeq(2);
        setIsTransitioningOut(false);
      }, 700);
    }, 6800);

    const t5 = setTimeout(() => setSeq2Line(1), 7800);
    const t6 = setTimeout(() => setSeq2Line(2), 9600);

    const t7 = setTimeout(() => {
      // Disappear Sequence 2
      setIsTransitioningOut(true);
      setTimeout(() => {
        setCurrentSeq(3);
        setIsTransitioningOut(false);
      }, 700);
    }, 11800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, []);

  // When sequence 3 (final message) arrives, animate with Anime.js
  useEffect(() => {
    if (currentSeq === 3 && climaxRef.current) {
      anime.timeline({ easing: "easeOutCubic" })
        .add({
          targets: ".climax-line",
          opacity: [0, 1],
          translateY: [30, 0],
          filter: ["blur(10px)", "blur(0px)"],
          delay: anime.stagger(220),
          duration: 1200
        })
        .add({
          targets: ".climax-button",
          opacity: [0, 1],
          translateY: [20, 0],
          scale: [0.94, 1],
          duration: 900
        }, "-=400");
    }
  }, [currentSeq]);

  const handleToggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleContinue = () => {
    if (containerRef.current) {
      anime({
        targets: containerRef.current,
        opacity: [1, 0],
        scale: [1, 1.04],
        filter: ["blur(0px)", "blur(8px)"],
        duration: 800,
        easing: "easeInOutQuad",
        complete: () => {
          onBegin();
        }
      });
    } else {
      onBegin();
    }
  };

  const handleSkipToFinal = () => {
    setCurrentSeq(3);
    setIsTransitioningOut(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col items-center justify-center select-none bg-[#14221A]"
    >
      {/* 1. Cinematic Video Background */}
      {!videoError ? (
        <video
          ref={videoRef}
          src={opening.videoSrc}
          poster={opening.posterSrc}
          autoPlay
          loop
          playsInline
          muted={isMuted}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity duration-1000"
        />
      ) : (
        /* Fallback Photographic Poster */
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('${opening.posterSrc}')` }}
        />
      )}

      {/* 2. Cinematic Atmospheric Gradient Tint for Maximum Text Clarity */}
      <div className="absolute inset-0 bg-black/45 backdrop-brightness-95 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#14221A]/85 via-transparent to-black/50 pointer-events-none" />

      {/* 3. Discreet Sound Control (Quiet Corner Icon) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30">
        <button
          type="button"
          onClick={handleToggleSound}
          aria-label={isMuted ? "Unmute video sound" : "Mute video sound"}
          className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md bg-black/40 border border-white/20 text-[#FFFDF8] hover:bg-black/60 hover:border-white/40 transition-all cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A]"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-white/80" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#A8B89A]" />
          )}
        </button>
      </div>

      {/* 4. Opening Narrative Typography Staging */}
      <div className="relative z-20 w-full max-w-4xl px-6 sm:px-12 text-center flex flex-col items-center justify-center">
        {/* SEQUENCE ONE: The First Three Lines */}
        {currentSeq === 1 && (
          <div
            className={`space-y-4 sm:space-y-6 transition-all duration-700 ${
              isTransitioningOut
                ? "opacity-0 -translate-y-4 filter blur-xs"
                : "opacity-100 translate-y-0"
            }`}
          >
            {opening.sequenceOne.map((line, idx) => {
              const isVisible = seq1Line > idx;
              return (
                <p
                  key={idx}
                  className={`font-serif tracking-wide transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0 text-2xl sm:text-4xl md:text-5xl text-[#FFFDF8]"
                      : "opacity-0 translate-y-6 text-2xl sm:text-4xl"
                  }`}
                  style={{
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.8)"
                  }}
                >
                  {line}
                </p>
              );
            })}

            {/* Quick Skip Option */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleSkipToFinal}
                className="text-xs uppercase tracking-widest text-white/40 hover:text-white/90 transition-colors cursor-pointer"
              >
                {opening.skipButton || "Skip to Message →"}
              </button>
            </div>
          </div>
        )}

        {/* SEQUENCE TWO: The Next Two Lines */}
        {currentSeq === 2 && (
          <div
            className={`space-y-5 sm:space-y-7 transition-all duration-700 ${
              isTransitioningOut
                ? "opacity-0 -translate-y-4 filter blur-xs"
                : "opacity-100 translate-y-0"
            }`}
          >
            {opening.sequenceTwo.map((line, idx) => {
              const isVisible = seq2Line > idx;
              return (
                <p
                  key={idx}
                  className={`font-serif tracking-wide transition-all duration-1000 ${
                    isVisible
                      ? "opacity-100 translate-y-0 text-2xl sm:text-4xl md:text-5xl text-[#FFFDF8]"
                      : "opacity-0 translate-y-6 text-2xl sm:text-4xl"
                  }`}
                  style={{
                    textShadow: "0 4px 30px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.8)"
                  }}
                >
                  {line}
                </p>
              );
            })}

            {/* Quick Skip Option */}
            <div className="pt-8">
              <button
                type="button"
                onClick={handleSkipToFinal}
                className="text-xs uppercase tracking-widest text-white/40 hover:text-white/90 transition-colors cursor-pointer"
              >
                {opening.skipButton || "Skip to Message →"}
              </button>
            </div>
          </div>
        )}

        {/* SEQUENCE THREE: The Special Final Message (Emotional Climax) */}
        {currentSeq === 3 && (
          <div
            ref={climaxRef}
            className="flex flex-col items-center justify-center max-w-3xl mx-auto space-y-6 sm:space-y-8"
          >
            {/* The Special Two-Line Composition */}
            <div className="space-y-2 sm:space-y-4">
              <h1
                className="climax-line opacity-0 font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-wide text-[#FFFDF8] leading-tight drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]"
                style={{
                  textShadow: "0 4px 35px rgba(0, 0, 0, 0.95), 0 2px 15px rgba(0, 0, 0, 0.85)"
                }}
              >
                {opening.sequenceThree.line1}
              </h1>
              <h1
                className="climax-line opacity-0 font-serif italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold tracking-wide text-[#F5F1E7] leading-tight drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)]"
                style={{
                  textShadow: "0 4px 35px rgba(0, 0, 0, 0.95), 0 2px 15px rgba(0, 0, 0, 0.85)"
                }}
              >
                {opening.sequenceThree.line2}
              </h1>
            </div>

            {/* User-Controlled Continue Button */}
            <div className="climax-button opacity-0 pt-8 sm:pt-10">
              <button
                type="button"
                onClick={handleContinue}
                className="group relative inline-flex items-center gap-3.5 px-9 sm:px-11 py-4 sm:py-4.5 rounded-full bg-[#234B35]/90 hover:bg-[#234B35] text-[#FFFDF8] border border-[#A8B89A]/50 font-sans font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase shadow-[0_12px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_45px_rgba(35,75,53,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] backdrop-blur-md"
              >
                <span>{opening.continueButton}</span>
                <ArrowRight className="w-4 h-4 text-[#A8B89A] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
