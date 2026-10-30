"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiPencil, BiShow, BiTrash } from "react-icons/bi";

/** View / edit / delete icons at the end of a table row. */
export function RowActions({ viewHref, editHref, onDelete }: { viewHref: string; editHref: string; onDelete: () => void }) {
  const tc = useTranslations("Common");
  return (
    <div className="flex justify-end gap-1">
      <Link href={viewHref} title={tc("view")} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
        <BiShow size={18} />
        <span className="sr-only">{tc("view")}</span>
      </Link>
      <Link href={editHref} title={tc("edit")} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-primary-dark">
        <BiPencil size={18} />
        <span className="sr-only">{tc("edit")}</span>
      </Link>
      <button type="button" onClick={onDelete} title={tc("delete")} className="rounded-md p-2 text-gray-500 hover:bg-ember-100 hover:text-ember-600">
        <BiTrash size={18} />
        <span className="sr-only">{tc("delete")}</span>
      </button>
    </div>
  );
}

