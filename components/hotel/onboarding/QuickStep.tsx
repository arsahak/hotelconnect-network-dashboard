"use client";

import type { ReactNode } from "react";
import { cardClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { BiPlus, BiTrash } from "react-icons/bi";

/**
 * Onboarding steps 3–5: a short list of what's already there, an "Add"
 * button (opens a form in a popup) and Back / Continue. Every item can also
 * be added later from the dashboard, so the step can be skipped.
 */
export function QuickStep({
  title,
  description,
  addLabel,
  emptyText,
  items,
  onAdd,
  onDelete,
  onBack,
  onNext,
  extra,
}: {
  title: string;
  description: string;
  addLabel: string;
  emptyText: string;
  items: { id: string; title: string; meta?: ReactNode }[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  extra?: ReactNode;
}) {
  const t = useTranslations("Onboarding");
  return (
    <div className={cardClass}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-gray-950">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        </div>
        <button type="button" onClick={onAdd} className={primaryButtonClass}>
          <BiPlus size={18} /> {addLabel}
        </button>
      </div>

      {extra && <div className="mt-5">{extra}</div>}

      <ul className="mt-5 divide-y divide-gray-100 rounded-lg border border-gray-200">
        {items.length === 0 && <li className="px-4 py-8 text-center text-sm text-gray-500">{emptyText}</li>}
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
              {item.meta && <div className="text-xs text-gray-500">{item.meta}</div>}
            </div>
            <button type="button" onClick={() => onDelete(item.id)} title={t("remove")} className="rounded-md p-2 text-gray-400 hover:bg-ember-100 hover:text-ember-600">
              <BiTrash size={16} />
              <span className="sr-only">{t("remove")}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
        <button type="button" onClick={onBack} className={outlineButtonClass}>
          {t("back")}
        </button>
        <button type="button" onClick={onNext} className={primaryButtonClass}>
          {items.length ? t("continue") : t("skip")}
        </button>
      </div>
    </div>
  );
}
