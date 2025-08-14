"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { storage, type Event, type Site } from "@/lib/storage"
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  MapPin,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Pause,
  Play,
} from "lucide-react"

export default function TimelineScheduler() {
  const [events, setEvents] = useState<Event[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    type: "deployment" as Event["type"],
    priority: "medium" as Event["priority"],
    assignedTo: "",
    siteId: "",
    status: "scheduled" as Event["status"],
  })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, typeFilter, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [loadedEvents, loadedSites] = await Promise.all([storage.getEvents(), storage.getSites()])
      setEvents(loadedEvents)
      setSites(loadedSites)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load timeline data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = events

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter)
    }

    // Sort by start date
    filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())

    setFilteredEvents(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const eventData = {
        ...formData,
        siteId: formData.siteId || undefined,
      }

      if (editingEvent) {
        await storage.updateEvent(editingEvent.id, eventData)
        toast({
          title: "Event updated",
          description: "Event has been updated successfully.",
        })
      } else {
        await storage.createEvent(eventData)
        toast({
          title: "Event created",
          description: "New event has been created successfully.",
        })
      }

      setShowAddDialog(false)
      setEditingEvent(null)
      resetForm()
      loadData()
    } catch (error) {
      console.error("Error saving event:", error)
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      type: event.type,
      priority: event.priority,
      assignedTo: event.assignedTo,
      siteId: event.siteId || "",
      status: event.status,
    })
    setShowAddDialog(true)
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await storage.deleteEvent(eventId)
      toast({
        title: "Event deleted",
        description: "Event has been deleted successfully.",
      })
      loadData()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      type: "deployment",
      priority: "medium",
      assignedTo: "",
      siteId: "",
      status: "scheduled",
    })
  }

  const getStatusIcon = (status: Event["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Play className="h-4 w-4 text-blue-600" />
      case "cancelled":
        return <Pause className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "deployment":
        return "bg-blue-100 text-blue-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "training":
        return "bg-green-100 text-green-800"
      case "meeting":
        return "bg-purple-100 text-purple-800"
      case "milestone":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Event["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSiteName = (siteId?: string) => {
    if (!siteId) return "No site assigned"
    const site = sites.find((s) => s.id === siteId)
    return site ? site.name : "Unknown site"
  }

  const exportTimeline = async () => {
    try {
      const data = await storage.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `portnox-timeline-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Timeline data has been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting timeline:", error)
      toast({
        title: "Error",
        description: "Failed to export timeline. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Calendar view helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return filteredEvents.filter((event) => {
      const eventStart = new Date(event.startDate).toISOString().split("T")[0]
      const eventEnd = new Date(event.endDate).toISOString().split("T")[0]
      return dateStr >= eventStart && dateStr <= eventEnd
    })
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Timeline & Schedule</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportTimeline}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="datetime-local"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input
                          id="endDate"
                          type="datetime-local"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Event Type</Label>
                        <Select
                          value={formData.type}
                          onValueChange={(value: Event["type"]) => setFormData({ ...formData, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deployment">Deployment</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="training">Training</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="milestone">Milestone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={formData.priority}
                          onValueChange={(value: Event["priority"]) => setFormData({ ...formData, priority: value })}
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

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input
                          id="assignedTo"
                          value={formData.assignedTo}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value: Event["status"]) => setFormData({ ...formData, status: value })}
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

                    <div className="space-y-2">
                      <Label htmlFor="siteId">Associated Site (Optional)</Label>
                      <Select
                        value={formData.siteId}
                        onValueChange={(value) => setFormData({ ...formData, siteId: value === "none" ? "" : value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No site</SelectItem>
                          {sites.map((site) => (
                            <SelectItem key={site.id} value={site.id}>
                              {site.name} - {site.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingEvent ? "Update" : "Create"} Event</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deployment">Deployment</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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

            <Tabs value={viewMode} onValueChange={(value: "timeline" | "calendar") => setViewMode(value)}>
              <TabsList>
                <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
          <Tabs value={viewMode} className="space-y-4">
            <TabsContent value="timeline" className="space-y-4">
              {/* Timeline View */}
              <div className="space-y-4">
                {filteredEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                            <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                            <Badge className={getStatusColor(event.status)}>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(event.status)}
                                <span>{event.status.replace("-", " ")}</span>
                              </div>
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-3">{event.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">Start</div>
                                <div className="text-gray-600">
                                  {new Date(event.startDate).toLocaleDateString()}{" "}
                                  {new Date(event.startDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">End</div>
                                <div className="text-gray-600">
                                  {new Date(event.endDate).toLocaleDateString()}{" "}
                                  {new Date(event.endDate).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">Assigned To</div>
                                <div className="text-gray-600">{event.assignedTo}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <div>
                                <div className="font-medium">Site</div>
                                <div className="text-gray-600">{getSiteName(event.siteId)}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                    <p className="text-gray-600">
                      {events.length === 0 ? "Get started by adding your first event." : "Try adjusting your filters."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              {/* Calendar View */}
              <div className="bg-white rounded-lg border">
                {/* Calendar Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
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

                {/* Calendar Grid */}
                <div className="p-4">
                  {/* Days of week header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: getFirstDayOfMonth(currentDate) }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-24 p-1"></div>
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: getDaysInMonth(currentDate) }).map((_, index) => {
                      const day = index + 1
                      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                      const dayEvents = getEventsForDate(date)
                      const isToday = date.toDateString() === new Date().toDateString()

                      return (
                        <div
                          key={day}
                          className={`h-24 p-1 border rounded-lg ${
                            isToday ? "bg-blue-50 border-blue-200" : "border-gray-200"
                          }`}
                        >
                          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate cursor-pointer ${getTypeColor(event.type)}`}
                                title={`${event.title} - ${event.assignedTo}`}
                                onClick={() => handleEdit(event)}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
