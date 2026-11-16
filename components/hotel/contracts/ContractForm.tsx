"use client";

import type { ContractInput, NoticeUnit } from "@/app/actions/contract";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, cardTitleClass, inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

export const EMPTY_CONTRACT: ContractInput = {
  contractFor: "",
  company: "",
  email: "",
  startDate: "",
  endDate: "",
  duration: "",
  autoRenew: false,
  noticePeriod: { value: "", unit: "months" },
  paymentTerm: "",
  costPerYear: "",
  ledgerAccount: "",
  contractLink: "",
  portalLink: "",
  notes: "",
};

const UNITS: NoticeUnit[] = ["days", "weeks", "months"];

/**
 * Contract register form. Master Briefing v4: five fields — company, email,
 * end date, notice period and URL (no PDF uploads). The older, optional
 * fields (budget, ledger, notes…) sit folded away under "More details".
 */
const ContractForm = ({
  initial = EMPTY_CONTRACT,
  submitting,
  submitLabel,
  cancelHref,
  onCancel,
  onSubmit,
  compact = false,
}: {
  initial?: ContractInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  onSubmit: (data: ContractInput) => void;
  /** Inside a modal (onboarding): no explanation card. */
  compact?: boolean;
}) => {
  const t = useTranslations("Contracts");
  const [form, setForm] = useState<ContractInput>(initial);
  const set = <K extends keyof ContractInput>(key: K, value: ContractInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const id = (name: string) => `contract-${name}${compact ? "-modal" : ""}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-col gap-6"
    >
      {!compact && (
        <div className="flex gap-3 rounded border border-brass-400/40 bg-brass-100/60 p-4 text-sm text-ink-700">
          <BiInfoCircle size={20} className="mt-0.5 shrink-0 text-brass-600" />
          <p>{t("explanation")}</p>
        </div>
      )}

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.contract")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id={id("company")} label={t("fields.company")} required>
            <input id={id("company")} required maxLength={120} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder={t("placeholders.company")} className={inputClass} />
          </Field>
          <Field id={id("email")} label={t("fields.email")} hint={t("hints.email")}>
            <input id={id("email")} type="email" maxLength={254} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="service@company.nl" className={inputClass} />
          </Field>
          <Field id={id("end")} label={t("fields.endDate")} hint={t("hints.endDate")}>
            <input id={id("end")} type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("notice")} label={t("fields.noticePeriod")} hint={t("hints.noticePeriodV4")}>
            <div className="flex gap-2">
              <input
                id={id("notice")}
                type="number"
                min={0}
                max={1000}
                value={form.noticePeriod.value}
                onChange={(e) => set("noticePeriod", { ...form.noticePeriod, value: e.target.value })}
                className={`${inputClass} w-28`}
              />
              <select
                aria-label={t("fields.noticeUnit")}
                value={form.noticePeriod.unit}
                onChange={(e) => set("noticePeriod", { ...form.noticePeriod, unit: e.target.value as NoticeUnit })}
                className={inputClass}
              >
                {UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {t(`units.${unit}`)}
                  </option>
                ))}
              </select>
            </div>
          </Field>
          <Field id={id("link")} label={t("fields.url")} hint={t("hints.url")} className="md:col-span-2">
            <input id={id("link")} type="url" value={form.contractLink} onChange={(e) => set("contractLink", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
        </div>
      </div>

      <details className={`${cardClass} group`}>
        <summary className="cursor-pointer list-none text-sm font-medium text-gray-700 marker:hidden">
          <span className="inline-flex items-center gap-2">
            <span className="transition-transform group-open:rotate-90">›</span>
            {t("moreDetails")}
          </span>
        </summary>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id={id("for")} label={t("fields.contractFor")}>
            <input id={id("for")} maxLength={120} value={form.contractFor} onChange={(e) => set("contractFor", e.target.value)} placeholder={t("placeholders.contractFor")} className={inputClass} />
          </Field>
          <Field id={id("start")} label={t("fields.startDate")}>
            <input id={id("start")} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={inputClass} />
          </Field>
          <Field id={id("duration")} label={t("fields.duration")}>
            <input id={id("duration")} maxLength={60} value={form.duration} onChange={(e) => set("duration", e.target.value)} placeholder={t("placeholders.duration")} className={inputClass} />
          </Field>
          <Field id={id("cost")} label={t("fields.costPerYear")}>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">€</span>
              <input id={id("cost")} type="number" min={0} step="0.01" value={form.costPerYear} onChange={(e) => set("costPerYear", e.target.value)} className={`${inputClass} pl-7`} />
            </div>
          </Field>
          <Field id={id("ledger")} label={t("fields.ledgerAccount")}>
            <input id={id("ledger")} maxLength={30} value={form.ledgerAccount} onChange={(e) => set("ledgerAccount", e.target.value)} placeholder="4410" className={inputClass} />
          </Field>
          <Field id={id("payment")} label={t("fields.paymentTerm")}>
            <input id={id("payment")} maxLength={60} value={form.paymentTerm} onChange={(e) => set("paymentTerm", e.target.value)} placeholder={t("placeholders.paymentTerm")} className={inputClass} />
          </Field>
          <Field id={id("portal")} label={t("fields.portalLink")} hint={t("hints.portalLink")} className="md:col-span-2">
            <input id={id("portal")} type="url" value={form.portalLink} onChange={(e) => set("portalLink", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id={id("notes")} label={t("fields.notes")} className="md:col-span-2">
            <textarea id={id("notes")} rows={3} maxLength={2000} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
          </Field>
          <div className="md:col-span-2">
            <Toggle checked={form.autoRenew} onChange={(v) => set("autoRenew", v)} label={t("fields.autoRenew")} description={t("hints.autoRenew")} />
          </div>
        </div>
      </details>

      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} onCancel={onCancel} disabled={!form.company.trim()} />
    </form>
  );
};

/** API record → form values. */
export function contractToInput(contract: {
  contractFor: string;
  company: string;
  email?: string;
  startDate: string | null;
  endDate: string | null;
  duration: string;
  autoRenew: boolean;
  noticePeriod: { value: number | null; unit: NoticeUnit };
  paymentTerm: string;
  costPerYear: number | null;
  ledgerAccount: string;
  contractLink: string;
  portalLink: string;
  notes: string;
}): ContractInput {
  return {
    ...contract,
    email: contract.email ?? "",
    startDate: contract.startDate?.slice(0, 10) ?? "",
    endDate: contract.endDate?.slice(0, 10) ?? "",
    noticePeriod: { value: contract.noticePeriod?.value?.toString() ?? "", unit: contract.noticePeriod?.unit ?? "months" },
    costPerYear: contract.costPerYear?.toString() ?? "",
  };
}

export default ContractForm;
