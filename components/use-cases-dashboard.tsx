"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScopingQuestionnaire } from "./scoping-questionnaire"
import {
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Target,
  Shield,
  Network,
  Settings,
  TrendingUp,
  Activity,
} from "lucide-react"

interface UseCase {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  status: "pending" | "in-progress" | "completed" | "failed"
  priority: "mandatory" | "optional" | "nice-to-have"
  completion_percentage: number
  notes?: string
  created_at: string
  updated_at: string
  test_cases?: TestCase[]
  requirements?: Requirement[]
  documentation_links?: DocumentationLink[]
  success_criteria?: SuccessCriteria[]
}

interface TestCase {
  id: string
  name: string
  description: string
  expected_outcome: string
  status: "pending" | "in-progress" | "completed" | "failed"
  actual_outcome?: string
  test_date?: string
  tester_name?: string
}

interface Requirement {
  id: string
  type: "functional" | "non-functional"
  description: string
  justification?: string
  status: "met" | "not-met" | "partially-met"
}

interface DocumentationLink {
  id: number
  title: string
  url: string
  description?: string
}

interface SuccessCriteria {
  id: number
  criteria: string
  is_met: boolean
}

export function UseCasesDashboard() {
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>([])
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showScoping, setShowScoping] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUseCases()
  }, [])

  useEffect(() => {
    filterUseCases()
  }, [useCases, searchTerm, statusFilter, categoryFilter, priorityFilter])

  const loadUseCases = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/use-cases")
      if (response.ok) {
        const data = await response.json()
        setUseCases(data)
      }
    } catch (error) {
      console.error("Error loading use cases:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterUseCases = () => {
    let filtered = useCases

    if (searchTerm) {
      filtered = filtered.filter(
        (uc) =>
          uc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          uc.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((uc) => uc.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((uc) => uc.category.includes(categoryFilter))
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((uc) => uc.priority === priorityFilter)
    }

    setFilteredUseCases(filtered)
  }

  const updateUseCaseStatus = async (id: string, status: string, completionPercentage: number) => {
    try {
      const response = await fetch(`/api/use-cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          completion_percentage: completionPercentage,
          updated_at: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        await loadUseCases()
      }
    } catch (error) {
      console.error("Error updating use case:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "mandatory":
        return "bg-red-100 text-red-800 border-red-200"
      case "optional":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes("cert-auth")) return <Shield className="h-4 w-4" />
    if (category.includes("network")) return <Network className="h-4 w-4" />
    if (category.includes("compliance")) return <FileText className="h-4 w-4" />
    if (category.includes("security")) return <Shield className="h-4 w-4" />
    if (category.includes("integration")) return <Settings className="h-4 w-4" />
    if (category.includes("infrastructure")) return <Activity className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  const getOverallStats = () => {
    const total = useCases.length
    const completed = useCases.filter((uc) => uc.status === "completed").length
    const inProgress = useCases.filter((uc) => uc.status === "in-progress").length
    const pending = useCases.filter((uc) => uc.status === "pending").length
    const failed = useCases.filter((uc) => uc.status === "failed").length
    const mandatory = useCases.filter((uc) => uc.priority === "mandatory").length
    const overallCompletion = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, pending, failed, mandatory, overallCompletion }
  }

  const stats = getOverallStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Use Cases</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Overall Progress</p>
                <p className="text-2xl font-bold text-purple-900">{stats.overallCompletion}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>POC Progress Overview</span>
            <Button
              onClick={() => setShowScoping(true)}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Start Scoping
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">
                {stats.completed}/{stats.total} use cases
              </span>
            </div>
            <Progress value={stats.overallCompletion} className="h-3" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.mandatory}</div>
                <div className="text-xs text-muted-foreground">Mandatory</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search use cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cert-auth">Certificate Auth</SelectItem>
                  <SelectItem value="wifi">WiFi</SelectItem>
                  <SelectItem value="wired">Wired</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="mandatory">Mandatory</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                  <SelectItem value="nice-to-have">Nice to Have</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUseCases.map((useCase) => (
          <Card
            key={useCase.id}
            className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(useCase.category)}
                  <Badge variant="outline" className="text-xs">
                    {useCase.id}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Badge className={`text-xs ${getStatusColor(useCase.status)}`}>
                    {getStatusIcon(useCase.status)}
                    <span className="ml-1 capitalize">{useCase.status.replace("-", " ")}</span>
                  </Badge>
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{useCase.title}</CardTitle>
              {useCase.subtitle && <p className="text-sm text-muted-foreground">{useCase.subtitle}</p>}
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{useCase.description}</p>

              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${getPriorityColor(useCase.priority)}`}>{useCase.priority}</Badge>
                <span className="text-sm font-medium">{useCase.completion_percentage}%</span>
              </div>

              <Progress value={useCase.completion_percentage} className="h-2" />

              <div className="flex justify-between items-center pt-2">
                <div className="flex space-x-2">
                  {useCase.test_cases && useCase.test_cases.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {useCase.test_cases.length} Tests
                    </Badge>
                  )}
                  {useCase.requirements && useCase.requirements.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {useCase.requirements.length} Reqs
                    </Badge>
                  )}
                </div>

                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUseCase(useCase)
                      setShowDetails(true)
                    }}
                  >
                    Details
                  </Button>

                  <Select
                    value={useCase.status}
                    onValueChange={(value) => {
                      const completion =
                        value === "completed"
                          ? 100
                          : value === "in-progress"
                            ? 50
                            : value === "failed"
                              ? 0
                              : useCase.completion_percentage
                      updateUseCaseStatus(useCase.id, value, completion)
                    }}
                  >
                    <SelectTrigger className="w-24 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Use Case Details Modal */}
      {selectedUseCase && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getCategoryIcon(selectedUseCase.category)}
                <span>{selectedUseCase.title}</span>
                <Badge className={`${getStatusColor(selectedUseCase.status)}`}>{selectedUseCase.status}</Badge>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tests">Test Cases</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={selectedUseCase.status}
                      onValueChange={(value) => {
                        const completion =
                          value === "completed"
                            ? 100
                            : value === "in-progress"
                              ? 50
                              : value === "failed"
                                ? 0
                                : selectedUseCase.completion_percentage
                        updateUseCaseStatus(selectedUseCase.id, value, completion)
                        setSelectedUseCase({
                          ...selectedUseCase,
                          status: value as any,
                          completion_percentage: completion,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Completion</Label>
                    <div className="flex items-center space-x-2">
                      <Progress value={selectedUseCase.completion_percentage} className="flex-1" />
                      <span className="text-sm font-medium">{selectedUseCase.completion_percentage}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea value={selectedUseCase.description} readOnly className="mt-1" rows={4} />
                </div>

                {selectedUseCase.success_criteria && selectedUseCase.success_criteria.length > 0 && (
                  <div>
                    <Label>Success Criteria</Label>
                    <div className="space-y-2 mt-2">
                      {selectedUseCase.success_criteria.map((criteria) => (
                        <div key={criteria.id} className="flex items-center space-x-2">
                          <Checkbox checked={criteria.is_met} readOnly />
                          <span className="text-sm">{criteria.criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedUseCase.notes && (
                  <div>
                    <Label>Notes</Label>
                    <Textarea value={selectedUseCase.notes} readOnly className="mt-1" rows={3} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tests" className="space-y-4">
                {selectedUseCase.test_cases && selectedUseCase.test_cases.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUseCase.test_cases.map((testCase) => (
                      <Card key={testCase.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{testCase.name}</CardTitle>
                            <Badge className={`${getStatusColor(testCase.status)}`}>{testCase.status}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm font-medium">Description</Label>
                              <p className="text-sm text-muted-foreground">{testCase.description}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Expected Outcome</Label>
                              <p className="text-sm text-muted-foreground">{testCase.expected_outcome}</p>
                            </div>
                            {testCase.actual_outcome && (
                              <div>
                                <Label className="text-sm font-medium">Actual Outcome</Label>
                                <p className="text-sm text-muted-foreground">{testCase.actual_outcome}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No test cases defined for this use case.</div>
                )}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                {selectedUseCase.requirements && selectedUseCase.requirements.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUseCase.requirements.map((requirement) => (
                      <Card key={requirement.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="outline">{requirement.id}</Badge>
                                <Badge variant={requirement.type === "functional" ? "default" : "secondary"}>
                                  {requirement.type}
                                </Badge>
                                <Badge
                                  className={
                                    requirement.status === "met"
                                      ? "bg-green-100 text-green-800"
                                      : requirement.status === "partially-met"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }
                                >
                                  {requirement.status}
                                </Badge>
                              </div>
                              <p className="text-sm">{requirement.description}</p>
                              {requirement.justification && (
                                <p className="text-xs text-muted-foreground mt-1">{requirement.justification}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No requirements linked to this use case.</div>
                )}
              </TabsContent>

              <TabsContent value="documentation" className="space-y-4">
                {selectedUseCase.documentation_links && selectedUseCase.documentation_links.length > 0 ? (
                  <div className="space-y-4">
                    {selectedUseCase.documentation_links.map((link) => (
                      <Card key={link.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {link.title}
                            </a>
                          </div>
                          {link.description && <p className="text-sm text-muted-foreground mt-1">{link.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No documentation links available for this use case.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Scoping Questionnaire Modal */}
      <ScopingQuestionnaire
        isOpen={showScoping}
        onClose={() => setShowScoping(false)}
        onSave={async (data) => {
          try {
            const response = await fetch("/api/scoping", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            })
            if (response.ok) {
              console.log("Scoping questionnaire saved successfully")
            }
          } catch (error) {
            console.error("Error saving scoping questionnaire:", error)
          }
        }}
      />
    </div>
  )
}
