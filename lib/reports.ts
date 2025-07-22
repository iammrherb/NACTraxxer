import { sql } from "./database"
import { put } from "@vercel/blob"
import PDFDocument from "pdfkit"
import { Buffer } from "buffer"
import type { PDFDocument as PDFKitDocument } from "pdfkit"
import { ChartJSNodeCanvas } from "chartjs-node-canvas"
import type { ChartConfiguration } from "chart.js"

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

// Chart generation setup
const width = 800
const height = 400
const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width,
  height,
  backgroundColour: "#ffffff",
  plugins: {
    globalVariableLegacy: ["chartjs-adapter-date-fns"],
  },
})

async function generateChart(config: ChartConfiguration): Promise<Buffer> {
  return await chartJSNodeCanvas.renderToBuffer(config)
}

// Helper to add header and footer
const addPdfHeadersAndFooters = (doc: PDFKitDocument, title: string) => {
  const pages = doc.bufferedPageRange()
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i)

    // Header
    doc.fontSize(14).text(title, doc.page.margins.left, 30, {
      align: "center",
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    })
    doc.moveTo(50, 55).lineTo(550, 55).stroke()

    // Footer
    const bottom = doc.page.height - 50
    doc.fontSize(8).text(`Page ${i + 1} of ${pages.count}`, 50, bottom, { align: "right", width: 500 })
    doc.fontSize(8).text(`Generated: ${new Date().toLocaleString()}`, 50, bottom, { align: "left" })
  }
}

// Helper function to generate PDF in memory
async function createPdfBuffer(title: string, buildPdf: (doc: PDFKitDocument) => Promise<void>): Promise<Buffer> {
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
          await generateSiteSummaryPdf(doc, parameters)
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
    progress_report: "Deployment Progress Report",
    deployment_status: "Deployment Status Report",
    user_activity: "User Activity Report",
    custom: "Custom Report",
  }
  return titles[parameters.reportType] || "Report"
}

export async function generateSiteSummaryPdf(doc: PDFKitDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Site Deployment Summary", { align: "left" }).moveDown(0.5)
  if (parameters.dateRange?.start && parameters.dateRange?.end) {
    doc.fontSize(10).text(`Date Range: ${parameters.dateRange.start} to ${parameters.dateRange.end}`).moveDown()
  }

  const sites = await sql<any[]>`SELECT * FROM sites ORDER BY name`

  // --- Overall Stats ---
  doc.fontSize(16).text("Overall Statistics", { underline: true }).moveDown()
  const totalSites = sites.length
  const sitesInProgress = sites.filter((s) => s.status === "In Progress").length
  const sitesCompleted = sites.filter((s) => s.status === "Completed").length
  const sitesPlanned = sites.filter((s) => s.status === "Planned").length
  const sitesOnHold = sites.filter((s) => s.status === "Delayed").length

  doc.fontSize(12).text(`Total Sites: ${totalSites}`)
  doc.text(`Sites In Progress: ${sitesInProgress}`)
  doc.text(`Sites Completed: ${sitesCompleted}`)
  doc.text(`Sites Planned: ${sitesPlanned}`)
  doc.text(`Sites Delayed: ${sitesOnHold}`)
  doc.moveDown()

  // --- Status Chart ---
  if (parameters.includeCharts) {
    const statusChartConfig: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: ["In Progress", "Completed", "Planned", "Delayed"],
        datasets: [
          {
            label: "Site Status",
            data: [sitesInProgress, sitesCompleted, sitesPlanned, sitesOnHold],
            backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ef4444"],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: "Site Status Distribution" },
        },
      },
    }
    try {
      const chartImage = await generateChart(statusChartConfig)
      doc.image(chartImage, { width: 450, align: "center" })
      doc.moveDown()
    } catch (e) {
      console.error("Chart generation failed:", e)
      doc.text("Chart could not be generated.", { color: "red" })
    }
  }

  // --- Site Details Table ---
  doc.addPage()
  doc.fontSize(16).text("Site Details", { underline: true }).moveDown()

  const tableTop = doc.y
  const colWidths = [40, 120, 80, 80, 60, 80]
  const startX = doc.page.margins.left

  const drawHeader = (y: number) => {
    doc.fontSize(10).font("Helvetica-Bold")
    doc.text("ID", startX, y)
    doc.text("Name", startX + colWidths[0], y)
    doc.text("Status", startX + colWidths[0] + colWidths[1], y)
    doc.text("Region", startX + colWidths[0] + colWidths[1] + colWidths[2], y)
    doc.text("Users", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], y)
    doc.text("Completion", startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4], y)
    doc
      .moveTo(startX, y + 15)
      .lineTo(doc.page.width - doc.page.margins.right, y + 15)
      .stroke()
  }

  drawHeader(tableTop)

  doc.font("Helvetica").fontSize(9)
  let y = tableTop + 25
  const rowHeight = 20

  for (const site of sites) {
    if (y > doc.page.height - doc.page.margins.bottom - rowHeight) {
      doc.addPage()
      y = doc.page.margins.top
      drawHeader(y)
      y += 25
    }
    doc.text(site.id, startX, y, { width: colWidths[0] - 5 })
    doc.text(site.name, startX + colWidths[0], y, { width: colWidths[1] - 5 })
    doc.text(site.status, startX + colWidths[0] + colWidths[1], y, { width: colWidths[2] - 5 })
    doc.text(site.region, startX + colWidths[0] + colWidths[1] + colWidths[2], y, { width: colWidths[3] - 5 })
    doc.text(
      site.users_count?.toString() ?? "0",
      startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
      y,
      {
        width: colWidths[4] - 5,
      },
    )
    doc.text(
      `${site.completion_percent}%`,
      startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4],
      y,
      { width: colWidths[5] - 5 },
    )
    y += rowHeight
  }
}

