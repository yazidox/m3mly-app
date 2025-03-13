import { cookies } from "next/headers";
import { Locale, TranslationKey, translations } from "./translations";

export function getLocale(): Locale {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get("locale");
  return (localeCookie?.value as Locale) || "fr";
}

export function t(key: TranslationKey): string {
  const locale = getLocale();
  return translations[locale][key] || key;
}
