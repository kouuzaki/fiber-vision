import {
  LayoutDashboardIcon,
  Settings2Icon,
  UsersIcon,
  ShieldIcon,
  FileTextIcon,
  BarChart3Icon,
  BellIcon,
  type LucideIcon,
} from "lucide-react";
import type { SidebarNavGroup, SidebarTeam } from "@/types/sidebar-types";

/**
 * Default sidebar navigation configuration
 * Role-based filtering is applied at runtime
 */
export const sidebarNavigation: SidebarNavGroup[] = [
  {
    label: "Platform",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
        isActive: true,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3Icon,
        roles: ["admin", "manager"],
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileTextIcon,
        items: [
          {
            title: "Overview",
            url: "/dashboard/reports/overview",
          },
          {
            title: "Detailed",
            url: "/dashboard/reports/detailed",
            roles: ["admin", "manager"],
          },
        ],
      },
    ],
  },
  {
    label: "Management",
    roles: ["admin", "manager"],
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: UsersIcon,
        roles: ["admin"],
        items: [
          {
            title: "All Users",
            url: "/dashboard/users",
          },
          {
            title: "Roles",
            url: "/dashboard/users/roles",
          },
        ],
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings2Icon,
        items: [
          {
            title: "General",
            url: "/dashboard/settings/general",
          },
          {
            title: "Security",
            url: "/dashboard/settings/security",
            icon: ShieldIcon,
            roles: ["admin"],
          },
          {
            title: "Notifications",
            url: "/dashboard/settings/notifications",
            icon: BellIcon,
          },
        ],
      },
    ],
  },
];

/**
 * Default team/organization data
 */
export const defaultTeam: SidebarTeam = {
  name: "Fiber Vision",
  plan: "Enterprise",
};

/**
 * Helper function to filter navigation items by role
 */
export function filterNavByRole(
  navigation: SidebarNavGroup[],
  userRole?: string
): SidebarNavGroup[] {
  if (!userRole) {
    // If no role, show items without role restrictions
    return navigation
      .filter((group) => !group.roles || group.roles.length === 0)
      .map((group) => ({
        ...group,
        items: group.items
          .filter((item) => !item.roles || item.roles.length === 0)
          .map((item) => ({
            ...item,
            items: item.items?.filter(
              (subItem) => !subItem.roles || subItem.roles.length === 0
            ),
          })),
      }));
  }

  return navigation
    .filter((group) => !group.roles || group.roles.includes(userRole as never))
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => !item.roles || item.roles.includes(userRole as never))
        .map((item) => ({
          ...item,
          items: item.items?.filter(
            (subItem) =>
              !subItem.roles || subItem.roles.includes(userRole as never)
          ),
        })),
    }))
    .filter((group) => group.items.length > 0);
}
