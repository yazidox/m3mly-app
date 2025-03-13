import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, LockKeyhole } from "lucide-react";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import { updateSecuritySettings } from "@/components/actions/factory-settings";

export default async function SecuritySettingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect(
      "/sign-in?redirect_to=/factory-dashboard/settings/security",
    );
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

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage your account security and privacy settings
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-primary" />
                <span>Password & Authentication</span>
              </CardTitle>
              <CardDescription>
                Manage your password and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password</Label>
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

                <Button type="submit">Update Password</Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by enabling
                  two-factor authentication.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Enable Two-Factor Authentication</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <span>API Keys</span>
              </CardTitle>
              <CardDescription>
                Manage API keys for integrating with external systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  API keys allow you to integrate your factory dashboard with
                  external systems and applications.
                </p>
                <Button variant="outline">Generate New API Key</Button>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Your API Keys</h4>
                  <div className="text-center py-8 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      No API keys generated yet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Privacy Settings</span>
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
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
                  <Switch
                    id="data_collection"
                    name="data_collection"
                    defaultChecked
                  />
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
                  <Switch id="third_party_sharing" name="third_party_sharing" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing_emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing emails about our products and services
                    </p>
                  </div>
                  <Switch
                    id="marketing_emails"
                    name="marketing_emails"
                    defaultChecked
                  />
                </div>
              </div>

              <Button className="mt-6">Save Privacy Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
