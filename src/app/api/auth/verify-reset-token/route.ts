import { NextRequest, NextResponse } from "next/server";
import { db } from "@/databases/db";
import { verification } from "@/databases/schemas/auth-schema";
import { eq, and, gt } from "drizzle-orm";

/**
 * GET /api/auth/verify-reset-token
 * Verify if a password reset token is valid
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      valid: record.length > 0,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
