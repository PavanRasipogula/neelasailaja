import { useState } from "react";
import { WeddingConfig } from "../config/weddingConfig";

interface HeroSectionProps {
  config: WeddingConfig;
}

export default function HeroSection({ config }: HeroSectionProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: -(y * 10), y: x * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section
      id="invitation"
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-10 pb-16 px-4 text-center overflow-hidden"
    >
      {/* Decorative wool stitches at top */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-center gap-3 mb-6">
        <span className="h-0.5 w-16 bg-[#D99AAA]/40 border-t border-dashed border-[#D99AAA]" />
        <span className="text-xs sm:text-sm font-serif-cormorant italic text-[#783C50] tracking-widest uppercase">
          A Blooming Love
        </span>
        <span className="h-0.5 w-16 bg-[#D99AAA]/40 border-t border-dashed border-[#D99AAA]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Subtitle */}
        <p className="font-serif-cormorant text-xl sm:text-2xl text-[#9A5067] tracking-wider italic mb-4">
          {config.couple.invitationSubtitle}
        </p>

        {/* Couple Names - Main Visual Focus */}
        <div className="my-3">
          <h1 className="font-playfair text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#783C50] uppercase leading-none drop-shadow-xs">
            {config.couple.groomName}
          </h1>
          <div className="flex items-center justify-center my-3 sm:my-4 gap-4">
            <span className="h-px w-14 sm:w-24 bg-[#D8B779]" />
            <span className="font-script text-5xl sm:text-6xl text-[#D8B779] px-2 leading-none">
              &amp;
            </span>
            <span className="h-px w-14 sm:w-24 bg-[#D8B779]" />
          </div>
          <h2 className="font-playfair text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[#783C50] uppercase leading-none drop-shadow-xs">
            {config.couple.brideName}
          </h2>
        </div>

        {/* Tagline */}
        <p className="font-serif-cormorant text-2xl sm:text-3xl text-[#783C50]/90 italic mt-4 mb-3 max-w-xl">
          "{config.couple.tagline}"
        </p>

        {/* Formal Invitation Text */}
        <p className="font-serif-cormorant text-lg sm:text-xl text-[#9A5067] max-w-md mx-auto mb-8 font-medium">
          {config.couple.requestText}
        </p>

        {/* Handcrafted Needle-Felted Couple Heirloom Portrait (3D Interactive Tilt) */}
        <div
          className="relative max-w-sm sm:max-w-md w-full mx-auto my-2 transition-transform duration-300 ease-out select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Felt Frame with Wool Border & Stitches */}
          <div className="relative p-3 sm:p-4 rounded-3xl bg-[#FFFDF8] border-3 border-dashed border-[#D99AAA] shadow-2xl">
            {/* Corner felt rose & flower embellishments */}
            <div className="absolute -top-3 -left-3 text-2xl">🌹</div>
            <div className="absolute -top-3 -right-3 text-2xl">🌸</div>
            <div className="absolute -bottom-3 -left-3 text-2xl">🌼</div>
            <div className="absolute -bottom-3 -right-3 text-2xl">🌹</div>

            {/* Photo Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-inner border border-[#E8A6B5]/40 bg-[#FFF5EA]">
              <img
                src={config.couple.heroPhoto}
                alt="NeelaKumar and Sailaja Wedding Portrait"
                className="w-full h-auto object-cover max-h-[520px] sm:max-h-[600px] transform hover:scale-102 transition-transform duration-700"
                loading="eager"
              />

              {/* Bottom vignette tag */}
              <div className="absolute bottom-3 left-3 right-3 py-2 px-3 rounded-xl bg-[#FFFDF8]/95 backdrop-blur-xs border border-[#D8B779]/60 text-center shadow-xs">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#783C50]">
                  {config.couple.groomName} &amp; {config.couple.brideName} &bull; 18 &amp; 19 November 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
