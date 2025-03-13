import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Search as SearchIcon,
  Building,
  Package,
  ArrowRight,
  Factory,
  Sparkles,
  Filter,
} from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: "factories" | "products" };
}) {
  const supabase = await createClient();
  const searchQuery = searchParams.q || "";
  const searchType = searchParams.type || "factories";

  // Fetch factories if searching for factories or no specific type
  let factories = [];
  if (!searchQuery || searchType === "factories") {
    const { data: factoriesData } = await supabase
      .from("factories")
      .select("*")
      .eq("status", "approved")
      .order("rating", { ascending: false });

    if (searchQuery && factoriesData) {
      factories = factoriesData.filter(
        (factory) =>
          factory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          factory.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          factory.location.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      factories = factoriesData || [];
    }
  }

  // Fetch products if searching for products or no specific type
  let products = [];
  if (!searchQuery || searchType === "products") {
    const { data: productsData } = await supabase
      .from("products")
      .select("*, factories(name, location)")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (searchQuery && productsData) {
      products = productsData.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    } else {
      products = productsData || [];
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 shadow-md mb-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <SearchIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
              Search
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Find factories and products that match your manufacturing needs
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <form>
                <Input
                  name="q"
                  placeholder="Search factories or products..."
                  className="pl-9 bg-background/80 backdrop-blur-sm border-primary/20 focus-visible:border-primary/50"
                  defaultValue={searchQuery}
                />
                <input type="hidden" name="type" value={searchType} />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-3"
                >
                  Search
                </Button>
              </form>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue={searchType} className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger
              value="factories"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("type", "factories");
                window.history.pushState({}, "", url);
              }}
            >
              <Building className="h-4 w-4 mr-2" /> Factories
            </TabsTrigger>
            <TabsTrigger
              value="products"
              onClick={() => {
                const url = new URL(window.location.href);
                url.searchParams.set("type", "products");
                window.history.pushState({}, "", url);
              }}
            >
              <Package className="h-4 w-4 mr-2" /> Products
            </TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            {searchType === "factories"
              ? `${factories.length} factories found`
              : `${products.length} products found`}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </div>
        </div>

        <TabsContent value="factories" className="mt-0">
          {factories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {factories.map((factory) => (
                <Link
                  key={factory.id}
                  href={`/factory/${factory.id}`}
                  className="group"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col border-border/50 hover:border-primary/30">
                    <div className="h-48 bg-muted relative overflow-hidden">
                      {factory.image ? (
                        <img
                          src={factory.image}
                          alt={factory.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Factory className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          <span className="text-white text-sm font-medium">
                            {factory.rating} Rating
                          </span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {factory.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {factory.location}
                        </p>
                        <p className="text-sm line-clamp-2">
                          {factory.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {factory.specialties
                            ?.slice(0, 3)
                            .map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          {factory.specialties?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{factory.specialties.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/40">
                        <div className="text-sm text-muted-foreground">
                          Min order: {factory.min_order_quantity} units
                        </div>
                        <Button
                          size="sm"
                          className="gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        >
                          View <ArrowRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No factories found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No factories matching "${searchQuery}"`
                  : "There are no factories available at the moment"}
              </p>
              <Button asChild>
                <Link href="/factories">Browse All Factories</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        <div className="font-bold">
                          {product.price
                            ? `${product.price}`
                            : "Price on request"}
                        </div>
                        <Button
                          size="sm"
                          className="gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                        >
                          View <ArrowRight className="h-3 w-3" />
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
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchQuery
                  ? `No products matching "${searchQuery}"`
                  : "There are no products available at the moment"}
              </p>
              <Button asChild>
                <Link href="/products">Browse All Products</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
