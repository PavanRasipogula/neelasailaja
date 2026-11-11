import { useState } from "react";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { WeddingConfig, EventDetail } from "../config/weddingConfig";

interface EventsSectionProps {
  config: WeddingConfig;
}

export default function EventsSection({ config }: EventsSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section id="events" className="relative py-16 px-4 max-w-5xl mx-auto z-10">
      {/* Subtle Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF5EA] border border-[#E8A6B5]/60 text-[#783C50] text-xs uppercase tracking-widest font-semibold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D8B779]" />
          <span>Celebrations</span>
        </div>
        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#783C50] tracking-tight">
          Wedding Events
        </h2>
      </div>

      {/* Two Elegant 3D Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {config.events.map((event: EventDetail) => {
          const isReception = event.id === "reception";
          const isHovered = hoveredCard === event.id;

          return (
            <div
              key={event.id}
              onMouseEnter={() => setHoveredCard(event.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative transition-all duration-500 perspective-1000 group"
            >
              {/* Outer Felt Card with Soft Cream Background & 3D Wool Roses */}
              <div
                className={`relative rounded-3xl p-7 sm:p-9 felt-card border-2 border-dashed transition-all duration-500 flex flex-col justify-between h-full bg-[#FFF5EA] ${
                  isReception ? "border-[#E8A6B5]" : "border-[#D8B779]"
                } ${isHovered ? "-translate-y-2 shadow-2xl scale-[1.01]" : "shadow-lg"}`}
                style={{
                  boxShadow: isHovered
                    ? `0 20px 35px -10px ${isReception ? "rgba(232, 166, 181, 0.45)" : "rgba(216, 183, 121, 0.4)"}`
                    : undefined,
                }}
              >
                {/* 3D Wool Rose Corner Decoration */}
                <div className="absolute -top-3.5 -right-3 text-3xl select-none group-hover:scale-110 transition-transform">
                  {isReception ? "🌹" : "🪷"}
                </div>

                {/* Event Badge */}
                <div className="mb-6 flex items-center justify-between">
                  <span
                    className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-xs"
                    style={{
                      background: isReception
                        ? "linear-gradient(135deg, #DE5D7C 0%, #E8A6B5 100%)"
                        : "linear-gradient(135deg, #D8B779 0%, #B8934C 100%)",
                    }}
                  >
                    {event.badge}
                  </span>

                  <span className="text-sm font-serif-cormorant italic text-[#783C50]/80">
                    {isReception ? "Evening of Music & Dinner" : "Traditional Muhurtham"}
                  </span>
                </div>

                {/* Event Title */}
                <div className="mb-6">
                  <h3 className="font-playfair text-3xl sm:text-4xl font-bold text-[#783C50] mb-4 tracking-tight">
                    {event.title}
                  </h3>

                  {/* Date & Time pill container */}
                  <div className="space-y-3 bg-[#FFFDF8] rounded-2xl p-4 border border-[#E8A6B5]/40 shadow-inner">
                    <div className="flex items-center gap-3 text-[#783C50]">
                      <div className="w-8 h-8 rounded-full bg-[#FFF5EA] flex items-center justify-center text-[#DE5D7C] shadow-xs shrink-0">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#9A5067] font-semibold block">
                          Date
                        </span>
                        <span className="font-bold text-base sm:text-lg">{event.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[#783C50]">
                      <div className="w-8 h-8 rounded-full bg-[#FFF5EA] flex items-center justify-center text-[#D8B779] shadow-xs shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#9A5067] font-semibold block">
                          Time
                        </span>
                        <span className="font-bold text-base sm:text-lg">{event.time}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle description & floral accent */}
                <div className="pt-4 border-t border-dashed border-[#D99AAA]/40 flex items-center justify-between text-xs text-[#783C50]/80">
                  <span>{event.description}</span>
                  <span className="text-base">🌸</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
