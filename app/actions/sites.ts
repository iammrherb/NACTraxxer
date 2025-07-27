"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const siteSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  priority: z.enum(["High", "Medium", "Low"]),
  users: z.coerce.number().int().positive({ message: "Number of users must be a positive number." }),
})

export async function createSiteAction(projectId: string, prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  const validatedFields = siteSchema.safeParse({
    name: formData.get("name"),
    priority: formData.get("priority"),
    users: formData.get("users"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, priority, users } = validatedFields.data

  const { error } = await supabase.from("sites").insert({
    project_id: projectId,
    name,
    priority,
    users,
    status: "Planned", // Default status
  })

  if (error) {
    console.error("Create site error:", error)
    return { success: false, message: `Failed to create site: ${error.message}` }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects`)

  redirect(`/projects/${projectId}`)
}

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
