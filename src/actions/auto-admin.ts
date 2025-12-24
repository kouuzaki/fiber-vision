"use server";

import { db } from "@/databases/db";
import { user } from "@/databases/schemas/auth-schema";
import { count, eq } from "drizzle-orm";

/**
 * Check if the current user is the first user in the system
 * and should be assigned the admin role
 */
export async function checkAndAssignAdminRole(userId: string): Promise<boolean> {
  try {
    // Count total users
    const result = await db.select({ count: count() }).from(user);
    const userCount = result[0]?.count ?? 0;

    // If this is the first user (count is 1), assign admin role
    if (userCount === 1) {
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.id, userId));
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to check/assign admin role:", error);
    return false;
  }
}

/**
 * Get the total count of users in the system
 */
export async function getUserCount(): Promise<number> {
  try {
    const result = await db.select({ count: count() }).from(user);
    return result[0]?.count ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Check if there are any admin users in the system
 */
export async function hasAdminUser(): Promise<boolean> {
  try {
    const result = await db
      .select({ count: count() })
      .from(user)
      .where(eq(user.role, "admin"));
    return (result[0]?.count ?? 0) > 0;
  } catch {
    return false;
  }
}
