"use client";

import { useLanguage } from "@/lib/i18n/client";
import { useEffect, useState } from "react";
import ProductCardWithAuth from "@/components/product-card-with-auth";

interface FactoryProductsGridProps {
  products: any[];
  factoryId: string;
}

export default function FactoryProductsGrid({
  products,
  factoryId,
}: FactoryProductsGridProps) {
  const { locale } = useLanguage();
  const isRtl = locale === "ar";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {products.map((product) => (
        <ProductCardWithAuth
          key={product.id}
          product={product}
          factoryId={factoryId}
          variant="detailed"
        />
      ))}
    </div>
  );
} 