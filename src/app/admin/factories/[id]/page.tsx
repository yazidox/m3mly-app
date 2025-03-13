import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFactory } from "@/app/actions/admin";
import { ArrowLeft, User, Factory as FactoryIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

export default async function EditFactoryPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: factory, error } = await supabase
    .from("factories")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !factory) {
    return notFound();
  }

  // Check if factory already has an owner account
  const { data: existingOwner } = await supabase
    .from("users")
    .select("*")
    .eq("factory_id", factory.id)
    .eq("role", "factory_owner")
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/factories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Factory</h1>
          <p className="text-muted-foreground">Update factory information</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <form action={updateFactory} className="space-y-6 max-w-2xl">
          <input type="hidden" name="id" value={factory.id} />

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Factory Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={factory.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={factory.location}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_quantity">
                  Minimum Order Quantity
                </Label>
                <Input
                  id="min_order_quantity"
                  name="min_order_quantity"
                  type="number"
                  min="1"
                  defaultValue={factory.min_order_quantity}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  defaultValue={factory.rating}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                defaultValue={factory.image}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                name="cover_image"
                type="url"
                defaultValue={factory.cover_image}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={factory.description}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma separated)</Label>
              <Input
                id="specialties"
                name="specialties"
                defaultValue={
                  factory.specialties ? factory.specialties.join(", ") : ""
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead_time">Lead Time</Label>
                <Input
                  id="lead_time"
                  name="lead_time"
                  defaultValue={factory.lead_time}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Production Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  defaultValue={factory.capacity}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">
                Certifications (comma separated)
              </Label>
              <Input
                id="certifications"
                name="certifications"
                defaultValue={
                  factory.certifications
                    ? factory.certifications.join(", ")
                    : ""
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={factory.status}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <Separator className="my-4" />

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <FactoryIcon className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Factory Owner Account</h3>
              </div>

              {existingOwner ? (
                <div className="bg-background p-4 rounded border mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Existing Owner Account</h3>
                  </div>

                  <div className="text-sm mb-4">
                    <p className="flex items-center gap-2 mb-2">
                      <span className="text-muted-foreground">Email:</span>
                      <strong>{existingOwner.email}</strong>
                    </p>
                    <p className="text-muted-foreground">
                      This factory already has an owner account. Check the box
                      below to reset the owner's password.
                    </p>
                  </div>

                  <div className="flex items-start space-x-2 mb-4">
                    <Checkbox id="update_password" name="update_password" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="update_password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Reset password
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Check this box to reset the factory owner's password
                      </p>
                    </div>
                  </div>

                  {/* Password field removed as we're using email reset */}
                  <input
                    type="hidden"
                    name="owner_password"
                    value="reset-via-email"
                  />

                  <input
                    type="hidden"
                    name="owner_id"
                    value={existingOwner.id}
                  />
                  <input
                    type="hidden"
                    name="owner_email"
                    value={existingOwner.email}
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-start space-x-2 mb-4">
                    <Checkbox id="create_owner" name="create_owner" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="create_owner"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Create owner account
                      </label>
                      <p className="text-sm text-muted-foreground">
                        This will create a user with factory owner role who can
                        access the factory dashboard
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="owner_email">Owner Email</Label>
                      <Input
                        id="owner_email"
                        name="owner_email"
                        type="email"
                        placeholder="factory-owner@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="owner_password">Owner Password</Label>
                      <Input
                        id="owner_password"
                        name="owner_password"
                        type="password"
                        placeholder="Minimum 6 characters"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor="owner_name">Owner Full Name</Label>
                    <Input
                      id="owner_name"
                      name="owner_name"
                      type="text"
                      placeholder="Factory Manager Name"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Update Factory
          </Button>
        </form>
      </div>
    </div>
  );
}
