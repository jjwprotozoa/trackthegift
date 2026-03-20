import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  plan: text("plan").notNull().default("free"), // free, pro, business
  trackCredits: integer("track_credits").notNull().default(2),
});

// Trackers table
export const trackers = sqliteTable("trackers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  waybill: text("waybill").notNull(),
  carrier: text("carrier").notNull().default("dhl"),
  slug: text("slug").notNull().unique(),
  theme: text("theme").notNull().default("easter"),
  recipientName: text("recipient_name"),
  origin: text("origin"),
  destination: text("destination"),
  status: text("status").notNull().default("created"), // created, in_transit, delivered
  statusMessage: text("status_message"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});

// Subscriptions table
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  plan: text("plan").notNull().default("free"),
  status: text("status").notNull().default("active"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  trackCredits: true,
  plan: true,
});

export const insertTrackerSchema = createInsertSchema(trackers).omit({
  id: true,
  status: true,
  statusMessage: true,
  isActive: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTracker = z.infer<typeof insertTrackerSchema>;
export type Tracker = typeof trackers.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
