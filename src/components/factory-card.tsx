"use client";

import { Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import { useEffect, useState } from "react";

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

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={factory.image}
          alt={factory.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{factory.name}</h3>
          <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="fill-amber-500 w-4 h-4" />
            <span className="text-sm font-medium">{factory.rating}</span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4">
          {factory.location} • MOQ: {factory.minOrderQuantity}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {factory.specialties.map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {specialty}
            </span>
          ))}
        </div>

        {/* Products Preview Section */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <Package size={14} className="text-primary" />
            <span>Products</span>
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
                  className="relative h-16 rounded-md overflow-hidden border group"
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
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      ${product.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              No products available
            </p>
          )}
        </div>

        <Link
          href={`/factory/${factory.id}`}
          className="block w-full text-center py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
