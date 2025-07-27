"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  phase: z.string().min(1, "Phase is required"),
  users_count: z.number().min(0, "Users count must be non-negative"),
  project_manager_id: z.string().uuid("Invalid project manager ID"),
  planned_start_date: z.string().min(1, "Planned start date is required"),
  planned_end_date: z.string().min(1, "Planned end date is required"),
  status: z.enum(["Planned", "In Progress", "Complete", "Delayed"]),
  completion_percentage: z.number().min(0).max(100),
  notes: z.string().optional(),
})

export async function createSiteAction(projectId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Unauthorized", errors: {} }
    }

    // Parse form data
    const rawData = {
      name: formData.get("name") as string,
      region: formData.get("region") as string,
      country: formData.get("country") as string,
      priority: formData.get("priority") as string,
      phase: formData.get("phase") as string,
      users_count: Number.parseInt(formData.get("users_count") as string) || 0,
      project_manager_id: formData.get("project_manager_id") as string,
      planned_start_date: formData.get("planned_start_date") as string,
      planned_end_date: formData.get("planned_end_date") as string,
      status: formData.get("status") as string,
      completion_percentage: Number.parseInt(formData.get("completion_percentage") as string) || 0,
      notes: (formData.get("notes") as string) || "",
    }

    // Validate data
    const validatedData = siteSchema.parse(rawData)

    const supabase = createClient()

    // Insert site
    const { error } = await supabase.from("sites").insert({
      ...validatedData,
      project_id: projectId,
    })

    if (error) {
      console.error("Database error:", error)
      return { success: false, message: "Failed to create site", errors: {} }
    }

    revalidatePath(`/projects/${projectId}`)
    redirect(`/projects/${projectId}`)
  } catch (error) {
    console.error("Create site error:", error)
    return { success: false, message: "An unexpected error occurred", errors: {} }
  }
}

export async function updateSiteAction(siteId: string, projectId: string, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Unauthorized", errors: {} }
    }

    // Parse form data
    const rawData = {
      name: formData.get("name") as string,
      region: formData.get("region") as string,
      country: formData.get("country") as string,
      priority: formData.get("priority") as string,
      phase: formData.get("phase") as string,
      users_count: Number.parseInt(formData.get("users_count") as string) || 0,
      project_manager_id: formData.get("project_manager_id") as string,
      planned_start_date: formData.get("planned_start_date") as string,
      planned_end_date: formData.get("planned_end_date") as string,
      status: formData.get("status") as string,
      completion_percentage: Number.parseInt(formData.get("completion_percentage") as string) || 0,
      notes: (formData.get("notes") as string) || "",
    }

    // Validate data
    const validatedData = siteSchema.parse(rawData)

    const supabase = createClient()

    // Update site
    const { error } = await supabase.from("sites").update(validatedData).eq("id", siteId)

    if (error) {
      console.error("Database error:", error)
      return { success: false, message: "Failed to update site", errors: {} }
    }

    revalidatePath(`/projects/${projectId}`)
    redirect(`/projects/${projectId}`)
  } catch (error) {
    console.error("Update site error:", error)
    return { success: false, message: "An unexpected error occurred", errors: {} }
  }
}

export async function deleteSiteAction(siteId: string, projectId: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const supabase = createClient()

    const { error } = await supabase.from("sites").delete().eq("id", siteId)

    if (error) {
      console.error("Database error:", error)
      throw new Error("Failed to delete site")
    }

    revalidatePath(`/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Delete site error:", error)
    throw error
  }
}
