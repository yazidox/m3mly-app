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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, UserPlus, Mail, UserX, UserCheck, Shield } from "lucide-react";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function TeamSettingsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/settings/team");
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

  // Mock team members data
  const teamMembers = [
    {
      id: "1",
      name: userData.full_name,
      email: userData.email,
      role: "Owner",
      status: "active",
      avatar: null,
      joined: new Date().toISOString(),
    },
  ];

  // Mock pending invitations
  const pendingInvitations: any[] = [];

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your factory team members and permissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Team Members</span>
                  </CardTitle>
                  <CardDescription>
                    Manage your factory team members and their roles
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Member</span>
                </Button>
              </CardHeader>
              <CardContent>
                {teamMembers.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Name</th>
                          <th className="text-left p-3 font-medium">Email</th>
                          <th className="text-left p-3 font-medium">Role</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-right p-3 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {teamMembers.map((member) => (
                          <tr key={member.id}>
                            <td className="p-3 font-medium">{member.name}</td>
                            <td className="p-3">{member.email}</td>
                            <td className="p-3">
                              <Badge variant="secondary">{member.role}</Badge>
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className="text-green-600 bg-green-50"
                              >
                                {member.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              {member.role === "Owner" ? (
                                <Button variant="ghost" size="sm" disabled>
                                  Owner
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm">
                                  Manage
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      No team members found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Pending Invitations</span>
                </CardTitle>
                <CardDescription>
                  Track and manage pending team invitations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInvitations.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-3 font-medium">Email</th>
                          <th className="text-left p-3 font-medium">Role</th>
                          <th className="text-left p-3 font-medium">
                            Invited On
                          </th>
                          <th className="text-right p-3 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pendingInvitations.map((invitation, index) => (
                          <tr key={index}>
                            <td className="p-3">example@email.com</td>
                            <td className="p-3">
                              <Badge variant="secondary">Editor</Badge>
                            </td>
                            <td className="p-3">
                              {new Date().toLocaleDateString()}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600"
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">
                      No pending invitations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  <span>Invite New Member</span>
                </CardTitle>
                <CardDescription>
                  Add new members to your factory team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="colleague@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      name="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue="editor"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Input
                      id="message"
                      name="message"
                      placeholder="Join our factory team!"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Invitation
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Role Permissions</span>
                </CardTitle>
                <CardDescription>
                  Learn about team roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Owner</Badge>
                    <span className="text-sm font-medium">Full Access</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage all aspects of the factory, including billing,
                    team members, and settings.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Admin</Badge>
                    <span className="text-sm font-medium">
                      Administrative Access
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can manage orders, products, and team members, but cannot
                    access billing or delete the account.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Editor</Badge>
                    <span className="text-sm font-medium">
                      Content Management
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can create and edit products, manage orders, and update
                    factory information.
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Viewer</Badge>
                    <span className="text-sm font-medium">
                      Read-Only Access
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Can view orders, products, and factory information, but
                    cannot make changes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
