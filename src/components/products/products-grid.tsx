"use client";

import { useLanguage } from "@/lib/i18n/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { useState, useEffect } from "react";

interface ProductsGridProps {
  products: any[];
  searchParams: { category?: string; search?: string };
}

export default function ProductsGrid({ products, searchParams }: ProductsGridProps) {
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="lg:col-span-3">
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            {t("products.display_count")} {products?.length || 0} {t("products.all_products").toLowerCase()}
            {searchParams.category ? ` ${t("products.in_category")} ${searchParams.category}` : ""}
            {searchParams.search
              ? ` ${t("products.matching_search")} "${searchParams.search}"`
              : ""}
          </div>
          <TabsList>
            <TabsTrigger value="grid">{t("products.grid_view")}</TabsTrigger>
            <TabsTrigger value="list">{t("products.list_view")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid" className="mt-0">
          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col border-border/50 hover:border-primary/30">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2">
                        {product.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.factories?.name}
                        </p>
                        <p className="text-sm line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
                        <div className="font-bold text-lg">
                          {formatCurrency(product.price)}
                        </div>
                        <Button
                          size="sm"
                          className={`gap-1 opacity-0 ${isRtl ? '-translate-x-2 group-hover:translate-x-0' : 'translate-x-2 group-hover:translate-x-0'} group-hover:opacity-100 transition-all duration-300`}
                        >
                          {t("products.view_details")} <ArrowRight className={`h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {t("products.no_products_title")}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchParams.search || searchParams.category
                  ? "Essayez d'ajuster vos critères de recherche ou de filtrage"
                  : t("products.no_products_description")}
              </p>
              <Button asChild>
                <Link href="/products">{t("products.view_all_products")}</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          {products && products.length > 0 ? (
            <div className="space-y-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-48 h-48 sm:h-auto bg-muted relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <Badge className="absolute top-2 right-2">
                          {product.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {product.factories?.name} •{" "}
                                {product.factories?.location}
                              </p>
                            </div>
                            <div className="font-bold text-lg">
                              {formatCurrency(product.price)}
                            </div>
                          </div>
                          <p className="text-sm mt-3">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {product.features?.map((feature: string, index: number) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-muted/50"
                              >
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
                          <div className="text-sm text-muted-foreground">
                            {t("products.min_order")}: {product.min_order_quantity} {t("products.units")} •{" "}
                            {t("products.lead_time")}: {product.lead_time} {t("products.days")}
                          </div>
                          <Button
                            size="sm"
                            className={`gap-1 opacity-0 ${isRtl ? '-translate-x-2 group-hover:translate-x-0' : 'translate-x-2 group-hover:translate-x-0'} group-hover:opacity-100 transition-all duration-300`}
                          >
                            {t("products.view_details")} <ArrowRight className={`h-3 w-3 ${isRtl ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {t("products.no_products_title")}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchParams.search || searchParams.category
                  ? "Essayez d'ajuster vos critères de recherche ou de filtrage"
                  : t("products.no_products_description")}
              </p>
              <Button asChild>
                <Link href="/products">{t("products.view_all_products")}</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 