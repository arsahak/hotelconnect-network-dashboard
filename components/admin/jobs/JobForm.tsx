"use client";

import type { VacancyInput, VacancyStatus } from "@/app/actions/vacancy";
import { Field } from "@/components/shared/form/Field";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass, labelClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useHotelOptions } from "@/lib/useHotelOptions";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export const EMPTY_JOB: VacancyInput = {
  hotel: "",
  title: "",
  description: "",
  category: "",
  employmentType: "",
  urgent: false,
  status: "pending",
  applyEmail: "",
  applyWhatsapp: "",
};

const STATUSES: VacancyStatus[] = ["pending", "published", "closed"];

/** Shared form for adding and editing a job. */
const JobForm = ({
  initial = EMPTY_JOB,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: VacancyInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: VacancyInput) => void;
}) => {
  const t = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const hotels = useHotelOptions();
  const [form, setForm] = useState<VacancyInput>(initial);

  const set = <K extends keyof VacancyInput>(key: K, value: VacancyInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const hotel = hotels.find((h) => h._id === form.hotel);
  const defaultEmail = hotel ? hotel.emails.vacancies || hotel.emails.general : "";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.job")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="job-hotel" label={t("fields.hotel")} required hint={hotel ? t("hints.location", { city: hotel.city }) : undefined}>
            <select id="job-hotel" required value={form.hotel} onChange={(e) => set("hotel", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city}){h.isActive ? "" : ` – ${tc("inactive")}`}
                </option>
              ))}
            </select>
          </Field>
          <Field id="job-title" label={t("fields.title")} required>
            <input id="job-title" required maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Sous chef" className={inputClass} />
          </Field>
          <Field id="job-category" label={t("fields.category")} required>
            <select id="job-category" required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.vacancyCategories ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("vacancyCategories", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="job-type" label={t("fields.employmentType")} required>
            <select id="job-type" required value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.employmentTypes ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("employmentTypes", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="job-description" label={t("fields.description")} className="md:col-span-2">
            <textarea id="job-description" rows={8} maxLength={5000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <div className="mt-4">
          <Toggle checked={form.urgent} onChange={(v) => set("urgent", v)} label={t("fields.urgent")} description={t("hints.urgent")} />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.apply")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="job-email" label={t("fields.applyEmail")} hint={defaultEmail ? t("hints.applyEmail", { email: defaultEmail }) : t("hints.applyEmailNoHotel")}>
            <input id="job-email" type="email" value={form.applyEmail} onChange={(e) => set("applyEmail", e.target.value)} placeholder={defaultEmail} className={inputClass} />
          </Field>
          <Field id="job-whatsapp" label={t("fields.applyWhatsapp")} hint={t("hints.applyWhatsapp")}>
            <input id="job-whatsapp" inputMode="tel" value={form.applyWhatsapp} onChange={(e) => set("applyWhatsapp", e.target.value)} placeholder="31612345678" className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.status")}</h2>
        <fieldset>
          <legend className="sr-only">{tc("status")}</legend>
          <div className="grid gap-3 md:grid-cols-3">
            {STATUSES.map((status) => (
              <label
                key={status}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                  form.status === status ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
                )}
              >
                <input type="radio" name="status" checked={form.status === status} onChange={() => set("status", status)} className="mt-1 accent-[var(--color-primary)]" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{t(`statuses.${status}`)}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">{t(`statusHelp.${status}`)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className={cn(labelClass, "mt-4 normal-case tracking-normal text-gray-400")}>{t("hints.cv")}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Link href={cancelHref} className={outlineButtonClass}>
          {tc("cancel")}
        </Link>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? tc("saving") : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default JobForm;
