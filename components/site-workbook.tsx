"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Calendar, Settings, CheckCircle, Clock, XCircle } from "lucide-react"
import { useSites } from "@/hooks/use-sites"

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const { sites } = useSites()
  const site = siteId ? sites.find((s) => s.id === siteId) : sites[0]
  if (!site) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-green-600"
      case "In Progress":
        return "text-blue-600"
      case "Planned":
        return "text-gray-600"
      case "Delayed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getChecklistIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "pending":
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const rows = [
    ["Site ID", site.id],
    ["Name", site.name],
    ["Region", site.region],
    ["Country", site.country],
    ["Users", site.users.toLocaleString()],
    ["Wired Vendor", site.wiredVendor.toUpperCase()],
    ["Wireless Vendor", site.wirelessVendor.toUpperCase()],
    ["Cloud Pref", site.cloudPreference.toUpperCase()],
    ["RADSec Deployment", site.radsecDeployment.toUpperCase()],
    ["MDM", site.mdm.map((m) => m.toUpperCase()).join(", ")],
    ["IdP", site.idp.toUpperCase()],
  ] as const

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Workbook: {site.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Site Information</span>
              </h3>

              <div className="space-y-3">
                {rows.slice(0, 5).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">{k}:</span>
                    <span className="font-mono">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Project Team</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Project Manager:</span>
                  <span>{site.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Technical Owners:</span>
                  <div className="text-right">
                    {site.technicalOwners.map((owner, index) => (
                      <div key={index}>{owner}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor(site.status)}`}>{site.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${site.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{site.completionPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Project Timeline</span>
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned Start:</span>
                  <span>{new Date(site.plannedStart).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned End:</span>
                  <span>{new Date(site.plannedEnd).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>
                    {Math.ceil(
                      (new Date(site.plannedEnd).getTime() - new Date(site.plannedStart).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Technical Configuration</span>
              </h3>

              <div className="space-y-3">
                {rows.slice(5).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="font-medium text-gray-600 dark:text-gray-400">{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deployment Checklist */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Deployment Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {site.deploymentChecklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {getChecklistIcon(item.status)}
                  <span className={`flex-1 ${item.status === "complete" ? "line-through text-gray-500" : ""}`}>
                    {item.item}
                  </span>
                  <Badge
                    variant={
                      item.status === "complete" ? "default" : item.status === "in-progress" ? "secondary" : "outline"
                    }
                    className="text-xs"
                  >
                    {item.status.replace("-", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Project Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">{site.notes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
