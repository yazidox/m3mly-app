import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber } from "@/lib/formatters";
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
  FileText,
} from "lucide-react";
import Image from "next/image";
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

  // Fetch products for this factory
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("*")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Error fetching products:", productsError);
  }

  // Fetch invoices for this factory
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("factory_id", factoryId)
    .order("created_at", { ascending: false });

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
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
  const unpaidInvoices =
    invoices?.filter((invoice) => invoice.status === "unpaid").length || 0;

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
            {searchParams.message === "product_created" && (
              <p>Product created successfully</p>
            )}
            {searchParams.message === "product_updated" && (
              <p>Product updated successfully</p>
            )}
            {searchParams.message === "product_deleted" && (
              <p>Product deleted successfully</p>
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
                    {totalRevenue
                      ? formatCurrency(totalRevenue)
                      : formatCurrency(0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From all orders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unpaid Invoices
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{unpaidInvoices}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Awaiting payment
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <Link href="/factory-dashboard?tab=orders">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Invoices</CardTitle>
                  <Link href="/factory-dashboard/invoices">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {invoices && invoices.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.slice(0, 5).map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">
                              {invoice.invoice_number}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(Number(invoice.amount))}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  invoice.status === "paid"
                                    ? "success"
                                    : invoice.status === "overdue"
                                      ? "destructive"
                                      : "outline"
                                }
                              >
                                {invoice.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(
                                invoice.created_at,
                              ).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No invoices yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Sample Requests</CardTitle>
                  <Link href="/factory-dashboard?tab=samples">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-lg">Recent Products</CardTitle>
                  <Link href="/factory-dashboard/products">
                    <Button variant="ghost" size="sm">
                      Manage Products
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {products && products.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.slice(0, 5).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(product.price)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "active"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {product.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No products yet
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
                            {formatCurrency(Number(order.total_price))}
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
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Your Products</CardTitle>
                <Link href="/factory-dashboard/products/new">
                  <Button className="w-full sm:w-auto">
                    <Package className="h-4 w-4 mr-2" /> Add New Product
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {products && products.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Min Order</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            {product.image && (
                              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.min_order_quantity}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.status === "active"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/factory-dashboard/products/${product.id}`}
                            >
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
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
                      No Products Yet
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      You haven't added any products to your catalog yet. Add
                      your first product to start receiving orders.
                    </p>
                    <Link href="/factory-dashboard/products/new">
                      <Button>Add Your First Product</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
