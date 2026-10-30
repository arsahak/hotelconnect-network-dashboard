"use client";

import { listInvitationsAction } from "@/app/actions/supplierTender";
import { DateBadge } from "@/components/shared/DateBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { TableStatus } from "@/components/shared/TableStatus";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { InvitationStatusBadge } from "./InvitationStatusBadge";

/**
 * Requests this supplier was invited to (briefing §4.5): tenders, maintenance
 * contracts and product requests, each with deadline and status.
 */
const SupplierTenderList = () => {
  const t = useTranslations("SupplierTenders");
  const optionLabel = useOptionLabel();
  const { data, loading, error } = useApiData(listInvitationsAction, undefined);
  const invitations = data ?? [];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("description")} />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("fields.title")}</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">{t("fields.hotel")}</th>
              <th className="hidden px-5 py-3 font-semibold lg:table-cell">{t("fields.category")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.deadline")}</th>
              <th className="px-5 py-3 font-semibold">{t("fields.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={5} loading={loading} error={error} empty={invitations.length === 0} emptyText={t("empty")} />
            {!loading &&
              invitations.map((inv) => (
                <tr key={inv._id} className="align-top transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/supplier/tenders/${inv._id}`} className="block">
                      <span className="block font-medium text-gray-900 hover:text-primary-dark">{inv.title}</span>
                      <span className="block text-xs text-gray-500">{optionLabel("tenderTypes", inv.type)}</span>
                    </Link>
                  </td>
                  <td className="hidden px-5 py-3 md:table-cell">
                    <span className="block text-gray-700">{inv.hotel.name}</span>
                    <span className="block text-xs text-gray-500">{inv.hotel.city}</span>
                  </td>
                  <td className="hidden px-5 py-3 lg:table-cell">
                    <span className="block text-gray-700">{optionLabel("supplierCategories", inv.category)}</span>
                    <span className="block text-xs text-gray-500">{optionLabel("regions", inv.region)}</span>
                  </td>
                  <td className="px-5 py-3">{inv.acceptingOffers ? <DateBadge value={inv.deadline} /> : <span className="text-gray-500">—</span>}</td>
                  <td className="px-5 py-3">
                    <InvitationStatusBadge status={inv.myStatus} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierTenderList;