async function generateProgressReport(doc: PDFKitDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Deployment Progress Report", { align: "left" }).moveDown()

  const sites = await sql<any[]>`SELECT * FROM sites ORDER BY completion_percent DESC`
  const checklistItems = await sql<any[]>`SELECT * FROM checklist_items`
  const checklistMap = new Map(checklistItems.map((item) => [item.id, item]))

  doc.fontSize(16).text("Site Completion Status", { underline: true }).moveDown()

  for (const site of sites) {
    if (doc.y > 700) doc.addPage()

    doc.fontSize(12).font("Helvetica-Bold").text(`${site.name} (${site.completion_percent}%)`)
    doc.font("Helvetica").fontSize(10)
    doc.text(`Status: ${site.status} | Go-Live: ${new Date(site.planned_end).toLocaleDateString()}`)

    const completedItems = (site.checklist_item_ids || [])
      .map((id: number) => checklistMap.get(id)?.name)
      .filter(Boolean)
      .slice(0, 5) // Show first 5 for brevity

    if (completedItems.length > 0) {
      doc.fontSize(9).text(`Recent Completions: ${completedItems.join(", ")}...`)
    }
    doc.moveDown()
  }
}

async function generateDeploymentStatusReport(doc: PDFKitDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Deployment Status Report", { align: "left" }).moveDown()

  const sites = await sql<any[]>`SELECT * FROM sites ORDER BY status, name`

  const statuses = ["Delayed", "In Progress", "Planned", "Completed"]

  for (const status of statuses) {
    const filteredSites = sites.filter((s) => s.status === status)
    if (filteredSites.length === 0) continue

    if (doc.y > 700) doc.addPage()
    doc.fontSize(16).text(status, { underline: true }).moveDown()

    for (const site of filteredSites) {
      doc.fontSize(12).font("Helvetica-Bold").text(site.name)
      doc
        .font("Helvetica")
        .fontSize(10)
        .text(`Phase: ${site.phase} | Users: ${site.users_count} | PM: ${site.project_manager_name || "N/A"}`)
      doc.moveDown()
    }
  }
}

async function generateUserActivityReport(doc: PDFKitDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("User Activity Report", { align: "left" }).moveDown()
  doc.text("User activity reporting is not yet implemented. This would require an audit trail feature.")
}

async function generateCustomReport(doc: PDFKitDocument, parameters: ReportParameters) {
  doc.fontSize(18).text("Custom Report", { align: "left" }).moveDown()
  doc.text("Custom reporting is not yet implemented.")
}

export async function getReports(userId?: number) {
  try {
    // This single query will test for both 'reports' and 'users' tables.
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

    const result = await query
    return result.map((row) => ({ ...row })) // Ensure plain objects are returned
  } catch (error: any) {
    // A broad catch to handle any database error during initial setup.
    // This makes the dashboard more resilient if migrations/seeding are incomplete.
    console.warn(
      `Could not fetch reports, possibly due to an incomplete database schema or data issue. Returning an empty list. Error: ${error.message}`,
    )
    return []
  }
}
