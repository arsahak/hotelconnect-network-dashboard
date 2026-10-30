"use client";

import type { FaultContact, FaultContactInput } from "@/app/actions/faultContact";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const EMPTY_FAULT_CONTACT: FaultContactInput = { name: "", faultType: "", phone: "", whatsapp: "", email: "", website: "", notes: "" };

export const faultContactToInput = (c: FaultContact): FaultContactInput => ({
  name: c.name,
  faultType: c.faultType,
  phone: c.phone,
  whatsapp: c.whatsapp ?? "",
  email: c.email ?? "",
  website: c.website ?? "",
  notes: c.notes ?? "",
});

/** Storingslijst contact form (briefing §3.4.3). */
const FaultForm = ({
  initial = EMPTY_FAULT_CONTACT,
  submitting,
  submitLabel,
  cancelHref,
  onCancel,
  onSubmit,
  compact = false,
}: {
  initial?: FaultContactInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  onSubmit: (data: FaultContactInput) => void;
  compact?: boolean;
}) => {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<FaultContactInput>(initial);
  const set = <K extends keyof FaultContactInput>(key: K, value: FaultContactInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const id = (name: string) => `fault-${name}${compact ? "-modal" : ""}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id={id("name")} label={t("fields.name")} required>
            <input id={id("name")} required minLength={2} maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("type")} label={t("fields.faultType")} required>
            <select id={id("type")} required value={form.faultType} onChange={(e) => set("faultType", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.faultTypes ?? []).map((type) => (
                <option key={type} value={type}>
                  {optionLabel("faultTypes", type)}
                </option>
              ))}
            </select>
          </Field>
          <Field id={id("phone")} label={t("fields.phone")} required>
            <input id={id("phone")} required type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+31 20 123 4567" className={inputClass} />
          </Field>
          <Field id={id("whatsapp")} label={t("fields.whatsapp")} hint={t("hints.whatsapp")}>
            <input id={id("whatsapp")} inputMode="tel" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="31612345678" className={inputClass} />
          </Field>
          <Field id={id("email")} label={t("fields.email")} hint={t("hints.email")}>
            <input id={id("email")} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("website")} label={t("fields.website")}>
            <input id={id("website")} type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id={id("notes")} label={t("fields.notes")} hint={t("hints.notes")} className="md:col-span-2">
            <input id={id("notes")} maxLength={500} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} onCancel={onCancel} />
    </form>
  );
};

export default FaultForm;
