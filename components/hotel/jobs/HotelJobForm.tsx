"use client";

import type { MyVacancy, MyVacancyInput, VacancyStyle } from "@/app/actions/myVacancy";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiDetail, BiImage } from "react-icons/bi";

export const EMPTY_HOTEL_JOB: MyVacancyInput = {
  title: "",
  description: "",
  category: "",
  employmentType: "",
  urgent: false,
  style: "traditional",
  videoUrl: "",
  applyEmail: "",
  applyWhatsapp: "",
};

export const hotelJobToInput = (v: MyVacancy): MyVacancyInput => ({
  title: v.title,
  description: v.description,
  category: v.category,
  employmentType: v.employmentType,
  urgent: v.urgent,
  style: v.style ?? "traditional",
  videoUrl: v.videoUrl ?? "",
  applyEmail: v.applyEmail,
  applyWhatsapp: v.applyWhatsapp ?? "",
});

const STYLES: { value: VacancyStyle; icon: typeof BiDetail }[] = [
  { value: "traditional", icon: BiDetail },
  { value: "visual", icon: BiImage },
];

/**
 * Job form for the hotel (briefing §3.7): title, description, category, type
 * and the style — visual (photo/video, WhatsApp first) or traditional.
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
              {(options?.vacancyCategories ?? []).map((c) => (
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
          <Field id="hj-description" label={tj("fields.description")} className="md:col-span-2">
            <textarea id="hj-description" rows={7} maxLength={5000} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t("placeholders.description")} className={inputClass} />
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

      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} />
    </form>
  );
};

export default HotelJobForm;
