import { put, del } from "@vercel/blob"
import { sql } from "./database"

export interface FileUploadResult {
  id: number
  filename: string
  originalName: string
  filePath: string // This will now be the blob URL
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
    // Generate a unique path for the blob
    const blobPath = `uploads/${siteId}/${Date.now()}-${file.name}`

    // Upload file to Vercel Blob
    const blob = await put(blobPath, file, {
      access: "public",
    })

    // Save file info to database, using the blob URL
    const result = await sql`
      INSERT INTO file_uploads (
        filename, original_name, mime_type, file_size, file_path,
        uploaded_by, site_id, category, description
      ) VALUES (
        ${blob.pathname}, ${file.name}, ${file.type}, ${file.size}, ${blob.url},
        ${uploadedBy}, ${siteId}, ${category}, ${description || null}
      )
      RETURNING *
    `

    const dbResult = result[0]

    return {
      id: dbResult.id,
      filename: dbResult.filename,
      originalName: dbResult.original_name,
      filePath: dbResult.file_path, // This is the public URL from Vercel Blob
      fileSize: dbResult.file_size,
      mimeType: dbResult.mime_type,
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
    // Get file info to get the blob URL
    const files = await sql`
      SELECT * FROM file_uploads 
      WHERE id = ${fileId} AND uploaded_by = ${userId}
    `

    if (files.length === 0) {
      throw new Error("File not found or access denied")
    }

    const fileToDelete = files[0]

    // Delete from Vercel Blob store using the URL
    if (fileToDelete.file_path) {
      await del(fileToDelete.file_path)
    }

    // Delete from database
    await sql`DELETE FROM file_uploads WHERE id = ${fileId}`

    return { success: true }
  } catch (error) {
    console.error("File deletion error:", error)
    throw error
  }
}
