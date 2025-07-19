"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testMatrixData, useCasesData, requirementsData } from "@/lib/test-matrix-data"
import {
  Search,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Monitor,
  Laptop,
  Smartphone,
  Wifi,
  Cable,
  Shield,
  Activity,
} from "lucide-react"

export function TestMatrixDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredData = useMemo(() => {
    return testMatrixData.filter((entry) => {
      const matchesSearch =
        entry.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.mode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.notes.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesPlatform = platformFilter === "all" || entry.platform === platformFilter
      const matchesType = typeFilter === "all" || entry.type === typeFilter

      return matchesSearch && matchesPlatform && matchesType
    })
  }, [searchTerm, platformFilter, typeFilter])

  const getStatusIcon = (status: string) => {
    if (status.includes("Completed") || status.includes("Passed")) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    } else if (status.includes("Failed") || status.includes("WIP")) {
      return <XCircle className="h-4 w-4 text-red-500" />
    } else if (status.includes("Progress")) {
      return <Clock className="h-4 w-4 text-yellow-500" />
    } else if (status.includes("Not Start")) {
      return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
    return <div className="h-4 w-4 rounded-full bg-gray-300" />
  }

  const getStatusColor = (status: string) => {
    if (status.includes("Completed") || status.includes("Passed")) {
      return "bg-green-100 text-green-800 border-green-200"
    } else if (status.includes("Failed") || status.includes("WIP")) {
      return "bg-red-100 text-red-800 border-red-200"
    } else if (status.includes("Progress")) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    } else if (status.includes("Not Start")) {
      return "bg-gray-100 text-gray-800 border-gray-200"
    }
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getPlatformIcon = (platform: string) => {
    if (platform.includes("Windows")) return <Monitor className="h-4 w-4" />
    if (platform.includes("MacOS")) return <Laptop className="h-4 w-4" />
    if (platform.includes("iOS")) return <Smartphone className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getTypeIcon = (type: string) => {
    if (type.includes("Wireless")) return <Wifi className="h-4 w-4" />
    if (type.includes("Wired")) return <Cable className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  const exportToCSV = () => {
    const headers = [
      "Platform",
      "Mode",
      "Type",
      "Portnox Cloud Config",
      "NAS Config",
      "MDM Config",
      "802.1X Test",
      "Manual Block",
      "ACL Test",
      "Risk Assessment",
      "Remediation",
      "Notes",
    ]

    const csvData = filteredData.map((entry) => [
      entry.platform,
      entry.mode,
      entry.type,
      entry.configurationPortnoxCloud,
      entry.configurationCalixNAS,
      entry.configurationIntuneJamf,
      entry.dot1xConnectionTest,
      entry.manualBlockByAdmin,
      entry.aclTest,
      entry.riskAssessmentPolicyTest,
      entry.remediationPolicyTest,
      entry.notes,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `portnox-test-matrix-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-6 w-6" />
              <span>Comprehensive Test Matrix</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search platforms, modes, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="Windows">Windows</SelectItem>
                <SelectItem value="MacOS">MacOS</SelectItem>
                <SelectItem value="iOS(iPhone & iPad)">iOS</SelectItem>
                <SelectItem value="Rogue Devices">Rogue Devices</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Wired">Wired</SelectItem>
                <SelectItem value="Wireless - NAC">Wireless - NAC</SelectItem>
                <SelectItem value="Wireless">Wireless</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Test Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Platform</th>
                  <th className="text-left p-3 font-semibold">Mode</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Cloud Config</th>
                  <th className="text-left p-3 font-semibold">NAS Config</th>
                  <th className="text-left p-3 font-semibold">MDM Config</th>
                  <th className="text-left p-3 font-semibold">802.1X Test</th>
                  <th className="text-left p-3 font-semibold">Manual Block</th>
                  <th className="text-left p-3 font-semibold">ACL Test</th>
                  <th className="text-left p-3 font-semibold">Risk Assessment</th>
                  <th className="text-left p-3 font-semibold">Remediation</th>
                  <th className="text-left p-3 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(entry.platform)}
                        <span className="font-medium">{entry.platform}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">
                        {entry.mode}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(entry.type)}
                        <span>{entry.type}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.configurationPortnoxCloud)}
                        <Badge className={`text-xs ${getStatusColor(entry.configurationPortnoxCloud)}`}>
                          {entry.configurationPortnoxCloud}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.configurationCalixNAS)}
                        <Badge className={`text-xs ${getStatusColor(entry.configurationCalixNAS)}`}>
                          {entry.configurationCalixNAS}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.configurationIntuneJamf)}
                        <Badge className={`text-xs ${getStatusColor(entry.configurationIntuneJamf)}`}>
                          {entry.configurationIntuneJamf}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.dot1xConnectionTest)}
                        <Badge className={`text-xs ${getStatusColor(entry.dot1xConnectionTest)}`}>
                          {entry.dot1xConnectionTest.length > 10
                            ? entry.dot1xConnectionTest.substring(0, 10) + "..."
                            : entry.dot1xConnectionTest}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.manualBlockByAdmin)}
                        <Badge className={`text-xs ${getStatusColor(entry.manualBlockByAdmin)}`}>
                          {entry.manualBlockByAdmin.length > 10
                            ? entry.manualBlockByAdmin.substring(0, 10) + "..."
                            : entry.manualBlockByAdmin}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.aclTest)}
                        <Badge className={`text-xs ${getStatusColor(entry.aclTest)}`}>{entry.aclTest}</Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.riskAssessmentPolicyTest)}
                        <Badge className={`text-xs ${getStatusColor(entry.riskAssessmentPolicyTest)}`}>
                          {entry.riskAssessmentPolicyTest.length > 10
                            ? entry.riskAssessmentPolicyTest.substring(0, 10) + "..."
                            : entry.riskAssessmentPolicyTest}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(entry.remediationPolicyTest)}
                        <Badge className={`text-xs ${getStatusColor(entry.remediationPolicyTest)}`}>
                          {entry.remediationPolicyTest.length > 10
                            ? entry.remediationPolicyTest.substring(0, 10) + "..."
                            : entry.remediationPolicyTest}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 max-w-xs">
                      <div className="truncate" title={entry.notes}>
                        {entry.notes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No test entries found matching your criteria.</div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Test Scenarios</p>
                <p className="text-2xl font-bold">{testMatrixData.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Platforms Tested</p>
                <p className="text-2xl font-bold">{new Set(testMatrixData.map((entry) => entry.platform)).size}</p>
              </div>
              <Monitor className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Tests</p>
                <p className="text-2xl font-bold">
                  {
                    testMatrixData.filter(
                      (entry) =>
                        entry.configurationPortnoxCloud === "Completed" &&
                        entry.configurationCalixNAS === "Completed" &&
                        entry.configurationIntuneJamf === "Completed",
                    ).length
                  }
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Issues Found</p>
                <p className="text-2xl font-bold">
                  {
                    testMatrixData.filter(
                      (entry) =>
                        entry.dot1xConnectionTest.includes("Failed") ||
                        entry.aclTest.includes("Failed") ||
                        entry.riskAssessmentPolicyTest.includes("Failed"),
                    ).length
                  }
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Use Cases and Requirements Integration */}
      <Tabs defaultValue="use-cases" className="space-y-4">
        <TabsList>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
        </TabsList>

        <TabsContent value="use-cases">
          <Card>
            <CardHeader>
              <CardTitle>Use Cases Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {useCasesData.map((useCase) => (
                  <div key={useCase.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {useCase.id}: {useCase.title}
                      </h3>
                      <Badge variant={useCase.pocScope === "Mandatory" ? "default" : "secondary"}>
                        {useCase.pocScope}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{useCase.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {useCase.requirementIds.map((reqId) => (
                        <Badge key={reqId} variant="outline" className="text-xs">
                          {reqId}
                        </Badge>
                      ))}
                    </div>
                    {useCase.comments && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        <strong>Comments:</strong> {useCase.comments}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Requirements Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-semibold">Requirement ID</th>
                      <th className="text-left p-3 font-semibold">Description</th>
                      <th className="text-left p-3 font-semibold">Justification</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirementsData.map((req) => (
                      <tr key={req.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Badge variant="outline">{req.id}</Badge>
                        </td>
                        <td className="p-3">{req.description}</td>
                        <td className="p-3 text-sm text-gray-600">{req.justification}</td>
                        <td className="p-3">
                          <Badge
                            className={
                              req.metStatus === "Met" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                          >
                            {req.metStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
