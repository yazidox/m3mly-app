import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import {
  Search,
  Filter,
  Package,
  ArrowRight,
  Sparkles,
  Factory,
  Tag,
  ArrowUpRight,
  ArrowLeft,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Navbar from "@/components/navbar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const supabase = await createClient();

  // Get user information (optional, user can browse without being logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Build query
  let query = supabase
    .from("products")
    .select("*, factories(name, location)")
    .eq("status", "active");

  // Apply category filter if provided
  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }

  // Apply search filter if provided
  if (searchParams.search) {
    query = query.ilike("name", `%${searchParams.search}%`);
  }

  // Execute query
  const { data: products, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching products:", error);
  }

  // Get unique categories for filter
  const { data: categories } = await supabase
    .from("products")
    .select("category")
    .eq("status", "active")
    .is("category", "not.null");
  const uniqueCategories = Array.from(
    new Set(
      categories
        ?.map((item) => item.category)
        .filter((category): category is string => !!category)
    )
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Navbar />
      {/* Hero Section */}
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
            <Package className="w-4 h-4 mr-2" />
            <span className="relative">Catalogue de produits</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight leading-tight max-w-3xl">
            Découvrez nos <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">vêtements</span> de qualité supérieure
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            Parcourez notre collection de vêtements de haute qualité provenant des meilleurs fabricants marocains à des prix imbattables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <form>
                <Input
                  name="search"
                  placeholder="Rechercher des produits..."
                  className="pl-9 bg-background/80 backdrop-blur-sm border-primary/20 focus-visible:border-primary/50"
                  defaultValue={searchParams.search || ""}
                />
                <input
                  type="hidden"
                  name="category"
                  value={searchParams.category || ""}
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3"
                >
                  Rechercher
                </Button>
              </form>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filtrer
              </Button>
              <Link href="/factories">
                <Button variant="secondary" className="gap-2">
                  <Factory className="h-4 w-4" /> Voir les usines
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
                <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Retour à l'administration
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> Catégories
              </h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-md text-sm ${!searchParams.category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  Tous les produits
                </Link>
                {uniqueCategories.map((category) => (
                  <Link
                    key={category}
                    href={`/products?category=${encodeURIComponent(category)}`}
                    className={`block px-3 py-2 rounded-md text-sm ${searchParams.category === category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Produits en vedette
              </h3>
              <div className="space-y-3">
                {products?.slice(0, 3).map((product) => (
                  <Link
                    key={`featured-${product.id}`}
                    href={`/product/${product.id}`}
                    className="flex items-center gap-3 group hover:bg-muted/30 p-2 rounded-md transition-colors"
                  >
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(product.price)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Affichage de {products?.length || 0} produits
                {searchParams.category ? ` dans ${searchParams.category}` : ""}
                {searchParams.search
                  ? ` correspondant à "${searchParams.search}"`
                  : ""}
              </div>
              <TabsList>
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="list">Liste</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="mt-0">
              {products && products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col border-border/50 hover:border-primary/30">
                        <div className="h-48 bg-muted relative overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <Badge className="absolute top-2 right-2">
                            {product.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {product.factories?.name}
                            </p>
                            <p className="text-sm line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
                            <div className="font-bold text-lg">
                              {formatCurrency(product.price)}
                            </div>
                            <Button
                              size="sm"
                              className="gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                            >
                              Voir <ArrowRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchParams.search || searchParams.category
                      ? "Essayez d'ajuster vos critères de recherche ou de filtrage"
                      : "Il n'y a pas de produits disponibles pour le moment"}
                  </p>
                  <Button asChild>
                    <Link href="/products">Voir tous les produits</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              {products && products.length > 0 ? (
                <div className="space-y-4">
                  {products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="group"
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-48 sm:h-auto bg-muted relative overflow-hidden">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Package className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <Badge className="absolute top-2 right-2">
                              {product.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1 flex flex-col">
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                                    {product.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {product.factories?.name} •{" "}
                                    {product.factories?.location}
                                  </p>
                                </div>
                                <div className="font-bold text-lg">
                                  {formatCurrency(product.price)}
                                </div>
                              </div>
                              <p className="text-sm mt-3">
                                {product.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {product.features?.map((feature: string, index: number) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="bg-muted/50"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
                              <div className="text-sm text-muted-foreground">
                                Commande min: {product.min_order_quantity} unités •
                                Délai: {product.lead_time} jours
                              </div>
                              <Button
                                size="sm"
                                className="gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                              >
                                Voir détails <ArrowRight className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchParams.search || searchParams.category
                      ? "Essayez d'ajuster vos critères de recherche ou de filtrage"
                      : "Il n'y a pas de produits disponibles pour le moment"}
                  </p>
                  <Button asChild>
                    <Link href="/products">Voir tous les produits</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
