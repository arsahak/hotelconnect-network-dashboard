"use client";

import { invitePartnerAction, listPartnersAction } from "@/app/actions/partner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { primaryButtonClass } from "@/components/shared/form-styles";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiUserPlus } from "react-icons/bi";

/**
 * 1-click invite (Master Briefing v4): asks the contract's supplier to join
 * HotelConnect (free until 1 May 2028). Once on the platform, the hotel shows
 * under the supplier's My Partner Hotels.
 */
export function InvitePartnerButton({ contractId, email }: { contractId: string; email: string }) {
  const t = useTranslations("Partners");
  const tc = useTranslations("Common");
  const { data, reload } = useApiData(listPartnersAction, undefined);
  const [busy, setBusy] = useState(false);
  const partner = data?.find((p) => p.email === email.toLowerCase());

  if (partner?.status === "active") return <StatusBadge tone="green">{t("isPartner")}</StatusBadge>;

  const invite = async () => {
    setBusy(true);
    const res = await invitePartnerAction({ contract: contractId });
    setBusy(false);
    if (res.ok && res.data) {
      toast.success(res.data.status === "active" ? t("linked") : t("sent", { email }));
      reload();
    } else toast.error(res.error || tc("error"));
  };

  return (
    <button type="button" onClick={invite} disabled={busy} className={primaryButtonClass} title={t("hint")}>
      <BiUserPlus size={16} /> {partner ? t("inviteAgain") : t("invite")}
    </button>
  );
}
