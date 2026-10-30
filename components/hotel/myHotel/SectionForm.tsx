"use client";

import type { ReactNode } from "react";
import { cardClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";

/**
 * Card with a title, a form and a footer: used by every My hotel section,
 * both on the My hotel page and in the onboarding steps.
 */
export function SectionForm({
  title,
  description,
  children,
  submitting,
  submitLabel,
  secondary,
  onSubmit,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  submitting: boolean;
  submitLabel?: string;
  /** Left of the save button (e.g. "Back" in the onboarding). */
  secondary?: ReactNode;
  onSubmit: () => void;
}) {
  const tc = useTranslations("Common");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className={cardClass}
    >
      <h2 className="font-display text-2xl text-gray-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      <div className="mt-6">{children}</div>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <div>{secondary}</div>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? tc("saving") : (submitLabel ?? tc("saveChanges"))}
        </button>
      </div>
    </form>
  );
}

/** Shared save helper: calls the action, shows a toast, returns the saved hotel. */
export async function saveSection<T>(
  run: () => Promise<{ ok: boolean; data?: T | null; error?: string }>,
  messages: { success?: string; error: string },
  toastApi: { success: (m: string) => void; error: (m: string) => void },
): Promise<T | null> {
  const res = await run();
  if (res.ok && res.data) {
    if (messages.success) toastApi.success(messages.success);
    return res.data;
  }
  toastApi.error(res.error || messages.error);
  return null;
}
