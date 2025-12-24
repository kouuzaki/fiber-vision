import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { SidebarLayout } from "@/components/layouts/sidebar-layouts";
import type { SidebarUser, UserRole } from "@/types/sidebar-types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Get user role, default to "user" if not set
  const userRole = (session?.user?.role as UserRole) || "user";

  // Map session user to sidebar user format
  const sidebarUser: SidebarUser = {
    id: session?.user?.id || "",
    name: session?.user?.name || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || undefined,
    role: userRole,
  };

  return (
    <>
      <SidebarLayout user={sidebarUser} userRole={userRole}>
        {children}
      </SidebarLayout>
    </>
  );
}
