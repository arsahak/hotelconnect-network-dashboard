"use client";

import type { PurchaseAction, PurchaseActionInput, PurchaseStatus } from "@/app/actions/purchase";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const EMPTY_ACTION: PurchaseActionInput = {
  title: "",
  category: "Energy",
  description: "",
  deadline: "",
  expectedSavings: "",
  targetParticipants: 10,
  status: "open",
};

export const actionToInput = (a: PurchaseAction): PurchaseActionInput => ({
  title: a.title,
  category: a.category,
  description: a.description,
  deadline: a.deadline.slice(0, 10),
  expectedSavings: a.expectedSavings,
  targetParticipants: a.targetParticipants,
  status: a.status,
});

const STATUSES: PurchaseStatus[] = ["open", "negotiating", "completed"];

/** A collective purchasing action (briefing §3.13), for admins. */
const PurchaseActionForm = ({
  initial = EMPTY_ACTION,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: PurchaseActionInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: PurchaseActionInput) => void;
}) => {
  const t = useTranslations("AdminPurchasing");
  const ts = useTranslations("Purchasing.status");
  const [form, setForm] = useState<PurchaseActionInput>(initial);
  const set = <K extends keyof PurchaseActionInput>(key: K, value: PurchaseActionInput[K]) => setForm((f) => ({ ...f, [key]: value }));

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
          <Field id="pa-title" label={t("fields.title")} required className="md:col-span-2">
            <input id="pa-title" required minLength={3} maxLength={120} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Collectieve energie-inkoop 2027" className={inputClass} />
          </Field>
          <Field id="pa-category" label={t("fields.category")}>
            <input id="pa-category" maxLength={60} value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass} />
          </Field>
          <Field id="pa-status" label={t("fields.status")} hint={t("hints.status")}>
            <select id="pa-status" value={form.status} onChange={(e) => set("status", e.target.value as PurchaseStatus)} className={inputClass}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ts(s)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="pa-deadline" label={t("fields.deadline")} required>
            <input id="pa-deadline" type="date" required value={form.deadline} onChange={(e) => set("deadline", e.target.value)} className={inputClass} />
          </Field>
          <Field id="pa-target" label={t("fields.targetParticipants")} hint={t("hints.target")}>
            <input id="pa-target" type="number" min={1} max={1000} value={form.targetParticipants} onChange={(e) => set("targetParticipants", Number(e.target.value))} className={inputClass} />
          </Field>
          <Field id="pa-savings" label={t("fields.expectedSavings")} className="md:col-span-2">
            <input id="pa-savings" maxLength={120} value={form.expectedSavings} onChange={(e) => set("expectedSavings", e.target.value)} placeholder={t("placeholders.expectedSavings")} className={inputClass} />
          </Field>
          <Field id="pa-description" label={t("fields.description")} className="md:col-span-2">
            <textarea id="pa-description" rows={5} maxLength={3000} value={form.description} onChange={(e) => set("description", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} />
    </form>
  );
};

export default PurchaseActionForm;
