import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/settings");
  }

  // Fetch user data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <span>Notification Settings</span>
            </CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_orders">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your order status changes
                    </p>
                  </div>
                  <Switch id="email_orders" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_samples">Sample Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your sample request updates
                    </p>
                  </div>
                  <Switch id="email_samples" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_invoices">Invoices & Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about invoices and payment confirmations
                    </p>
                  </div>
                  <Switch id="email_invoices" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_marketing">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional emails and special offers
                    </p>
                  </div>
                  <Switch id="email_marketing" />
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-medium">SMS Notifications</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_orders">Order Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages about your order status changes
                    </p>
                  </div>
                  <Switch id="sms_orders" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms_delivery">Delivery Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages about your delivery status
                    </p>
                  </div>
                  <Switch id="sms_delivery" />
                </div>
              </div>

              <Button className="mt-4">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>

        {/* Language & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>Language & Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize your language and display preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Language</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🇺🇸</span> English
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🇫🇷</span> Français
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🇲🇦</span> العربية
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <span className="mr-2">🇪🇸</span> Español
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    <Sun className="mr-2 h-4 w-4" /> Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Moon className="mr-2 h-4 w-4" /> Dark
                  </Button>
                </div>
              </div>

              <Button className="mt-4">Save Preferences</Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Privacy Settings</span>
            </CardTitle>
            <CardDescription>
              Control your data and privacy preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data_collection">Data Collection</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow us to collect usage data to improve our services
                  </p>
                </div>
                <Switch id="data_collection" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="personalized_ads">
                    Personalized Recommendations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive personalized product recommendations
                  </p>
                </div>
                <Switch id="personalized_ads" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="third_party_sharing">
                    Third-Party Sharing
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing your data with trusted third parties
                  </p>
                </div>
                <Switch id="third_party_sharing" />
              </div>

              <Button className="mt-4">Save Privacy Settings</Button>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
            <CardDescription>
              Permanent actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-red-200 rounded-md p-4 bg-red-50">
                <h3 className="text-lg font-medium text-red-600 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-red-600 mb-4">
                  This action is irreversible. All your data will be permanently
                  deleted.
                </p>
                <Button
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </Button>
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <h3 className="text-lg font-medium mb-2">Download Your Data</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a copy of your personal data and order history.
                </p>
                <Button variant="outline">Request Data Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
