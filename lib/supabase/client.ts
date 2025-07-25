import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

// NOTE: The `createClient` function is a factory that creates a new client for each request.
// This is a key difference from the old pages router approach.
export const createClient = () =>
  createBrowserClient<Database>(
    process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  )
