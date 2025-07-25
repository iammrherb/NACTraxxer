import { sql } from "@/lib/database"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { siteIds, updates } = await req.json()

    if (!Array.isArray(siteIds) || siteIds.length === 0 || !updates || typeof updates !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    // A transaction is crucial for bulk operations
    const updatedSites = await sql.begin(async (sql) => {
      const promises = siteIds.map((id) => sql`UPDATE sites SET ${sql(updates)} WHERE id = ${id} RETURNING *`)
      const results = await Promise.all(promises)
      return results.map((res) => res[0])
    })

    return NextResponse.json({
      message: `${updatedSites.length} sites updated successfully.`,
      data: updatedSites,
    })
  } catch (error: any) {
    console.error("Bulk update failed:", error)
    return NextResponse.json({ error: "Failed to perform bulk update.", details: error.message }, { status: 500 })
  }
}
