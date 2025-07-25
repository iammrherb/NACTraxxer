"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

// Define a schema for validation using Zod
const projectSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters long." }),
  customer: z.string().min(2, { message: "Customer name must be at least 2 characters long." }),
})

export type FormState = {
  message: string
  errors?: {
    name?: string[]
    customer?: string[]
  }
}

export async function createProject(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient()

  // 1. Validate form data
  const validatedFields = projectSchema.safeParse({
    name: formData.get("name"),
    customer: formData.get("customer"),
  })

  if (!validatedFields.success) {
    return {
      message: "Failed to create project. Please check the fields.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, customer } = validatedFields.data

  // 2. Check for user session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "Authentication error: You must be logged in to create a project." }
  }

  // 3. Insert data into the database
  const { error } = await supabase.from("projects").insert({
    name,
    customer,
    user_id: user.id,
    status: "Planning", // Default status
  })

  if (error) {
    console.error("Supabase error:", error)
    return { message: `Database error: ${error.message}` }
  }

  // 4. Revalidate cache and redirect
  revalidatePath("/") // Update the project list on the home page
  redirect("/") // Navigate back to the home page
}
