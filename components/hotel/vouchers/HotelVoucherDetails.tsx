"use client";

import { deleteMyVoucherAction, getMyVoucherAction } from "@/app/actions/myVoucher";
import { cardClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { VoucherPromoteCard } from "@/components/billing/VoucherPromoteCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiCategory, BiLink, BiLinkExternal, BiPencil, BiTrash } from "react-icons/bi";

/** One voucher — /hotel/vouchers/[id]. */
const HotelVoucherDetails = ({ id }: { id: string }) => {
  const t = useTranslations("HotelVouchers");
  const tv = useTranslations("Vouchers");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: v, loading } = useApiData(getMyVoucherAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!v) return <PageHeader title={t("notFound")} back={{ href: "/hotel/vouchers", label: t("back") }} />;

  const remove = async () => {
    if (!window.confirm(t("confirmDelete", { title: v.title }))) return;
    const res = await deleteMyVoucherAction(v._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/vouchers");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={v.title}
        description={`${v.discountPercent}% · ${optionLabel("voucherCategories", v.category)}`}
        back={{ href: "/hotel/vouchers", label: t("back") }}
        actions={
          <>
            {v.isActive && (
              <a href={`${WEBSITE_URL}/suppliers#vouchers`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
                <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
              </a>
            )}
            <Link href={`/hotel/vouchers/edit?id=${v._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            <button type="button" onClick={remove} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          {v.image && (
            <div className="relative mb-5 aspect-[21/9] overflow-hidden rounded-lg bg-gray-50">
              <Thumb src={v.image} alt="" />
            </div>
          )}
          <div className="mb-4">
            <StatusBadge tone={v.isActive ? "green" : "grey"}>{v.isActive ? t("live") : tc("inactive")}</StatusBadge>
          </div>
          {v.teaser && <p className="font-medium text-gray-900">{v.teaser}</p>}
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">{v.description || "—"}</p>
          <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <InfoRow icon={<BiCategory size={16} />} label={tv("fields.category")} value={optionLabel("voucherCategories", v.category)} />
            <InfoRow icon={<BiLink size={16} />} label={tv("fields.bookingUrl")} value={<a href={v.bookingUrl} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">{v.bookingUrl}</a>} />
          </div>
        </div>
        <VoucherPromoteCard id={v._id} isActive={v.isActive} promotedUntil={v.promotedUntil} />
      </div>
    </div>
  );
};

export default HotelVoucherDetails;
