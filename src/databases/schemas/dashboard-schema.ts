import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import type { WidgetConfig } from "@/types/widget-types";

/**
 * Dashboard layout table
 * Stores user's widget configuration as JSON
 */
export const dashboardLayout = pgTable(
  "dashboard_layout",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    layout: jsonb("layout").$type<WidgetConfig[]>().notNull().default([]),
    version: integer("version").notNull().default(1),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("dashboard_layout_userId_idx").on(table.userId)]
);

export const dashboardLayoutRelations = relations(dashboardLayout, ({ one }) => ({
  user: one(user, {
    fields: [dashboardLayout.userId],
    references: [user.id],
  }),
}));
