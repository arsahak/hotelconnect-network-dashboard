"use client";

import { deleteTeamMemberAction, getTeamMemberAction, type TeamMember } from "@/app/actions/team";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useSessionUser } from "@/lib/SessionUserContext";
import { cn } from "@/lib/utils";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "react-hot-toast";
import { BiCalendar, BiCheckShield, BiEnvelope, BiPencil, BiPhone, BiShieldQuarter, BiTrash } from "react-icons/bi";

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <div className="break-all text-sm font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}

/** Team member details page — /team/[id]. */
const TeamDetails = ({ id }: { id: string }) => {
  const t = useTranslations("Team");
  const format = useFormatter();
  const router = useRouter();
  const me = useSessionUser();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getTeamMemberAction(id).then((res) => {
      if (res.ok && res.data) setMember(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="h-32 animate-pulse rounded border border-gray-200 bg-white" />
        <div className="h-48 animate-pulse rounded border border-gray-200 bg-white" />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <PageHeader title={t("notFound")} back={{ href: "/admin/team", label: t("backToTeam") }} />
      </div>
    );
  }

  const name = `${member.firstName} ${member.lastName}`.trim();
  const canManage = me.role === "superadmin" && member.email !== me.email;
  const dateTime = (value: string) => format.dateTime(new Date(value), { dateStyle: "long", timeStyle: "short" });

  const handleDelete = async () => {
    if (!window.confirm(t("confirmDelete", { name }))) return;
    setDeleting(true);
    const res = await deleteTeamMemberAction(member._id);
    if (res.ok) {
      toast.success(t("deleted", { name }));
      router.push("/admin/team");
    } else {
      toast.error(res.error || t("deleteError"));
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={name}
        description={member.email}
        back={{ href: "/admin/team", label: t("backToTeam") }}
        actions={
          canManage && (
            <>
              <Link href={`/admin/team/edit?id=${member._id}`} className={outlineButtonClass}>
                <BiPencil size={16} /> {t("edit")}
              </Link>
              <button type="button" onClick={handleDelete} disabled={deleting} className={dangerButtonClass}>
                <BiTrash size={16} /> {t("delete")}
              </button>
            </>
          )
        }
      />

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.details")}</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow icon={<BiEnvelope size={16} />} label={t("fields.email")} value={member.email} />
          <InfoRow icon={<BiPhone size={16} />} label={t("fields.phone")} value={member.phone || "—"} />
          <InfoRow icon={<BiShieldQuarter size={16} />} label={t("fields.role")} value={<RoleBadge role={member.role} />} />
          <InfoRow
            icon={<BiCheckShield size={16} />}
            label={t("columns.status")}
            value={
              <span
                className={cn(
                  "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                  member.isActive ? "bg-moss-100 text-moss-600" : "bg-ember-100 text-ember-600",
                )}
              >
                {member.isActive ? t("active") : t("inactive")}
              </span>
            }
          />
          <InfoRow icon={<BiCalendar size={16} />} label={t("memberSince")} value={dateTime(member.createdAt)} />
          <InfoRow icon={<BiCalendar size={16} />} label={t("lastUpdated")} value={dateTime(member.updatedAt)} />
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
