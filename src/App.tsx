import { useState } from "react";
import { initialWeddingConfig, WeddingConfig } from "./config/weddingConfig";
import ThreeGardenCanvas from "./components/ThreeGardenCanvas";
import EnvelopeOpeningModal from "./components/EnvelopeOpeningModal";
import HeroSection from "./components/HeroSection";
import EventsSection from "./components/EventsSection";
import VenueSection from "./components/VenueSection";
import ShareSection from "./components/ShareSection";

export default function App() {
  const [config] = useState<WeddingConfig>(initialWeddingConfig);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(() => {
    // Allows ?autostart=1 to bypass envelope for headless tests or direct share links
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("autostart") === "1";
    }
    return false;
  });

  return (
    <div className="relative min-h-screen text-[#783C50] selection:bg-[#E8A6B5] selection:text-white felt-texture-bg overflow-x-hidden">
      {/* 3D Miniature Rose Garden (Three.js with wool roses, petals, fairy lights, clouds & butterfly) */}
      <ThreeGardenCanvas interactive={isEnvelopeOpen} />

      {/* STEP 1: Opening 3D Handcrafted Envelope Experience */}
      {!isEnvelopeOpen && (
        <EnvelopeOpeningModal
          config={config}
          isOpen={!isEnvelopeOpen}
          onOpenComplete={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Single-Page Continuous Immersive Invitation Flow (No Navbar) */}
      <div
        className={`relative z-10 transition-opacity duration-1000 ${
          isEnvelopeOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <main className="max-w-5xl mx-auto space-y-4 sm:space-y-8">
          {/* STEP 2: Main Invitation / Hero (Couple Names, Felt Portrait, Rose Arch) */}
          <HeroSection config={config} />

          {/* STEP 3: Two Event Cards (Reception & Marriage) */}
          <EventsSection config={config} />

          {/* STEP 4: Compact Venue Section ("Celebrate With Us") */}
          <VenueSection config={config} />

          {/* STEP 5: Final Invitation / Closing & Sharing */}
          <ShareSection config={config} />
        </main>
      </div>
    </div>
  );
}
