"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Filter,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  CalendarDays,
  Target,
  Zap,
  List,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "milestone" | "meeting" | "deployment" | "training" | "review" | "checkin"
  priority: "low" | "medium" | "high" | "critical"
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  siteId?: string
  siteName?: string
  attendees: string[]
  location: string
  duration: number // in minutes
  notes: string
}

interface Site {
  id: string
  name: string
  location: string
  region: string
  phase: string
  status: string
  networkVendor: string
  wirelessVendor: string
  deviceCount: number
  plannedStart: string
  plannedEnd: string
  projectManager: string
  technicalOwners: string[]
  notes: string
}

interface TimelineSchedulerProps {
  sites?: Site[]
}

const eventTypeColors = {
  milestone: "bg-purple-100 text-purple-800 border-purple-200",
  meeting: "bg-blue-100 text-blue-800 border-blue-200",
  deployment: "bg-green-100 text-green-800 border-green-200",
  training: "bg-orange-100 text-orange-800 border-orange-200",
  review: "bg-yellow-100 text-yellow-800 border-yellow-200",
  checkin: "bg-gray-100 text-gray-800 border-gray-200",
}

const priorityColors = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  critical: "bg-red-100 text-red-600",
}

const statusColors = {
  scheduled: "bg-blue-100 text-blue-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusIcons = {
  scheduled: Clock,
  "in-progress": AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle,
}

