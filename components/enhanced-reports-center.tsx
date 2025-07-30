"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import {
  CalendarIcon,
  Download,
  FileText,
  Filter,
  Plus,
  Search,
  Star,
  StarOff,
  FileSpreadsheet,
  FileJson,
  Clock,
  BarChart,
  Users,
  Network,
  Shield,
  CheckCircle,
  AlertCircle,
  Trash2,
  Share2,
  Eye,
  EyeOff,
  ChevronDown,
  RefreshCw,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { exportData } from "@/lib/export-utils"
import { LoadingSpinner } from "@/components/loading"

// Sample data for demonstration
const sampleReports = [
  {
    id: "REP-001",
    name: "Monthly Deployment Summary",
    description: "Summary of all deployments for the current month",
    type: "Deployment",
    format: "PDF",
    createdAt: "2023-09-15",
    createdBy: "John Smith",
    status: "Completed",
    downloads: 12,
    isFavorite: true,
    isPublic: true,
    lastGenerated: "2023-09-15",
    nextScheduled: "2023-10-15",
    tags: ["monthly", "summary", "deployment"],
  },
  {
    id: "REP-002",
    name: "Quarterly Security Compliance",
    description: "Security compliance status across all sites",
    type: "Security",
    format: "Excel",
    createdAt: "2023-08-22",
    createdBy: "Sarah Johnson",
    status: "Completed",
    downloads: 8,
    isFavorite: false,
    isPublic: true,
    lastGenerated: "2023-08-22",
    nextScheduled: "2023-11-22",
    tags: ["quarterly", "compliance", "security"],
  },
  {
    id: "REP-003",
    name: "Device Authentication Report",
    description: "Detailed report on device authentication methods and success rates",
    type: "Authentication",
    format: "PDF",
    createdAt: "2023-09-10",
    createdBy: "Michael Brown",
    status: "Completed",
    downloads: 5,
    isFavorite: true,
    isPublic: false,
    lastGenerated: "2023-09-10",
    nextScheduled: null,
    tags: ["authentication", "devices", "security"],
  },
  {
    id: "REP-004",
    name: "Network Access Control Audit",
    description: "Audit of all network access control policies and enforcement",
    type: "Audit",
    format: "PDF",
    createdAt: "2023-09-05",
    createdBy: "Emily Davis",
    status: "In Progress",
    downloads: 0,
    isFavorite: false,
    isPublic: false,
    lastGenerated: null,
    nextScheduled: null,
    tags: ["audit", "nac", "policies"],
  },
  {
    id: "REP-005",
    name: "User Activity Summary",
    description: "Summary of user authentication and access activities",
    type: "User",
    format: "CSV",
    createdAt: "2023-09-01",
    createdBy: "John Smith",
    status: "Completed",
    downloads: 15,
    isFavorite: false,
    isPublic: true,
    lastGenerated: "2023-09-01",
    nextScheduled: "2023-10-01",
    tags: ["users", "activity", "monthly"],
  },
]

const reportTemplates = [
  {
    id: "template-1",
    name: "Deployment Summary",
    description: "Overview of deployment status, progress, and metrics",
    icon: <BarChart className="h-8 w-8" />,
    complexity: "Simple",
    estimatedTime: "< 1 minute",
  },
  {
    id: "template-2",
    name: "User Authentication Report",
    description: "Detailed analysis of user authentication methods and success rates",
    icon: <Users className="h-8 w-8" />,
    complexity: "Medium",
    estimatedTime: "1-2 minutes",
  },
  {
    id: "template-3",
    name: "Network Access Control Audit",
    description: "Comprehensive audit of NAC policies and enforcement",
    icon: <Network className="h-8 w-8" />,
    complexity: "Complex",
    estimatedTime: "2-3 minutes",
  },
  {
    id: "template-4",
    name: "Security Compliance Report",
    description: "Assessment of security compliance across all sites",
    icon: <Shield className="h-8 w-8" />,
    complexity: "Complex",
    estimatedTime: "2-3 minutes",
  },
  {
    id: "template-5",
    name: "Device Status Report",
    description: "Status and health of all devices in the network",
    icon: <CheckCircle className="h-8 w-8" />,
    complexity: "Medium",
    estimatedTime: "1-2 minutes",
  },
  {
    id: "template-6",
    name: "Issue & Resolution Report",
    description: "Summary of issues encountered and their resolutions",
    icon: <AlertCircle className="h-8 w-8" />,
    complexity: "Medium",
    estimatedTime: "1-2 minutes",
  },
]

