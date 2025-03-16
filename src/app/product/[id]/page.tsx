import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*, factories(*)")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    return notFound();
  }

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is approved
  let isApproved = false;
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("is_approved")
      .eq("id", user.id)
      .single();

    isApproved = userData?.is_approved || false;
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg border">
            <img
              src={
                product.image ||
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <Link
              href={`/factory/${product.factory_id}`}
              className="text-primary hover:underline"
            >
              {product.factories?.name}
            </Link>
          </div>

          {user && isApproved ? (
            <div className="text-2xl font-bold">
              {formatCurrency(product.price)}
            </div>
          ) : (
            <div className="text-xl text-muted-foreground">
              Connectez-vous pour voir le prix
            </div>
          )}

          <div className="prose dark:prose-invert">
            <p>{product.description}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Quantité minimum
                </h3>
                <p>{product.min_order_quantity} pièces</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Délai de production
                </h3>
                <p>{product.lead_time}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Couleurs disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color: string) => (
                  <span
                    key={color}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Tailles disponibles
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size: string) => (
                  <span
                    key={size}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={`/product/${product.id}/sample`}>
              <Button variant="outline">Demander un échantillon</Button>
            </Link>
            <Link href={`/product/${product.id}/order`}>
              <Button>Commander</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
