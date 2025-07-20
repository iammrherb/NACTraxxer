import { sql } from "./database"
import { put } from "@vercel/blob"
import PDFDocument from "pdfkit"
import { Buffer } from "buffer"
import type { PDFKit } from "pdfkit"

export interface ReportParameters {
  reportType: "site_summary" | "progress_report" | "deployment_status" | "user_activity" | "custom"
  dateRange?: {
    start: string
    end: string
  }
  siteIds?: string[]
  regions?: string[]
  statuses?: string[]
  includeCharts?: boolean
}

// Helper function to generate PDF in memory
async function createPdfBuffer(buildPdf: (doc: PDFKit.PDFDocument) => Promise<void>): Promise<Buffer> {
  const doc = new PDFDocument({ margin: 50, size: "A4" })
  const chunks: Buffer[] = []

  doc.on("data", (chunk) => {
    chunks.push(chunk)
  })

  await buildPdf(doc)

  doc.end()

  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks))
    })
    doc.on("error", reject)
  })
}

export async function generateReport(
  parameters: ReportParameters,
  generatedBy: number,
): Promise<{ reportId: number; filePath: string }> {
  try {
    const title = getReportTitle(parameters)
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${parameters.reportType}-${timestamp}.pdf`
    const blobPath = `reports/${filename}`

    // Generate PDF content into a buffer
    const pdfBuffer = await createPdfBuffer(async (doc) => {
      switch (parameters.reportType) {
        case "site_summary":
          await generateSiteSummaryReport(doc, parameters)
          break
        case "progress_report":
          await generateProgressReport(doc, parameters)
          break
        case "deployment_status":
          await generateDeploymentStatusReport(doc, parameters)
          break
        case "user_activity":
          await generateUserActivityReport(doc, parameters)
          break
        default:
          await generateCustomReport(doc, parameters)
      }
    })

    // Upload the buffer to Vercel Blob
    const blob = await put(blobPath, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    // Save report info to database with the blob URL
    const result = await sql`
      INSERT INTO reports (
        title, report_type, parameters, file_path, generated_by,
        expires_at
      ) VALUES (
        ${title}, ${parameters.reportType}, 
        ${JSON.stringify(parameters)}, ${blob.url}, ${generatedBy},
        ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} -- 30 days from now
      )
      RETURNING id
    `

    return {
      reportId: result[0].id,
      filePath: blob.url,
    }
  } catch (error) {
    console.error("Report generation error:", error)
    throw new Error("Failed to generate report")
  }
}

function getReportTitle(parameters: ReportParameters): string {
  const titles = {
    site_summary: "Site Summary Report",
    progress_report: "Progress Report",
    deployment_status: "Deployment Status Report",
    user_activity: "User Activity Report",
    custom: "Custom Report",
  }
  return titles[parameters.reportType] || "Report"
}

async function generateSiteSummaryReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Site Summary Report", { align: "center" }).moveDown()
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "right" }).moveDown()

  const sites = await sql`SELECT * FROM sites LIMIT 10`

  doc.fontSize(16).text("Site Details", { underline: true }).moveDown()
  const tableTop = doc.y
  doc.fontSize(10)
  doc.text("Site ID", 50, tableTop)
  doc.text("Name", 150, tableTop)
  doc.text("Status", 350, tableTop)
  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke()

  let currentY = tableTop + 25
  sites.forEach((site) => {
    if (currentY > 700) {
      doc.addPage()
      currentY = 50
    }
    doc.text(site.id, 50, currentY)
    doc.text(site.name, 150, currentY)
    doc.text(site.status, 350, currentY)
    currentY += 20
  })
}

async function generateProgressReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Progress Report", { align: "center" }).moveDown()
  doc.text("Progress report content will be implemented here.")
}

async function generateDeploymentStatusReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Deployment Status Report", { align: "center" }).moveDown()
  doc.text("Deployment status report content will be implemented here.")
}

async function generateUserActivityReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("User Activity Report", { align: "center" }).moveDown()
  doc.text("User activity report content will be implemented here.")
}

async function generateCustomReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Custom Report", { align: "center" }).moveDown()
  doc.text("Custom report content will be implemented here.")
}

export async function getReports(userId?: number) {
  // The original query checked for an 'is_public' flag which may not exist in the
  // database schema, causing the API to fail. This has been simplified for the
  // preview to fetch reports based on the (mock) user ID.
  let query = `
    SELECT r.*, u.name as generated_by_name
    FROM reports r
    LEFT JOIN users u ON r.generated_by = u.id
    WHERE r.expires_at > CURRENT_TIMESTAMP
  `
  const params: (number | string)[] = []

  if (userId) {
    query += ` AND r.generated_by = $1`
    params.push(userId)
  } else {
    // In a real app, you might want to only show public reports if not logged in.
    // For this preview, if there's no user, we'll show no reports.
    query += ` AND 1 = 0`
  }

  query += ` ORDER BY r.generated_at DESC`

  return await sql(query, params)
}
