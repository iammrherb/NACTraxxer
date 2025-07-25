import { createBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./server" // Reuse the Database type from the server file

// This function creates a Supabase client for use in Client Components.
// It uses the NEXT_PUBLIC_ prefixed environment variables, which are exposed to the browser.
export const createClient = () =>
  createBrowserClient<Database>({
    supabaseUrl: process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  })
