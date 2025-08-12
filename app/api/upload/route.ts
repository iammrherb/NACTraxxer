import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { saveFile } from "@/lib/file-upload"
import { logActivity } from "@/lib/activity-logger"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const siteId = formData.get("siteId") as string
    const category = formData.get("category") as string
    const description = formData.get("description") as string

    if (!file || !siteId || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 })
    }

    const result = await saveFile(file, siteId, category, Number.parseInt(session.user.id), description)

    // Log activity
    await logActivity({
      userId: Number.parseInt(session.user.id),
      action: "file_upload",
      entityType: "file",
      entityId: result.id.toString(),
      newValues: {
        filename: result.originalName,
        category,
        siteId,
      },
      ipAddress: request.ip,
      userAgent: request.headers.get("user-agent"),
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
