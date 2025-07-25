import { createClient } from "@/lib/supabase/server"
import { SiteChecklist } from "@/components/site-checklist"
import type { SiteChecklistItem, User } from "@/lib/database"

export default async function SiteChecklistPage({ params }: { params: { siteId: string } }) {
  const supabase = createClient()

  const { data: checklistData, error: checklistError } = await supabase.rpc("get_site_checklist_details", {
    p_site_id: params.siteId,
  })

  const { data: usersData, error: usersError } = await supabase.from("users").select("id, name, avatar_url")

  if (checklistError || usersError) {
    console.error("Error fetching checklist page data:", checklistError || usersError)
    // Potentially render an error component here
  }

  if (!checklistData) {
    // This could mean no checklist items are associated yet, which is not an error
    // but we need to handle it gracefully.
    console.log(`No checklist data found for site ${params.siteId}.`)
  }

  const items: SiteChecklistItem[] = checklistData || []
  const users: Pick<User, "id" | "name" | "avatar_url">[] = usersData || []

  return <SiteChecklist initialItems={items} siteId={params.siteId} users={users} />
}
