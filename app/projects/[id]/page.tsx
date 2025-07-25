import { createClient } from "@/lib/supabase/server"
import ProgressDashboard from "@/components/progress-dashboard"
import { SiteTable } from "@/components/site-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Site, SiteStats, Project, LibraryData } from "@/lib/database"
import { notFound } from "next/navigation"

async function getProjectData(
  projectId: string,
): Promise<{ project: Project; sites: Site[]; stats: SiteStats; libraryData: LibraryData }> {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (projectError || !project) {
    console.error("Error fetching project:", projectError)
    notFound()
  }

  const { data: sitesData, error: sitesError } = await supabase
    .from("sites")
    .select("*, project_manager:project_manager_id(name)")
    .eq("project_id", projectId)

  if (sitesError) {
    console.error("Error fetching sites:", sitesError)
  }
  const sites = (sitesData as Site[]) || []

  // Calculate stats on the server
  const total_sites = sites.length
  const completed_sites = sites.filter((s) => s.status === "Complete").length
  const in_progress_sites = sites.filter((s) => s.status === "In Progress").length
  const planned_sites = sites.filter((s) => s.status === "Planned").length
  const delayed_sites = sites.filter((s) => s.status === "Delayed").length
  const total_users = sites.reduce((acc, site) => acc + (site.users_count || 0), 0)
  const overall_completion = total_sites > 0 ? Math.round((completed_sites / total_sites) * 100) : 0

  const checklistItems = sites.flatMap((s) => s.checklist_items || [])
  const total_checklist_items = checklistItems.length
  const completed_checklist_items = checklistItems.filter((item: any) => item.completed).length
  const checklist_completion =
    total_checklist_items > 0 ? Math.round((completed_checklist_items / total_checklist_items) * 100) : 0

  const stats: SiteStats = {
    total_sites,
    completed_sites,
    in_progress_sites,
    planned_sites,
    delayed_sites,
    total_users,
    overall_completion,
    total_checklist_items,
    completed_checklist_items,
    checklist_completion,
    sites: sites,
  }

  // Fetch library data for forms
  const [
    { data: users },
    { data: wiredVendors },
    { data: wirelessVendors },
    { data: firewallVendors },
    { data: vpnVendors },
    { data: edrXdrVendors },
    { data: siemVendors },
    { data: deviceTypes },
    { data: checklistItemsLib },
    { data: useCases },
    { data: testMatrix },
  ] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("vendors").select("*").eq("type", "wired"),
    supabase.from("vendors").select("*").eq("type", "wireless"),
    supabase.from("base_vendors").select("*").eq("category", "Firewall"),
    supabase.from("base_vendors").select("*").eq("category", "VPN"),
    supabase.from("base_vendors").select("*").eq("category", "EDR/XDR"),
    supabase.from("base_vendors").select("*").eq("category", "SIEM/SOAR/MDR"),
    supabase.from("device_types").select("*"),
    supabase.from("checklist_items").select("*"),
    supabase.from("use_cases").select("*"),
    supabase.from("test_matrix").select("*"),
  ])

  const libraryData: LibraryData = {
    users: users || [],
    wiredVendors: wiredVendors || [],
    wirelessVendors: wirelessVendors || [],
    firewallVendors: firewallVendors || [],
    vpnVendors: vpnVendors || [],
    edrXdrVendors: edrXdrVendors || [],
    siemVendors: siemVendors || [],
    deviceTypes: deviceTypes || [],
    checklistItems: checklistItemsLib || [],
    useCases: useCases || [],
    testMatrix: testMatrix || [],
  }

  return { project, sites, stats, libraryData }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { project, sites, stats, libraryData } = await getProjectData(params.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.name}</CardTitle>
          <CardDescription>{project.description || "No description provided."}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Customer: {project.customer_name}</div>
        </CardContent>
      </Card>

      <ProgressDashboard stats={stats} />

      <SiteTable initialSites={sites} projectId={project.id} libraryData={libraryData} />
    </div>
  )
}
