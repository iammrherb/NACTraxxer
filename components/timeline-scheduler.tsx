"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Plus, Trash2, MapPin, CheckCircle, AlertTriangle } from "lucide-react"

interface Site {
  id: string
  name: string
  region: string
  status: "Planned" | "In Progress" | "Complete" | "Delayed"
  plannedStart: string
  plannedEnd: string
  projectManager: string
}

interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: "milestone" | "checkin" | "touchpoint" | "deployment" | "meeting"
  siteId?: string
  attendees: string[]
  status: "scheduled" | "completed" | "cancelled"
  priority: "high" | "medium" | "low"
}

const eventTypeColors = {
  milestone: "bg-purple-100 text-purple-800 border-purple-200",
  checkin: "bg-blue-100 text-blue-800 border-blue-200",
  touchpoint: "bg-green-100 text-green-800 border-green-200",
  deployment: "bg-red-100 text-red-800 border-red-200",
  meeting: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

export default function TimelineScheduler() {
  const [sites, setSites] = useState<Site[]>([])
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null)

  const [newEvent, setNewEvent] = useState<Partial<TimelineEvent>>({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "09:00",
    type: "checkin",
    attendees: [],
    status: "scheduled",
    priority: "medium",
  })

  useEffect(() => {
    // Load sites from localStorage
    const savedSites = localStorage.getItem("portnox-sites")
    if (savedSites) {
      setSites(JSON.parse(savedSites))
    }

    // Load events from localStorage
    const savedEvents = localStorage.getItem("portnox-timeline-events")
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      // Create default events for existing sites
      const defaultEvents: TimelineEvent[] = []
      const sitesData = savedSites ? JSON.parse(savedSites) : []

      sitesData.forEach((site: Site, index: number) => {
        // Add kickoff meeting
        defaultEvents.push({
          id: `kickoff-${site.id}`,
          title: `${site.name} - Project Kickoff`,
          description: `Initial project kickoff meeting for ${site.name}`,
          date: site.plannedStart,
          time: "10:00",
          type: "meeting",
          siteId: site.id,
          attendees: [site.projectManager],
          status: "scheduled",
          priority: "high",
        })

        // Add weekly check-ins
        const startDate = new Date(site.plannedStart)
        const endDate = new Date(site.plannedEnd)
        const currentDate = new Date(startDate)

        while (currentDate <= endDate) {
          currentDate.setDate(currentDate.getDate() + 7)
          if (currentDate <= endDate) {
            defaultEvents.push({
              id: `checkin-${site.id}-${currentDate.toISOString().split("T")[0]}`,
              title: `${site.name} - Weekly Check-in`,
              description: `Weekly progress review and status update`,
              date: currentDate.toISOString().split("T")[0],
              time: "14:00",
              type: "checkin",
              siteId: site.id,
              attendees: [site.projectManager],
              status: "scheduled",
              priority: "medium",
            })
          }
        }

        // Add deployment milestone
        const deploymentDate = new Date(endDate)
        deploymentDate.setDate(deploymentDate.getDate() - 2)
        defaultEvents.push({
          id: `deployment-${site.id}`,
          title: `${site.name} - Go-Live`,
          description: `Production deployment and go-live`,
          date: deploymentDate.toISOString().split("T")[0],
          time: "08:00",
          type: "deployment",
          siteId: site.id,
          attendees: [site.projectManager],
          status: "scheduled",
          priority: "high",
        })
      })

      setEvents(defaultEvents)
      localStorage.setItem("portnox-timeline-events", JSON.stringify(defaultEvents))
    }
  }, [])

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem("portnox-timeline-events", JSON.stringify(events))
    }
  }, [events])

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date) return

    const event: TimelineEvent = {
      id: `event-${Date.now()}`,
      title: newEvent.title!,
      description: newEvent.description || "",
      date: newEvent.date!,
      time: newEvent.time || "09:00",
      type: (newEvent.type as TimelineEvent["type"]) || "checkin",
      siteId: newEvent.siteId,
      attendees: newEvent.attendees || [],
      status: "scheduled",
      priority: (newEvent.priority as TimelineEvent["priority"]) || "medium",
    }

    setEvents((prev) => [...prev, event])
    setNewEvent({
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      type: "checkin",
      attendees: [],
      status: "scheduled",
      priority: "medium",
    })
    setShowAddEvent(false)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId))
  }

  const handleToggleEventStatus = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId ? { ...event, status: event.status === "completed" ? "scheduled" : "completed" } : event,
      ),
    )
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getUpcomingEvents = () => {
    const today = new Date().toISOString().split("T")[0]
    return events
      .filter((event) => event.date >= today && event.status === "scheduled")
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date)
        return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time)
      })
      .slice(0, 5)
  }

  const getEventStats = () => {
    const total = events.length
    const completed = events.filter((e) => e.status === "completed").length
    const upcoming = events.filter(
      (e) => e.status === "scheduled" && e.date >= new Date().toISOString().split("T")[0],
    ).length
    const overdue = events.filter(
      (e) => e.status === "scheduled" && e.date < new Date().toISOString().split("T")[0],
    ).length

    return { total, completed, upcoming, overdue }
  }

  const stats = getEventStats()
  const upcomingEvents = getUpcomingEvents()
  const selectedDateEvents = getEventsForDate(selectedDate)

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const firstDay = new Date(currentYear, currentMonth, 1)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const dateString = date.toISOString().split("T")[0]
      const dayEvents = getEventsForDate(dateString)

      days.push({
        date: day,
        dateString,
        events: dayEvents,
        isToday: dateString === new Date().toISOString().split("T")[0],
        isSelected: dateString === selectedDate,
      })
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentMonth = monthNames[new Date().getMonth()]
  const currentYear = new Date().getFullYear()

  if (sites.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No timeline data available</h3>
            <p className="text-gray-600 dark:text-gray-400">Add sites to create project timelines and schedules</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Timeline & Schedule</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage project timelines, check-ins, and touchpoints</p>
        </div>
        <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Event</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new timeline event or meeting</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newEvent.title || ""}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description || ""}
                  onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date || ""}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time || ""}
                    onChange={(e) => setNewEvent((prev) => ({ ...prev, time: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newEvent.type}
                    onValueChange={(value) =>
                      setNewEvent((prev) => ({ ...prev, type: value as TimelineEvent["type"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="checkin">Check-in</SelectItem>
                      <SelectItem value="touchpoint">Touchpoint</SelectItem>
                      <SelectItem value="deployment">Deployment</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newEvent.priority}
                    onValueChange={(value) =>
                      setNewEvent((prev) => ({ ...prev, priority: value as TimelineEvent["priority"] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="site">Related Site (Optional)</Label>
                <Select
                  value={newEvent.siteId}
                  onValueChange={(value) => setNewEvent((prev) => ({ ...prev, siteId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>Add Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Completed</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completed}</p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Upcoming</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.upcoming}</p>
              </div>
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Overdue</p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{stats.overdue}</p>
              </div>
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>
                {currentMonth} {currentYear}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`
                    min-h-[80px] p-1 border rounded cursor-pointer transition-colors
                    ${day ? "hover:bg-gray-50 dark:hover:bg-gray-800" : ""}
                    ${day?.isToday ? "bg-blue-50 border-blue-200" : "border-gray-200"}
                    ${day?.isSelected ? "bg-blue-100 border-blue-300" : ""}
                  `}
                  onClick={() => day && setSelectedDate(day.dateString)}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium ${day.isToday ? "text-blue-600" : "text-gray-900 dark:text-gray-100"}`}
                      >
                        {day.date}
                      </div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event) => (
                          <div key={event.id} className={`text-xs p-1 rounded truncate ${eventTypeColors[event.type]}`}>
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500">+{day.events.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming events</p>
              ) : (
                upcomingEvents.map((event) => {
                  const site = sites.find((s) => s.id === event.siteId)
                  return (
                    <div key={event.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <Badge className={`text-xs ${priorityColors[event.priority]}`}>{event.priority}</Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {event.date} at {event.time}
                          </span>
                        </div>
                        {site && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{site.name}</span>
                          </div>
                        )}
                        <Badge className={`text-xs ${eventTypeColors[event.type]}`}>{event.type}</Badge>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Events */}
      {selectedDateEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Events for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedDateEvents.map((event) => {
                const site = sites.find((s) => s.id === event.siteId)
                return (
                  <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium">{event.title}</h4>
                        <Badge className={`text-xs ${eventTypeColors[event.type]}`}>{event.type}</Badge>
                        <Badge className={`text-xs ${priorityColors[event.priority]}`}>{event.priority}</Badge>
                        {event.status === "completed" && (
                          <Badge className="text-xs bg-green-100 text-green-800 border-green-200">Completed</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        {site && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{site.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleToggleEventStatus(event.id)}>
                        {event.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
