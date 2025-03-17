"use client";

import { useLanguage } from "@/lib/i18n/client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FactoryProductsHeaderProps {
  factoryId: string;
  factoryName: string;
}

export default function FactoryProductsHeader({
  factoryId,
  factoryName,
}: FactoryProductsHeaderProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="mb-12" dir={isRtl ? "rtl" : "ltr"}>
      <Link
        href={`/factory/${factoryId}`}
        className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 group"
      >
        <ArrowLeft className={cn(
          "mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform",
          isRtl && "rotate-180 mr-0 ml-2 group-hover:translate-x-1"
        )} />
        {t("factory_products.back_to_profile")}
      </Link>
      
      <h1 className={cn(
        "text-4xl md:text-5xl font-bold mb-4 tracking-tight",
        isRtl && "text-right"
      )}>
        {t("factory_products.products_of")}{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
          {factoryName}
        </span>
      </h1>
      
      <p className={cn(
        "text-xl text-muted-foreground max-w-2xl",
        isRtl && "text-right"
      )}>
        {t("factory_products.discover_products").replace("{factoryName}", factoryName)}
      </p>
    </div>
  );
} 