"use client";

import { useState, useEffect, useCallback } from "react";
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
import { CheckCircle, Edit, UserCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  // Function to fetch users with useCallback to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${window.location.origin}/api/admin/users`,
        {
          // Add cache: 'no-store' to prevent caching
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        },
      );
      const data = await response.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Échec de la récupération des utilisateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]); // Add toast as a dependency

  // Approve user function
  const approveUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${window.location.origin}/api/admin/users/${userId}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Succès",
          description: "Utilisateur approuvé avec succès",
          variant: "default",
        });

        // Fetch fresh data from the server instead of just updating local state
        await fetchUsers();
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Échec de l'approbation de l'utilisateur",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation de l'utilisateur:", error);
      toast({
        title: "Erreur",
        description: "Échec de l'approbation de l'utilisateur",
        variant: "destructive",
      });
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchUsers();
    }

    // Set up a refresh interval to keep data fresh
    const intervalId = setInterval(() => {
      if (typeof window !== "undefined") {
        fetchUsers();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [fetchUsers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Utilisateurs</h1>
        <p className="text-muted-foreground">Gérer les utilisateurs de la plateforme</p>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  Chargement des utilisateurs...
                </TableCell>
              </TableRow>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="bg-secondary h-9 w-9 rounded-full flex items-center justify-center">
                      <UserCircle className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.full_name || user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                    >
                      {user.role || "utilisateur"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.is_approved ? "success" : "destructive"}
                    >
                      {user.is_approved ? "Approuvé" : "En attente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    {!user.is_approved && (
                      <Button
                        onClick={() => approveUser(user.id)}
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                    )}
                    <Link href={`/admin/users/${user.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
