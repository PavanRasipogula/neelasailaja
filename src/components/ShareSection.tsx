import { useState } from "react";
import { MessageCircle, Copy, Check, Volume2, VolumeX, Heart, Sparkles } from "lucide-react";
import { WeddingConfig } from "../config/weddingConfig";
import { buildWhatsAppShareMessage, copyToClipboard } from "../utils/weddingUtils";
import { musicPlayer } from "../utils/audioSynthesizer";

interface ShareSectionProps {
  config: WeddingConfig;
}

export default function ShareSection({ config }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(() => musicPlayer.getIsPlaying());

  const getShareUrl = () => {
    return typeof window !== "undefined" ? window.location.href : "https://blooming-love-invitation.app";
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const message = buildWhatsAppShareMessage(config, url);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleMusic = () => {
    const active = musicPlayer.toggle();
    setIsPlayingMusic(active);
  };

  return (
    <footer id="closing" className="relative py-20 px-4 max-w-4xl mx-auto z-10 text-center">
      {/* Handcrafted Wool Rose Blossom Row */}
      <div className="flex items-center justify-center gap-2 mb-6 text-2xl select-none animate-wool-float">
        <span>🌹</span>
        <span>🌸</span>
        <span className="w-8 h-8 rounded-full bg-[#FFF5EA] border border-dashed border-[#D8B779] flex items-center justify-center text-xs font-playfair font-bold text-[#783C50] shadow-xs">
          {config.couple.coupleMonogram}
        </span>
        <span>🌸</span>
        <span>🌹</span>
      </div>

      {/* Closing Card in Wool Felt Style */}
      <div className="relative rounded-3xl p-8 sm:p-12 felt-card-blush border-2 border-dashed border-[#E8A6B5] shadow-2xl max-w-2xl mx-auto">
        {/* Subtle Glowing Fairy Lights Background */}
        <div className="absolute top-2 left-6 text-xl select-none animate-pulse">✨</div>
        <div className="absolute bottom-3 right-6 text-xl select-none animate-pulse" style={{ animationDelay: "1.2s" }}>✨</div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E8A6B5]/60 text-[#783C50] text-xs uppercase tracking-widest font-semibold mb-4 shadow-xs">
          <Heart className="w-3.5 h-3.5 text-[#DE5D7C] fill-[#DE5D7C]" />
          <span>With Gratitude</span>
        </div>

        {/* Text requested */}
        <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#783C50] tracking-tight mb-3">
          "{config.closing.title}"
        </h2>

        <p className="font-serif-cormorant text-2xl sm:text-3xl text-[#9A5067] italic mb-8">
          {config.closing.signature}
        </p>

        {/* Action Controls: WhatsApp Share, Copy Link, and Music Control */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4 border-t border-dashed border-[#D99AAA]/40">
          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppShare}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-xs sm:text-sm font-semibold shadow-md hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label="Share invitation on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white shrink-0" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Copy Invitation Link Button */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#D8B779] text-[#783C50] text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#FFF5EA] transition-all cursor-pointer"
            aria-label="Copy invitation link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D8B779]" />
                <span>Copy Invitation Link</span>
              </>
            )}
          </button>

          {/* Small Music On/Off Control */}
          <button
            onClick={handleToggleMusic}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white border border-[#E8A6B5] text-[#783C50] text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#FFF5EA] transition-all cursor-pointer"
            aria-label={isPlayingMusic ? "Mute music" : "Play music"}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-4 h-4 text-[#DE5D7C]" />
                <span>Music: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-[#9A5067]" />
                <span>Music: Off</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle Copyright / Blessings tag */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#783C50]/60">
        <Sparkles className="w-3.5 h-3.5 text-[#D8B779]" />
        <span>Wedding Celebrations &bull; 18 &amp; 19 November 2026</span>
      </div>
    </footer>
  );
}
