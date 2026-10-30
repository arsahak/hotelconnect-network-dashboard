"use client";

import { awardTenderAction, cancelTenderAction, getTenderAction, type Offer } from "@/app/actions/tender";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiCategory, BiEuro, BiFile, BiMap, BiPencil, BiTrophy, BiX } from "react-icons/bi";
import { ReviewCard } from "./ReviewCard";
import { TenderStatusBadge } from "./TenderStatusBadge";

/** Tender details — /hotel/tenders/[id]: the request, the invited suppliers and the quote comparison. */
const TenderDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Tenders");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const { data: tender, loading, reload } = useApiData(getTenderAction, id);
  const [busy, setBusy] = useState<string | null>(null);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!tender) return <PageHeader title={t("notFound")} back={{ href: "/hotel/tenders", label: t("back") }} />;

  const money = (value: number) => format.number(value, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  const open = tender.status === "open";
  const cheapest = tender.offers.length ? Math.min(...tender.offers.map((o) => o.price)) : null;
  const winnerOffer = tender.offers.find((o) => o.status === "won");

  const award = async (offer: Offer) => {
    if (!window.confirm(t("confirmAward", { name: offer.supplier.name }))) return;
    setBusy(offer._id);
    const res = await awardTenderAction(tender._id, offer._id);
    setBusy(null);
    if (res.ok) {
      toast.success(t("awarded", { name: offer.supplier.name }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  const cancel = async () => {
    if (!window.confirm(t("confirmCancel"))) return;
    setBusy("cancel");
    const res = await cancelTenderAction(tender._id);
    setBusy(null);
    if (res.ok) {
      toast.success(t("cancelled"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={tender.title}
        description={optionLabel("tenderTypes", tender.type)}
        back={{ href: "/hotel/tenders", label: t("back") }}
        actions={
          open && (
            <>
              <Link href={`/hotel/tenders/edit?id=${tender._id}`} className={outlineButtonClass}>
                <BiPencil size={16} /> {tc("edit")}
              </Link>
              <button type="button" onClick={cancel} disabled={busy !== null} className={dangerButtonClass}>
                <BiX size={16} /> {t("cancel")}
              </button>
            </>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <TenderStatusBadge status={tender.status} />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <InfoRow icon={<BiCategory size={16} />} label={t("fields.category")} value={optionLabel("supplierCategories", tender.category)} />
            <InfoRow icon={<BiMap size={16} />} label={t("fields.region")} value={optionLabel("regions", tender.region)} />
            <InfoRow icon={<BiEuro size={16} />} label={t("fields.budget")} value={tender.budget != null ? money(tender.budget) : ""} />
          </div>
          <p className="mt-6 whitespace-pre-line border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-700">{tender.description}</p>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("fields.deadline")}</h2>
            {open ? <DateBadge value={tender.deadline} /> : <p className="text-sm text-gray-700">{format.dateTime(new Date(tender.deadline), { dateStyle: "long", timeZone: "UTC" })}</p>}
          </div>
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("invited")}</h2>
            {tender.invitedSuppliers.length ? (
              <ul className="space-y-2 text-sm">
                {tender.invitedSuppliers.map((s) => {
                  const hasOffer = tender.offers.some((o) => o.supplier._id === s._id);
                  return (
                    <li key={s._id} className="flex items-center justify-between gap-2">
                      <span className="truncate text-gray-900">{s.name}</span>
                      <StatusBadge tone={hasOffer ? "green" : "grey"}>{hasOffer ? t("quoteIn") : t("waiting")}</StatusBadge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">{t("noSuppliers")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Kwaliteitsformulier (briefing §3.8), once a winner is chosen */}
      {tender.status === "awarded" && winnerOffer && (
        <ReviewCard tenderId={tender._id} supplierName={winnerOffer.supplier.name} review={tender.review} onSaved={reload} />
      )}

      {/* Quote comparison (briefing §3.5): price, delivery time, notes */}
      <section className="rounded border border-gray-200 bg-white">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-5 py-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">{t("compare")}</h2>
          <span className="text-xs text-gray-500">{t("quotesOf", { offers: tender.offers.length, invited: tender.invitedSuppliers.length })}</span>
        </div>
        {tender.offers.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-gray-500">{t("noQuotes")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">{t("supplier")}</th>
                  <th className="px-5 py-3 font-semibold">{t("price")}</th>
                  <th className="px-5 py-3 font-semibold">{t("deliveryTime")}</th>
                  <th className="px-5 py-3 font-semibold">{t("notes")}</th>
                  <th className="px-5 py-3 font-semibold">{t("file")}</th>
                  <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tender.offers.map((offer) => (
                  <tr key={offer._id} className={cn("align-top", offer.status === "won" && "bg-moss-100/40")}>
                    <td className="px-5 py-3">
                      <span className="block font-medium text-gray-900">{offer.supplier.name}</span>
                      <span className="block text-xs text-gray-500">{offer.supplier.memberNumber}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <span className="font-semibold text-gray-900">{money(offer.price)}</span>
                      {offer.price === cheapest && tender.offers.length > 1 && <span className="ml-2"><StatusBadge tone="brass">{t("lowest")}</StatusBadge></span>}
                    </td>
                    <td className="px-5 py-3 text-gray-700">{offer.deliveryTime || "—"}</td>
                    <td className="max-w-xs px-5 py-3 text-gray-700"><span className="whitespace-pre-line">{offer.notes || "—"}</span></td>
                    <td className="px-5 py-3">
                      {offer.file ? (
                        <a href={offer.file.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary-dark hover:underline">
                          <BiFile size={15} /> {t("open")}
                        </a>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {offer.status === "won" ? (
                        <StatusBadge tone="green">{t("winner")}</StatusBadge>
                      ) : open ? (
                        <button type="button" onClick={() => award(offer)} disabled={busy !== null} className={`${primaryButtonClass} px-3 py-1.5 text-xs`}>
                          <BiTrophy size={14} /> {t("chooseWinner")}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">{t(`offerStatus.${offer.status}`)}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default TenderDetails;
