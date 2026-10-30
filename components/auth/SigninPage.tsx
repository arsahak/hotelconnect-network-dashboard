"use client";

import { signinAction } from "@/app/actions/auth";
import DashboardPreview from "@/components/auth/DashboardPreview";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { Logo } from "@/components/shared/Logo";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { BiEnvelope, BiLockAlt, BiLogIn } from "react-icons/bi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SigninPage = () => {
  const t = useTranslations("Signin");
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signinAction, { ok: false });
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  useEffect(() => {
    if (state.ok) {
      // Full page load so the layout re-renders with the fresh session cookie.
      window.location.href = state.redirectTo || callbackUrl;
    }
  }, [state.ok, state.redirectTo, callbackUrl]);

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10";
  const iconClass = "absolute left-3.5 h-5 w-5 text-gray-400";
  const labelClass = "text-xs font-semibold uppercase tracking-wider text-gray-500";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50">
      {/* Dashboard preview in the background, dimmed so the form stays readable */}
      <DashboardPreview />
      <div className="absolute inset-0 bg-ink-950/35 backdrop-blur-[3px]" />

      <div className="absolute right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>

      <div className="container relative z-10 mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-6 px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
        >
          {/* Header */}
          <div className="mb-7 flex flex-col items-center space-y-4 text-center">
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Logo />
            </motion.div>
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h1 className="heading-strong font-display text-2xl text-gray-950">{t("title")}</h1>
              <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>
            </motion.div>
          </div>

          {state.twoFactor ? (
            <form action={formAction} className="space-y-5">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <input type="hidden" name="challenge" value={state.twoFactor.challenge} />
              <input type="hidden" name="maskedEmail" value={state.twoFactor.email} />
              <div className="rounded-lg bg-brass-100/60 px-4 py-3 text-sm text-ink-700">
                <p className="font-medium text-ink-950">{t("twoFactor.title")}</p>
                <p className="mt-0.5">{t("twoFactor.sent", { email: state.twoFactor.email })}</p>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="code">
                  {t("twoFactor.code")}
                </label>
                <input
                  id="code"
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9 ]{6,7}"
                  maxLength={7}
                  required
                  autoFocus
                  placeholder="123456"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-center text-2xl tracking-[0.5em] text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                />
              </div>
              {state.error && (
                <div role="alert" className="rounded-lg bg-ember-100 px-4 py-3 text-sm font-medium text-ember-600">
                  {t(`errors.${state.error}`)}
                </div>
              )}
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? t("submitting") : t("twoFactor.submit")}
              </button>
              <button type="button" onClick={() => window.location.reload()} className="w-full text-center text-xs text-gray-500 hover:text-gray-900">
                {t("twoFactor.back")}
              </button>
            </form>
          ) : (
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="callbackUrl" value={callbackUrl} />

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="email">
                {t("email")}
              </label>
              <div className="relative flex items-center">
                <BiEnvelope className={iconClass} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={t("emailPlaceholder")}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="password">
                {t("password")}
              </label>
              <div className="relative flex items-center">
                <BiLockAlt className={iconClass} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                  className="absolute right-3 text-gray-400 transition-colors hover:text-primary-dark"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {(state.error || state.ok) && (
              <motion.div
                role="status"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
                  state.error ? "bg-ember-100 text-ember-600" : "bg-moss-100 text-moss-600"
                }`}
              >
                {state.error ? t(`errors.${state.error}`) : t("success")}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-2 w-full transform rounded-xl bg-primary px-4 py-3 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("submitting")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("submit")} <BiLogIn className="h-5 w-5" />
                </span>
              )}
            </button>
          </form>
          )}

          <p className="mt-6 text-center text-xs text-gray-500">{t("help")}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SigninPage;
