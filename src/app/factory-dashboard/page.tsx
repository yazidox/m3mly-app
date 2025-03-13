import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Truck,
  Clock,
  DollarSign,
  Users,
  Edit,
} from "lucide-react";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function FactoryDashboard({
  searchParams,
}: {
  searchParams: { tab?: string; message?: string };
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

  const factoryId = userData.factory_id;

  // Fetch orders for this factory
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, products(name, image)")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  // Fetch sample requests for this factory
  const { data: sampleRequests, error: samplesError } = await supabase
    .from("sample_requests")
    .select("*, products(name, image)")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (samplesError) {
    console.error("Error fetching sample requests:", samplesError);
  }

  // Calculate statistics
  const pendingOrders =
    orders?.filter((order) => order.status === "pending").length || 0;
  const completedOrders =
    orders?.filter((order) => order.status === "completed").length || 0;
  const totalRevenue = orders
    ?.filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total_price), 0);
  const pendingSamples =
    sampleRequests?.filter((sample) => sample.status === "pending").length || 0;

  // Get active tab from URL or default to "overview"
  const activeTab = searchParams.tab || "overview";

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Factory Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your orders, samples, and factory profile
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/factory/${factoryId}`}>
              <Button variant="outline">View Public Profile</Button>
            </Link>
            <Link href="/factory-dashboard/settings">
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

        {searchParams.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {searchParams.message === "order_updated" && (
              <p>Order status updated successfully</p>
            )}
            {searchParams.message === "sample_updated" && (
              <p>Sample request status updated successfully</p>
            )}
          </div>
        )}

        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="samples">Sample Requests</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Awaiting processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Orders
                  </CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Successfully delivered
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${totalRevenue?.toFixed(2) || "0.00"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From all orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sample Requests
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingSamples}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pending samples
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders && orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.slice(0, 5).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">
                              #{order.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>{order.products?.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "success"
                                    : order.status === "processing"
                                      ? "default"
                                      : order.status === "cancelled"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                  {orders && orders.length > 5 && (
                    <div className="mt-4 text-center">
                      <Link href="/factory-dashboard?tab=orders">
                        <Button variant="link" size="sm">
                          View all orders
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Recent Sample Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {sampleRequests && sampleRequests.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleRequests.slice(0, 5).map((sample) => (
                          <TableRow key={sample.id}>
                            <TableCell className="font-medium">
                              #{sample.id.substring(0, 8)}
                            </TableCell>
                            <TableCell>{sample.products?.name}</TableCell>
                            <TableCell>
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
                              >
                                {sample.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(sample.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No sample requests yet
                    </div>
                  )}
                  {sampleRequests && sampleRequests.length > 5 && (
                    <div className="mt-4 text-center">
                      <Link href="/factory-dashboard?tab=samples">
                        <Button variant="link" size="sm">
                          View all sample requests
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders && orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>{order.full_name}</TableCell>
                          <TableCell>{order.products?.name}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>
                            ${Number(order.total_price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "success"
                                  : order.status === "processing"
                                    ? "default"
                                    : order.status === "cancelled"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/orders/${order.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You haven't received any orders yet. When customers place
                      orders for your products, they will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="samples">
            <Card>
              <CardHeader>
                <CardTitle>All Sample Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {sampleRequests && sampleRequests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleRequests.map((sample) => (
                        <TableRow key={sample.id}>
                          <TableCell className="font-medium">
                            #{sample.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>{sample.full_name}</TableCell>
                          <TableCell>{sample.products?.name}</TableCell>
                          <TableCell>{sample.quantity}</TableCell>
                          <TableCell>
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
                            >
                              {sample.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(sample.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/samples/${sample.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Sample Requests Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You haven't received any sample requests yet. When
                      customers request samples of your products, they will
                      appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Products</CardTitle>
                <Link href="/factory-dashboard/products/new">
                  <Button size="sm">Add New Product</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {/* Products table or grid would go here */}
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Manage Your Products
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Add, edit, or remove products from your factory catalog.
                    Customers can browse and order these products.
                  </p>
                  <Link href="/factory-dashboard/products/new">
                    <Button>Add Your First Product</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
