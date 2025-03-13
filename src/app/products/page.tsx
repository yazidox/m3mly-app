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
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

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

  const uniqueCategories = [
    ...new Set(
      categories
        ?.map((item) => item.category)
        .filter((category): category is string => !!category),
    ),
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 shadow-md mb-8">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
              <Package className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 text-transparent bg-clip-text">
              Discover Products
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Browse our collection of high-quality garment products from the best
            Moroccan manufacturers
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <form>
                <Input
                  name="search"
                  placeholder="Search products..."
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
                  Search
                </Button>
              </form>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filter
              </Button>
              <Link href="/factories">
                <Button variant="secondary" className="gap-2">
                  <Factory className="h-4 w-4" /> View Factories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> Categories
              </h3>
              <div className="space-y-1">
                <Link
                  href="/products"
                  className={`block px-3 py-2 rounded-md text-sm ${!searchParams.category ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50"}`}
                >
                  All Products
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
                <Sparkles className="h-4 w-4 text-primary" /> Featured
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
                Showing {products?.length || 0} products
                {searchParams.category ? ` in ${searchParams.category}` : ""}
                {searchParams.search
                  ? ` matching "${searchParams.search}"`
                  : ""}
              </div>
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
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
                  <h3 className="text-lg font-medium mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchParams.search || searchParams.category
                      ? "Try adjusting your search or filter criteria"
                      : "There are no products available at the moment"}
                  </p>
                  <Button asChild>
                    <Link href="/products">View All Products</Link>
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
                                {product.features?.map((feature, index) => (
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
                                Min order: {product.min_order_quantity} units •
                                Lead time: {product.lead_time} days
                              </div>
                              <Button
                                size="sm"
                                className="gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                              >
                                View Details <ArrowRight className="h-3 w-3" />
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
                    No products found
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {searchParams.search || searchParams.category
                      ? "Try adjusting your search or filter criteria"
                      : "There are no products available at the moment"}
                  </p>
                  <Button asChild>
                    <Link href="/products">View All Products</Link>
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
