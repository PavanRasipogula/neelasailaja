/**
 * Centralized Wedding Configuration
 * All wedding details, dates, couple information, venue, photos, and messages
 * are organized here for effortless customization.
 */

export interface EventDetail {
  id: string;
  badge: string;
  title: string;
  date: string;
  time: string;
  isoDate: string;
  durationHours: number;
  description: string;
  dressCode?: string;
  accentColor: string;
}

export interface WeddingConfig {
  couple: {
    groomName: string;
    brideName: string;
    groomFullName: string;
    brideFullName: string;
    coupleMonogram: string;
    tagline: string;
    invitationSubtitle: string;
    requestText: string;
    heroPhoto: string;
  };
  dates: {
    receptionDateStr: string;
    receptionTimeStr: string;
    marriageDateStr: string;
    marriageTimeStr: string;
    countdownTargetIso: string;
  };
  events: EventDetail[];
  venue: {
    sectionTitle: string;
    name: string;
    address: string;
    googleMapsUrl: string;
  };
  closing: {
    title: string;
    signature: string;
  };
  theme: {
    name: string;
    primaryRose: string;
    dustyPink: string;
    blushPink: string;
    cream: string;
    ivory: string;
    deepBurgundy: string;
    sageGreen: string;
    softGold: string;
  };
}

export const initialWeddingConfig: WeddingConfig = {
  couple: {
    groomName: "NeelaKumar",
    brideName: "Sailaja",
    groomFullName: "NeelaKumar",
    brideFullName: "Sailaja",
    coupleMonogram: "NS",
    tagline: "Two Hearts, One Beautiful Journey",
    invitationSubtitle: "Together with their families",
    requestText: "Request the pleasure of your presence at their wedding celebrations.",
    heroPhoto: "/assets/aistudio/IMG-20261102-WA0067.jpg_187917e1.jpeg",
  },
  dates: {
    receptionDateStr: "18 November 2026",
    receptionTimeStr: "6:00 PM onwards",
    marriageDateStr: "19 November 2026",
    marriageTimeStr: "Morning 4:45 AM to 5:45 AM",
    countdownTargetIso: "2026-11-19T04:45:00",
  },
  events: [
    {
      id: "reception",
      badge: "EVENT 01",
      title: "RECEPTION",
      date: "18 November 2026",
      time: "6:00 PM onwards",
      isoDate: "2026-11-18T18:00:00",
      durationHours: 4,
      description: "An evening of celebration, music, and welcoming the newlyweds.",
      dressCode: "Festive Formal",
      accentColor: "#E8A6B5",
    },
    {
      id: "marriage",
      badge: "EVENT 02",
      title: "MARRIAGE",
      date: "19 November 2026",
      time: "Morning 4:45 AM to 5:45 AM",
      isoDate: "2026-11-19T04:45:00",
      durationHours: 3,
      description: "The sacred wedding rituals, vows, and blessings under the floral mandap.",
      dressCode: "Traditional Attire",
      accentColor: "#D8B779",
    },
  ],
  venue: {
    sectionTitle: "Celebrate With Us",
    name: "GMR Puram, SR Puram",
    address: "893G+MG2 GMR PURAM, GMR puram village, 1-3, Ksheerasamudram post, SR Puram, Chittoor, AP 517167",
    googleMapsUrl: "https://share.google/DPkiSCm6Jw8k5sKyM",
  },
  closing: {
    title: "Your Presence Is Our Greatest Gift",
    signature: "With Love, NeelaKumar & Sailaja",
  },
  theme: {
    name: "A Blooming Love – Minimal 3D Rose Garden",
    primaryRose: "#E8A6B5",
    dustyPink: "#D99AAA",
    blushPink: "#F7DCE2",
    cream: "#FFF5EA",
    ivory: "#FFFDF8",
    deepBurgundy: "#783C50",
    sageGreen: "#A8B69A",
    softGold: "#D8B779",
  },
};
