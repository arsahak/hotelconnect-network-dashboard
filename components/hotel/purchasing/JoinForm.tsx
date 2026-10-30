"use client";

import { joinPurchaseActionAction } from "@/app/actions/purchase";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { inputClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLockAlt } from "react-icons/bi";

/** Sign-up form (briefing §3.13): current supplier, contract end date, annual usage (optional), latest annual invoice (PDF). */
export function JoinForm({ actionId, onDone, onCancel }: { actionId: string; onDone: () => void; onCancel: () => void }) {
  const t = useTranslations("Purchasing");
  const tc = useTranslations("Common");
  const [supplier, setSupplier] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usage, setUsage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!file) return;
        const form = new FormData();
        form.set("currentSupplier", supplier);
        form.set("contractEndDate", endDate);
        form.set("annualUsage", usage);
        form.set("invoice", file);
        setSaving(true);
        const res = await joinPurchaseActionAction(actionId, form);
        setSaving(false);
        if (res.ok) {
          toast.success(t("joined"));
          onDone();
        } else toast.error(res.error || tc("error"));
      }}
      className="flex flex-col gap-4"
    >
      <Field id="join-supplier" label={t("fields.currentSupplier")} required>
        <input id="join-supplier" required minLength={2} maxLength={120} value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder={t("placeholders.currentSupplier")} className={inputClass} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="join-end" label={t("fields.contractEndDate")} required>
          <input id="join-end" type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </Field>
        <Field id="join-usage" label={t("fields.annualUsage")} hint={t("hints.annualUsage")}>
          <input id="join-usage" maxLength={200} value={usage} onChange={(e) => setUsage(e.target.value)} placeholder={t("placeholders.annualUsage")} className={inputClass} />
        </Field>
      </div>
      <Field id="join-invoice" label={t("fields.invoice")} required hint={t("hints.invoice")}>
        <input
          id="join-invoice"
          type="file"
          required
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brass-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brass-700"
        />
      </Field>
      <p className="flex items-start gap-2 rounded bg-gray-50 p-3 text-xs text-gray-600">
        <BiLockAlt size={16} className="mt-0.5 shrink-0 text-brass-600" />
        {t("privacy")}
      </p>
      <FormActions submitting={saving} submitLabel={t("join")} onCancel={onCancel} />
    </form>
  );
}
