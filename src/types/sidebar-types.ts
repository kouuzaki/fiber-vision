import type { LucideIcon } from "lucide-react";

/**
 * Available user roles for access control
 */
export type UserRole = "admin" | "user" | "manager" | "viewer";

/**
 * Sidebar navigation sub-item configuration
 */
export interface SidebarNavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  /** Roles allowed to see this item. If empty/undefined, accessible to all */
  roles?: UserRole[];
}

/**
 * Sidebar navigation item configuration
 */
export interface SidebarNavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  /** Roles allowed to see this item. If empty/undefined, accessible to all */
  roles?: UserRole[];
  /** Sub-items for collapsible navigation */
  items?: SidebarNavSubItem[];
}

/**
 * Sidebar navigation group configuration
 */
export interface SidebarNavGroup {
  label: string;
  items: SidebarNavItem[];
  /** Roles allowed to see this group. If empty/undefined, accessible to all */
  roles?: UserRole[];
  /** Hide group label when sidebar is collapsed to icon mode */
  hideOnCollapse?: boolean;
}

/**
 * User data for sidebar footer
 */
export interface SidebarUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: UserRole;
}

/**
 * Team/Organization data for sidebar header
 */
export interface SidebarTeam {
  name: string;
  logo?: string;
  plan?: string;
}

/**
 * Breadcrumb item configuration
 */
export interface BreadcrumbItemConfig {
  label: string;
  href?: string;
  icon?: LucideIcon;
}
