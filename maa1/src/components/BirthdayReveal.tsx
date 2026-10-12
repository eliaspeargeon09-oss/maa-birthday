import React, { useState, useEffect, useRef } from "react";
import { siteContent } from "../content";
import { Sparkles, Heart, RotateCcw, Image as ImageIcon } from "lucide-react";
import anime from "animejs";

interface BirthdayRevealProps {
  onRevisitMemories: () => void;
  onRestart: () => void;
}

export const BirthdayReveal: React.FC<BirthdayRevealProps> = ({
  onRevisitMemories,
  onRestart
}) => {
  const { chapterSeven } = siteContent;
  const [imageError, setImageError] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const greetingRef = useRef<HTMLHeadingElement | null>(null);
  const nameRef = useRef<HTMLHeadingElement | null>(null);
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const messageRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  const runRevealSequence = () => {
    const tl = anime.timeline({
      easing: "easeOutCubic"
    });

    if (greetingRef.current) {
      tl.add({
        targets: greetingRef.current,
        opacity: [0, 1],
        translateY: [25, 0],
        duration: 900
      });
    }

    if (nameRef.current) {
      tl.add({
        targets: nameRef.current,
        opacity: [0, 1],
        scale: [0.85, 1],
        duration: 1000,
        easing: "easeOutBack",
        offset: "-=400"
      });
    }

    if (portraitRef.current) {
      tl.add({
        targets: portraitRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.96, 1],
        duration: 900,
        offset: "-=500"
      });
    }

    if (messageRef.current) {
      tl.add({
        targets: messageRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 900,
        offset: "-=400"
      });
    }

    if (actionsRef.current) {
      tl.add({
        targets: actionsRef.current,
        opacity: [0, 1],
        translateY: [15, 0],
        duration: 800,
        offset: "-=300"
      });
    }
  };

  useEffect(() => {
    runRevealSequence();
  }, []);

  const handleWatchAgain = () => {
    runRevealSequence();
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto flex flex-col items-center text-center pb-8 select-none relative z-10"
    >
      {/* Atmospheric center sunbeam glow */}
      <div
        className="w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-r from-[#E8C170]/20 via-[#234B35]/30 to-[#E8C170]/20 blur-3xl absolute pointer-events-none -z-10 animate-sunlight"
        aria-hidden="true"
      />

      {/* Opening Reveal: "HAPPY BIRTHDAY" */}
      <h1
        ref={greetingRef}
        className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#FFFDF8] drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] leading-tight mb-2 opacity-0"
      >
        {chapterSeven.greeting}
      </h1>

      {/* "MAA ❤️" */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <h2
          ref={nameRef}
          className="font-serif italic text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-[#A8B89A] via-[#FFFDF8] to-[#E8C170] font-bold drop-shadow-[0_10px_35px_rgba(232,193,112,0.4)] opacity-0"
        >
          {chapterSeven.name}
        </h2>
      </div>

      {/* Maa's Portrait Frame with Graceful Archival Keepsake Fallback */}
      <div ref={portraitRef} className="relative my-4 group opacity-0">
        {/* Soft golden aura */}
        <div
          className="absolute -inset-4 bg-gradient-to-r from-[#E8C170]/25 via-[#234B35]/25 to-[#E8C170]/25 rounded-3xl blur-2xl animate-sunlight pointer-events-none"
          aria-hidden="true"
        />

        {/* Archival Keepsake Frame in Botanical Forest & Brass */}
        <div className="relative w-64 sm:w-76 md:w-80 aspect-[3/4] rounded-2xl p-3 bg-gradient-to-b from-[#A8B89A] via-[#234B35] to-[#162C20] shadow-[0_20px_50px_rgba(12,24,16,0.9)] border-2 border-[#A8B89A]/50">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#162C20] border border-[#A8B89A]/30 flex items-center justify-center">
            {!imageError ? (
              <img
                src={chapterSeven.portraitPath}
                alt="Beloved Maa Portrait"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : null}

            {/* Graceful Archival Mat (Rendered when custom photo is not yet provided) */}
            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#234B35] via-[#162C20] to-[#354A2C]">
                {/* Monogram */}
                <div className="w-20 h-20 rounded-full border-2 border-[#A8B89A] bg-[#162C20] text-[#A8B89A] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,184,154,0.3)]">
                  <span className="font-serif font-bold text-4xl italic">
                    {chapterSeven.fallbackMat.monogram}
                  </span>
                </div>
                <h4 className="font-serif text-2xl text-[#FFFDF8] font-semibold">
                  {chapterSeven.fallbackMat.title}
                </h4>
                <p className="font-serif italic text-xs sm:text-sm text-[#A8B89A] mt-1 max-w-[200px]">
                  "{chapterSeven.fallbackMat.quote}"
                </p>
                <div className="mt-4 pt-3 border-t border-[#A8B89A]/30 flex items-center gap-1.5 text-[10px] font-sans uppercase tracking-wider text-[#A8B89A]">
                  <ImageIcon className="w-3.5 h-3.5 text-[#A8B89A]" />
                  <span>{chapterSeven.fallbackMat.photoSlotNotice}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Small portrait caption */}
        <p className="font-serif italic text-xs sm:text-sm text-[#A8B89A] mt-3">
          {chapterSeven.portraitCaption}
        </p>
      </div>

      {/* Narrative Message Card */}
      <div
        ref={messageRef}
        className="mt-8 max-w-2xl mx-auto px-6 sm:px-10 py-8 sm:py-10 glass-greenery-card bg-[#162C20]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-[#A8B89A]/30 shadow-2xl text-left opacity-0"
      >
        <div className="space-y-4 font-serif text-lg sm:text-xl leading-relaxed text-[#FFFDF8]">
          {chapterSeven.paragraphs.map((para, i) => (
            <p key={i} className="text-[#F5F1E7]/95">
              {para}
            </p>
          ))}
        </div>

        {/* Final Decorative Closing */}
        <div className="mt-8 pt-6 border-t border-[#A8B89A]/20 flex flex-col items-center text-center">
          <Heart className="w-5 h-5 text-[#A8B89A] mb-2 fill-[#A8B89A]/30" />
          <p className="font-['Alex_Brush',cursive] text-3xl sm:text-4xl text-[#FFFDF8] drop-shadow-md">
            {chapterSeven.closingSignature}
          </p>
        </div>
      </div>

      {/* Action Buttons: Relive Memories, Watch Reveal Again, Restart */}
      <div
        ref={actionsRef}
        className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 opacity-0"
      >
        <button
          type="button"
          onClick={onRevisitMemories}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#234B35] text-[#FFFDF8] hover:bg-[#2F5E44] border border-[#A8B89A]/40 font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A]"
        >
          <ImageIcon className="w-4 h-4 text-[#A8B89A]" />
          <span>{chapterSeven.buttons.revisitMemories}</span>
        </button>

        <button
          type="button"
          onClick={handleWatchAgain}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E8C170] text-[#162C20] hover:bg-[#F5F1E7] font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A]"
        >
          <Sparkles className="w-4 h-4 text-[#162C20]" />
          <span>{chapterSeven.buttons.watchAgain}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-transparent text-[#F5F1E7] hover:text-[#FFFDF8] hover:bg-white/10 font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all border border-[#A8B89A]/30 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A]"
        >
          <RotateCcw className="w-4 h-4 text-[#A8B89A]" />
          <span>{chapterSeven.buttons.startAgain}</span>
        </button>
      </div>
    </div>
  );
};
