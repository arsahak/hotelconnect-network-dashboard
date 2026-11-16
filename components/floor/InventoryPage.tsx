"use client";

import { createSpacesAction, deleteSpaceAction, getTodayAction, listSpacesAction, updateSpaceAction, type Space } from "@/app/actions/floor";
import { cardClass, inputClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { PageHeader } from "@/components/shared/PageHeader";
import { useApiData } from "@/lib/useApiData";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BiPlus, BiSave, BiTrash } from "react-icons/bi";

function AddSpaces({ onAdded }: { onAdded: () => void }) {
  const t = useTranslations("Floor.inventory");
  const tc = useTranslations("Common");
  const [value, setValue] = useState("");
  const [kind, setKind] = useState<Space["kind"]>("room");
  const [waterPoint, setWaterPoint] = useState(false);

  return (
    <form
      className={`${cardClass} flex flex-wrap items-center gap-2`}
      onSubmit={async (e) => {
        e.preventDefault();
        const range = /^\s*\d+\s*-\s*\d+\s*$/.test(value);
        const res = await createSpacesAction({ ...(range ? { range: value } : { name: value.trim() }), kind, waterPoint });
        if (res.ok && res.data) {
          toast.success(t("added", { count: res.data.length }));
          setValue("");
          onAdded();
        } else toast.error(res.error || tc("error"));
      }}
    >
      <input aria-label={t("nameOrRange")} required placeholder={t("nameOrRange")} value={value} onChange={(e) => setValue(e.target.value)} className={`${inputClass} min-w-48 flex-1`} />
      <select aria-label={t("kind")} value={kind} onChange={(e) => setKind(e.target.value as Space["kind"])} className={`${inputClass} w-auto`}>
        <option value="room">{t("room")}</option>
        <option value="space">{t("space")}</option>
      </select>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={waterPoint} onChange={(e) => setWaterPoint(e.target.checked)} /> {t("waterPoint")}
      </label>
      <button type="submit" className={primaryButtonClass}>
        <BiPlus size={16} /> {tc("add")}
      </button>
    </form>
  );
}

function SpaceRow({ space, manager, onChanged }: { space: Space; manager: boolean; onChanged: () => void }) {
  const t = useTranslations("Floor.inventory");
  const tf = useTranslations("Floor");
  const tc = useTranslations("Common");
  const [specs, setSpecs] = useState(space.specs);

  return (
    <li className="flex flex-col gap-2 p-3 sm:flex-row sm:items-start">
      <div className="sm:w-40">
        <p className="font-medium text-gray-950">{space.name}</p>
        <p className="text-xs text-gray-500">
          {t(space.kind)}
          {space.waterPoint && ` · ${t("waterPoint")}`}
        </p>
        {space.outOfOrder && <span className="mt-1 inline-block rounded bg-red-600 px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase text-white">{tf("outOfOrder")}</span>}
      </div>
      {manager ? (
        <div className="flex flex-1 gap-2">
          <textarea aria-label={t("specs")} rows={2} maxLength={2000} value={specs} onChange={(e) => setSpecs(e.target.value)} placeholder={t("specsPlaceholder")} className={`${inputClass} flex-1`} />
          <span className="flex flex-col gap-1">
            <button
              type="button"
              disabled={specs === space.specs}
              aria-label={tc("save")}
              onClick={async () => {
                const res = await updateSpaceAction(space._id, { specs });
                if (res.ok) {
                  toast.success(tc("saved"));
                  onChanged();
                } else toast.error(res.error || tc("error"));
              }}
              className={outlineButtonClass}
            >
              <BiSave size={16} />
            </button>
            <button type="button" aria-label={tc("delete")} onClick={async () => window.confirm(t("confirmDelete", { name: space.name })) && (await deleteSpaceAction(space._id)).ok && onChanged()} className="grid place-items-center rounded p-2 text-gray-400 hover:text-red-600">
              <BiTrash size={16} />
            </button>
          </span>
        </div>
      ) : (
        <p className="flex-1 whitespace-pre-line text-sm text-gray-700">{space.specs || "—"}</p>
      )}
    </li>
  );
}

/** Rooms & spaces + Inventory List (Master Briefing v4): RAL colours, bulb types, equipment models. */
export default function InventoryPage() {
  const t = useTranslations("Floor.inventory");
  const tf = useTranslations("Floor");
  const { data: today } = useApiData(getTodayAction, undefined);
  const { data: spaces, reload } = useApiData(listSpacesAction, undefined);
  const [q, setQ] = useState("");
  const manager = Boolean(today?.manager);
  const shown = spaces?.filter((s) => !q || `${s.name} ${s.specs}`.toLowerCase().includes(q.toLowerCase())) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <PageHeader title={t("title")} description={t("description")} back={{ href: "/floor", label: tf("back") }} />
      {manager && <AddSpaces onAdded={reload} />}
      <input aria-label={t("search")} placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} className={inputClass} />
      <ul className="divide-y divide-gray-100 rounded border border-gray-200 bg-white">
        {shown.map((s) => (
          <SpaceRow key={`${s._id}${s.specs}`} space={s} manager={manager} onChanged={reload} />
        ))}
        {spaces && !shown.length && <li className="p-6 text-center text-sm text-gray-500">{manager ? t("emptyManager") : t("empty")}</li>}
      </ul>
    </div>
  );
}
