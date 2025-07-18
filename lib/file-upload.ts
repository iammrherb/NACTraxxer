import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { sql } from "./database"

export interface FileUploadResult {
  id: number
  filename: string
  originalName: string
  filePath: string
  fileSize: number
  mimeType: string
}

export async function saveFile(
  file: File,
  siteId: string,
  category: string,
  uploadedBy: number,
  description?: string,
): Promise<FileUploadResult> {
  try {
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "uploads", siteId)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`
    const filePath = join(uploadDir, filename)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save file info to database
    const result = await sql`
      INSERT INTO file_uploads (
        filename, original_name, mime_type, file_size, file_path,
        uploaded_by, site_id, category, description
      ) VALUES (
        ${filename}, ${file.name}, ${file.type}, ${file.size}, ${filePath},
        ${uploadedBy}, ${siteId}, ${category}, ${description || null}
      )
      RETURNING *
    `

    return {
      id: result[0].id,
      filename: result[0].filename,
      originalName: result[0].original_name,
      filePath: result[0].file_path,
      fileSize: result[0].file_size,
      mimeType: result[0].mime_type,
    }
  } catch (error) {
    console.error("File upload error:", error)
    throw new Error("Failed to upload file")
  }
}

export async function getFilesBySite(siteId: string) {
  return await sql`
    SELECT f.*, u.name as uploaded_by_name
    FROM file_uploads f
    LEFT JOIN users u ON f.uploaded_by = u.id
    WHERE f.site_id = ${siteId}
    ORDER BY f.created_at DESC
  `
}

export async function deleteFile(fileId: number, userId: number) {
  try {
    // Get file info
    const files = await sql`
      SELECT * FROM file_uploads 
      WHERE id = ${fileId} AND uploaded_by = ${userId}
    `

    if (files.length === 0) {
      throw new Error("File not found or access denied")
    }

    const file = files[0]

    // Delete from filesystem
    const fs = require("fs").promises
    try {
      await fs.unlink(file.file_path)
    } catch (error) {
      console.warn("Could not delete file from filesystem:", error)
    }

    // Delete from database
    await sql`DELETE FROM file_uploads WHERE id = ${fileId}`

    return { success: true }
  } catch (error) {
    console.error("File deletion error:", error)
    throw error
  }
}
