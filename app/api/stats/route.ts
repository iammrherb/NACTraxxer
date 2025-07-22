import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { sites, users } from "@/lib/database/schema"
import { count, sql, eq } from "drizzle-orm"

export async function GET() {
  try {
    const totalSitesPromise = db.select({ value: count() }).from(sites)
    const completedSitesPromise = db.select({ value: count() }).from(sites).where(eq(sites.status, "Completed"))
    const inProgressSitesPromise = db.select({ value: count() }).from(sites).where(eq(sites.status, "In Progress"))
    const plannedSitesPromise = db.select({ value: count() }).from(sites).where(eq(sites.status, "Planning"))
    const delayedSitesPromise = db.select({ value: count() }).from(sites).where(eq(sites.status, "At Risk"))
    const totalUsersPromise = db.select({ value: count() }).from(users)

    // This query is now corrected to use the restored `completion_percent` column.
    const overallCompletionPromise = db
      .select({ value: sql`avg(${sites.completion_percent})`.mapWith(Number) })
      .from(sites)

    const [
      totalSitesResult,
      completedSitesResult,
      inProgressSitesResult,
      plannedSitesResult,
      delayedSitesResult,
      totalUsersResult,
      overallCompletionResult,
    ] = await Promise.all([
      totalSitesPromise,
      completedSitesPromise,
      inProgressSitesPromise,
      plannedSitesPromise,
      delayedSitesPromise,
      totalUsersPromise,
      overallCompletionPromise,
    ])

    const safeValue = (result: { value: number | null }[] | null) => result?.[0]?.value ?? 0

    const stats = {
      total_sites: safeValue(totalSitesResult),
      completed_sites: safeValue(completedSitesResult),
      in_progress_sites: safeValue(inProgressSitesResult),
      planned_sites: safeValue(plannedSitesResult),
      delayed_sites: safeValue(delayedSitesResult),
      total_users: safeValue(totalUsersResult),
      overall_completion: Math.round(safeValue(overallCompletionResult)),
    }

    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("API_STATS_GET_ERROR:", error)
    return NextResponse.json({ details: `Failed to fetch stats: ${error.message}` }, { status: 500 })
  }
}
