import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { EditSiteForm } from "@/components/edit-site-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getSiteData(siteId: string) {
  const supabase = createClient()

  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error) {
    console.error("Error fetching site:", error)
    return null
  }

  return site
}

async function getProjectManagers() {
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email")
    .eq("role", "Manager")
    .order("name")

  if (error) {
    console.error("Error fetching project managers:", error)
    return []
  }

  return users || []
}

export default async function EditSitePage({ params }: { params: { projectId: string; siteId: string } }) {
  const site = await getSiteData(params.siteId)
  const projectManagers = await getProjectManagers()

  if (!site) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Site Not Found</h1>
          <p className="text-muted-foreground mt-2">The site you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Site</CardTitle>
            <CardDescription>Update the details for "{site.site_name}".</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <EditSiteForm site={site} projectId={params.projectId} projectManagers={projectManagers} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
