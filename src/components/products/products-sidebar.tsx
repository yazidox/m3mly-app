"use client";

import { useLanguage } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Package, Tag, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface ProductsSidebarProps {
  uniqueCategories: string[];
  products: any[];
  searchParams: { category?: string; search?: string };
}

export default function ProductsSidebar({
  uniqueCategories,
  products,
  searchParams,
}: ProductsSidebarProps) {
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" /> {t("products.categories_title")}
          </h3>
          <div className="space-y-1">
            <Link
              href="/products"
              className={`block px-3 py-2 rounded-md text-sm ${!searchParams.category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
            >
              {t("products.all_products")}
            </Link>
            {uniqueCategories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className={`block px-3 py-2 rounded-md text-sm ${searchParams.category === category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
              >
                {category}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" /> {t("products.featured_products")}
          </h3>
          <div className="space-y-3">
            {products?.slice(0, 3).map((product) => (
              <Link
                key={`featured-${product.id}`}
                href={`/product/${product.id}`}
                className="flex items-center gap-3 group hover:bg-muted/30 p-2 rounded-md transition-colors"
              >
                <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <div className="font-medium group-hover:text-primary transition-colors">
                    {product.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(product.price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 