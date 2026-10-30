"use client";

import { deleteHotelAction, getHotelAction } from "@/app/actions/hotel";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Thumb } from "@/components/shared/Thumb";
import { HotelLogins } from "./HotelLogins";
import { MemberBillingCard } from "@/components/billing/MemberBillingCard";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiBriefcase, BiCalendar, BiEnvelope, BiLink, BiMap, BiPencil, BiPurchaseTagAlt, BiTag, BiTrash } from "react-icons/bi";

/** Hotel details page — /hotels/[id]. */
const HotelDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Hotels");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: hotel, loading } = useApiData(getHotelAction, id);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }
  if (!hotel) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/hotels", label: t("back") }} />
      </div>
    );
  }

  const handleDelete = async () => {
    const counts = hotel.counts ?? { vacancies: 0, vouchers: 0 };
    if (!window.confirm(t("confirmDeleteWithItems", { name: hotel.name, jobs: counts.vacancies, vouchers: counts.vouchers }))) return;
    const res = await deleteHotelAction(hotel._id);
    if (res.ok) {
      toast.success(t("deleted", { name: hotel.name }));
      router.push("/admin/hotels");
    } else toast.error(res.error || tc("error"));
  };

  const date = (value: string) => format.dateTime(new Date(value), { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={hotel.name}
        description={`${hotel.memberNumber} · ${hotel.city}`}
        back={{ href: "/admin/hotels", label: t("back") }}
        actions={
          <>
            <Link href={`/admin/hotels/edit?id=${hotel._id}`} className={outlineButtonClass}>
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
              <Thumb src={hotel.image} alt={hotel.name} />
            </div>
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={hotel.isActive ? "green" : "red"}>{hotel.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                {hotel.featured && <StatusBadge tone="brass">{t("fields.featured")}</StatusBadge>}
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{hotel.description || "—"}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <InfoRow icon={<BiMap size={16} />} label={t("fields.address")} value={`${hotel.address} · ${optionLabel("regions", hotel.region)}`} />
            <InfoRow icon={<BiTag size={16} />} label={t("fields.offer")} value={hotel.offer} />
            <InfoRow
              icon={<BiLink size={16} />}
              label={t("fields.bookingUrl")}
              value={
                hotel.bookingUrl && (
                  <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-primary-dark underline underline-offset-2">
                    {hotel.bookingUrl}
                  </a>
                )
              }
            />
            <InfoRow icon={<BiCalendar size={16} />} label={tc("added")} value={date(hotel.createdAt)} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("sections.emails")}</h2>
            <div className="space-y-4">
              {(["general", "invoices", "vacancies", "faults", "alerts"] as const).map((key) => (
                <InfoRow key={key} icon={<BiEnvelope size={16} />} label={t(`emails.${key}`)} value={hotel.emails[key]} />
              ))}
            </div>
          </div>
          <HotelLogins hotelId={hotel._id} />
          <MemberBillingCard hotel={hotel._id} />
          <div className={cardClass}>
            <h2 className={cardTitleClass}>{t("sections.content")}</h2>
            <div className="grid gap-3">
              <Link href={`/admin/jobs?hotel=${hotel._id}`} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm hover:border-primary">
                <span className="flex items-center gap-2 text-gray-700">
                  <BiBriefcase size={18} /> {t("jobsCount", { count: hotel.counts?.vacancies ?? 0 })}
                </span>
                <span className="text-xs text-primary-dark">{tc("view")}</span>
              </Link>
              <Link href={`/admin/vouchers?hotel=${hotel._id}`} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm hover:border-primary">
                <span className="flex items-center gap-2 text-gray-700">
                  <BiPurchaseTagAlt size={18} /> {t("vouchersCount", { count: hotel.counts?.vouchers ?? 0 })}
                </span>
                <span className="text-xs text-primary-dark">{tc("view")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;
