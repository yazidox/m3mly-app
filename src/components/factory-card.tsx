"use client";

import { Package, Star, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/client";

interface FactoryCardProps {
  factory: {
    id: number | string;
    name: string;
    location: string;
    minOrderQuantity: number;
    rating: number;
    image: string;
    specialties: string[];
  };
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
}

export default function FactoryCard({ factory }: FactoryCardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    }

    checkUserAuth();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, image")
          .eq("factory_id", factory.id)
          .eq("status", "active")
          .limit(3);

        if (error) {
          console.error("Error fetching products:", error);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [factory.id]);

  if (!mounted) return null;

  return (
    <div 
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            factory.image ||
            "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80"
          }
          alt={factory.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} flex items-center gap-1 text-amber-500 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-amber-200/30 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0`}>
          <Star className="fill-amber-500 w-4 h-4" />
          <span className="text-sm font-medium">
            {factory.rating}
          </span>
        </div>
      </div>
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <div className="relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className={cn("text-xl font-semibold", isRtl && "text-right")}>{factory.name}</h3>
          </div>
          <p className="text-muted-foreground mb-4 flex items-center">
            <span className={cn("inline-block bg-primary/10 px-2 py-0.5 rounded-full text-xs text-primary", isRtl ? "ml-2" : "mr-2")}>{factory.location}</span>
            <span className="text-xs">{isRtl ? "الحد الأدنى للكمية:" : "QCM:"} {factory.minOrderQuantity}</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {factory.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
              >
                {specialty}
              </span>
            ))}
          </div>

          {/* Products Preview Section */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Package size={14} className="text-primary" />
              <span>{isRtl ? "المنتجات" : "Produits"}</span>
            </h4>

            {loading ? (
              <div className="flex justify-center py-2">
                <div className="animate-pulse h-4 w-full bg-muted rounded"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="relative h-16 rounded-md overflow-hidden border group/product"
                  >
                    <Image
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80"
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 opacity-0 group-hover/product:opacity-100 transition-opacity flex items-center justify-center">
                      {isLoggedIn ? (
                        <span className="text-white text-xs font-medium">
                          {product.price} MAD
                        </span>
                      ) : (
                        <span className="text-white text-xs font-medium">
                          {isRtl ? "تسجيل الدخول" : "Connectez-vous"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {isRtl ? "لا توجد منتجات متاحة" : "Aucun produit disponible"}
              </p>
            )}
          </div>

          <Link
            href={`/factory/${factory.id}`}
            className="group/btn relative block w-full text-center py-3 border border-primary text-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <span className="relative z-10 flex items-center justify-center group-hover/btn:text-white transition-colors duration-300">
              {isRtl ? "عرض المصنع" : "Voir le profil"}
              <ArrowRight className={cn("w-4 h-4 group-hover/btn:translate-x-1 transition-transform", isRtl ? "mr-2 rotate-180" : "ml-2")} />
            </span>
            <span className={`absolute inset-0 ${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-primary to-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300`} />
          </Link>
        </div>
      </div>
    </div>
  );
}
