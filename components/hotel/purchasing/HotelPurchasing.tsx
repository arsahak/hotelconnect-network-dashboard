"use client";

import { listPurchaseActionsAction, withdrawPurchaseActionAction, type HotelPurchaseAction } from "@/app/actions/purchase";
import { DateBadge } from "@/components/shared/DateBadge";
import { outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { Modal } from "@/components/shared/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCheckCircle, BiTrendingDown } from "react-icons/bi";
import { JoinForm } from "./JoinForm";
import { PurchaseStatusBadge } from "./PurchaseStatusBadge";

function ActionCard({ action, onChange, onJoin }: { action: HotelPurchaseAction; onChange: () => void; onJoin: () => void }) {
  const t = useTranslations("Purchasing");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const mine = action.myParticipation;
  const percent = Math.min(100, Math.round((action.participants / action.targetParticipants) * 100));

  const withdraw = async () => {
    if (!window.confirm(t("confirmWithdraw"))) return;
    const res = await withdrawPurchaseActionAction(action._id);
    if (res.ok) {
      toast.success(t("withdrawn"));
      onChange();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <article className="rounded border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brass-600">{action.category}</p>
          <h2 className="mt-1 font-display text-2xl text-gray-950">{action.title}</h2>
        </div>
        <PurchaseStatusBadge status={action.status} />
      </div>
      {action.description && <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-700">{action.description}</p>}

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <p className="text-xs text-gray-500">{t("participants")}</p>
          <p className="mt-1 font-display text-3xl text-gray-950">
            {action.participants} <span className="text-base text-gray-400">{t("of", { target: action.targetParticipants })}</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={action.participants} aria-valuemin={0} aria-valuemax={action.targetParticipants}>
            <div className="h-full rounded-full bg-brass-500 transition-all" style={{ width: `${percent}%` }} />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t("deadline")}</p>
          <div className="mt-1">
            {action.status === "open" ? <DateBadge value={action.deadline} /> : <span className="text-sm text-gray-700">{format.dateTime(new Date(action.deadline), { dateStyle: "medium", timeZone: "UTC" })}</span>}
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500">{t("expectedSavings")}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-moss-600">
            <BiTrendingDown size={18} /> {action.expectedSavings || "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
        {mine ? (
          <p className="flex items-center gap-2 text-sm text-gray-700">
            <BiCheckCircle size={20} className="text-moss-600" />
            {t("youTakePart", { supplier: mine.currentSupplier, date: format.dateTime(new Date(mine.contractEndDate), { dateStyle: "medium", timeZone: "UTC" }) })}
          </p>
        ) : (
          <p className="text-sm text-gray-500">{t(`hint.${action.status}`)}</p>
        )}
        {mine && action.status === "open" && (
          <button type="button" onClick={withdraw} className={outlineButtonClass}>
            {t("withdraw")}
          </button>
        )}
        {!mine && action.joinable && (
          <button type="button" onClick={onJoin} className={primaryButtonClass}>
            {t("join")}
          </button>
        )}
      </div>
    </article>
  );
}

/** Collectieve inkoop — /hotel/purchasing (briefing §3.13). */
const HotelPurchasing = () => {
  const t = useTranslations("Purchasing");
  const { data, loading, reload } = useApiData(listPurchaseActionsAction, undefined);
  const [joining, setJoining] = useState<HotelPurchaseAction | null>(null);
  const actions = data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("subtitle")} />
      <div className="rounded border border-brass-400/40 bg-brass-100/60 p-5">
        <p className="font-display text-2xl text-ink-950">{t("introTitle")}</p>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700">{t("intro")}</p>
      </div>
      {loading ? (
        <div className="h-56 animate-pulse rounded border border-gray-200 bg-white" />
      ) : actions.length === 0 ? (
        <p className="rounded border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-500">{t("empty")}</p>
      ) : (
        actions.map((action) => <ActionCard key={action._id} action={action} onChange={reload} onJoin={() => setJoining(action)} />)
      )}
      <Modal open={Boolean(joining)} onClose={() => setJoining(null)} title={joining ? t("joinTitle", { title: joining.title }) : ""} className="max-w-lg">
        {joining && (
          <JoinForm
            actionId={joining._id}
            onCancel={() => setJoining(null)}
            onDone={() => {
              setJoining(null);
              reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default HotelPurchasing;
