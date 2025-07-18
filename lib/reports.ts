import { sql } from "./database"
import { mkdir } from "fs/promises"
import { join } from "path"
import PDFKit from "pdfkit" // Declare the PDFKit variable

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

export async function generateReport(
  parameters: ReportParameters,
  generatedBy: number,
): Promise<{ reportId: number; filePath: string }> {
  try {
    // Create reports directory
    const reportsDir = join(process.cwd(), "reports")
    await mkdir(reportsDir, { recursive: true })

    // Generate filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `${parameters.reportType}-${timestamp}.pdf`
    const filePath = join(reportsDir, filename)

    // Create PDF document
    const doc = new PDFKit({ margin: 50 })
    const stream = require("fs").createWriteStream(filePath)
    doc.pipe(stream)

    // Generate report content based on type
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

    doc.end()

    // Wait for PDF to be written
    await new Promise((resolve) => stream.on("finish", resolve))

    // Save report info to database
    const result = await sql`
      INSERT INTO reports (
        title, report_type, parameters, file_path, generated_by,
        expires_at
      ) VALUES (
        ${getReportTitle(parameters)}, ${parameters.reportType}, 
        ${JSON.stringify(parameters)}, ${filePath}, ${generatedBy},
        ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} -- 30 days from now
      )
      RETURNING id
    `

    return {
      reportId: result[0].id,
      filePath,
    }
  } catch (error) {
    console.error("Report generation error:", error)
    throw new Error("Failed to generate report")
  }
}

async function generateSiteSummaryReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  // Add title
  doc.fontSize(20).text("Site Summary Report", { align: "center" })
  doc.moveDown()

  // Add generation date
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "right" })
  doc.moveDown()

  // Get sites data
  let query = `
    SELECT s.*, u.name as project_manager_name,
           COUNT(sto.user_id) as technical_owners_count
    FROM sites s
    LEFT JOIN users u ON s.project_manager_id = u.id
    LEFT JOIN site_technical_owners sto ON s.id = sto.site_id
  `

  const conditions = []
  const params = []

  if (parameters.siteIds?.length) {
    conditions.push(`s.id = ANY($${params.length + 1})`)
    params.push(parameters.siteIds)
  }

  if (parameters.regions?.length) {
    conditions.push(`s.region = ANY($${params.length + 1})`)
    params.push(parameters.regions)
  }

  if (parameters.statuses?.length) {
    conditions.push(`s.status = ANY($${params.length + 1})`)
    params.push(parameters.statuses)
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`
  }

  query += ` GROUP BY s.id, u.name ORDER BY s.created_at DESC`

  const sites = await sql(query, params)

  // Add summary statistics
  doc.fontSize(16).text("Summary Statistics", { underline: true })
  doc.moveDown()

  const totalSites = sites.length
  const completedSites = sites.filter((s) => s.status === "Complete").length
  const inProgressSites = sites.filter((s) => s.status === "In Progress").length
  const totalUsers = sites.reduce((sum, site) => sum + site.users_count, 0)

  doc.fontSize(12)
  doc.text(`Total Sites: ${totalSites}`)
  doc.text(`Completed Sites: ${completedSites}`)
  doc.text(`In Progress Sites: ${inProgressSites}`)
  doc.text(`Total Users: ${totalUsers.toLocaleString()}`)
  doc.moveDown()

  // Add sites table
  doc.fontSize(16).text("Site Details", { underline: true })
  doc.moveDown()

  // Table headers
  const tableTop = doc.y
  const col1 = 50
  const col2 = 150
  const col3 = 250
  const col4 = 350
  const col5 = 450

  doc.fontSize(10)
  doc.text("Site ID", col1, tableTop)
  doc.text("Name", col2, tableTop)
  doc.text("Region", col3, tableTop)
  doc.text("Status", col4, tableTop)
  doc.text("Progress", col5, tableTop)

  // Draw header line
  doc
    .moveTo(col1, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke()

  let currentY = tableTop + 25

  // Add site rows
  sites.forEach((site, index) => {
    if (currentY > 700) {
      // Start new page if needed
      doc.addPage()
      currentY = 50
    }

    doc.text(site.id, col1, currentY)
    doc.text(site.name.substring(0, 15), col2, currentY)
    doc.text(site.region, col3, currentY)
    doc.text(site.status, col4, currentY)
    doc.text(`${site.completion_percent}%`, col5, currentY)

    currentY += 20
  })
}

async function generateProgressReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Progress Report", { align: "center" })
  doc.moveDown()

  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "right" })
  doc.moveDown()

  // Get progress data
  const sites = await sql`
    SELECT s.*, u.name as project_manager_name
    FROM sites s
    LEFT JOIN users u ON s.project_manager_id = u.id
    ORDER BY s.completion_percent DESC
  `

  // Overall progress
  const totalSites = sites.length
  const avgCompletion = sites.reduce((sum, site) => sum + site.completion_percent, 0) / totalSites

  doc.fontSize(16).text("Overall Progress", { underline: true })
  doc.moveDown()

  doc.fontSize(12)
  doc.text(`Average Completion: ${avgCompletion.toFixed(1)}%`)
  doc.text(`Sites Completed: ${sites.filter((s) => s.status === "Complete").length}/${totalSites}`)
  doc.moveDown()

  // Progress by region
  const regionProgress = sites.reduce((acc, site) => {
    if (!acc[site.region]) {
      acc[site.region] = { total: 0, completed: 0, avgProgress: 0 }
    }
    acc[site.region].total++
    if (site.status === "Complete") acc[site.region].completed++
    acc[site.region].avgProgress += site.completion_percent
    return acc
  }, {})

  Object.keys(regionProgress).forEach((region) => {
    regionProgress[region].avgProgress /= regionProgress[region].total
  })

  doc.fontSize(16).text("Progress by Region", { underline: true })
  doc.moveDown()

  Object.entries(regionProgress).forEach(([region, data]: [string, any]) => {
    doc.fontSize(12)
    doc.text(`${region}: ${data.completed}/${data.total} completed (${data.avgProgress.toFixed(1)}% avg)`)
  })
}

async function generateDeploymentStatusReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Deployment Status Report", { align: "center" })
  doc.moveDown()

  // Implementation similar to other reports...
  doc.fontSize(12).text("Deployment status details will be shown here...")
}

async function generateUserActivityReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("User Activity Report", { align: "center" })
  doc.moveDown()

  // Get user activity data
  const activities = await sql`
    SELECT al.*, u.name as user_name
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.created_at >= CURRENT_DATE - INTERVAL '30 days'
    ORDER BY al.created_at DESC
    LIMIT 100
  `

  doc.fontSize(16).text("Recent Activity (Last 30 Days)", { underline: true })
  doc.moveDown()

  activities.forEach((activity) => {
    doc.fontSize(10)
    doc.text(`${activity.created_at.toLocaleDateString()} - ${activity.user_name}: ${activity.action}`)
  })
}

async function generateCustomReport(doc: PDFKit.PDFDocument, parameters: ReportParameters) {
  doc.fontSize(20).text("Custom Report", { align: "center" })
  doc.moveDown()

  doc.fontSize(12).text("Custom report content based on parameters...")
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

export async function getReports(userId?: number) {
  let query = `
    SELECT r.*, u.name as generated_by_name
    FROM reports r
    LEFT JOIN users u ON r.generated_by = u.id
    WHERE r.expires_at > CURRENT_TIMESTAMP
  `

  if (userId) {
    query += ` AND (r.generated_by = $1 OR r.is_public = true)`
    return await sql(query, [userId])
  }

  return await sql(query)
}
