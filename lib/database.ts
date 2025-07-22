import { drizzle } from "drizzle-orm/neon-http"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"
import * as schema from "@/lib/database/schema"

if (!process.env.DATABASE_URL) {
  throw new Error("FATAL: DATABASE_URL environment variable is not set.")
}

// Export the neon instance for direct use if needed
export const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL)

export const db = drizzle(sql, { schema, logger: true })

/**
 * A utility function to test the database connection.
 * It performs a simple query to ensure the connection is alive.
 */
export async function testDatabaseConnection() {
  try {
    // Perform a simple query that should always succeed on a valid connection.
    await sql`SELECT 1`
    console.log("Database connection successful.")
    return { success: true, message: "Database connection successful." }
  } catch (error) {
    console.error("Database connection failed:", error)
    // In a real app, you might want to throw the error or handle it differently.
    return { success: false, message: "Database connection failed.", error }
  }
}
