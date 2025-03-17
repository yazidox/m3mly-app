"use client";

import { useLanguage } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Search,
  Filter,
  Package,
  Factory,
  ArrowLeft,
} from "lucide-react";

interface ProductsHeroProps {
  searchParams: { category?: string; search?: string };
}

export default function ProductsHero({ searchParams }: ProductsHeroProps) {
  const { t, locale } = useLanguage();
  const isRtl = locale === "ar";

  return (
    <section className="relative overflow-hidden rounded-xl mb-12">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
      </div>
      
      <div className="relative z-10 py-16 px-8">
        <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
          <Package className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
          <span className="relative">{t("products.catalog_title")}</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight leading-tight max-w-3xl">
          {t("products.discover_title")}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
            {t("products.discover_highlight")}
          </span>{" "}
          {locale === "fr" ? "de qualité supérieure" : "ذات الجودة العالية"}
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
          {t("products.description")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-xl">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
            <form>
              <Input
                name="search"
                placeholder={t("products.search_placeholder")}
                className={`${isRtl ? 'pr-9' : 'pl-9'} bg-background/80 backdrop-blur-sm border-primary/20 focus-visible:border-primary/50`}
                defaultValue={searchParams.search || ""}
                dir={isRtl ? "rtl" : "ltr"}
              />
              <input
                type="hidden"
                name="category"
                value={searchParams.category || ""}
              />
              <Button
                type="submit"
                className={`absolute ${isRtl ? 'left-1' : 'right-1'} top-1/2 -translate-y-1/2 h-7 px-3`}
              >
                {t("products.search_button")}
              </Button>
            </form>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> {t("products.filter_button")}
            </Button>
            <Link href="/factories">
              <Button variant="secondary" className="gap-2">
                <Factory className="h-4 w-4" /> {t("products.view_factories")}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center px-6 py-3 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-base font-medium border border-border overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              <ArrowLeft className={`${isRtl ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'} w-4 h-4 transition-transform`} />
              {t("products.back_to_admin")}
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
} 