export default function TimelineScheduler({ sites = [] }: TimelineSchedulerProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [isAddingEvent, setIsAddingEvent] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [filterSite, setFilterSite] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentDate, setCurrentDate] = useState(new Date())

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem("portnox-timeline-events")
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents)
        setEvents(parsedEvents)
      } catch (error) {
        console.error("Error parsing saved events:", error)
        setEvents([])
      }
    }
  }, [])

  // Save events to localStorage
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("portnox-timeline-events", JSON.stringify(events))
    }
  }, [events])

  // Filter events
  useEffect(() => {
    let filtered = events

    if (filterType !== "all") {
      filtered = filtered.filter((event) => event.type === filterType)
    }

    if (filterSite !== "all") {
      filtered = filtered.filter((event) => event.siteId === filterSite)
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((event) => event.status === filterStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.siteName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`)
      const dateB = new Date(`${b.date} ${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredEvents(filtered)
  }, [events, filterType, filterSite, filterStatus, searchTerm])

  const generateInitialEvents = () => {
    if (!sites || sites.length === 0) {
      // Generate some demo events if no sites available
      const demoEvents: TimelineEvent[] = [
        {
          id: "demo-1",
          title: "Project Kickoff Meeting",
          description: "Initial project planning and stakeholder alignment",
          date: "2024-02-15",
          time: "09:00",
          type: "meeting",
          priority: "high",
          status: "scheduled",
          attendees: ["Project Manager", "Technical Lead", "Customer Stakeholder"],
          location: "Conference Room A",
          duration: 120,
          notes: "Bring project charter and technical requirements",
        },
        {
          id: "demo-2",
          title: "Architecture Review",
          description: "Review and approve the Zero Trust NAC architecture design",
          date: "2024-02-20",
          time: "14:00",
          type: "review",
          priority: "high",
          status: "scheduled",
          attendees: ["Solution Architect", "Security Team", "Network Team"],
          location: "Virtual Meeting",
          duration: 90,
          notes: "Architecture diagrams will be presented",
        },
        {
          id: "demo-3",
          title: "Pilot Deployment",
          description: "Deploy NAC solution to pilot site",
          date: "2024-03-01",
          time: "08:00",
          type: "deployment",
          priority: "critical",
          status: "scheduled",
          attendees: ["Deployment Team", "Site Technical Contact"],
          location: "Pilot Site",
          duration: 480,
          notes: "Full day deployment with testing",
        },
      ]
      setEvents(demoEvents)
      return
    }

    const newEvents: TimelineEvent[] = []

    sites.forEach((site, index) => {
      const startDate = new Date(site.plannedStart || "2024-02-01")
      const endDate = new Date(site.plannedEnd || "2024-06-01")

      // Generate events for each site
      const siteEvents = [
        {
          id: `${site.id}-kickoff`,
          title: `${site.name} - Project Kickoff`,
          description: `Initial planning meeting for ${site.name} NAC deployment`,
          date: startDate.toISOString().split("T")[0],
          time: "09:00",
          type: "meeting" as const,
          priority: "high" as const,
          status: "scheduled" as const,
          siteId: site.id,
          siteName: site.name,
          attendees: [site.projectManager, ...site.technicalOwners],
          location: site.location,
          duration: 120,
          notes: `Kickoff meeting for ${site.name} deployment`,
        },
        {
          id: `${site.id}-assessment`,
          title: `${site.name} - Site Assessment`,
          description: `Technical assessment and network discovery for ${site.name}`,
          date: new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          time: "10:00",
          type: "review" as const,
          priority: "medium" as const,
          status: "scheduled" as const,
          siteId: site.id,
          siteName: site.name,
          attendees: ["Network Engineer", "Site Contact"],
          location: site.location,
          duration: 240,
          notes: `On-site assessment for ${site.name}`,
        },
        {
          id: `${site.id}-deployment`,
          title: `${site.name} - NAC Deployment`,
          description: `Deploy Portnox NAC solution at ${site.name}`,
          date: new Date(startDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          time: "08:00",
          type: "deployment" as const,
          priority: "critical" as const,
          status: "scheduled" as const,
          siteId: site.id,
          siteName: site.name,
          attendees: ["Deployment Team", site.projectManager],
          location: site.location,
          duration: 480,
          notes: `Full deployment for ${site.name} - ${site.deviceCount} devices`,
        },
        {
          id: `${site.id}-training`,
          title: `${site.name} - User Training`,
          description: `Train local IT staff on NAC management for ${site.name}`,
          date: new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          time: "13:00",
          type: "training" as const,
          priority: "medium" as const,
          status: "scheduled" as const,
          siteId: site.id,
          siteName: site.name,
          attendees: ["Trainer", ...site.technicalOwners],
          location: site.location,
          duration: 180,
          notes: `Training session for ${site.name} IT staff`,
        },
      ]

      newEvents.push(...siteEvents)
    })

    setEvents(newEvents)
  }

  const addEvent = (eventData: Partial<TimelineEvent>) => {
    const newEvent: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: eventData.title || "",
      description: eventData.description || "",
      date: eventData.date || "",
      time: eventData.time || "",
      type: eventData.type || "meeting",
      priority: eventData.priority || "medium",
      status: eventData.status || "scheduled",
      siteId: eventData.siteId,
      siteName: eventData.siteName,
      attendees: eventData.attendees || [],
      location: eventData.location || "",
      duration: eventData.duration || 60,
      notes: eventData.notes || "",
    }

    setEvents((prev) => [...prev, newEvent])
    setIsAddingEvent(false)
  }

  const updateEvent = (eventId: string, updates: Partial<TimelineEvent>) => {
    setEvents((prev) => prev.map((event) => (event.id === eventId ? { ...event, ...updates } : event)))
    setSelectedEvent(null)
  }

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
    setSelectedEvent(null)
  }

  const getEventStats = () => {
    const total = events.length
    const completed = events.filter((e) => e.status === "completed").length
    const upcoming = events.filter((e) => {
      const eventDate = new Date(`${e.date} ${e.time}`)
      return eventDate > new Date() && e.status === "scheduled"
    }).length
    const overdue = events.filter((e) => {
      const eventDate = new Date(`${e.date} ${e.time}`)
      return eventDate < new Date() && e.status === "scheduled"
    }).length

    return { total, completed, upcoming, overdue }
  }

  const stats = getEventStats()

  const quickAddMeeting = (type: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const meetingTypes = {
      kickoff: {
        title: "Project Kickoff Meeting",
        description: "Initial project planning and stakeholder alignment",
        type: "meeting" as const,
        priority: "high" as const,
        duration: 120,
        attendees: ["Project Manager", "Technical Lead", "Customer Stakeholder"],
      },
      checkin: {
        title: "Weekly Check-in",
        description: "Weekly project status and progress review",
        type: "checkin" as const,
        priority: "medium" as const,
        duration: 60,
        attendees: ["Project Manager", "Team Lead"],
      },
      review: {
        title: "Architecture Review",
        description: "Review and approve technical architecture",
        type: "review" as const,
        priority: "high" as const,
        duration: 90,
        attendees: ["Solution Architect", "Technical Team"],
      },
    }

    const meetingData = meetingTypes[type as keyof typeof meetingTypes]
    if (meetingData) {
      addEvent({
        ...meetingData,
        date: tomorrow.toISOString().split("T")[0],
        time: "14:00",
        location: "Conference Room",
        status: "scheduled",
      })
    }
  }

  const clearAllData = () => {
    setEvents([])
    localStorage.removeItem("portnox-timeline-events")
  }

  // Calendar view functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    return filteredEvents.filter((event) => event.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const renderCalendarView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dayEvents = getEventsForDate(date)
      const isToday = date.toDateString() === new Date().toDateString()

      days.push(
        <div key={day} className={`h-24 border border-gray-200 p-1 ${isToday ? "bg-blue-50" : ""}`}>
          <div className={`text-sm font-medium ${isToday ? "text-blue-600" : ""}`}>{day}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer ${eventTypeColors[event.type]}`}
                onClick={() => setSelectedEvent(event)}
                title={event.title}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>}
          </div>
        </div>,
      )
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="bg-gray-50 p-2 text-center font-medium text-sm border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timeline & Schedule</h2>
          <p className="text-gray-600">Manage project timelines, meetings, and milestones</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => generateInitialEvents()} variant="outline">
            <Zap className="h-4 w-4 mr-2" />
            Load Demo Data
          </Button>
          <Button onClick={clearAllData} variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
          <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
              </DialogHeader>
              <EventForm onSubmit={addEvent} sites={sites} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => quickAddMeeting("kickoff")} variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Schedule Kickoff
            </Button>
            <Button onClick={() => quickAddMeeting("checkin")} variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Weekly Check-in
            </Button>
            <Button onClick={() => quickAddMeeting("review")} variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              Architecture Review
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">View:</span>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>
            </div>

            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="milestone">Milestones</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="deployment">Deployments</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="review">Reviews</SelectItem>
                <SelectItem value="checkin">Check-ins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSite} onValueChange={setFilterSite}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Site" />
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

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calendar View Header */}
      {viewMode === "calendar" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderCalendarView()}</CardContent>
        </Card>
      )}

      {/* Events Timeline/List */}
      {viewMode === "list" && (
        <Card>
          <CardHeader>
            <CardTitle>Events Timeline ({filteredEvents.length} events)</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No events found. Add some events to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map((event) => {
                  const StatusIcon = statusIcons[event.status]
                  return (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <StatusIcon className="h-5 w-5 text-gray-500" />
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge className={eventTypeColors[event.type]}>{event.type}</Badge>
                            <Badge className={priorityColors[event.priority]}>{event.priority}</Badge>
                            <Badge className={statusColors[event.status]}>{event.status}</Badge>
                          </div>

                          <p className="text-gray-600 mb-3">{event.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {event.time} ({event.duration}min)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{event.attendees.length} attendees</span>
                            </div>
                          </div>

                          {event.siteName && (
                            <div className="mt-2">
                              <Badge variant="outline">{event.siteName}</Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Edit Event</DialogTitle>
                              </DialogHeader>
                              <EventForm
                                event={event}
                                onSubmit={(updates) => updateEvent(event.id, updates)}
                                sites={sites}
                              />
                            </DialogContent>
                          </Dialog>

                          <Button variant="outline" size="sm" onClick={() => deleteEvent(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Event Form Component
function EventForm({
  event,
  onSubmit,
  sites = [],
}: {
  event?: TimelineEvent
  onSubmit: (data: Partial<TimelineEvent>) => void
  sites?: Site[]
}) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    type: event?.type || "meeting",
    priority: event?.priority || "medium",
    status: event?.status || "scheduled",
    siteId: event?.siteId || "none",
    location: event?.location || "",
    duration: event?.duration || 60,
    attendees: event?.attendees?.join(", ") || "",
    notes: event?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const selectedSite = sites.find((s) => s.id === formData.siteId)

    onSubmit({
      ...formData,
      siteId: formData.siteId === "none" ? undefined : formData.siteId,
      siteName: selectedSite?.name,
      attendees: formData.attendees
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="milestone">Milestone</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="deployment">Deployment</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="checkin">Check-in</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 60 }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value as any }))}
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
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="site">Site</Label>
          <Select
            value={formData.siteId}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, siteId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select site (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific site</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="attendees">Attendees (comma-separated)</Label>
        <Input
          id="attendees"
          value={formData.attendees}
          onChange={(e) => setFormData((prev) => ({ ...prev, attendees: e.target.value }))}
          placeholder="John Doe, Jane Smith, ..."
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit">{event ? "Update Event" : "Add Event"}</Button>
      </div>
    </form>
  )
}
