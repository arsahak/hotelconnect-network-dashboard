"use client";

import { listPartnerHotelsAction } from "@/app/actions/mySupplier";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { WEBSITE_URL } from "@/lib/site";
import { useFormatter, useTranslations } from "next-intl";
import { BiBuildingHouse, BiLinkExternal } from "react-icons/bi";
import { SupplierPortalTabs } from "../SupplierPortalTabs";

/** My Partner Hotels (Master Briefing v4): hotels that sent this supplier a 1-click invite. */
export default function PartnerHotels() {
  const t = useTranslations("SupplierPortal");
  const format = useFormatter();
  const { data, loading, error } = useApiData(listPartnerHotelsAction, undefined);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("partnerHotels")} description={t("partnersIntro")} />
      <SupplierPortalTabs />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded border border-gray-200 bg-white" />
          ))}
        </div>
      ) : !data ? (
        <p className="rounded border border-gray-200 bg-white py-12 text-center text-sm text-gray-500">{error}</p>
      ) : data.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <BiBuildingHouse size={32} className="mx-auto text-brass-500" />
          <p className="mt-3 font-medium text-gray-900">{t("noPartners")}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{t("noPartnersHint")}</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((p) => (
            <li key={p._id} className="flex items-center gap-4 rounded border border-gray-200 bg-white p-4">
              {p.hotel.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.hotel.image} alt="" className="size-16 shrink-0 rounded object-cover" />
              ) : (
                <span className="grid size-16 shrink-0 place-items-center rounded bg-brass-100 text-brass-600">
                  <BiBuildingHouse size={26} />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-950">{p.hotel.name}</p>
                <p className="text-sm text-gray-500">{p.hotel.city}</p>
                <p className="mt-1 text-xs text-gray-400">{t("partnerSince", { date: format.dateTime(new Date(p.since), { dateStyle: "medium" }) })}</p>
              </div>
              <a
                href={`${WEBSITE_URL}/hotels/${p.hotel.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("viewHotel", { name: p.hotel.name })}
                className="grid size-9 shrink-0 place-items-center rounded text-gray-500 hover:bg-gray-50 hover:text-primary-dark"
              >
                <BiLinkExternal size={18} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
