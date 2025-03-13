import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateFactory } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

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
          </div>

          <Button type="submit" className="w-full">
            Update Factory
          </Button>
        </form>
      </div>
    </div>
  );
}
