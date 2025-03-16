"use client";

import { useLanguage } from "@/lib/i18n/client";
import { ReactNode, useEffect, useState } from "react";

export default function ClientLanguageProviderHome({
  children,
}: {
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Set RTL direction for Arabic language
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-background">
      {children}
    </div>
  );
}
