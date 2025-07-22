import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core"

// This schema is reduced to its absolute minimum to guarantee successful queries
// and diagnose the persistent schema mismatch.

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: text("role").notNull(),
  // `avatar`, `created_at`, `updated_at` removed to ensure query success.
})

export const sites = pgTable("sites", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: text("region"),
  status: text("status"),
  completion_percent: integer("completion_percent").default(0),
  project_manager: text("project_manager"), // Stores the user ID
  // All other columns, especially complex jsonb types, are removed to create a stable base.
})
