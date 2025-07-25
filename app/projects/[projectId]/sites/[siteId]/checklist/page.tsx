import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { SiteChecklist } from "@/components/site-checklist"
import type { SiteChecklistItem } from "@/lib/database"

async function getChecklistData(siteId: string): Promise<SiteChecklistItem[]> {
  const supabase = createClient()

  // First, get all standard checklist items
  const { data: allItems, error: allItemsError } = await supabase
    .from("checklist_items")
    .select("id, title, category, description")
    .order("category, id")

  if (allItemsError) {
    console.error("Error fetching all checklist items:", allItemsError)
    return []
  }

  // Then, get the completion status for the specific site
  const { data: siteItems, error: siteItemsError } = await supabase
    .from("site_checklist_items")
    .select("checklist_item_id, completed")
    .eq("site_id", siteId)

  if (siteItemsError) {
    console.error("Error fetching site checklist items:", siteItemsError)
    // Continue with just the base items
  }

  const siteItemsMap = new Map(siteItems?.map((item) => [item.checklist_item_id, item.completed]))

  const fullChecklist: SiteChecklistItem[] = allItems.map((item) => ({
    ...item,
    site_id: siteId,
    checklist_item_id: item.id,
    completed: siteItemsMap.get(item.id) || false,
    notes: null, // Notes could be fetched here too if needed
    updated_at: null,
  }))

  return fullChecklist
}

export default async function SiteChecklistPage({ params }: { params: { siteId: string } }) {
  const checklistItems = await getChecklistData(params.siteId)

  if (!checklistItems) {
    notFound()
  }

  return <SiteChecklist initialItems={checklistItems} siteId={params.siteId} />
}
