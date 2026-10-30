"use client";

import type { MyVoucher, MyVoucherInput } from "@/app/actions/myVoucher";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const EMPTY_HOTEL_VOUCHER: MyVoucherInput = { title: "", teaser: "", description: "", discountPercent: 10, category: "", bookingUrl: "", isActive: true };

export const hotelVoucherToInput = (v: MyVoucher): MyVoucherInput => ({
  title: v.title,
  teaser: v.teaser,
  description: v.description,
  discountPercent: v.discountPercent,
  category: v.category,
  bookingUrl: v.bookingUrl,
  isActive: v.isActive,
});

/** Voucher form for the hotel (briefing §3.10): photo, title, description, discount (required), booking link. */
const HotelVoucherForm = ({
  initial = EMPTY_HOTEL_VOUCHER,
  currentImage,
  onRemoveImage,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: MyVoucherInput;
  currentImage?: string;
  onRemoveImage?: () => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: MyVoucherInput, image: File | null) => void;
}) => {
  const t = useTranslations("Vouchers");
  const th = useTranslations("HotelVouchers");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<MyVoucherInput>(initial);
  const [image, setImage] = useState<File | null>(null);
  const set = <K extends keyof MyVoucherInput>(key: K, value: MyVoucherInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, image);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="hv-title" label={t("fields.title")} required className="md:col-span-2">
            <input id="hv-title" required minLength={2} maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={th("placeholders.title")} className={inputClass} />
          </Field>
          <Field id="hv-category" label={t("fields.category")} required>
            <select id="hv-category" required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.voucherCategories ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("voucherCategories", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="hv-discount" label={t("fields.discountPercent")} required hint={t("hints.discount")}>
            <div className="relative">
              <input id="hv-discount" type="number" required min={1} max={100} step={1} value={form.discountPercent} onChange={(e) => set("discountPercent", Number(e.target.value))} className={`${inputClass} pr-8`} />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">%</span>
            </div>
          </Field>
          <Field id="hv-teaser" label={t("fields.teaser")} hint={t("hints.teaser")} className="md:col-span-2">
            <input id="hv-teaser" maxLength={200} value={form.teaser} onChange={(e) => set("teaser", e.target.value)} className={inputClass} />
          </Field>
          <Field id="hv-description" label={t("fields.description")} hint={t("hints.description")} className="md:col-span-2">
            <textarea id="hv-description" rows={5} maxLength={2000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
          <Field id="hv-booking" label={t("fields.bookingUrl")} required hint={th("hints.bookingUrl")} className="md:col-span-2">
            <input id="hv-booking" type="url" required value={form.bookingUrl} onChange={(e) => set("bookingUrl", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label={t("fields.isActive")} description={t("hints.isActive")} />
          </div>
        </div>
      </div>
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{th("photo")}</h2>
        <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={onRemoveImage} />
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} />
    </form>
  );
};

export default HotelVoucherForm;
