import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Heart } from "lucide-react";
import { musicPlayer } from "../utils/audioSynthesizer";
import { WeddingConfig } from "../config/weddingConfig";

interface EnvelopeOpeningModalProps {
  config: WeddingConfig;
  isOpen: boolean;
  onOpenComplete: () => void;
}

export default function EnvelopeOpeningModal({
  config,
  isOpen,
  onOpenComplete,
}: EnvelopeOpeningModalProps) {
  const [isOpening, setIsOpening] = useState(false);

  if (!isOpen) return null;

  const handleOpenInvitation = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Start background music gently on user interaction
    try {
      musicPlayer.play();
    } catch (err) {
      console.error("Audio autoplay prevented", err);
    }

    // Trigger rose petal burst using canvas-confetti
    try {
      const petalColors = ["#E8A6B5", "#F7DCE2", "#D8B779", "#FFFDF8", "#DE5D7C"];
      confetti({
        particleCount: 45,
        spread: 85,
        origin: { y: 0.65 },
        colors: petalColors,
        scalar: 1.3,
        shapes: ["circle"],
        ticks: 240,
      });

      window.setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 65,
          origin: { x: 0.15, y: 0.7 },
          colors: petalColors,
          scalar: 1.2,
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 65,
          origin: { x: 0.85, y: 0.7 },
          colors: petalColors,
          scalar: 1.2,
        });
      }, 300);
    } catch {
      // Confetti fallback
    }

    // Smooth cinematic transition revealing invitation
    window.setTimeout(() => {
      onOpenComplete();
    }, 1100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Invitation Envelope"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-1000 ${
        isOpening ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, rgba(255,253,248,0.94) 0%, rgba(247,220,226,0.96) 100%)",
      }}
    >
      {/* Floating glowing fairy lights & soft rose halos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-12 w-28 h-28 rounded-full bg-[#E8A6B5]/25 blur-3xl animate-pulse" />
        <div className="absolute bottom-24 right-12 w-36 h-36 rounded-full bg-[#D8B779]/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-[#F7DCE2]/40 blur-2xl animate-pulse" />
      </div>

      {/* Center 3D Envelope Experience Container */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Intro Badge */}
        <p className="font-serif-cormorant text-lg sm:text-2xl text-[#9A5067] italic tracking-wide mb-2">
          Something Beautiful Is Blooming...
        </p>

        {/* Headlines */}
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl text-[#783C50] font-bold tracking-tight mb-6">
          You're Invited!
        </h1>

        {/* 3D Handcrafted Needle-Felted Envelope surrounded by Pink Wool Roses */}
        <div className="relative w-full max-w-sm my-2">
          {/* Surrounding Felt Wool Roses */}
          <div className="absolute -top-4 -left-4 text-3xl select-none z-30 animate-bounce" style={{ animationDuration: "3s" }}>
            🌹
          </div>
          <div className="absolute -top-4 -right-4 text-3xl select-none z-30 animate-bounce" style={{ animationDuration: "3.5s" }}>
            🌸
          </div>
          <div className="absolute -bottom-4 -left-4 text-3xl select-none z-30 animate-bounce" style={{ animationDuration: "4s" }}>
            🌸
          </div>
          <div className="absolute -bottom-4 -right-4 text-3xl select-none z-30 animate-bounce" style={{ animationDuration: "3.2s" }}>
            🌹
          </div>

          <div
            className="relative w-full h-64 sm:h-72 cursor-pointer perspective-1000 group select-none"
            onClick={handleOpenInvitation}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpenInvitation();
              }
            }}
            aria-label="Open your 3D wedding invitation"
          >
            {/* Envelope Body (Felt Textured Ivory & Blush with Stitches) */}
            <div
              className={`w-full h-full relative rounded-2xl felt-card border-2 border-dashed border-[#D99AAA] shadow-2xl transition-all duration-700 p-6 flex flex-col items-center justify-between overflow-hidden ${
                isOpening ? "shadow-rose-300/60 scale-102" : "group-hover:-translate-y-1.5 group-hover:shadow-rose-200/50"
              }`}
              style={{
                background: "linear-gradient(145deg, #FFFDF8 0%, #FFF5EA 100%)",
              }}
            >
              {/* Top decorative wool lace stitch */}
              <div className="w-full border-t-2 border-dashed border-[#D8B779]/60 pt-1" />

              {/* Couple Monogram on Envelope */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FFF5EA] border-2 border-dashed border-[#D8B779] shadow-inner flex items-center justify-center mb-3">
                  <span className="font-playfair text-2xl font-bold text-[#783C50] tracking-wider">
                    {config.couple.coupleMonogram}
                  </span>
                </div>
                <p className="font-playfair text-xl font-bold text-[#783C50]">
                  {config.couple.groomName} &amp; {config.couple.brideName}
                </p>
                <p className="text-xs uppercase tracking-widest text-[#A8B69A] font-bold mt-1">
                  18 &amp; 19 November 2026
                </p>
              </div>

              {/* Rose decoration at bottom flap */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🌸</span>
                <span className="text-sm font-serif-cormorant italic text-[#783C50]/80">
                  With love and blessings
                </span>
                <span className="text-lg">🌸</span>
              </div>

              {/* 3D Envelope Flap */}
              <div
                className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-transform duration-700 ease-out z-20 pointer-events-none rounded-t-2xl border-b-2 border-dashed border-[#D99AAA]/70 shadow-md ${
                  isOpening ? "rotate-x-180 opacity-0" : ""
                }`}
                style={{
                  background: "linear-gradient(180deg, #F7DCE2 0%, #FFF5EA 100%)",
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              >
                {/* Golden Wax Seal on Flap */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-[#E5C388] via-[#D8B779] to-[#9E7B3B] shadow-md flex items-center justify-center text-white border border-[#FFF5EA]">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glowing Rose-Shaped Action Button */}
        <div className="mt-8 flex flex-col items-center">
          <button
            onClick={handleOpenInvitation}
            disabled={isOpening}
            className="group relative inline-flex items-center justify-center gap-3 px-9 py-3.5 rounded-full text-base font-semibold text-white tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-rose-300/60"
            style={{
              background: "linear-gradient(135deg, #DE5D7C 0%, #E8A6B5 60%, #D8B779 100%)",
              boxShadow: "0 8px 24px -4px rgba(222, 93, 124, 0.45), inset 0 1px 2px rgba(255,255,255,0.6)",
            }}
            aria-label="Open Your Invitation"
          >
            <span className="text-lg">🌹</span>
            <span className="font-medium text-white drop-shadow-xs">
              {isOpening ? "Opening Your Invitation..." : "Open Your Invitation"}
            </span>
            <Sparkles className="w-4 h-4 text-white/90 group-hover:rotate-12 transition-transform" />
          </button>

          <p className="text-xs text-[#783C50]/65 mt-3 font-medium">
            Click to unfold our little world of forever
          </p>
        </div>
      </div>
    </div>
  );
}
