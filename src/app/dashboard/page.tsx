import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  FileText,
  Truck,
  CreditCard,
  UserCircle,
  ArrowRight,
  Clock,
  Calendar,
  Building,
  Sparkles,
  TrendingUp,
  Store,
  Search,
  Factory,
  Zap,
} from "lucide-react";
import { t } from "@/lib/i18n/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user data
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, products(name, image), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch user's sample requests
  const { data: samples } = await supabase
    .from("sample_requests")
    .select("*, products(name, image)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch factories
  const { data: factories } = await supabase
    .from("factories")
    .select("*")
    .eq("status", "approved")
    .order("rating", { ascending: false })
    .limit(3);

  // Count pending orders and samples
  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const pendingSamples =
    samples?.filter((sample) => sample.status === "pending").length || 0;
  const totalSpent =
    orders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 shadow-md">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="h-16 w-16 flex items-center justify-center shadow-lg">
            <img src="/logo.svg" alt="M3mly Logo" className="h-full w-full" />
          </div>
          <div>
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "#171E44" }}
            >
              Bienvenue, {userData?.full_name || "Utilisateur"}
            </h1>
            <p className="text-muted-foreground text-lg">
              Voici un aperçu de votre parcours de fabrication
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="group hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Commandes
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orders?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {pendingOrders} en attente
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/dashboard/orders"
              className="text-xs text-primary flex items-center hover:underline"
            >
              Voir toutes les commandes <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Demandes d'Échantillons
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{samples?.length || 0}</div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {pendingSamples} en attente
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/dashboard/samples"
              className="text-xs text-primary flex items-center hover:underline"
            >
              Voir tous les échantillons <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Total Dépensé
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> Sur toutes les commandes
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/dashboard/invoices"
              className="text-xs text-primary flex items-center hover:underline"
            >
              Voir les factures <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Prochaine Livraison
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Truck className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {orders?.find((order) => order.status === "processing")
                ? new Date(
                    orders.find((order) => order.status === "processing")
                      ?.estimated_delivery || Date.now(),
                  ).toLocaleDateString()
                : "Aucune livraison"}
            </div>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Arrivée estimée
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link
              href="/dashboard/shipments"
              className="text-xs text-primary flex items-center hover:underline"
            >
              Suivre les expéditions <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
            <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Commandes Récentes
                </CardTitle>
                <Link href="/dashboard/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:bg-background/80"
                  >
                    Voir Tout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Vos commandes de fabrication les plus récentes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {orders && orders.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                          {order.products?.image ? (
                            <img
                              src={order.products.image}
                              alt={order.products?.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {order.products?.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.factories?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatCurrency(Number(order.total_price))}
                          </div>
                          <div className="text-sm">{order.quantity} unités</div>
                        </div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "success"
                              : order.status === "processing"
                                ? "default"
                                : "outline"
                          }
                          className="ml-2"
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>Pas encore de commandes</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Link href="/factories">Parcourir les Usines</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-border/50 hover:border-primary/30">
            <CardHeader className="bg-muted/30">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Demandes d'Échantillons Récentes
                </CardTitle>
                <Link href="/dashboard/samples">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 hover:bg-background/80"
                  >
                    Voir Tout <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <CardDescription>
                Vos demandes d'échantillons les plus récentes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {samples && samples.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {samples.map((sample) => (
                    <div
                      key={sample.id}
                      className="flex justify-between items-center p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                          {sample.products?.image ? (
                            <img
                              src={sample.products.image}
                              alt={sample.products?.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {sample.products?.name}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(sample.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-medium">
                            {sample.quantity} unités
                          </div>
                        </div>
                        <Badge
                          variant={
                            sample.status === "completed"
                              ? "success"
                              : sample.status === "processing"
                                ? "default"
                                : "outline"
                          }
                          className="ml-2"
                        >
                          {sample.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>Pas encore de demandes d'échantillons</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Link href="/factories">Demander des Échantillons</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                Aperçu du Profil
              </CardTitle>
              <CardDescription>Vos informations de compte</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <UserCircle className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {userData?.full_name || "Utilisateur"}
                  </h3>
                  <p className="text-muted-foreground">{userData?.email}</p>
                  {userData?.phone && (
                    <p className="text-muted-foreground">{userData.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">
                    ADRESSE DE LIVRAISON
                  </h4>
                  <p className="text-sm bg-muted/30 p-3 rounded-md">
                    {userData?.address || "Aucune adresse fournie"}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">
                    DÉTAILS DU COMPTE
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between bg-muted/30 p-2 rounded-md">
                      <span className="text-muted-foreground">
                        Membre depuis:
                      </span>
                      <span>
                        {new Date(
                          userData?.created_at || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between bg-muted/30 p-2 rounded-md">
                      <span className="text-muted-foreground">
                        Type de compte:
                      </span>
                      <span>{userData?.role || "utilisateur"}</span>
                    </div>
                    <div className="flex justify-between bg-muted/30 p-2 rounded-md">
                      <span className="text-muted-foreground">CIN:</span>
                      <span>{userData?.cin || "Non fourni"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/40 bg-muted/20 py-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="gap-1">
                  Modifier le Profil <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Explorer les Usines
              </CardTitle>
              <CardDescription>
                Découvrir des partenaires de fabrication
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {factories && factories.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {factories.map((factory) => (
                    <div
                      key={factory.id}
                      className="p-4 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                          {factory.image ? (
                            <img
                              src={factory.image}
                              alt={factory.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Factory className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{factory.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {factory.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" />
                          <span>Min: {factory.min_order_quantity} unités</span>
                        </div>
                        <Link href={`/factory/${factory.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1 hover:bg-primary/10"
                          >
                            Voir <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p>Aucune usine disponible</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/40 bg-muted/20 py-3">
              <Link href="/factories" className="w-full">
                <Button className="w-full gap-1" variant="outline">
                  <Search className="h-4 w-4" /> Parcourir Toutes les Usines
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
