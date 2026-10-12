import React, { useState, useEffect, useRef } from "react";
import { Sparkles, Wind, RotateCcw, ArrowRight, Utensils } from "lucide-react";
import { musicManager } from "../utils/audioController";
import { Realistic3DCake } from "./Realistic3DCake";
import { ConfettiCanvas } from "./ConfettiCanvas";
import { FullScreenCelebrationVideo } from "./FullScreenCelebrationVideo";
import { siteContent } from "../content";
import anime from "animejs";

interface BirthdayCakeProps {
  onWishMade: () => void;
}

type CelebrationStep =
  | "step1_reveal"
  | "step2_countdown"
  | "step2_make_wish"
  | "step3_blowing"
  | "step4_cutting"
  | "step4_video"
  | "step5_celebration";

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ onWishMade }) => {
  const { chapterSix } = siteContent;
  const [step, setStep] = useState<CelebrationStep>("step1_reveal");
  const [countdownNum, setCountdownNum] = useState<number>(5);
  const [cutProgress, setCutProgress] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const countdownRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const cutAnimRef = useRef<anime.AnimeInstance | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (cutAnimRef.current) cutAnimRef.current.pause();
    };
  }, []);

  // STEP 2: When countdown starts, count 5, 4, 3, 2, 1 smoothly
  useEffect(() => {
    if (step !== "step2_countdown") return;

    if (countdownRef.current) {
      anime({
        targets: countdownRef.current,
        scale: [0.75, 1],
        opacity: [0, 1],
        duration: 450,
        easing: "easeOutBack"
      });
    }

    if (countdownNum > 1) {
      timerRef.current = window.setTimeout(() => {
        setCountdownNum((prev) => prev - 1);
      }, 1000);
    } else {
      // Countdown finished -> Show "CLOSE YOUR EYES AND MAKE A WISH, MAA."
      timerRef.current = window.setTimeout(() => {
        setStep("step2_make_wish");
      }, 1000);
    }

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [step, countdownNum]);

  // Handler: Start Countdown (Step 1 -> Step 2)
  const handleStartWish = () => {
    setCountdownNum(5);
    setStep("step2_countdown");
  };

  // Handler: User clicks "I'M READY" (Step 2 -> Step 3)
  const handleReadyToBlow = () => {
    setStep("step3_blowing");
    musicManager.playCandleBlow();

    // After candle extinguish animation and brief pause, advance to Step 4
    timerRef.current = window.setTimeout(() => {
      handleStartCutting();
    }, 2400);
  };

  // Handler: Step 4 Cake Cutting Animation
  const handleStartCutting = () => {
    setStep("step4_cutting");
    setCutProgress(0);

    // Animate cutProgress from 0 to 1 over 3.2 seconds using Anime.js
    const progressObj = { val: 0 };
    cutAnimRef.current = anime({
      targets: progressObj,
      val: 1,
      duration: 3400,
      easing: "easeInOutCubic",
      update: () => {
        setCutProgress(progressObj.val);
      },
      complete: () => {
        // Cutting finished genuinely -> Pause background music so tracks don't overlap
        musicManager.pause();

        // Immediately transition to full-screen video experience of 11.mp4
        timerRef.current = window.setTimeout(() => {
          setStep("step4_video");
        }, 350);
      }
    });
  };

  const handleVideoEnded = () => {
    // When video ends, smoothly return to Step 5 Celebration with confetti
    setStep("step5_celebration");
    setShowConfetti(true);
  };

  const handleSkipVideo = () => {
    setStep("step5_celebration");
    setShowConfetti(true);
  };

  // Handler: Replay Celebration from Step 1
  const handleReplay = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (cutAnimRef.current) cutAnimRef.current.pause();
    setShowConfetti(false);
    setCutProgress(0);
    setCountdownNum(5);
    setStep("step1_reveal");
  };

  // Determine cake state based on current step
  const candlesLit = step === "step1_reveal" || step === "step2_countdown" || step === "step2_make_wish";
  const isBlowingOut = step === "step3_blowing";
  const isCutting = step === "step4_cutting";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center select-none relative z-10">
      {/* Full-Screen Celebration Video (11.mp4) genuinely triggered after cake cutting */}
      {step === "step4_video" && (
        <FullScreenCelebrationVideo
          videoSrc="/videos/11.mp4"
          onEnded={handleVideoEnded}
          onSkip={handleSkipVideo}
        />
      )}

      {/* Confetti celebration canvas during Step 5 */}
      {showConfetti && <ConfettiCanvas active={showConfetti} count={60} />}

      {/* Realistic 3D Birthday Cake Viewport */}
      <div className="relative w-full max-w-[460px] h-[340px] sm:h-[400px] flex items-center justify-center my-1">
        {/* Soft golden aura behind cake */}
        <div
          className={`absolute inset-0 rounded-full bg-[#E8C170]/20 blur-3xl transition-opacity duration-1000 pointer-events-none ${
            candlesLit ? "opacity-100" : "opacity-20"
          }`}
          aria-hidden="true"
        />

        <Realistic3DCake
          candlesLit={candlesLit}
          isBlowingOut={isBlowingOut}
          isCutting={isCutting}
          cutProgress={cutProgress}
          allowRotation={step === "step1_reveal" || step === "step5_celebration"}
          className="w-full h-full"
        />
      </div>

      {/* Interactive Controls Stage */}
      <div className="mt-3 flex flex-col items-center text-center min-h-[160px] justify-center z-20 w-full px-4">
        {/* STEP 1: CAKE REVEAL */}
        {step === "step1_reveal" && (
          <div className="flex flex-col items-center space-y-3.5 animate-fade-in">
            <p className="font-serif italic text-base sm:text-lg text-[#F5F1E7]/95 max-w-md">
              {chapterSix.revealMessage}
            </p>
            <button
              type="button"
              onClick={handleStartWish}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#234B35] to-[#2F5E44] hover:from-[#2e6245] hover:to-[#3b7556] text-[#FFFDF8] border border-[#E8C170]/60 rounded-full font-serif text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(232,193,112,0.35)] hover:shadow-[0_15px_45px_rgba(232,193,112,0.6)] hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
            >
              <Sparkles className="w-4 h-4 text-[#E8C170] group-hover:rotate-12 transition-transform" />
              <span>{chapterSix.wishButton}</span>
            </button>
          </div>
        )}

        {/* STEP 2: COUNTDOWN (5, 4, 3, 2, 1) */}
        {step === "step2_countdown" && (
          <div className="flex flex-col items-center space-y-2 animate-fade-in">
            <span className="font-serif text-xs tracking-widest uppercase text-[#E8C170]">
              {chapterSix.countdownSubtitle}
            </span>
            <div
              ref={countdownRef}
              key={countdownNum}
              className="font-serif text-5xl sm:text-6xl font-bold text-[#E8C170] drop-shadow-[0_0_20px_rgba(232,193,112,0.8)]"
            >
              {countdownNum}
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-[#F5F1E7]/80">
              {chapterSix.countdownHint}
            </p>
          </div>
        )}

        {/* STEP 2 END: "CLOSE YOUR EYES AND MAKE A WISH, MAA." */}
        {step === "step2_make_wish" && (
          <div className="flex flex-col items-center space-y-3.5 animate-fade-in">
            <h3 className="font-serif text-xl sm:text-2xl text-[#FFFDF8] font-semibold tracking-wide drop-shadow-md">
              {chapterSix.closeEyesTitle}
            </h3>
            <p className="font-serif italic text-xs sm:text-sm text-[#E8C170] max-w-sm">
              {chapterSix.closeEyesSubtitle}
            </p>
            <button
              type="button"
              onClick={handleReadyToBlow}
              className="group inline-flex items-center gap-3 px-10 py-3.5 bg-gradient-to-r from-[#234B35] to-[#2F5E44] hover:from-[#2e6245] hover:to-[#3b7556] text-[#FFFDF8] border border-[#E8C170]/70 rounded-full font-serif text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_10px_35px_rgba(232,193,112,0.4)] hover:scale-105 active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C170]"
            >
              <Wind className="w-4 h-4 text-[#E8C170] group-hover:translate-x-1 transition-transform" />
              <span>{chapterSix.readyButton}</span>
            </button>
          </div>
        )}

        {/* STEP 3: BLOWING OUT CANDLES */}
        {step === "step3_blowing" && (
          <div className="flex flex-col items-center space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-[#E8C170]">
              <Wind className="w-5 h-5 animate-pulse" />
              <p className="font-serif italic text-lg sm:text-xl text-[#FFFDF8]">
                {chapterSix.breezeTitle}
              </p>
            </div>
            <p className="text-xs text-[#A8B89A] font-serif tracking-widest uppercase">
              {chapterSix.breezeSubtitle}
            </p>
          </div>
        )}

        {/* STEP 4: CAKE-CUTTING ANIMATION */}
        {step === "step4_cutting" && (
          <div className="flex flex-col items-center space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 text-[#E8C170]">
              <Utensils className="w-5 h-5 animate-bounce" />
              <h3 className="font-serif text-xl sm:text-2xl text-[#FFFDF8] font-semibold tracking-wide">
                {chapterSix.cutCakeTitle}
              </h3>
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-[#A8B89A]">
              {chapterSix.cutCakeSubtitle}
            </p>
          </div>
        )}

        {/* STEP 5: CELEBRATION */}
        {step === "step5_celebration" && (
          <div className="flex flex-col items-center space-y-3.5 animate-fade-in">
            <div className="flex items-center gap-2 text-[#E8C170]">
              <Sparkles className="w-6 h-6 animate-spin text-[#E8C170]" />
              <h2 className="font-serif text-3xl sm:text-4xl text-[#FFFDF8] font-bold tracking-wider drop-shadow-lg">
                {chapterSix.celebrationTitle}
              </h2>
              <Sparkles className="w-6 h-6 animate-spin text-[#E8C170]" />
            </div>

            <p className="font-serif italic text-base sm:text-lg text-[#F5F1E7]/90 max-w-lg leading-relaxed">
              {chapterSix.celebrationMessage}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              {/* Replay button */}
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#162C20]/90 hover:bg-[#234B35] text-[#FFFDF8] border border-[#A8B89A]/40 font-serif text-xs tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#E8C170]" />
                <span>{chapterSix.replayButton}</span>
              </button>

              {/* Proceed to Grand Reveal */}
              <button
                type="button"
                onClick={onWishMade}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#234B35] to-[#2F5E44] hover:from-[#2e6245] hover:to-[#3b7556] text-[#FFFDF8] border border-[#E8C170]/60 rounded-full font-serif text-xs tracking-wider uppercase transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{chapterSix.proceedButton}</span>
                <ArrowRight className="w-4 h-4 text-[#E8C170]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



