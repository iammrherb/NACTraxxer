import { sql } from "./database"
import { put } from "@vercel/blob"
import type { ReportParameters } from "./types"
import PDFKit from "pdfkit"

/**
 * Generates a PDF document in a buffer based on a provided generator function.
 * @param generator - An async function that takes a PDFDocument instance and parameters to draw the content.
 * @param parameters - The parameters to pass to the generator function.
 * @returns A promise that resolves with the PDF content as a Buffer.
 */
function generatePdfToBuffer(
  generator: (doc: PDFKit.PDFDocument, params: ReportParameters) => Promise<void>,
  parameters: ReportParameters,
): Promise<Buffer> {
  const doc = new PDFKit({ margin: 50, size: "A4" })
  const chunks: Buffer[] = []

  return new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.on("error", reject)

    generator(doc, parameters)
      .then(() => doc.end())
      .catch(reject)
  })
}

/**
 * Main function to generate a report, upload it to Vercel Blob, and save its metadata to the database.
 * @param parameters - The parameters defining the report to be generated.
 * @param generatedBy - The ID of the user generating the report.
 * @returns An object containing the new report's ID, public URL, and filename.
 */
export async function generateReport(
  parameters: ReportParameters,
  generatedBy: number,
): Promise<{ reportId: number; url: string; filename: string }> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${parameters.reportType}-${timestamp}.pdf`
    const reportTitle = getReportTitle(parameters)

    const reportGenerator = reportTypeGeneratorMap[parameters.reportType] || generateCustomReport
    const pdfBuffer = await generatePdfToBuffer(reportGenerator, parameters)

    const { url } = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    })

    const result = await sql`
      INSERT INTO reports (
        title, report_type, parameters, url, filename, generated_by,
        expires_at
      ) VALUES (
        ${reportTitle}, ${parameters.reportType}, 
        ${JSON.stringify(parameters)}, ${url}, ${filename}, ${generatedBy},
        ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} -- Expires in 30 days
      )
      RETURNING id
    `

    return {
      reportId: result[0].id,
      url,
      filename,
    }
  } catch (error) {
    console.error("Report generation process failed:", error)
    throw new Error("Failed to generate or upload report.")
  }
}

// --- Report Content Generators ---

async function generateSiteSummaryReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Site Summary Report", { align: "center" }).moveDown()
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "right" }).moveDown()

  const sites = await sql`SELECT * FROM sites WHERE status != 'Cancelled'`

  doc.fontSize(16).text("Overall Summary", { underline: true }).moveDown()
  doc
    .fontSize(12)
    .text(`Total Active Sites: ${sites.length}`)
    .text(`Completed: ${sites.filter((s) => s.status === "Completed").length}`)
    .text(`In Progress: ${sites.filter((s) => s.status === "In Progress").length}`)
    .moveDown()

  doc.fontSize(16).text("Site Details", { underline: true }).moveDown()
  const tableTop = doc.y
  const headers = ["ID", "Name", "Region", "Status", "Progress"]
  const columnWidths = [50, 150, 100, 100, 80]
  let x = 50

  headers.forEach((header, i) => {
    doc.fontSize(10).text(header, x, tableTop, { width: columnWidths[i], align: "left" })
    x += columnWidths[i]
  })
  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke()
    .moveDown()

  let y = tableTop + 25
  sites.forEach((site) => {
    if (y > 700) {
      doc.addPage()
      y = 50
    }
    const row = [site.site_id, site.site_name, site.region, site.status, `${site.completion_percent}%`]
    x = 50
    row.forEach((cell, i) => {
      doc.text(cell.toString(), x, y, { width: columnWidths[i], align: "left" })
      x += columnWidths[i]
    })
    y += 20
  })
}

async function generateProgressReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Progress Report", { align: "center" }).moveDown()
  doc.text("Details about project progress will be implemented here.")
}

async function generateDeploymentStatusReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Deployment Status Report", { align: "center" }).moveDown()
  doc.text("Details about deployment statuses will be implemented here.")
}

async function generateUserActivityReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("User Activity Report", { align: "center" }).moveDown()
  doc.text("Details about user activity will be implemented here.")
}

async function generateCustomReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Custom Report", { align: "center" }).moveDown()
  doc.text("Custom report generation will be implemented here.")
}

const reportTypeGeneratorMap = {
  site_summary: generateSiteSummaryReport,
  progress_report: generateProgressReport,
  deployment_status: generateDeploymentStatusReport,
  user_activity: generateUserActivityReport,
  custom: generateCustomReport,
}

// --- Helper Functions ---

function getReportTitle(parameters: ReportParameters): string {
  const titles: { [key: string]: string } = {
    site_summary: "Site Summary Report",
    progress_report: "Progress Report",
    deployment_status: "Deployment Status Report",
    user_activity: "User Activity Report",
    custom: "Custom Report",
  }
  return titles[parameters.reportType] || "Report"
}

export async function getReports(userId?: number) {
  let query = sql`
    SELECT r.id, r.title, r.report_type, u.name as generated_by_name, r.generated_at, r.download_count, r.url, r.filename
    FROM reports r
    LEFT JOIN users u ON r.generated_by = u.id
    WHERE r.expires_at > CURRENT_TIMESTAMP
  `
  if (userId) {
    query = sql`${query} AND (r.generated_by = ${userId} OR r.is_public = true)`
  }
  query = sql`${query} ORDER BY r.generated_at DESC`
  return await query
}
