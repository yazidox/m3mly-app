import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Package } from "lucide-react";

export default async function FactoryProductsPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch factory data
  const { data: factory, error: factoryError } = await supabase
    .from("factories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (factoryError) {
    console.error("Error fetching factory:", factoryError);
    return notFound();
  }

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", params.id)
    .eq("status", "active");

  if (productsError) {
    console.error("Error fetching factory products:", productsError);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href={`/factory/${params.id}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Factory Profile
          </Link>
          <h1 className="text-3xl font-bold mb-2">{factory.name} Products</h1>
          <p className="text-muted-foreground">
            Browse all available products from {factory.name}
          </p>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={
                      product.image ||
                      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80"
                    }
                    alt={product.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-bold text-primary">
                      ${product.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      MOQ: {product.min_order_quantity}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(product.features || []).map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1"
                      >
                        <CheckCircle2 size={12} />
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock size={14} />
                    <span>Lead time: {product.lead_time} days</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/product/${product.id}/order`}
                      className="flex-1"
                    >
                      <Button className="w-full flex items-center gap-2">
                        <Package size={16} />
                        Order Now
                      </Button>
                    </Link>
                    <Link
                      href={`/product/${product.id}/sample`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Request Sample
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Products Available</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              This factory hasn't added any products yet. Please check back
              later or contact them directly for custom orders.
            </p>
            <Link href={`/factory/${params.id}`}>
              <Button variant="outline">Return to Factory Profile</Button>
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
