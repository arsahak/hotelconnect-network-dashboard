"use client";

import { deleteMyLogoAction, getMySupplierAction, updateMySupplierAction, uploadMyLogoAction, type MySupplier, type MySupplierInput } from "@/app/actions/mySupplier";
import { ChipSelect } from "@/components/shared/form/ChipSelect";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { FormSkeleton } from "@/components/shared/FormSkeleton";
import { cardClass, cardTitleClass, inputClass, labelClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLinkExternal, BiPlus, BiTrash } from "react-icons/bi";

const MAX_WORDS = 200;
const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;

const toInput = (s: MySupplier): MySupplierInput => ({
  tagline: s.tagline,
  description: s.description,
  categories: s.categories,
  regions: s.regions,
  website: s.website,
  contact: { person: s.contact.person ?? "", email: s.contact.email, phone: s.contact.phone ?? "" },
  emails: { invoices: s.emails?.invoices ?? "", notifications: s.emails?.notifications ?? "" },
  certificates: s.certificates ?? [],
});

/** The form, once the profile has loaded. */
function ProfileForm({ supplier, onSaved }: { supplier: MySupplier; onSaved: () => void }) {
  const t = useTranslations("SupplierProfile");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<MySupplierInput>(() => toInput(supplier));
  const [logo, setLogo] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof MySupplierInput>(key: K, value: MySupplierInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const words = countWords(form.description);
  const tooLong = words > MAX_WORDS;

  const setCert = (index: number, key: "name" | "url", value: string) =>
    set("certificates", form.certificates.map((c, i) => (i === index ? { ...c, [key]: value } : c)));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (tooLong) return;
        setSaving(true);
        const res = await updateMySupplierAction({ ...form, certificates: form.certificates.filter((c) => c.name.trim() || c.url.trim()) });
        if (res.ok && logo) {
          const data = new FormData();
          data.set("image", logo);
          const up = await uploadMyLogoAction(data);
          if (!up.ok) toast.error(up.error || tc("photoNotSaved"));
          setLogo(null);
        }
        setSaving(false);
        if (res.ok) {
          toast.success(t("saved"));
          onSaved();
        } else toast.error(res.error || tc("error"));
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.company")}</h2>
        <div className="grid gap-6 md:grid-cols-[10rem_1fr]">
          <div className="space-y-2">
            <p className={labelClass}>{t("fields.logo")}</p>
            <ImageField
              shape="square"
              currentUrl={supplier.logo || undefined}
              file={logo}
              onFileChange={setLogo}
              onRemoveCurrent={async () => {
                if (!window.confirm(tc("confirmRemovePhoto"))) return;
                const res = await deleteMyLogoAction();
                if (res.ok) {
                  toast.success(tc("photoRemoved"));
                  onSaved();
                } else toast.error(res.error || tc("error"));
              }}
            />
          </div>
          <div className="grid gap-4">
            <Field id="sp-tagline" label={t("fields.tagline")} hint={t("hints.tagline")}>
              <input id="sp-tagline" maxLength={200} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inputClass} />
            </Field>
            <Field id="sp-description" label={t("fields.description")} hint={t("hints.words", { count: words, max: MAX_WORDS })}>
              <textarea id="sp-description" rows={6} value={form.description} onChange={(e) => set("description", e.target.value)} className={cn(inputClass, tooLong && "border-ember-600")} />
            </Field>
            <Field id="sp-website" label={t("fields.website")}>
              <input id="sp-website" type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://" className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.work")}</h2>
        <p className="-mt-2 mb-4 text-xs text-gray-500">{t("hints.work")}</p>
        <div className="space-y-2">
          <p className={labelClass}>{t("fields.categories")}</p>
          <ChipSelect options={options?.supplierCategories ?? []} value={form.categories} onChange={(v) => set("categories", v)} label={(v) => optionLabel("supplierCategories", v)} />
        </div>
        <div className="mt-5 space-y-2">
          <p className={labelClass}>{t("fields.regions")}</p>
          <ChipSelect options={options?.supplierRegions ?? []} value={form.regions} onChange={(v) => set("regions", v)} label={(v) => optionLabel("regions", v)} />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.contact")}</h2>
        <p className="-mt-2 mb-4 text-xs text-gray-500">{t("hints.contact")}</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field id="sp-person" label={t("fields.person")}>
            <input id="sp-person" maxLength={100} value={form.contact.person} onChange={(e) => set("contact", { ...form.contact, person: e.target.value })} className={inputClass} />
          </Field>
          <Field id="sp-phone" label={t("fields.phone")}>
            <input id="sp-phone" type="tel" value={form.contact.phone} onChange={(e) => set("contact", { ...form.contact, phone: e.target.value })} className={inputClass} />
          </Field>
          <Field id="sp-email" label={t("fields.generalEmail")} required>
            <input id="sp-email" type="email" required value={form.contact.email} onChange={(e) => set("contact", { ...form.contact, email: e.target.value })} className={inputClass} />
          </Field>
          <Field id="sp-invoices" label={t("fields.invoicesEmail")} hint={t("hints.fallback")}>
            <input id="sp-invoices" type="email" value={form.emails.invoices} onChange={(e) => set("emails", { ...form.emails, invoices: e.target.value })} className={inputClass} />
          </Field>
          <Field id="sp-notifications" label={t("fields.notificationsEmail")} hint={t("hints.notifications")}>
            <input id="sp-notifications" type="email" value={form.emails.notifications} onChange={(e) => set("emails", { ...form.emails, notifications: e.target.value })} className={inputClass} />
          </Field>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.certificates")}</h2>
        <p className="-mt-2 mb-4 text-xs text-gray-500">{t("hints.certificates")}</p>
        <div className="space-y-3">
          {form.certificates.map((cert, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
              <input aria-label={t("fields.certificateName")} required maxLength={120} value={cert.name} onChange={(e) => setCert(i, "name", e.target.value)} placeholder={t("placeholders.certificateName")} className={inputClass} />
              <input aria-label={t("fields.certificateUrl")} type="url" required value={cert.url} onChange={(e) => setCert(i, "url", e.target.value)} placeholder="https://" className={inputClass} />
              <button type="button" onClick={() => set("certificates", form.certificates.filter((_, j) => j !== i))} title={tc("delete")} className="rounded-lg p-2 text-gray-400 hover:bg-ember-100 hover:text-ember-600">
                <BiTrash size={18} />
                <span className="sr-only">{tc("delete")}</span>
              </button>
            </div>
          ))}
          {form.certificates.length < 20 && (
            <button type="button" onClick={() => set("certificates", [...form.certificates, { name: "", url: "" }])} className={`${outlineButtonClass} px-3 py-1.5 text-xs`}>
              <BiPlus size={14} /> {t("addCertificate")}
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving || tooLong} className={primaryButtonClass}>
          {saving ? tc("saving") : tc("saveChanges")}
        </button>
      </div>
    </form>
  );
}

/** "My company" — /supplier/profile (briefing §4.7). */
const SupplierProfile = () => {
  const t = useTranslations("SupplierProfile");
  const { data: supplier, loading, reload } = useApiData(getMySupplierAction, undefined);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={supplier ? `${supplier.name} · ${supplier.memberNumber}` : t("description")}
        actions={
          supplier?.isActive && (
            <a href={`${WEBSITE_URL}/suppliers/${supplier.slug}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
              <BiLinkExternal size={16} /> {t("viewPublic")}
            </a>
          )
        }
      />
      <p className="-mt-2 text-sm text-gray-500">{t("nameHint")}</p>
      {loading ? <FormSkeleton /> : supplier ? <ProfileForm key={supplier.logo + supplier._id} supplier={supplier} onSaved={reload} /> : null}
    </div>
  );
};

export default SupplierProfile;
