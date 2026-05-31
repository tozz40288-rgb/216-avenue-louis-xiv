import { pgTable, text, uuid, numeric, jsonb, timestamp } from "drizzle-orm/pg-core";

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id"),
  status: text("status").notNull().default("pending"),
  customer: jsonb("customer").notNull(),
  items: jsonb("items").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Order = typeof ordersTable.$inferSelect;
