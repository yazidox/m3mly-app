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

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const handleSetLocale = async (newLocale: "fr" | "ar") => {
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
    } catch (error) {
      console.error("Failed to set locale cookie:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe size={16} />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
