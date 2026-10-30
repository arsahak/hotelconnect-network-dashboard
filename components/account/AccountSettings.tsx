"use client";

import {
  changeMyPasswordAction,
  getMyAccountAction,
  updateMyAccountAction,
  updateMyAvatarAction,
  type Account,
} from "@/app/actions/account";
import {
  cardClass,
  cardTitleClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/components/shared/form-styles";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { PageHeader } from "@/components/shared/PageHeader";
import { RoleBadge } from "@/components/shared/RoleBadge";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { BiCamera, BiLockAlt, BiUser } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";

/** "Settings": edit own details, photo, password and dashboard language. */
const AccountSettings = () => {
  const t = useTranslations("Settings");
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [savingDetails, setSavingDetails] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    getMyAccountAction().then((res) => {
      if (res.ok && res.data) {
        setAccount(res.data);
        setForm({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phone: res.data.phone || "",
        });
        setAvatarPreview(res.data.avatar || "");
      } else {
        toast.error(res.error || t("loadError"));
      }
      setLoading(false);
    });
  }, [t]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.set("avatar", file);
    const res = await updateMyAvatarAction(formData);
    if (res.ok && res.data) {
      toast.success(t("photoUpdated"));
      setAvatarPreview(res.data.avatar || "");
    } else {
      toast.error(res.error || t("photoError"));
      setAvatarPreview(account?.avatar || "");
    }
    setUploadingAvatar(false);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDetails(true);
    const res = await updateMyAccountAction(form);
    if (res.ok && res.data) {
      setAccount(res.data);
      toast.success(t("saved"));
    } else {
      toast.error(res.fieldErrors?.join(" ") || res.error || t("saveError"));
    }
    setSavingDetails(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error(t("passwordMismatch"));
      return;
    }
    setChangingPassword(true);
    const res = await changeMyPasswordAction({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    if (res.ok) {
      toast.success(t("passwordChanged"));
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } else {
      toast.error(res.fieldErrors?.join(" ") || res.error || t("passwordError"));
    }
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className={cardClass}>
          <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
        </div>
        <div className={cardClass}>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
        <div className="rounded border border-gray-200 bg-white py-20 text-center">
          <p className="text-sm text-gray-500">{t("loadError")}</p>
        </div>
      </div>
    );
  }

  const field = (key: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-1.5">
      <label htmlFor={`account-${key}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`account-${key}`}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={inputClass}
        {...props}
      />
    </div>
  );

  const passwordField = (key: keyof typeof passwordForm, label: string) => (
    <div className="space-y-1.5">
      <label htmlFor={`password-${key}`} className={labelClass}>
        {label}
      </label>
      <div className="relative flex items-center">
        {key === "currentPassword" && <BiLockAlt className="absolute left-3 h-4 w-4 text-gray-400" />}
        <input
          id={`password-${key}`}
          required
          minLength={key === "currentPassword" ? undefined : 8}
          type={showPasswords ? "text" : "password"}
          autoComplete={key === "currentPassword" ? "current-password" : "new-password"}
          value={passwordForm[key]}
          onChange={(e) => setPasswordForm((f) => ({ ...f, [key]: e.target.value }))}
          className={`${inputClass} ${key === "currentPassword" ? "pl-9" : ""}`}
        />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-gray-50">
      <PageHeader title={t("title")} description={t("description")} />

      {/* Photo */}
      <div className={cardClass}>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => avatarInputRef.current?.click()}
            className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-gray-400 transition-colors hover:border-primary hover:text-primary"
            title={t("changePhoto")}
          >
            {avatarPreview ? (
              <span
                aria-hidden="true"
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${avatarPreview}")` }}
              />
            ) : (
              <BiUser size={28} />
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-ink-950/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <BiCamera size={20} />
            </span>
            {uploadingAvatar && (
              <span className="absolute inset-0 flex items-center justify-center bg-white/75 text-[10px] font-medium text-gray-600">
                {t("saving")}
              </span>
            )}
            <span className="sr-only">{t("changePhoto")}</span>
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <div>
            <p className="font-display text-2xl text-gray-950">
              {account.firstName} {account.lastName}
            </p>
            <RoleBadge role={account.role} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("accountDetails")}</h2>
        <form onSubmit={handleDetailsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {field("firstName", t("firstName"), { required: true, autoComplete: "given-name" })}
            {field("lastName", t("lastName"), { autoComplete: "family-name" })}
            {field("email", t("email"), { type: "email", required: true, autoComplete: "email" })}
            {field("phone", t("phone"), { type: "tel", autoComplete: "tel", placeholder: "+31 6 12345678" })}
          </div>
          <div className="flex justify-end border-t border-gray-200 pt-4">
            <button type="submit" disabled={savingDetails} className={primaryButtonClass}>
              {savingDetails ? t("saving") : t("save")}
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className={cardClass}>
        <h2 className={cardTitleClass}>{t("changePassword")}</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {passwordField("currentPassword", t("currentPassword"))}
            {passwordField("newPassword", t("newPassword"))}
            {passwordField("confirmPassword", t("confirmPassword"))}
          </div>
          <p className="text-xs text-gray-500">{t("passwordHint")}</p>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={() => setShowPasswords((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              {showPasswords ? <FiEyeOff size={14} /> : <FiEye size={14} />}
              {showPasswords ? t("hidePasswords") : t("showPasswords")}
            </button>
            <button type="submit" disabled={changingPassword} className={primaryButtonClass}>
              {changingPassword ? t("updating") : t("updatePassword")}
            </button>
          </div>
        </form>
      </div>

      {/* Language */}
      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{t("language")}</h2>
            <p className="mt-0.5 text-xs text-gray-500">{t("languageText")}</p>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
