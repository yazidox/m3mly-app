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
import { Package, Eye, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function SamplesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/samples");
  }

  // Fetch user's sample requests
  const { data: samples, error: samplesError } = await supabase
    .from("sample_requests")
    .select("*, products(name, image), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (samplesError) {
    console.error("Error fetching sample requests:", samplesError);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
           
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Mes <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">Échantillons</span> Demandés
            </h1>
            <p className="text-muted-foreground">
              Suivez et gérez vos demandes d'échantillons de produits
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
          {samples && samples.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Demande</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Usine</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium">
                      #{sample.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{sample.products?.name}</TableCell>
                    <TableCell>{sample.factories?.name}</TableCell>
                    <TableCell>
                      {new Date(sample.created_at).toLocaleDateString()}
                    </TableCell>
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
                        className="px-3 py-1"
                      >
                          {sample.status === "completed" ? "Terminée" : 
                          sample.status === "processing" ? "En cours" : 
                          sample.status === "cancelled" ? "Annulée" : 
                          sample.status === "pending" ? "En attente" : 
                          sample.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/samples/${sample.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
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
              <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Pas encore d'échantillons</p>
              <p className="max-w-md mx-auto mb-6">
                Vous n'avez pas encore demandé d'échantillons de produits. Parcourez nos usines et
                produits pour demander votre premier échantillon.
              </p>
              <Link href="/factories">
                <Button variant="outline" size="sm" className="mt-4 group relative inline-flex items-center px-6 py-2 rounded-xl hover:bg-primary/10 transition-all text-base font-medium overflow-hidden">
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
