"use client";

import React, { useState, useEffect, ReactNode, useMemo, createContext, useContext } from "react";
import { Locale, TranslationKey, translations } from "./translations";

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (key) => key,
});

// Helper function to get cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Provider component
export function LanguageProvider({
  children,
  initialLocale = "fr",
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // State to hold the current locale
  const [locale, setLocaleState] = useState<Locale>(() => {
    // Initialize from cookies first (for SSR consistency)
    if (typeof window !== "undefined") {
      const cookieLocale = getCookie("locale") as Locale;
      if (cookieLocale && (cookieLocale === "fr" || cookieLocale === "ar")) {
        return cookieLocale;
      }
      
      // Then try localStorage
      const savedLocale = localStorage.getItem("locale") as Locale;
      if (savedLocale && (savedLocale === "fr" || savedLocale === "ar")) {
        return savedLocale;
      }
    }
    return initialLocale;
  });

  // Sync document direction with locale
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    }
  }, [locale]);

  // Function to update locale
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  };

  // Memoize the translation function to prevent unnecessary re-renders
  const t = useMemo(() => {
    return (key: TranslationKey): string => {
      return translations[locale][key] || key;
    };
  }, [locale]);

  // Create value object
  const contextValue = useMemo<LanguageContextType>(
    () => ({
      locale,
      setLocale,
      t
    }),
    [locale, t]
  );

  return React.createElement(
    LanguageContext.Provider,
    { value: contextValue },
    children
  );
}

// Hook to use language functionality
export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  
  return context;
}
