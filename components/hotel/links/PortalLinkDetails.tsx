"use client";

import { deletePortalLinkAction, getPortalLinkAction } from "@/app/actions/portalLink";
import { cardClass, dangerButtonClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { BiCategory, BiLinkExternal, BiNote, BiPencil, BiTrash, BiUser } from "react-icons/bi";
import { CopyButton } from "./CopyButton";
import { usePortalCategory } from "./usePortalCategory";

/** Link details — /hotel/links/[id]. */
const PortalLinkDetails = ({ id }: { id: string }) => {
  const t = useTranslations("PortalLinks");
  const tc = useTranslations("Common");
  const router = useRouter();
  const categoryOf = usePortalCategory();
  const { data: link, loading } = useApiData(getPortalLinkAction, id);

  if (loading) return <div className="h-64 animate-pulse rounded border border-gray-200 bg-white" />;
  if (!link) return <PageHeader title={t("notFound")} back={{ href: "/hotel/links", label: t("back") }} />;

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name: link.name }))) return;
    const res = await deletePortalLinkAction(link._id);
    if (res.ok) {
      toast.success(t("deleted"));
      router.push("/hotel/links");
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={link.name}
        description={categoryOf(link)}
        back={{ href: "/hotel/links", label: t("back") }}
        actions={
          <>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className={primaryButtonClass}>
              <BiLinkExternal size={16} /> {t("open")}
            </a>
            <Link href={`/hotel/links/edit?id=${link._id}`} className={outlineButtonClass}>
              <BiPencil size={16} /> {tc("edit")}
            </Link>
            <button type="button" onClick={handleDelete} className={dangerButtonClass}>
              <BiTrash size={16} /> {tc("delete")}
            </button>
          </>
        }
      />
      <div className={cardClass}>
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow icon={<BiCategory size={16} />} label={t("fields.category")} value={categoryOf(link)} />
          <InfoRow
            icon={<BiLinkExternal size={16} />}
            label={t("fields.url")}
            value={<a href={link.url} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2">{link.url}</a>}
          />
          <InfoRow
            icon={<BiUser size={16} />}
            label={t("fields.username")}
            value={link.username && <span className="inline-flex items-center gap-1">{link.username} <CopyButton value={link.username} /></span>}
          />
        </div>
        {link.notes && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <InfoRow icon={<BiNote size={16} />} label={t("fields.notes")} value={<span className="whitespace-pre-line font-normal">{link.notes}</span>} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PortalLinkDetails;
