"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { 
  Calendar, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar as CalendarIcon,
  Filter,
  Download,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { storage } from "../lib/storage"

interface TimelineEvent {
  id: string
  title: string
  description: string
  type: "milestone" | "task" | "meeting" | "deployment" | "training"
  status: "planned" | "in-progress" | "completed" | "delayed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  startDate: string
  endDate: string
  duration: number // in days
  assignedTo: string[]
  siteId?: string
  dependencies: string[]
  progress: number
  resources: string[]
  tags: string[]
}

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    title: "Healthcare Campus - Site Survey",
    description: "Conduct comprehensive site survey and network assessment",
    type: "task",
    status: "completed",
    priority: "high",
    startDate: "2024-01-05",
    endDate: "2024-01-12",
    duration: 7,
    assignedTo: ["Network Engineer", "Site Coordinator"],
    siteId: "healthcare-main",
    dependencies: [],
    progress: 100,
    resources: ["Site Survey Kit", "Network Analyzer"],
    tags: ["survey", "assessment"]
  },
  {
    id: "2",
    title: "Financial HQ - Infrastructure Planning",
    description: "Plan network infrastructure and NAC integration points",
    type: "milestone",
    status: "in-progress",
    priority: "critical",
    startDate: "2024-01-15",
    endDate: "2024-01-25",
    duration: 10,
    assignedTo: ["Solution Architect", "Security Engineer"],
    siteId: "financial-hq",
    dependencies: [],
    progress: 65,
    resources: ["Architecture Templates", "Compliance Guidelines"],
    tags: ["planning", "architecture"]
  },
  {
    id: "3",
    title: "Manufacturing - OT/IT Integration Workshop",
    description: "Workshop for operational technology and IT convergence planning",
    type: "meeting",
    status: "planned",
    priority: "high",
    startDate: "2024-02-01",
    endDate: "2024-02-02",
    duration: 2,
    assignedTo: ["OT Engineer", "IT Manager", "Security Specialist"],
    siteId: "manufacturing-plant",
    dependencies: ["2"],
    progress: 0,
    resources: ["Conference Room", "OT Documentation"],
    tags: ["workshop", "ot-integration"]
  },
  {
    id: "4",
    title: "Retail Chain - POS Integration Testing",
    description: "Test NAC integration with point-of-sale systems",
    type: "deployment",
    status: "planned",
    priority: "medium",
    startDate: "2024-02-10",
    endDate: "2024-02-20",
    duration: 10,
    assignedTo: ["QA Engineer", "Retail Specialist"],
    siteId: "retail-flagship",
    dependencies: ["3"],
    progress: 0,
    resources: ["Test POS Systems", "Network Lab"],
    tags: ["testing", "pos-integration"]
  },
  {
    id: "5",
    title: "University Campus - Student Training",
    description: "Training sessions for students and faculty on new access policies",
    type: "training",
    status: "planned",
    priority: "medium",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    duration: 14,
    assignedTo: ["Training Coordinator", "Support Team"],
    siteId: "university-main",
    dependencies: ["4"],
    progress: 0,
    resources: ["Training Materials", "Virtual Classrooms"],
    tags: ["training", "education"]
  },
  {
    id: "6",
    title: "Technology Campus - Go-Live Deployment",
    description: "Production deployment and cutover to new NAC system",
    type: "deployment",
    status: "planned",
    priority: "critical",
    startDate: "2024-03-20",
    endDate: "2024-03-22",
    duration: 3,
    assignedTo: ["Deployment Team", "Support Engineers"],
    siteId: "tech-campus",
    dependencies: ["5"],
    progress: 0,
    resources: ["Deployment Scripts", "Rollback Plan"],
    tags: ["go-live", "deployment"]
  }
]

