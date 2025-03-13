import Image from "next/image";

interface ProductDisplayProps {
  product: any;
}

export function ProductDisplay({ product }: ProductDisplayProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={product.image || "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-muted-foreground mb-4">
          From {product.factories?.name} • {product.factories?.location}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-bold text-primary">
            ${product.price}
          </div>
          <div className="text-sm text-muted-foreground">
            MOQ: {product.min_order_quantity}
          </div>
        </div>
        <p className="text-muted-foreground mb-4">{product.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {(product.features || []).map((feature: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 