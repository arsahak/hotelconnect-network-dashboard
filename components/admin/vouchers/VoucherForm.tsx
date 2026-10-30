"use client";

import type { VoucherInput } from "@/app/actions/voucher";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useHotelOptions } from "@/lib/useHotelOptions";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export const EMPTY_VOUCHER: VoucherInput = {
  hotel: "",
  title: "",
  teaser: "",
  description: "",
  discountPercent: 10,
  category: "",
  bookingUrl: "",
  isActive: true,
  promotedUntil: "",
};

/** Shared form for adding and editing a voucher. */
const VoucherForm = ({
  initial = EMPTY_VOUCHER,
  currentImage,
  onRemoveImage,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: VoucherInput;
  currentImage?: string;
  onRemoveImage?: () => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: VoucherInput, image: File | null) => void;
}) => {
  const t = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const hotels = useHotelOptions();
  const [form, setForm] = useState<VoucherInput>(initial);
  const [image, setImage] = useState<File | null>(null);

  const set = <K extends keyof VoucherInput>(key: K, value: VoucherInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, image);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.deal")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="voucher-hotel" label={t("fields.hotel")} required>
            <select id="voucher-hotel" required value={form.hotel} onChange={(e) => set("hotel", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </Field>
          <Field id="voucher-title" label={t("fields.title")} required>
            <input id="voucher-title" required maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Meeting day package" className={inputClass} />
          </Field>
          <Field id="voucher-category" label={t("fields.category")} required>
            <select id="voucher-category" required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.voucherCategories ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("voucherCategories", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="voucher-discount" label={t("fields.discountPercent")} required hint={t("hints.discount")}>
            <div className="relative">
              <input
                id="voucher-discount"
                type="number"
                required
                min={1}
                max={100}
                value={form.discountPercent}
                onChange={(e) => set("discountPercent", Number(e.target.value))}
                className={`${inputClass} pr-8`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
            </div>
          </Field>
          <Field id="voucher-teaser" label={t("fields.teaser")} hint={t("hints.teaser")} className="md:col-span-2">
            <input id="voucher-teaser" maxLength={200} value={form.teaser} onChange={(e) => set("teaser", e.target.value)} className={inputClass} />
          </Field>
          <Field id="voucher-description" label={t("fields.description")} hint={t("hints.description")} className="md:col-span-2">
            <textarea id="voucher-description" rows={4} maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
          <Field id="voucher-booking" label={t("fields.bookingUrl")} required hint={t("hints.bookingUrl")} className="md:col-span-2">
            <input id="voucher-booking" type="url" required value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.photo")}</h2>
        <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={onRemoveImage} />
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.visibility")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label={t("fields.isActive")} description={t("hints.isActive")} />
          <Field id="voucher-promoted" label={t("fields.promotedUntil")} hint={t("hints.promotedUntil")}>
            <div className="flex gap-2">
              <input id="voucher-promoted" type="date" value={form.promotedUntil} onChange={(e) => set("promotedUntil", e.target.value)} className={inputClass} />
              {form.promotedUntil && (
                <button type="button" onClick={() => set("promotedUntil", "")} className={outlineButtonClass}>
                  {tc("clear")}
                </button>
              )}
            </div>
          </Field>
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

export default VoucherForm;
