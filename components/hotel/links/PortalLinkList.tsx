"use client";

import { deletePortalLinkAction, listPortalLinksAction, type PortalLink } from "@/app/actions/portalLink";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiLinkExternal, BiPencil, BiPlus, BiTrash } from "react-icons/bi";
import { CopyButton } from "./CopyButton";
import { usePortalCategory } from "./usePortalCategory";

/**
 * Handige links & portalen (briefing §3.11): every portal the hotel manager
 * signs in to, grouped by category, with a quick "Open" and a copyable username.
 */
const PortalLinkList = () => {
  const t = useTranslations("PortalLinks");
  const tc = useTranslations("Common");
  const categoryOf = usePortalCategory();
  const [search, setSearch] = useState("");
  const q = useDebounced(search);
  const { data, loading, error, reload } = useApiData(listPortalLinksAction, { q });
  const links = data ?? [];

  // Grouped by the category as shown (the API already sorts by category, then name).
  const groups = new Map<string, PortalLink[]>();
  for (const link of links) {
    const label = categoryOf(link);
    groups.set(label, [...(groups.get(label) ?? []), link]);
  }

  const handleDelete = async (link: PortalLink) => {
    if (!window.confirm(t("confirmDelete", { name: link.name }))) return;
    const res = await deletePortalLinkAction(link._id);
    if (res.ok) {
      toast.success(t("deleted"));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/hotel/links/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />

      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar search={search} onSearch={setSearch} placeholder={t("searchPlaceholder")} onRefresh={reload} />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded border border-gray-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-ember-600">{error}</div>
      ) : links.length === 0 ? (
        <div className="rounded border border-dashed border-gray-300 bg-white py-16 text-center">
          <p className="text-sm text-gray-500">{q ? tc("noResults") : t("empty")}</p>
          {!q && (
            <Link href="/hotel/links/add" className={`${primaryButtonClass} mt-4`}>
              <BiPlus size={18} /> {t("add")}
            </Link>
          )}
        </div>
      ) : (
        [...groups].map(([category, items]) => (
          <section key={category}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">{category}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((link) => (
                <article key={link._id} className="flex flex-col rounded border border-gray-200 bg-white p-5 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(27,22,17,0.35)]">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/hotel/links/${link._id}`} className="min-w-0">
                      <span className="block truncate font-display text-xl text-gray-950 hover:text-primary-dark">{link.name}</span>
                      <span className="block truncate text-xs text-gray-500">{new URL(link.url).hostname}</span>
                    </Link>
                    <div className="flex shrink-0 gap-0.5">
                      <Link href={`/hotel/links/edit?id=${link._id}`} title={tc("edit")} className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <BiPencil size={16} />
                        <span className="sr-only">{tc("edit")}</span>
                      </Link>
                      <button type="button" onClick={() => handleDelete(link)} title={tc("delete")} className="rounded p-1.5 text-gray-400 hover:bg-ember-100 hover:text-ember-600">
                        <BiTrash size={16} />
                        <span className="sr-only">{tc("delete")}</span>
                      </button>
                    </div>
                  </div>
                  {link.username && (
                    <p className="mt-3 flex items-center gap-1 text-sm text-gray-700">
                      <span className="text-gray-500">{t("fields.username")}:</span>
                      <span className="truncate font-medium">{link.username}</span>
                      <CopyButton value={link.username} />
                    </p>
                  )}
                  {link.notes && <p className="mt-2 line-clamp-2 text-xs text-gray-500">{link.notes}</p>}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`${primaryButtonClass} mt-auto w-fit`} style={{ marginTop: "1rem" }}>
                    <BiLinkExternal size={16} /> {t("open")}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default PortalLinkList;
