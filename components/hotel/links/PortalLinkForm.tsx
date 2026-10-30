"use client";

import type { PortalLink, PortalLinkInput } from "@/app/actions/portalLink";
import { Field } from "@/components/shared/form/Field";
import { FormActions } from "@/components/shared/form/FormActions";
import { cardClass, inputClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiLockAlt } from "react-icons/bi";

export const EMPTY_PORTAL_LINK: PortalLinkInput = { category: "", customCategory: "", name: "", url: "", username: "", notes: "" };

export const portalLinkToInput = (l: PortalLink): PortalLinkInput => ({
  category: l.category,
  customCategory: l.customCategory,
  name: l.name,
  url: l.url,
  username: l.username,
  notes: l.notes,
});

/** Portal link form (briefing §3.11): category, name, link, username, notes — never a password. */
const PortalLinkForm = ({
  initial = EMPTY_PORTAL_LINK,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: PortalLinkInput;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: PortalLinkInput) => void;
}) => {
  const t = useTranslations("PortalLinks");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<PortalLinkInput>(initial);
  const set = <K extends keyof PortalLinkInput>(key: K, value: PortalLinkInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const isOther = form.category === "Other";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, customCategory: isOther ? form.customCategory : "" });
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex gap-3 rounded border border-brass-400/40 bg-brass-100/60 p-4 text-sm text-ink-700">
        <BiLockAlt size={20} className="mt-0.5 shrink-0 text-brass-600" />
        <p>{t("noPasswords")}</p>
      </div>
      <div className={cardClass}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field id="link-category" label={t("fields.category")} required>
            <select id="link-category" required value={form.category} onChange={(e) => set("category", e.target.value)} className={inputClass}>
              <option value="">{tc("choose")}</option>
              {(options?.portalCategories ?? []).map((category) => (
                <option key={category} value={category}>
                  {optionLabel("portalCategories", category)}
                </option>
              ))}
            </select>
          </Field>
          {isOther ? (
            <Field id="link-custom" label={t("fields.customCategory")} required>
              <input id="link-custom" required minLength={2} maxLength={60} value={form.customCategory} onChange={(e) => set("customCategory", e.target.value)} placeholder={t("placeholders.customCategory")} className={inputClass} />
            </Field>
          ) : (
            <div className="hidden md:block" />
          )}
          <Field id="link-name" label={t("fields.name")} required>
            <input id="link-name" required minLength={2} maxLength={120} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("placeholders.name")} className={inputClass} />
          </Field>
          <Field id="link-url" label={t("fields.url")} required>
            <input id="link-url" type="url" required value={form.url} onChange={(e) => set("url", e.target.value)} placeholder="https://" className={inputClass} />
          </Field>
          <Field id="link-username" label={t("fields.username")} hint={t("hints.username")}>
            <input id="link-username" maxLength={120} autoComplete="off" value={form.username} onChange={(e) => set("username", e.target.value)} className={inputClass} />
          </Field>
          <Field id="link-notes" label={t("fields.notes")} className="md:col-span-2">
            <textarea id="link-notes" rows={3} maxLength={1000} value={form.notes} onChange={(e) => set("notes", e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>
      <FormActions submitting={submitting} submitLabel={submitLabel} cancelHref={cancelHref} />
    </form>
  );
};

export default PortalLinkForm;
