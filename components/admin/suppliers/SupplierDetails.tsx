"use client";

import { deleteSupplierAction, getSupplierAction } from "@/app/actions/supplier";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Thumb } from "@/components/shared/Thumb";
import { SupplierLogins } from "./SupplierLogins";
import { MemberBillingCard } from "@/components/billing/MemberBillingCard";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { WEBSITE_URL } from "@/lib/site";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiCalendar, BiEnvelope, BiGlobe, BiLinkExternal, BiPencil, BiIdCard, BiPackage, BiPhone, BiStar, BiTrash, BiUser } from "react-icons/bi";

/** Supplier details page — /suppliers/[id]. */
const SupplierDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Suppliers");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const optionLabel = useOptionLabel();
  const router = useRouter();
  const { data: supplier, loading } = useApiData(getSupplierAction, id);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }
  if (!supplier) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/suppliers", label: t("back") }} />
      </div>
    );
  }

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name: supplier.name }))) return;
    const res = await deleteSupplierAction(supplier._id);
    if (res.ok) {
      toast.success(t("deleted", { name: supplier.name }));
      router.push("/admin/suppliers");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={supplier.name}
        description={supplier.memberNumber}
        back={{ href: "/admin/suppliers", label: t("back") }}
        actions={
          <>
            {supplier.isActive && (
              <a href={`${WEBSITE_URL}/suppliers/${supplier.slug}`} target="_blank" rel="noopener noreferrer" className={outlineButtonClass}>
                <BiLinkExternal size={16} /> {tc("viewOnWebsite")}
              </a>
            )}
            <Link href={`/admin/suppliers/edit?id=${supplier._id}`} className={outlineButtonClass}>
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
          <div className="flex flex-wrap items-center gap-4">
            <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
              {supplier.logo ? (
                <Thumb src={supplier.logo} alt={`${supplier.name} logo`} fit="contain" />
              ) : (
                <span className="grid h-full w-full place-items-center font-display text-3xl text-brass-600">{supplier.name.charAt(0)}</span>
              )}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-gray-700">{supplier.tagline || "—"}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge tone={supplier.isActive ? "green" : "red"}>{supplier.isActive ? tc("active") : tc("inactive")}</StatusBadge>
                {supplier.featured && <StatusBadge tone="brass">{t("fields.featured")}</StatusBadge>}
                {supplier.showInPurchasing && <StatusBadge tone="brass">{t("fields.showInPurchasing")}</StatusBadge>}
              </div>
            </div>
          </div>
          <p className="mt-6 whitespace-pre-line border-t border-gray-100 pt-6 text-sm leading-relaxed text-gray-700">{supplier.description || "—"}</p>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs text-gray-500">{t("fields.categories")}</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.categories.length
                  ? supplier.categories.map((c) => <StatusBadge key={c} tone="grey">{optionLabel("supplierCategories", c)}</StatusBadge>)
                  : "—"}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs text-gray-500">{t("fields.regions")}</p>
              <div className="flex flex-wrap gap-1.5">
                {supplier.regions.length
                  ? supplier.regions.map((r) => <StatusBadge key={r} tone="grey">{optionLabel("regions", r)}</StatusBadge>)
                  : "—"}
              </div>
            </div>
          </div>

          {supplier.image && (
            <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-lg bg-gray-50">
              <Thumb src={supplier.image} alt="" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("sections.contact")}</h2>
          <div className="space-y-4">
            <InfoRow icon={<BiUser size={16} />} label={t("fields.person")} value={supplier.contact.person} />
            <InfoRow icon={<BiEnvelope size={16} />} label={t("fields.email")} value={<a href={`mailto:${supplier.contact.email}`} className="underline underline-offset-2">{supplier.contact.email}</a>} />
            <InfoRow icon={<BiPhone size={16} />} label={t("fields.phone")} value={supplier.contact.phone} />
            <InfoRow
              icon={<BiGlobe size={16} />}
              label={t("fields.website")}
              value={supplier.website && <a href={supplier.website} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{supplier.website}</a>}
            />
            <InfoRow icon={<BiCalendar size={16} />} label={tc("added")} value={format.dateTime(new Date(supplier.createdAt), { dateStyle: "long" })} />
            <InfoRow icon={<BiPackage size={16} />} label={t("fields.plan")} value={t(`plans.${supplier.plan ?? "commission"}`)} />
            <InfoRow icon={<BiIdCard size={16} />} label="KVK" value={supplier.kvkNumber} />
            <InfoRow
              icon={<BiStar size={16} />}
              label={t("fields.rating")}
              value={supplier.rating?.count ? t("ratingValue", { average: supplier.rating.average, count: supplier.rating.count }) : t("noRating")}
            />
          </div>
        </div>
        <SupplierLogins supplierId={supplier._id} />
        <MemberBillingCard supplier={supplier._id} canStart={supplier.plan === "contract"} />
        </div>
      </div>
    </div>
  );
};

export default SupplierDetails;
