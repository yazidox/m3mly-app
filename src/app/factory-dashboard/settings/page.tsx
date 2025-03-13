import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Factory,
  User,
  Bell,
  Shield,
  Globe,
  Mail,
  Palette,
} from "lucide-react";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import { updateFactorySettings } from "@/components/actions/factory-settings";

export default async function FactorySettingsPage({
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
    return redirect("/sign-in?redirect_to=/factory-dashboard/settings");
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

  const factory = userData.factories;

  // Get active tab from URL or default to "profile"
  const activeTab = searchParams.tab || "profile";

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={factory} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Factory Settings</h1>
          <p className="text-muted-foreground">
            Manage your factory profile and account settings
          </p>
        </div>

        {searchParams.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {searchParams.message === "settings_updated" && (
              <p>Settings updated successfully</p>
            )}
          </div>
        )}

        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Factory className="h-4 w-4" />
              <span>Factory Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Factory Profile</CardTitle>
                <CardDescription>
                  Update your factory's information and public profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateFactorySettings} className="space-y-6">
                  <input type="hidden" name="factory_id" value={factory.id} />
                  <input type="hidden" name="action_type" value="profile" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="min_order_quantity">
                        Minimum Order Quantity
                      </Label>
                      <Input
                        id="min_order_quantity"
                        name="min_order_quantity"
                        type="number"
                        defaultValue={factory.min_order_quantity}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lead_time">Lead Time</Label>
                      <Input
                        id="lead_time"
                        name="lead_time"
                        defaultValue={factory.lead_time}
                        required
                      />
                    </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="specialties">
                      Specialties (comma separated)
                    </Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      defaultValue={
                        factory.specialties
                          ? factory.specialties.join(", ")
                          : ""
                      }
                      required
                    />
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
                    <Label htmlFor="image">Profile Image URL</Label>
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

                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account information and password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateFactorySettings} className="space-y-6">
                  <input type="hidden" name="user_id" value={user.id} />
                  <input type="hidden" name="action_type" value="account" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={userData.full_name}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={userData.email}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      defaultValue={userData.phone || ""}
                    />
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current_password">
                          Current Password
                        </Label>
                        <Input
                          id="current_password"
                          name="current_password"
                          type="password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new_password">New Password</Label>
                        <Input
                          id="new_password"
                          name="new_password"
                          type="password"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm_password">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirm_password"
                          name="confirm_password"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateFactorySettings} className="space-y-6">
                  <input type="hidden" name="user_id" value={user.id} />
                  <input
                    type="hidden"
                    name="action_type"
                    value="notifications"
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notify_new_orders">New Orders</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive an email when a new order is placed
                          </p>
                        </div>
                        <Switch
                          id="notify_new_orders"
                          name="notify_new_orders"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notify_sample_requests">
                            Sample Requests
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive an email when a new sample is requested
                          </p>
                        </div>
                        <Switch
                          id="notify_sample_requests"
                          name="notify_sample_requests"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notify_payments">
                            Payment Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive an email when a payment is made
                          </p>
                        </div>
                        <Switch
                          id="notify_payments"
                          name="notify_payments"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="notify_marketing">
                            Marketing Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive occasional updates about platform features
                            and promotions
                          </p>
                        </div>
                        <Switch id="notify_marketing" name="notify_marketing" />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-lg font-medium">SMS Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms_new_orders">New Orders</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a text message when a new order is placed
                          </p>
                        </div>
                        <Switch id="sms_new_orders" name="sms_new_orders" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms_payments">
                            Payment Notifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a text message when a payment is made
                          </p>
                        </div>
                        <Switch id="sms_payments" name="sms_payments" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize how your factory profile appears to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={updateFactorySettings} className="space-y-6">
                  <input type="hidden" name="factory_id" value={factory.id} />
                  <input type="hidden" name="action_type" value="appearance" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Profile Display</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show_rating">Show Rating</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your factory rating on your public profile
                          </p>
                        </div>
                        <Switch
                          id="show_rating"
                          name="show_rating"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show_certifications">
                            Show Certifications
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Display your certifications on your public profile
                          </p>
                        </div>
                        <Switch
                          id="show_certifications"
                          name="show_certifications"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show_capacity">
                            Show Production Capacity
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Display your production capacity on your public
                            profile
                          </p>
                        </div>
                        <Switch
                          id="show_capacity"
                          name="show_capacity"
                          defaultChecked
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show_email">Show Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your email address on your public profile
                          </p>
                        </div>
                        <Switch
                          id="show_email"
                          name="show_email"
                          defaultChecked
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show_phone">Show Phone Number</Label>
                          <p className="text-sm text-muted-foreground">
                            Display your phone number on your public profile
                          </p>
                        </div>
                        <Switch id="show_phone" name="show_phone" />
                      </div>
                    </div>
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
