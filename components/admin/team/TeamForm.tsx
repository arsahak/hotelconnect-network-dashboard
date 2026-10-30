"use client";

import type { TeamMemberInput, TeamRole } from "@/app/actions/team";
import { cardClass, cardTitleClass, inputClass, labelClass, outlineButtonClass, primaryButtonClass } from "@/components/shared/form-styles";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const ROLES: TeamRole[] = ["admin", "superadmin"];

/**
 * Shared form for adding and editing a team member. `mode="add"` asks for a
 * password; editing can switch the account on/off instead.
 */
const TeamForm = ({
  mode,
  initial,
  submitting,
  onSubmit,
}: {
  mode: "add" | "edit";
  initial?: Partial<TeamMemberInput>;
  submitting: boolean;
  onSubmit: (data: TeamMemberInput) => void;
}) => {
  const t = useTranslations("Team");
  const tRoles = useTranslations("Roles");
  const tCommon = useTranslations("Common");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<TeamMemberInput>({
    firstName: initial?.firstName ?? "",
    lastName: initial?.lastName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    role: initial?.role ?? "admin",
    isActive: initial?.isActive ?? true,
    password: "",
  });

  const set = <K extends keyof TeamMemberInput>(key: K, value: TeamMemberInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const text = (key: "firstName" | "lastName" | "email" | "phone", props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-1.5">
      <label htmlFor={`team-${key}`} className={labelClass}>
        {t(`fields.${key}`)}
      </label>
      <input
        id={`team-${key}`}
        value={form[key] ?? ""}
        onChange={(e) => set(key, e.target.value)}
        className={inputClass}
        {...props}
      />
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const { password, isActive, ...rest } = form;
        onSubmit(mode === "add" ? { ...rest, password } : { ...rest, isActive });
      }}
      className="flex flex-col gap-6"
    >
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.details")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {text("firstName", { required: true, autoComplete: "off" })}
          {text("lastName", { autoComplete: "off" })}
          {text("email", { type: "email", required: true, autoComplete: "off" })}
          {text("phone", { type: "tel", autoComplete: "off", placeholder: "+31 6 12345678" })}
        </div>
      </div>

      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("sections.access")}</h2>

        <fieldset>
          <legend className={labelClass}>{t("fields.role")}</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {ROLES.map((role) => (
              <label
                key={role}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors",
                  form.role === role ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={role}
                  checked={form.role === role}
                  onChange={() => set("role", role)}
                  className="mt-1 accent-[var(--color-primary)]"
                />
                <span>
                  <span className="block text-sm font-semibold text-gray-900">{tRoles(role)}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">{t(`roleHelp.${role}`)}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode === "add" ? (
          <div className="mt-5 max-w-sm space-y-1.5">
            <label htmlFor="team-password" className={labelClass}>
              {t("fields.password")}
            </label>
            <div className="relative flex items-center">
              <input
                id="team-password"
                required
                minLength={8}
                maxLength={72}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.password ?? ""}
                onChange={(e) => set("password", e.target.value)}
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? tCommon("hide") : tCommon("show")}
                className="absolute right-3 text-gray-400 hover:text-primary-dark"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500">{t("passwordHint")}</p>
          </div>
        ) : (
          <label className="mt-5 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={Boolean(form.isActive)}
              onChange={(e) => set("isActive", e.target.checked)}
              className="h-4 w-4 accent-[var(--color-primary)]"
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">{t("fields.isActive")}</span>
              <span className="block text-xs text-gray-500">{t("isActiveHelp")}</span>
            </span>
          </label>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/admin/team" className={outlineButtonClass}>
          {tCommon("cancel")}
        </Link>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? tCommon("saving") : mode === "add" ? t("add") : tCommon("saveChanges")}
        </button>
      </div>
    </form>
  );
};

export default TeamForm;
