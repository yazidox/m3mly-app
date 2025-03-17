"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";
import ProductCardWithAuth from "@/components/product-card-with-auth";

interface FactoryProductsProps {
  products: any[];
  factoryId: string;
}

export default function FactoryProducts({ products, factoryId }: FactoryProductsProps) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6 mb-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {isRtl ? "المنتجات المتاحة" : "Produits disponibles"}
        </h2>
        <Link
          href={`/factory/${factoryId}/products`}
          className="text-primary hover:underline text-sm font-medium flex items-center gap-1"
        >
          <span>{isRtl ? "عرض جميع المنتجات" : "Voir tous les produits"}</span>
          <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCardWithAuth 
            key={product.id}
            product={product}
            factoryId={factoryId}
            variant="simple"
          />
        ))}
      </div>
    </div>
  );
} 