import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { ScopingQuestionnaire, Project, Site } from "@/lib/database"

// Define a type for your database schema
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, "id" | "created_at" | "updated_at">
        Update: Partial<Project>
      }
      sites: {
        Row: Site
        Insert: Omit<Site, "id" | "created_at" | "updated_at">
        Update: Partial<Site>
      }
      scoping_questionnaires: {
        Row: ScopingQuestionnaire
        Insert: Omit<ScopingQuestionnaire, "id" | "created_at" | "updated_at">
        Update: Partial<ScopingQuestionnaire>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

// Define a function to create a Supabase client for server-side operations
export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>(
    {
      cookies: () => cookieStore,
    },
    {
      supabaseUrl: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
    },
  )
}
