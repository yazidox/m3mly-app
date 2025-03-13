import { createClient } from "../../../supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Package, Users, Activity } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch counts for dashboard
  const { count: factoriesCount } = await supabase
    .from("factories")
    .select("*", { count: "exact", head: true });

  const { count: pendingFactoriesCount } = await supabase
    .from("factories")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: productsCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const { count: usersCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage factories, products, and users
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Factories
            </CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{factoriesCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingFactoriesCount || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all factories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Platform Activity
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">
              System status normal
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
