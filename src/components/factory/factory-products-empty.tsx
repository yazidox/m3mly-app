"use client";

import { useLanguage } from "@/lib/i18n/client";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface FactoryProductsEmptyProps {
  factoryId: string;
}

export default function FactoryProductsEmpty({
  factoryId,
}: FactoryProductsEmptyProps) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-xl border border-border"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
      <h3 className="text-xl font-medium mb-2">
        {t("factory_products.no_products")}
      </h3>
      <p className={cn(
        "text-muted-foreground max-w-md mx-auto mb-6",
        isRtl && "text-right"
      )}>
        {t("factory_products.no_products_description")}
      </p>
      <Link
        href={`/factory/${factoryId}`}
        className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
      >
        {t("factory_products.back_to_profile")}
        <ArrowLeft className={cn(
          "ml-2 w-4 h-4",
          isRtl && "rotate-180 ml-0 mr-2"
        )} />
      </Link>
    </div>
  );
} 