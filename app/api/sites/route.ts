import { NextResponse } from "next/server"
import { db } from "@/lib/database"
import { sites, users } from "@/lib/database/schema"

export async function GET() {
  try {
    const allUsers = await db.select().from(users)
    const allSites = await db.select().from(sites)

    const usersById = new Map(allUsers.map((user) => [user.id, user]))

    // Construct the full site object from the minimal data fetched.
    const populatedSites = allSites.map((site) => {
      const projectManager = site.project_manager ? usersById.get(site.project_manager) : null

      return {
        ...site,
        project_manager: projectManager,
        // Provide default empty values for fields no longer in the minimal schema
        // to ensure the frontend doesn't crash.
        technical_owners: [],
        use_case_ids: [],
        deployment_checklist: [],
      }
    })

    return NextResponse.json(populatedSites)
  } catch (error: any) {
    console.error("API_SITES_GET_ERROR:", error)
    return NextResponse.json({ message: `Failed to fetch sites. ${error.message}` }, { status: 500 })
  }
}
