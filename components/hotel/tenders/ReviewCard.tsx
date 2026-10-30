"use client";

import { reviewTenderAction, type Review, type ReviewInput } from "@/app/actions/tender";
import { Field } from "@/components/shared/form/Field";
import { cardClass, cardTitleClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPencil, BiSolidStar, BiStar } from "react-icons/bi";

function Stars({ value, onChange, label }: { value: number; onChange?: (v: number) => void; label: string }) {
  return (
    <div role={onChange ? "radiogroup" : "img"} aria-label={label} className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const Icon = n <= value ? BiSolidStar : BiStar;
        return onChange ? (
          <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n}`} onClick={() => onChange(n)} className="rounded p-0.5 text-brass-500 hover:scale-110">
            <Icon size={26} />
          </button>
        ) : (
          <Icon key={n} size={18} className="text-brass-500" />
        );
      })}
    </div>
  );
}

function YesNo({ value, onChange, yes, no }: { value: boolean | null; onChange: (v: boolean) => void; yes: string; no: string }) {
  return (
    <div className="flex gap-2">
      {[true, false].map((option) => (
        <button
          key={String(option)}
          type="button"
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
            value === option ? "border-primary bg-primary/10 text-primary-dark" : "border-gray-200 text-gray-600 hover:border-gray-300",
          )}
        >
          {option ? yes : no}
        </button>
      ))}
    </div>
  );
}

/**
 * Kwaliteitsformulier (briefing §3.8): once the job is done the hotel rates
 * the chosen supplier. The result moves the supplier up or down the ranking.
 */
export function ReviewCard({ tenderId, supplierName, review, onSaved }: { tenderId: string; supplierName: string; review: Review | null; onSaved: () => void }) {
  const t = useTranslations("Tenders.review");
  const tc = useTranslations("Common");
  const [editing, setEditing] = useState(!review);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{ rating: number; communication: number; onTime: boolean | null; wouldHireAgain: boolean | null; comments: string }>({
    rating: review?.rating ?? 0,
    communication: review?.communication ?? 0,
    onTime: review?.onTime ?? null,
    wouldHireAgain: review?.wouldHireAgain ?? null,
    comments: review?.comments ?? "",
  });
  const complete = form.rating > 0 && form.communication > 0 && form.onTime !== null && form.wouldHireAgain !== null;

  if (review && !editing) {
    return (
      <section className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <h2 className={cardTitleClass}>{t("title", { name: supplierName })}</h2>
          <button type="button" onClick={() => setEditing(true)} className={`${outlineButtonClass} px-3 py-1.5 text-xs`}>
            <BiPencil size={14} /> {tc("edit")}
          </button>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">{t("rating")}</dt>
            <dd className="mt-1"><Stars value={review.rating} label={`${review.rating}/5`} /></dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{t("communication")}</dt>
            <dd className="mt-1"><Stars value={review.communication} label={`${review.communication}/5`} /></dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{t("onTime")}</dt>
            <dd className="mt-1 font-medium text-gray-900">{review.onTime ? tc("yes") : tc("no")}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{t("wouldHireAgain")}</dt>
            <dd className="mt-1 font-medium text-gray-900">{review.wouldHireAgain ? tc("yes") : tc("no")}</dd>
          </div>
        </dl>
        {review.comments && <p className="mt-4 whitespace-pre-line border-t border-gray-100 pt-4 text-sm text-gray-700">{review.comments}</p>}
      </section>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!complete) return;
        setSaving(true);
        const res = await reviewTenderAction(tenderId, { ...form, onTime: form.onTime!, wouldHireAgain: form.wouldHireAgain! } as ReviewInput);
        setSaving(false);
        if (res.ok) {
          toast.success(t("saved"));
          setEditing(false);
          onSaved();
        } else toast.error(res.error || tc("error"));
      }}
      className={cn(cardClass, "border-brass-400/50")}
    >
      <h2 className={cardTitleClass}>{t("title", { name: supplierName })}</h2>
      <p className="-mt-2 mb-5 text-sm text-gray-500">{t("intro")}</p>
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="review-rating" label={t("rating")} required>
          <Stars value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} label={t("rating")} />
        </Field>
        <Field id="review-communication" label={t("communication")} required>
          <Stars value={form.communication} onChange={(v) => setForm((f) => ({ ...f, communication: v }))} label={t("communication")} />
        </Field>
        <Field id="review-ontime" label={t("onTime")} required>
          <YesNo value={form.onTime} onChange={(v) => setForm((f) => ({ ...f, onTime: v }))} yes={tc("yes")} no={tc("no")} />
        </Field>
        <Field id="review-again" label={t("wouldHireAgain")} required>
          <YesNo value={form.wouldHireAgain} onChange={(v) => setForm((f) => ({ ...f, wouldHireAgain: v }))} yes={tc("yes")} no={tc("no")} />
        </Field>
        <Field id="review-comments" label={t("comments")} className="md:col-span-2">
          <textarea id="review-comments" rows={3} maxLength={2000} value={form.comments} onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))} className={inputClass} />
        </Field>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        {review && (
          <button type="button" onClick={() => setEditing(false)} className={outlineButtonClass}>
            {tc("cancel")}
          </button>
        )}
        <button type="submit" disabled={!complete || saving} className={primaryButtonClass}>
          {saving ? tc("saving") : t("save")}
        </button>
      </div>
    </form>
  );
}
