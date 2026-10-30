// The dashboard speaks English and Dutch. English is the default; the chosen
// language is kept in a cookie, so the URL stays the same in both languages.
export const locales = ["en", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "hc-locale";

export const localeNames: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
