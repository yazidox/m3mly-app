import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
} from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Méthodes de Paiement</h1>
        <p className="text-muted-foreground">
          Gérez vos méthodes de paiement et historique de facturation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BanknoteIcon className="h-5 w-5 text-primary" />
                <span>Vos Méthodes de Paiement</span>
              </CardTitle>
              <CardDescription>
                Gérez vos méthodes de paiement enregistrées
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethods && paymentMethods.length > 0 ? (
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex justify-between items-center p-4 border rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-muted/50 p-2 rounded">
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive mt-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground mb-4">
                    Aucune méthode de paiement ajoutée
                  </p>
                </div>
              )}

              <Button
                className="mt-6 w-full sm:w-auto"
                variant="outline"
                asChild
              >
                <a href="#add-payment-method">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une méthode de paiement
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique des Paiements</CardTitle>
              <CardDescription>
                Votre historique récent de paiements
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                      {paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="p-3">
                            #{payment.invoices?.invoice_number}
                          </td>
                          <td className="p-3">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-3">
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
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-muted/20">
                  <p className="text-muted-foreground">
                    Aucun historique de paiement disponible
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6" id="add-payment-method">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une Méthode de Paiement</CardTitle>
              <CardDescription>
                Choisissez votre méthode de paiement préférée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="bank_transfer">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="bank_transfer">
                    Virement Bancaire
                  </TabsTrigger>
                  <TabsTrigger value="wafacash">WafaCash</TabsTrigger>
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountName">Nom du Titulaire</Label>
                      <Input
                        id="accountName"
                        name="accountName"
                        placeholder="Mohammed Alami"
                        required
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference">Référence (optionnel)</Label>
                      <Input
                        id="reference"
                        name="reference"
                        placeholder="Référence de paiement"
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
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Numéro de Téléphone</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        placeholder="+212 6XX XXX XXX"
                        required
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
                      />
                    </div>
                  </TabsContent>

                  <Button type="submit" className="w-full mt-4">
                    Ajouter cette Méthode de Paiement
                  </Button>
                </form>
              </Tabs>

              <Separator className="my-6" />

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Comment ça marche:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Ajoutez votre méthode de paiement préférée</li>
                  <li>
                    Lors du paiement d'une facture, sélectionnez cette méthode
                  </li>
                  <li>
                    Effectuez le paiement via votre banque ou service WafaCash
                  </li>
                  <li>Notre équipe vérifiera votre paiement dans les 24-48h</li>
                  <li>
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
