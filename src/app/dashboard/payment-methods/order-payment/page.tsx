import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import { createPayment } from "@/app/actions/payments";
import { Building, BanknoteIcon } from "lucide-react";

export default async function OrderPaymentPage({
  searchParams,
}: {
  searchParams: { order_id?: string; invoice_id?: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(
      "/sign-in?redirect_to=/dashboard/payment-methods/order-payment",
    );
  }

  // Get invoice ID from search params or fetch from order ID
  let invoiceId = searchParams.invoice_id;
  let invoice = null;
  let order = null;

  if (!invoiceId && searchParams.order_id) {
    // Fetch invoice ID from order
    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("order_id", searchParams.order_id)
      .single();

    if (invoiceData) {
      invoiceId = invoiceData.id;
      invoice = invoiceData;
    } else {
      // If no invoice exists for this order, fetch the order directly
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", searchParams.order_id)
        .single();

      if (orderData) {
        // Create a temporary invoice object from the order
        order = orderData;
        invoice = {
          id: `order-${orderData.id}`,
          invoice_number: `ORD-${orderData.id.substring(0, 8)}`,
          amount: orderData.total_price,
          status: "pending",
          order_id: orderData.id,
          is_order_without_invoice: true,
        };
        invoiceId = invoice.id; // Set the invoiceId so we don't enter the next condition block
      }
    }
  }

  if (!invoiceId) {
    // If no invoice ID, fetch user's unpaid invoices
    const { data: invoices } = await supabase
      .from("invoices")
      .select("*, orders(*)")
      .eq("user_id", user.id)
      .in("status", ["pending", "unpaid"])
      .order("created_at", { ascending: false });

    if (!invoices || invoices.length === 0) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Aucune facture à payer</CardTitle>
              <CardDescription>
                Vous n'avez pas de factures en attente de paiement.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard?tab=invoices">Voir mes factures</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    // If multiple invoices, show selection page
    if (!invoiceId) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">
            Sélectionnez une facture à payer
          </h1>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle>Facture #{invoice.invoice_number}</CardTitle>
                  <CardDescription>
                    {invoice.orders
                      ? `Commande liée: ${invoice.orders.id}`
                      : "Facture indépendante"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Montant</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(invoice.amount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date d'échéance</p>
                      <p>
                        {invoice.due_date
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : "Non spécifiée"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/20 border-t">
                  <Button asChild className="w-full">
                    <a
                      href={`/dashboard/payment-methods/order-payment?invoice_id=${invoice.id}`}
                    >
                      Payer cette facture
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }
  }

  // Fetch invoice details if we have an ID
  if (invoiceId && !invoice) {
    const { data: invoiceData, error } = await supabase
      .from("invoices")
      .select("*, orders(*)")
      .eq("id", invoiceId)
      .single();

    if (error || !invoiceData) {
      return (
        <div className="max-w-3xl mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Facture introuvable</CardTitle>
              <CardDescription>
                La facture demandée n'existe pas ou vous n'avez pas les
                permissions nécessaires.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <a href="/dashboard?tab=invoices">Retour aux factures</a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }

    invoice = invoiceData;
    if (invoice.orders) {
      order = invoice.orders;
    }
  }

  // Fetch user's payment methods
  const { data: paymentMethods } = await supabase
    .from("payment_methods")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active");

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Paiement de facture</h1>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Détails de la facture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Numéro de facture</p>
                <p className="font-bold">#{invoice?.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Montant</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(invoice?.amount || 0)}
                </p>
              </div>
              {order && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Commande liée</p>
                  <p>#{order.id}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <form action={createPayment as any}>
          <input type="hidden" name="invoice_id" value={invoice?.id || ""} />

          <Card>
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
              <CardDescription>
                Sélectionnez votre méthode de paiement préférée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment_method_type">Type de paiement</Label>
                  <Select
                    name="payment_method_type"
                    defaultValue="bank_transfer"
                    id="payment_method_type"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank_transfer">
                        Virement bancaire
                      </SelectItem>
                      <SelectItem value="wafacash">WafaCash</SelectItem>
                      {paymentMethods && paymentMethods.length > 0 && (
                        <SelectItem value="saved_method">
                          Utiliser une méthode enregistrée
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethods && paymentMethods.length > 0 && (
                  <div className="border p-4 rounded-md bg-muted/20">
                    <Label className="mb-2 block">
                      Méthodes de paiement enregistrées
                    </Label>
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className="flex items-center justify-between p-2 border rounded-md hover:bg-accent/10 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/15 text-primary p-2 rounded-full">
                              {method.type === "bank_transfer" ? (
                                <Building className="h-4 w-4" />
                              ) : (
                                <BanknoteIcon className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">
                                {method.type === "bank_transfer"
                                  ? "Virement"
                                  : "WafaCash"}
                                : {method.account_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {method.account_number}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            Sélectionner
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bank Transfer Information */}
                <div
                  id="bank_transfer_info"
                  className="border p-4 rounded-md bg-muted/10"
                >
                  <div className="mb-4">
                    <h3 className="font-medium text-lg mb-2">
                      Informations de virement bancaire
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Veuillez effectuer votre virement aux coordonnées
                      suivantes:
                    </p>

                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Banque:</span>
                        <span>Attijariwafa Bank</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Nom du bénéficiaire:
                        </span>
                        <span>Textile Manufacturing Co.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">IBAN:</span>
                        <span>MA123456789012345678901234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Code Swift:</span>
                        <span>BCMAMAMC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WafaCash Information */}
                <div
                  id="wafacash_info"
                  className="border p-4 rounded-md bg-muted/10 hidden"
                >
                  <div className="mb-4">
                    <h3 className="font-medium text-lg mb-2">
                      Paiement par WafaCash
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Veuillez effectuer votre paiement WafaCash et fournir les
                      informations ci-dessous:
                    </p>
                    <div className="grid gap-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Bénéficiaire:</span>
                        <span>Mohammed Alami</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Téléphone:</span>
                        <span>+212 661-234567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ville:</span>
                        <span>Casablanca</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="reference">Référence du paiement</Label>
                  <Input
                    id="reference"
                    name="reference"
                    placeholder="Numéro de transaction ou référence"
                    required
                  />
                </div>

                <div id="account_name_field">
                  <Label htmlFor="account_name">Nom du compte</Label>
                  <Input
                    id="account_name"
                    name="account_name"
                    placeholder="Nom du titulaire du compte"
                    required
                  />
                </div>

                <div id="account_number_field">
                  <Label htmlFor="account_number">Numéro de compte</Label>
                  <Input
                    id="account_number"
                    name="account_number"
                    placeholder="Numéro de compte ou IBAN"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="details">Détails supplémentaires</Label>
                  <Textarea
                    id="details"
                    name="details"
                    placeholder="Informations complémentaires sur votre paiement"
                    rows={3}
                  />
                </div>

                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                  document.addEventListener('DOMContentLoaded', function() {
                    const paymentTypeSelect = document.getElementById('payment_method_type');
                    const bankTransferInfo = document.getElementById('bank_transfer_info');
                    const wafacashInfo = document.getElementById('wafacash_info');
                    const accountNameField = document.getElementById('account_name_field');
                    const accountNumberField = document.getElementById('account_number_field');
                    const referenceLabel = document.querySelector('label[for="reference"]');
                    
                    function updateFields() {
                      const selectedValue = paymentTypeSelect.value;
                      
                      if (selectedValue === 'bank_transfer') {
                        bankTransferInfo.classList.remove('hidden');
                        wafacashInfo.classList.add('hidden');
                        accountNameField.classList.remove('hidden');
                        accountNumberField.classList.remove('hidden');
                        if (referenceLabel) referenceLabel.textContent = 'Référence du virement';
                      } else if (selectedValue === 'wafacash') {
                        bankTransferInfo.classList.add('hidden');
                        wafacashInfo.classList.remove('hidden');
                        accountNameField.classList.remove('hidden');
                        accountNumberField.classList.add('hidden');
                        if (referenceLabel) referenceLabel.textContent = 'Code de transfert WafaCash';
                      } else {
                        bankTransferInfo.classList.add('hidden');
                        wafacashInfo.classList.add('hidden');
                        accountNameField.classList.remove('hidden');
                        accountNumberField.classList.remove('hidden');
                        if (referenceLabel) referenceLabel.textContent = 'Référence du paiement';
                      }
                    }
                    
                    // Initial setup
                    updateFields();
                    
                    // Listen for changes
                    paymentTypeSelect.addEventListener('change', updateFields);
                  });
                `,
                  }}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button variant="outline" asChild>
                <a href="/dashboard?tab=invoices">Annuler</a>
              </Button>
              <Button type="submit">Soumettre le paiement</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
}
