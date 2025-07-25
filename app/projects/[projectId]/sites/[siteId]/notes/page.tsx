import { createClient } from "@/lib/supabase/server"
import { SiteNotes } from "@/components/site-notes"
import type { SiteNote } from "@/lib/database"

async function getNotes(siteId: string): Promise<SiteNote[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("site_notes")
    .select("*")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notes:", error)
    return []
  }
  return data
}

export default async function SiteNotesPage({ params }: { params: { siteId: string } }) {
  const notes = await getNotes(params.siteId)
  return <SiteNotes initialNotes={notes} siteId={params.siteId} />
}
