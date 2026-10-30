"use client";

import { createTeamMemberAction, type TeamMemberInput } from "@/app/actions/team";
import { PageHeader } from "@/components/shared/PageHeader";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import TeamForm from "./TeamForm";

/** "Add team member" page (superadmin only). */
const TeamAdd = () => {
  const t = useTranslations("Team");
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: TeamMemberInput) => {
    setSubmitting(true);
    const res = await createTeamMemberAction(data);
    if (res.ok && res.data) {
      toast.success(t("created", { name: `${res.data.firstName} ${res.data.lastName}`.trim() }));
      router.push(`/admin/team/${res.data._id}`);
    } else {
      toast.error(res.fieldErrors?.join(" ") || res.error || t("saveError"));
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("addTitle")}
        description={t("addDescription")}
        back={{ href: "/admin/team", label: t("backToTeam") }}
      />
      <TeamForm mode="add" submitting={submitting} onSubmit={handleSubmit} />
    </div>
  );
};

export default TeamAdd;
