import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Switch } from "@/components/ui/switch";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !user) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit User</h1>
          <p className="text-muted-foreground">Update user information</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary h-20 w-20 rounded-full flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>

        <form 
          action={async (formData) => {
            console.log("Form submitted with data:", Object.fromEntries(formData.entries()));
            alert("TO BE ADDED");
            // Actual form submission logic would go here
          }} 
          className="space-y-6 max-w-2xl mx-auto"
        >
          <input type="hidden" name="id" value={user.id} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  defaultValue={user.full_name || ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email || ""}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="store_name">Store Name</Label>
                <Input
                  id="store_name"
                  name="store_name"
                  defaultValue={user.store_name || ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={user.phone || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  name="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue={user.role || "user"}
                  required
                >
                  <option value="user">User</option>
                  <option value="factory_owner">Factory Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_approved" className="block mb-2">
                  Account Status
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_approved"
                    name="is_approved"
                    defaultChecked={user.is_approved}
                  />
                  <Label htmlFor="is_approved" className="cursor-pointer">
                    {user.is_approved ? "Approved" : "Pending Approval"}
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={user.address || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cin">CIN (National ID)</Label>
              <Input id="cin" name="cin" defaultValue={user.cin || ""} />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Update User
          </Button>
        </form>
      </div>
    </div>
  );
}
