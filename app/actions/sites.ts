"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// A centralized schema for site data validation, used for both create and update.
const siteSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long." }),
  priority: z.enum(["High", "Medium", "Low"]),
  status: z.enum(["Planned", "In Progress", "Complete", "On Hold"]),
  users_count: z.coerce.number().int().min(0, { message: "Number of users must be a non-negative number." }),
})

export async function createSiteAction(projectId: string, prevState: any, formData: FormData) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: "Unauthorized" }
  }

  // We omit 'status' here because it has a default value on creation.
  const validatedFields = siteSchema.omit({ status: true }).safeParse({
    name: formData.get("name"),
    priority: formData.get("priority"),
    users_count: formData.get("users_count"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, priority, users_count } = validatedFields.data

  const { error } = await supabase.from("sites").insert({
    project_id: projectId,
    name,
    priority,
    users_count,
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

export async function updateSiteAction(siteId: string, projectId: string, prevState: any, formData: FormData) {
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
    status: formData.get("status"),
    users_count: formData.get("users_count"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, priority, status, users_count } = validatedFields.data

  const { error } = await supabase
    .from("sites")
    .update({
      name,
      priority,
      status,
      users_count,
      updated_at: new Date().toISOString(),
    })
    .eq("id", siteId)

  if (error) {
    console.error("Update site error:", error)
    return { success: false, message: `Failed to update site: ${error.message}` }
  }

  revalidatePath(`/projects/${projectId}`)
  revalidatePath(`/projects`)
  revalidatePath(`/projects/${projectId}/sites/${siteId}`)

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
