"use server";

import { db } from "@/databases/db";
import { verification } from "@/databases/schemas/auth-schema";
import { eq, and, gt } from "drizzle-orm";

export async function verifyResetToken(token: string): Promise<boolean> {
  try {
    // Better Auth stores identifier as "reset-password:{token}"
    const identifier = `reset-password:${token}`;

    const record = await db
      .select({ id: verification.id })
      .from(verification)
      .where(
        and(
          eq(verification.identifier, identifier),
          gt(verification.expiresAt, new Date())
        )
      )
      .limit(1);

    return record.length > 0;
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
}
