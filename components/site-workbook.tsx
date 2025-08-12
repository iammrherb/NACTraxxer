"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Calendar, Users, MapPin, Settings } from "lucide-react"
import type { Site } from "@/lib/database"

interface SiteWorkbookProps {
  site: Site | null
}

export function SiteWorkbook({ site }: SiteWorkbookProps) {
  if (!site) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4" />
            <p>Select a site from the Master List to view its workbook</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Delayed":
        return "bg-red-500"
      case "Planned":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Site Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{site.name}</CardTitle>
              <p className="text-muted-foreground">Site ID: {site.id}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(site.status)}`} />
              <span className="font-medium">{site.status}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {site.country}, {site.region}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{site.users_count.toLocaleString()} users</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Phase {site.phase}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Overall Completion</span>
                <span className="text-sm font-bold">{site.completion_percent}%</span>
              </div>
              <Progress value={site.completion_percent} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Start Date:</span>
                <span className="ml-2 font-medium">{formatDate(site.planned_start)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">End Date:</span>
                <span className="ml-2 font-medium">{formatDate(site.planned_end)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Site Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Site Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <Badge className={getPriorityColor(site.priority)}>{site.priority}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RADSEC:</span>
              <span className="font-medium">{site.radsec}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Project Manager:</span>
              <span className="font-medium">{site.project_manager_name}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Technical Owners:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {site.technical_owners?.map((owner) => (
                  <Badge key={owner.id} variant="outline" className="text-xs">
                    {owner.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="text-muted-foreground">Wired Vendors:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {site.vendors
                  ?.filter((v) => v.type === "wired")
                  .map((vendor) => (
                    <Badge key={vendor.id} variant="outline" className="text-xs">
                      {vendor.name}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Wireless Vendors:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {site.vendors
                  ?.filter((v) => v.type === "wireless")
                  .map((vendor) => (
                    <Badge key={vendor.id} variant="outline" className="text-xs">
                      {vendor.name}
                    </Badge>
                  ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Device Types:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {site.device_types?.map((deviceType) => (
                  <Badge key={deviceType.id} variant="outline" className="text-xs">
                    {deviceType.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {site.checklist_items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.name}</span>
                {item.completed && item.completed_at && (
                  <span className="text-xs text-muted-foreground ml-auto">{formatDate(item.completed_at)}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {site.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{site.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
