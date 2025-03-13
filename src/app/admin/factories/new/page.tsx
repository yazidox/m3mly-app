import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFactory } from "@/app/actions/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewFactoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/factories">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Factory</h1>
          <p className="text-muted-foreground">Create a new factory profile</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <form action={createFactory} className="space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Factory Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" required />
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
                  defaultValue="4.5"
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
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_image">Cover Image URL</Label>
              <Input
                id="cover_image"
                name="cover_image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Specialties (comma separated)</Label>
              <Input
                id="specialties"
                name="specialties"
                placeholder="T-shirts, Dresses, Activewear"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lead_time">Lead Time</Label>
                <Input
                  id="lead_time"
                  name="lead_time"
                  placeholder="2-3 weeks"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Production Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  placeholder="10,000 units/month"
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
                placeholder="ISO 9001, GOTS Certified, Fair Trade"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Factory
          </Button>
        </form>
      </div>
    </div>
  );
}
