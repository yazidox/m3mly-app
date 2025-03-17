import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  BanknoteIcon,
  Building,
  AlertCircle,
  Clock,
  CheckCheck,
  ArrowRight,
  Sparkles,
  Wallet,
  Receipt,
  Shield,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";
export const revalidate = 0; // Disable cache completely

export default async function PaymentMethodsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/payment-methods");
  }

  // Fetch user's payment methods
  let paymentMethods = [];
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment methods:", error);
    } else {
      paymentMethods = data || [];
    }
  } catch (err) {
    console.error("Exception fetching payment methods:", err);
  }

  // Fetch payment history
  let paymentHistory = [];
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*, invoices(invoice_number, amount)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching payment history:", error);
    } else {
      paymentHistory = data || [];
    }
  } catch (err) {
    console.error("Exception fetching payment history:", err);
  }

  // Fetch user's unpaid invoices and orders that need payment
  let unpaidInvoices = [];
  try {
    // First get invoices that are unpaid
    const { data: invoiceData, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, orders(*)")
      .eq("user_id", user.id)
      .in("status", ["pending", "unpaid"])
      .order("created_at", { ascending: false });

    if (invoiceError) {
      console.error("Error fetching unpaid invoices:", invoiceError);
    } else {
      unpaidInvoices = invoiceData || [];
    }

    // If no unpaid invoices found, check for orders that need payment
    if (unpaidInvoices.length === 0) {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .in("payment_status", ["unpaid", "pending"])
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Error fetching unpaid orders:", orderError);
      } else if (orderData && orderData.length > 0) {
        // For orders without invoices, create temporary invoice-like objects
        unpaidInvoices = orderData.map((order) => ({
          id: `order-${order.id}`,
          invoice_number: `ORD-${order.id.substring(0, 8)}`,
          amount: order.total_price,
          status: "pending",
          orders: order,
          order_id: order.id,
          is_order_without_invoice: true,
        }));
      }
    }
  } catch (err) {
    console.error("Exception fetching unpaid items:", err);
  }

  // Helper function to get icon based on payment method type
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "bank_transfer":
        return <Building className="h-5 w-5" />;
      case "wafacash":
        return <BanknoteIcon className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

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

  // Function to add a new payment method
  async function addPaymentMethod(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return redirect("/sign-in");

    const type = formData.get("type") as string;
    const accountName = formData.get("accountName") as string;
    const accountNumber = formData.get("accountNumber") as string;
    const bankName = formData.get("bankName") as string;
    const reference = formData.get("reference") as string;
    const details = formData.get("details") as string;

    const { error } = await supabase.from("payment_methods").insert({
      user_id: user.id,
      type,
      account_name: accountName,
      account_number: accountNumber,
      bank_name: type === "bank_transfer" ? bankName : null,
      reference: reference || null,
      details: details || null,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error adding payment method:", error);
    }

    return redirect("/dashboard/payment-methods");
  }

  return (
    <div className="space-y-8 relative overflow-hidden">
      {/* Payment Alert */}
      <Alert className="bg-primary/10 border-primary/20 mb-6">
        <AlertTriangle className="h-5 w-5 text-primary" />
        <AlertTitle>Paiement en attente</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>
            Pour effectuer un paiement, veuillez sélectionner une facture
            ci-dessous ou ajouter une nouvelle méthode de paiement.
          </p>
          <Button size="sm" variant="outline" className="w-fit" asChild>
            <Link href="#add-payment-method">
              Ajouter une méthode de paiement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AlertDescription>
      </Alert>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      </div>

      <div className="relative">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Méthodes de{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">
            Paiement
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
          Gérez vos méthodes de paiement et suivez votre historique de
          facturation
        </p>
      </div>

      {/* Unpaid Invoices Section */}
      <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden mb-8">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            <span>Factures en attente de paiement</span>
          </CardTitle>
          <CardDescription>
            Vos factures qui nécessitent un paiement
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {unpaidInvoices && unpaidInvoices.length > 0 ? (
            <div className="space-y-4">
              {unpaidInvoices.map((invoice, idx) => (
                <div
                  key={invoice.id}
                  className="group p-4 border rounded-md hover:border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/15 text-primary p-3 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <Receipt className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          Facture #{invoice.invoice_number}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {invoice.orders
                            ? `Commande: ${invoice.orders.id.substring(0, 8)}...`
                            : "Facture indépendante"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xl font-bold">
                        {formatCurrency(invoice.amount)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 group-hover:bg-primary group-hover:text-white transition-colors"
                        asChild
                      >
                        <Link
                          href={
                            invoice.is_order_without_invoice
                              ? `/dashboard/payment-methods/order-payment?order_id=${invoice.order_id}`
                              : `/dashboard/payment-methods/order-payment?invoice_id=${invoice.id}`
                          }
                        >
                          Payer maintenant
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md bg-card/50 backdrop-blur-sm">
              <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">
                Aucune facture en attente
              </p>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Vous n'avez pas de factures en attente de paiement pour le
                moment.
              </p>
              <Button asChild variant="outline">
                <Link href="/dashboard/orders">
                  Voir mes commandes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-primary" />
                <span>Vos Méthodes de Paiement</span>
              </CardTitle>
              <CardDescription>
                Gérez vos méthodes de paiement enregistrées
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {paymentMethods && paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method, idx) => (
                    <div
                      key={method.id}
                      className="group p-4 border rounded-md hover:border-primary/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/15 text-primary p-3 rounded-full border border-primary/20 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                            {getPaymentMethodIcon(method.type)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {method.type === "bank_transfer"
                                ? "Virement Bancaire"
                                : method.type === "wafacash"
                                  ? "WafaCash"
                                  : method.type}
                              {method.is_default && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <div className="text-sm">
                              {method.type === "bank_transfer" ? (
                                <>
                                  <div>{method.bank_name}</div>
                                  <div className="text-muted-foreground">
                                    {method.account_name} •{" "}
                                    {method.account_number}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div>{method.account_name}</div>
                                  <div className="text-muted-foreground">
                                    {method.account_number}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(method.status)}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              asChild
                            >
                              <Link
                                href={`/dashboard/payment-methods/order-payment`}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />{" "}
                                Utiliser
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-gradient-to-r from-primary/20 to-accent/20 mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md bg-card/50 backdrop-blur-sm">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">
                    Aucune méthode de paiement
                  </p>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Ajoutez une méthode de paiement pour faciliter vos
                    transactions.
                  </p>
                </div>
              )}

              <Button
                className="mt-6 w-full sm:w-auto group/btn relative overflow-hidden"
                variant="outline"
                asChild
              >
                <Link href="/dashboard/payment-methods/add">
                  <span className="relative z-10 flex items-center justify-center group-hover/btn:text-white transition-colors duration-300">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une méthode de paiement
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                <span>Historique des Paiements</span>
              </CardTitle>
              <CardDescription>
                Votre historique récent de paiements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {paymentHistory && paymentHistory.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Facture</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Montant</th>
                        <th className="text-left p-3 font-medium">Méthode</th>
                        <th className="text-left p-3 font-medium">Statut</th>
                        <th className="text-right p-3 font-medium">Reçu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paymentHistory.map((payment, idx) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-muted/30 transition-colors duration-200"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <td className="p-3">
                            #{payment.invoices?.invoice_number}
                          </td>
                          <td className="p-3">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3 font-medium">
                            {formatCurrency(payment.invoices?.amount || 0)}
                          </td>
                          <td className="p-3">
                            {payment.payment_method_type === "bank_transfer"
                              ? "Virement"
                              : payment.payment_method_type === "wafacash"
                                ? "WafaCash"
                                : payment.payment_method_type}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="p-3 text-right">
                            {payment.status === "verified" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                Télécharger
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md bg-card/50 backdrop-blur-sm">
                  <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-xl font-medium mb-2">
                    Aucun historique de paiement
                  </p>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Vos transactions apparaîtront ici une fois que vous aurez
                    effectué des paiements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6" id="add-payment-method">
          <Card className="border border-border shadow-sm hover:shadow-xl transition-all duration-500 backdrop-blur-sm sticky top-6">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
              <div className="mb-3 inline-flex items-center px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
                <Sparkles className="w-3 h-3 mr-1" />
                <span>NOUVEAU</span>
              </div>
              <CardTitle>Ajouter une Méthode de Paiement</CardTitle>
              <CardDescription>
                Choisissez votre méthode de paiement préférée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bank_transfer">
                <TabsList className="grid w-full mt-4 grid-cols-2 mb-4">
                  <TabsTrigger
                    value="bank_transfer"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    Virement Bancaire
                  </TabsTrigger>
                  <TabsTrigger
                    value="wafacash"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    WafaCash
                  </TabsTrigger>
                </TabsList>

                <form action={addPaymentMethod} className="space-y-4">
                  <TabsContent value="bank_transfer">
                    <input type="hidden" name="type" value="bank_transfer" />

                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nom de la Banque</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        placeholder="Attijariwafa Bank"
                        required
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Nom du Titulaire</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        placeholder="Mohammed Alami"
                        required
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">
                        Numéro de Compte (RIB)
                      </Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="007 123456789012345678"
                        required
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence (optionnel)</Label>
                      <Input
                        id="reference"
                        name="reference"
                        placeholder="Référence de paiement"
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">
                        Informations Supplémentaires
                      </Label>
                      <Textarea
                        id="details"
                        name="details"
                        placeholder="Informations supplémentaires pour ce mode de paiement"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="wafacash">
                    <input type="hidden" name="type" value="wafacash" />

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Nom du Bénéficiaire</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        placeholder="Mohammed Alami"
                        required
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Numéro de Téléphone</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="+212 6XX XXX XXX"
                        required
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference">
                        Code de Transfert (optionnel)
                      </Label>
                      <Input
                        id="reference"
                        name="reference"
                        placeholder="Code de transfert WafaCash"
                        className="focus-visible:ring-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="details">
                        Informations Supplémentaires
                      </Label>
                      <Textarea
                        id="details"
                        name="details"
                        placeholder="Informations supplémentaires pour ce mode de paiement"
                        className="focus-visible:ring-primary"
                      />
                    </div>
                  </TabsContent>

                  <Button
                    type="submit"
                    className="w-full mt-4 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-shadow relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Ajouter cette Méthode de Paiement
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </form>
              </Tabs>

              <Separator className="my-6" />

              <div className="p-4 bg-card/50 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <Shield className="w-5 h-5" />
                  <h3 className="font-medium">Comment ça marche:</h3>
                </div>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  <li className="transition-colors hover:text-foreground">
                    Ajoutez votre méthode de paiement préférée
                  </li>
                  <li className="transition-colors hover:text-foreground">
                    Lors du paiement d'une facture, sélectionnez cette méthode
                  </li>
                  <li className="transition-colors hover:text-foreground">
                    Effectuez le paiement via votre banque ou service WafaCash
                  </li>
                  <li className="transition-colors hover:text-foreground">
                    Notre équipe vérifiera votre paiement dans les 24-48h
                  </li>
                  <li className="transition-colors hover:text-foreground">
                    Une fois vérifié, votre paiement sera marqué comme complété
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
