import { createClient } from "../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Edit, Plus } from "lucide-react";
import Link from "next/link";

export default async function FactoriesPage() {
  const supabase = await createClient();

  const { data: factories, error } = await supabase
    .from("factories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching factories:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Usines</h1>
          <p className="text-muted-foreground">Gérer et approuver les usines</p>
        </div>
        <Link href="/admin/factories/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Ajouter une Usine
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Qté Min. Commande</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Créé le</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factories && factories.length > 0 ? (
              factories.map((factory) => (
                <TableRow key={factory.id}>
                  <TableCell className="font-medium">{factory.name}</TableCell>
                  <TableCell>{factory.location}</TableCell>
                  <TableCell>{factory.min_order_quantity}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        factory.status === "approved"
                          ? "success"
                          : factory.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {factory.status === "approved" 
                        ? "approuvé" 
                        : factory.status === "pending" 
                          ? "en attente" 
                          : "rejeté"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(factory.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/factories/${factory.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      {factory.status === "pending" && (
                        <form
                          action={`/api/admin/factories/${factory.id}/approve`}
                          method="POST"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                      {factory.status === "pending" && (
                        <form
                          action={`/api/admin/factories/${factory.id}/reject`}
                          method="POST"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </form>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  Aucune usine trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
