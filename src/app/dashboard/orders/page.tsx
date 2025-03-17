import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingCart, Eye, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/orders");
  }

  // Fetch user's orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, products(name, image), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Mes{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Commandes
              </span>{" "}
              Effectuées
            </h1>
            <p className="text-muted-foreground">
              Suivez et gérez vos commandes de produits
            </p>
          </div>
          <Link href="/factories">
            <Button className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden">
              <span className="relative z-10 flex items-center">
                Explorer les Usines
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
          {orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Commande</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Usine</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{order.products?.name}</TableCell>
                    <TableCell>{order.factories?.name}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {Number(order.total_price).toFixed(2)} MAD
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
                        className="px-3 py-1"
                      >
                        {order.status === "completed"
                          ? "Terminée"
                          : order.status === "processing"
                            ? "En cours"
                            : order.status === "cancelled"
                              ? "Annulée"
                              : order.status === "pending"
                                ? "En attente"
                                : order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">
                Pas encore de commandes
              </p>
              <p className="max-w-md mx-auto mb-6">
                Vous n'avez pas encore passé de commandes. Parcourez nos usines
                et produits pour passer votre première commande.
              </p>
              <Link href="/factories">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 group relative inline-flex items-center px-6 py-2 rounded-xl hover:bg-primary/10 transition-all text-base font-medium overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Explorer les Usines
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
