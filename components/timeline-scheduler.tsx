"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { storage } from "@/lib/storage"
import { toast } from "@/components/ui/use-toast"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Download,
  Search,
  BarChart3,
  Activity,
} from "lucide-react"

interface TimelineEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: "not_started" | "in_progress" | "completed" | "delayed" | "cancelled"
  priority: "low" | "medium" | "high" | "critical"
  category: string
  assignedTo: string[]
  siteId?: string
  dependencies: string[]
  progress: number
  estimatedHours: number
  actualHours?: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface GanttTask {
  id: string
  name: string
  start: Date
  end: Date
  progress: number
  dependencies: string[]
  assignee: string
  status: string
  color: string
}

const defaultEvent: Partial<TimelineEvent> = {
  title: "",
  description: "",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  status: "not_started",
  priority: "medium",
  category: "deployment",
  assignedTo: [],
  dependencies: [],
  progress: 0,
  estimatedHours: 8,
  tags: [],
}

export default function TimelineScheduler() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [sites, setSites] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Partial<TimelineEvent>>(defaultEvent)
  const [activeTab, setActiveTab] = useState("timeline")
  const [filterStatus, setFilterStatus] = useState("not_started")
  const [filterCategory, setFilterCategory] = useState("deployment")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSite, setSelectedSite] = useState("all")
  const [viewMode, setViewMode] = useState("month")
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    loadEvents()
    loadSites()
    loadUsers()
  }, [])

  const loadEvents = async () => {
    try {
      const savedEvents = await storage.getEvents()
      setEvents(Array.isArray(savedEvents) ? savedEvents : [])
    } catch (error) {
      console.error("Error loading events:", error)
      setEvents([])
    }
  }

  const loadSites = async () => {
    try {
      const savedSites = await storage.getSites()
      setSites(Array.isArray(savedSites) ? savedSites : [])
    } catch (error) {
      console.error("Error loading sites:", error)
      setSites([])
    }
  }

  const loadUsers = async () => {
    try {
      const savedUsers = await storage.getUsers()
      setUsers(Array.isArray(savedUsers) ? savedUsers : [])
    } catch (error) {
      console.error("Error loading users:", error)
      setUsers([])
    }
  }

  const saveEvent = async (event: TimelineEvent) => {
    try {
      let updatedEvents: TimelineEvent[]
      if (selectedEvent) {
        updatedEvents = events.map((e) => (e.id === event.id ? event : e))
      } else {
        const newEvent: TimelineEvent = {
          ...event,
          id: `event-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        updatedEvents = [...events, newEvent]
      }

      setEvents(updatedEvents)
      await storage.saveEvents(updatedEvents)

      toast({
        title: "Success",
        description: `Event ${selectedEvent ? "updated" : "created"} successfully`,
      })

      setIsEditDialogOpen(false)
      setSelectedEvent(null)
      setEditingEvent(defaultEvent)
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive",
      })
    }
  }

  const deleteEvent = async (eventId: string) => {
    try {
      const updatedEvents = events.filter((e) => e.id !== eventId)
      setEvents(updatedEvents)
      await storage.saveEvents(updatedEvents)

      toast({
        title: "Success",
        description: "Event deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const updateEventStatus = async (eventId: string, status: TimelineEvent["status"]) => {
    try {
      const updatedEvents = events.map((e) =>
        e.id === eventId ? { ...e, status, updatedAt: new Date().toISOString() } : e,
      )
      setEvents(updatedEvents)
      await storage.saveEvents(updatedEvents)

      toast({
        title: "Success",
        description: "Event status updated successfully",
      })
    } catch (error) {
      console.error("Error updating event status:", error)
      toast({
        title: "Error",
        description: "Failed to update event status",
        variant: "destructive",
      })
    }
  }

  const editEvent = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setEditingEvent(event)
    setIsEditDialogOpen(true)
  }

  const createNewEvent = () => {
    setSelectedEvent(null)
    setEditingEvent(defaultEvent)
    setIsEditDialogOpen(true)
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || event.status === filterStatus
    const matchesCategory = filterCategory === "all" || event.category === filterCategory
    const matchesSite = selectedSite === "all" || event.siteId === selectedSite

    return matchesSearch && matchesStatus && matchesCategory && matchesSite
  })

  const getStatusColor = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "delayed":
        return "bg-red-100 text-red-800 border-red-200"
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getPriorityColor = (priority: TimelineEvent["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-green-500"
    }
  }

  const getStatusIcon = (status: TimelineEvent["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "delayed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const generateGanttTasks = (): GanttTask[] => {
    return filteredEvents.map((event) => ({
      id: event.id,
      name: event.title,
      start: new Date(event.startDate),
      end: new Date(event.endDate),
      progress: event.progress,
      dependencies: event.dependencies,
      assignee: Array.isArray(event.assignedTo) ? event.assignedTo[0] || "Unassigned" : "Unassigned",
      status: event.status,
      color: getPriorityColor(event.priority),
    }))
  }

  const renderTimelineView = () => (
    <div className="space-y-4">
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Found</h3>
          <p className="text-gray-600 mb-4">Create your first timeline event to get started.</p>
          <Button onClick={createNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4 pb-8">
              <div
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 border-white ${getPriorityColor(event.priority)}`}
              >
                {getStatusIcon(event.status)}
              </div>
              <Card className="flex-1 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{event.title}</h3>
                        <Badge className={getStatusColor(event.status)}>{event.status.replace("_", " ")}</Badge>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.startDate).toLocaleDateString()} -{" "}
                          {new Date(event.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {Array.isArray(event.assignedTo) ? event.assignedTo.length : 0} assigned
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.estimatedHours}h estimated
                        </span>
                      </div>
                      {event.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{event.progress}%</span>
                          </div>
                          <Progress value={event.progress} className="h-2" />
                        </div>
                      )}
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {event.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => editEvent(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteEvent(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderGanttView = () => {
    const tasks = generateGanttTasks()
    const today = new Date()

    return (
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-12 gap-1 text-xs font-medium text-gray-500 mb-2">
              <div className="col-span-3">Task</div>
              <div className="col-span-2">Assignee</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-5">Timeline</div>
            </div>
            {tasks.map((task) => {
              const duration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24))
              const startOffset = Math.max(
                0,
                Math.ceil((task.start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
              )

              return (
                <div key={task.id} className="grid grid-cols-12 gap-1 items-center py-2 border-b border-gray-100">
                  <div className="col-span-3">
                    <div className="font-medium text-sm truncate">{task.name}</div>
                    <div className="text-xs text-gray-500">{task.status.replace("_", " ")}</div>
                  </div>
                  <div className="col-span-2 text-sm">{task.assignee}</div>
                  <div className="col-span-2 text-sm">{duration} days</div>
                  <div className="col-span-5">
                    <div className="relative h-6 bg-gray-100 rounded">
                      <div
                        className="absolute h-full rounded"
                        style={{
                          backgroundColor: task.color,
                          left: `${Math.max(0, startOffset * 2)}%`,
                          width: `${Math.min(100, duration * 2)}%`,
                          opacity: 0.8,
                        }}
                      >
                        <div
                          className="h-full bg-white bg-opacity-30 rounded"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const renderCalendarView = () => {
    const monthEvents = filteredEvents.filter((event) => {
      const eventDate = new Date(event.startDate)
      return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()
    })

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              Next
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}

          {emptyDays.map((day) => (
            <div key={`empty-${day}`} className="p-2 h-24"></div>
          ))}

          {days.map((day) => {
            const dayEvents = monthEvents.filter((event) => {
              const eventDate = new Date(event.startDate)
              return eventDate.getDate() === day
            })

            return (
              <div key={day} className="p-1 h-24 border border-gray-200 hover:bg-gray-50">
                <div className="text-sm font-medium mb-1">{day}</div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${getStatusColor(event.status)}`}
                      onClick={() => editEvent(event)}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderAnalyticsView = () => {
    const totalEvents = events.length
    const completedEvents = events.filter((e) => e.status === "completed").length
    const inProgressEvents = events.filter((e) => e.status === "in_progress").length
    const delayedEvents = events.filter((e) => e.status === "delayed").length
    const completionRate = totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0

    const categoryStats = events.reduce(
      (acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{totalEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{completedEvents}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressEvents}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm capitalize">Completion Rate</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
                  </div>
                  <span className="text-sm font-medium">{completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Events by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryStats).map(([category, count]) => {
                  const percentage = Math.round((count / totalEvents) * 100)
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category.replace("_", " ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { status: "completed", count: completedEvents, color: "bg-green-500" },
                  { status: "in_progress", count: inProgressEvents, color: "bg-blue-500" },
                  {
                    status: "not_started",
                    count: events.filter((e) => e.status === "not_started").length,
                    color: "bg-yellow-500",
                  },
                  { status: "delayed", count: delayedEvents, color: "bg-red-500" },
                ].map(({ status, count, color }) => {
                  const percentage = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{status.replace("_", " ")}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timeline & Schedule</h2>
          <p className="text-gray-600">Manage project timelines, events, and milestones</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={createNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="deployment">Deployment</SelectItem>
                <SelectItem value="configuration">Configuration</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Event Timeline
              </CardTitle>
              <CardDescription>Chronological view of all project events and milestones</CardDescription>
            </CardHeader>
            <CardContent>{renderTimelineView()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Gantt Chart
              </CardTitle>
              <CardDescription>Project timeline with dependencies and progress tracking</CardDescription>
            </CardHeader>
            <CardContent>{renderGanttView()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Calendar View
              </CardTitle>
              <CardDescription>Monthly calendar view of events and deadlines</CardDescription>
            </CardHeader>
            <CardContent>{renderCalendarView()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {renderAnalyticsView()}
        </TabsContent>
      </Tabs>

      {/* Event Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            <DialogDescription>
              {selectedEvent ? "Update event details and settings" : "Add a new event to your timeline"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={editingEvent.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={editingEvent.category || "deployment"}
                  onValueChange={(value) => setEditingEvent({ ...editingEvent, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deployment">Deployment</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editingEvent.description || ""}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={editingEvent.startDate || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={editingEvent.endDate || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingEvent.status || "not_started"}
                  onValueChange={(value: TimelineEvent["status"]) =>
                    setEditingEvent({ ...editingEvent, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={editingEvent.priority || "medium"}
                  onValueChange={(value: TimelineEvent["priority"]) =>
                    setEditingEvent({ ...editingEvent, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  value={editingEvent.estimatedHours || 8}
                  onChange={(e) =>
                    setEditingEvent({ ...editingEvent, estimatedHours: Number.parseInt(e.target.value) || 8 })
                  }
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  value={editingEvent.progress || 0}
                  onChange={(e) => setEditingEvent({ ...editingEvent, progress: Number.parseInt(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="site">Associated Site</Label>
              <Select
                value={editingEvent.siteId || ""}
                onValueChange={(value) => setEditingEvent({ ...editingEvent, siteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a site (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific site</SelectItem>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} - {site.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const eventToSave: TimelineEvent = {
                    id: selectedEvent?.id || `event-${Date.now()}`,
                    title: editingEvent.title || "",
                    description: editingEvent.description || "",
                    startDate: editingEvent.startDate || new Date().toISOString().split("T")[0],
                    endDate:
                      editingEvent.endDate ||
                      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
                    status: editingEvent.status || "not_started",
                    priority: editingEvent.priority || "medium",
                    category: editingEvent.category || "deployment",
                    assignedTo: editingEvent.assignedTo || [],
                    siteId: editingEvent.siteId,
                    dependencies: editingEvent.dependencies || [],
                    progress: editingEvent.progress || 0,
                    estimatedHours: editingEvent.estimatedHours || 8,
                    actualHours: editingEvent.actualHours,
                    tags: editingEvent.tags || [],
                    createdAt: selectedEvent?.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                  saveEvent(eventToSave)
                }}
              >
                {selectedEvent ? "Update Event" : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
