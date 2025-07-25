import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

async function getSiteOverview(siteId: string) {
  const supabase = createClient()
  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error) {
    console.error("Error fetching site overview:", error)
    notFound()
  }

  // In a real app, you'd calculate more stats here
  return { site }
}

export default async function SiteOverviewPage({ params }: { params: { siteId: string } }) {
  const { site } = await getSiteOverview(params.siteId)

  const details = [
    { label: "Status", value: site.status },
    { label: "Priority", value: site.priority },
    { label: "Phase", value: site.phase },
    { label: "Users", value: site.users_count?.toLocaleString() },
    { label: "Deployment Type", value: site.deployment_type },
    { label: "Planned Start", value: site.planned_start ? new Date(site.planned_start).toLocaleDateString() : "N/A" },
    { label: "Planned End", value: site.planned_end ? new Date(site.planned_end).toLocaleDateString() : "N/A" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-base font-medium text-blue-700 dark:text-white">Completion</span>
            <span className="text-sm font-medium text-blue-700 dark:text-white">{site.completion_percent}%</span>
          </div>
          <Progress value={site.completion_percent} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {details.map((detail) => (
            <div key={detail.label} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">{detail.label}</p>
              <p className="text-lg font-semibold">{detail.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
