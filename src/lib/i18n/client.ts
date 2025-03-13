"use client";

import { useState, useEffect, ReactNode } from "react";
import { Locale, TranslationKey, translations } from "./translations";

// Global state for language (without context)
let globalLocale: Locale = "fr";
let listeners: Array<(locale: Locale) => void> = [];

export function LanguageProvider({
  children,
  initialLocale = "fr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  useEffect(() => {
    // Initialize global locale from initialLocale or localStorage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "fr" || savedLocale === "ar")) {
      globalLocale = savedLocale;
      notifyListeners();
    } else {
      globalLocale = initialLocale;
    }
  }, [initialLocale]);

  return children;
}

// Function to notify all listeners of locale changes
function notifyListeners() {
  listeners.forEach((listener) => listener(globalLocale));
}

// Hook to use language functionality
export function useLanguage() {
  const [locale, setLocaleState] = useState<Locale>(globalLocale);

  useEffect(() => {
    // Subscribe to locale changes
    const handleLocaleChange = (newLocale: Locale) => {
      setLocaleState(newLocale);
    };

    listeners.push(handleLocaleChange);

    // Initial sync
    setLocaleState(globalLocale);

    // Cleanup
    return () => {
      listeners = listeners.filter(
        (listener) => listener !== handleLocaleChange,
      );
    };
  }, []);

  const setLocale = async (newLocale: Locale) => {
    // Update global state
    globalLocale = newLocale;

    // Save to localStorage
    localStorage.setItem("locale", newLocale);

    // Notify all components
    notifyListeners();
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || key;
  };

  return {
    locale,
    setLocale,
    t,
  };
}
