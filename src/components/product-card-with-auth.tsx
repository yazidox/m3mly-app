"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Package, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "../../supabase/client";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/client";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description?: string;
    min_order_quantity?: number;
    lead_time?: number;
    features?: string[];
    rating?: number;
  };
  factoryId: string | number;
  variant?: "simple" | "detailed";
}

export default function ProductCardWithAuth({
  product,
  factoryId,
  variant = "simple",
}: ProductCardProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { locale } = useLanguage();
  const isRtl = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    async function checkUserAuth() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsLoggedIn(!!data.user);
      setLoading(false);
    }

    checkUserAuth();
  }, []);

  if (!mounted) return null;

  if (variant === "simple") {
    return (
      <div 
        className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-all bg-card/50"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="relative h-40 w-full">
          <Image
            src={
              product.image ||
              "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
            }
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className={cn("font-medium mb-1", isRtl && "text-right")}>{product.name}</h3>
          <p className={cn("text-sm text-muted-foreground mb-2", isRtl && "text-right")}>
            {isLoggedIn ? (
              `${product.price} MAD`
            ) : (
              <Link href="/sign-in" className="text-primary hover:underline">
                {isRtl ? "تسجيل الدخول لرؤية السعر" : "Connectez-vous pour voir le prix"}
              </Link>
            )}
          </p>
          <Link
            href={`/factory/${factoryId}/products`}
            className="text-primary hover:underline text-xs flex items-center gap-1"
          >
            <span>{isRtl ? "عرض التفاصيل" : "Voir détails"}</span>
            <ArrowRight className={cn("w-3 h-3", isRtl && "rotate-180")} />
          </Link>
        </div>
      </div>
    );
  }

  // Detailed variant
  return (
    <div 
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            product.image ||
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
          }
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.rating && (
          <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} flex items-center gap-1 text-amber-500 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-amber-200/30 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0`}>
            <Star className="fill-amber-500 w-4 h-4" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        )}
      </div>
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn("text-xl font-semibold", isRtl && "text-right")}>{product.name}</h3>
            <div className={cn("text-lg font-bold text-primary", isRtl && "text-right")}>
              {isLoggedIn ? (
                `${product.price}MAD`
              ) : (
                <Link href="/sign-in" className="text-primary hover:underline text-sm">
                  {isRtl ? "تسجيل الدخول" : "Connectez-vous"}
                </Link>
              )}
            </div>
          </div>
          {(product.min_order_quantity || product.lead_time) && (
            <p className="text-muted-foreground mb-4 flex items-center">
              {product.min_order_quantity && (
                <span className={cn("inline-block bg-primary/10 px-2 py-0.5 rounded-full text-xs text-primary", isRtl ? "ml-2" : "mr-2")}>
                  QCM: {product.min_order_quantity}
                </span>
              )}
              {product.lead_time && (
                <span className="text-xs flex items-center gap-1">
                  <Clock size={12} />
                  {isRtl ? `المدة: ${product.lead_time} أيام` : `Délai: ${product.lead_time} jours`}
                </span>
              )}
            </p>
          )}
          {product.description && (
            <p className={cn("text-muted-foreground mb-4 line-clamp-2", isRtl && "text-right")}>
              {product.description}
            </p>
          )}

          {product.features && product.features.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {product.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 flex items-center gap-1"
                >
                  <CheckCircle2 size={12} />
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Link
              href={isLoggedIn ? `/product/${product.id}/order` : "/sign-in?redirect_to=/product/${product.id}/order"}
              className="group/btn relative block w-full text-center py-3 border border-primary text-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="relative z-10 flex items-center justify-center group-hover/btn:text-white transition-colors duration-300">
                {isLoggedIn 
                  ? (isRtl ? "طلب" : "Commander") 
                  : (isRtl ? "تسجيل الدخول للطلب" : "Connectez-vous pour commander")
                }
                <Package className={cn("w-4 h-4 group-hover/btn:translate-x-1 transition-transform", isRtl ? "mr-2" : "ml-2")} />
              </span>
              <span className={`absolute inset-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300`} />
            </Link>
            {isLoggedIn && (
              <Link
                href={`/product/${product.id}/sample`}
                className={cn(
                  "bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border transform transition-all duration-300",
                  "hover:scale-105 hover:shadow-xl hover:border-primary/20 flex items-center justify-center"
                )}
              >
                {isRtl ? "عينة" : "Échantillon"}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 