"use client";

import { updateMyHotelAction, type EmailType, type MyHotel } from "@/app/actions/myHotel";
import { inputClass } from "@/components/shared/form-styles";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { saveSection, SectionForm } from "./SectionForm";

const TYPES: EmailType[] = ["general", "invoices", "vacancies", "faults", "alerts"];

/**
 * Onboarding step 7 / My hotel: which address gets which email, and which
 * emails the hotel wants at all (briefing §3.12).
 */
export function EmailsSection({
  hotel,
  onSaved,
  submitLabel,
  secondary,
  quiet,
}: {
  hotel: MyHotel;
  onSaved: (hotel: MyHotel) => void;
  submitLabel?: string;
  secondary?: ReactNode;
  quiet?: boolean;
}) {
  const t = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const [emails, setEmails] = useState<Record<EmailType, string>>({
    general: hotel.emails.general,
    invoices: hotel.emails.invoices ?? "",
    vacancies: hotel.emails.vacancies ?? "",
    faults: hotel.emails.faults ?? "",
    alerts: hotel.emails.alerts ?? "",
  });
  const [notify, setNotify] = useState<Record<EmailType, boolean>>({ ...hotel.notify });
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    setSubmitting(true);
    const saved = await saveSection(() => updateMyHotelAction({ emails: emails, notify: { ...notify, general: true } }), { success: quiet ? undefined : t("saved"), error: tc("error") }, toast);
    setSubmitting(false);
    if (saved) onSaved(saved);
  };

  return (
    <SectionForm title={t("emails.title")} description={t("emails.description")} submitting={submitting} submitLabel={submitLabel} secondary={secondary} onSubmit={submit}>
      <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
        {TYPES.map((type) => {
          const required = type === "general";
          const on = required || notify[type];
          return (
            <div key={type} className="grid gap-3 p-4 md:grid-cols-[14rem_1fr_auto] md:items-center">
              <div>
                <label htmlFor={`email-${type}`} className="block text-sm font-medium text-gray-900">
                  {t(`emails.types.${type}`)}
                  {required && <span className="ml-0.5 text-ember-600">*</span>}
                </label>
                <p className="text-xs text-gray-500">{t(`emails.hints.${type}`)}</p>
              </div>
              <input
                id={`email-${type}`}
                type="email"
                required={required}
                disabled={!on}
                value={emails[type]}
                onChange={(e) => setEmails((v) => ({ ...v, [type]: e.target.value }))}
                placeholder={required ? "info@hotel.nl" : t("emails.fallback", { email: emails.general || "info@hotel.nl" })}
                className={cn(inputClass, !on && "opacity-50")}
              />
              <label className={cn("flex items-center gap-2 text-xs text-gray-600", required && "invisible")}>
                <input type="checkbox" checked={on} disabled={required} onChange={(e) => setNotify((n) => ({ ...n, [type]: e.target.checked }))} className="h-4 w-4 accent-[var(--color-primary)]" />
                {t("emails.receive")}
              </label>
            </div>
          );
        })}
      </div>
    </SectionForm>
  );
}
