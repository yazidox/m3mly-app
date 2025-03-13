import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSampleStatus } from "@/app/actions/products";
import { ArrowLeft, Calendar, Package, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function ManageSamplePage({
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

  // Fetch sample request data
  const { data: sample, error: sampleError } = await supabase
    .from("sample_requests")
    .select("*, products(name, image)")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (sampleError || !sample) {
    console.error("Error fetching sample request:", sampleError);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/factory-dashboard?tab=samples"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sample Requests
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sample Request Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Sample Request #{sample.id.substring(0, 8)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Requested on{" "}
                      {new Date(sample.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
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
                  className="text-sm py-1 px-3"
                >
                  {sample.status}
                </Badge>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4">Product Details</h2>
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{sample.products?.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      Sample Quantity: {sample.quantity}
                    </div>
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
                      <div className="font-medium">{sample.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {sample.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sample.phone}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sample.company}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Shipping Address</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {sample.shipping_address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {sample.notes && (
                <div className="border-t border-border mt-6 pt-6">
                  <h2 className="text-lg font-semibold mb-2">Request Notes</h2>
                  <p className="text-muted-foreground">{sample.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Update Sample Status Form */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">
                Update Sample Request Status
              </h2>
              <form action={updateSampleStatus} className="space-y-4">
                <input type="hidden" name="sample_id" value={sample.id} />

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={sample.status}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_delivery">
                    Estimated Delivery Date
                  </Label>
                  <Input
                    id="estimated_delivery"
                    name="estimated_delivery"
                    type="date"
                    defaultValue={
                      sample.estimated_delivery
                        ? new Date(sample.estimated_delivery)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes to Customer</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={sample.factory_notes || ""}
                    placeholder="Add any notes about the sample status, shipping details, etc."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Update Sample Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
