"use client";

import { adminDeletePurchaseActionAction, adminGetPurchaseActionAction } from "@/app/actions/purchase";
import { PurchaseStatusBadge } from "@/components/hotel/purchasing/PurchaseStatusBadge";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiDownload, BiFile, BiPencil, BiTrash } from "react-icons/bi";

/** Admin: one action with its participants and the invoice downloads (briefing §3.13). */
const PurchaseActionDetails = ({ id }: { id: string }) => {
  const t = useTranslations("AdminPurchasing");
  const tp = useTranslations("Purchasing");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const router = useRouter();
  const { data: action, loading } = useApiData(adminGetPurchaseActionAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!action) return <PageHeader title={t("notFound")} back={{ href: "/admin/purchasing", label: t("back") }} />;

  const date = (value: string) => format.dateTime(new Date(value), { dateStyle: "medium", timeZone: "UTC" });
  const withInvoice = action.participants.filter((p) => p.invoice).length;

  const remove = async () => {
    if (!window.confirm(t("confirmDelete", { title: action.title }))) return;
    const res = await adminDeletePurchaseActionAction(action._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/admin/purchasing");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={action.title}
        description={action.category}
        back={{ href: "/admin/purchasing", label: t("back") }}
        actions={
          <>
            {withInvoice > 0 && (
              <a href={`/api/purchasing/${action._id}/zip`} className={primaryButtonClass}>
                <BiDownload size={16} /> {t("downloadZip", { count: withInvoice })}
              </a>
            )}
            <Link href={`/admin/purchasing/edit?id=${action._id}`} className={outlineButtonClass}>
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
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <PurchaseStatusBadge status={action.status} />
            <span className="text-sm text-gray-600">
              {action.participants.length} / {action.targetParticipants} · {tp("deadline")} {date(action.deadline)}
            </span>
          </div>
          {action.expectedSavings && <p className="text-sm font-medium text-moss-600">{action.expectedSavings}</p>}
          <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{action.description || "—"}</p>
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("privacyTitle")}</h2>
          <p className="text-sm text-gray-600">
            {action.filesDeletedAt
              ? t("filesDeleted", { date: date(action.filesDeletedAt) })
              : action.completedAt
                ? t("filesDeleteOn", { date: date(new Date(new Date(action.completedAt).getTime() + 90 * 86400000).toISOString()) })
                : t("filesKept")}
          </p>
        </div>
      </div>

      <section className="overflow-x-auto rounded border border-gray-200 bg-white">
        <h2 className="border-b border-gray-100 px-5 py-4 text-sm font-semibold uppercase tracking-wider text-gray-900">{t("participants")}</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3 font-semibold">{t("hotel")}</th>
              <th className="px-5 py-3 font-semibold">{tp("fields.currentSupplier")}</th>
              <th className="px-5 py-3 font-semibold">{tp("fields.contractEndDate")}</th>
              <th className="hidden px-5 py-3 font-semibold md:table-cell">{tp("fields.annualUsage")}</th>
              <th className="px-5 py-3 font-semibold">{tp("fields.invoice")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {action.participants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                  {t("noParticipants")}
                </td>
              </tr>
            )}
            {action.participants.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3">
                  <span className="block font-medium text-gray-900">{p.hotel.name}</span>
                  <span className="block text-xs text-gray-500">
                    {p.hotel.memberNumber} · {p.hotel.city}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-700">{p.currentSupplier}</td>
                <td className="px-5 py-3 text-gray-700">{date(p.contractEndDate)}</td>
                <td className="hidden px-5 py-3 text-gray-700 md:table-cell">{p.annualUsage || "—"}</td>
                <td className="px-5 py-3">
                  {p.invoice ? (
                    <a href={`/api/purchasing/${action._id}/invoice/${p._id}`} className="inline-flex items-center gap-1 text-primary-dark hover:underline">
                      <BiFile size={15} /> PDF
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PurchaseActionDetails;
