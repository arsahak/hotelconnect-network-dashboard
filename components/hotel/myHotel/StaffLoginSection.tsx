"use client";

import { deleteStaffLoginAction, getStaffLoginAction, saveStaffLoginAction } from "@/app/actions/myHotel";
import { Field } from "@/components/shared/form/Field";
import { dangerButtonClass, inputClass } from "@/components/shared/form-styles";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiTrash } from "react-icons/bi";
import { SectionForm } from "./SectionForm";

/**
 * Briefing §3.6: the hotel has two logins. The manager creates and changes
 * the staff login, which only sees the storingslijst.
 */
export function StaffLoginSection() {
  const t = useTranslations("MyHotel");
  const tc = useTranslations("Common");
  const { data: staff, loading, setData, reload } = useApiData(getStaffLoginAction, null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const shownEmail = email ?? staff?.email ?? "";

  if (loading) return <div className="h-48 animate-pulse rounded border border-gray-200 bg-white" />;

  const submit = async () => {
    setSubmitting(true);
    const res = await saveStaffLoginAction({ email: shownEmail, password: password || undefined });
    setSubmitting(false);
    if (res.ok && res.data) {
      setData(res.data);
      setPassword("");
      setEmail(null);
      toast.success(t("staff.saved"));
    } else toast.error(res.error || tc("error"));
  };

  const remove = async () => {
    if (!window.confirm(t("staff.confirmDelete"))) return;
    const res = await deleteStaffLoginAction();
    if (res.ok) {
      toast.success(t("staff.deleted"));
      setEmail(null);
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <SectionForm
      title={t("staff.title")}
      description={t("staff.description")}
      submitting={submitting}
      submitLabel={staff ? t("staff.save") : t("staff.create")}
      secondary={
        staff && (
          <button type="button" onClick={remove} className={dangerButtonClass}>
            <BiTrash size={16} /> {t("staff.delete")}
          </button>
        )
      }
      onSubmit={submit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="staff-email" label={t("staff.email")} required hint={t("staff.emailHint")}>
          <input id="staff-email" type="email" required autoComplete="off" value={shownEmail} onChange={(e) => setEmail(e.target.value)} placeholder="personeel@hotel.nl" className={inputClass} />
        </Field>
        <Field id="staff-password" label={staff ? t("staff.newPassword") : t("staff.password")} required={!staff} hint={staff ? t("staff.newPasswordHint") : t("staff.passwordHint")}>
          <input id="staff-password" type="text" autoComplete="new-password" required={!staff} minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
        </Field>
      </div>
    </SectionForm>
  );
}
