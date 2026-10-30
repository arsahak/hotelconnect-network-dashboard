"use client";

import { getTeamMemberAction, updateTeamMemberAction, type TeamMember, type TeamMemberInput } from "@/app/actions/team";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import TeamForm from "./TeamForm";

/** "Edit team member" page — /team/edit?id=… (superadmin only). */
const TeamEdit = () => {
  const t = useTranslations("Team");
  const router = useRouter();
  const id = useSearchParams().get("id") ?? "";
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTeamMemberAction(id).then((res) => {
      if (res.ok && res.data) setMember(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (data: TeamMemberInput) => {
    setSubmitting(true);
    const res = await updateTeamMemberAction(id, data);
    if (res.ok && res.data) {
      toast.success(t("updated", { name: `${res.data.firstName} ${res.data.lastName}`.trim() }));
      router.push(`/admin/team/${id}`);
    } else {
      toast.error(res.fieldErrors?.join(" ") || res.error || t("saveError"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("editTitle")}
        description={member ? `${member.firstName} ${member.lastName}`.trim() : undefined}
        back={{ href: id ? `/admin/team/${id}` : "/admin/team", label: id ? t("backToMember") : t("backToTeam") }}
      />

      {loading ? (
        <div className="rounded border border-gray-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      ) : member ? (
        <TeamForm mode="edit" initial={member} submitting={submitting} onSubmit={handleSubmit} />
      ) : (
        <div className="rounded border border-gray-200 bg-white py-20 text-center text-sm text-gray-500">
          {t("notFound")}
        </div>
      )}
    </div>
  );
};

export default TeamEdit;
