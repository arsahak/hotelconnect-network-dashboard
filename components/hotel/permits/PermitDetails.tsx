"use client";

import { deletePermitAction, getPermitAction } from "@/app/actions/permit";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiBuildings, BiCalendar, BiLink, BiNote, BiPencil, BiTrash } from "react-icons/bi";

/** Permit details — /permits/[id]. */
const PermitDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Permits");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const router = useRouter();
  const { data: permit, loading } = useApiData(getPermitAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!permit) return <PageHeader title={t("notFound")} back={{ href: "/hotel/permits", label: t("back") }} />;

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name: permit.type }))) return;
    const res = await deletePermitAction(permit._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/permits");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={permit.type}
        description={permit.authority || undefined}
        back={{ href: "/hotel/permits", label: t("back") }}
        actions={
          <>
            <Link href={`/hotel/permits/edit?id=${permit._id}`} className={outlineButtonClass}>
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
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={<BiBuildings size={16} />} label={t("fields.authority")} value={permit.authority} />
            <InfoRow icon={<BiCalendar size={16} />} label={t("fields.issueDate")} value={permit.issueDate ? format.dateTime(new Date(permit.issueDate), { dateStyle: "long", timeZone: "UTC" }) : ""} />
            <InfoRow
              icon={<BiLink size={16} />}
              label={t("fields.documentLink")}
              value={permit.documentLink && <a href={permit.documentLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{permit.documentLink}</a>}
            />
          </div>
          {permit.notes && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <InfoRow icon={<BiNote size={16} />} label={t("fields.notes")} value={<span className="whitespace-pre-line font-normal">{permit.notes}</span>} />
            </div>
          )}
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("fields.expiryDate")}</h2>
          <DateBadge value={permit.expiryDate} empty={t("noExpiry")} />
          <p className="mt-4 text-xs text-gray-500">{t("hints.reminders")}</p>
        </div>
      </div>
    </div>
  );
};

export default PermitDetails;
