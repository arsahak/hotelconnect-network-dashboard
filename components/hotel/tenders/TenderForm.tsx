"use client";

import type { Tender, TenderInput } from "@/app/actions/tender";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

export const EMPTY_TENDER: TenderInput = { type: "Tender", title: "", category: "", region: "", description: "", deadline: "", budget: "" };

export const tenderToInput = (t: Tender): TenderInput => ({
  type: t.type,
  title: t.title,
  category: t.category,
  region: t.region,
  description: t.description,
  deadline: t.deadline.slice(0, 10),
  budget: t.budget == null ? "" : String(t.budget),
});

/**
 * Tender form (briefing §3.5). When editing a sent tender, type, category and
 * region are fixed: the suppliers were chosen with them.
 */
const TenderForm = ({
  initial = EMPTY_TENDER,
  editing = false,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: TenderInput;
  editing?: boolean;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: TenderInput) => void;
}) => {
  const t = useTranslations("Tenders");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<TenderInput>(initial);
  const set = <K extends keyof TenderInput>(key: K, value: TenderInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex gap-3 rounded border border-brass-400/40 bg-brass-100/60 p-4 text-sm text-ink-700">
        <BiInfoCircle size={20} className="mt-0.5 shrink-0 text-brass-600" />
        <p>{editing ? t("editExplanation") : t("explanation")}</p>
      </div>
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="tender-type" label={t("fields.type")} required>
            <select id="tender-type" required disabled={editing} value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
              {(options?.tenderTypes ?? ["Tender"]).map((type) => (
                <option key={type} value={type}>
                  {optionLabel("tenderTypes", type)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="tender-title" label={t("fields.title")} required>
            <input id="tender-title" required minLength={3} maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder={t("placeholders.title")} className={inputClass} />
          </Field>
          <Field id="tender-category" label={t("fields.category")} required hint={editing ? undefined : t("hints.category")}>
            <select id="tender-category" required disabled={editing} value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.supplierCategories ?? []).map((c) => (
                <option key={c} value={c}>
                  {optionLabel("supplierCategories", c)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="tender-region" label={t("fields.region")} required>
            <select id="tender-region" required disabled={editing} value={form.region} onChange={(e) => set("region", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.regions ?? []).map((r) => (
                <option key={r} value={r}>
                  {optionLabel("regions", r)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="tender-description" label={t("fields.description")} required className="md:col-span-2">
            <textarea id="tender-description" required minLength={10} maxLength={5000} rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder={t("placeholders.description")} className={inputClass} />
          </Field>
          <Field id="tender-deadline" label={t("fields.deadline")} required hint={t("hints.deadline")}>
            <input id="tender-deadline" type="date" required min={today} value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputClass} />
          </Field>
          <Field id="tender-budget" label={t("fields.budget")} hint={t("hints.budget")}>
            <input id="tender-budget" type="number" min={0} step={1} inputMode="numeric" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="€" className={inputClass} />
          </Field>
        </div>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} />
    </form>
  );
};

export default TenderForm;
