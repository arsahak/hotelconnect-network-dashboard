/** Briefing: reminders go out 30 days before an end or expiry date. */
export const REMINDER_DAYS = 30;

/** "2027-03-01T00:00:00.000Z" → "2027-03-01" for <input type="date">. */
export function toDateInput(value?: string | null): string {
  return value ? value.slice(0, 10) : "";
}

/** Whole days from today until the date (negative = in the past). */
export function daysUntil(value: string): number {
  const date = new Date(value);
  const today = new Date();
  const a = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a - b) / 86_400_000);
}

export type DateStatus = "expired" | "soon" | "ok" | "none";

/** expired = passed, soon = within the reminder window, ok = later. */
export function dateStatus(value?: string | null): DateStatus {
  if (!value) return "none";
  const days = daysUntil(value);
  if (days < 0) return "expired";
  if (days <= REMINDER_DAYS) return "soon";
  return "ok";
}
