"use client";

import type { Permit, PermitInput } from "@/app/actions/permit";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

export const EMPTY_PERMIT: PermitInput = { type: "", authority: "", issueDate: "", expiryDate: "", reminderDays: 30, documentLink: "", notes: "" };

/** Reminder lead times in days (same list as the API). */
const LEAD_TIMES = [7, 14, 30, 60, 90] as const;

export const permitToInput = (p: Permit): PermitInput => ({
  type: p.type,
  authority: p.authority,
  issueDate: p.issueDate?.slice(0, 10) ?? "",
  expiryDate: p.expiryDate?.slice(0, 10) ?? "",
  reminderDays: p.reminderDays ?? 30,
  documentLink: p.documentLink,
  notes: p.notes,
});

/**
 * Permits and certificates. Master Briefing v4: three fields — name, expiry
 * date and reminder lead time; the older optional fields sit under "More details".
 */
const PermitForm = ({
  initial = EMPTY_PERMIT,
  submitting,
  submitLabel,
  cancelHref,
  onCancel,
  onSubmit,
  compact = false,
}: {
  initial?: PermitInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  onSubmit: (data: PermitInput) => void;
  compact?: boolean;
}) => {
  const t = useTranslations("Permits");
  const [form, setForm] = useState<PermitInput>(initial);
  const set = <K extends keyof PermitInput>(key: K, value: PermitInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const id = (name: string) => `permit-${name}${compact ? "-modal" : ""}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-6"
    >
      {!compact && (
        <div className="flex gap-3 rounded border border-brass-400/40 bg-brass-100/60 p-4 text-sm text-ink-700">
          <BiInfoCircle size={20} className="mt-0.5 shrink-0 text-brass-600" />
          <p>{t("explanation")}</p>
        </div>
      )}
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field id={id("type")} label={t("fields.name")} required className="md:col-span-3">
            <input id={id("type")} required minLength={2} maxLength={120} value={form.type} onChange={(e) => set("type", e.target.value)} placeholder={t("placeholders.type")} className={inputClass} />
          </Field>
          <Field id={id("expiry")} label={t("fields.expiryDate")} className="md:col-span-2">
            <input id={id("expiry")} type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("lead")} label={t("fields.reminderDays")} hint={t("hints.reminderDays")}>
            <select id={id("lead")} value={form.reminderDays} onChange={(e) => set("reminderDays", Number(e.target.value))} className={inputClass}>
              {LEAD_TIMES.map((days) => (
                <option key={days} value={days}>
                  {t(`lead.${days}`)}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <details className={`${cardClass} group`}>
        <summary className="cursor-pointer list-none text-sm font-medium text-gray-700 marker:hidden">
          <span className="inline-flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90">›</span>
            {t("moreDetails")}
          </span>
        </summary>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id={id("authority")} label={t("fields.authority")} className="md:col-span-2">
            <input id={id("authority")} maxLength={120} value={form.authority} onChange={(e) => set("authority", e.target.value)} placeholder={t("placeholders.authority")} className={inputClass} />
          </Field>
          <Field id={id("issue")} label={t("fields.issueDate")}>
            <input id={id("issue")} type="date" value={form.issueDate} onChange={(e) => set("issueDate", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("link")} label={t("fields.documentLink")} hint={t("hints.documentLink")}>
            <input id={id("link")} type="url" value={form.documentLink} onChange={(e) => set("documentLink", e.target.value)} placeholder="https://drive.google.com/…" className={inputClass} />
          </Field>
          <Field id={id("notes")} label={t("fields.notes")} className="md:col-span-2">
            <textarea id={id("notes")} rows={3} maxLength={2000} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </details>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} onCancel={onCancel} />
    </form>
  );
};

export default PermitForm;
