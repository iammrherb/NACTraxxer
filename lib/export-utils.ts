/**
 * Utility functions for exporting data in various formats
 */

type ExportFormat = "csv" | "excel" | "json"

interface ExportOptions {
  filename?: string
  includeTimestamp?: boolean
  includeHeaders?: boolean
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any[], options: ExportOptions = {}): string {
  if (!data || !data.length) return ""

  const headers = Object.keys(data[0])
  const { includeHeaders = true } = options

  // Process headers
  let csvContent = includeHeaders ? headers.map(escapeCSVValue).join(",") + "\n" : ""

  // Process rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header]
      return escapeCSVValue(value)
    })
    csvContent += row.join(",") + "\n"
  })

  return csvContent
}

/**
 * Convert data to Excel TSV format
 */
export function convertToExcel(data: any[], options: ExportOptions = {}): string {
  if (!data || !data.length) return ""

  const headers = Object.keys(data[0])
  const { includeHeaders = true } = options

  // Process headers
  let excelContent = includeHeaders ? headers.join("\t") + "\n" : ""

  // Process rows
  data.forEach((item) => {
    const row = headers.map((header) => {
      const value = item[header]
      return value !== null && value !== undefined ? String(value) : ""
    })
    excelContent += row.join("\t") + "\n"
  })

  return excelContent
}

/**
 * Convert data to JSON format
 */
export function convertToJSON(data: any[]): string {
  return JSON.stringify(data, null, 2)
}

/**
 * Escape CSV values to handle commas, quotes, etc.
 */
function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) return ""

  const stringValue = String(value)

  // If the value contains a comma, newline, or double quote, enclose it in double quotes
  if (stringValue.includes(",") || stringValue.includes("\n") || stringValue.includes('"')) {
    // Replace any double quotes with two double quotes
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Generate a filename with optional timestamp
 */
export function generateFilename(baseFilename: string, format: ExportFormat, includeTimestamp = true): string {
  const timestamp = includeTimestamp ? `-${new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)}` : ""

  const extension = format === "excel" ? "xls" : format
  return `${baseFilename}${timestamp}.${extension}`
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()

  // Clean up
  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

/**
 * Export data in the specified format
 */
export function exportData(data: any[], format: ExportFormat, baseFilename: string, options: ExportOptions = {}): void {
  const { includeTimestamp = true, includeHeaders = true } = options
  const filename = generateFilename(baseFilename, format, includeTimestamp)

  try {
    let content: string
    let mimeType: string

    switch (format) {
      case "csv":
        content = convertToCSV(data, { includeHeaders })
        mimeType = "text/csv"
        break
      case "excel":
        content = convertToExcel(data, { includeHeaders })
        mimeType = "application/vnd.ms-excel"
        break
      case "json":
        content = convertToJSON(data)
        mimeType = "application/json"
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    downloadFile(content, filename, mimeType)
  } catch (error) {
    console.error(`Error exporting data as ${format}:`, error)
    throw error
  }
}

/**
 * Format analytics data for export
 */
export function formatAnalyticsDataForExport(analyticsData: any): any[] {
  // This function can be customized based on the structure of your analytics data
  if (!analyticsData) return []

  // Example transformation for deployment metrics
  if (analyticsData.deployments) {
    return analyticsData.deployments.map((deployment: any) => ({
      id: deployment.id,
      site: deployment.siteName,
      status: deployment.status,
      startDate: deployment.startDate,
      completionDate: deployment.completionDate,
      duration: deployment.duration,
      successRate: deployment.successRate,
      devices: deployment.deviceCount,
      issues: deployment.issueCount,
    }))
  }

  // Example transformation for site metrics
  if (analyticsData.sites) {
    return analyticsData.sites.map((site: any) => ({
      id: site.id,
      name: site.name,
      location: site.location,
      deploymentStatus: site.status,
      devices: site.deviceCount,
      completionPercentage: site.completionPercentage,
      lastUpdated: site.lastUpdated,
    }))
  }

  // Default case - return the data as is if it's already an array
  return Array.isArray(analyticsData) ? analyticsData : [analyticsData]
}
