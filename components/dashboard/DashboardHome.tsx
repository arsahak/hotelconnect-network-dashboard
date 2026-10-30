"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { navigationFor } from "@/config/navigation";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

/** Start page: a welcome for the signed-in user and links to their pages. */
const DashboardHome = () => {
  const t = useTranslations("Dashboard");
  const tNav = useTranslations("Nav");
  const { name, role } = useSessionUser();
  const firstName = name.split(" ")[0] || name;

  // The main menu items this role can open (sub-pages like "Add member" are left out).
  const links = navigationFor(role)
    .flatMap((section) => section.items)
    .filter((page) => page.href !== "/dashboard");

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader
        title={t("welcome", { name: firstName })}
        description={t(`intro.${role}`)}
        actions={<RoleBadge role={role} />}
      />

      <section aria-labelledby="quick-links" className="rounded border border-gray-200 bg-white p-6">
        <h2 id="quick-links" className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
          {t("quickLinks")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {links.map((page) => {
            const Icon = page.icon;
            return (
              <Link
                key={page.href}
                href={page.href}
                className="group flex items-start gap-4 rounded-lg border border-gray-200 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_-18px_rgba(27,22,17,0.35)]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-100 text-brass-600 transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 font-display text-xl text-gray-950">
                    {tNav(`items.${page.key}.title`)}
                    <BiRightArrowAlt className="text-brass-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </span>
                  <span className="mt-1 block text-sm text-gray-500">{tNav(`items.${page.key}.description`)}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DashboardHome;
