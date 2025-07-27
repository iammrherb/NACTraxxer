import { createClient } from "@/lib/supabase/server"
import { EditSiteForm } from "@/components/edit-site-form"
import { notFound } from "next/navigation"

async function getSite(siteId: string) {
  const supabase = createClient()

  const { data: site, error } = await supabase.from("sites").select("*").eq("id", siteId).single()

  if (error || !site) {
    return null
  }

  return site
}

async function getUsers() {
  const supabase = createClient()

  const { data: users, error } = await supabase.from("users").select("id, name, email").order("name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return users || []
}

export default async function EditSitePage({
  params,
}: {
  params: { projectId: string; siteId: string }
}) {
  const site = await getSite(params.siteId)
  const users = await getUsers()

  if (!site) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Site</h1>
          <p className="text-muted-foreground mt-2">Update the details for "{site.site_name}".</p>
        </div>

        <EditSiteForm site={site} users={users} />
      </div>
    </div>
  )
}
