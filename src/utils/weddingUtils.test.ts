import test from "node:test";
import assert from "node:assert/strict";
import { calculateCountdown, buildWhatsAppShareMessage, buildGoogleCalendarUrl } from "./weddingUtils";
import { initialWeddingConfig } from "../config/weddingConfig";

test("calculateCountdown returns correct days, hours, minutes and seconds for future date", () => {
  const futureIso = "2026-11-19T10:00:00Z";
  // Simulated current time: exactly 2 days, 3 hours, 15 minutes, 30 seconds before
  const simulatedNow = new Date("2026-11-17T06:44:30Z");
  
  const result = calculateCountdown(futureIso, simulatedNow);
  assert.equal(result.isComplete, false);
  assert.equal(result.days, 2);
  assert.equal(result.hours, 3);
  assert.equal(result.minutes, 15);
  assert.equal(result.seconds, 30);
});

test("calculateCountdown handles past dates gracefully", () => {
  const pastIso = "2020-01-01T00:00:00Z";
  const now = new Date("2026-11-10T00:00:00Z");
  
  const result = calculateCountdown(pastIso, now);
  assert.equal(result.isComplete, true);
  assert.equal(result.days, 0);
  assert.equal(result.hours, 0);
  assert.equal(result.minutes, 0);
  assert.equal(result.seconds, 0);
});

test("buildWhatsAppShareMessage includes bride & groom names and event dates", () => {
  const url = "https://example.com/invitation";
  const message = buildWhatsAppShareMessage(initialWeddingConfig, url);
  
  assert.ok(message.includes("NeelaKumar"));
  assert.ok(message.includes("Sailaja"));
  assert.ok(message.includes("18 November 2026"));
  assert.ok(message.includes("19 November 2026"));
  assert.ok(message.includes(url));
});

test("buildGoogleCalendarUrl builds valid URL with title and location", () => {
  const event = initialWeddingConfig.events[0];
  const url = buildGoogleCalendarUrl(event, "Bangalore Palace Grounds");
  
  assert.ok(url.startsWith("https://calendar.google.com/calendar/render?"));
  assert.ok(url.includes("action=TEMPLATE"));
  assert.ok(url.toUpperCase().includes("RECEPTION"));
});
