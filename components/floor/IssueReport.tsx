"use client";

import { createIssueAction, listSpacesAction, type Department } from "@/app/actions/floor";
import { Field } from "@/components/shared/form/Field";
import { Toggle } from "@/components/shared/form/Toggle";
import { cardClass, inputClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCamera } from "react-icons/bi";
import { compressPhoto } from "./compressPhoto";
import { DEPARTMENTS } from "./FloorHome";

/** Report an issue or task (Master Briefing v4): room, department, out of order, photo max 150KB. */
export default function IssueReport() {
  const t = useTranslations("Floor");
  const tc = useTranslations("Common");
  const router = useRouter();
  const { data: spaces } = useApiData(listSpacesAction, undefined);
  const [space, setSpace] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState<Department>("TD");
  const [title, setTitle] = useState("");
  const [outOfOrder, setOutOfOrder] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <PageHeader title={t("report.title")} back={{ href: "/floor", label: t("back") }} />
      <form
        className={cardClass}
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const form = new FormData();
          form.set("title", title);
          form.set("department", department);
          if (space) form.set("space", space);
          else form.set("location", location);
          form.set("outOfOrder", String(Boolean(space) && outOfOrder));
          if (photo) form.set("photo", photo);
          const res = await createIssueAction(form);
          setBusy(false);
          if (res.ok) {
            toast.success(t("report.sent"));
            router.push("/floor");
          } else toast.error(res.error || tc("error"));
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="is-space" label={t("report.room")}>
            <select id="is-space" value={space} onChange={(e) => setSpace(e.target.value)} className={inputClass}>
              <option value="">{t("report.otherPlace")}</option>
              {spaces?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                  {s.outOfOrder ? ` — ${t("outOfOrder")}` : ""}
                </option>
              ))}
            </select>
          </Field>
          {!space && (
            <Field id="is-location" label={t("report.location")}>
              <input id="is-location" maxLength={80} value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t("report.locationPlaceholder")} className={inputClass} />
            </Field>
          )}
          <Field id="is-dept" label={t("report.department")} required>
            <select id="is-dept" value={department} onChange={(e) => setDepartment(e.target.value as Department)} className={inputClass}>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {t(`departments.${d}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="is-title" label={t("report.what")} required className="sm:col-span-2">
            <textarea id="is-title" required minLength={2} maxLength={200} rows={3} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("report.whatPlaceholder")} className={inputClass} />
          </Field>
          {space && (
            <div className="sm:col-span-2">
              <Toggle checked={outOfOrder} onChange={setOutOfOrder} label={t("report.outOfOrder")} description={t("report.outOfOrderHint")} />
            </div>
          )}
          <div className="sm:col-span-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-primary">
              <BiCamera size={18} /> {photo ? t("report.photoReady", { kb: Math.round(photo.size / 1024) }) : t("report.photo")}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const small = await compressPhoto(file);
                  if (small) setPhoto(small);
                  else toast.error(t("report.photoTooBig"));
                }}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">{t("report.photoHint")}</p>
          </div>
        </div>
        <button type="submit" disabled={busy} className={`${primaryButtonClass} mt-6 w-full justify-center sm:w-auto`}>
          {t("report.send")}
        </button>
      </form>
    </div>
  );
}
