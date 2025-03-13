import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../../../supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Package, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

      <section className="relative overflow-hidden py-12">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute -bottom-20 right-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        </div>

        <div className="container mx-auto px-4 py-8 relative">
          <div className="mb-12">
            <Link
              href={`/factory/${params.id}`}
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Retour au profil de l'usine
            </Link>
            
          
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Produits de <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">{factory.name}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Découvrez tous les produits disponibles de {factory.name} et commandez directement en ligne
            </p>
          </div>

          {products && products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, idx) => (
                <div
                  key={product.id}
                  className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
                  style={{ transitionDelay: `${idx * 150}ms` }}
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
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-amber-500 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-full border border-amber-200/30 shadow-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <Star className="fill-amber-500 w-4 h-4" />
                      <span className="text-sm font-medium">
                        {product.rating || 4.8}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                    <div className="relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{product.name}</h3>
                        <div className="text-lg font-bold text-primary">
                          {product.price}MAD
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 flex items-center">
                        <span className="inline-block mr-2 bg-primary/10 px-2 py-0.5 rounded-full text-xs text-primary">QCM: {product.min_order_quantity}</span>
                        <span className="text-xs flex items-center gap-1">
                          <Clock size={12} />
                          Délai: {product.lead_time} jours
                        </span>
                      </p>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {(product.features || []).map((feature: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20 flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/product/${product.id}/order`}
                          className="group/btn relative block w-full text-center py-3 border border-primary text-primary rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          <span className="relative z-10 flex items-center justify-center group-hover/btn:text-white transition-colors duration-300">
                            Commander
                            <Package className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        </Link>
                        <Link
                          href={`/product/${product.id}/sample`}
                          className={cn(
                            "bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border transform transition-all duration-300",
                            "hover:scale-105 hover:shadow-xl hover:border-primary/20 flex items-center justify-center"
                          )}
                        >
                          Échantillon
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card/50 backdrop-blur-sm rounded-xl border border-border">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Aucun produit disponible</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Cette usine n'a pas encore ajouté de produits. Veuillez vérifier plus tard ou les contacter directement pour des commandes personnalisées.
              </p>
              <Link
                href={`/factory/${params.id}`}
                className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                Retour au profil de l'usine
                <ArrowLeft className="ml-2 w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
