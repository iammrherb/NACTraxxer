import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/database.types"

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_URL!,
    proSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY!,
  )
