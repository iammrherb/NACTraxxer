"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"

const siteSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  priority: z.enum(["High", "Medium", "Low"]),
  users_count: z.coerce.number().min(1, "Number of users must be at least 1"),
  status: z.enum(["Planned", "In Progress", "On Hold", "Complete"]).optional(),
})

export async function createSiteAction(projectId: string, prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Unauthorized", errors: {} }
    }

    // Validate form data
    const validatedFields = siteSchema.safeParse({
      name: formData.get("name"),
      priority: formData.get("priority"),
      users_count: formData.get("users_count"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const supabase = createClient()

    // Create the site
    const { data, error } = await supabase
      .from("sites")
      .insert({
        ...validatedFields.data,
        project_id: projectId,
        status: "Planned",
        completion_percent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

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

export async function updateSiteAction(siteId: string, projectId: string, prevState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return { success: false, message: "Unauthorized", errors: {} }
    }

    // Validate form data
    const validatedFields = siteSchema.safeParse({
      name: formData.get("name"),
      priority: formData.get("priority"),
      users_count: formData.get("users_count"),
      status: formData.get("status"),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Validation failed",
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const supabase = createClient()

    // Update the site
    const { data, error } = await supabase
      .from("sites")
      .update({
        ...validatedFields.data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", siteId)
      .select()
      .single()

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
