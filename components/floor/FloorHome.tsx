"use client";

import { addLogAction, deleteLogAction, fixIssueAction, getTodayAction, listIssuesAction, type Department, type Issue } from "@/app/actions/floor";
import { setLocaleAction } from "@/app/actions/locale";
import { inputClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCart, BiCheckCircle, BiClipboard, BiError, BiPlus, BiPackage, BiTrash, BiWrench } from "react-icons/bi";
import { InstallBanner } from "./InstallBanner";

export const DEPARTMENTS: Department[] = ["HSK", "TD", "FO", "FB"];

/** NL / EN switch: changes the whole app at once. */
function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  return (
    <div className="flex gap-1 rounded border border-gray-200 bg-white p-0.5" role="group" aria-label="Language">
      {(["nl", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={locale === l}
          onClick={async () => {
            await setLocaleAction(l);
            router.refresh();
          }}
          className={cn("rounded px-2.5 py-1 text-xs font-semibold uppercase", locale === l ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

/** Handover note or appointment. */
function AddLog({ onAdded }: { onAdded: () => void }) {
  const t = useTranslations("Floor");
  const tc = useTranslations("Common");
  const [kind, setKind] = useState<"handover" | "appointment">("handover");
  const [time, setTime] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const res = await addLogAction({ kind, text, time: kind === "appointment" ? time : "" });
        setBusy(false);
        if (res.ok) {
          setText("");
          setTime("");
          onAdded();
        } else toast.error(res.error || tc("error"));
      }}
    >
      <select aria-label={t("log.kind")} value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className={`${inputClass} sm:w-44`}>
        <option value="handover">{t("log.handover")}</option>
        <option value="appointment">{t("log.appointment")}</option>
      </select>
      {kind === "appointment" && <input aria-label={t("log.time")} type="time" required value={time} onChange={(e) => setTime(e.target.value)} className={`${inputClass} sm:w-32`} />}
      <input aria-label={t("log.text")} required minLength={2} maxLength={300} value={text} onChange={(e) => setText(e.target.value)} placeholder={t(`log.placeholder.${kind}`)} className={`${inputClass} flex-1`} />
      <button type="submit" disabled={busy} className={primaryButtonClass}>
        <BiPlus size={16} /> {t("log.add")}
      </button>
    </form>
  );
}

function IssueCard({ issue, onFixed }: { issue: Issue; onFixed: () => void }) {
  const t = useTranslations("Floor");
  const tc = useTranslations("Common");
  const format = useFormatter();
  return (
    <li className={cn("rounded border bg-white p-4", issue.outOfOrder ? "border-red-200" : "border-gray-200")}>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
        <span className="text-gray-900">{issue.space?.name ? t("room", { name: issue.space.name }) : issue.location || t("noLocation")}</span>
        {issue.department && <span className="text-gray-400">· {issue.department}</span>}
        {issue.outOfOrder && <span className="rounded bg-red-600 px-2 py-0.5 text-white">{t("outOfOrder")}</span>}
      </div>
      <div className="mt-2 flex gap-3">
        {issue.photo && (
          <a href={issue.photo} target="_blank" rel="noopener noreferrer" className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={issue.photo} alt={t("photo")} className="size-16 rounded object-cover" />
          </a>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-900">{issue.title}</p>
          <p className="mt-1 text-xs text-gray-500">
            {issue.reporterName} · {format.relativeTime(new Date(issue.createdAt))}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={async () => {
          const res = await fixIssueAction(issue._id);
          if (res.ok) {
            toast.success(t("fixed"));
            onFixed();
          } else toast.error(res.error || tc("error"));
        }}
        className="mt-3 inline-flex items-center gap-1.5 rounded bg-moss-600 px-3 py-2 text-sm font-medium text-white hover:bg-moss-600/90"
      >
        <BiCheckCircle size={16} /> {issue.outOfOrder ? t("fixRelease") : t("fix")}
      </button>
    </li>
  );
}

/**
 * The floor app start screen (Master Briefing v4, part 3): shift handover and
 * today's schedule, manager alerts, department filter, the four big buttons
 * and the open issues.
 */
export default function FloorHome() {
  const t = useTranslations("Floor");
  const tc = useTranslations("Common");
  const { data: today, reload } = useApiData(getTodayAction, undefined);
  const [department, setDepartment] = useState<Department | "" | null>(null);
  // Staff start on their own department; FO / MOD and managers on "All".
  const dept = department ?? (today && today.me.department !== "FO" && !today.manager ? today.me.department : "");
  const { data: issues, reload: reloadIssues } = useApiData(listIssuesAction, { status: "open", department: dept || undefined });

  const actions = [
    { href: "/floor/report", label: t("actions.report"), icon: BiWrench, tone: "bg-red-600 text-white hover:bg-red-700" },
    { href: "/floor/procure", label: t("actions.procure"), icon: BiCart, tone: "bg-white text-gray-900 hover:border-primary" },
    { href: "/floor/checklists", label: t("actions.checklists"), icon: BiClipboard, tone: "bg-white text-gray-900 hover:border-primary" },
    { href: "/floor/inventory", label: t("actions.inventory"), icon: BiPackage, tone: "bg-white text-gray-900 hover:border-primary" },
  ];
  const missed = today?.missedYesterday.reduce((sum, s) => sum + s.missed, 0) ?? 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-4 bg-gray-50">
      <header className="flex items-start justify-between gap-3 rounded border border-gray-200 bg-white p-4">
        <div>
          <p className="font-display text-xl text-gray-950">{today?.hotel || "…"}</p>
          {today && (
            <p className="text-sm text-gray-500">
              {t("loggedIn", { name: today.me.name })} ({today.me.department ? t(`departments.${today.me.department}`) : t("departments.all")} / {t(`roles.${today.me.hotelRole}`)})
            </p>
          )}
        </div>
        <LanguageSwitch />
      </header>

      <InstallBanner />

      <section className="rounded border border-gray-200 bg-white p-4" aria-labelledby="schedule-title">
        <h2 id="schedule-title" className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t("schedule")}
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {today?.appointments.map((a) => (
            <li key={a._id} className="flex items-start justify-between gap-2">
              <span>
                <strong className="font-semibold text-gray-950">{a.time}</strong> {a.text}
              </span>
              <button type="button" aria-label={tc("delete")} onClick={async () => (await deleteLogAction(a._id)).ok && reload()} className="text-gray-300 hover:text-red-600">
                <BiTrash size={15} />
              </button>
            </li>
          ))}
          {today?.dueTasks.map((task) => (
            <li key={task._id} className="flex items-center gap-2">
              <span className="rounded bg-brass-100 px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase text-brass-700">{task.external ? t("external") : t("maintenance")}</span>
              <Link href="/floor/checklists?list=preventive" className="text-gray-900 hover:underline">
                {task.label}
              </Link>
            </li>
          ))}
          {today?.handovers.map((h) => (
            <li key={h._id} className="flex items-start justify-between gap-2">
              <span>
                <span className="font-semibold text-gray-950">{t("handover")}:</span> “{h.text}” <span className="text-xs text-gray-400">— {h.authorName}</span>
              </span>
              <button type="button" aria-label={tc("delete")} onClick={async () => (await deleteLogAction(h._id)).ok && reload()} className="text-gray-300 hover:text-red-600">
                <BiTrash size={15} />
              </button>
            </li>
          ))}
          {today && !today.appointments.length && !today.dueTasks.length && !today.handovers.length && <li className="text-gray-500">{t("nothingToday")}</li>}
        </ul>
        <AddLog onAdded={reload} />
      </section>

      {today?.manager && (
        <section className="grid gap-3 sm:grid-cols-2" aria-label={t("managersOnly")}>
          <Link href="/floor/checklists?list=mod" className={cn("flex items-center gap-3 rounded border p-4", missed ? "border-red-200 bg-red-50" : "border-gray-200 bg-white")}>
            <BiError size={22} className={missed ? "text-red-600" : "text-gray-400"} />
            <span className="text-sm">
              <strong className="block text-gray-950">{t("missedYesterday", { count: missed })}</strong>
              <span className="text-gray-500">{today.missedYesterday.map((s) => `${t(`shifts.${s.shift || "morning"}`)}: ${s.missed}`).join(" · ") || t("allDone")}</span>
            </span>
          </Link>
          <Link href="/floor/procure" className="flex items-center gap-3 rounded border border-gray-200 bg-white p-4">
            <BiCart size={22} className="text-brass-600" />
            <span className="text-sm">
              <strong className="block text-gray-950">{t("orderQueue", { count: today.orderQueue ?? 0 })}</strong>
              <span className="text-gray-500">{t("flushed", { done: today.flush.done, total: today.flush.total })}</span>
            </span>
          </Link>
        </section>
      )}

      <nav className="flex gap-1 overflow-x-auto rounded border border-gray-200 bg-white p-1" aria-label={t("filter")}>
        {(["", ...DEPARTMENTS] as const).map((d) => (
          <button
            key={d || "all"}
            type="button"
            aria-pressed={dept === d}
            onClick={() => setDepartment(d)}
            className={cn("shrink-0 rounded px-4 py-2 text-sm font-semibold", dept === d ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50")}
          >
            {d ? (d === "FB" ? "F&B" : d) : t("all")}
          </button>
        ))}
      </nav>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ href, label, icon: Icon, tone }) => (
          <Link key={href} href={href} className={cn("flex min-h-20 items-center justify-center gap-2 rounded border border-gray-200 p-4 text-center text-sm font-semibold uppercase tracking-wide transition-colors", tone)}>
            <Icon size={22} /> {label}
          </Link>
        ))}
      </div>

      <section aria-labelledby="issues-title">
        <h2 id="issues-title" className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t("openIssues", { count: issues?.length ?? 0 })}
        </h2>
        <ul className="space-y-3">
          {issues?.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onFixed={() => {
                reloadIssues();
                reload();
              }}
            />
          ))}
          {issues && !issues.length && <li className="rounded border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-500">{t("noIssues")}</li>}
        </ul>
      </section>
    </div>
  );
}
