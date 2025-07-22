import { sql } from "./database"
import { put } from "@vercel/blob"
import PDFDocument from "pdfkit"
import { Buffer } from "buffer"
import type { Site, Vendor } from "./database"
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

// Helper to add header and footer
const addPdfHeadersAndFooters = (doc: PDFKit.PDFDocument, title: string) => {
  const pageCount = doc.bufferedPageRange().count
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i)

    // Header
    doc.fontSize(14).text(title, doc.page.margins.left, 30, {
      align: "center",
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    })
    doc.moveTo(50, 55).lineTo(550, 55).stroke()

    // Footer
    const bottom = doc.page.height - 50
    doc.fontSize(8).text(`Page ${i + 1} of ${pageCount}`, 50, bottom, { align: "right", width: 500 })
    doc.fontSize(8).text(`Generated: ${new Date().toLocaleString()}`, 50, bottom, { align: "left" })
  }
}

// Helper function to generate PDF in memory
async function createPdfBuffer(title: string, buildPdf: (doc: PDFKit.PDFDocument) => Promise<void>): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4", bufferPages: true })
    const chunks: Buffer[] = []

    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => {
      addPdfHeadersAndFooters(doc, title)
      doc.flushPages()
      resolve(Buffer.concat(chunks))
    })
    doc.on("error", reject)

    await buildPdf(doc)

    doc.end()
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

    const pdfBuffer = await createPdfBuffer(title, async (doc) => {
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

    const blob = await put(blobPath, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    const result = await sql`
    INSERT INTO reports (
      title, report_type, parameters, file_path, generated_by,
      expires_at
    ) VALUES (
      ${title}, ${parameters.reportType}, 
      ${JSON.stringify(parameters)}, ${blob.url}, ${generatedBy},
      ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
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
  doc.fontSize(18).text("Site Summary", { align: "left" }).moveDown(0.5)
  doc.fontSize(10).text(`Date Range: ${parameters.dateRange?.start} to ${parameters.dateRange?.end}`).moveDown()

  const sites = await sql<Site[]>`
  SELECT s.*, u.name as project_manager_name
  FROM sites s
  LEFT JOIN users u ON s.project_manager_id = u.id
  ORDER BY s.name
`
  const vendors = await sql<Vendor[]>`SELECT * FROM vendors`
  const allVendors = new Map(vendors.map((v) => [v.id, v.name]))

  for (const site of sites) {
    if (doc.y > 650) doc.addPage()

    doc.fontSize(14).text(site.name, { underline: true }).moveDown(0.5)
    doc.fontSize(10)

    const details = [
      ["Site ID", site.id],
      ["Status", site.status],
      ["Region", site.region],
      ["Country", site.country],
      ["Users", site.users_count],
      ["Manager", site.project_manager_name || "N/A"],
      ["Go-Live", new Date(site.planned_end).toLocaleDateString()],
      ["Progress", `${site.completion_percent}%`],
    ]

    let startX = doc.x
    let startY = doc.y
    details.forEach((detail, i) => {
      if (i > 0 && i % 2 === 0) {
        startY += 15
        startX = doc.page.margins.left
      }
      doc
        .font("Helvetica-Bold")
        .text(`${detail[0]}:`, startX, startY, { continued: true })
        .font("Helvetica")
        .text(` ${detail[1]}`)
      startX += 200
    })

    doc.y = startY + 30

    const siteVendors = (site.vendor_ids || [])
      .map((id) => allVendors.get(id))
      .filter(Boolean)
      .join(", ")

    doc
      .font("Helvetica-Bold")
      .text("Vendors: ", { continued: true })
      .font("Helvetica")
      .text(siteVendors || "None specified")

    doc.moveDown(2)
  }
}

async function generateProgressReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Progress Report", { align: "left" }).moveDown()
  doc.text("Progress report content will be implemented here.")
}

async function generateDeploymentStatusReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Deployment Status Report", { align: "left" }).moveDown()
  doc.text("Deployment status report content will be implemented here.")
}

async function generateUserActivityReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("User Activity Report", { align: "left" }).moveDown()
  doc.text("User activity report content will be implemented here.")
}

async function generateCustomReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Custom Report", { align: "left" }).moveDown()
  doc.text("Custom report content will be implemented here.")
}

export async function getReports(userId?: number) {
  let query = sql`
  SELECT r.id, r.title, r.report_type, r.file_path, r.generated_at, r.download_count, u.name as generated_by_name
  FROM reports r
  LEFT JOIN users u ON r.generated_by = u.id
  WHERE r.expires_at > CURRENT_TIMESTAMP
`

  if (userId) {
    query = sql`${query} AND r.generated_by = ${userId}`
  }

  query = sql`${query} ORDER BY r.generated_at DESC`

  return await query
}
