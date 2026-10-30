import Link from "next/link";
import type { ReactNode } from "react";
import { BiArrowBack } from "react-icons/bi";

/**
 * The white header card at the top of every dashboard page: optional back
 * link, title (Gilda, like the website), description and action buttons.
 */
export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-6">
      {back && (
        <Link
          href={back.href}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <BiArrowBack size={16} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="heading-strong font-display text-3xl text-gray-950">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
