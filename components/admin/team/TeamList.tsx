"use client";

import { deleteTeamMemberAction, listTeamAction, type TeamMember } from "@/app/actions/team";
import { outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import Pagination from "@/components/shared/Pagination";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useSessionUser } from "@/lib/SessionUserContext";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { BiPencil, BiPlus, BiRefresh, BiSearch, BiShow, BiTrash } from "react-icons/bi";

const PAGE_SIZE = 10;

/** Team list page: search, table, and links to add / view / edit. */
const TeamList = () => {
  const t = useTranslations("Team");
  const tCommon = useTranslations("Common");
  const format = useFormatter();
  const me = useSessionUser();
  const canManage = me.role === "superadmin";

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // State is only set once the request returns, never synchronously in the effect.
  const fetchTeam = useCallback(
    () =>
      listTeamAction().then((res) => {
        if (res.ok && res.data) {
          setMembers(res.data);
          setError(null);
        } else setError(res.error || t("loadError"));
        setLoading(false);
      }),
    [t],
  );

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  const load = () => {
    setLoading(true);
    fetchTeam();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) =>
      `${m.firstName} ${m.lastName} ${m.email} ${m.phone ?? ""}`.toLowerCase().includes(q),
    );
  }, [members, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (member: TeamMember) => {
    const name = `${member.firstName} ${member.lastName}`.trim();
    if (!window.confirm(t("confirmDelete", { name }))) return;
    setDeletingId(member._id);
    const res = await deleteTeamMemberAction(member._id);
    if (res.ok) {
      toast.success(t("deleted", { name }));
      setMembers((list) => list.filter((m) => m._id !== member._id));
    } else {
      toast.error(res.error || t("deleteError"));
    }
    setDeletingId(null);
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          canManage && (
            <Link href="/admin/team/add" className={primaryButtonClass}>
              <BiPlus size={18} /> {t("add")}
            </Link>
          )
        }
      />

      <div className="rounded border border-gray-200 bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 p-4">
          <div className="relative w-full max-w-sm">
            <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </div>
          <button type="button" onClick={load} className={outlineButtonClass}>
            <BiRefresh size={16} /> {tCommon("refresh")}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("columns.member")}</th>
                <th className="px-5 py-3 font-semibold">{t("columns.role")}</th>
                <th className="px-5 py-3 font-semibold">{t("columns.status")}</th>
                <th className="hidden px-5 py-3 font-semibold xl:table-cell">{t("columns.added")}</th>
                <th className="px-5 py-3 text-right font-semibold">{t("columns.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-5 py-4">
                      <div className="h-9 animate-pulse rounded bg-gray-100" />
                    </td>
                  </tr>
                ))}

              {!loading && error && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-500">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center text-sm text-gray-500">
                    {query ? t("noResults") : t("empty")}
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                visible.map((member) => {
                  const name = `${member.firstName} ${member.lastName}`.trim();
                  const isMe = member.email === me.email;
                  return (
                    <tr key={member._id} className="transition-colors hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <Link href={`/admin/team/${member._id}`} className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brass-100 font-display text-base text-brass-600">
                            {name.charAt(0).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 font-medium text-gray-900">
                              {name}
                              {isMe && (
                                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                                  {t("you")}
                                </span>
                              )}
                            </span>
                            <span className="block truncate text-xs text-gray-500">{member.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <RoleBadge role={member.role} />
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                            member.isActive ? "bg-moss-100 text-moss-600" : "bg-ember-100 text-ember-600",
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {member.isActive ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-5 py-3 text-gray-500 xl:table-cell">
                        {format.dateTime(new Date(member.createdAt), { dateStyle: "medium" })}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Link
                            href={`/admin/team/${member._id}`}
                            title={t("view")}
                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <BiShow size={18} />
                            <span className="sr-only">{t("view")}</span>
                          </Link>
                          {canManage && !isMe && (
                            <>
                              <Link
                                href={`/admin/team/edit?id=${member._id}`}
                                title={t("edit")}
                                className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-dark"
                              >
                                <BiPencil size={18} />
                                <span className="sr-only">{t("edit")}</span>
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(member)}
                                disabled={deletingId === member._id}
                                title={t("delete")}
                                className="rounded-md p-2 text-gray-500 hover:bg-ember-100 hover:text-ember-600 disabled:opacity-50"
                              >
                                <BiTrash size={18} />
                                <span className="sr-only">{t("delete")}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {!loading && !error && filtered.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamList;
