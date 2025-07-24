import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteList } from "@/components/site-list"
import { Badge } from "@/components/ui/badge"

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  const { data: sites, error: sitesError } = await supabase
    .from("sites")
    .select("*")
    .eq("project_id", params.id)
    .order("created_at", { ascending: true })

  if (sitesError) {
    // Handle error, maybe show a message
    console.error("Error fetching sites:", sitesError)
  }

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">Customer: {project.customer}</p>
        </div>
        <Badge variant="secondary" className="text-lg">
          {project.status}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sites</CardTitle>
          <CardDescription>All sites included in the {project.name} project.</CardDescription>
        </CardHeader>
        <CardContent>
          <SiteList sites={sites || []} />
        </CardContent>
      </Card>
    </div>
  )
}
