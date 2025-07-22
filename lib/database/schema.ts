import { pgTable, text, serial, timestamp, integer, varchar, jsonb } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  role: text("role"),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const sites = pgTable("sites", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: text("name").notNull(),
  customer: text("customer"),
  region: text("region"),
  country: text("country"),
  status: text("status"),
  projectManager: text("project_manager"),
  technicalOwners: jsonb("technical_owners").default([]),
  wiredVendors: jsonb("wired_vendors").default([]),
  wirelessVendors: jsonb("wireless_vendors").default([]),
  deviceTypes: jsonb("device_types").default([]),
  radsec: text("radsec"),
  plannedStart: text("planned_start"),
  plannedEnd: text("planned_end"),
  completionPercent: integer("completion_percent").default(0),
})
