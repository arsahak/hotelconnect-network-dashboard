"use client";

import type { HotelInput } from "@/app/actions/hotel";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export const EMPTY_HOTEL: HotelInput = {
  name: "",
  city: "",
  region: "",
  address: "",
  description: "",
  bookingUrl: "",
  offer: "",
  featured: false,
  isActive: true,
  emails: { general: "", invoices: "", vacancies: "", faults: "", alerts: "" },
};

const EMAIL_TYPES = ["general", "invoices", "vacancies", "faults", "alerts"] as const;

/** Shared form for adding and editing a hotel (details, photo, emails, visibility). */
const HotelForm = ({
  initial = EMPTY_HOTEL,
  currentImage,
  onRemoveImage,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: HotelInput;
  currentImage?: string;
  onRemoveImage?: () => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: HotelInput, image: File | null) => void;
}) => {
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<HotelInput>(initial);
  const [image, setImage] = useState<File | null>(null);

  const set = <K extends keyof HotelInput>(key: K, value: HotelInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setEmail = (key: (typeof EMAIL_TYPES)[number], value: string) =>
    setForm((f) => ({ ...f, emails: { ...f.emails, [key]: value } }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, image);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.details")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="hotel-name" label={t("fields.name")} required className="md:col-span-2">
            <input id="hotel-name" required maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </Field>
          <Field id="hotel-city" label={t("fields.city")} required>
            <input id="hotel-city" required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
          </Field>
          <Field id="hotel-region" label={t("fields.region")} required>
            <select id="hotel-region" required value={form.region} onChange={(e) => set("region", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.regions ?? []).map((r) => (
                <option key={r} value={r}>
                  {optionLabel("regions", r)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="hotel-address" label={t("fields.address")} required className="md:col-span-2">
            <input id="hotel-address" required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Herengracht 120, 1015 BT Amsterdam" className={inputClass} />
          </Field>
          <Field id="hotel-description" label={t("fields.description")} hint={t("hints.description", { count: form.description.length })} className="md:col-span-2">
            <textarea id="hotel-description" rows={4} maxLength={1000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
          <Field id="hotel-booking" label={t("fields.bookingUrl")} hint={t("hints.bookingUrl")}>
            <input id="hotel-booking" type="url" value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="hotel-offer" label={t("fields.offer")} hint={t("hints.offer")}>
            <input id="hotel-offer" maxLength={60} value={form.offer} onChange={(e) => set("offer", e.target.value)} placeholder="15% off midweek" className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.photo")}</h2>
        <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={onRemoveImage} />
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.emails")}</h2>
        <p className="-mt-2 mb-4 text-xs text-gray-500">{t("hints.emails")}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {EMAIL_TYPES.map((key) => (
            <Field key={key} id={`hotel-email-${key}`} label={t(`emails.${key}`)} required={key === "general"}>
              <input
                id={`hotel-email-${key}`}
                type="email"
                required={key === "general"}
                value={form.emails[key] ?? ""}
                onChange={(e) => setEmail(key, e.target.value)}
                placeholder={key === "general" ? "info@hotel.nl" : t("hints.emailFallback")}
                className={inputClass}
              />
            </Field>
          ))}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.visibility")}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label={t("fields.isActive")} description={t("hints.isActive")} />
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label={t("fields.featured")} description={t("hints.featured")} />
        </div>
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

export default HotelForm;
