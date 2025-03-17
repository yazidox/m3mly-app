import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Truck,
  Clock,
  DollarSign,
  Users,
  Edit,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function FactoryDashboard({
  searchParams,
}: {
  searchParams: { tab?: string; message?: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard");
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

  const factoryId = userData.factory_id;

  // Fetch orders for this factory
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, products(name, image)")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // Fetch sample requests for this factory
  const { data: sampleRequests, error: samplesError } = await supabase
    .from("sample_requests")
    .select("*, products(name, image)")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (samplesError) {
    console.error("Error fetching sample requests:", samplesError);
  }

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  // Fetch invoices for this factory
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
  }

  // Calculate statistics
  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "completed").length || 0;
  const totalRevenue = orders
    ?.filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total_price), 0);
  const pendingSamples =
    sampleRequests?.filter((sample) => sample.status === "pending").length || 0;
  const unpaidInvoices =
    invoices?.filter((invoice) => invoice.status === "unpaid").length || 0;

  // Get active tab from URL or default to "overview"
  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord d'Usine</h1>
            <p className="text-muted-foreground">
              Gérez vos commandes, échantillons et profil d'usine
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/factory/${factoryId}`}>
              <Button variant="outline">Voir Profil Public</Button>
            </Link>
            <Link href="/factory-dashboard/settings">
              <Button variant="outline">Paramètres</Button>
            </Link>
          </div>
        </div>

        {searchParams.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {searchParams.message === "order_updated" && (
              <p>Statut de commande mis à jour avec succès</p>
            )}
            {searchParams.message === "sample_updated" && (
              <p>Statut de demande d'échantillon mis à jour avec succès</p>
            )}
            {searchParams.message === "product_created" && (
              <p>Produit créé avec succès</p>
            )}
            {searchParams.message === "product_updated" && (
              <p>Produit mis à jour avec succès</p>
            )}
            {searchParams.message === "product_deleted" && (
              <p>Produit supprimé avec succès</p>
            )}
          </div>
        )}

        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="samples">Demandes d'Échantillons</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Commandes en Attente
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En attente de traitement
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Commandes Terminées
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Livrées avec succès
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenu Total
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {totalRevenue
                      ? formatCurrency(totalRevenue)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    De toutes les commandes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Factures Impayées
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unpaidInvoices}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    En attente de paiement
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Commandes Récentes</CardTitle>
                  <Link href="/factory-dashboard?tab=orders">
                    <Button variant="ghost" size="sm">
                      Voir Tout
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {orders && orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Commande</TableHead>
                          <TableHead>Produit</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              #{order.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>{order.products?.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "success"
                                    : order.status === "processing"
                                      ? "default"
                                      : order.status === "cancelled"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {order.status === "pending" ? "en attente" : 
                                 order.status === "processing" ? "en traitement" : 
                                 order.status === "completed" ? "terminée" : 
                                 order.status === "cancelled" ? "annulée" : order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Pas encore de commandes
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Factures Récentes</CardTitle>
                  <Link href="/factory-dashboard/invoices">
                    <Button variant="ghost" size="sm">
                      Voir Tout
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {invoices && invoices.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Facture #</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.slice(0, 5).map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(Number(invoice.amount))}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  invoice.status === "paid"
                                    ? "success"
                                    : invoice.status === "overdue"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {invoice.status === "paid" ? "payée" : 
                                 invoice.status === "unpaid" ? "impayée" : 
                                 invoice.status === "overdue" ? "en retard" : invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(
                                invoice.created_at,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Pas encore de factures
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Demandes d'Échantillons</CardTitle>
                  <Link href="/factory-dashboard?tab=samples">
                    <Button variant="ghost" size="sm">
                      Voir Tout
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {sampleRequests && sampleRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID Demande</TableHead>
                          <TableHead>Produit</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleRequests.slice(0, 5).map((sample) => (
                          <TableRow key={sample.id}>
                            <TableCell className="font-medium">
                              #{sample.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>{sample.products?.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  sample.status === "completed"
                                    ? "success"
                                    : sample.status === "processing"
                                      ? "default"
                                      : sample.status === "cancelled"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {sample.status === "pending" ? "en attente" : 
                                 sample.status === "processing" ? "en traitement" : 
                                 sample.status === "completed" ? "terminée" : 
                                 sample.status === "cancelled" ? "annulée" : sample.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(sample.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Pas encore de demandes d'échantillons
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Produits Récents</CardTitle>
                  <Link href="/factory-dashboard/products">
                    <Button variant="ghost" size="sm">
                      Gérer les Produits
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {products && products.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Prix</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.slice(0, 5).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(product.price)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "active"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {product.status === "active" ? "actif" : "inactif"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      Pas encore de produits
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Commande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>{order.full_name}</TableCell>
                          <TableCell>{order.products?.name}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(Number(order.total_price))}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "success"
                                  : order.status === "processing"
                                    ? "default"
                                    : order.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {order.status === "pending" ? "en attente" : 
                               order.status === "processing" ? "en traitement" : 
                               order.status === "completed" ? "terminée" : 
                               order.status === "cancelled" ? "annulée" : order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/orders/${order.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Gérer
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Pas Encore de Commandes</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Vous n'avez pas encore reçu de commandes. Lorsque les clients passeront des commandes pour vos produits, elles apparaîtront ici.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples">
            <Card>
              <CardHeader>
                <CardTitle>Toutes les Demandes d'Échantillons</CardTitle>
              </CardHeader>
              <CardContent>
                {sampleRequests && sampleRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID Demande</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Produit</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleRequests.map((sample) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">
                            #{sample.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>{sample.full_name}</TableCell>
                          <TableCell>{sample.products?.name}</TableCell>
                          <TableCell>{sample.quantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sample.status === "completed"
                                  ? "success"
                                  : sample.status === "processing"
                                    ? "default"
                                    : sample.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {sample.status === "pending" ? "en attente" : 
                               sample.status === "processing" ? "en traitement" : 
                               sample.status === "completed" ? "terminée" : 
                               sample.status === "cancelled" ? "annulée" : sample.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(sample.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/samples/${sample.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Gérer
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Pas Encore de Demandes d'Échantillons
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Vous n'avez pas encore reçu de demandes d'échantillons. Lorsque les clients demanderont des échantillons de vos produits, elles apparaîtront ici.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Vos Produits</CardTitle>
                <Link href="/factory-dashboard/products/new">
                  <Button className="w-full sm:w-auto">
                    <Package className="h-4 w-4 mr-2" /> Ajouter un Nouveau Produit
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {products && products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Commande Min</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.image && (
                              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.min_order_quantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "active"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {product.status === "active" ? "actif" : "inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/products/${product.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Pas Encore de Produits
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      Vous n'avez pas encore ajouté de produits à votre catalogue. Ajoutez votre premier produit pour commencer à recevoir des commandes.
                    </p>
                    <Link href="/factory-dashboard/products/new">
                      <Button>Ajouter Votre Premier Produit</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
