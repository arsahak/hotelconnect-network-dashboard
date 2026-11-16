"use client";

import { getMyProgressAction, type HotelProgress } from "@/app/actions/myHotel";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiCheck, BiChevronRight } from "react-icons/bi";

const STEPS: { key: keyof HotelProgress["steps"]; href: string }[] = [
  { key: "details", href: "/hotel/my-hotel" },
  { key: "spaces", href: "/hotel/my-hotel" },
  { key: "contract", href: "/hotel/contracts/add" },
  { key: "published", href: "/hotel/my-hotel" },
];

/**
 * Onboarding progress bar on the hotel start page (Master Briefing v4):
 * 25% details · 50% rooms + staff · 75% first contract (unlocks Tenders & Jobs)
 * · 100% photo + booking URL (listed in the Hotels directory). Hidden at 100%.
 */
export function OnboardingProgress() {
  const t = useTranslations("Progress");
  const { data } = useApiData(getMyProgressAction, undefined);
  if (!data || data.percent >= 100) return null;

  return (
    <section aria-labelledby="progress-title" className="rounded border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="progress-title" className="font-display text-xl text-gray-950">
          {t("title")}
        </h2>
        <span className="text-sm font-semibold text-brass-600">{t("percent", { percent: data.percent })}</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby="progress-title"
        aria-valuenow={data.percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-gray-100"
      >
        <div className="h-full rounded-full bg-brass-500 transition-[width] duration-700" style={{ width: `${data.percent}%` }} />
      </div>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step, i) => {
          const done = data.steps[step.key];
          return (
            <li key={step.key}>
              <Link
                href={step.href}
                className={cn(
                  "group flex h-full items-start gap-3 rounded border p-3 text-sm transition-colors",
                  done ? "border-moss-100 bg-moss-100/40" : "border-gray-200 hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    done ? "bg-moss-600 text-white" : "bg-gray-100 text-gray-600",
                  )}
                >
                  {done ? <BiCheck size={16} /> : (i + 1) * 25}
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-gray-900">{t(`steps.${step.key}.title`)}</span>
                  <span className="block text-xs text-gray-500">{t(`steps.${step.key}.text`)}</span>
                </span>
                {!done && <BiChevronRight size={18} className="mt-0.5 text-gray-400 transition-transform group-hover:translate-x-0.5" />}
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
