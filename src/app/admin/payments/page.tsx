import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import {
  CheckCheck,
  Clock,
  AlertCircle,
  Eye,
  Building,
  BanknoteIcon,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/admin/payments");
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "admin") {
    return redirect("/dashboard");
  }

  // Fetch all payments
  let payments = [];
  try {
    const { data, error } = await supabase
      .from("payments")
      .select(
        "*, users(full_name, email), invoices(invoice_number, amount, order_id)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
    } else {
      payments = data || [];
    }
  } catch (err) {
    console.error("Exception fetching payments:", err);
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="success" className="bg-green-100 text-green-800">
            <CheckCheck className="h-3 w-3 mr-1" /> Vérifié
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> En attente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" /> Rejeté
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function to get payment method icon
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return <Building className="h-4 w-4 mr-1" />;
      case "wafacash":
        return <BanknoteIcon className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des Paiements</h1>
        <p className="text-muted-foreground">
          Vérifiez et validez les paiements des clients
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {payments && payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Facture</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {payment.users?.full_name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {payment.users?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.invoice_id ? (
                      <Link
                        href={`/admin/invoices/${payment.invoice_id}`}
                        className="hover:underline"
                      >
                        #{payment.invoices?.invoice_number}
                      </Link>
                    ) : payment.order_id ? (
                      <Link
                        href={`/admin/orders/${payment.order_id}`}
                        className="hover:underline"
                      >
                        #ORD-{payment.order_id.substring(0, 8)}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(
                      payment.invoices?.amount || payment.amount || 0,
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getPaymentMethodIcon(payment.payment_method_type)}
                      <span>
                        {payment.payment_method_type === "bank_transfer"
                          ? "Virement"
                          : payment.payment_method_type === "wafacash"
                            ? "WafaCash"
                            : payment.payment_method_type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{payment.reference || "—"}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/payments/${payment.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Aucun paiement trouvé</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Il n'y a pas encore de paiements à vérifier dans le système.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
