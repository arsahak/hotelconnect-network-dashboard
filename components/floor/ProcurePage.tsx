"use client";

import {
  addRequestAction,
  deleteProductAction,
  getTodayAction,
  listProductsAction,
  listRequestsAction,
  saveProductAction,
  updateRequestAction,
  type Department,
} from "@/app/actions/floor";
import { Field } from "@/components/shared/form/Field";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheck, BiEnvelope, BiPackage, BiPhone, BiPlus, BiTrash } from "react-icons/bi";
import { DEPARTMENTS } from "./FloorHome";

/** Managers add a product with a photo and the supplier's phone / email. */
function AddProduct({ onAdded }: { onAdded: () => void }) {
  const t = useTranslations("Floor.procure");
  const tf = useTranslations("Floor");
  const tc = useTranslations("Common");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!open)
    return (
      <button type="button" onClick={() => setOpen(true)} className={outlineButtonClass}>
        <BiPlus size={16} /> {t("addProduct")}
      </button>
    );

  return (
    <form
      className={cardClass}
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await saveProductAction(new FormData(e.currentTarget));
        setBusy(false);
        if (res.ok) {
          toast.success(tc("saved"));
          setOpen(false);
          onAdded();
        } else toast.error(res.error || tc("error"));
      }}
    >
      <h2 className={cardTitleClass}>{t("addProduct")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pr-name" label={t("name")} required>
          <input id="pr-name" name="name" required maxLength={120} className={inputClass} />
        </Field>
        <Field id="pr-dept" label={tf("report.department")}>
          <select id="pr-dept" name="department" defaultValue="" className={inputClass}>
            <option value="">{tf("departments.all")}</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {tf(`departments.${d}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field id="pr-sup" label={t("supplier")}>
          <input id="pr-sup" name="supplierName" maxLength={120} className={inputClass} />
        </Field>
        <Field id="pr-phone" label={t("phone")}>
          <input id="pr-phone" name="supplierPhone" type="tel" maxLength={30} className={inputClass} />
        </Field>
        <Field id="pr-email" label={t("email")}>
          <input id="pr-email" name="supplierEmail" type="email" className={inputClass} />
        </Field>
        <Field id="pr-photo" label={t("photo")}>
          <input id="pr-photo" name="photo" type="file" accept="image/*" className="text-sm" />
        </Field>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="submit" disabled={busy} className={primaryButtonClass}>
          {tc("save")}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={outlineButtonClass}>
          {tc("cancel")}
        </button>
      </div>
    </form>
  );
}

/**
 * Visual procurement list (Master Briefing v4): staff tap a product photo to
 * ask for it (no stock counting); managers order by phone or email.
 */
export default function ProcurePage() {
  const t = useTranslations("Floor.procure");
  const tf = useTranslations("Floor");
  const tc = useTranslations("Common");
  const { data: today } = useApiData(getTodayAction, undefined);
  const { data: products, reload } = useApiData(listProductsAction, undefined);
  const { data: requests, reload: reloadRequests } = useApiData(listRequestsAction, undefined);
  const [dept, setDept] = useState<Department | "">("");
  const manager = Boolean(today?.manager);
  const shown = products?.filter((p) => !dept || !p.department || p.department === dept) ?? [];

  const ask = async (id: string, name: string) => {
    const res = await addRequestAction({ product: id });
    if (res.ok) {
      toast.success(t("requested", { name }));
      reloadRequests();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
      <PageHeader title={t("title")} description={t("description")} back={{ href: "/floor", label: tf("back") }} actions={manager && <AddProduct onAdded={reload} />} />

      {manager && (
        <section className={cardClass} aria-labelledby="queue-title">
          <h2 id="queue-title" className={cardTitleClass}>
            {t("queue", { count: requests?.filter((r) => r.status === "requested").length ?? 0 })}
          </h2>
          <ul className="divide-y divide-gray-100">
            {requests?.map((r) => (
              <li key={r._id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm">
                  <strong className="text-gray-950">
                    {r.quantity}× {r.product?.name}
                  </strong>
                  <span className="block text-xs text-gray-500">
                    {r.requesterName} · {r.product?.supplierName}
                  </span>
                </span>
                <span className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={r.status === "requested" ? "brass" : "green"}>{t(`status.${r.status}`)}</StatusBadge>
                  {r.product?.supplierPhone && (
                    <a href={`tel:${r.product.supplierPhone}`} className={outlineButtonClass}>
                      <BiPhone size={16} /> {t("call")}
                    </a>
                  )}
                  {r.product?.supplierEmail && (
                    <a href={`mailto:${r.product.supplierEmail}?subject=${encodeURIComponent(`${t("orderSubject")}: ${r.quantity}× ${r.product.name}`)}`} className={outlineButtonClass}>
                      <BiEnvelope size={16} /> {t("emailOrder")}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={async () => (await updateRequestAction(r._id, r.status === "requested" ? "ordered" : "received")).ok && reloadRequests()}
                    className={primaryButtonClass}
                  >
                    <BiCheck size={16} /> {r.status === "requested" ? t("markOrdered") : t("markReceived")}
                  </button>
                </span>
              </li>
            ))}
            {requests && !requests.length && <li className="py-3 text-sm text-gray-500">{t("queueEmpty")}</li>}
          </ul>
        </section>
      )}

      <nav className="flex gap-1 overflow-x-auto rounded border border-gray-200 bg-white p-1" aria-label={tf("filter")}>
        {(["", ...DEPARTMENTS] as const).map((d) => (
          <button key={d || "all"} type="button" aria-pressed={dept === d} onClick={() => setDept(d)} className={`shrink-0 rounded px-4 py-2 text-sm font-semibold ${dept === d ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}`}>
            {d ? (d === "FB" ? "F&B" : d) : tf("all")}
          </button>
        ))}
      </nav>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((p) => (
          <li key={p._id} className="relative">
            <button type="button" onClick={() => ask(p._id, p.name)} className="flex w-full flex-col overflow-hidden rounded border border-gray-200 bg-white text-left transition-colors hover:border-primary">
              {p.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.photo} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <span className="grid aspect-square w-full place-items-center bg-gray-50 text-gray-300">
                  <BiPackage size={40} />
                </span>
              )}
              <span className="p-3 text-sm font-medium text-gray-900">{p.name}</span>
            </button>
            {manager && (
              <button
                type="button"
                aria-label={tc("delete")}
                onClick={async () => window.confirm(t("confirmRemove", { name: p.name })) && (await deleteProductAction(p._id)).ok && reload()}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded bg-white/90 text-gray-500 hover:text-red-600"
              >
                <BiTrash size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
      {products && !shown.length && <p className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">{manager ? t("emptyManager") : t("empty")}</p>}
      <p className="text-xs text-gray-500">{t("hint")}</p>
    </div>
  );
}
