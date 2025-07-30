"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  FileText,
  Download,
  Calendar,
  Plus,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Report {
  id: string
  name: string
  type: "deployment" | "progress" | "compliance" | "performance"
  status: "completed" | "generating" | "scheduled" | "failed"
  createdAt: string
  createdBy: string
  size: string
  downloadUrl?: string
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  fields: string[]
  schedule?: string
}

const mockReports: Report[] = [
  {
    id: "1",
    name: "Monthly Deployment Summary",
    type: "deployment",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "John Doe",
    size: "2.4 MB",
    downloadUrl: "/reports/monthly-deployment-jan-2024.pdf",
  },
  {
    id: "2",
    name: "Site Progress Report",
    type: "progress",
    status: "generating",
    createdAt: "2024-01-15T14:20:00Z",
    createdBy: "Jane Smith",
    size: "Generating...",
  },
  {
    id: "3",
    name: "Compliance Audit Report",
    type: "compliance",
    status: "completed",
    createdAt: "2024-01-14T09:15:00Z",
    createdBy: "Mike Johnson",
    size: "5.1 MB",
    downloadUrl: "/reports/compliance-audit-jan-2024.pdf",
  },
  {
    id: "4",
    name: "Performance Analytics",
    type: "performance",
    status: "scheduled",
    createdAt: "2024-01-16T08:00:00Z",
    createdBy: "System",
    size: "Scheduled",
  },
]

const reportTemplates: ReportTemplate[] = [
  {
    id: "deployment-summary",
    name: "Deployment Summary",
    description: "Comprehensive overview of deployment progress across all sites",
    type: "deployment",
    fields: ["Site Status", "Completion Percentage", "Timeline", "Issues", "Resources"],
  },
  {
    id: "progress-tracking",
    name: "Progress Tracking",
    description: "Detailed progress tracking with milestones and deliverables",
    type: "progress",
    fields: ["Milestones", "Use Cases", "Checklist Items", "Timeline", "Dependencies"],
  },
  {
    id: "compliance-audit",
    name: "Compliance Audit",
    description: "Security and compliance status across all deployments",
    type: "compliance",
    fields: ["Security Policies", "Compliance Status", "Audit Trail", "Certifications"],
  },
  {
    id: "performance-metrics",
    name: "Performance Metrics",
    description: "Performance analytics and KPI tracking",
    type: "performance",
    fields: ["KPIs", "Performance Trends", "Resource Utilization", "Success Rates"],
  },
]

export function ReportsCenter() {
  const [reports, setReports] = useState<Report[]>(mockReports)
  const [filteredReports, setFilteredReports] = useState<Report[]>(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")

  useEffect(() => {
    let filtered = reports

    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.createdBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((report) => report.type === typeFilter)
    }

    setFilteredReports(filtered)
  }, [reports, searchTerm, statusFilter, typeFilter])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "generating":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />
      case "scheduled":
        return <Calendar className="h-4 w-4 text-orange-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      generating: "secondary",
      scheduled: "outline",
      failed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "deployment":
        return <BarChart3 className="h-4 w-4" />
      case "progress":
        return <TrendingUp className="h-4 w-4" />
      case "compliance":
        return <CheckCircle className="h-4 w-4" />
      case "performance":
        return <PieChart className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate || !reportName) return

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      type: (reportTemplates.find((t) => t.id === selectedTemplate)?.type as any) || "deployment",
      status: "generating",
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
      size: "Generating...",
    }

    setReports((prev) => [newReport, ...prev])
    setIsGenerateDialogOpen(false)
    setSelectedTemplate("")
    setReportName("")
    setReportDescription("")

    // Simulate report generation
    setTimeout(() => {
      setReports((prev) =>
        prev.map((report) =>
          report.id === newReport.id
            ? {
                ...report,
                status: "completed",
                size: "3.2 MB",
                downloadUrl: `/reports/${report.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
              }
            : report,
        ),
      )
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reports Center</h2>
          <p className="text-muted-foreground">Generate and manage deployment reports</p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
              <DialogDescription>Create a custom report using one of our templates</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template">Report Template</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(template.type)}
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">{template.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Template Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {reportTemplates.find((t) => t.id === selectedTemplate)?.description}
                      </p>
                      <div>
                        <p className="text-sm font-medium mb-2">Included Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {reportTemplates
                            .find((t) => t.id === selectedTemplate)
                            ?.fields.map((field) => (
                              <Badge key={field} variant="outline" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-2">
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDescription">Description (Optional)</Label>
                <Textarea
                  id="reportDescription"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Enter report description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleGenerateReport} disabled={!selectedTemplate || !reportName}>
                Generate Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
          <CardDescription>View and download your generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      <span className="capitalize">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      {getStatusBadge(report.status)}
                    </div>
                  </TableCell>
                  <TableCell>{report.createdBy}</TableCell>
                  <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{report.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.status === "completed" && report.downloadUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {report.status === "generating" && (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-1 animate-spin" />
                          Generating
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Templates</CardTitle>
          <CardDescription>Pre-configured report templates for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    {getTypeIcon(template.type)}
                    {template.name}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Included Fields:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.slice(0, 3).map((field) => (
                          <Badge key={field} variant="outline" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                        {template.fields.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.fields.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        setReportName(template.name)
                        setIsGenerateDialogOpen(true)
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
