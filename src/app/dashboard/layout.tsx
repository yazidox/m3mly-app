import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard-sidebar";
import { getLocale } from "@/lib/i18n/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard");
  }

  // Check if user is a factory owner - if so, redirect to factory dashboard
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userData && userData.role === "factory_owner") {
    return redirect("/factory-dashboard");
  }

  const locale = getLocale();
  const isRtl = locale === "ar";

  return (
    <div
      className="flex min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <DashboardSidebar />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
