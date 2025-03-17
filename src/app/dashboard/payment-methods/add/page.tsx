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
import { Switch } from "@/components/ui/switch";

export default async function AddPaymentMethodPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/payment-methods/add");
  }

  async function addPaymentMethod(formData: FormData) {
    "use server";

    const supabase = await createClient();

    // Get user information
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    try {
      // Extract form data
      const type = formData.get("type") as string;
      const accountName = formData.get("account_name") as string;
      const accountNumber = formData.get("account_number") as string;
      const bankName = formData.get("bank_name") as string;
      const details = formData.get("details") as string;
      const isDefault = formData.get("is_default") === "on";

      // If this is set as default, update all other payment methods to not be default
      if (isDefault) {
        await supabase
          .from("payment_methods")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      // Create payment method record
      const { error } = await supabase.from("payment_methods").insert({
        user_id: user.id,
        type,
        account_name: accountName,
        account_number: accountNumber,
        bank_name: bankName || null,
        details: details || null,
        is_default: isDefault,
        status: "active",
      });

      if (error) {
        console.error("Error creating payment method:", error);
        throw new Error("Failed to create payment method");
      }

      return redirect(
        "/dashboard/payment-methods?message=payment_method_added",
      );
    } catch (error) {
      console.error("Error in addPaymentMethod:", error);
      return redirect("/dashboard/payment-methods/add?error=failed_to_add");
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">
        Ajouter une méthode de paiement
      </h1>

      <form action={addPaymentMethod}>
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle méthode de paiement</CardTitle>
            <CardDescription>
              Ajoutez les informations de votre méthode de paiement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type de méthode</Label>
                <Select name="type" defaultValue="bank_transfer">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      Virement bancaire
                    </SelectItem>
                    <SelectItem value="wafacash">WafaCash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="account_name">Nom du titulaire</Label>
                <Input
                  id="account_name"
                  name="account_name"
                  placeholder="Nom complet du titulaire du compte"
                  required
                />
              </div>

              <div>
                <Label htmlFor="account_number">Numéro de compte / IBAN</Label>
                <Input
                  id="account_number"
                  name="account_number"
                  placeholder="Numéro de compte ou IBAN"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bank_name">Nom de la banque (optionnel)</Label>
                <Input
                  id="bank_name"
                  name="bank_name"
                  placeholder="Nom de votre banque"
                />
              </div>

              <div>
                <Label htmlFor="details">
                  Informations supplémentaires (optionnel)
                </Label>
                <Textarea
                  id="details"
                  name="details"
                  placeholder="Détails supplémentaires sur cette méthode de paiement"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Switch id="is_default" name="is_default" />
                <Label htmlFor="is_default">
                  Définir comme méthode par défaut
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <a href="/dashboard/payment-methods">Annuler</a>
            </Button>
            <Button type="submit">Enregistrer</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
