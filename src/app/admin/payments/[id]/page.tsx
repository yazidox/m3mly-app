import { createClient } from "../../../../../supabase/server";
import { redirect, notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/formatters";
import {
  CheckCheck,
  Clock,
  AlertCircle,
  ArrowLeft,
  Building,
  BanknoteIcon,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { verifyPayment, rejectPayment } from "@/app/actions/admin";

export default async function AdminPaymentDetailPage({
  params,
}: {
  params: { id: string };
}) {
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

  // Fetch payment data
  let payment;
  try {
    const { data, error } = await supabase
      .from("payments")
      .select(
        "*, users(full_name, email, phone), invoices(invoice_number, amount, order_id, created_at, due_date), payment_methods(*)",
      )
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching payment:", error);
      return notFound();
    }

    payment = data;
    if (!payment) {
      return notFound();
    }
  } catch (err) {
    console.error("Exception fetching payment:", err);
    return notFound();
  }

  // Fetch order data if available
  let order = null;
  if (payment.invoices?.order_id) {
    const { data: orderData } = await supabase
      .from("orders")
      .select("*, products(name)")
      .eq("id", payment.invoices.order_id)
      .single();

    order = orderData;
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

  return (
    <div className="space-y-6">
      <Link
        href="/admin/payments"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour à la liste des paiements
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">Détails du Paiement</CardTitle>
                  <CardDescription>
                    Paiement #{payment.id.substring(0, 8)} •{" "}
                    {new Date(payment.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getStatusBadge(payment.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    INFORMATIONS CLIENT
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {payment.users?.full_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payment.users?.email}
                        </p>
                        {payment.users?.phone && (
                          <p className="text-sm text-muted-foreground">
                            {payment.users?.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    INFORMATIONS FACTURE
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium">
                          Facture #{payment.invoices?.invoice_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Émise le{" "}
                          {new Date(
                            payment.invoices?.created_at || Date.now(),
                          ).toLocaleDateString()}
                        </p>
                        {payment.invoices?.due_date && (
                          <p className="text-sm text-muted-foreground">
                            Échéance:{" "}
                            {new Date(
                              payment.invoices.due_date,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  DÉTAILS DU PAIEMENT
                </h3>
                <div className="bg-muted/30 rounded-md p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Montant</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(payment.invoices?.amount || 0)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Méthode</p>
                      <p className="flex items-center">
                        {payment.payment_method_type === "bank_transfer" ? (
                          <>
                            <Building className="h-4 w-4 mr-1" />
                            Virement Bancaire
                          </>
                        ) : payment.payment_method_type === "wafacash" ? (
                          <>
                            <BanknoteIcon className="h-4 w-4 mr-1" />
                            WafaCash
                          </>
                        ) : (
                          payment.payment_method_type
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  INFORMATIONS DE PAIEMENT
                </h3>
                <div className="bg-muted/30 rounded-md p-4">
                  {payment.payment_method_type === "bank_transfer" ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Banque
                          </p>
                          <p>{payment.payment_methods?.bank_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Titulaire
                          </p>
                          <p>{payment.payment_methods?.account_name}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Numéro de Compte (RIB)
                        </p>
                        <p className="font-mono">
                          {payment.payment_methods?.account_number}
                        </p>
                      </div>
                      {payment.reference && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Référence
                          </p>
                          <p className="font-mono">{payment.reference}</p>
                        </div>
                      )}
                    </div>
                  ) : payment.payment_method_type === "wafacash" ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Bénéficiaire
                          </p>
                          <p>{payment.payment_methods?.account_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Numéro de Téléphone
                          </p>
                          <p>{payment.payment_methods?.account_number}</p>
                        </div>
                      </div>
                      {payment.reference && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Code de Transfert
                          </p>
                          <p className="font-mono">{payment.reference}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>Informations de paiement non disponibles</p>
                  )}
                </div>
              </div>

              {payment.details && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    NOTES
                  </h3>
                  <div className="bg-muted/30 rounded-md p-4">
                    <p>{payment.details}</p>
                  </div>
                </div>
              )}

              {order && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    COMMANDE ASSOCIÉE
                  </h3>
                  <div className="bg-muted/30 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Commande
                        </p>
                        <p>#{order.id.substring(0, 8)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Produit</p>
                        <p>{order.products?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Quantité
                        </p>
                        <p>{order.quantity} unités</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Statut de la commande
                        </p>
                        <p className="capitalize">{order.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Vérifiez et validez ce paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                <h4 className="font-medium flex items-center gap-1 mb-1">
                  <AlertCircle className="h-4 w-4" /> Vérification requise
                </h4>
                <p className="text-sm">
                  Veuillez vérifier que le paiement a bien été reçu avant de le
                  valider. Cette action mettra à jour le statut de la facture et
                  de la commande associée.
                </p>
              </div>

              <div className="bg-muted/30 p-4 rounded-md">
                <h4 className="font-medium mb-2">Statut actuel</h4>
                <div className="flex items-center gap-2">
                  {getStatusBadge(payment.status)}
                  <span className="text-sm text-muted-foreground">
                    Mis à jour le{" "}
                    {new Date(
                      payment.updated_at || payment.created_at,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              {payment.status === "pending" && (
                <>
                  <form action={verifyPayment} className="w-full">
                    <input type="hidden" name="payment_id" value={payment.id} />
                    <input
                      type="hidden"
                      name="invoice_id"
                      value={payment.invoice_id}
                    />
                    <input
                      type="hidden"
                      name="order_id"
                      value={payment.invoices?.order_id || ""}
                    />
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" /> Valider le
                      Paiement
                    </Button>
                  </form>

                  <form action={rejectPayment} className="w-full">
                    <input type="hidden" name="payment_id" value={payment.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 mt-2"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" /> Rejeter le
                      Paiement
                    </Button>
                  </form>
                </>
              )}

              {payment.status === "verified" && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md w-full">
                  <h4 className="font-medium flex items-center gap-1 mb-1">
                    <CheckCheck className="h-4 w-4" /> Paiement validé
                  </h4>
                  <p className="text-sm">
                    Ce paiement a été vérifié et validé. La facture a été
                    marquée comme payée.
                  </p>
                </div>
              )}

              {payment.status === "rejected" && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md w-full">
                  <h4 className="font-medium flex items-center gap-1 mb-1">
                    <AlertCircle className="h-4 w-4" /> Paiement rejeté
                  </h4>
                  <p className="text-sm">
                    Ce paiement a été rejeté. Le client devra effectuer un
                    nouveau paiement.
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liens Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/invoices/${payment.invoice_id}`}>
                  <FileText className="h-4 w-4 mr-2" /> Voir la Facture
                </Link>
              </Button>

              {payment.invoices?.order_id && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/admin/orders/${payment.invoices.order_id}`}>
                    <Package className="h-4 w-4 mr-2" /> Voir la Commande
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href={`/admin/users/${payment.user_id}`}>
                  <User className="h-4 w-4 mr-2" /> Profil Client
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
