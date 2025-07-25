"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define a comprehensive schema for validation using Zod
const projectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters."),
  customer: z.string().min(2, "Customer name must be at least 2 characters."),
  description: z.string().optional(),
  project_goal: z.string().optional(),
  in_scope: z.string().optional(),
  out_of_scope: z.string().optional(),
  estimated_users: z.coerce.number().int().positive().optional().nullable(),
  estimated_devices: z.coerce.number().int().positive().optional().nullable(),
  network_diagram_link: z.string().url().optional().or(z.literal("")),
  key_personnel: z.string().optional(),
  planned_start_date: z.coerce.date().optional().nullable(),
  planned_end_date: z.coerce.date().optional().nullable(),
})

export type FormState = {
  message: string
  errors?: z.ZodError<typeof projectSchema>["formErrors"]["fieldErrors"]
}

export async function createProject(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient()

  // 1. Validate form data
  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    customer: formData.get("customer"),
    description: formData.get("description"),
    project_goal: formData.get("project_goal"),
    in_scope: formData.get("in_scope"),
    out_of_scope: formData.get("out_of_scope"),
    estimated_users: formData.get("estimated_users") ? Number(formData.get("estimated_users")) : null,
    estimated_devices: formData.get("estimated_devices") ? Number(formData.get("estimated_devices")) : null,
    network_diagram_link: formData.get("network_diagram_link"),
    key_personnel: formData.get("key_personnel"),
    planned_start_date: formData.get("planned_start_date")
      ? new Date(formData.get("planned_start_date") as string)
      : null,
    planned_end_date: formData.get("planned_end_date") ? new Date(formData.get("planned_end_date") as string) : null,
  })

  if (!validatedFields.success) {
    return {
      message: "Failed to create project. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // 2. Check for user session
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { message: "Authentication error: You must be logged in to create a project." }
  }

  // 3. Prepare data for insertion, including parsing JSON
  const { key_personnel, ...restOfData } = validatedFields.data
  let personnelJson = null
  if (key_personnel) {
    try {
      personnelJson = JSON.parse(key_personnel)
    } catch (e) {
      return {
        message: "Invalid JSON format for Key Personnel.",
        errors: { key_personnel: ["Must be a valid JSON array."] },
      }
    }
  }

  // 4. Insert data into the database
  const { error } = await supabase.from("projects").insert({
    ...restOfData,
    key_personnel: personnelJson,
    user_id: user.id,
  })

  if (error) {
    console.error("Supabase error:", error)
    return { message: `Database error: ${error.message}` }
  }

  // 5. Revalidate cache and redirect
  revalidatePath("/")
  redirect("/")
}
