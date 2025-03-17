"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export default function FactorySampleRequest() {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6 sticky top-24 shadow-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
        <Sparkles className="w-4 h-4 mr-2" />
        <span className="relative">{isRtl ? "عينات" : "ÉCHANTILLONS"}</span>
      </div>
      <h2 className="text-xl font-semibold mb-4">
        {isRtl ? "طلب عينة" : "Demander un échantillon"}
      </h2>
      <p className={cn("text-muted-foreground mb-6", isRtl && "text-right")}>
        {isRtl 
          ? "احصل على عينة من تصميمك قبل تقديم طلب بالجملة" 
          : "Obtenez un échantillon de votre design avant de passer une commande en gros"
        }
      </p>

      <Button className="w-full mb-4">
        {isRtl ? "طلب عينة" : "Demander un échantillon"}
      </Button>
      <Button variant="outline" className="w-full">
        {isRtl ? "تقديم طلب" : "Passer une commande"}
      </Button>
    </div>
  );
} 