"use client";

import { requestResetCodeAction, setNewPasswordAction, verifyResetCodeAction } from "@/app/actions/passwordReset";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

type Step = "email" | "code" | "password" | "done";

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-gray-500";
const buttonClass =
  "w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70";

/**
 * "Forgot password?" — email → code → new password, for every dashboard user.
 * The email also holds a link (valid 24 hours, Master Briefing v4) that opens
 * this page at the new-password step: ?email=…&token=….
 */
const ForgotPasswordPage = () => {
  const t = useTranslations("ForgotPassword");
  const params = useSearchParams();
  const linkToken = params.get("token") ?? "";
  const [step, setStep] = useState<Step>(linkToken ? "password" : "email");
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [token, setToken] = useState(linkToken);
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<boolean>) => {
    setError("");
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-ink-950 px-4 py-12">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-[460px] rounded-2xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-7 flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="heading-strong font-display text-2xl text-gray-950">{t("title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t(`intro.${step}`, { email })}</p>
          </div>
        </div>

        {step === "email" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const res = await requestResetCodeAction(email.trim());
                if (!res.ok) return setError(res.error || t("error")), false;
                setStep("code");
                return true;
              });
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="fp-email" className={labelClass}>{t("email")}</label>
              <input id="fp-email" type="email" required autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            </div>
            {error && <p role="alert" className="rounded-lg bg-ember-100 px-4 py-3 text-sm font-medium text-ember-600">{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass}>{busy ? t("busy") : t("sendCode")}</button>
          </form>
        )}

        {step === "code" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const res = await verifyResetCodeAction(email.trim(), code.trim());
                if (!res.ok || !res.data) return setError(res.error || t("error")), false;
                setToken(res.data.resetToken);
                setStep("password");
                return true;
              });
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="fp-code" className={labelClass}>{t("code")}</label>
              <input
                id="fp-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="1234"
                className={`${inputClass} text-center text-2xl tracking-[0.5em]`}
              />
            </div>
            {error && <p role="alert" className="rounded-lg bg-ember-100 px-4 py-3 text-sm font-medium text-ember-600">{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass}>{busy ? t("busy") : t("checkCode")}</button>
            <button type="button" onClick={() => (setStep("email"), setCode(""), setError(""))} className="w-full text-center text-xs text-gray-500 hover:text-gray-900">
              {t("otherEmail")}
            </button>
          </form>
        )}

        {step === "password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== repeat) return setError(t("mismatch"));
              run(async () => {
                const res = await setNewPasswordAction(email.trim(), token, password);
                if (!res.ok) return setError(res.error || t("error")), false;
                setStep("done");
                return true;
              });
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="fp-password" className={labelClass}>{t("newPassword")}</label>
              <input id="fp-password" type="password" required minLength={8} maxLength={72} autoComplete="new-password" autoFocus value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="fp-repeat" className={labelClass}>{t("repeat")}</label>
              <input id="fp-repeat" type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} className={inputClass} />
            </div>
            {error && <p role="alert" className="rounded-lg bg-ember-100 px-4 py-3 text-sm font-medium text-ember-600">{error}</p>}
            <button type="submit" disabled={busy} className={buttonClass}>{busy ? t("busy") : t("save")}</button>
          </form>
        )}

        {step === "done" && (
          <Link href="/sign-in" className={`${buttonClass} block text-center`}>
            {t("toSignIn")}
          </Link>
        )}

        {step !== "done" && (
          <p className="mt-6 text-center text-xs text-gray-500">
            <Link href="/sign-in" className="hover:text-gray-900">{t("back")}</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
