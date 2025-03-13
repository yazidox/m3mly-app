import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function SamplesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/samples");
  }

  // Fetch user's sample requests
  const { data: samples, error: samplesError } = await supabase
    .from("sample_requests")
    .select("*, products(name, image), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (samplesError) {
    console.error("Error fetching sample requests:", samplesError);
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Sample Requests</h1>
            <p className="text-muted-foreground">
              Track and manage your product sample requests
            </p>
          </div>
          <Link href="/factories">
            <Button>Browse Factories</Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {samples && samples.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Factory</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {samples.map((sample) => (
                  <TableRow key={sample.id}>
                    <TableCell className="font-medium">
                      #{sample.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{sample.products?.name}</TableCell>
                    <TableCell>{sample.factories?.name}</TableCell>
                    <TableCell>
                      {new Date(sample.created_at).toLocaleDateString()}
                    </TableCell>
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
                    <TableCell className="text-right">
                      <Link href={`/dashboard/samples/${sample.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
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
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't requested any product samples yet. Browse our
                factories and products to request your first sample.
              </p>
              <Link href="/factories">
                <Button>Browse Factories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