export function EnhancedReportsCenter() {
  const [activeTab, setActiveTab] = useState("all-reports")
  const [reports, setReports] = useState(sampleReports)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedReportType, setSelectedReportType] = useState<string | null>("")
  const [selectedFormat, setSelectedFormat] = useState<string | null>("")
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [showOnlyPublic, setShowOnlyPublic] = useState(false)

  // New report wizard state
  const [wizardStep, setWizardStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [reportFormat, setReportFormat] = useState("PDF")
  const [isPublic, setIsPublic] = useState(false)
  const [scheduleReport, setScheduleReport] = useState(false)
  const [scheduleFrequency, setScheduleFrequency] = useState("monthly")
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date())

  // Simulate data fetching
  const fetchReports = async () => {
    setIsLoading(true)
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setReports(sampleReports)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchReports()
  }, [])

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    // Search query filter
    if (
      searchQuery &&
      !report.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !report.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Report type filter
    if (selectedReportType && report.type !== selectedReportType) {
      return false
    }

    // Format filter
    if (selectedFormat && report.format !== selectedFormat) {
      return false
    }

    // Favorites filter
    if (showOnlyFavorites && !report.isFavorite) {
      return false
    }

    // Public/private filter
    if (showOnlyPublic && !report.isPublic) {
      return false
    }

    return true
  })

  // Toggle favorite status
  const toggleFavorite = (reportId: string) => {
    setReports(
      reports.map((report) => (report.id === reportId ? { ...report, isFavorite: !report.isFavorite } : report)),
    )
  }

  // Toggle public status
  const togglePublic = (reportId: string) => {
    setReports(reports.map((report) => (report.id === reportId ? { ...report, isPublic: !report.isPublic } : report)))
  }

  // Delete report
  const deleteReport = (reportId: string) => {
    setReports(reports.filter((report) => report.id !== reportId))
  }

  // Handle report generation
  const handleGenerateReport = () => {
    // Reset wizard
    setWizardStep(1)
    setSelectedTemplate(null)
    setReportName("")
    setReportDescription("")
    setReportFormat("PDF")
    setIsPublic(false)
    setScheduleReport(false)
    setScheduleFrequency("monthly")
    setScheduleDate(new Date())

    // Switch to all reports tab
    setActiveTab("all-reports")

    // In a real application, you would make an API call to generate the report
    // and then update the reports list
  }

  // Handle export functionality
  const handleExport = (format: "csv" | "excel" | "json") => {
    try {
      const dataToExport = filteredReports.map((report) => ({
        id: report.id,
        name: report.name,
        type: report.type,
        format: report.format,
        createdAt: report.createdAt,
        createdBy: report.createdBy,
        status: report.status,
        downloads: report.downloads,
        lastGenerated: report.lastGenerated || "N/A",
        nextScheduled: report.nextScheduled || "N/A",
      }))

      exportData(dataToExport, format, "portnox-reports-list")
    } catch (error) {
      console.error("Error exporting data:", error)
      // In a real application, you would show a toast notification here
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports Center</h2>
          <p className="text-muted-foreground">Generate, manage, and schedule reports for your Portnox deployments</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setActiveTab("new-report")}>
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </Button>

          <Select value={selectedReportType} onValueChange={(value) => setSelectedReportType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Deployment">Deployment</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Authentication">Authentication</SelectItem>
              <SelectItem value="Audit">Audit</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchReports}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all-reports" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="all-reports">All Reports</TabsTrigger>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          <TabsTrigger value="new-report">New Report</TabsTrigger>
        </TabsList>

        <TabsContent value="all-reports" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn(showOnlyFavorites && "bg-secondary")}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              >
                <Star className="mr-2 h-4 w-4" />
                Favorites
              </Button>

              <Button
                variant="outline"
                size="sm"
                className={cn(showOnlyPublic && "bg-secondary")}
                onClick={() => setShowOnlyPublic(!showOnlyPublic)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Public
              </Button>

              <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value)}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Formats</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="JSON">JSON</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="end">
                  <div className="p-2">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport("csv")}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export as CSV
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport("excel")}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export as Excel
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => handleExport("json")}>
                      <FileJson className="mr-2 h-4 w-4" />
                      Export as JSON
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.length}</div>
                <p className="text-xs text-muted-foreground">Available reports</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.filter((r) => r.status === "Completed").length}</div>
                <p className="text-xs text-muted-foreground">Ready for download</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scheduled Reports</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.filter((r) => r.nextScheduled !== null).length}</div>
                <p className="text-xs text-muted-foreground">Upcoming reports</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reports.reduce((acc, report) => acc + report.downloads, 0)}</div>
                <p className="text-xs text-muted-foreground">Across all reports</p>
              </CardContent>
            </Card>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or create a new report.</p>
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card key={report.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{report.name}</h3>
                          <Badge variant={report.status === "Completed" ? "outline" : "secondary"}>
                            {report.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(report.id)}
                            title={report.isFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            {report.isFavorite ? (
                              <Star className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublic(report.id)}
                            title={report.isPublic ? "Make private" : "Make public"}
                          >
                            {report.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReport(report.id)}
                            title="Delete report"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Type</div>
                          <div>{report.type}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Format</div>
                          <div>{report.format}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Created</div>
                          <div>{report.createdAt}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Created By</div>
                          <div>{report.createdBy}</div>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Downloads</div>
                          <div>{report.downloads}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Last Generated</div>
                          <div>{report.lastGenerated || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Next Scheduled</div>
                          <div>{report.nextScheduled || "N/A"}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Tags</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {report.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button size="sm" disabled={report.status !== "Completed"}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Reports</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {isLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="space-y-4">
              {reports.filter((report) => report.createdBy === "John Smith").length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
                  <p className="text-muted-foreground">You haven't created any reports yet.</p>
                </div>
              ) : (
                reports
                  .filter((report) => report.createdBy === "John Smith")
                  .map((report) => (
                    <Card key={report.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{report.name}</h3>
                            <Badge variant={report.status === "Completed" ? "outline" : "secondary"}>
                              {report.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFavorite(report.id)}
                              title={report.isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              {report.isFavorite ? (
                                <Star className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <StarOff className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteReport(report.id)}
                              title="Delete report"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardDescription>{report.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Type</div>
                            <div>{report.type}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Format</div>
                            <div>{report.format}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Created</div>
                            <div>{report.createdAt}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Downloads</div>
                            <div>{report.downloads}</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </Button>
                        <Button size="sm" disabled={report.status !== "Completed"}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new-report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Report</CardTitle>
              <CardDescription>Generate a new report based on your requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 1: Select a Template</h3>
                    <p className="text-muted-foreground">Choose a report template to get started</p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {reportTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={cn(
                            "border rounded-lg p-4 cursor-pointer transition-all",
                            selectedTemplate === template.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50",
                          )}
                          onClick={() => setSelectedTemplate(template.id)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-md text-primary">{template.icon}</div>
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {template.complexity} • {template.estimatedTime}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 2: Configure Report</h3>
                    <p className="text-muted-foreground">Provide details for your report</p>

                    <div className="space-y-4 mt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="report-name">Report Name</Label>
                        <Input
                          id="report-name"
                          placeholder="Enter report name"
                          value={reportName}
                          onChange={(e) => setReportName(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="report-description">Description</Label>
                        <Input
                          id="report-description"
                          placeholder="Enter report description"
                          value={reportDescription}
                          onChange={(e) => setReportDescription(e.target.value)}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="report-format">Format</Label>
                        <Select value={reportFormat} onValueChange={setReportFormat}>
                          <SelectTrigger id="report-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PDF">PDF</SelectItem>
                            <SelectItem value="Excel">Excel</SelectItem>
                            <SelectItem value="CSV">CSV</SelectItem>
                            <SelectItem value="JSON">JSON</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="public-report"
                          checked={isPublic}
                          onCheckedChange={(checked) => setIsPublic(checked as boolean)}
                        />
                        <Label htmlFor="public-report">Make this report public</Label>
                      </div>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Step 3: Schedule (Optional)</h3>
                    <p className="text-muted-foreground">Set up automatic report generation</p>

                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="schedule-report"
                          checked={scheduleReport}
                          onCheckedChange={(checked) => setScheduleReport(checked as boolean)}
                        />
                        <Label htmlFor="schedule-report">Schedule this report</Label>
                      </div>

                      {scheduleReport && (
                        <div className="space-y-4 pl-6">
                          <div className="grid gap-2">
                            <Label>Frequency</Label>
                            <RadioGroup value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="daily" id="daily" />
                                <Label htmlFor="daily">Daily</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="weekly" id="weekly" />
                                <Label htmlFor="weekly">Weekly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="monthly" id="monthly" />
                                <Label htmlFor="monthly">Monthly</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="quarterly" id="quarterly" />
                                <Label htmlFor="quarterly">Quarterly</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="grid gap-2">
                            <Label>Start Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal bg-transparent"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {scheduleDate ? format(scheduleDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={scheduleDate}
                                  onSelect={setScheduleDate}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {wizardStep > 1 ? (
                <Button variant="outline" onClick={() => setWizardStep(wizardStep - 1)}>
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setActiveTab("all-reports")}>
                  Cancel
                </Button>
              )}

              {wizardStep < 3 ? (
                <Button onClick={() => setWizardStep(wizardStep + 1)} disabled={wizardStep === 1 && !selectedTemplate}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleGenerateReport}>Generate Report</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
