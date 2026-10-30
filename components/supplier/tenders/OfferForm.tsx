"use client";

import { submitOfferAction, type Invitation } from "@/app/actions/supplierTender";
import { Field } from "@/components/shared/form/Field";
import { cardClass, cardTitleClass, inputClass, primaryButtonClass } from "@/components/shared/form-styles";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiFile, BiSend } from "react-icons/bi";

/**
 * The quote form (briefing §4.6): price, delivery time, notes and one PDF or
 * photo. The same form for every type of request; it can be sent again to
 * change the quote until the deadline.
 */
export function OfferForm({ invitation, onSaved }: { invitation: Invitation; onSaved: () => void }) {
  const t = useTranslations("SupplierTenders");
  const tc = useTranslations("Common");
  const offer = invitation.myOffer;
  const [price, setPrice] = useState(offer ? String(offer.price) : "");
  const [deliveryTime, setDeliveryTime] = useState(offer?.deliveryTime ?? "");
  const [notes, setNotes] = useState(offer?.notes ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.set("price", price);
        form.set("deliveryTime", deliveryTime);
        form.set("notes", notes);
        if (file) form.set("file", file);
        setSaving(true);
        const res = await submitOfferAction(invitation._id, form);
        setSaving(false);
        if (res.ok) {
          toast.success(offer ? t("quoteUpdated") : t("quoteSent"));
          setFile(null);
          onSaved();
        } else toast.error(res.error || tc("error"));
      }}
      className={cardClass}
    >
      <h2 className={cardTitleClass}>{offer ? t("changeQuote") : t("sendQuote")}</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id="offer-price" label={t("fields.price")} required>
          <input id="offer-price" type="number" required min={0} step="0.01" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€" className={inputClass} />
        </Field>
        <Field id="offer-delivery" label={t("fields.deliveryTime")} hint={t("hints.deliveryTime")}>
          <input id="offer-delivery" maxLength={100} value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)} placeholder={t("placeholders.deliveryTime")} className={inputClass} />
        </Field>
        <Field id="offer-notes" label={t("fields.notes")} className="md:col-span-2">
          <textarea id="offer-notes" rows={4} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass} />
        </Field>
        <Field id="offer-file" label={t("fields.file")} hint={t("hints.file")} className="md:col-span-2">
          <input
            id="offer-file"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-brass-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brass-700 hover:file:bg-brass-100/70"
          />
          {offer?.file && !file && (
            <a href={offer.file.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary-dark hover:underline">
              <BiFile size={15} /> {offer.file.name}
            </a>
          )}
        </Field>
      </div>
      <div className="mt-5 flex justify-end">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          <BiSend size={16} /> {saving ? tc("saving") : offer ? t("changeQuote") : t("sendQuote")}
        </button>
      </div>
    </form>
  );
}
