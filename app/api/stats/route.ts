import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET() {
  try {
    const [totalSites, completedSites, inProgressSites, plannedSites, totalProjects] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM sites`,
      sql`SELECT COUNT(*) as count FROM sites WHERE status = 'Complete'`,
      sql`SELECT COUNT(*) as count FROM sites WHERE status = 'In Progress'`,
      sql`SELECT COUNT(*) as count FROM sites WHERE status = 'Planned'`,
      sql`SELECT COUNT(*) as count FROM projects`,
    ])

    const stats = {
      totalSites: Number.parseInt(totalSites[0].count),
      completedSites: Number.parseInt(completedSites[0].count),
      inProgressSites: Number.parseInt(inProgressSites[0].count),
      plannedSites: Number.parseInt(plannedSites[0].count),
      totalProjects: Number.parseInt(totalProjects[0].count),
      completionRate: totalSites[0].count > 0 ? Math.round((completedSites[0].count / totalSites[0].count) * 100) : 0,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
