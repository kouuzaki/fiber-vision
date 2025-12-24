import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Custom permission statements for Fiber Vision
 * Defines all resources and their available actions
 */
export const statement = {
  ...defaultStatements,
  dashboard: ["view", "customize"],
  analytics: ["view", "export"],
  reports: ["view", "create", "export"],
  settings: ["view", "edit"],
} as const;

/**
 * Access Control instance
 */
export const ac = createAccessControl(statement);

/**
 * Admin Role - Full access to all features including user management
 */
export const adminRole = ac.newRole({
  dashboard: ["view", "customize"],
  analytics: ["view", "export"],
  reports: ["view", "create", "export"],
  settings: ["view", "edit"],
  ...adminAc.statements, // Include default admin permissions (user management, etc.)
});

/**
 * Manager Role - Access to analytics, reports, and view settings
 */
export const managerRole = ac.newRole({
  dashboard: ["view", "customize"],
  analytics: ["view", "export"],
  reports: ["view", "create", "export"],
  settings: ["view"],
});

/**
 * Operator Role - Basic operational access
 */
export const operatorRole = ac.newRole({
  dashboard: ["view"],
  analytics: ["view"],
  reports: ["view"],
});

/**
 * User Role - Default role for new users, minimal access
 */
export const userRole = ac.newRole({
  dashboard: ["view"],
});

/**
 * All roles configuration for easy import
 */
export const roles = {
  admin: adminRole,
  manager: managerRole,
  operator: operatorRole,
  user: userRole,
};

/**
 * Role type for TypeScript
 */
export type RoleType = keyof typeof roles;

/**
 * Role display names
 */
export const roleDisplayNames: Record<RoleType, string> = {
  admin: "Administrator",
  manager: "Manager",
  operator: "Operator",
  user: "User",
};
