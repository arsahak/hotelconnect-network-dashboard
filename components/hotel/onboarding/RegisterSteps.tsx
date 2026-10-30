"use client";

import { createContractAction, deleteContractAction, listContractsAction } from "@/app/actions/contract";
import { createFaultContactAction, deleteFaultContactAction, listFaultContactsAction } from "@/app/actions/faultContact";
import { createPermitAction, deletePermitAction, listPermitsAction } from "@/app/actions/permit";
import ContractForm from "@/components/hotel/contracts/ContractForm";
import FaultForm from "@/components/hotel/faults/FaultForm";
import PermitForm, { EMPTY_PERMIT } from "@/components/hotel/permits/PermitForm";
import { PermitSuggestions } from "@/components/hotel/permits/PermitSuggestions";
import { Modal } from "@/components/shared/Modal";
import { useApiData } from "@/lib/useApiData";
import { useOptionLabel } from "@/lib/useOptions";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { QuickStep } from "./QuickStep";

type StepProps = { onBack: () => void; onNext: () => void };

/** Run a create/delete action, toast the result, reload the list. */
async function run(action: () => Promise<{ ok: boolean; error?: string }>, success: string, error: string, after: () => void) {
  const res = await action();
  if (res.ok) {
    toast.success(success);
    after();
    return true;
  }
  toast.error(res.error || error);
  return false;
}

/** Step 3: contract register. */
export function ContractsStep({ onBack, onNext }: StepProps) {
  const t = useTranslations("Onboarding");
  const tc = useTranslations("Contracts");
  const tCommon = useTranslations("Common");
  const format = useFormatter();
  const { data, reload } = useApiData(listContractsAction, {});
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <QuickStep
        title={t("steps.contracts.title")}
        description={tc("explanation")}
        addLabel={tc("add")}
        emptyText={t("steps.contracts.empty")}
        items={(data?.items ?? []).map((c) => ({
          id: c._id,
          title: c.contractFor || c.company,
          meta: c.endDate ? t("until", { date: format.dateTime(new Date(c.endDate), { dateStyle: "medium", timeZone: "UTC" }) }) : c.company,
        }))}
        onAdd={() => setOpen(true)}
        onDelete={(id) => run(() => deleteContractAction(id), tc("deleted"), tCommon("error"), reload)}
        onBack={onBack}
        onNext={onNext}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={tc("addTitle")}>
        <ContractForm
          compact
          submitting={saving}
          submitLabel={tc("add")}
          onCancel={() => setOpen(false)}
          onSubmit={async (form) => {
            setSaving(true);
            const ok = await run(() => createContractAction(form), tc("created"), tCommon("error"), reload);
            setSaving(false);
            if (ok) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}

/** Step 4: permits and certificates, with suggestions from the hotel type. */
export function PermitsStep({ onBack, onNext }: StepProps) {
  const t = useTranslations("Onboarding");
  const tp = useTranslations("Permits");
  const tCommon = useTranslations("Common");
  const format = useFormatter();
  const { data, reload } = useApiData(listPermitsAction, {});
  const [type, setType] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const permits = data?.items ?? [];

  return (
    <>
      <QuickStep
        title={t("steps.permits.title")}
        description={tp("explanation")}
        addLabel={tp("add")}
        emptyText={t("steps.permits.empty")}
        extra={data && <PermitSuggestions suggestions={data.suggestions} existing={permits.map((p) => p.type)} onPick={setType} />}
        items={permits.map((p) => ({
          id: p._id,
          title: p.type,
          meta: p.expiryDate ? t("until", { date: format.dateTime(new Date(p.expiryDate), { dateStyle: "medium", timeZone: "UTC" }) }) : p.authority,
        }))}
        onAdd={() => setType("")}
        onDelete={(id) => run(() => deletePermitAction(id), tp("deleted"), tCommon("error"), reload)}
        onBack={onBack}
        onNext={onNext}
      />
      <Modal open={type !== null} onClose={() => setType(null)} title={tp("addTitle")}>
        <PermitForm
          key={type ?? ""}
          compact
          initial={{ ...EMPTY_PERMIT, type: type ?? "" }}
          submitting={saving}
          submitLabel={tp("add")}
          onCancel={() => setType(null)}
          onSubmit={async (form) => {
            setSaving(true);
            const ok = await run(() => createPermitAction(form), tp("created"), tCommon("error"), reload);
            setSaving(false);
            if (ok) setType(null);
          }}
        />
      </Modal>
    </>
  );
}

/** Step 5: storingslijst. */
export function FaultsStep({ onBack, onNext }: StepProps) {
  const t = useTranslations("Onboarding");
  const tf = useTranslations("Faults");
  const tCommon = useTranslations("Common");
  const optionLabel = useOptionLabel();
  const { data, reload } = useApiData(listFaultContactsAction, null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  return (
    <>
      <QuickStep
        title={t("steps.faults.title")}
        description={tf("description")}
        addLabel={tf("add")}
        emptyText={t("steps.faults.empty")}
        items={(data ?? []).map((c) => ({ id: c._id, title: c.name, meta: `${optionLabel("faultTypes", c.faultType)} · ${c.phone}` }))}
        onAdd={() => setOpen(true)}
        onDelete={(id) => run(() => deleteFaultContactAction(id), tf("deleted"), tCommon("error"), reload)}
        onBack={onBack}
        onNext={onNext}
      />
      <Modal open={open} onClose={() => setOpen(false)} title={tf("addTitle")}>
        <FaultForm
          compact
          submitting={saving}
          submitLabel={tf("add")}
          onCancel={() => setOpen(false)}
          onSubmit={async (form) => {
            setSaving(true);
            const ok = await run(() => createFaultContactAction(form), tf("created", { name: form.name }), tCommon("error"), reload);
            setSaving(false);
            if (ok) setOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
