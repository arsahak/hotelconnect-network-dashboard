"use client";

import { getMyAccountAction } from "@/app/actions/account";
import { signoutAction } from "@/app/actions/auth";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { NotificationBell } from "./NotificationBell";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { canAccess } from "@/config/access";
import { pagesFor } from "@/config/navigation";
import { useSessionUser } from "@/lib/SessionUserContext";
import { useSidebarContext } from "@/lib/SidebarContext";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiChevronDown, BiCog, BiLogOut, BiSearch, BiUser } from "react-icons/bi";

const Topbar = () => {
  const t = useTranslations("Topbar");
  const tNav = useTranslations("Nav");
  const { isExpanded } = useSidebarContext();
  const sessionUser = useSessionUser();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Searchable pages = the pages this role can open, in the chosen language.
  const pages = useMemo(
    () =>
      pagesFor(sessionUser.role).map((page) => ({
        ...page,
        title: tNav(`items.${page.key}.title`),
        description: tNav(`items.${page.key}.description`),
      })),
    [sessionUser.role, tNav],
  );

  const matchedPages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pages.slice(0, 7);
    return pages
      .map((page) => {
        const title = page.title.toLowerCase();
        const searchable = `${page.title} ${page.description} ${page.href}`.toLowerCase();
        const score = title.startsWith(query) ? 0 : title.includes(query) ? 1 : searchable.includes(query) ? 2 : 99;
        return { page, score };
      })
      .filter(({ score }) => score < 99)
      .sort((a, b) => a.score - b.score || a.page.title.localeCompare(b.page.title))
      .map(({ page }) => page);
  }, [searchQuery, pages]);

  // Page title: the menu item whose link matches this path most closely.
  const currentTitle = useMemo(() => {
    const match = pages
      .filter((page) => pathname === page.href || pathname.startsWith(`${page.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.title ?? tNav("items.dashboard.title");
  }, [pages, pathname, tNav]);

  useEffect(() => {
    const openGlobalSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", openGlobalSearch);
    return () => window.removeEventListener("keydown", openGlobalSearch);
  }, []);

  // Close the search list and the user menu when clicking outside them.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (searchRef.current && !searchRef.current.contains(target)) setIsSearchOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Name, email and role come from the session; only the photo is fetched.
  useEffect(() => {
    getMyAccountAction()
      .then((res) => {
        if (res.ok && res.data?.avatar) setAvatar(res.data.avatar);
      })
      .catch(() => {});
  }, []);

  const goToPage = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveResult((current) => Math.min(current + 1, matchedPages.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveResult((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && matchedPages[activeResult]) {
      event.preventDefault();
      goToPage(matchedPages[activeResult].href);
    }
  };

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    await signoutAction();
  };

  const canOpenSettings = canAccess("/settings", sessionUser.role);

  return (
    <div
      className="fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 transition-all duration-300"
      style={{ left: isExpanded ? "256px" : "80px" }}
    >
      {/* Current page */}
      <div className="flex min-w-0 items-center">
        <span className="truncate text-lg font-semibold text-gray-900">{currentTitle}</span>
      </div>

      {/* Right side - search, language and user */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-60 xl:w-96" ref={searchRef}>
          <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            role="combobox"
            aria-expanded={isSearchOpen}
            aria-controls="dashboard-global-search"
            aria-activedescendant={matchedPages[activeResult] ? `search-result-${activeResult}` : undefined}
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setActiveResult(0);
              setIsSearchOpen(true);
            }}
            onFocus={() => {
              setIsSearchOpen(true);
              setActiveResult(0);
            }}
            onKeyDown={handleSearchKeyDown}
            className="h-10 w-full rounded-lg border border-gray-200 py-2 pl-10 pr-16 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-gray-400 xl:inline">
            ⌘ K
          </kbd>

          {isSearchOpen && (
            <div
              id="dashboard-global-search"
              role="listbox"
              className="absolute right-0 mt-2 w-[420px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_18px_55px_rgba(27,22,17,0.16)]"
            >
              {matchedPages.length > 0 ? (
                <div className="max-h-[430px] overflow-y-auto p-2">
                  <p className="px-2 pb-2 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                    {searchQuery.trim() ? t("results", { count: matchedPages.length }) : t("quickAccess")}
                  </p>
                  {matchedPages.map((page, index) => {
                    const Icon = page.icon;
                    return (
                      <button
                        key={page.href}
                        id={`search-result-${index}`}
                        role="option"
                        aria-selected={activeResult === index}
                        onMouseEnter={() => setActiveResult(index)}
                        onClick={() => goToPage(page.href)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${activeResult === index ? "bg-primary/[0.08]" : "hover:bg-gray-50"}`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activeResult === index ? "bg-primary/15 text-primary-dark" : "bg-gray-100 text-gray-500"}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-gray-800">{page.title}</span>
                          <span className="mt-0.5 block truncate text-xs text-gray-400">{page.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="px-6 py-10 text-center">
                  <BiSearch className="mx-auto text-gray-300" size={30} />
                  <p className="mt-3 text-sm font-semibold text-gray-700">{t("noPages")}</p>
                  <p className="mt-1 text-xs text-gray-400">{t("noPagesHint")}</p>
                </div>
              )}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2 text-[10px] text-gray-400">
                <span>
                  <kbd className="rounded border bg-white px-1">↑</kbd> <kbd className="rounded border bg-white px-1">↓</kbd>{" "}
                  {t("navigate")}
                </span>
                <span>
                  <kbd className="rounded border bg-white px-1">Enter</kbd> {t("open")} ·{" "}
                  <kbd className="rounded border bg-white px-1">Esc</kbd> {t("close")}
                </span>
              </div>
            </div>
          )}
        </div>

        {(sessionUser.role === "hotel_manager" || sessionUser.role === "supplier") && <NotificationBell />}

        <LanguageSwitcher />

        {/* User menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-label={t("userMenu")}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-900">
              {avatar ? (
                <span
                  aria-hidden="true"
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url("${avatar}")` }}
                />
              ) : (
                <span className="font-display text-base text-brass-400">
                  {(sessionUser.name || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <BiChevronDown className={`text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 origin-top-right rounded-md border border-gray-100 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="truncate text-sm font-medium text-gray-900">{sessionUser.name || t("user")}</p>
                <p className="truncate text-xs text-gray-500">{sessionUser.email}</p>
                <RoleBadge role={sessionUser.role} className="mt-2" />
              </div>
              <Link
                href="/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <BiUser className="mr-3 h-5 w-5 text-gray-400" />
                {t("profile")}
              </Link>
              {canOpenSettings && (
                <Link
                  href="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BiCog className="mr-3 h-5 w-5 text-gray-400" />
                  {t("settings")}
                </Link>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <BiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                {t("signOut")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
