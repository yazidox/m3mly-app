"use client";

import { useEffect } from "react";
import { useLanguage } from "@/lib/i18n/client";

export default function ClientLanguageProvider() {
  const { locale } = useLanguage();

  useEffect(() => {
    // Set the HTML dir attribute based on the locale
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
