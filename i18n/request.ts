import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "./config";

export default getRequestConfig(async () => {
  const store = await cookies();
  const saved = store.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(saved) ? saved : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "Europe/Amsterdam",
  };
});
