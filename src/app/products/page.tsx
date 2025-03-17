import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import ProductsHero from "@/components/products/products-hero";
import ProductsSidebar from "@/components/products/products-sidebar";
import ProductsGrid from "@/components/products/products-grid";

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
    <div className=" w-full">
      <Navbar />
      
      {/* Hero Section - Client Component */}
      <ProductsHero searchParams={searchParams} />

      <div className="grid container mx-auto grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Client Component */}
        <ProductsSidebar 
          uniqueCategories={uniqueCategories} 
          products={products || []} 
          searchParams={searchParams} 
        />

        {/* Products Grid - Client Component */}
        <ProductsGrid 
          products={products || []} 
          searchParams={searchParams} 
        />
      </div>
    </div>
  );
}
