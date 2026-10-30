"use client";

import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass } from "@/components/shared/form-styles";
import { Modal } from "@/components/shared/Modal";
import { RoleBadge } from "@/components/shared/RoleBadge";
import type { UserRole } from "@/config/access";
import type { ActionResponse } from "@/lib/api";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus, BiTrash } from "react-icons/bi";

const EMPTY = { firstName: "", lastName: "", email: "", password: "" };

export interface AccountLogin {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

type LoginForm = typeof EMPTY;

/**
 * Card with the logins of one hotel or supplier: list, add, remove (admins).
 * `namespace` holds the texts (HotelLogins / SupplierLogins).
 */
export function LoginsCard({
  ownerId,
  namespace,
  list,
  create,
  remove: removeLogin,
}: {
  ownerId: string;
  namespace: "HotelLogins" | "SupplierLogins";
  list: (ownerId: string) => Promise<ActionResponse<AccountLogin[]>>;
  create: (ownerId: string, data: LoginForm) => Promise<ActionResponse<unknown>>;
  remove: (ownerId: string, userId: string) => Promise<ActionResponse<unknown>>;
}) {
  const t = useTranslations(namespace);
  const tc = useTranslations("Common");
  const { data: users, reload } = useApiData(list, ownerId);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (key: keyof LoginForm, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const remove = async (userId: string, email: string) => {
    if (!window.confirm(t("confirmDelete", { email }))) return;
    const res = await removeLogin(ownerId, userId);
    if (res.ok) {
      toast.success(t("deleted"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className={cardClass}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className={cardTitleClass.replace("mb-4 ", "")}>{t("title")}</h2>
        <button type="button" onClick={() => setOpen(true)} className={`${outlineButtonClass} px-3 py-1.5 text-xs`}>
          <BiPlus size={14} /> {t("add")}
        </button>
      </div>
      {!users?.length ? (
        <p className="text-sm text-gray-500">{t("empty")}</p>
      ) : (
        <ul className="space-y-3">
          {users.map((user) => (
            <li key={user._id} className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName ?? ""}`.trim()}</p>
                <p className="truncate text-xs text-gray-500">{user.email}</p>
                <RoleBadge role={user.role} className="mt-1" />
              </div>
              <button type="button" onClick={() => remove(user._id, user.email)} title={t("delete")} className="rounded-md p-1.5 text-gray-400 hover:bg-ember-100 hover:text-ember-600">
                <BiTrash size={16} />
                <span className="sr-only">{t("delete")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-gray-500">{t("hint")}</p>

      <Modal open={open} onClose={() => setOpen(false)} title={t("addTitle")} className="max-w-lg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            const res = await create(ownerId, form);
            setSaving(false);
            if (res.ok) {
              toast.success(t("created", { email: form.email }));
              setForm(EMPTY);
              setOpen(false);
              reload();
            } else toast.error(res.error || tc("error"));
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="login-first" label={t("firstName")} required>
              <input id="login-first" required value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputClass} />
            </Field>
            <Field id="login-last" label={t("lastName")}>
              <input id="login-last" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field id="login-email" label={t("email")} required>
            <input id="login-email" type="email" required autoComplete="off" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
          </Field>
          <Field id="login-password" label={t("password")} required hint={t("passwordHint")}>
            <input id="login-password" type="text" required minLength={8} maxLength={72} autoComplete="new-password" value={form.password} onChange={(e) => set("password", e.target.value)} className={inputClass} />
          </Field>
          <FormActions submitting={saving} submitLabel={t("add")} onCancel={() => setOpen(false)} />
        </form>
      </Modal>
    </div>
  );
}