export default function TimelineSchedule() {
  const [events] = useState<TimelineEvent[]>(SAMPLE_EVENTS)
  const [sites] = useState(storage.getSites())
  const [selectedSite, setSelectedSite] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"timeline" | "calendar" | "gantt">("timeline")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSite = selectedSite === "all" || event.siteId === selectedSite
      const matchesType = selectedType === "all" || event.type === selectedType
      const matchesStatus = selectedStatus === "all" || event.status === selectedStatus
      return matchesSite && matchesType && matchesStatus
    })
  }, [events, selectedSite, selectedType, selectedStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "planned": return "bg-gray-100 text-gray-800 border-gray-200"
      case "delayed": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "border-l-red-500"
      case "high": return "border-l-orange-500"
      case "medium": return "border-l-yellow-500"
      case "low": return "border-l-green-500"
      default: return "border-l-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "milestone": return <CheckCircle className="h-4 w-4" />
      case "task": return <Clock className="h-4 w-4" />
      case "meeting": return <Users className="h-4 w-4" />
      case "deployment": return <AlertTriangle className="h-4 w-4" />
      case "training": return <Calendar className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const renderTimelineView = () => (
    <div className="space-y-4">
      {filteredEvents.map((event, index) => (
        <Card key={event.id} className={`border-l-4 ${getPriorityColor(event.priority)}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getTypeIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {event.duration} days
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.assignedTo.join(", ")}
                      </div>
                    </div>
                    
                    {event.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{event.progress}%</span>
                        </div>
                        <Progress value={event.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge className={getStatusColor(event.status)} variant="outline">
                        {event.status.replace("-", " ")}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {event.type}
                      </Badge>
                      {event.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <Badge className={`${getPriorityColor(event.priority).replace('border-l-', 'bg-')} text-white`}>
                  {event.priority}
                </Badge>
              </div>
            </div>
            
            {event.dependencies.length > 0 && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium mb-1">Dependencies:</div>
                <div className="text-xs text-muted-foreground">
                  Depends on completion of: {event.dependencies.join(", ")}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderCalendarView = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    const daysInMonth = monthEnd.getDate()
    const firstDayOfWeek = monthStart.getDay()
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfWeek }, (_, i) => null)
    
    const getEventsForDay = (day: number) => {
      const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      return filteredEvents.filter(event => {
        const startDate = new Date(event.startDate)
        const endDate = new Date(event.endDate)
        return dayDate >= startDate && dayDate <= endDate
      })
    }

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {[...emptyDays, ...days].map((day, index) => (
            <div key={index} className="min-h-[100px] border rounded-lg p-1">
              {day && (
                <>
                  <div className="text-sm font-medium mb-1">{day}</div>
                  <div className="space-y-1">
                    {getEventsForDay(day).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded ${getStatusColor(event.status)} truncate`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {getEventsForDay(day).length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{getEventsForDay(day).length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderGanttView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] space-y-2">
        <div className="text-center text-sm text-muted-foreground mb-4">
          Gantt Chart visualization coming soon...
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">
            This will show a horizontal timeline with task dependencies, resource allocation, and critical path analysis.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Timeline & Schedule</h2>
            <p className="text-muted-foreground">Project timeline and milestone tracking</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Sites" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {sites.map(site => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="milestone">Milestones</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="deployment">Deployments</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "timeline" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              Timeline
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === "gantt" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("gantt")}
            >
              Gantt
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.length - filteredEvents.length} filtered out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredEvents.filter(e => e.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredEvents.filter(e => e.status === "planned" && new Date(e.startDate) > new Date()).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredEvents.filter(e => e.status === "completed").length}
            </div>
            <p className="text-xs text-green-600">
              {Math.round((filteredEvents.filter(e => e.status === "completed").length / filteredEvents.length) * 100)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Timeline Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Project Timeline</span>
            <Badge variant="outline">
              {filteredEvents.length} events
            </Badge>
          </CardTitle>
          <CardDescription>
            Track project milestones, tasks, and deliverables across all sites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewMode === "timeline" && renderTimelineView()}
          {viewMode === "calendar" && renderCalendarView()}
          {viewMode === "gantt" && renderGanttView()}
        </CardContent>
      </Card>
    </div>
  )
}