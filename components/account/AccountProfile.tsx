"use client";

import { getMyAccountAction, type Account } from "@/app/actions/account";
import { signoutAction } from "@/app/actions/auth";
import { cardClass, cardTitleClass, dangerButtonClass, outlineButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { canAccess } from "@/config/access";
import { useFormatter, useTranslations } from "next-intl";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BiCalendar, BiCog, BiEnvelope, BiLogOut, BiPhone, BiRefresh, BiShieldQuarter } from "react-icons/bi";

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

/** "My profile": read-only overview of the signed-in account. */
const AccountProfile = () => {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const format = useFormatter();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  // State is only set once the request returns, never synchronously in the effect.
  const fetchAccount = useCallback(
    () =>
      getMyAccountAction().then((res) => {
        if (res.ok && res.data) {
          setAccount(res.data);
          setError(null);
        } else setError(res.error || t("loadError"));
        setLoading(false);
      }),
    [t],
  );

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  const load = () => {
    setLoading(true);
    fetchAccount();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="animate-pulse rounded border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100" />
            <div className="space-y-2">
              <div className="h-5 w-40 rounded bg-gray-100" />
              <div className="h-4 w-56 rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="animate-pulse rounded border border-gray-200 bg-white p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="rounded border border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">{error || t("loadError")}</p>
          <button type="button" onClick={load} className={`${outlineButtonClass} mt-4`}>
            <BiRefresh size={16} /> {tCommon("tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  const fullName = `${account.firstName} ${account.lastName}`.trim();
  const dateTime = (value: string) => format.dateTime(new Date(value), { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("title")}
        description={t("description")}
        actions={
          canAccess("/settings", account.role) && (
            <Link href="/settings" className={outlineButtonClass}>
              <BiCog size={16} /> {t("editSettings")}
            </Link>
          )
        }
      />

      {/* Identity */}
      <div className={cardClass}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900">
            {account.avatar ? (
              <span
                aria-hidden="true"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${account.avatar}")` }}
              />
            ) : (
              <span className="font-display text-2xl text-brass-400">{fullName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="font-display text-2xl text-gray-950">{fullName}</h2>
            <RoleBadge role={account.role} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Account details */}
      <div className={cardClass}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className={cardTitleClass.replace("mb-4 ", "")}>{t("accountDetails")}</h2>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-900"
          >
            <BiRefresh size={14} /> {t("refresh")}
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <InfoRow icon={<BiEnvelope size={16} />} label={t("email")} value={account.email} />
          <InfoRow icon={<BiPhone size={16} />} label={t("phone")} value={account.phone || "—"} />
          <InfoRow icon={<BiShieldQuarter size={16} />} label={t("role")} value={<RoleBadge role={account.role} />} />
          <InfoRow icon={<BiCalendar size={16} />} label={t("memberSince")} value={dateTime(account.createdAt)} />
          <InfoRow icon={<BiCalendar size={16} />} label={t("lastUpdated")} value={dateTime(account.updatedAt)} />
        </div>
      </div>

      {/* Session */}
      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{t("session")}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{t("sessionText")}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              setSigningOut(true);
              await signoutAction();
            }}
            disabled={signingOut}
            className={dangerButtonClass}
          >
            <BiLogOut size={16} />
            {signingOut ? t("signingOut") : t("signOut")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
