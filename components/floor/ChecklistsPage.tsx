"use client";

import {
  addEntryAction,
  addItemAction,
  addWasteAction,
  getChecklistAction,
  getTodayAction,
  listSpacesAction,
  listWasteAction,
  removeItemAction,
  updateSpaceAction,
  type Checklist,
  type ChecklistEntry,
  type ChecklistItem,
  type ChecklistKind,
  type Shift,
  type WasteReason,
} from "@/app/actions/floor";
import { cardClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { withBase } from "@/lib/basePath";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheck, BiDownload, BiPlus, BiPrinter, BiTrash } from "react-icons/bi";

type Tab = ChecklistKind | "waste";
const TABS: Tab[] = ["legionella", "haccp", "mod", "preventive", "waste"];
const SHIFTS: Shift[] = ["morning", "evening", "night"];
const REASONS: WasteReason[] = ["leftover_buffet", "expired", "breakage", "prep_error"];

/** Export (CSV for Excel) and print (PDF with a signature line). */
function ExportBar({ list }: { list: Tab }) {
  const t = useTranslations("Floor.checklists");
  return (
    <div className="flex flex-wrap gap-2 print:hidden">
      <a href={withBase(`/api/floor/export/${list}`)} className={outlineButtonClass}>
        <BiDownload size={16} /> {t("excel")}
      </a>
      <button type="button" onClick={() => window.print()} className={outlineButtonClass}>
        <BiPrinter size={16} /> {t("pdf")}
      </button>
    </div>
  );
}

function SignatureLine() {
  const t = useTranslations("Floor.checklists");
  return (
    <div className="mt-10 hidden grid-cols-2 gap-10 text-sm print:grid">
      <p className="border-t border-gray-400 pt-2">{t("signature")}</p>
      <p className="border-t border-gray-400 pt-2">{t("dateLine")}</p>
    </div>
  );
}

/** Temperature input + save, for HACCP temperatures. */
function TempInput({ onSave, label }: { onSave: (v: string) => void; label: string }) {
  const [value, setValue] = useState("");
  return (
    <span className="flex gap-1.5">
      <input aria-label={label} inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} placeholder="°C" className={`${inputClass} w-20`} />
      <button type="button" disabled={value === ""} onClick={() => onSave(value)} className={primaryButtonClass} aria-label={label}>
        <BiCheck size={16} />
      </button>
    </span>
  );
}

