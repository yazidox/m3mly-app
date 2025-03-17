"use client";

import { useLanguage } from "@/lib/i18n/client";

interface FactoryTabLabelProps {
  label: string;
  arabicLabel: string;
}

export default function FactoryTabLabel({ label, arabicLabel }: FactoryTabLabelProps) {
  const { locale } = useLanguage();
  const isRtl = locale === "ar";
  
  return <>{isRtl ? arabicLabel : label}</>;
} 