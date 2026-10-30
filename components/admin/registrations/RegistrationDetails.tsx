"use client";

import { approveRegistrationAction, getRegistrationAction, rejectRegistrationAction } from "@/app/actions/registration";
import { cardClass, cardTitleClass, dangerButtonClass, inputClass, primaryButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { Modal } from "@/components/shared/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiBuildings, BiCheck, BiEnvelope, BiGlobe, BiIdCard, BiMap, BiPhone, BiUser, BiX } from "react-icons/bi";
import { RegistrationStatusBadge } from "./RegistrationStatusBadge";

/** One sign-up — /admin/registrations/[id]: approve (creates the member + login) or reject. */
const RegistrationDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Registrations");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const { data: r, loading, reload } = useApiData(getRegistrationAction, id);
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!r) return <PageHeader title={t("notFound")} back={{ href: "/admin/registrations", label: t("back") }} />;

  const approve = async () => {
    if (!window.confirm(t("confirmApprove", { name: r.companyName }))) return;
    setBusy(true);
    const res = await approveRegistrationAction(r._id);
    setBusy(false);
    if (res.ok && res.data) {
      toast.success(t("approved", { number: res.data.memberNumber }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  const memberHref = r.member ? (r.type === "hotel" ? `/admin/hotels/${r.member}` : `/admin/suppliers/${r.member}`) : null;

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={r.companyName}
        description={t(`types.${r.type}`)}
        back={{ href: "/admin/registrations", label: t("back") }}
        actions={
          r.status === "pending" && (
            <>
              <button type="button" onClick={approve} disabled={busy} className={primaryButtonClass}>
                <BiCheck size={16} /> {t("approve")}
              </button>
              <button type="button" onClick={() => setRejecting(true)} disabled={busy} className={dangerButtonClass}>
                <BiX size={16} /> {t("reject")}
              </button>
            </>
          )
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2`}>
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoRow icon={<BiIdCard size={16} />} label="KVK" value={r.kvkNumber} />
            <InfoRow icon={<BiUser size={16} />} label={t("contact")} value={[r.contactFirstName, r.contactLastName].filter(Boolean).join(" ")} />
            <InfoRow icon={<BiEnvelope size={16} />} label={t("email")} value={<a href={`mailto:${r.email}`} className="underline underline-offset-2">{r.email}</a>} />
            <InfoRow icon={<BiPhone size={16} />} label={t("phone")} value={r.phone} />
            {r.type === "hotel" ? (
              <InfoRow icon={<BiMap size={16} />} label={t("address")} value={`${r.address}, ${r.city} (${optionLabel("regions", r.region)})`} />
            ) : (
              <>
                <InfoRow icon={<BiBuildings size={16} />} label={t("plan")} value={t(`plans.${r.plan}`)} />
                <InfoRow icon={<BiGlobe size={16} />} label={t("website")} value={r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{r.website}</a>} />
              </>
            )}
          </div>
          {r.type === "supplier" && (
            <div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs text-gray-500">{t("categories")}</p>
                <div className="flex flex-wrap gap-1.5">{r.categories.map((c) => <StatusBadge key={c} tone="grey">{optionLabel("supplierCategories", c)}</StatusBadge>)}</div>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500">{t("regions")}</p>
                <div className="flex flex-wrap gap-1.5">{r.regions.map((c) => <StatusBadge key={c} tone="grey">{optionLabel("regions", c)}</StatusBadge>)}</div>
              </div>
            </div>
          )}
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{tc("status")}</h2>
          <RegistrationStatusBadge status={r.status} />
          <p className="mt-3 text-sm text-gray-600">{t(`statusHint.${r.status}`)}</p>
          {r.decidedAt && <p className="mt-2 text-xs text-gray-500">{format.dateTime(new Date(r.decidedAt), { dateStyle: "medium", timeStyle: "short" })}</p>}
          {r.rejectionReason && <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-700">{r.rejectionReason}</p>}
          {memberHref && (
            <Link href={memberHref} className="mt-4 inline-block text-sm font-medium text-primary-dark hover:underline">
              {t("openMember")} →
            </Link>
          )}
        </div>
      </div>

      <Modal open={rejecting} onClose={() => setRejecting(false)} title={t("rejectTitle")} className="max-w-lg">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            const res = await rejectRegistrationAction(r._id, reason);
            setBusy(false);
            if (res.ok) {
              toast.success(t("rejected"));
              setRejecting(false);
              reload();
            } else toast.error(res.error || tc("error"));
          }}
          className="flex flex-col gap-4"
        >
          <label htmlFor="reject-reason" className="text-sm text-gray-700">{t("reasonLabel")}</label>
          <textarea id="reject-reason" rows={4} maxLength={1000} value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass} />
          <div className="flex justify-end">
            <button type="submit" disabled={busy} className={dangerButtonClass}>
              {t("reject")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RegistrationDetails;
