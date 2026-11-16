"use client";

import { addLogAction, fixIssueAction, getTodayAction, listIssuesAction } from "@/app/actions/floor";
import { inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { withBase } from "@/lib/basePath";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCart, BiCheck, BiDownload, BiDroplet, BiError, BiPlus, BiPrinter, BiWrench } from "react-icons/bi";

function Tile({ href, icon, value, label, alert }: { href: string; icon: React.ReactNode; value: string; label: string; alert?: boolean }) {
  return (
    <Link href={href} className={cn("flex items-center gap-4 rounded border bg-white p-4 transition-colors hover:border-primary/40", alert ? "border-red-200" : "border-gray-200")}>
      <span className={cn("grid size-11 place-items-center rounded-full", alert ? "bg-red-50 text-red-600" : "bg-brass-100 text-brass-600")}>{icon}</span>
      <span>
        <span className="block font-display text-2xl text-gray-950">{value}</span>
        <span className="block text-xs text-gray-500">{label}</span>
      </span>
    </Link>
  );
}

/**
 * Manager Cockpit (Master Briefing v4, part 4): live alerts, today's
 * schedule and every open issue across departments, with PDF and Excel.
 */
export function ManagerCockpit() {
  const t = useTranslations("Cockpit");
  const tf = useTranslations("Floor");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const { data: today, reload } = useApiData(getTodayAction, undefined);
  const { data: issues, reload: reloadIssues } = useApiData(listIssuesAction, { status: "open" });
  const [full, setFull] = useState(false);
  const [note, setNote] = useState("");
  const missed = today?.missedYesterday.reduce((sum, s) => sum + s.missed, 0) ?? 0;

  return (
    <section aria-labelledby="cockpit-title" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="cockpit-title" className="font-display text-2xl text-gray-950">
          {t("title")}
        </h2>
        <div className="flex gap-2 print:hidden">
          <button type="button" onClick={() => window.print()} className={outlineButtonClass}>
            <BiPrinter size={16} /> PDF
          </button>
          <a href={withBase("/api/floor/export/issues")} className={outlineButtonClass}>
            <BiDownload size={16} /> Excel
          </a>
        </div>
      </div>

      {missed > 0 && today && (
        <Link href="/floor/checklists?list=mod" className="flex items-center gap-3 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <BiError size={20} />
          <span>
            <strong>{tf("missedYesterday", { count: missed })}</strong> · {today.missedYesterday.map((s) => `${t("modRound")} ${tf(`shifts.${s.shift || "morning"}`)}: ${s.missed}`).join(" · ")}
          </span>
        </Link>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Tile href="/floor" icon={<BiWrench size={20} />} value={String(today?.openIssues ?? "–")} label={t("openIssues")} alert={(today?.openIssues ?? 0) > 0} />
        <Tile
          href="/floor/checklists?list=legionella"
          icon={<BiDroplet size={20} />}
          value={today ? `${today.flush.done}/${today.flush.total}` : "–"}
          label={today?.flush.overdue ? t("flushOverdue", { count: today.flush.overdue }) : t("flushed")}
          alert={Boolean(today?.flush.overdue)}
        />
        <Tile href="/floor/procure" icon={<BiCart size={20} />} value={String(today?.orderQueue ?? "–")} label={t("orderQueue")} />
      </div>

      <div className="rounded border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{tf("schedule")}</h3>
          <form
            className="flex gap-2 print:hidden"
            onSubmit={async (e) => {
              e.preventDefault();
              const res = await addLogAction({ kind: "handover", text: note });
              if (res.ok) {
                setNote("");
                reload();
              } else toast.error(res.error || tc("error"));
            }}
          >
            <input aria-label={tf("log.handover")} required minLength={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={tf("log.placeholder.handover")} className={`${inputClass} w-56`} />
            <button type="submit" className={primaryButtonClass} aria-label={tf("log.add")}>
              <BiPlus size={16} />
            </button>
          </form>
        </div>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-700">
          {today?.appointments.map((a) => (
            <li key={a._id}>
              <strong className="text-gray-950">{a.time}</strong> {a.text}
            </li>
          ))}
          {today?.dueTasks.map((d) => (
            <li key={d._id}>
              <strong className="text-gray-950">{d.external ? tf("external") : tf("maintenance")}:</strong> {d.label}
            </li>
          ))}
          {today?.handovers.map((h) => (
            <li key={h._id}>
              <strong className="text-gray-950">{tf("handover")}:</strong> “{h.text}”
            </li>
          ))}
          {today && !today.appointments.length && !today.dueTasks.length && !today.handovers.length && <li className="text-gray-500">{tf("nothingToday")}</li>}
        </ul>
      </div>

      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t("liveOps")}</h3>
          <div className="flex gap-1 print:hidden" role="group" aria-label={t("view")}>
            {[false, true].map((v) => (
              <button key={String(v)} type="button" aria-pressed={full === v} onClick={() => setFull(v)} className={cn("rounded px-3 py-1 text-xs font-semibold", full === v ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}>
                {v ? t("full") : t("compact")}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full min-w-[36rem] text-left text-sm">
          <tbody className="divide-y divide-gray-100">
            {issues?.map((i) => (
              <tr key={i._id} className="align-top">
                <td className="px-4 py-2.5 font-medium text-gray-950">{i.space?.name ?? i.location ?? "—"}</td>
                <td className="px-4 py-2.5 text-gray-500">{i.department === "FB" ? "F&B" : i.department}</td>
                <td className="px-4 py-2.5">
                  <span className="text-gray-900">{i.title}</span>
                  {full && (
                    <span className="block text-xs text-gray-500">
                      {i.reporterName} · {format.relativeTime(new Date(i.createdAt))}
                      {i.photo && (
                        <>
                          {" · "}
                          <a href={i.photo} target="_blank" rel="noopener noreferrer" className="underline">
                            {tf("photo")}
                          </a>
                        </>
                      )}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className={cn("rounded px-2 py-0.5 text-xs font-semibold", i.outOfOrder ? "bg-red-600 text-white" : "bg-brass-100 text-brass-700")}>{i.outOfOrder ? t("ooo") : t("open")}</span>
                </td>
                <td className="px-4 py-2.5 text-right print:hidden">
                  <button
                    type="button"
                    aria-label={tf("fix")}
                    title={i.outOfOrder ? tf("fixRelease") : tf("fix")}
                    onClick={async () => {
                      const res = await fixIssueAction(i._id);
                      if (res.ok) {
                        reloadIssues();
                        reload();
                      } else toast.error(res.error || tc("error"));
                    }}
                    className="grid size-8 place-items-center rounded text-moss-600 hover:bg-moss-100"
                  >
                    <BiCheck size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {issues && !issues.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  {tf("noIssues")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
