"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteSiteAction(siteId: string, projectId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  const { error } = await supabase.from("sites").delete().eq("id", siteId)

  if (error) {
    console.error("Delete site error:", error)
    return { success: false, message: "Failed to delete site." }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects`)
  return { success: true, message: "Site deleted successfully." }
}
