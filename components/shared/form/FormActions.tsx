"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { outlineButtonClass, primaryButtonClass } from "../form-styles";

/** Cancel (a link or a button) + submit, at the bottom of every form. */
export function FormActions({
  submitting,
  submitLabel,
  cancelHref,
  onCancel,
  disabled,
}: {
  submitting: boolean;
  submitLabel: string;
  cancelHref?: string;
  onCancel?: () => void;
  disabled?: boolean;
}) {
  const tc = useTranslations("Common");
  return (
    <div className="flex justify-end gap-2">
      {onCancel ? (
        <button type="button" onClick={onCancel} className={outlineButtonClass}>
          {tc("cancel")}
        </button>
      ) : (
        cancelHref && (
          <Link href={cancelHref} className={outlineButtonClass}>
            {tc("cancel")}
          </Link>
        )
      )}
      <button type="submit" disabled={submitting || disabled} className={primaryButtonClass}>
        {submitting ? tc("saving") : submitLabel}
      </button>
    </div>
  );
}
