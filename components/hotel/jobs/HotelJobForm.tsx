"use client";

import type { MyVacancy, MyVacancyInput, VacancyStyle } from "@/app/actions/myVacancy";
import { Field } from "@/components/shared/form/Field";
import { SimpleRichText, textLength } from "@/components/shared/form/SimpleRichText";
import { FormActions } from "@/components/shared/form/FormActions";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiDetail, BiImage } from "react-icons/bi";
import { useJobsBase } from "./useJobsBase";

export const EMPTY_HOTEL_JOB: MyVacancyInput = {
  title: "",
  description: "",
  category: "",
  employmentType: "",
  hours: "",
  urgent: false,
  style: "traditional",
  videoUrl: "",
  applyEmail: "",
  applyWhatsapp: "",
};

export const hotelJobToInput = (v: MyVacancy): MyVacancyInput => ({
  city: v.city,
  region: v.region,
  title: v.title,
  description: v.description,
  category: v.category,
  employmentType: v.employmentType,
  hours: v.hours ?? "",
  urgent: v.urgent,
  style: v.style ?? "traditional",
  videoUrl: v.videoUrl ?? "",
  applyEmail: v.applyEmail,
  applyWhatsapp: v.applyWhatsapp ?? "",
});

/** Master Briefing v4: the job text is at most 2000 characters. */
const DESCRIPTION_MAX = 2000;

const STYLES: { value: VacancyStyle; icon: typeof BiDetail }[] = [
  { value: "traditional", icon: BiDetail },
  { value: "visual", icon: BiImage },
];

/**
 * Job form (briefing §3.7) for hotels and suppliers with a maintenance
 * contract: title, description, category, type and the style — visual
 * (photo/video, WhatsApp first) or traditional. Suppliers also say where the
 * job is and pick a category from the five main groups.
 */
const HotelJobForm = ({
  initial = EMPTY_HOTEL_JOB,
  currentImage,
  onRemoveImage,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: MyVacancyInput;
  currentImage?: string;
  onRemoveImage?: () => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: MyVacancyInput, image: File | null) => void;
}) => {
  const t = useTranslations("HotelJobs");
  const tj = useTranslations("Jobs");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<MyVacancyInput>(initial);
  const [image, setImage] = useState<File | null>(null);
  const set = <K extends keyof MyVacancyInput>(key: K, value: MyVacancyInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const { supplier } = useJobsBase();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, form.style === "visual" ? image : null);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="hj-title" label={tj("fields.title")} required className="md:col-span-2">
            <input id="hj-title" required minLength={2} maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t("placeholders.title")} className={inputClass} />
          </Field>
          <Field id="hj-category" label={tj("fields.category")} required>
            <select id="hj-category" required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {supplier
                ? Object.entries(options?.supplierVacancyGroups ?? {}).map(([group, subs]) => (
                    <optgroup key={group} label={optionLabel("vacancyCategories", group)}>
                      {subs.map((c) => (
                        <option key={c} value={c}>
                          {optionLabel("vacancyCategories", c)}
                        </option>
                      ))}
                    </optgroup>
                  ))
                : (options?.vacancyCategories ?? []).map((c) => (
                    <option key={c} value={c}>
                      {optionLabel("vacancyCategories", c)}
                    </option>
                  ))}
            </select>
          </Field>
          <Field id="hj-type" label={tj("fields.employmentType")} required>
            <select id="hj-type" required value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.employmentTypes ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("employmentTypes", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="hj-hours" label={t("fields.hours")} hint={t("hints.hours")}>
            <input id="hj-hours" maxLength={60} value={form.hours ?? ""} onChange={(e) => set("hours", e.target.value)} placeholder={t("placeholders.hours")} className={inputClass} />
          </Field>
          {supplier && (
            <>
              <Field id="hj-city" label={tj("fields.city")} required>
                <input id="hj-city" required minLength={2} maxLength={80} value={form.city ?? ""} onChange={(e) => set("city", e.target.value)} className={inputClass} />
              </Field>
              <Field id="hj-region" label={tj("fields.region")} required>
                <select id="hj-region" required value={form.region ?? ""} onChange={(e) => set("region", e.target.value)} className={inputClass}>
                  <option value="">{tc("choose")}</option>
                  {(options?.regions ?? []).map((r) => (
                    <option key={r} value={r}>
                      {optionLabel("regions", r)}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <Field id="hj-description" label={tj("fields.description")} className="md:col-span-2">
            <SimpleRichText id="hj-description" value={form.description} onChange={(html) => set("description", html)} max={DESCRIPTION_MAX} placeholder={t("placeholders.description")} />
          </Field>
          <div className="md:col-span-2">
            <Toggle checked={form.urgent} onChange={(v) => set("urgent", v)} label={tj("fields.urgent")} description={tj("hints.urgent")} />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("style.title")}</h2>
        <div role="radiogroup" className="grid gap-3 md:grid-cols-2">
          {STYLES.map(({ value, icon: Icon }) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={form.style === value}
              onClick={() => set("style", value)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition-colors",
                form.style === value ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
              )}
            >
              <Icon size={22} className={form.style === value ? "text-primary-dark" : "text-gray-400"} />
              <span>
                <span className="block text-sm font-medium text-gray-900">{t(`style.${value}`)}</span>
                <span className="mt-0.5 block text-xs text-gray-500">{t(`style.${value}Hint`)}</span>
              </span>
            </button>
          ))}
        </div>
        {form.style === "visual" && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">{t("fields.photo")}</p>
              <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={onRemoveImage} />
            </div>
            <Field id="hj-video" label={t("fields.video")} hint={t("hints.video")}>
              <input id="hj-video" type="url" value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" className={inputClass} />
            </Field>
          </div>
        )}
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("applying")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="hj-whatsapp" label={tj("fields.applyWhatsapp")} hint={tj("hints.applyWhatsapp")}>
            <input id="hj-whatsapp" inputMode="tel" value={form.applyWhatsapp} onChange={(e) => set("applyWhatsapp", e.target.value)} placeholder="31612345678" className={inputClass} />
          </Field>
          <Field id="hj-email" label={tj("fields.applyEmail")} hint={t("hints.applyEmail")}>
            <input id="hj-email" type="email" value={form.applyEmail} onChange={(e) => set("applyEmail", e.target.value)} className={inputClass} />
          </Field>
        </div>
        <p className="mt-4 text-xs text-gray-500">{tj("hints.cv")}</p>
      </div>

      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} disabled={textLength(form.description) > DESCRIPTION_MAX} />
    </form>
  );
};

export default HotelJobForm;