function Legionella({ data, reload }: { data: Extract<Checklist, { list: "legionella" }>; reload: () => void }) {
  const t = useTranslations("Floor.checklists");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const [temps, setTemps] = useState<Record<string, { cold: string; warm: string }>>({});
  const { data: spaces } = useApiData(listSpacesAction, undefined);
  const [vacantRoom, setVacantRoom] = useState("");
  const [vacantSince, setVacantSince] = useState("");

  const save = async (space: string) => {
    const v = temps[space];
    const res = await addEntryAction("legionella", { space, value: v?.cold, value2: v?.warm });
    if (res.ok && res.data) {
      if (res.data.ok) toast.success(t("saved"));
      else toast.error(t("redAlert", { cold: data.limits.coldMax, warm: data.limits.warmMin }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">{t("legionellaIntro", { cold: data.limits.coldMax, warm: data.limits.warmMin, days: data.limits.flushEveryDays })}</p>
      <ul className="divide-y divide-gray-100 rounded border border-gray-200 bg-white">
        {data.points.map((p) => (
          <li key={p.space._id} className="flex flex-wrap items-center justify-between gap-3 p-3">
            <span className="text-sm">
              <strong className="text-gray-950">{p.space.name}</strong>
              {p.space.vacantSince && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{t("vacant")}</span>}
              <span className={cn("block text-xs", p.last && !p.last.ok ? "font-semibold text-red-600" : p.overdue ? "font-semibold text-red-600" : "text-gray-500")}>
                {p.last
                  ? `${format.dateTime(new Date(p.last.date), { dateStyle: "medium" })} · ${p.last.value}°C / ${p.last.value2}°C · ${p.last.signerName}`
                  : t("overdue", { days: data.limits.flushEveryDays })}
              </span>
            </span>
            {!p.flushedToday ? (
              <span className="flex gap-1.5 print:hidden">
                <input aria-label={t("cold")} inputMode="decimal" placeholder={t("cold")} value={temps[p.space._id]?.cold ?? ""} onChange={(e) => setTemps((s) => ({ ...s, [p.space._id]: { cold: e.target.value, warm: s[p.space._id]?.warm ?? "" } }))} className={`${inputClass} w-20`} />
                <input aria-label={t("warm")} inputMode="decimal" placeholder={t("warm")} value={temps[p.space._id]?.warm ?? ""} onChange={(e) => setTemps((s) => ({ ...s, [p.space._id]: { warm: e.target.value, cold: s[p.space._id]?.cold ?? "" } }))} className={`${inputClass} w-20`} />
                <button type="button" onClick={() => save(p.space._id)} className={primaryButtonClass}>
                  {t("flushed")}
                </button>
              </span>
            ) : (
              <span className="text-xs font-semibold text-moss-600">✓ {t("doneToday")}</span>
            )}
          </li>
        ))}
        {!data.points.length && <li className="p-4 text-sm text-gray-500">{t("noPoints")}</li>}
      </ul>
      <div className={`${cardClass} print:hidden`}>
        <p className="mb-2 text-sm font-medium text-gray-900">{t("addVacant")}</p>
        <div className="flex flex-wrap gap-2">
          <select aria-label={t("room")} value={vacantRoom} onChange={(e) => setVacantRoom(e.target.value)} className={`${inputClass} w-auto`}>
            <option value="">{t("room")}…</option>
            {spaces?.filter((s) => s.kind === "room").map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <input aria-label={t("emptySince")} type="date" value={vacantSince} onChange={(e) => setVacantSince(e.target.value)} className={`${inputClass} w-auto`} />
          <button
            type="button"
            disabled={!vacantRoom || !vacantSince}
            onClick={async () => {
              const res = await updateSpaceAction(vacantRoom, { vacantSince });
              if (res.ok) {
                toast.success(t("saved"));
                reload();
              } else toast.error(res.error || tc("error"));
            }}
            className={outlineButtonClass}
          >
            <BiPlus size={16} /> {t("addVacantButton")}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">{t("addVacantHint", { days: data.limits.vacantDays })}</p>
      </div>
    </div>
  );
}

/** HACCP, MOD round and preventive maintenance: items with ticks / °C. */
function ItemList({ data, manager, shift, reload }: { data: Extract<Checklist, { list: "haccp" | "mod" | "preventive" }>; manager: boolean; shift: Shift; reload: () => void }) {
  const t = useTranslations("Floor.checklists");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const entryOf = (item: ChecklistItem): ChecklistEntry | undefined => data.entries.find((e) => e.item === item._id && (data.list !== "mod" || e.shift === shift));
  const sections = [...new Set(data.items.map((i) => i.section))];

  const tick = async (item: ChecklistItem, value?: string) => {
    const res = await addEntryAction(data.list, { item: item._id, value: value ?? null, shift: data.list === "mod" ? shift : "" });
    if (res.ok && res.data) {
      if (res.data.ok) toast.success(t("saved"));
      else toast.error(t("outOfLimit"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section || "-"} className="rounded border border-gray-200 bg-white">
          {section && <h3 className="border-b border-gray-100 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">{section}</h3>}
          <ul className="divide-y divide-gray-100">
            {data.items
              .filter((i) => i.section === section)
              .map((item) => {
                const entry = entryOf(item);
                const due = item.nextDue && new Date(item.nextDue) <= new Date();
                return (
                  <li key={item._id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                    <span className="text-sm">
                      <span className="text-gray-950">{item.label}</span>
                      {item.external && <span className="ml-2 rounded bg-brass-100 px-1.5 py-0.5 text-xs text-brass-700">{t("external")}</span>}
                      <span className="block text-xs text-gray-500">
                        {item.kind === "temp" && [item.minC != null && `≥ ${item.minC}°C`, item.maxC != null && `≤ ${item.maxC}°C`].filter(Boolean).join(" · ")}
                        {data.list === "preventive" && item.nextDue && (
                          <span className={due ? "font-semibold text-red-600" : undefined}>
                            {t("nextDue", { date: format.dateTime(new Date(item.nextDue), { dateStyle: "medium" }) })}
                            {item.intervalDays ? ` · ${t("every", { days: item.intervalDays })}` : ""}
                          </span>
                        )}
                      </span>
                      {entry && (
                        <span className={cn("block text-xs", entry.ok ? "text-moss-600" : "font-semibold text-red-600")}>
                          ✓ {entry.value != null ? `${entry.value}°C · ` : ""}
                          {entry.signerName}
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 print:hidden">
                      {item.kind === "temp" ? (
                        <TempInput label={item.label} onSave={(v) => tick(item, v)} />
                      ) : (
                        !entry && (
                          <button type="button" onClick={() => tick(item)} className={primaryButtonClass}>
                            <BiCheck size={16} /> {t("done")}
                          </button>
                        )
                      )}
                      {manager && (
                        <button type="button" aria-label={tc("delete")} onClick={async () => window.confirm(t("confirmRemove")) && (await removeItemAction(item._id)).ok && reload()} className="text-gray-300 hover:text-red-600">
                          <BiTrash size={16} />
                        </button>
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
      {manager && <AddItem list={data.list} onAdded={reload} />}
    </div>
  );
}

function AddItem({ list, onAdded }: { list: "haccp" | "mod" | "preventive"; onAdded: () => void }) {
  const t = useTranslations("Floor.checklists");
  const tc = useTranslations("Common");
  const [form, setForm] = useState({ section: "", label: "", kind: "check" as "check" | "temp", minC: "", maxC: "", intervalDays: "", external: false });
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      className={`${cardClass} print:hidden`}
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await addItemAction(list, {
          section: form.section,
          label: form.label,
          kind: list === "haccp" ? form.kind : "check",
          minC: form.minC === "" ? null : Number(form.minC),
          maxC: form.maxC === "" ? null : Number(form.maxC),
          intervalDays: list === "preventive" && form.intervalDays ? Number(form.intervalDays) : null,
          external: form.external,
        });
        if (res.ok) {
          setForm({ ...form, label: "" });
          onAdded();
        } else toast.error(res.error || tc("error"));
      }}
    >
      <p className="mb-2 text-sm font-medium text-gray-900">{t(`add.${list}`)}</p>
      <div className="flex flex-wrap gap-2">
        {list !== "preventive" && <input aria-label={t("section")} placeholder={t("section")} value={form.section} onChange={(e) => set("section", e.target.value)} className={`${inputClass} w-40`} />}
        <input aria-label={t("itemName")} required minLength={2} placeholder={t("itemName")} value={form.label} onChange={(e) => set("label", e.target.value)} className={`${inputClass} min-w-48 flex-1`} />
        {list === "haccp" && (
          <>
            <select aria-label={t("kind")} value={form.kind} onChange={(e) => set("kind", e.target.value)} className={`${inputClass} w-auto`}>
              <option value="check">{t("checkbox")}</option>
              <option value="temp">°C</option>
            </select>
            {form.kind === "temp" && (
              <>
                <input aria-label={t("minC")} placeholder={t("minC")} inputMode="decimal" value={form.minC} onChange={(e) => set("minC", e.target.value)} className={`${inputClass} w-24`} />
                <input aria-label={t("maxC")} placeholder={t("maxC")} inputMode="decimal" value={form.maxC} onChange={(e) => set("maxC", e.target.value)} className={`${inputClass} w-24`} />
              </>
            )}
          </>
        )}
        {list === "preventive" && (
          <>
            <input aria-label={t("intervalDays")} required placeholder={t("intervalDays")} inputMode="numeric" value={form.intervalDays} onChange={(e) => set("intervalDays", e.target.value)} className={`${inputClass} w-32`} />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.external} onChange={(e) => set("external", e.target.checked)} /> {t("external")}
            </label>
          </>
        )}
        <button type="submit" className={primaryButtonClass}>
          <BiPlus size={16} /> {tc("add")}
        </button>
      </div>
    </form>
  );
}

function WasteList() {
  const t = useTranslations("Floor.checklists");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const { data, reload } = useApiData(listWasteAction, undefined);
  const [form, setForm] = useState({ product: "", quantity: "", reason: "leftover_buffet" as WasteReason });

  return (
    <div className="flex flex-col gap-4">
      <form
        className={`${cardClass} flex flex-wrap gap-2 print:hidden`}
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await addWasteAction(form);
          if (res.ok) {
            setForm({ ...form, product: "", quantity: "" });
            reload();
          } else toast.error(res.error || tc("error"));
        }}
      >
        <input aria-label={t("product")} required placeholder={t("product")} value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} className={`${inputClass} min-w-48 flex-1`} />
        <input aria-label={t("quantity")} required placeholder={t("quantity")} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className={`${inputClass} w-32`} />
        <select aria-label={t("reason")} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value as WasteReason })} className={`${inputClass} w-auto`}>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {t(`reasons.${r}`)}
            </option>
          ))}
        </select>
        <button type="submit" className={primaryButtonClass}>
          <BiPlus size={16} /> {tc("add")}
        </button>
      </form>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2">{t("date")}</th>
              <th className="px-3 py-2">{t("product")}</th>
              <th className="px-3 py-2">{t("quantity")}</th>
              <th className="px-3 py-2">{t("reason")}</th>
              <th className="px-3 py-2">{t("by")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data?.map((w) => (
              <tr key={w._id}>
                <td className="px-3 py-2">{format.dateTime(new Date(w.date), { dateStyle: "medium" })}</td>
                <td className="px-3 py-2">{w.product}</td>
                <td className="px-3 py-2">{w.quantity}</td>
                <td className="px-3 py-2">{t(`reasons.${w.reason}`)}</td>
                <td className="px-3 py-2 text-gray-500">{w.authorName}</td>
              </tr>
            ))}
            {data && !data.length && (
              <tr>
                <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
                  {t("noWaste")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Checklists (Master Briefing v4): Legionella, HACCP, MOD round, preventive maintenance and the waste list. */
export default function ChecklistsPage() {
  const t = useTranslations("Floor.checklists");
  const tf = useTranslations("Floor");
  const format = useFormatter();
  const initial = useSearchParams().get("list") as Tab | null;
  const [tab, setTab] = useState<Tab>(initial && TABS.includes(initial) ? initial : "legionella");
  const [shift, setShift] = useState<Shift>("morning");
  const { data: today } = useApiData(getTodayAction, undefined);
  const { data, reload } = useApiData(getChecklistAction, tab === "waste" ? { list: "haccp" as const } : { list: tab, shift: tab === "mod" ? shift : undefined });

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <PageHeader title={t("title")} description={t("description")} back={{ href: "/floor", label: tf("back") }} actions={<ExportBar list={tab} />} />
      <div className="hidden print:block">
        <p className="font-display text-2xl">
          {today?.hotel} — {t(`tabs.${tab}`)}
        </p>
        <p className="text-sm">{format.dateTime(new Date(), { dateStyle: "long" })}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto rounded border border-gray-200 bg-white p-1 print:hidden" aria-label={t("title")}>
        {TABS.map((k) => (
          <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)} className={cn("shrink-0 rounded px-4 py-2 text-sm font-semibold", tab === k ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}>
            {t(`tabs.${k}`)}
          </button>
        ))}
      </nav>

      {tab === "mod" && (
        <div className="flex gap-1 print:hidden" role="group" aria-label={t("shift")}>
          {SHIFTS.map((s) => (
            <button key={s} type="button" aria-pressed={shift === s} onClick={() => setShift(s)} className={cn("rounded border px-4 py-2 text-sm", shift === s ? "border-primary bg-primary/10 font-semibold text-primary-dark" : "border-gray-200 bg-white text-gray-600")}>
              {tf(`shifts.${s}`)}
            </button>
          ))}
        </div>
      )}

      {tab === "waste" ? (
        <WasteList />
      ) : !data || data.list !== tab ? (
        <div className="h-40 animate-pulse rounded border border-gray-200 bg-white" />
      ) : data.list === "legionella" ? (
        <Legionella data={data} reload={reload} />
      ) : (
        <ItemList data={data} manager={Boolean(today?.manager)} shift={shift} reload={reload} />
      )}
      <SignatureLine />
    </div>
  );
}
