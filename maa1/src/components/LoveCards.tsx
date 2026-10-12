import React, { useState, useEffect, useRef } from "react";
import { siteContent } from "../content";
import { Heart, Gift, Shield, Compass, Sun, BookOpen, Check } from "lucide-react";
import anime from "animejs";

interface LoveCardsProps {
  onContinue?: () => void;
}

export const LoveCards: React.FC<LoveCardsProps> = ({ onContinue }) => {
  const { specialReasons } = siteContent;
  const { cards } = specialReasons;
  const [openedCards, setOpenedCards] = useState<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (gridRef.current) {
      const cardEls = gridRef.current.querySelectorAll(".love-card-item");
      anime({
        targets: cardEls,
        opacity: [0, 1],
        translateY: [25, 0],
        scale: [0.96, 1],
        delay: anime.stagger(120),
        duration: 800,
        easing: "easeOutCubic"
      });
    }
  }, []);

  const toggleCard = (id: string) => {
    setOpenedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case "heart":
        return <Heart className="w-5 h-5 text-[#A8B89A] fill-[#A8B89A]/20" />;
      case "kindness":
        return <Gift className="w-5 h-5 text-[#A8B89A]" />;
      case "strength":
        return <Shield className="w-5 h-5 text-[#A8B89A]" />;
      case "presence":
        return <Compass className="w-5 h-5 text-[#A8B89A]" />;
      case "smile":
        return <Sun className="w-5 h-5 text-[#E8C170]" />;
      case "faith":
        return <BookOpen className="w-5 h-5 text-[#A8B89A]" />;
      default:
        return <Heart className="w-5 h-5 text-[#A8B89A]" />;
    }
  };

  const allOpened = openedCards.size === cards.length;

  return (
    <div className="w-full max-w-4xl mx-auto select-none">
      {/* Cards 2-Column Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {cards.map((card) => {
          const isOpen = openedCards.has(card.id);

          return (
            <div
              key={card.id}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`${card.title}: ${isOpen ? "Opened" : "Click to reveal reminder"}`}
              onClick={() => toggleCard(card.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleCard(card.id);
                }
              }}
              className={`love-card-item opacity-0 relative text-left p-6 rounded-2xl transition-all duration-400 border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A8B89A] ${
                isOpen
                  ? "glass-greenery-card bg-[#234B35]/85 border-[#A8B89A] shadow-[0_15px_35px_rgba(18,34,24,0.5)] scale-[1.01]"
                  : "glass-greenery-card bg-[#162C20]/60 border-[#A8B89A]/25 hover:border-[#A8B89A]/60 hover:bg-[#162C20]/80 hover:-translate-y-1 shadow-md"
              }`}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${
                      isOpen
                        ? "bg-[#2F5E44] border-[#A8B89A] shadow-[0_0_15px_rgba(168,184,154,0.3)]"
                        : "bg-[#162C20]/80 border-[#A8B89A]/25"
                    }`}
                  >
                    {getIcon(card.id)}
                  </div>
                  <div>
                    <span className="block text-[11px] font-sans tracking-widest uppercase text-[#A8B89A] font-semibold">
                      {card.number}
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FFFDF8] tracking-wide">
                      {card.title}
                    </h3>
                  </div>
                </div>

                {/* State Tag */}
                <div className="shrink-0">
                  {isOpen ? (
                    <span className="flex items-center gap-1 text-xs font-serif italic text-[#A8B89A] font-medium">
                      <Check className="w-3.5 h-3.5 text-[#A8B89A]" />
                      <span>{specialReasons.revealed || "Revealed"}</span>
                    </span>
                  ) : (
                    <span className="text-xs font-serif italic text-[#A8B89A]/70 hover:text-[#FFFDF8]">
                      {specialReasons.tapToOpen || "Tap to open"}
                    </span>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="pt-2 border-t border-[#A8B89A]/20 min-h-[64px] flex items-center">
                {isOpen ? (
                  <p className="font-serif text-[#FFFDF8] text-base sm:text-lg leading-relaxed font-normal animate-fade-in">
                    "{card.message}"
                  </p>
                ) : (
                  <p className="font-serif italic text-xs sm:text-sm text-[#A8B89A]/70">
                    Click to uncover a special thought about your {card.title.toLowerCase().replace("your ", "")}...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress helper & Continue Action */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
        <div className="text-xs font-serif italic text-[#A8B89A]">
          {allOpened ? (
            <span className="text-[#A8B89A] font-medium">
              {specialReasons.progressCompleted || "All six reasons explored with deep love and gratitude."}
            </span>
          ) : (
            <span>
              {openedCards.size} {specialReasons.progressPrefix || "of 6 reasons opened. Explore each one at your own pace."}
            </span>
          )}
        </div>

        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#234B35] hover:bg-[#2F5E44] text-[#FFFDF8] border border-[#A8B89A]/40 font-sans font-semibold text-xs tracking-widest uppercase transition-all shadow-md hover:scale-105 cursor-pointer"
          >
            <span>{specialReasons.continueButton || "A Prayer for Maa →"}</span>
          </button>
        )}
      </div>
    </div>
  );
};
