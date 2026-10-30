"use client";

import { adAvailabilityAction, adminAdBookingsAction } from "@/app/actions/billing";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { AdStatusBadge, useDate } from "./shared";

/** Admin: who has which sponsored spot, and who is waiting. */
const AdminAdvertising = () => {
  const t = useTranslations("Billing");
  const tc = useTranslations("Common");
  const date = useDate();
  const availability = useApiData(adAvailabilityAction, undefined);
  const { data, loading, error } = useApiData(adminAdBookingsAction, undefined);
  const bookings = data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("adminAdsTitle")} description={t("adminAdsSubtitle")} />
      <div className="grid gap-4 md:grid-cols-3">
        {availability.data?.map((b) => (
          <div key={b.block} className="rounded border border-gray-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{t(`block.${b.block}`)}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {b.positions.map((p) => (
                <li key={p.position} className="flex justify-between gap-3">
                  <span className="text-gray-700">{t("position", { n: p.position })}</span>
                  <span className={p.liveUntil ? "text-brass-700" : "text-moss-600"}>
                    {p.liveUntil ? t("takenUntil", { date: date(p.liveUntil) }) : t("free")}
                    {p.waiting > 0 && <span className="block text-right text-xs text-gray-500">{t("waiting", { count: p.waiting })}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("member")}</th>
              <th className="px-5 py-3 font-semibold">{t("spot")}</th>
              <th className="px-5 py-3 font-semibold">{t("dates")}</th>
              <th className="px-5 py-3 font-semibold">{t("invoice")}</th>
              <th className="px-5 py-3 font-semibold">{tc("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={5} loading={loading} error={error} empty={bookings.length === 0} emptyText={t("noBookings")} />
            {!loading &&
              bookings.map((b) => {
                const member = b.hotel ?? b.supplier;
                return (
                  <tr key={b._id}>
                    <td className="px-5 py-3">
                      {member ? (
                        <Link href={b.hotel ? `/admin/hotels/${member._id}` : `/admin/suppliers/${member._id}`} className="font-medium text-gray-900 hover:text-primary-dark">
                          {member.name}
                          <span className="block text-xs font-normal text-gray-500">{member.memberNumber}</span>
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-700">
                      {t(`block.${b.block}`)} · {t("position", { n: b.position })} · {t(`adPeriod.${b.period}`)}
                      {b.vacancy && <span className="block text-xs text-gray-500">{b.vacancy.title}</span>}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-700">{b.startsAt ? `${date(b.startsAt)} – ${date(b.endsAt)}` : "—"}</td>
                    <td className="px-5 py-3 text-gray-700">{b.invoice?.number ?? "—"}</td>
                    <td className="px-5 py-3">
                      <AdStatusBadge status={b.status} />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAdvertising;
