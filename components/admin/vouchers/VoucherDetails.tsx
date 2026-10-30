"use client";

import { deleteVoucherAction, getVoucherAction } from "@/app/actions/voucher";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiBuildings, BiCalendar, BiLink, BiMap, BiPencil, BiStar, BiTrash } from "react-icons/bi";
import { isPromoted } from "./VoucherList";

/** Voucher details page — /vouchers/[id]. */
const VoucherDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: voucher, loading } = useApiData(getVoucherAction, id);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }
  if (!voucher) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/vouchers", label: t("back") }} />
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { title: voucher.title }))) return;
    const res = await deleteVoucherAction(voucher._id);
    if (res.ok) {
      toast.success(t("deleted", { title: voucher.title }));
      router.push("/admin/vouchers");
    } else toast.error(res.error || tc("error"));
  };

  const date = (value: string) => format.dateTime(new Date(value), { dateStyle: "long" });

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={voucher.title}
        description={voucher.hotel?.name}
        back={{ href: "/admin/vouchers", label: t("back") }}
        actions={
          <>
            <Link href={`/admin/vouchers/edit?id=${voucher._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            <button type="button" onClick={handleDelete} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:w-64">
              <Thumb src={voucher.image} alt={voucher.title} />
              <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white">
                {voucher.discountPercent}%
              </span>
            </div>
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={voucher.isActive ? "green" : "red"}>{voucher.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                <StatusBadge tone="grey">{optionLabel("voucherCategories", voucher.category)}</StatusBadge>
              </div>
              <p className="text-sm font-medium text-gray-900">{voucher.teaser || "—"}</p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{voucher.description}</p>
            </div>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("sections.details")}</h2>
          <div className="space-y-4">
            <InfoRow icon={<BiBuildings size={16} />} label={t("fields.hotel")} value={voucher.hotel && <Link href={`/admin/hotels/${voucher.hotel._id}`} className="underline underline-offset-2">{voucher.hotel.name}</Link>} />
            <InfoRow icon={<BiMap size={16} />} label={t("fields.region")} value={optionLabel("regions", voucher.region)} />
            <InfoRow
              icon={<BiLink size={16} />}
              label={t("fields.bookingUrl")}
              value={<a href={voucher.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{voucher.bookingUrl}</a>}
            />
            <InfoRow
              icon={<BiStar size={16} />}
              label={t("fields.promotedUntil")}
              value={isPromoted(voucher) ? date(voucher.promotedUntil!) : t("notPromoted")}
            />
            <InfoRow icon={<BiCalendar size={16} />} label={tc("added")} value={date(voucher.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherDetails;
