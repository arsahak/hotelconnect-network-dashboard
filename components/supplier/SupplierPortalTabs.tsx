"use client";

import { myBillingAction } from "@/app/actions/billing";
import { listPartnerHotelsAction } from "@/app/actions/mySupplier";
import { listInvitationsAction } from "@/app/actions/supplierTender";
import { useApiData } from "@/lib/useApiData";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiBuildingHouse, BiBroadcast, BiStore } from "react-icons/bi";

/**
 * Supplier portal header (Master Briefing v4, part 5): the membership status
 * line and the three tabs — Open Tenders · My Partner Hotels · Company Profile.
 */
export function SupplierPortalTabs() {
  const t = useTranslations("SupplierPortal");
  const format = useFormatter();
  const pathname = usePathname();
  const { data: billing } = useApiData(myBillingAction, undefined);
  const { data: tenders } = useApiData(listInvitationsAction, undefined);
  const { data: partners } = useApiData(listPartnerHotelsAction, undefined);

  const freeUntil = billing?.subscription?.freeUntil ?? billing?.prices.supplierFreeUntil ?? null;
  const free = freeUntil ? new Date(freeUntil) > new Date() : false;
  const openCount = tenders?.filter((i) => i.myStatus === "open").length;

  const tabs = [
    { href: "/supplier/tenders", label: t("openTenders"), count: openCount, icon: BiBroadcast },
    { href: "/supplier/partners", label: t("partnerHotels"), count: partners?.length, icon: BiBuildingHouse },
    { href: "/supplier/profile", label: t("companyProfile"), count: undefined, icon: BiStore },
  ];

  return (
    <div className="flex flex-col gap-4">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded bg-ink-950 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white">
        <BiBroadcast size={16} className="text-brass-400" aria-hidden="true" />
        <span>
          {t("membershipStatus")}:{" "}
          {free && freeUntil ? t("freeUntil", { date: format.dateTime(new Date(freeUntil), { dateStyle: "long" }) }) : t("active")}
        </span>
        <span aria-hidden="true" className="text-brass-400">•</span>
        <span>{t("zeroCommission")}</span>
      </p>
      <nav aria-label={t("tabs")} className="flex gap-1 overflow-x-auto rounded border border-gray-200 bg-white p-1">
        {tabs.map(({ href, label, count, icon: Icon }) => {
          const active = pathname.endsWith(href) || pathname.includes(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded px-4 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-950",
              )}
            >
              <Icon size={17} />
              {label}
              {count !== undefined && (
                <span className={cn("rounded-full px-2 text-xs", active ? "bg-white/20" : "bg-gray-100 text-gray-700")}>{count}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
