"use client";

import { createStaffAction, deleteStaffAction, listStaffAction, updateStaffAction, type Department, type StaffAccount, type StaffInput } from "@/app/actions/staff";
import { Field } from "@/components/shared/form/Field";
import { cardClass, cardTitleClass, inputClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiKey, BiPlus, BiTrash } from "react-icons/bi";

const DEPARTMENTS: Department[] = ["HSK", "TD", "FO", "FB"];
const ROLES = ["gm", "dept_manager", "staff"] as const;
const EMPTY: StaffInput = { firstName: "", lastName: "", email: "", password: "", hotelRole: "staff", department: "HSK", language: "" };

/** Add-account form. */
function AddStaff({ onAdded }: { onAdded: () => void }) {
  const t = useTranslations("Staff");
  const tc = useTranslations("Common");
  const [form, setForm] = useState<StaffInput>(EMPTY);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof StaffInput>(key: K, value: StaffInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      className={cardClass}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await createStaffAction(form);
        setBusy(false);
        if (res.ok) {
          toast.success(t("added", { name: form.firstName }));
          setForm(EMPTY);
          onAdded();
        } else toast.error(res.error || tc("error"));
      }}
    >
      <h2 className={cardTitleClass}>{t("add")}</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field id="st-first" label={t("fields.firstName")} required>
          <input id="st-first" required maxLength={60} value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputClass} />
        </Field>
        <Field id="st-last" label={t("fields.lastName")}>
          <input id="st-last" maxLength={60} value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputClass} />
        </Field>
        <Field id="st-email" label={t("fields.email")} required>
          <input id="st-email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
        </Field>
        <Field id="st-password" label={t("fields.password")} required hint={t("hints.password")}>
          <input id="st-password" type="text" required minLength={8} maxLength={72} autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputClass} />
        </Field>
        <Field id="st-role" label={t("fields.role")} required>
          <select id="st-role" value={form.hotelRole} onChange={(e) => set("hotelRole", e.target.value as StaffInput["hotelRole"])} className={inputClass}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`roles.${r}`)}
              </option>
            ))}
          </select>
        </Field>
        {form.hotelRole !== "gm" && (
          <Field id="st-dept" label={t("fields.department")} hint={t("hints.department")}>
            <select id="st-dept" value={form.department} onChange={(e) => set("department", e.target.value as Department | "")} className={inputClass}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {t(`departments.${d}`)}
                </option>
              ))}
              <option value="">{t("departments.all")}</option>
            </select>
          </Field>
        )}
        <Field id="st-lang" label={t("fields.language")}>
          <select id="st-lang" value={form.language} onChange={(e) => set("language", e.target.value as StaffInput["language"])} className={inputClass}>
            <option value="">{t("languages.auto")}</option>
            <option value="nl">Nederlands</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </Field>
        <div className="flex items-end">
          <button type="submit" disabled={busy} className={`${primaryButtonClass} w-full justify-center`}>
            <BiPlus size={16} /> {t("addButton")}
          </button>
        </div>
      </div>
    </form>
  );
}

/** One account row: role, department and active change straight away. */
function StaffRow({ user, self, onChanged }: { user: StaffAccount; self: boolean; onChanged: () => void }) {
  const t = useTranslations("Staff");
  const tc = useTranslations("Common");

  const save = async (data: Parameters<typeof updateStaffAction>[1]) => {
    const res = await updateStaffAction(user._id, data);
    if (res.ok) {
      toast.success(t("saved"));
      onChanged();
    } else toast.error(res.error || tc("error"));
  };

  const shared = user.hotelRole === "shared";

  return (
    <tr className="align-middle">
      <td className="px-5 py-3">
        <span className="block font-medium text-gray-900">
          {[user.firstName, user.lastName].filter(Boolean).join(" ")} {self && <span className="text-xs font-normal text-gray-500">({t("you")})</span>}
        </span>
        <span className="block text-xs text-gray-500">{user.email}</span>
      </td>
      <td className="px-5 py-3">
        {shared ? (
          <span className="text-sm text-gray-600">{t("roles.shared")}</span>
        ) : (
          <select aria-label={t("fields.role")} disabled={self} value={user.hotelRole} onChange={(e) => save({ hotelRole: e.target.value as StaffInput["hotelRole"] })} className={`${inputClass} w-auto`}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {t(`roles.${r}`)}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className="px-5 py-3">
        {user.hotelRole === "gm" || shared ? (
          <span className="text-sm text-gray-500">{t("departments.all")}</span>
        ) : (
          <select aria-label={t("fields.department")} value={user.department ?? ""} onChange={(e) => save({ department: e.target.value as Department | "" })} className={`${inputClass} w-auto`}>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {t(`departments.${d}`)}
              </option>
            ))}
            <option value="">{t("departments.all")}</option>
          </select>
        )}
      </td>
      <td className="px-5 py-3">
        <button type="button" disabled={self || shared} onClick={() => save({ isActive: !user.isActive })} className="disabled:cursor-default">
          <StatusBadge tone={user.isActive ? "green" : "grey"}>{user.isActive ? t("active") : t("inactive")}</StatusBadge>
        </button>
      </td>
      <td className="px-5 py-3 text-right">
        {!self && !shared && (
          <span className="inline-flex gap-1">
            <button
              type="button"
              title={t("newPassword")}
              aria-label={t("newPassword")}
              onClick={() => {
                const password = window.prompt(t("newPasswordPrompt", { name: user.firstName }));
                if (password && password.length >= 8) save({ password });
                else if (password) toast.error(t("hints.password"));
              }}
              className="grid size-9 place-items-center rounded text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            >
              <BiKey size={18} />
            </button>
            <button
              type="button"
              title={tc("delete")}
              aria-label={tc("delete")}
              onClick={async () => {
                if (!window.confirm(t("confirmDelete", { name: user.firstName }))) return;
                const res = await deleteStaffAction(user._id);
                if (res.ok) {
                  toast.success(t("deleted"));
                  onChanged();
                } else toast.error(res.error || tc("error"));
              }}
              className="grid size-9 place-items-center rounded text-gray-500 hover:bg-red-50 hover:text-red-600"
            >
              <BiTrash size={18} />
            </button>
          </span>
        )}
      </td>
    </tr>
  );
}

/** Staff — /hotel/staff (Master Briefing v4): personal accounts with role and department. */
export default function StaffPage() {
  const t = useTranslations("Staff");
  const { email } = useSessionUser();
  const { data, loading, error, reload } = useApiData(listStaffAction, undefined);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("description")} />
      <AddStaff onAdded={reload} />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("fields.name")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.role")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.department")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.status")}</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">…</td>
              </tr>
            ) : !data ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">{error}</td>
              </tr>
            ) : (
              data.map((user) => <StaffRow key={user._id} user={user} self={user.email === email} onChanged={reload} />)
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">{t("rolesHint")}</p>
    </div>
  );
}
