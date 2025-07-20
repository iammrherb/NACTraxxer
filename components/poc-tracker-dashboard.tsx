"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UseCaseForm } from "./use-case-form"
import { TestMatrixDashboard } from "./test-matrix-dashboard" // Re-using for content
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
  Activity,
  TestTube,
  ClipboardList,
} from "lucide-react"
import type { UseCase } from "@/lib/database"

export function POCTrackerDashboard() {
  const [useCases, setUseCases] = useState<UseCase[]>([])
  const [filteredUseCases, setFilteredUseCases] = useState<UseCase[]>([])
  const [editingUseCase, setEditingUseCase] = useState<UseCase | null>(null)
  const [showUseCaseForm, setShowUseCaseForm] = useState(false)
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
          (uc.description && uc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          uc.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (statusFilter !== "all") filtered = filtered.filter((uc) => uc.status === statusFilter)
    if (categoryFilter !== "all") filtered = filtered.filter((uc) => uc.category.includes(categoryFilter))
    if (priorityFilter !== "all") filtered = filtered.filter((uc) => uc.priority === priorityFilter)
    setFilteredUseCases(filtered)
  }

  const handleSaveUseCase = async (useCaseData: Partial<UseCase>) => {
    const url = editingUseCase ? `/api/use-cases/${editingUseCase.id}` : "/api/use-cases"
    const method = editingUseCase ? "PUT" : "POST"
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(useCaseData),
      })
      if (response.ok) {
        setShowUseCaseForm(false)
        setEditingUseCase(null)
        await loadUseCases()
      } else {
        console.error("Failed to save use case")
      }
    } catch (error) {
      console.error("Error saving use case:", error)
    }
  }

  const handleEditUseCase = (useCase: UseCase) => {
    setEditingUseCase(useCase)
    setShowUseCaseForm(true)
  }

  const handleAddUseCase = () => {
    setEditingUseCase(null)
    setShowUseCaseForm(true)
  }

  const updateUseCaseStatus = async (id: string, status: string) => {
    const useCase = useCases.find((uc) => uc.id === id)
    if (!useCase) return

    const completion = status === "completed" ? 100 : useCase.completion_percentage
    try {
      const response = await fetch(`/api/use-cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, completion_percentage: completion }),
      })
      if (response.ok) await loadUseCases()
    } catch (error) {
      console.error("Error updating use case status:", error)
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

  const stats = {
    total: useCases.length,
    completed: useCases.filter((uc) => uc.status === "completed").length,
    inProgress: useCases.filter((uc) => uc.status === "in-progress").length,
    pending: useCases.filter((uc) => uc.status === "pending").length,
    mandatory: useCases.filter((uc) => uc.priority === "mandatory").length,
    overallCompletion:
      useCases.length > 0
        ? Math.round(useCases.reduce((acc, uc) => acc + uc.completion_percentage, 0) / useCases.length)
        : 0,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6" />
              <span>POC Tracker Dashboard</span>
            </div>
            <Button onClick={handleAddUseCase}>
              <Plus className="h-4 w-4 mr-2" />
              Add Use Case
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Use Cases</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats.overallCompletion}%</p>
              <p className="text-xs text-muted-foreground">Overall Progress</p>
            </div>
          </div>
          <Progress value={stats.overallCompletion} className="mt-4 h-2" />
        </CardContent>
      </Card>

      <Tabs defaultValue="use-cases">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="use-cases">
            <Target className="h-4 w-4 mr-2" />
            Use Cases
          </TabsTrigger>
          <TabsTrigger value="test-matrix">
            <TestTube className="h-4 w-4 mr-2" />
            Test Matrix
          </TabsTrigger>
          <TabsTrigger value="requirements">
            <ClipboardList className="h-4 w-4 mr-2" />
            Requirements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="use-cases">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search use cases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-32">
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
                    <SelectTrigger className="w-full md:w-32">
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
                    <SelectTrigger className="w-full md:w-32">
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUseCases.map((useCase) => (
                  <Card key={useCase.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(useCase.category)}
                          <Badge variant="outline" className="text-xs">
                            {useCase.id}
                          </Badge>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(useCase.status)}`}>
                          {getStatusIcon(useCase.status)}
                          <span className="ml-1 capitalize">{useCase.status.replace("-", " ")}</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-lg leading-tight">{useCase.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 flex-grow">{useCase.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={`text-xs ${getPriorityColor(useCase.priority)}`}>{useCase.priority}</Badge>
                        <span className="text-sm font-medium">{useCase.completion_percentage}%</span>
                      </div>
                      <Progress value={useCase.completion_percentage} className="h-2" />
                    </CardContent>
                    <div className="p-4 pt-0 flex justify-end space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditUseCase(useCase)}>
                        Edit
                      </Button>
                      <Select value={useCase.status} onValueChange={(value) => updateUseCaseStatus(useCase.id, value)}>
                        <SelectTrigger className="w-28 h-9">
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
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-matrix">
          <TestMatrixDashboard />
        </TabsContent>

        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Requirements tracking will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showUseCaseForm && (
        <UseCaseForm
          isOpen={showUseCaseForm}
          useCase={editingUseCase}
          onClose={() => setShowUseCaseForm(false)}
          onSave={handleSaveUseCase}
        />
      )}
    </div>
  )
}
