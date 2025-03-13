import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  DollarSign,
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import { formatCurrency } from "@/lib/formatters";

export default async function BillingSettingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/settings/billing");
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

  // Mock subscription data
  const subscription = {
    plan: "Free",
    status: "active",
    nextBillingDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    amount: 0,
  };

  // Mock payment methods
  const paymentMethods = [];

  // Mock billing history
  const billingHistory = [
    {
      id: "INV-001",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 0,
      status: "paid",
      description: "Free Plan - Monthly",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription plan and payment methods
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  <span>Current Plan</span>
                </CardTitle>
                <CardDescription>
                  Your current subscription plan and details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {subscription.plan} Plan
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="text-green-600 bg-green-50"
                      >
                        {subscription.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Next billing:{" "}
                        {new Date(
                          subscription.nextBillingDate,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {formatCurrency(subscription.amount)}/mo
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-medium mb-1">Products</div>
                    <div className="text-2xl font-bold">10</div>
                    <div className="text-sm text-muted-foreground">
                      Max products
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-medium mb-1">Storage</div>
                    <div className="text-2xl font-bold">1 GB</div>
                    <div className="text-sm text-muted-foreground">
                      Storage space
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="font-medium mb-1">Support</div>
                    <div className="text-2xl font-bold">Email</div>
                    <div className="text-sm text-muted-foreground">
                      Support level
                    </div>
                  </div>
                </div>

                <Button className="w-full md:w-auto">Upgrade Plan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Billing History</span>
                </CardTitle>
                <CardDescription>
                  Your recent billing history and invoices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {billingHistory.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Invoice</th>
                          <th className="text-left p-3 font-medium">Date</th>
                          <th className="text-left p-3 font-medium">Amount</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {billingHistory.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="p-3">{invoice.id}</td>
                            <td className="p-3">
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td className="p-3">
                              {formatCurrency(invoice.amount)}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={
                                  invoice.status === "paid"
                                    ? "text-green-600 bg-green-50"
                                    : ""
                                }
                              >
                                {invoice.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      No billing history available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Methods & Plan Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Payment Methods</span>
                </CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((method, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-md"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <div className="font-medium">
                              •••• •••• •••• 4242
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Expires 12/25
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border rounded-md bg-muted/20 mb-4">
                    <p className="text-muted-foreground mb-4">
                      No payment methods added
                    </p>
                    <Button variant="outline" className="mx-auto">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Available Plans</span>
                </CardTitle>
                <CardDescription>
                  Compare and select subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="border rounded-md p-4 bg-muted/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Free</h3>
                          <p className="text-sm text-muted-foreground">
                            For small factories
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          Current Plan
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {formatCurrency(0)}/mo
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Up to 10 products</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>1 GB storage</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            No API access
                          </span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Pro</h3>
                          <p className="text-sm text-muted-foreground">
                            For growing factories
                          </p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {formatCurrency(29)}/mo
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Unlimited products</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>10 GB storage</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>API access</span>
                        </li>
                      </ul>
                      <Button className="w-full">Upgrade to Pro</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="yearly" className="space-y-4">
                    <div className="border rounded-md p-4 bg-muted/10">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Free</h3>
                          <p className="text-sm text-muted-foreground">
                            For small factories
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          Current Plan
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {formatCurrency(0)}/year
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Up to 10 products</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>1 GB storage</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Email support</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            No API access
                          </span>
                        </li>
                      </ul>
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    </div>

                    <div className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold">Pro</h3>
                          <p className="text-sm text-muted-foreground">
                            For growing factories
                          </p>
                        </div>
                        <Badge variant="secondary">Save 20%</Badge>
                      </div>
                      <div className="text-2xl font-bold mb-2">
                        {formatCurrency(279)}/year
                      </div>
                      <ul className="space-y-2 mb-4">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Unlimited products</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>10 GB storage</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>API access</span>
                        </li>
                      </ul>
                      <Button className="w-full">Upgrade to Pro</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
