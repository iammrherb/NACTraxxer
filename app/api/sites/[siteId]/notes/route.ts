import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { siteId: string } }) {
  const supabase = createClient()
  const { content } = await request.json()

  if (!content) {
    return NextResponse.json({ error: "Note content is required" }, { status: 400 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase
    .from("site_notes")
    .insert({
      site_id: params.siteId,
      content,
      user_id: user.id,
      user_name: user.email, // Or user.user_metadata.full_name if available
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }

  return NextResponse.json(data)
}
