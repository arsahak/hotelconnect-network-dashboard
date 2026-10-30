"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { KENNISBANK } from "@/lib/kennisbank";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { BiChevronDown, BiInfoCircle, BiLinkExternal, BiSearch } from "react-icons/bi";

/**
 * Kennisbank wet- en regelgeving (briefing §3.4.2): eight categories, each
 * topic with a short explanation and a link to the official source (new tab).
 * For the hotel manager and the staff login (§3.6).
 */
const Kennisbank = () => {
  const t = useTranslations("Kennisbank");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [closed, setClosed] = useState<string[]>([]);

  const q = query.trim().toLowerCase();
  const categories = useMemo(
    () =>
      KENNISBANK.filter((c) => !category || c.key === category)
        .map((c) => ({
          ...c,
          topics: c.topics.filter((topic) => !q || `${topic.topic} ${topic.explanation} ${topic.source}`.toLowerCase().includes(q)),
        }))
        .filter((c) => c.topics.length > 0),
    [q, category],
  );
  const total = categories.reduce((n, c) => n + c.topics.length, 0);

  const toggle = (key: string) => setClosed((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("description")} />

      <div className="flex gap-3 rounded border border-brass-400/40 bg-brass-100/60 p-4 text-sm text-ink-700">
        <BiInfoCircle size={20} className="mt-0.5 shrink-0 text-brass-600" />
        <p>{t("intro")}</p>
      </div>

      <div className="flex flex-col gap-3 rounded border border-gray-200 bg-white p-4">
        <label className="relative">
          <span className="sr-only">{t("search")}</span>
          <BiSearch size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded border border-gray-200 pl-10 pr-3 text-sm outline-none focus:border-primary"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {[{ key: null, icon: "", name: t("all") }, ...KENNISBANK].map((c) => (
            <button
              key={c.key ?? "all"}
              type="button"
              onClick={() => setCategory(c.key)}
              aria-pressed={category === c.key}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === c.key ? "border-ink-950 bg-ink-950 text-white" : "border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900",
              )}
            >
              {c.icon && <span className="mr-1">{c.icon}</span>}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <div className="rounded border border-gray-200 bg-white py-16 text-center text-sm text-gray-500">{t("empty")}</div>
      ) : (
        categories.map((c) => {
          const open = Boolean(q) || !closed.includes(c.key);
          return (
            <section key={c.key} className="overflow-hidden rounded border border-gray-200 bg-white">
              <button type="button" onClick={() => toggle(c.key)} aria-expanded={open} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-gray-50">
                <span className="text-xl" aria-hidden="true">{c.icon}</span>
                <span className="flex-1 font-display text-xl text-gray-950">{c.name}</span>
                <span className="text-xs text-gray-500">{t("topics", { count: c.topics.length })}</span>
                <BiChevronDown size={20} className={cn("text-gray-400 transition-transform", open && "rotate-180")} />
              </button>
              {open && (
                <ul className="divide-y divide-gray-100 border-t border-gray-100">
                  {c.topics.map((topic) => (
                    <li key={topic.topic + topic.source} className="grid gap-2 px-5 py-4 md:grid-cols-[minmax(0,14rem)_1fr_auto] md:items-start md:gap-6">
                      <p className="font-semibold text-gray-900">{topic.topic}</p>
                      <p className="text-sm text-gray-600">{topic.explanation}</p>
                      <a
                        href={topic.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-dark hover:underline md:justify-end md:text-right"
                      >
                        {topic.source}
                        <BiLinkExternal size={14} className="shrink-0" />
                        <span className="sr-only">{t("opensNewTab")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })
      )}

      <p className="text-xs text-gray-500">{t("disclaimer")}</p>
    </div>
  );
};

export default Kennisbank;
