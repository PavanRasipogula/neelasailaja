import { WeddingConfig, EventDetail } from "../config/weddingConfig";

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  totalSeconds: number;
}

/**
 * Calculates remaining days, hours, minutes, seconds from target ISO date
 */
export function calculateCountdown(targetIsoDate: string, currentDate?: Date): CountdownResult {
  const target = new Date(targetIsoDate).getTime();
  const now = currentDate ? currentDate.getTime() : Date.now();
  const diff = target - now;

  if (isNaN(target) || diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true,
      totalSeconds: 0,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: false,
    totalSeconds,
  };
}

/**
 * Builds the exact WhatsApp share message as specified in master prompt
 */
export function buildWhatsAppShareMessage(config: WeddingConfig, currentUrl: string): string {
  const receptionEvent = config.events.find(e => e.id === "reception");
  const marriageEvent = config.events.find(e => e.id === "marriage");

  const receptionInfo = receptionEvent
    ? `💐 Reception: ${receptionEvent.date} | ${receptionEvent.time}`
    : `💐 Reception: ${config.dates.receptionDateStr} | ${config.dates.receptionTimeStr}`;

  const marriageInfo = marriageEvent
    ? `💍 Marriage: ${marriageEvent.date} | ${marriageEvent.time}`
    : `💍 Marriage: ${config.dates.marriageDateStr} | ${config.dates.marriageTimeStr}`;

  const message = `🌹 You're Invited!

Join us in celebrating the wedding festivities of ${config.couple.groomName} & ${config.couple.brideName}.

${receptionInfo}
${marriageInfo}

Your presence will make our celebration even more special.

Invitation: ${currentUrl}`;

  return message;
}

/**
 * Generates direct Google Calendar add event URL
 */
export function buildGoogleCalendarUrl(event: EventDetail, venueAddress: string): string {
  try {
    const startDate = new Date(event.isoDate);
    if (isNaN(startDate.getTime())) {
      return "https://calendar.google.com/calendar/render";
    }

    const durationMs = (event.durationHours || 4) * 60 * 60 * 1000;
    const endDate = new Date(startDate.getTime() + durationMs);

    const toGCalIso = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const datesParam = `${toGCalIso(startDate)}/${toGCalIso(endDate)}`;

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `${event.title} – Neelakumar & Meghana Wedding`,
      dates: datesParam,
      details: `${event.description}\n\nDress Code: ${event.dressCode}`,
      location: venueAddress,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return "https://calendar.google.com/calendar/render";
  }
}

/**
 * Copies text safely to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  // Fallback for older browsers / iframe restrictions
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch {
    return false;
  }
}
