"use client";

import { useLanguage } from "@/lib/i18n/client";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isRtl = locale === "ar";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSetLocale = async (newLocale: "fr" | "ar") => {
    // Don't do anything if we're already using this locale
    if (newLocale === locale) return;

    // Update locale in our global state
    setLocale(newLocale);

    // Also update the cookie via API
    try {
      await fetch("/api/set-locale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale: newLocale }),
      });

      // Force a refresh to ensure all components update
      router.refresh();
    } catch (error) {
      console.error("Failed to set locale cookie:", error);
    }
  };

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return (
      <Button variant="ghost" size="sm" className="flex items-center gap-1">
        <Globe size={16} />
        <span className="uppercase">{locale}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe size={16} />
          <span className="uppercase">{isRtl ? "اللغة" : locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRtl ? "start" : "end"}>
        <DropdownMenuItem
          onClick={() => handleSetLocale("fr")}
          className={locale === "fr" ? "bg-blue-50" : ""}
        >
          Français
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetLocale("ar")}
          className={locale === "ar" ? "bg-blue-50" : ""}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
