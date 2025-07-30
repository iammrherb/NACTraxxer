"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Report, ReportParameters } from "@/lib/types"

export function ReportsDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const [reportParams, setReportParams] = useState<ReportParameters>({
    reportType: "site_summary",
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      end: new Date().toISOString().split("T")[0],
    },
    includeCharts: true,
  })

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/reports")
      if (!response.ok) throw new Error("Failed to fetch reports")
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Error loading reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportParams),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate report")
      }

      toast({
        title: "Success!",
        description: "Report generated successfully. You will receive an email notification shortly.",
      })
      setShowGenerateDialog(false)
      loadReports() // Refresh the list
    } catch (error) {
      console.error("Report generation error:", error)
      toast({
        title: "Error Generating Report",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadReport = async (report: Report) => {
    // Open the download link in a new tab immediately
    const link = document.createElement("a")
    link.href = report.url
    link.setAttribute("download", report.filename)
    link.setAttribute("target", "_blank")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Then, update the download count on the server in the background
    try {
      await fetch(`/api/reports/${report.id}/download`, { method: "POST" })
      // Optimistically update the UI with the new download count
      setReports(reports.map((r) => (r.id === report.id ? { ...r, download_count: r.download_count + 1 } : r)))
    } catch (error) {
      console.error("Failed to update download count:", error)
      // This is a non-critical error, so we don't show a toast to the user.
    }
  }

  const getReportTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      site_summary: "Site Summary",
      progress_report: "Progress Report",
      deployment_status: "Deployment Status",
      user_activity: "User Activity",
      custom: "Custom Report",
    }
    return labels[type] || type
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports Dashboard</h2>
          <p className="text-muted-foreground">Generate and manage deployment reports</p>
        </div>
        <Button onClick={() => setShowGenerateDialog(true)}>
          <FileText className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>Download previously generated PDF reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="font-semibold">No reports generated yet</p>
              <p className="text-sm">Click "Generate Report" to create your first one.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <div className="flex items-center flex-wrap gap-x-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{getReportTypeLabel(report.report_type)}</Badge>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {report.generated_by_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.generated_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          {report.download_count} downloads
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownloadReport(report)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
            <DialogDescription>Select the parameters for your new report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={reportParams.reportType}
                onValueChange={(value) => setReportParams((prev) => ({ ...prev, reportType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="site_summary">Site Summary Report</SelectItem>
                  <SelectItem value="progress_report">Progress Report</SelectItem>
                  <SelectItem value="deployment_status">Deployment Status Report</SelectItem>
                  <SelectItem value="user_activity">User Activity Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={reportParams.dateRange?.start}
                  onChange={(e) =>
                    setReportParams((prev) => ({ ...prev, dateRange: { ...prev.dateRange!, start: e.target.value } }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={reportParams.dateRange?.end}
                  onChange={(e) =>
                    setReportParams((prev) => ({ ...prev, dateRange: { ...prev.dateRange!, end: e.target.value } }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={reportParams.includeCharts}
                onCheckedChange={(checked) =>
                  setReportParams((prev) => ({ ...prev, includeCharts: checked as boolean }))
                }
              />
              <Label htmlFor="includeCharts">Include charts and visualizations</Label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={generating}>
                {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {generating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
