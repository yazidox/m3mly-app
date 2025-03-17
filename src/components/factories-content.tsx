"use client";

import { useLanguage } from "@/lib/i18n/client";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  Sparkles,
  Factory,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import FactoryCard from "@/components/factory-card";

export default function FactoriesContent({
  factoryList,
  categories,
  locations,
}: {
  factoryList: any[];
  categories: string[];
  locations: string[];
}) {
  const { locale, t } = useLanguage();
  const isRtl = locale === "ar";

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[50vh] flex items-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
          <div className="absolute bottom-40 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow animate-pulse">
              <Sparkles className={`w-4 h-4 ${isRtl ? 'ml-2' : 'mr-2'}`} />
              <span className="relative">{t("factories.hero_tagline")}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-8 tracking-tight leading-tight">
              {t("factories.hero_title")}{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                {t("factories.hero_title_highlight")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl">
              {t("factories.hero_description")}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-muted-foreground">
            {t("factories.factories_count")} {factoryList.length} {isRtl ? "مصنع" : "usines"}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-muted-foreground`}
                size={18}
              />
              <Input
                placeholder={t("factories.search_placeholder")}
                className={`${isRtl ? 'pr-10' : 'pl-10'} w-64 bg-card border-border`}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal size={16} />
              <span>{t("factories.sort_button")}</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtres Sidebar */}
          <div className="w-full md:w-64 bg-card p-6 rounded-xl border border-border h-fit sticky top-24 shadow-sm backdrop-blur-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              <span>{t("factories.filters_title")}</span>
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                {t("factories.categories_title")}
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {categories.slice(0, 8).map((category, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`category-${index}`} />
                    <Label
                      htmlFor={`category-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <Button
                variant="link"
                className="text-xs p-0 h-auto mt-2 text-primary"
              >
                {t("factories.view_more")}
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                {t("factories.location_title")}
              </h3>
              <div className="space-y-2">
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`location-${index}`} />
                    <Label
                      htmlFor={`location-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                {t("factories.moq_title")}
              </h3>
              <div className="space-y-2">
                {["1-50", "51-100", "101-200", "201+"].map((range, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox id={`moq-${index}`} />
                    <Label
                      htmlFor={`moq-${index}`}
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {range} {t("factories.units_label")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 text-foreground">
                {t("factories.rating_title")}
              </h3>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox id={`rating-${rating}`} />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="text-sm flex items-center gap-1 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    >
                      {rating}+{" "}
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                {t("factories.reset_button")}
              </Button>
              <Button className="flex-1">
                {t("factories.apply_button")}
              </Button>
            </div>
          </div>

          {/* Factory Listings */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {factoryList.length > 0 ? (
                factoryList.map((factory, idx) => (
                  <div
                    key={factory.id}
                    className="animate-in fade-in duration-500"
                    style={{
                      animationDelay: `${idx * 50}ms`,
                    }}
                  >
                    <FactoryCard
                      factory={{
                        id: factory.id,
                        name: factory.name,
                        location: factory.location,
                        minOrderQuantity: factory.min_order_quantity,
                        rating: factory.rating || 4.5,
                        image:
                          factory.image ||
                          "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80",
                        specialties: factory.specialties || [],
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-12 text-center">
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 max-w-md mx-auto border border-border/50">
                    <Factory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {t("factories.no_factories_title")}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t("factories.no_factories_description")}
                    </p>
                    <Button 
                      variant="outline" 
                      className="group relative inline-flex items-center px-6 py-3 border border-border rounded-lg hover:bg-secondary/80 transition-all"
                    >
                      <span className="relative z-10 flex items-center">
                        {t("factories.reset_filters_button")}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-secondary/30 to-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center">
              <Button 
                variant="outline" 
                className="group relative inline-flex items-center px-8 py-4 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-lg font-medium border border-border overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {t("factories.load_more_button")}
                  <ArrowRight className={`${isRtl ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} w-5 h-5 transition-transform`} />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 