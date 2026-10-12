import React, { useState, useRef, useEffect } from "react";
import { siteContent } from "../content";
import { Mail, MailOpen, Heart, Sparkles } from "lucide-react";
import anime from "animejs";

interface LetterEnvelopeProps {
  onContinue?: () => void;
}

export const LetterEnvelope: React.FC<LetterEnvelopeProps> = ({ onContinue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { envelope, letter } = siteContent.chapterThree;
  const envelopeCardRef = useRef<HTMLDivElement | null>(null);
  const letterCardRef = useRef<HTMLDivElement | null>(null);

  const handleOpenLetter = () => {
    if (envelopeCardRef.current && !isOpen) {
      anime({
        targets: envelopeCardRef.current,
        scale: [1, 0.95],
        opacity: [1, 0],
        duration: 400,
        easing: "easeInOutQuad",
        complete: () => {
          setIsOpen(true);
        }
      });
    } else {
      setIsOpen(true);
    }
  };

  useEffect(() => {
    if (isOpen && letterCardRef.current) {
      const paragraphs = letterCardRef.current.querySelectorAll(".letter-p");
      anime.timeline({ easing: "easeOutCubic" })
        .add({
          targets: letterCardRef.current,
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.97, 1],
          duration: 750
        })
        .add({
          targets: paragraphs,
          opacity: [0, 1],
          translateY: [15, 0],
          delay: anime.stagger(150),
          duration: 650,
          offset: "-=300"
        });
    }
  }, [isOpen]);

  const handleFoldBack = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center select-none relative z-10">
      {!isOpen ? (
        /* Sealed Luxury Physical Envelope View */
        <div ref={envelopeCardRef} className="w-full flex flex-col items-center">
          <div
            role="button"
            tabIndex={0}
            onClick={handleOpenLetter}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenLetter();
              }
            }}
            aria-label="Click to open letter for Maa"
            className="group relative w-full aspect-[16/10] max-w-lg glass-greenery-card bg-[#234B35]/75 rounded-2xl shadow-[0_25px_60px_rgba(12,24,16,0.9)] border-2 border-[#A8B89A]/40 p-6 sm:p-8 flex flex-col items-center justify-between cursor-pointer hover:shadow-[0_25px_65px_rgba(35,75,53,0.5)] transition-all duration-500 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A]"
          >
            {/* Geometric envelope flap simulation */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 bg-[#1B3828]/60 border-b border-[#A8B89A]/30 [clip-path:polygon(0_0,100%_0,50%_100%)] transition-transform duration-500 origin-top group-hover:scale-y-95 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Vintage postage stamp corner */}
            <div className="absolute top-4 right-4 w-12 h-14 border border-dashed border-[#A8B89A]/40 rounded-md bg-[#162C20]/80 p-1 flex flex-col items-center justify-center text-center shadow-md">
              <Heart className="w-4 h-4 text-[#A8B89A] fill-[#A8B89A]/20" />
              <span className="text-[8px] font-sans uppercase tracking-widest text-[#F5F1E7]/80 mt-1">
                {envelope.stampText}
              </span>
            </div>

            <div className="h-4" />

            {/* Forest Gold Wax Seal & Title */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#A8B89A] via-[#234B35] to-[#162C20] text-[#FFFDF8] border-2 border-[#F5F1E7] shadow-[0_0_25px_rgba(168,184,154,0.4)] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <span className="font-serif italic font-bold text-2xl tracking-wider">
                  {envelope.monogram}
                </span>
              </div>
              <h3 className="font-serif italic text-2xl sm:text-3xl text-[#FFFDF8] font-semibold tracking-wide drop-shadow-md">
                "{envelope.title}"
              </h3>
              <p className="font-sans text-xs tracking-wider uppercase text-[#A8B89A] mt-1.5">
                {envelope.subtitle}
              </p>
            </div>

            {/* Bottom accent hint */}
            <div className="relative z-10 text-xs font-serif italic text-[#A8B89A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E8C170]" />
              <span>{envelope.clickHint}</span>
            </div>
          </div>

          {/* Explicit Open Button */}
          <div className="mt-8">
            <button
              type="button"
              onClick={handleOpenLetter}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] border border-[#A8B89A]/40 rounded-full font-semibold text-xs tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] shadow-lg"
            >
              <Mail className="w-4 h-4 text-[#A8B89A]" />
              <span>{envelope.openButton}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Unfolded Letter Parchment View */
        <div ref={letterCardRef} className="w-full flex flex-col items-center opacity-0">
          <div className="relative w-full glass-parchment-card text-[#1A2E20] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#76634D]/30 p-7 sm:p-12 md:p-14">
            {/* Elegant corner flourishes */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#76634D]/40 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#76634D]/40 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#76634D]/40 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#76634D]/40 rounded-br-sm pointer-events-none" />

            {/* Letter Salutation */}
            <div className="mb-6">
              <h3 className="font-serif text-3xl sm:text-4xl text-[#234B35] font-bold italic tracking-wide">
                {letter.salutation}
              </h3>
            </div>

            {/* Letter Paragraphs */}
            <div className="space-y-4 sm:space-y-5 text-base sm:text-lg leading-relaxed sm:leading-loose text-[#233527] font-serif">
              {letter.paragraphs.map((paragraph, idx) => (
                <p key={idx} className="letter-p opacity-0">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Handwritten Signature */}
            <div className="mt-10 sm:mt-12 pt-6 border-t border-[#76634D]/20 flex flex-col sm:flex-row items-baseline justify-between gap-4">
              <div>
                <span className="block text-xs uppercase tracking-widest text-[#76634D] font-sans mb-1 font-semibold">
                  {letter.closingLabel}
                </span>
                <p className="font-['Alex_Brush',cursive] text-4xl sm:text-5xl text-[#234B35] drop-shadow-xs">
                  {letter.signature}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleFoldBack}
                  className="inline-flex items-center gap-1.5 text-xs text-[#76634D] hover:text-[#234B35] transition-colors cursor-pointer font-sans"
                >
                  <MailOpen className="w-3.5 h-3.5 text-[#234B35]" />
                  <span>{letter.foldBackButton}</span>
                </button>

                {onContinue && (
                  <button
                    type="button"
                    onClick={onContinue}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] font-sans font-semibold text-xs tracking-wider uppercase transition-all shadow-md hover:scale-105 cursor-pointer"
                  >
                    <span>{letter.continueButton}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
