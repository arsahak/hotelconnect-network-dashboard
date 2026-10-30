"use client";

import { deleteArticleAction, listArticlesAction, type Article } from "@/app/actions/article";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { ListToolbar } from "@/components/shared/ListToolbar";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { RowActions } from "@/components/shared/RowActions";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TableStatus } from "@/components/shared/TableStatus";
import { Thumb } from "@/components/shared/Thumb";
import { useApiData, useDebounced } from "@/lib/useApiData";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus } from "react-icons/bi";

const PAGE_SIZE = 20;

/** Stories list page: drafts and published stories. */
const StoryList = () => {
  const t = useTranslations("Stories");
  const tc = useTranslations("Common");
  const format = useFormatter();
  const options = useOptions();
  const optionLabel = useOptionLabel();

  const [search, setSearch] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, loading, error, reload } = useApiData(listArticlesAction, { q, kind, status, page, limit: PAGE_SIZE });
  const stories = data?.items ?? [];

  const resetPage = (set: (v: string) => void) => (value: string) => {
    set(value);
    setPage(1);
  };

  const handleDelete = async (story: Article) => {
    if (!window.confirm(t("confirmDelete", { title: story.title }))) return;
    const res = await deleteArticleAction(story._id);
    if (res.ok) {
      toast.success(t("deleted", { title: story.title }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Link href="/admin/stories/add" className={primaryButtonClass}>
            <BiPlus size={18} /> {t("add")}
          </Link>
        }
      />

      <div className="rounded border border-gray-200 bg-white">
        <ListToolbar
          search={search}
          onSearch={resetPage(setSearch)}
          placeholder={t("searchPlaceholder")}
          onRefresh={reload}
          filters={[
            {
              id: "kind",
              label: t("fields.kind"),
              value: kind,
              onChange: resetPage(setKind),
              allLabel: t("allKinds"),
              options: (options?.articleKinds ?? []).map((k) => ({ value: k, label: optionLabel("articleKinds", k) })),
            },
            {
              id: "status",
              label: tc("status"),
              value: status,
              onChange: resetPage(setStatus),
              allLabel: tc("allStatuses"),
              options: [
                { value: "draft", label: t("statuses.draft") },
                { value: "published", label: t("statuses.published") },
              ],
            },
          ]}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.story")}</th>
                <th className="px-5 py-3 font-semibold">{tc("status")}</th>
                <th className="hidden px-5 py-3 font-semibold lg:table-cell">{t("fields.publishedAt")}</th>
                <th className="px-5 py-3 text-right font-semibold">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <TableStatus colSpan={4} loading={loading} error={error} empty={stories.length === 0} emptyText={q || kind || status ? tc("noResults") : t("empty")} />
              {!loading &&
                stories.map((story) => (
                  <tr key={story._id} className="transition-colors hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <Link href={`/admin/stories/${story._id}`} className="flex items-center gap-3">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-md bg-gray-100">
                          <Thumb src={story.image} alt="" />
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-md truncate font-medium text-gray-900">{story.title}</span>
                          <span className="block text-xs text-gray-500">
                            {optionLabel("articleKinds", story.kind)} · {t("minutes", { count: story.readingMinutes })}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge tone={story.status === "published" ? "green" : "brass"}>{t(`statuses.${story.status}`)}</StatusBadge>
                    </td>
                    <td className="hidden whitespace-nowrap px-5 py-3 text-gray-500 lg:table-cell">
                      {story.publishedAt ? format.dateTime(new Date(story.publishedAt), { dateStyle: "medium" }) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <RowActions viewHref={`/admin/stories/${story._id}`} editHref={`/admin/stories/edit?id=${story._id}`} onDelete={() => handleDelete(story)} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="border-t border-gray-200 p-4">
            <Pagination currentPage={data.page} totalPages={data.pages} onPageChange={setPage} totalItems={data.total} pageSize={PAGE_SIZE} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryList;
