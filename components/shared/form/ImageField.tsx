"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BiImageAdd, BiTrash } from "react-icons/bi";
import { cn } from "@/lib/utils";
import { Thumb } from "../Thumb";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Photo picker with preview. The chosen file is handed to the form, which
 * uploads it after saving (a new record needs its id first).
 */
export function ImageField({
  currentUrl,
  file,
  onFileChange,
  onRemoveCurrent,
  shape = "wide",
}: {
  /** The photo already saved. */
  currentUrl?: string;
  /** A newly chosen photo, not uploaded yet. */
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Removes the saved photo (edit page). */
  onRemoveCurrent?: () => void;
  shape?: "wide" | "square";
}) {
  const t = useTranslations("ImageField");
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // A preview link for the chosen file, released when it changes.
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    // Reading the object URL into state is the point of this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = file ? previewUrl : currentUrl;

  const choose = (event: React.ChangeEvent<HTMLInputElement>) => {
    const picked = event.target.files?.[0];
    event.target.value = "";
    if (!picked) return;
    if (!TYPES.includes(picked.type)) return void toast.error(t("wrongType"));
    if (picked.size > MAX_BYTES) return void toast.error(t("tooLarge"));
    onFileChange(picked);
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50",
          shape === "wide" ? "aspect-[16/10] w-56" : "size-28",
        )}
      >
        <Thumb src={shown ?? undefined} alt="" fit={shape === "square" ? "contain" : "cover"} />
        {file && (
          <span className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white">
            {t("new")}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-primary hover:text-primary-dark"
        >
          <BiImageAdd size={18} />
          {shown ? t("replace") : t("choose")}
        </button>
        {file && (
          <button type="button" onClick={() => onFileChange(null)} className="text-left text-xs text-gray-500 hover:text-gray-900">
            {t("undo")}
          </button>
        )}
        {!file && currentUrl && onRemoveCurrent && (
          <button
            type="button"
            onClick={onRemoveCurrent}
            className="inline-flex items-center gap-1.5 text-left text-xs text-ember-600 hover:underline"
          >
            <BiTrash size={14} />
            {t("remove")}
          </button>
        )}
        <p className="max-w-56 text-xs text-gray-400">{t("hint")}</p>
        <input ref={inputRef} type="file" accept={TYPES.join(",")} onChange={choose} className="hidden" />
      </div>
    </div>
  );
}
