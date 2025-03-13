import { createClient } from "../../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateInvoice } from "@/app/actions/factory";
import { ArrowLeft, Calendar, FileText, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function GenerateInvoicePage({
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

  // Fetch order data
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(name, price)")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return notFound();
  }

  // Check if invoice already exists for this order
  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("id")
    .eq("order_id", params.id)
    .maybeSingle();

  if (existingInvoice) {
    return redirect(`/factory-dashboard/invoices/${existingInvoice.id}`);
  }

  // Generate a unique invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(
    Math.random() * 10000,
  )
    .toString()
    .padStart(4, "0")}`;

  // Set default due date (30 days from now)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);
  const dueDateString = dueDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <Link
          href={`/factory-dashboard/orders/${params.id}`}
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Order
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Generate Invoice for Order #{order.id.substring(0, 8)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Order placed on{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Product: {order.products?.name}
                    </span>
                    <span>
                      {order.quantity} × ${order.products?.price} = $
                      {(order.quantity * order.products?.price).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-border pt-4">
                    <span>Total</span>
                    <span>${Number(order.total_price).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-6 pt-6">
                <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <div className="font-medium">{order.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.phone}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.company}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Shipping Address</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {order.shipping_address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Form */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 text-primary rounded-full">
                  <FileText size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Invoice Details</h2>
                  <p className="text-muted-foreground text-sm">
                    Create an invoice for this order
                  </p>
                </div>
              </div>

              <form action={generateInvoice} className="space-y-4">
                <input type="hidden" name="order_id" value={order.id} />

                <div className="space-y-2">
                  <Label htmlFor="invoice_number">Invoice Number</Label>
                  <Input
                    id="invoice_number"
                    name="invoice_number"
                    defaultValue={invoiceNumber}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    defaultValue={dueDateString}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Add any notes or payment instructions"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Generate Invoice
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
