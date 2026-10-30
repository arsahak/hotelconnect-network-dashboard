"use client";

import { reportFaultAction, type FaultContact } from "@/app/actions/faultContact";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { Toggle } from "@/components/shared/form/Toggle";
import { inputClass } from "@/components/shared/form-styles";
import { Modal } from "@/components/shared/Modal";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";

/**
 * Report a fault by email (briefing §3.4.3, addition). The party gets the
 * hotel's contact details and gets in touch; HotelConnect stores nothing.
 */
export function ReportFaultModal({ contact, onClose }: { contact: FaultContact | null; onClose: () => void }) {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const [form, setForm] = useState({ location: "", description: "", urgent: false });
  const [sending, setSending] = useState(false);

  const close = () => {
    setForm({ location: "", description: "", urgent: false });
    onClose();
  };

  return (
    <Modal open={Boolean(contact)} onClose={close} title={contact ? t("report.title", { name: contact.name }) : ""} className="max-w-xl">
      {contact && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSending(true);
            const res = await reportFaultAction(contact._id, form);
            setSending(false);
            if (res.ok) {
              toast.success(t("report.sent", { name: contact.name }));
              close();
            } else toast.error(res.error || tc("error"));
          }}
          className="flex flex-col gap-4"
        >
          <p className="text-sm text-gray-600">{t("report.explanation", { email: contact.email })}</p>
          <Field id="report-location" label={t("report.location")}>
            <input id="report-location" maxLength={120} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder={t("report.locationPlaceholder")} className={inputClass} />
          </Field>
          <Field id="report-description" label={t("report.description")}>
            <textarea id="report-description" rows={4} maxLength={2000} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
          </Field>
          <Toggle checked={form.urgent} onChange={(urgent) => setForm((f) => ({ ...f, urgent }))} label={t("report.urgent")} description={t("report.urgentHint")} />
          <p className="text-xs text-gray-500">{t("report.privacy")}</p>
          <FormActions submitting={sending} submitLabel={t("report.send")} onCancel={close} />
        </form>
      )}
    </Modal>
  );
}
