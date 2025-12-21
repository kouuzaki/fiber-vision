import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/databases/db";
import { dashboardLayout } from "@/databases/schemas/dashboard-schema";
import { eq } from "drizzle-orm";
import { nanoid } from "@/lib/nanoid";
import type { WidgetConfig } from "@/types/widget-types";

/**
 * GET /api/dashboard/layout
 * Get current user's dashboard layout
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db
      .select()
      .from(dashboardLayout)
      .where(eq(dashboardLayout.userId, session.user.id))
      .limit(1);

    if (result.length === 0) {
      return NextResponse.json({ layout: [], version: 1 });
    }

    return NextResponse.json({
      layout: result[0].layout,
      version: result[0].version,
      updatedAt: result[0].updatedAt,
    });
  } catch (error) {
    console.error("Failed to get dashboard layout:", error);
    return NextResponse.json(
      { error: "Failed to get layout" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/dashboard/layout
 * Save/update current user's dashboard layout
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const layout: WidgetConfig[] = body.layout || [];

    // Check if layout exists
    const existing = await db
      .select()
      .from(dashboardLayout)
      .where(eq(dashboardLayout.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(dashboardLayout)
        .set({
          layout,
          version: existing[0].version + 1,
          updatedAt: new Date(),
        })
        .where(eq(dashboardLayout.id, existing[0].id));

      return NextResponse.json({
        success: true,
        version: existing[0].version + 1,
      });
    } else {
      // Create new
      const id = nanoid();
      await db.insert(dashboardLayout).values({
        id,
        userId: session.user.id,
        layout,
        version: 1,
      });

      return NextResponse.json({
        success: true,
        version: 1,
      });
    }
  } catch (error) {
    console.error("Failed to save dashboard layout:", error);
    return NextResponse.json(
      { error: "Failed to save layout" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/layout
 * Clear current user's dashboard layout
 */
export async function DELETE() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db
      .delete(dashboardLayout)
      .where(eq(dashboardLayout.userId, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete dashboard layout:", error);
    return NextResponse.json(
      { error: "Failed to delete layout" },
      { status: 500 }
    );
  }
}
