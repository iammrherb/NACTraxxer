import { createBrowserClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./server"

// Create a Supabase client for client-side operations
// Note: These environment variables must be exposed to the browser
// by prefixing them with NEXT_PUBLIC_ in your .env file.
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  )
