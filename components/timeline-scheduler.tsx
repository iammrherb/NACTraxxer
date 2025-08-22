"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, MapPin, Plus, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Event {
  id: string
  title: string
  description: string
  start: string
  end: string
  category: string
  priority: "low" | "medium" | "high" | "critical"
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "delayed"
  assignees: string[]
  siteId?: string
  siteName?: string
  dependencies: string[]
  resources: string[]
  location?: string
}

export default function TimelineScheduler() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentView, setCurrentView] = useState<"timeline" | "calendar" | "gantt">("timeline")

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, selectedCategory, selectedStatus, searchTerm])

  const loadEvents = () => {
    const storedEvents = localStorage.getItem("portnox-events")
    const storedSites = localStorage.getItem("portnox-sites")

    if (storedEvents) {
      const eventsData = JSON.parse(storedEvents)
      setEvents(eventsData)
    } else {
      // Generate comprehensive demo events
      generateDemoEvents()
    }
  }

  const generateDemoEvents = () => {
    const demoEvents: Event[] = [
      // Project Initiation Events
      {
        id: "event-1",
        title: "Project Kickoff Meeting",
        description: "Official project launch with all stakeholders",
        start: "2024-01-15T09:00:00",
        end: "2024-01-15T11:00:00",
        category: "kickoff",
        priority: "high",
        status: "completed",
        assignees: ["Project Manager", "Technical Lead", "Business Analyst"],
        dependencies: [],
        resources: ["Conference Room A", "Presentation Equipment"],
        location: "Headquarters - New York",
      },
      {
        id: "event-2",
        title: "Stakeholder Alignment Workshop",
        description: "Align all stakeholders on project objectives and success criteria",
        start: "2024-01-18T13:00:00",
        end: "2024-01-18T17:00:00",
        category: "planning",
        priority: "high",
        status: "completed",
        assignees: ["Project Manager", "Business Analyst", "Executive Sponsor"],
        dependencies: ["event-1"],
        resources: ["Workshop Room", "Facilitator"],
        location: "Headquarters - New York",
      },
      {
        id: "event-3",
        title: "Technical Requirements Gathering",
        description: "Detailed technical requirements collection and documentation",
        start: "2024-01-22T09:00:00",
        end: "2024-02-05T17:00:00",
        category: "requirements",
        priority: "high",
        status: "completed",
        assignees: ["Technical Lead", "Network Architect", "Security Specialist"],
        dependencies: ["event-2"],
        resources: ["Documentation Tools", "Network Discovery Tools"],
        location: "Multiple Sites",
      },

      // Infrastructure Assessment Events
      {
        id: "event-4",
        title: "Network Discovery - Headquarters",
        description: "Comprehensive network infrastructure discovery and mapping",
        start: "2024-02-16T08:00:00",
        end: "2024-02-23T17:00:00",
        category: "assessment",
        priority: "high",
        status: "completed",
        assignees: ["Network Engineer", "Technical Lead"],
        siteId: "site-1",
        siteName: "Headquarters - New York",
        dependencies: ["event-3"],
        resources: ["Network Scanner", "Documentation Tools"],
        location: "Headquarters - New York",
      },
      {
        id: "event-5",
        title: "Security Assessment - All Sites",
        description: "Current security posture assessment across all locations",
        start: "2024-02-20T09:00:00",
        end: "2024-03-15T17:00:00",
        category: "assessment",
        priority: "high",
        status: "completed",
        assignees: ["Security Specialist", "Compliance Officer"],
        dependencies: ["event-4"],
        resources: ["Security Assessment Tools", "Compliance Checklist"],
        location: "All Sites",
      },
      {
        id: "event-6",
        title: "Gap Analysis Report",
        description: "Comprehensive gap analysis and remediation planning",
        start: "2024-03-01T09:00:00",
        end: "2024-03-20T17:00:00",
        category: "analysis",
        priority: "medium",
        status: "completed",
        assignees: ["Business Analyst", "Technical Lead"],
        dependencies: ["event-5"],
        resources: ["Analysis Tools", "Reporting Templates"],
        location: "Headquarters - New York",
      },

      // Design & Planning Events
      {
        id: "event-7",
        title: "Solution Architecture Design",
        description: "Detailed technical architecture design and documentation",
        start: "2024-04-01T09:00:00",
        end: "2024-04-25T17:00:00",
        category: "design",
        priority: "high",
        status: "completed",
        assignees: ["Solution Architect", "Network Architect", "Security Architect"],
        dependencies: ["event-6"],
        resources: ["Design Tools", "Architecture Templates"],
        location: "Headquarters - New York",
      },
      {
        id: "event-8",
        title: "Policy Framework Design",
        description: "Design comprehensive NAC policy framework",
        start: "2024-04-15T09:00:00",
        end: "2024-05-10T17:00:00",
        category: "design",
        priority: "high",
        status: "completed",
        assignees: ["Security Architect", "Policy Specialist"],
        dependencies: ["event-7"],
        resources: ["Policy Templates", "Compliance Guidelines"],
        location: "Headquarters - New York",
      },
      {
        id: "event-9",
        title: "Implementation Planning Workshop",
        description: "Detailed implementation planning and resource allocation",
        start: "2024-05-01T09:00:00",
        end: "2024-05-03T17:00:00",
        category: "planning",
        priority: "high",
        status: "completed",
        assignees: ["Project Manager", "Technical Lead", "Site Coordinators"],
        dependencies: ["event-8"],
        resources: ["Planning Tools", "Resource Management System"],
        location: "Headquarters - New York",
      },

      // Pilot Implementation Events
      {
        id: "event-10",
        title: "Pilot Site Preparation - HQ",
        description: "Infrastructure preparation for pilot deployment",
        start: "2024-05-16T08:00:00",
        end: "2024-06-07T17:00:00",
        category: "preparation",
        priority: "high",
        status: "completed",
        assignees: ["Site Engineer", "Network Technician"],
        siteId: "site-1",
        siteName: "Headquarters - New York",
        dependencies: ["event-9"],
        resources: ["Installation Equipment", "Network Cables"],
        location: "Headquarters - New York",
      },
      {
        id: "event-11",
        title: "Portnox NAC Platform Installation",
        description: "Install and configure Portnox NAC platform",
        start: "2024-06-10T09:00:00",
        end: "2024-06-21T17:00:00",
        category: "installation",
        priority: "critical",
        status: "completed",
        assignees: ["NAC Specialist", "System Administrator"],
        siteId: "site-1",
        siteName: "Headquarters - New York",
        dependencies: ["event-10"],
        resources: ["NAC Platform", "Server Hardware"],
        location: "Headquarters - New York",
      },
      {
        id: "event-12",
        title: "Integration Testing - Identity Providers",
        description: "Test integration with Azure AD and other identity providers",
        start: "2024-06-24T09:00:00",
        end: "2024-07-05T17:00:00",
        category: "testing",
        priority: "high",
        status: "in-progress",
        assignees: ["Integration Specialist", "Identity Administrator"],
        dependencies: ["event-11"],
        resources: ["Test Environment", "Identity Systems"],
        location: "Headquarters - New York",
      },
      {
        id: "event-13",
        title: "User Training - Pilot Group",
        description: "Training sessions for pilot user group",
        start: "2024-07-08T09:00:00",
        end: "2024-07-12T17:00:00",
        category: "training",
        priority: "medium",
        status: "scheduled",
        assignees: ["Training Coordinator", "Technical Trainer"],
        siteId: "site-1",
        siteName: "Headquarters - New York",
        dependencies: ["event-12"],
        resources: ["Training Room", "Training Materials"],
        location: "Headquarters - New York",
      },
      {
        id: "event-14",
        title: "Pilot Go-Live - Chicago Branch",
        description: "Second pilot site go-live deployment",
        start: "2024-07-15T08:00:00",
        end: "2024-07-19T17:00:00",
        category: "deployment",
        priority: "critical",
        status: "scheduled",
        assignees: ["Deployment Team", "Site Coordinator"],
        siteId: "site-2",
        siteName: "Branch Office - Chicago",
        dependencies: ["event-13"],
        resources: ["Deployment Kit", "Support Team"],
        location: "Branch Office - Chicago",
      },

      // Production Rollout Events
      {
        id: "event-15",
        title: "Wave 1 Deployment Planning",
        description: "Detailed planning for first production wave",
        start: "2024-08-01T09:00:00",
        end: "2024-08-09T17:00:00",
        category: "planning",
        priority: "high",
        status: "scheduled",
        assignees: ["Project Manager", "Deployment Lead"],
        dependencies: ["event-14"],
        resources: ["Planning Tools", "Site Surveys"],
        location: "Headquarters - New York",
      },
      {
        id: "event-16",
        title: "Austin Site Deployment",
        description: "Production deployment at Austin remote office",
        start: "2024-08-15T08:00:00",
        end: "2024-08-30T17:00:00",
        category: "deployment",
        priority: "high",
        status: "scheduled",
        assignees: ["Deployment Team", "Local IT Support"],
        siteId: "site-3",
        siteName: "Remote Office - Austin",
        dependencies: ["event-15"],
        resources: ["Deployment Kit", "Local Resources"],
        location: "Remote Office - Austin",
      },
      {
        id: "event-17",
        title: "Manufacturing Site Preparation",
        description: "Special preparation for manufacturing environment",
        start: "2024-09-01T08:00:00",
        end: "2024-09-20T17:00:00",
        category: "preparation",
        priority: "high",
        status: "scheduled",
        assignees: ["Industrial IT Specialist", "Safety Coordinator"],
        siteId: "site-4",
        siteName: "Manufacturing - Detroit",
        dependencies: ["event-16"],
        resources: ["Industrial Equipment", "Safety Gear"],
        location: "Manufacturing - Detroit",
      },
      {
        id: "event-18",
        title: "IoT Device Integration Testing",
        description: "Comprehensive testing of IoT device integration",
        start: "2024-09-15T09:00:00",
        end: "2024-10-05T17:00:00",
        category: "testing",
        priority: "high",
        status: "scheduled",
        assignees: ["IoT Specialist", "Network Engineer"],
        siteId: "site-4",
        siteName: "Manufacturing - Detroit",
        dependencies: ["event-17"],
        resources: ["IoT Test Devices", "Monitoring Tools"],
        location: "Manufacturing - Detroit",
      },

      // Training and Documentation Events
      {
        id: "event-19",
        title: "Administrator Training Program",
        description: "Comprehensive training for system administrators",
        start: "2024-10-15T09:00:00",
        end: "2024-10-25T17:00:00",
        category: "training",
        priority: "medium",
        status: "scheduled",
        assignees: ["Training Team", "Subject Matter Experts"],
        dependencies: ["event-18"],
        resources: ["Training Lab", "Certification Materials"],
        location: "Multiple Locations",
      },
      {
        id: "event-20",
        title: "End User Training Rollout",
        description: "Organization-wide end user training program",
        start: "2024-11-01T09:00:00",
        end: "2024-11-30T17:00:00",
        category: "training",
        priority: "medium",
        status: "scheduled",
        assignees: ["Training Coordinators", "Local Champions"],
        dependencies: ["event-19"],
        resources: ["E-Learning Platform", "Training Videos"],
        location: "All Sites",
      },

      // Maintenance and Optimization Events
      {
        id: "event-21",
        title: "Performance Optimization Review",
        description: "System performance review and optimization",
        start: "2024-12-01T09:00:00",
        end: "2024-12-15T17:00:00",
        category: "optimization",
        priority: "medium",
        status: "scheduled",
        assignees: ["Performance Analyst", "System Architect"],
        dependencies: ["event-20"],
        resources: ["Monitoring Tools", "Performance Metrics"],
        location: "Headquarters - New York",
      },
      {
        id: "event-22",
        title: "Quarterly Security Review",
        description: "Comprehensive security posture review",
        start: "2025-01-15T09:00:00",
        end: "2025-01-25T17:00:00",
        category: "review",
        priority: "high",
        status: "scheduled",
        assignees: ["Security Team", "Compliance Officer"],
        dependencies: ["event-21"],
        resources: ["Security Assessment Tools", "Audit Reports"],
        location: "All Sites",
      },
      {
        id: "event-23",
        title: "System Health Check - All Sites",
        description: "Comprehensive system health and maintenance check",
        start: "2025-02-01T08:00:00",
        end: "2025-02-14T17:00:00",
        category: "maintenance",
        priority: "medium",
        status: "scheduled",
        assignees: ["Maintenance Team", "Site Coordinators"],
        dependencies: ["event-22"],
        resources: ["Diagnostic Tools", "Maintenance Kits"],
        location: "All Sites",
      },
      {
        id: "event-24",
        title: "Project Closure and Handover",
        description: "Formal project closure and operational handover",
        start: "2025-02-15T09:00:00",
        end: "2025-02-28T17:00:00",
        category: "closure",
        priority: "high",
        status: "scheduled",
        assignees: ["Project Manager", "Operations Manager"],
        dependencies: ["event-23"],
        resources: ["Documentation Package", "Handover Checklist"],
        location: "Headquarters - New York",
      },
    ]

    setEvents(demoEvents)

    // Store in localStorage
    localStorage.setItem("portnox-events", JSON.stringify(demoEvents))
  }

  const filterEvents = () => {
    let filtered = events

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) => event.category === selectedCategory)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((event) => event.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredEvents(filtered)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-gray-100 text-gray-800"
      case "delayed":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "kickoff":
        return "bg-purple-100 text-purple-800"
      case "planning":
        return "bg-blue-100 text-blue-800"
      case "assessment":
        return "bg-indigo-100 text-indigo-800"
      case "design":
        return "bg-cyan-100 text-cyan-800"
      case "deployment":
        return "bg-green-100 text-green-800"
      case "testing":
        return "bg-yellow-100 text-yellow-800"
      case "training":
        return "bg-pink-100 text-pink-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const categories = [...new Set(events.map((e) => e.category))]
  const statuses = [...new Set(events.map((e) => e.status))]

  if (events.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Timeline & Scheduler</CardTitle>
            <CardDescription>
              No timeline data available. Load demo data to see project timeline and events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Generate demo data to populate the project timeline</p>
              <Button onClick={generateDemoEvents}>Generate Demo Timeline Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Timeline & Scheduler</h2>
          <p className="text-gray-600">Project timeline, events, and milestone tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {filteredEvents
              .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
              .map((event, index) => (
                <Card key={event.id} className="relative">
                  {index < filteredEvents.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gray-200 z-0" />
                  )}
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                          event.status === "completed"
                            ? "bg-green-100"
                            : event.status === "in-progress"
                              ? "bg-blue-100"
                              : event.status === "delayed"
                                ? "bg-orange-100"
                                : event.status === "cancelled"
                                  ? "bg-red-100"
                                  : "bg-gray-100"
                        }`}
                      >
                        <Clock
                          className={`h-4 w-4 ${
                            event.status === "completed"
                              ? "text-green-600"
                              : event.status === "in-progress"
                                ? "text-blue-600"
                                : event.status === "delayed"
                                  ? "text-orange-600"
                                  : event.status === "cancelled"
                                    ? "text-red-600"
                                    : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-gray-600 text-sm">{event.description}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Badge className={getStatusColor(event.status)}>{event.status.replace("-", " ")}</Badge>
                            <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
                            <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.assignees.length} assignees</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs">
                          {event.assignees.map((assignee, i) => (
                            <Badge key={i} variant="outline">
                              {assignee}
                            </Badge>
                          ))}
                        </div>

                        {event.resources.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-gray-500">Resources: </span>
                            <span className="text-xs text-gray-600">{event.resources.join(", ")}</span>
                          </div>
                        )}

                        {event.dependencies.length > 0 && (
                          <div className="mt-1">
                            <span className="text-xs text-gray-500">Dependencies: </span>
                            <span className="text-xs text-gray-600">{event.dependencies.length} dependencies</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Monthly calendar view of all scheduled events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Calendar view implementation would go here
                <br />
                Showing {filteredEvents.length} events
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gantt Chart</CardTitle>
              <CardDescription>Project timeline with dependencies and critical path</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Gantt chart implementation would go here
                <br />
                Showing {filteredEvents.length} events with dependencies
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {events.filter((e) => e.status === "completed").length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {events.filter((e) => e.status === "in-progress").length}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {events.filter((e) => e.status === "scheduled").length}
              </div>
              <div className="text-sm text-gray-500">Scheduled</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {events.filter((e) => e.status === "delayed").length}
              </div>
              <div className="text-sm text-gray-500">Delayed</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
