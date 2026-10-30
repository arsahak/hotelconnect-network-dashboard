"use client";

import { deleteMyVoucherAction, listMyVouchersAction, type MyVoucher } from "@/app/actions/myVoucher";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { RowActions } from "@/components/shared/RowActions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";

/** The hotel's own corporate vouchers (briefing §3.10). */
const HotelVoucherList = () => {
  const t = useTranslations("HotelVouchers");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const { data, loading, error, reload } = useApiData(listMyVouchersAction, undefined);
  const vouchers = data ?? [];

  const remove = async (v: MyVoucher) => {
    if (!window.confirm(t("confirmDelete", { title: v.title }))) return;
    const res = await deleteMyVoucherAction(v._id);
    if (res.ok) {
      toast.success(t("deleted"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/hotel/vouchers/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />
      <div className="overflow-x-auto rounded border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("columns.voucher")}</th>
              <th className="px-5 py-3 font-semibold">{t("columns.discount")}</th>
              <th className="px-5 py-3 font-semibold">{tc("status")}</th>
              <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <TableStatus colSpan={4} loading={loading} error={error} empty={vouchers.length === 0} emptyText={t("empty")} />
            {!loading &&
              vouchers.map((v) => (
                <tr key={v._id} className="align-top transition-colors hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <Link href={`/hotel/vouchers/${v._id}`} className="flex items-center gap-3">
                      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded bg-gray-100">{v.image && <Thumb src={v.image} alt="" />}</span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-gray-900 hover:text-primary-dark">{v.title}</span>
                        <span className="block text-xs text-gray-500">{optionLabel("voucherCategories", v.category)}</span>
                      </span>
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-semibold text-brass-700">{v.discountPercent}%</td>
                  <td className="px-5 py-3">
                    <StatusBadge tone={v.isActive ? "green" : "grey"}>{v.isActive ? t("live") : tc("inactive")}</StatusBadge>
                  </td>
                  <td className="px-5 py-3">
                    <RowActions viewHref={`/hotel/vouchers/${v._id}`} editHref={`/hotel/vouchers/edit?id=${v._id}`} onDelete={() => remove(v)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HotelVoucherList;
