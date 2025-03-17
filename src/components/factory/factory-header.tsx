"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

interface FactoryHeaderProps {
  factory: any;
  factoryId: string;
}

export default function FactoryHeader({ factory, factoryId }: FactoryHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className="bg-card rounded-xl border border-border p-6 -mt-24 relative z-10 mb-8 backdrop-blur-sm shadow-md"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="relative h-28 w-28 rounded-xl overflow-hidden border-4 border-background shadow-lg">
          <Image
            src={
              factory.image ||
              "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80"
            }
            alt={factory.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight">{factory.name}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star
                    className="fill-amber-500 text-amber-500"
                    size={16}
                  />
                  <span>
                    {factory.rating || 4.5} ({factory.review_count || 0}{" "}
                    {isRtl ? "تقييم" : "avis"})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/factory/${factoryId}/products`}>
                <Button className="flex items-center gap-2">
                  <Package size={16} />
                  <span>{isRtl ? "عرض جميع المنتجات" : "Voir tous les produits"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 