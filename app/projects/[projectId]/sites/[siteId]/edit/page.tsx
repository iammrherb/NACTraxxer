import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditSiteForm } from "@/components/edit-site-form"
import type { Site } from "@/types"

interface EditSitePageProps {
  params: {
    projectId: string
    siteId: string
  }
}

async function getSite(siteId: string): Promise<Site | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error) {
    console.error("Error fetching site:", error)
    return null
  }

  return data
}

export default async function EditSitePage({ params }: EditSitePageProps) {
  const site = await getSite(params.siteId)

  if (!site) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Site: {site.name}</h1>
        <p className="text-muted-foreground">Update the site details below.</p>
      </div>

      <EditSiteForm site={site} projectId={params.projectId} />
    </div>
  )
}
