import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { SidebarLayout } from "@/components/layouts/sidebar-layouts";
import type { SidebarUser } from "@/types/sidebar-types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Map session user to sidebar user format
  const sidebarUser: SidebarUser = {
    id: session?.user?.id || "",
    name: session?.user?.name || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || "",
    avatar: session?.user?.image || undefined,
    // role can be added when available in user schema
    // role: session.user.role as UserRole,
  };

  return (
    <>
      <SidebarLayout
        user={sidebarUser}
        // userRole can be passed when role is available
        // userRole={'admin'}
      >
        {children}
      </SidebarLayout>
    </>
  );
}
