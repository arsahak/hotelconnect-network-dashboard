"use client";

import type { FaultContact } from "@/app/actions/faultContact";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { BiEnvelope, BiGlobe, BiLogoWhatsapp, BiMessageSquareError, BiPencil, BiPhoneCall, BiTrash } from "react-icons/bi";

/**
 * One party on the storingslijst, built for a phone: the number is one big
 * button that calls; WhatsApp, email, website and "report" sit below it.
 */
export function FaultContactCard({
  contact,
  canEdit,
  onReport,
  onDelete,
}: {
  contact: FaultContact;
  canEdit: boolean;
  onReport: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("Faults");
  const small =
    "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary-dark";

  return (
    <article className="flex flex-col rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/hotel/faults/${contact._id}`} className="block truncate font-semibold text-gray-900 hover:text-primary-dark">
            {contact.name}
          </Link>
          {contact.notes && <p className="mt-0.5 text-xs text-gray-500">{contact.notes}</p>}
        </div>
        {canEdit && (
          <div className="flex shrink-0 gap-1">
            <Link href={`/hotel/faults/edit?id=${contact._id}`} title={t("edit")} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-primary-dark">
              <BiPencil size={16} />
              <span className="sr-only">{t("edit")}</span>
            </Link>
            <button type="button" onClick={onDelete} title={t("delete")} className="rounded-md p-1.5 text-gray-400 hover:bg-ember-100 hover:text-ember-600">
              <BiTrash size={16} />
              <span className="sr-only">{t("delete")}</span>
            </button>
          </div>
        )}
      </div>

      <a
        href={`tel:${contact.phone}`}
        className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark"
      >
        <BiPhoneCall size={20} />
        {contact.phone}
      </a>

      <div className="mt-2 flex flex-wrap gap-2">
        {contact.whatsapp && (
          <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={small}>
            <BiLogoWhatsapp size={16} /> WhatsApp
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`} className={small}>
            <BiEnvelope size={16} /> {t("emailButton")}
          </a>
        )}
        {contact.website && (
          <a href={contact.website} target="_blank" rel="noopener noreferrer" className={small}>
            <BiGlobe size={16} /> {t("websiteButton")}
          </a>
        )}
      </div>
      {contact.email && (
        <button type="button" onClick={onReport} className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-ember-600 hover:bg-ember-100">
          <BiMessageSquareError size={16} /> {t("reportButton")}
        </button>
      )}
    </article>
  );
}
