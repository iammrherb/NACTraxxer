"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { ReportParameters } from "@/lib/reports"

interface Report {
  id: number
  title: string
  report_type: string
  generated_by_name: string
  generated_at: string
  download_count: number
  file_path: string
}

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
    try {
      const response = await fetch("/api/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error("Error loading reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportParams),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Report generated successfully! You will receive an email notification.",
        })
        setShowGenerateDialog(false)
        loadReports()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate report")
      }
    } catch (error) {
      console.error("Report generation error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to generate report",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = async (reportId: number, filename: string) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive",
      })
    }
  }

  const getReportTypeLabel = (type: string) => {
    const labels = {
      site_summary: "Site Summary",
      progress_report: "Progress Report",
      deployment_status: "Deployment Status",
      user_activity: "User Activity",
      custom: "Custom Report",
    }
    return labels[type] || type
  }

  const getReportTypeColor = (type: string) => {
    const colors = {
      site_summary: "bg-blue-100 text-blue-800",
      progress_report: "bg-green-100 text-green-800",
      deployment_status: "bg-orange-100 text-orange-800",
      user_activity: "bg-purple-100 text-purple-800",
      custom: "bg-gray-100 text-gray-800",
    }
    return colors[type] || colors.custom
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4" />
              <p>No reports generated yet</p>
              <p className="text-sm">Click "Generate Report" to create your first report</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{report.title}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Badge className={getReportTypeColor(report.report_type)}>
                          {getReportTypeLabel(report.report_type)}
                        </Badge>
                        <span>•</span>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {report.generated_by_name}
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.generated_at).toLocaleDateString()}
                        </div>
                        <span>•</span>
                        <span>{report.download_count} downloads</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadReport(report.id, `${report.title}.pdf`)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateDialog} onOpenChange={setShowGenerateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate New Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
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
                  <SelectItem value="custom">Custom Report</SelectItem>
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
                    setReportParams((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange!, start: e.target.value },
                    }))
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
                    setReportParams((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange!, end: e.target.value },
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCharts"
                checked={reportParams.includeCharts}
                onCheckedChange={(checked) =>
                  setReportParams((prev) => ({
                    ...prev,
                    includeCharts: checked as boolean,
                  }))
                }
              />
              <Label htmlFor="includeCharts">Include charts and visualizations</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowGenerateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={generateReport} disabled={generating}>
                {generating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
