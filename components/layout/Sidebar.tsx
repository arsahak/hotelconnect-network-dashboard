"use client";

import { navigationFor, type NavItem } from "@/config/navigation";
import { Logo } from "@/components/shared/Logo";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useSidebarContext } from "@/lib/SidebarContext";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BiChevronDown, BiChevronsLeft, BiChevronsRight, BiChevronUp } from "react-icons/bi";

const isPathActive = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const Sidebar = () => {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const { role, organisation } = useSessionUser();
  const { isExpanded, toggleSidebar } = useSidebarContext();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const sections = navigationFor(role);

  const toggleSubMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key],
    );
  };

  const isItemActive = (item: NavItem) =>
    isPathActive(pathname, item.href) ||
    Boolean(item.sub?.some((sub) => isPathActive(pathname, sub.href)));

  // The most specific sub-link wins, so "/admin/team/add" doesn't also light up "/admin/team".
  const activeSubHref = (item: NavItem) =>
    item.sub
      ?.filter((sub) => isPathActive(pathname, sub.href))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  const itemClass = (active: boolean) =>
    cn(
      "group relative flex w-full items-center gap-3.5 rounded-lg transition-all",
      isExpanded ? "px-4 py-2.5" : "justify-center p-2.5",
      active
        ? "bg-brass-500/15 text-brass-400"
        : "text-white/70 hover:bg-white/[0.06] hover:text-white",
      // Thin brass line on the left of the open page.
      active && isExpanded && "before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-brass-400",
    );

  const renderInner = (item: NavItem, active: boolean, trailing?: React.ReactNode) => {
    const Icon = item.icon;
    return (
      <>
        <span className="flex-shrink-0">
          <Icon size={22} />
        </span>
        {isExpanded && (
          <>
            <span className="flex-1 text-left text-[0.9375rem] font-medium">{t(`items.${item.key}.title`)}</span>
            {trailing}
          </>
        )}
        {active && !isExpanded && (
          <div className="absolute -right-3 top-1/2 h-6 w-1 -translate-y-1/2 transform rounded-l-full bg-brass-400" />
        )}
        {/* Tooltip - only when collapsed */}
        {!isExpanded && (
          <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-2.5 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            {t(`items.${item.key}.title`)}
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-ink-950 transition-all duration-300",
        isExpanded ? "w-64" : "w-20",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-white/10",
          isExpanded ? "px-5" : "justify-center",
        )}
      >
        <Link
          href="/dashboard"
          className="flex flex-shrink-0 items-center transition-opacity hover:opacity-80"
          aria-label={t("home")}
        >
          <Logo tone="light" compact={!isExpanded} />
        </Link>
      </div>

      {/* The hotel this account belongs to */}
      {isExpanded && organisation && (
        <div className="border-b border-white/10 px-5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{t("organisation")}</p>
          <p className="mt-0.5 truncate font-display text-xl text-white">{organisation}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-scroll flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        {sections.map((section, sectionIndex) => (
          <div key={section.key ?? "main"} className={cn(sectionIndex > 0 && "mt-4")}>
            {section.key &&
              (isExpanded ? (
                <p className="mb-1.5 px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  {t(`sections.${section.key}`)}
                </p>
              ) : (
                <div className="mx-auto mb-3 h-px w-8 bg-white/10" aria-hidden="true" />
              ))}

            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = isItemActive(item);
                const hasSub = Boolean(item.sub && item.sub.length > 1);
                const isOpen = openMenus.includes(item.key) || (hasSub && active);
                const currentSub = activeSubHref(item);

                return (
                  <div key={item.key}>
                    {hasSub ? (
                      <button
                        type="button"
                        onClick={() => isExpanded && toggleSubMenu(item.key)}
                        className={itemClass(active)}
                        aria-expanded={isExpanded ? isOpen : undefined}
                      >
                        {renderInner(
                          item,
                          active,
                          isOpen ? (
                            <BiChevronUp size={18} className="flex-shrink-0" />
                          ) : (
                            <BiChevronDown size={18} className="flex-shrink-0" />
                          ),
                        )}
                      </button>
                    ) : (
                      <Link href={item.href} className={itemClass(active)}>
                        {renderInner(item, active)}
                      </Link>
                    )}

                    {/* Sub-menu items */}
                    {hasSub && isExpanded && isOpen && (
                      <div className="ml-6 mt-1 space-y-0.5 border-l border-white/15 pl-3">
                        {item.sub?.map((sub) => {
                          const SubIcon = sub.icon;
                          return (
                            <Link
                              key={sub.key}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-[0.875rem] transition-all",
                                currentSub === sub.href
                                  ? "bg-brass-500/15 font-medium text-brass-400"
                                  : "text-white/65 hover:bg-white/[0.06] hover:text-white",
                              )}
                            >
                              <span className="flex-shrink-0">
                                <SubIcon size={18} />
                              </span>
                              <span>{t(`items.${sub.key}.title`)}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Toggle Button - Centered vertically on right edge */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={isExpanded ? t("collapse") : t("expand")}
        className="fixed top-1/2 z-50 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:border-primary hover:bg-gray-50 hover:text-primary-dark"
        style={{ left: isExpanded ? "244px" : "68px" }}
      >
        {isExpanded ? <BiChevronsLeft size={14} /> : <BiChevronsRight size={14} />}
      </button>
    </div>
  );
};

export default Sidebar;
