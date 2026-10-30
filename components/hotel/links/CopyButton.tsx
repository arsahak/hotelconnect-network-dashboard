"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { BiCheck, BiCopy } from "react-icons/bi";

/** Copies a value (e.g. a username) to the clipboard. */
export function CopyButton({ value }: { value: string }) {
  const t = useTranslations("PortalLinks");
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      title={copied ? t("copied") : t("copy")}
      className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
    >
      {copied ? <BiCheck size={15} className="text-moss-600" /> : <BiCopy size={15} />}
      <span className="sr-only">{copied ? t("copied") : t("copy")}</span>
    </button>
  );
}
