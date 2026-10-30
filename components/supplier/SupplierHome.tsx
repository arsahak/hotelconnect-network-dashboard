"use client";

import { listInvitationsAction, type Invitation } from "@/app/actions/supplierTender";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, cardTitleClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiGift, BiLinkExternal, BiRightArrowAlt, BiStore } from "react-icons/bi";
import { ProfileChecklist } from "./ProfileChecklist";
import { InvitationStatusBadge } from "./tenders/InvitationStatusBadge";

function Stat({ label, value, tone }: { label: string; value: number; tone?: "brass" | "green" }) {
  return (
    <div className="rounded border border-gray-200 bg-white p-5">
      <p className={tone === "green" ? "font-display text-4xl text-moss-600" : tone === "brass" ? "font-display text-4xl text-brass-600" : "font-display text-4xl text-gray-950"}>{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}

function InvitationRow({ inv }: { inv: Invitation }) {
  const optionLabel = useOptionLabel();
  return (
    <li>
      <Link href={`/supplier/tenders/${inv._id}`} className="flex items-start justify-between gap-4 rounded-lg px-3 py-3 hover:bg-gray-50">
        <span className="min-w-0">
          <span className="block truncate font-medium text-gray-900">{inv.title}</span>
          <span className="block truncate text-xs text-gray-500">
            {inv.hotel.name} · {optionLabel("tenderTypes", inv.type)}
          </span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <InvitationStatusBadge status={inv.myStatus} />
          {inv.acceptingOffers && <DateBadge value={inv.deadline} />}
        </span>
      </Link>
    </li>
  );
}

/**
 * Supplier start page (briefing §4.3): new requests, the state of running
 * quotes, results — plus shortcuts to the profile and the vouchers.
 */
const SupplierHome = () => {
  const t = useTranslations("SupplierHome");
  const { name } = useSessionUser();
  const { data, loading } = useApiData(listInvitationsAction, undefined);
  const invitations = data ?? [];

  const toQuote = invitations.filter((i) => i.myStatus === "open");
  const running = invitations.filter((i) => i.myStatus === "submitted");
  const results = invitations.filter((i) => i.myStatus === "won" || i.myStatus === "lost").slice(0, 5);
  const won = invitations.filter((i) => i.myStatus === "won").length;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("welcome", { name: name.split(" ")[0] || name })} description={t("intro")} />

      <ProfileChecklist />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={t("stats.toQuote")} value={toQuote.length} tone="brass" />
        <Stat label={t("stats.running")} value={running.length} />
        <Stat label={t("stats.won")} value={won} tone="green" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={cardClass}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className={cardTitleClass.replace("mb-4 ", "")}>{t("newRequests")}</h2>
            <Link href="/supplier/tenders" className="inline-flex items-center gap-1 text-xs font-medium text-primary-dark hover:underline">
              {t("all")} <BiRightArrowAlt size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="h-24 animate-pulse rounded bg-gray-50" />
          ) : toQuote.length ? (
            <ul className="-mx-3 divide-y divide-gray-100">{toQuote.map((inv) => <InvitationRow key={inv._id} inv={inv} />)}</ul>
          ) : (
            <p className="py-6 text-sm text-gray-500">{t("noNewRequests")}</p>
          )}
        </section>

        <section className={cardClass}>
          <h2 className={cardTitleClass}>{t("runningQuotes")}</h2>
          {loading ? (
            <div className="h-24 animate-pulse rounded bg-gray-50" />
          ) : running.length || results.length ? (
            <ul className="-mx-3 divide-y divide-gray-100">{[...running, ...results].map((inv) => <InvitationRow key={inv._id} inv={inv} />)}</ul>
          ) : (
            <p className="py-6 text-sm text-gray-500">{t("noQuotes")}</p>
          )}
        </section>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/supplier/profile" className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-100 text-brass-600 group-hover:bg-primary group-hover:text-white">
            <BiStore size={20} />
          </span>
          <span>
            <span className="block font-display text-xl text-gray-950">{t("profile.title")}</span>
            <span className="mt-1 block text-sm text-gray-500">{t("profile.description")}</span>
          </span>
        </Link>
        {/* Signs the supplier in on the website, where vouchers can be booked (briefing §2.4). */}
        <a href="/api/website-login?next=/suppliers/vouchers" className="group flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-100 text-brass-600 group-hover:bg-primary group-hover:text-white">
            <BiGift size={20} />
          </span>
          <span>
            <span className="flex items-center gap-1 font-display text-xl text-gray-950">
              {t("vouchers.title")} <BiLinkExternal size={16} className="text-brass-500" />
            </span>
            <span className="mt-1 block text-sm text-gray-500">{t("vouchers.description")}</span>
          </span>
        </a>
      </div>
    </div>
  );
};

export default SupplierHome;
