"use client";

import { getInvitationAction } from "@/app/actions/supplierTender";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, cardTitleClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import { BiBuildings, BiCategory, BiEuro, BiFile, BiMap, BiTime } from "react-icons/bi";
import { InvitationStatusBadge } from "./InvitationStatusBadge";
import { OfferForm } from "./OfferForm";

/** One request — /supplier/tenders/[id]: the hotel's question and this supplier's quote. */
const SupplierTenderDetails = ({ id }: { id: string }) => {
  const t = useTranslations("SupplierTenders");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const { data: inv, loading, reload } = useApiData(getInvitationAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!inv) return <PageHeader title={t("notFound")} back={{ href: "/supplier/tenders", label: t("back") }} />;

  const money = (value: number) => format.number(value, { style: "currency", currency: "EUR", maximumFractionDigits: 2 });

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={inv.title} description={optionLabel("tenderTypes", inv.type)} back={{ href: "/supplier/tenders", label: t("back") }} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="mb-5">
            <InvitationStatusBadge status={inv.myStatus} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={<BiBuildings size={16} />} label={t("fields.hotel")} value={`${inv.hotel.name} · ${inv.hotel.city}`} />
            <InfoRow icon={<BiCategory size={16} />} label={t("fields.category")} value={optionLabel("supplierCategories", inv.category)} />
            <InfoRow icon={<BiMap size={16} />} label={t("fields.region")} value={optionLabel("regions", inv.region)} />
            <InfoRow icon={<BiEuro size={16} />} label={t("fields.budget")} value={inv.budget != null ? money(inv.budget) : ""} />
          </div>
          <p className="mt-6 whitespace-pre-line border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-700">{inv.description}</p>
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("fields.deadline")}</h2>
          {inv.acceptingOffers ? <DateBadge value={inv.deadline} /> : <p className="text-sm text-gray-700">{format.dateTime(new Date(inv.deadline), { dateStyle: "long", timeZone: "UTC" })}</p>}
          <p className="mt-4 text-xs text-gray-500">{t(`statusHint.${inv.myStatus}`)}</p>
        </div>
      </div>

      {inv.acceptingOffers ? (
        <OfferForm key={inv.myOffer?.updatedAt ?? "new"} invitation={inv} onSaved={reload} />
      ) : (
        inv.myOffer && (
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("yourQuote")}</h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <InfoRow icon={<BiEuro size={16} />} label={t("fields.price")} value={money(inv.myOffer.price)} />
              <InfoRow icon={<BiTime size={16} />} label={t("fields.deliveryTime")} value={inv.myOffer.deliveryTime} />
              <InfoRow
                icon={<BiFile size={16} />}
                label={t("fields.file")}
                value={inv.myOffer.file && <a href={inv.myOffer.file.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{inv.myOffer.file.name}</a>}
              />
            </div>
            {inv.myOffer.notes && <p className="mt-5 whitespace-pre-line text-sm text-gray-700">{inv.myOffer.notes}</p>}
          </div>
        )
      )}
    </div>
  );
};

export default SupplierTenderDetails;
