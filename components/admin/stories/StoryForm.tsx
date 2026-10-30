"use client";

import type { ArticleInput, ArticleStatus } from "@/app/actions/article";
import { Field } from "@/components/shared/form/Field";
import { ImageField } from "@/components/shared/form/ImageField";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useOptionLabel, useOptions } from "@/lib/useOptions";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

// TinyMCE gives itself a random id, so it is only rendered in the browser
// (rendering it on the server too would never match).
const RichTextEditor = dynamic(() => import("@/components/shared/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-[560px] animate-pulse rounded-lg border border-gray-200 bg-gray-50" />,
});

export const EMPTY_STORY: ArticleInput = {
  title: "",
  kind: "Article",
  excerpt: "",
  body: "",
  status: "draft",
  publishedAt: "",
};

const STATUSES: ArticleStatus[] = ["draft", "published"];

/** Shared form for writing and editing a story. */
const StoryForm = ({
  initial = EMPTY_STORY,
  currentImage,
  onRemoveImage,
  submitting,
  submitLabel,
  cancelHref,
  onSubmit,
}: {
  initial?: ArticleInput;
  currentImage?: string;
  onRemoveImage?: () => void;
  submitting: boolean;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (data: ArticleInput, image: File | null) => void;
}) => {
  const t = useTranslations("Stories");
  const tc = useTranslations("Common");
  const options = useOptions();
  const optionLabel = useOptionLabel();
  const [form, setForm] = useState<ArticleInput>(initial);
  const [image, setImage] = useState<File | null>(null);

  const set = <K extends keyof ArticleInput>(key: K, value: ArticleInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form, image);
      }}
      className="grid gap-6 xl:grid-cols-3"
    >
      <div className="flex flex-col gap-6 xl:col-span-2">
        <div className={cardClass}>
          <div className="grid grid-cols-1 gap-4">
            <Field id="story-title" label={t("fields.title")} required>
              <input id="story-title" required maxLength={160} value={form.title} onChange={(e) => set("title", e.target.value)} className={cn(inputClass, "font-display text-xl")} />
            </Field>
            <Field id="story-excerpt" label={t("fields.excerpt")} hint={t("hints.excerpt", { count: form.excerpt.length })}>
              <textarea id="story-excerpt" rows={2} maxLength={300} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("fields.body")}</h2>
          <RichTextEditor value={form.body} onChange={(value) => set("body", value)} height={560} />
          <p className="mt-2 text-xs text-gray-500">{t("hints.body")}</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("sections.publish")}</h2>
          <div className="space-y-3">
            {STATUSES.map((status) => (
              <label
                key={status}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors",
                  form.status === status ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
                )}
              >
                <input type="radio" name="status" checked={form.status === status} onChange={() => set("status", status)} className="mt-1 accent-[var(--color-primary)]" />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{t(`statuses.${status}`)}</span>
                  <span className="block text-xs text-gray-500">{t(`statusHelp.${status}`)}</span>
                </span>
              </label>
            ))}
            <Field id="story-date" label={t("fields.publishedAt")} hint={t("hints.publishedAt")}>
              <input id="story-date" type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={inputClass} />
            </Field>
            <Field id="story-kind" label={t("fields.kind")}>
              <select id="story-kind" value={form.kind} onChange={(e) => set("kind", e.target.value)} className={inputClass}>
                {(options?.articleKinds ?? ["Article", "Interview", "Column"]).map((k) => (
                  <option key={k} value={k}>
                    {optionLabel("articleKinds", k)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="mt-5 flex gap-2 border-t border-gray-100 pt-5">
            <Link href={cancelHref} className={outlineButtonClass}>
              {tc("cancel")}
            </Link>
            <button type="submit" disabled={submitting} className={`${primaryButtonClass} flex-1`}>
              {submitting ? tc("saving") : submitLabel}
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <h2 className={cardTitleClass}>{t("sections.cover")}</h2>
          <ImageField currentUrl={currentImage} file={image} onFileChange={setImage} onRemoveCurrent={onRemoveImage} />
        </div>
      </div>
    </form>
  );
};

export default StoryForm;
