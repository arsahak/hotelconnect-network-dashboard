"use client";

import { deleteFaultContactAction, getFaultContactAction } from "@/app/actions/faultContact";
import { dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPencil, BiTrash } from "react-icons/bi";
import { FaultContactCard } from "./FaultContactCard";
import { ReportFaultModal } from "./ReportFaultModal";

/** One storingslijst contact — /faults/[id]. */
const FaultDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { role } = useSessionUser();
  const canEdit = role === "hotel_manager";
  const { data: contact, loading } = useApiData(getFaultContactAction, id);
  const [reporting, setReporting] = useState(false);

  if (loading) return <div className="h-48 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!contact) return <PageHeader title={t("notFound")} back={{ href: "/hotel/faults", label: t("back") }} />;

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name: contact.name }))) return;
    const res = await deleteFaultContactAction(contact._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/faults");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={contact.name}
        description={optionLabel("faultTypes", contact.faultType)}
        back={{ href: "/hotel/faults", label: t("back") }}
        actions={
          canEdit && (
            <>
              <Link href={`/hotel/faults/edit?id=${contact._id}`} className={outlineButtonClass}>
                <BiPencil size={16} /> {tc("edit")}
              </Link>
              <button type="button" onClick={handleDelete} className={dangerButtonClass}>
                <BiTrash size={16} /> {tc("delete")}
              </button>
            </>
          )
        }
      />
      <div className="max-w-md">
        <FaultContactCard contact={contact} canEdit={false} onReport={() => setReporting(true)} onDelete={handleDelete} />
      </div>
      <ReportFaultModal contact={reporting ? contact : null} onClose={() => setReporting(false)} />
    </div>
  );
};

export default FaultDetails;
