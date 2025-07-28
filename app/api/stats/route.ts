import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient()

    // Get total projects
    const { count: totalProjects, error: projectsError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })

    if (projectsError) {
      console.error("Error fetching projects count:", projectsError)
    }

    // Get total sites
    const { count: totalSites, error: sitesError } = await supabase
      .from("sites")
      .select("*", { count: "exact", head: true })

    if (sitesError) {
      console.error("Error fetching sites count:", sitesError)
    }

    // Get completed sites
    const { count: completedSites, error: completedError } = await supabase
      .from("sites")
      .select("*", { count: "exact", head: true })
      .eq("status", "Complete")

    if (completedError) {
      console.error("Error fetching completed sites:", completedError)
    }

    // Get active projects
    const { count: activeProjects, error: activeError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .in("status", ["Planning", "In Progress"])

    if (activeError) {
      console.error("Error fetching active projects:", activeError)
    }

    return NextResponse.json({
      stats: {
        totalProjects: totalProjects || 0,
        totalSites: totalSites || 0,
        completedSites: completedSites || 0,
        activeProjects: activeProjects || 0,
        completionRate: totalSites ? Math.round(((completedSites || 0) / totalSites) * 100) : 0,
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
