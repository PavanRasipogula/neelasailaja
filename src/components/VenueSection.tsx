import { useState } from "react";
import { MapPin, Navigation, Sparkles, Copy, Check } from "lucide-react";
import { WeddingConfig } from "../config/weddingConfig";
import { copyToClipboard } from "../utils/weddingUtils";

interface VenueSectionProps {
  config: WeddingConfig;
}

export default function VenueSection({ config }: VenueSectionProps) {
  const [copied, setCopied] = useState(false);
  const hasValidMapUrl = Boolean(
    config.venue.googleMapsUrl && config.venue.googleMapsUrl.trim().length > 0
  );

  return (
    <section id="venue" className="relative py-16 px-4 max-w-3xl mx-auto z-10 text-center">
      {/* Subtle Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5EA] border border-[#D8B779]/60 text-[#783C50] text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#D8B779]" />
        <span>Location</span>
      </div>

      <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#783C50] tracking-tight mb-8">
        {config.venue.sectionTitle}
      </h2>

      {/* Compact 3D Miniature Venue Card */}
      <div className="relative rounded-3xl p-8 sm:p-10 felt-card border-2 border-dashed border-[#D8B779] shadow-xl bg-[#FFFDF8] max-w-xl mx-auto">
        {/* Corner Felt Roses */}
        <div className="absolute -top-3 -left-3 text-2xl select-none">🌹</div>
        <div className="absolute -top-3 -right-3 text-2xl select-none">🌸</div>

        {/* Small 3D Miniature Location Illustration */}
        <div className="relative w-18 h-18 mx-auto mb-4">
          <div className="w-18 h-18 rounded-full bg-[#FFF5EA] border-2 border-dashed border-[#D8B779] flex items-center justify-center shadow-md animate-bounce">
            <MapPin className="w-9 h-9 text-[#DE5D7C] fill-[#DE5D7C]/20" />
          </div>
          <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-xl select-none">
            🌹
          </span>
        </div>

        {/* Venue Title & Editable Address */}
        <h3 className="font-playfair text-2xl font-bold text-[#783C50] mb-2">
          {config.venue.name}
        </h3>
        <p className="text-sm sm:text-base text-[#9A5067] font-medium mb-6">
          {config.venue.address}
        </p>

        {/* Actions: Google Maps & Copy Address */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {hasValidMapUrl ? (
            <a
              href={config.venue.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="felt-button-primary px-7 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </a>
          ) : (
            <button
              disabled
              className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#FFF5EA] border border-[#D99AAA]/50 text-[#783C50]/60 inline-flex items-center gap-2 cursor-not-allowed shadow-inner"
            >
              <Navigation className="w-3.5 h-3.5 text-[#D99AAA]" />
              <span>Google Maps Link Coming Soon</span>
            </button>
          )}

          <button
            onClick={async () => {
              const success = await copyToClipboard(config.venue.address);
              if (success) {
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }
            }}
            className="px-5 py-3 rounded-full text-xs sm:text-sm font-semibold bg-white border border-[#D8B779] text-[#783C50] hover:bg-[#FFF5EA] transition-all inline-flex items-center gap-2 shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Address Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D8B779]" />
                <span>Copy Address</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
