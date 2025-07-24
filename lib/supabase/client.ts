import { createBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./server" // Reuse the Database type

// Define a function to create a Supabase client for client-side operations
export const createClient = () =>
  createBrowserClient<Database>({
    supabaseUrl: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  })
