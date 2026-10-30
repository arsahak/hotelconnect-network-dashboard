"use client";

import { getMySupplierAction, type MySupplier } from "@/app/actions/mySupplier";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

const STEPS: { key: string; done: (s: MySupplier) => boolean }[] = [
  { key: "logo", done: (s) => Boolean(s.logo) },
  { key: "tagline", done: (s) => Boolean(s.tagline?.trim()) },
  { key: "description", done: (s) => (s.description?.split(/\s+/).filter(Boolean).length ?? 0) >= 20 },
  { key: "work", done: (s) => s.categories.length > 0 && s.regions.length > 0 },
  { key: "website", done: (s) => Boolean(s.website) },
  { key: "emails", done: (s) => Boolean(s.emails?.notifications || s.emails?.invoices) },
];

/**
 * Supplier onboarding (briefing §4.2): after the first sign-in the supplier
 * completes the profile. This card shows what is still missing and disappears
 * once everything is filled in.
 */
export function ProfileChecklist() {
  const t = useTranslations("SupplierHome.checklist");
  const { data: supplier } = useApiData(getMySupplierAction, undefined);
  if (!supplier) return null;

  const steps = STEPS.map((step) => ({ ...step, ok: step.done(supplier) }));
  const done = steps.filter((s) => s.ok).length;
  if (done === steps.length) return null;

  return (
    <section className="rounded border border-brass-400/50 bg-brass-100/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-ink-950">{t("title")}</h2>
          <p className="mt-1 text-sm text-ink-700">{t("intro")}</p>
        </div>
        <Link href="/supplier/profile" className={primaryButtonClass}>
          {t("cta")}
        </Link>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-brass-500 transition-all" style={{ width: `${Math.round((done / steps.length) * 100)}%` }} />
      </div>
      <p className="mt-1.5 text-xs text-ink-500">{t("progress", { done, total: steps.length })}</p>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {steps.map((step) => (
          <li key={step.key} className={cn("flex items-center gap-2 text-sm", step.ok ? "text-gray-500 line-through" : "text-ink-900")}>
            {step.ok ? <BiCheckCircle size={18} className="shrink-0 text-moss-600" /> : <BiCircle size={18} className="shrink-0 text-brass-500" />}
            {t(`steps.${step.key}`)}
          </li>
        ))}
      </ul>
    </section>
  );
}
