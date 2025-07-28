import { NextResponse } from "next/server"
import { sql } from "@/lib/database"

export async function GET(request: Request, { params }: { params: { siteId: string } }) {
  try {
    const { siteId } = params

    const files = await sql`
      SELECT * FROM site_files 
      WHERE site_id = ${siteId}
      ORDER BY created_at DESC
    `

    return NextResponse.json(files)
  } catch (error) {
    console.error("Error fetching files:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { siteId: string } }) {
  try {
    const { siteId } = params
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In a real implementation, you would upload to a file storage service
    const fileRecord = await sql`
      INSERT INTO site_files (site_id, filename, file_size, file_type, created_at)
      VALUES (${siteId}, ${file.name}, ${file.size}, ${file.type}, NOW())
      RETURNING *
    `

    return NextResponse.json(fileRecord[0])
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
