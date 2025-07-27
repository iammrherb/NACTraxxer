"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const siteSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  site_id: z.string().min(1, "Site ID is required"),
  region: z.string().min(1, "Region is required"),
  country: z.string().min(1, "Country is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  phase: z.string().min(1, "Phase is required"),
  users_count: z.number().min(0, "Users count must be non-negative"),
  project_manager: z.string().min(1, "Project manager is required"),
  status: z.enum(["Not Started", "In Progress", "Complete", "On Hold"]),
  planned_start: z.string().min(1, "Planned start date is required"),
  planned_end: z.string().min(1, "Planned end date is required"),
  notes: z.string().optional(),
})

export async function createSiteAction(formData: FormData) {
  const supabase = createClient()

  const rawData = {
    site_name: formData.get("site_name") as string,
    site_id: formData.get("site_id") as string,
    region: formData.get("region") as string,
    country: formData.get("country") as string,
    priority: formData.get("priority") as string,
    phase: formData.get("phase") as string,
    users_count: Number.parseInt(formData.get("users_count") as string) || 0,
    project_manager: formData.get("project_manager") as string,
    status: formData.get("status") as string,
    planned_start: formData.get("planned_start") as string,
    planned_end: formData.get("planned_end") as string,
    notes: (formData.get("notes") as string) || "",
    project_id: formData.get("project_id") as string,
  }

  try {
    const validatedData = siteSchema.parse(rawData)

    const { error } = await supabase.from("sites").insert([
      {
        ...validatedData,
        project_id: rawData.project_id,
        completion_percent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error("Error creating site:", error)
      throw new Error("Failed to create site")
    }

    revalidatePath(`/projects/${rawData.project_id}`)
  } catch (error) {
    console.error("Error in createSiteAction:", error)
    throw error
  }

  redirect(`/projects/${rawData.project_id}`)
}

export async function updateSiteAction(formData: FormData) {
  const supabase = createClient()

  const siteId = formData.get("site_id") as string
  const projectId = formData.get("project_id") as string

  const rawData = {
    site_name: formData.get("site_name") as string,
    region: formData.get("region") as string,
    country: formData.get("country") as string,
    priority: formData.get("priority") as string,
    phase: formData.get("phase") as string,
    users_count: Number.parseInt(formData.get("users_count") as string) || 0,
    project_manager: formData.get("project_manager") as string,
    status: formData.get("status") as string,
    planned_start: formData.get("planned_start") as string,
    planned_end: formData.get("planned_end") as string,
    notes: (formData.get("notes") as string) || "",
  }

  try {
    const validatedData = siteSchema.omit({ site_id: true }).parse(rawData)

    const { error } = await supabase
      .from("sites")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId)

    if (error) {
      console.error("Error updating site:", error)
      throw new Error("Failed to update site")
    }

    revalidatePath(`/projects/${projectId}`)
    revalidatePath(`/projects/${projectId}/sites/${siteId}`)
  } catch (error) {
    console.error("Error in updateSiteAction:", error)
    throw error
  }

  redirect(`/projects/${projectId}`)
}

export async function deleteSiteAction(siteId: string, projectId: string) {
  const supabase = createClient()

  try {
    const { error } = await supabase.from("sites").delete().eq("id", siteId)

    if (error) {
      console.error("Error deleting site:", error)
      throw new Error("Failed to delete site")
    }

    revalidatePath(`/projects/${projectId}`)
  } catch (error) {
    console.error("Error in deleteSiteAction:", error)
    throw error
  }
}
