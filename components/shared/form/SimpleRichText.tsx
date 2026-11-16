"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { BiBold, BiItalic, BiLink, BiListOl, BiListUl } from "react-icons/bi";

/** Visible characters of an HTML string. */
export const textLength = (html: string) => {
  if (typeof document === "undefined") return html.replace(/<[^>]*>/g, "").length;
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent ?? "").replace(/\s+/g, " ").trim().length;
};

/** Older entries are plain text: turn their line breaks into paragraphs once. */
const toHtml = (value: string) =>
  /<[a-z][\s\S]*>/i.test(value)
    ? value
    : value
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((p) => `<p>${p.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>")}</p>`)
        .join("");

type Command = "bold" | "italic" | "insertUnorderedList" | "insertOrderedList" | "link";

/**
 * Small rich-text box (Master Briefing v4 job form): bold, italic, lists and
 * links, with a character counter. The API cleans the HTML again on save.
 */
export function SimpleRichText({
  id,
  value,
  onChange,
  max = 2000,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (html: string) => void;
  max?: number;
  placeholder?: string;
}) {
  const t = useTranslations("RichText");
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(() => textLength(value));

  // Fill the box once; afterwards the box itself is the source of truth.
  useEffect(() => {
    if (ref.current && !ref.current.innerHTML) ref.current.innerHTML = toHtml(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emit = () => {
    const html = ref.current?.innerHTML ?? "";
    const empty = !(ref.current?.textContent ?? "").trim();
    setCount(empty ? 0 : textLength(html));
    onChange(empty ? "" : html);
  };

  const run = (command: Command) => {
    ref.current?.focus();
    if (command === "link") {
      const url = window.prompt(t("linkPrompt"), "https://");
      if (!url || !/^(https?:\/\/|mailto:)/i.test(url)) return;
      document.execCommand("createLink", false, url);
    } else document.execCommand(command);
    emit();
  };

  const tools: { command: Command; label: string; icon: typeof BiBold }[] = [
    { command: "bold", label: t("bold"), icon: BiBold },
    { command: "italic", label: t("italic"), icon: BiItalic },
    { command: "insertUnorderedList", label: t("bullets"), icon: BiListUl },
    { command: "insertOrderedList", label: t("numbers"), icon: BiListOl },
    { command: "link", label: t("link"), icon: BiLink },
  ];

  const over = count > max;

  return (
    <div className={cn("rounded border bg-white transition-colors focus-within:border-primary", over ? "border-red-400" : "border-gray-300")}>
      <div role="toolbar" aria-label={t("toolbar")} aria-controls={id} className="flex flex-wrap gap-1 border-b border-gray-200 p-1.5">
        {tools.map(({ command, label, icon: Icon }) => (
          <button
            key={command}
            type="button"
            title={label}
            aria-label={label}
            // Keep the text selection while clicking a tool.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => run(command)}
            className="grid size-8 place-items-center rounded text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-950"
          >
            <Icon size={18} />
          </button>
        ))}
      </div>
      <div
        ref={ref}
        id={id}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onPaste={(e) => {
          // Paste as plain text: no fonts or colours from Word or websites.
          e.preventDefault();
          document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
        }}
        className="job-text min-h-44 px-3 py-2.5 text-sm leading-relaxed text-gray-900 outline-none empty:before:text-gray-400 empty:before:content-[attr(data-placeholder)]"
      />
      <p className={cn("border-t border-gray-100 px-3 py-1.5 text-right text-xs", over ? "font-medium text-red-600" : "text-gray-500")} aria-live="polite">
        {t("count", { count, max })}
      </p>
    </div>
  );
}
