"use client";

import { signoutAction } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { useTranslations } from "next-intl";
import { BiLogOut } from "react-icons/bi";

export function OnboardingTopbar() {
  const t = useTranslations("Topbar");
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <Logo />
      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <button type="button" onClick={() => signoutAction()} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">
          <BiLogOut size={18} />
          <span className="hidden sm:inline">{t("signOut")}</span>
        </button>
      </div>
    </header>
  );
}
