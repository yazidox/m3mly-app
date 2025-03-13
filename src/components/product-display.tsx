import Image from "next/image";
import { Star, Factory, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductDisplayProps {
  product: any;
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 flex items-center gap-1 text-amber-500 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-amber-200/30 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Star className="fill-amber-500 w-4 h-4" />
          <span className="text-sm font-medium">
            {product.rating || 4.5}
          </span>
        </div>
      </div>
      <div className="p-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-2 tracking-tight">{product.name}</h1>
          <p className="text-muted-foreground mb-4 flex items-center">
            <Factory className="w-4 h-4 mr-1" />
            <span>De {product.factories?.name} • </span>
            <span className="inline-block ml-2 bg-primary/10 px-2 py-0.5 rounded-full text-xs text-primary">{product.factories?.location}</span>
          </p>
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {product.price}MAD
            </div>
            <div className="text-sm bg-secondary/80 px-3 py-1 rounded-full">
              QCM: {product.min_order_quantity}
            </div>
          </div>
          <p className="text-muted-foreground mb-4 leading-relaxed">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(product.features || []).map((feature: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20"
              >
                {feature}
              </span>
            ))}
          </div>
        
        </div>
      </div>
    </div>
  );
}