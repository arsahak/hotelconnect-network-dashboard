"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/app/actions/locale";
import { localeNames, locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/** EN | NL toggle. Saves the choice in a cookie and re-renders the page. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Language");
  const current = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const choose = (locale: Locale) => {
    if (locale === current) return;
    startTransition(async () => {
      await setLocaleAction(locale);
      router.refresh();
    });
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-lg border border-gray-200 bg-white p-0.5 transition-opacity",
        isPending && "opacity-60",
        className,
      )}
    >
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => choose(locale)}
          aria-pressed={locale === current}
          title={localeNames[locale]}
          disabled={isPending}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
            locale === current
              ? "bg-primary text-white"
              : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          {locale}
          <span className="sr-only"> – {localeNames[locale]}</span>
        </button>
      ))}
    </div>
  );
}
