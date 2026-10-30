"use client";

import type { SupplierInput } from "@/app/actions/supplier";
import { ChipSelect } from "@/components/shared/form/ChipSelect";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass, labelClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

export const EMPTY_SUPPLIER: SupplierInput = {
  name: "",
  tagline: "",
  description: "",
  categories: [],
  regions: [],
  website: "",
  plan: "commission",
  kvkNumber: "",
  featured: false,
  showInPurchasing: false,
  isActive: true,
  contact: { person: "", email: "", phone: "" },
};

const MAX_WORDS = 200;
const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

export interface SupplierPictures {
  logo: File | null;
  image: File | null;
}

/** Shared form for adding and editing a supplier. */
const SupplierForm = ({
  initial = EMPTY_SUPPLIER,
  current,
  onRemovePicture,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: SupplierInput;
  current?: { logo?: string; image?: string };
  onRemovePicture?: (picture: "logo" | "image") => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: SupplierInput, pictures: SupplierPictures) => void;
}) => {
  const t = useTranslations("Suppliers");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<SupplierInput>(initial);
  const [pictures, setPictures] = useState<SupplierPictures>({ logo: null, image: null });

  const set = <K extends keyof SupplierInput>(key: K, value: SupplierInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setContact = (key: "person" | "email" | "phone", value: string) =>
    setForm((f) => ({ ...f, contact: { ...f.contact, [key]: value } }));

  const words = countWords(form.description);
  const tooLong = words > MAX_WORDS;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!tooLong) onSubmit(form, pictures);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.profile")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="supplier-name" label={t("fields.name")} required>
            <input id="supplier-name" required maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </Field>
          <Field id="supplier-website" label={t("fields.website")}>
            <input id="supplier-website" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="supplier-plan" label={t("fields.plan")} hint={t("hints.plan")}>
            <select id="supplier-plan" value={form.plan} onChange={(e) => set("plan", e.target.value as SupplierInput["plan"])} className={inputClass}>
              <option value="commission">{t("plans.commission")}</option>
              <option value="contract">{t("plans.contract")}</option>
            </select>
          </Field>
          <Field id="supplier-kvk" label="KVK">
            <input id="supplier-kvk" inputMode="numeric" maxLength={10} value={form.kvkNumber} onChange={(e) => set("kvkNumber", e.target.value)} placeholder="12345678" className={inputClass} />
          </Field>
          <Field id="supplier-tagline" label={t("fields.tagline")} hint={t("hints.tagline")} className="md:col-span-2">
            <input id="supplier-tagline" maxLength={200} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
          </Field>
          <Field
            id="supplier-description"
            label={t("fields.description")}
            hint={<span className={cn(tooLong && "font-medium text-ember-600")}>{t("hints.words", { count: words, max: MAX_WORDS })}</span>}
            className="md:col-span-2"
          >
            <textarea
              id="supplier-description"
              rows={6}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              aria-invalid={tooLong}
              className={cn(inputClass, tooLong && "border-ember-600")}
            />
          </Field>
        </div>

        <div className="mt-5 space-y-2">
          <p className={labelClass}>{t("fields.categories")}</p>
          <ChipSelect options={options?.supplierCategories ?? []} value={form.categories} onChange={(v) => set("categories", v)} label={(v) => optionLabel("supplierCategories", v)} />
        </div>
        <div className="mt-5 space-y-2">
          <p className={labelClass}>{t("fields.regions")}</p>
          <ChipSelect
            options={options?.supplierRegions ?? []}
            value={form.regions}
            onChange={(v) => set("regions", v)}
            label={(v) => optionLabel("regions", v)}
          />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.pictures")}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <p className={labelClass}>{t("fields.logo")}</p>
            <ImageField
              shape="square"
              currentUrl={current?.logo}
              file={pictures.logo}
              onFileChange={(file) => setPictures((p) => ({ ...p, logo: file }))}
              onRemoveCurrent={onRemovePicture && (() => onRemovePicture("logo"))}
            />
          </div>
          <div className="space-y-2">
            <p className={labelClass}>{t("fields.image")}</p>
            <ImageField
              currentUrl={current?.image}
              file={pictures.image}
              onFileChange={(file) => setPictures((p) => ({ ...p, image: file }))}
              onRemoveCurrent={onRemovePicture && (() => onRemovePicture("image"))}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.contact")}</h2>
        <p className="-mt-2 mb-4 text-xs text-gray-500">{t("hints.contact")}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field id="supplier-person" label={t("fields.person")}>
            <input id="supplier-person" value={form.contact.person ?? ""} onChange={(e) => setContact("person", e.target.value)} className={inputClass} />
          </Field>
          <Field id="supplier-email" label={t("fields.email")} required>
            <input id="supplier-email" type="email" required value={form.contact.email} onChange={(e) => setContact("email", e.target.value)} className={inputClass} />
          </Field>
          <Field id="supplier-phone" label={t("fields.phone")}>
            <input id="supplier-phone" type="tel" value={form.contact.phone ?? ""} onChange={(e) => setContact("phone", e.target.value)} placeholder="+31 6 12345678" className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.visibility")}</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label={t("fields.isActive")} description={t("hints.isActive")} />
          <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label={t("fields.featured")} description={t("hints.featured")} />
          <Toggle checked={form.showInPurchasing} onChange={(v) => set("showInPurchasing", v)} label={t("fields.showInPurchasing")} description={t("hints.showInPurchasing")} />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Link href={cancelHref} className={outlineButtonClass}>
          {tc("cancel")}
        </Link>
        <button type="submit" disabled={submitting || tooLong} className={primaryButtonClass}>
          {submitting ? tc("saving") : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default SupplierForm;
