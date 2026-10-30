"use client";

import { updateMyHotelAction, type MyHotel } from "@/app/actions/myHotel";
import { Field } from "@/components/shared/form/Field";
import { inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { saveSection, SectionForm } from "./SectionForm";

/** Onboarding step 1 / My hotel: company details. */
export function CompanySection({
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
  /** No success toast (the onboarding moves on instead). */
  quiet?: boolean;
}) {
  const t = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState({
    name: hotel.name,
    kvkNumber: hotel.kvkNumber ?? "",
    address: hotel.address,
    city: hotel.city,
    region: hotel.region,
    contactPerson: hotel.contactPerson ?? "",
    phone: hotel.phone ?? "",
    general: hotel.emails.general,
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setSubmitting(true);
    const { general, ...rest } = form;
    const saved = await saveSection(() => updateMyHotelAction({ ...rest, emails: { general } }), { success: quiet ? undefined : t("saved"), error: tc("error") }, toast);
    setSubmitting(false);
    if (saved) onSaved(saved);
  };

  return (
    <SectionForm title={t("company.title")} description={t("company.description")} submitting={submitting} submitLabel={submitLabel} secondary={secondary} onSubmit={submit}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="company-name" label={t("company.name")} required>
          <input id="company-name" required minLength={2} maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </Field>
        <Field id="company-kvk" label={t("company.kvk")} hint={t("company.kvkHint")}>
          <input id="company-kvk" inputMode="numeric" maxLength={9} value={form.kvkNumber} onChange={(e) => set("kvkNumber", e.target.value)} placeholder="12345678" className={inputClass} />
        </Field>
        <Field id="company-address" label={t("company.address")} required className="md:col-span-2">
          <input id="company-address" required value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
        </Field>
        <Field id="company-city" label={t("company.city")} required>
          <input id="company-city" required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
        </Field>
        <Field id="company-region" label={t("company.region")} required>
          <select id="company-region" required value={form.region} onChange={(e) => set("region", e.target.value)} className={inputClass}>
            {(options?.regions ?? [form.region]).map((r) => (
              <option key={r} value={r}>
                {optionLabel("regions", r)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="company-person" label={t("company.contactPerson")}>
          <input id="company-person" maxLength={100} value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)} className={inputClass} />
        </Field>
        <Field id="company-phone" label={t("company.phone")}>
          <input id="company-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+31 20 123 4567" className={inputClass} />
        </Field>
        <Field id="company-email" label={t("company.generalEmail")} required hint={t("company.generalEmailHint")} className="md:col-span-2">
          <input id="company-email" type="email" required value={form.general} onChange={(e) => set("general", e.target.value)} placeholder="info@hotel.nl" className={inputClass} />
        </Field>
      </div>
    </SectionForm>
  );
}
