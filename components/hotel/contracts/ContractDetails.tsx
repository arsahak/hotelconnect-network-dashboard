"use client";

import { deleteContractAction, getContractAction } from "@/app/actions/contract";
import { DateBadge } from "@/components/shared/DateBadge";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiBell, BiBookBookmark, BiBuildings, BiCalendar, BiCreditCard, BiLink, BiNote, BiPencil, BiRefresh, BiTime, BiTrash, BiWallet } from "react-icons/bi";
import { contractTitle } from "./ContractList";

/** Contract details — /contracts/[id]. */
const ContractDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Contracts");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const router = useRouter();
  const { data: contract, loading } = useApiData(getContractAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!contract) return <PageHeader title={t("notFound")} back={{ href: "/hotel/contracts", label: t("back") }} />;

  const date = (value: string | null) => (value ? format.dateTime(new Date(value), { dateStyle: "long", timeZone: "UTC" }) : "");
  const link = (url: string) => url && <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{url}</a>;

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name: contractTitle(contract) }))) return;
    const res = await deleteContractAction(contract._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/contracts");
    } else toast.error(res.error || tc("error"));
  };

  const notice = contract.noticePeriod?.value ? `${contract.noticePeriod.value} ${t(`units.${contract.noticePeriod.unit}`)}` : "";

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={contractTitle(contract)}
        description={contract.contractFor && contract.company ? contract.company : undefined}
        back={{ href: "/hotel/contracts", label: t("back") }}
        actions={
          <>
            <Link href={`/hotel/contracts/edit?id=${contract._id}`} className={outlineButtonClass}>
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
          <h2 className={cardTitleClass}>{t("sections.contract")}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={<BiBuildings size={16} />} label={t("fields.company")} value={contract.company} />
            <InfoRow icon={<BiCalendar size={16} />} label={t("fields.startDate")} value={date(contract.startDate)} />
            <InfoRow icon={<BiTime size={16} />} label={t("fields.duration")} value={contract.duration} />
            <InfoRow icon={<BiRefresh size={16} />} label={t("fields.autoRenew")} value={contract.autoRenew ? tc("yes") : tc("no")} />
            <InfoRow icon={<BiBell size={16} />} label={t("fields.noticePeriod")} value={notice} />
            <InfoRow icon={<BiCreditCard size={16} />} label={t("fields.paymentTerm")} value={contract.paymentTerm} />
            <InfoRow icon={<BiWallet size={16} />} label={t("fields.costPerYear")} value={contract.costPerYear !== null ? format.number(contract.costPerYear, { style: "currency", currency: "EUR" }) : ""} />
            <InfoRow icon={<BiBookBookmark size={16} />} label={t("fields.ledgerAccount")} value={contract.ledgerAccount} />
            <InfoRow icon={<BiLink size={16} />} label={t("fields.contractLink")} value={link(contract.contractLink)} />
            <InfoRow icon={<BiLink size={16} />} label={t("fields.portalLink")} value={link(contract.portalLink)} />
          </div>
          {contract.notes && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <InfoRow icon={<BiNote size={16} />} label={t("fields.notes")} value={<span className="whitespace-pre-line font-normal">{contract.notes}</span>} />
            </div>
          )}
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("sections.reminders")}</h2>
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-xs text-gray-500">{t("fields.endDate")}</p>
              <DateBadge value={contract.endDate} empty={t("noEndDate")} />
            </div>
            {contract.autoRenew && (
              <div>
                <p className="mb-1 text-xs text-gray-500">{t("columns.cancelBy")}</p>
                <DateBadge value={contract.noticeDeadline} empty={t("noNoticePeriod")} />
              </div>
            )}
            <p className="text-xs text-gray-500">{t("hints.reminders")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
