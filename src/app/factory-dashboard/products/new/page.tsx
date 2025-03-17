import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import { AddTierButton } from "@/components/add-tier-button";

export default async function NewFactoryProductPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/products/new");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("*, factories(*)")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    return redirect("/dashboard?error=not_factory_owner");
  }

  async function createProduct(formData: FormData) {
    "use server";

    const supabase = await createClient();

    // Get user information
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Check if user is a factory owner
    const { data: userData } = await supabase
      .from("users")
      .select("role, factory_id")
      .eq("id", user.id)
      .single();

    if (
      !userData ||
      userData.role !== "factory_owner" ||
      !userData.factory_id
    ) {
      throw new Error("Unauthorized: Only factory owners can create products");
    }

    // Extract form data
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const features = (formData.get("features") as string)
      .split(",")
      .map((f) => f.trim());
    const minOrderQuantity = parseInt(
      formData.get("min_order_quantity") as string,
    );
    const leadTime = parseInt(formData.get("lead_time") as string);
    const status = formData.get("status") as string;

    // Extract price tiers
    const priceTiers = [];
    let tierIndex = 0;

    while (formData.has(`tier-min-${tierIndex}`)) {
      const minQty = parseInt(formData.get(`tier-min-${tierIndex}`) as string);
      const maxQtyStr = formData.get(`tier-max-${tierIndex}`) as string;
      const maxQty = maxQtyStr ? parseInt(maxQtyStr) : null;
      const tierPrice = parseFloat(
        formData.get(`tier-price-${tierIndex}`) as string,
      );

      priceTiers.push({
        min_quantity: minQty,
        max_quantity: maxQty,
        price: tierPrice,
      });

      tierIndex++;
    }

    // Create product in database
    const { error } = await supabase.from("products").insert({
      factory_id: userData.factory_id,
      name,
      price,
      category,
      description,
      image,
      features,
      min_order_quantity: minOrderQuantity,
      lead_time: leadTime,
      status,
      price_tiers: priceTiers,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product");
    }

    return redirect("/factory-dashboard?tab=products&message=product_created");
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/factory-dashboard?tab=products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Ajouter un Nouveau Produit</h1>
            <p className="text-muted-foreground">
              Créez un nouveau produit pour votre catalogue d'usine
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm p-6">
          <form action={createProduct} className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du Produit</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix de Base (MAD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input id="category" name="category" required />
                </div>
              </div>

              {/* Client component for price tiers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Paliers de Prix par Quantité</Label>
                  <AddTierButton initialTierCount={1} />
                </div>
                <div id="price-tiers-container" className="space-y-2">
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <Label htmlFor="tier-min-0">Quantité Minimale</Label>
                      <Input
                        id="tier-min-0"
                        name="tier-min-0"
                        type="number"
                        min="1"
                        defaultValue="1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tier-max-0">Quantité Maximale</Label>
                      <Input
                        id="tier-max-0"
                        name="tier-max-0"
                        type="number"
                        min="1"
                        placeholder="Laisser vide pour illimité"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tier-price-0">Prix par Unité (MAD)</Label>
                      <Input
                        id="tier-price-0"
                        name="tier-price-0"
                        type="number"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Définissez différents prix en fonction de la quantité commandée. Les quantités plus élevées ont généralement des prix unitaires plus bas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de l'Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                <Input
                  id="features"
                  name="features"
                  placeholder="Coton bio, Durable, Fait main"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_quantity">
                    Quantité Minimale de Commande
                  </Label>
                  <Input
                    id="min_order_quantity"
                    name="min_order_quantity"
                    type="number"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead_time">Délai de Production (jours)</Label>
                  <Input
                    id="lead_time"
                    name="lead_time"
                    type="number"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="active"
                  required
                >
                  <option value="active">Actif</option>
                  <option value="draft">Brouillon</option>
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Créer le Produit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
