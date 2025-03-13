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
import {
  FileText,
  Eye,
  Download,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";

export default async function UserInvoicesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/invoices");
  }

  // Fetch invoices for this user
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*, orders(id, total_price, products(name)), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Mes{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
                Factures
              </span>{" "}
              et Paiements
            </h1>
            <p className="text-muted-foreground">
              Consultez et gérez vos factures et paiements
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
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Facture #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Usine</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="hover:bg-primary/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.factories?.name}</TableCell>
                    <TableCell>{invoice.orders?.products?.name}</TableCell>
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
                        className="px-3 py-1"
                      >
                        {invoice.status === "paid"
                          ? "Payée"
                          : invoice.status === "overdue"
                            ? "En retard"
                            : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/invoices/${invoice.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        {invoice.status !== "paid" && (
                          <Button
                            size="sm"
                            className="group relative inline-flex items-center bg-primary hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 overflow-hidden"
                          >
                            <span className="relative z-10 flex items-center">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Payer maintenant
                            </span>
                            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Aucune facture</p>
              <p className="max-w-md mx-auto mb-6">
                Vous n'avez pas encore de factures. Lorsque vous passerez des
                commandes, vos factures apparaîtront ici.
              </p>
              <Link href="/factories">
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 group relative inline-flex items-center px-6 py-2 rounded-xl hover:bg-primary/10 transition-all text-base font-medium overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    Parcourir les usines
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
