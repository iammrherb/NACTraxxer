import { createClient } from "@/lib/supabase/server"
import { EditSiteForm } from "@/components/edit-site-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

async function getSiteData(siteId: string, projectId: string) {
  const supabase = createClient()

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .eq("project_id", projectId)
    .single()

  if (siteError || !site) {
    notFound()
  }

  const { data: projectManagers, error: managersError } = await supabase
    .from("users")
    .select("id, name, email")
    .order("name")

  if (managersError) {
    console.error("Error fetching project managers:", managersError)
  }

  return {
    site,
    projectManagers: projectManagers || [],
  }
}

export default async function EditSitePage({
  params,
}: {
  params: { projectId: string; siteId: string }
}) {
  const { site, projectManagers } = await getSiteData(params.siteId, params.projectId)

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Site</CardTitle>
          <CardDescription>Update the details for {site.name}.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditSiteForm site={site} projectId={params.projectId} projectManagers={projectManagers} />
        </CardContent>
      </Card>
    </div>
  )
}
