"use client";

import { deleteFaultContactAction, listFaultContactsAction, type FaultContact } from "@/app/actions/faultContact";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus, BiSearch } from "react-icons/bi";
import { FaultContactCard } from "./FaultContactCard";
import { ReportFaultModal } from "./ReportFaultModal";

/**
 * The storingslijst, grouped by type of fault. Managers add and edit; the
 * staff login (briefing §3.6) only reads it and reports faults.
 */
const FaultList = () => {
  const t = useTranslations("Faults");
  const tc = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const { role } = useSessionUser();
  const canEdit = role === "hotel_manager";
  const { data, loading, error, reload } = useApiData(listFaultContactsAction, null);
  const [search, setSearch] = useState("");
  const [reporting, setReporting] = useState<FaultContact | null>(null);

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase();
    const map = new Map<string, FaultContact[]>();
    for (const contact of data ?? []) {
      const label = optionLabel("faultTypes", contact.faultType);
      if (q && !`${contact.name} ${label} ${contact.notes}`.toLowerCase().includes(q)) continue;
      map.set(label, [...(map.get(label) ?? []), contact]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [data, search, optionLabel]);

  const handleDelete = async (contact: FaultContact) => {
    if (!window.confirm(t("confirmDelete", { name: contact.name }))) return;
    const res = await deleteFaultContactAction(contact._id);
    if (res.ok) {
      toast.success(t("deleted"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={canEdit ? t("description") : t("descriptionStaff")}
        actions={
          canEdit && (
            <Link href="/hotel/faults/add" className={primaryButtonClass}>
              <BiPlus size={18} /> {t("add")}
            </Link>
          )
        }
      />

      <div className="relative max-w-md">
        <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-lg border border-gray-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">{error}</p>
      ) : groups.length === 0 ? (
        <p className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">{search ? tc("noResults") : canEdit ? t("empty") : t("emptyStaff")}</p>
      ) : (
        groups.map(([label, contacts]) => (
          <section key={label} aria-label={label}>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-gray-500">{label}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {contacts.map((contact) => (
                <FaultContactCard key={contact._id} contact={contact} canEdit={canEdit} onReport={() => setReporting(contact)} onDelete={() => handleDelete(contact)} />
              ))}
            </div>
          </section>
        ))
      )}

      <ReportFaultModal contact={reporting} onClose={() => setReporting(null)} />
    </div>
  );
};

export default FaultList;
