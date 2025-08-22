"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, MapPin, Users, Calendar, Settings } from "lucide-react"
import { storage } from "@/lib/storage"
import { useEffect, useState } from "react"

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (siteId) {
      setLoading(true)
      console.log("[v0] Loading site workbook for siteId:", siteId)

      const loadSiteData = async () => {
        try {
          // Get the actual site data from storage
          const sites = await storage.getSites()
          const users = await storage.getUsers()
          const events = await storage.getEvents()
          const policies = await storage.getPolicies()

          console.log("[v0] Available sites:", sites.length)
          console.log("[v0] Available users:", users.length)
          console.log("[v0] Available events:", events.length)

          const site = sites.find((s) => s.id === siteId)
          console.log("[v0] Found site:", site)

          if (site) {
            // Get associated users and events for this site

            // Transform the site data to match the expected format
            const transformedSite = {
              id: site.id,
              name: site.name,
              region: site.region || "North America",
              country: site.country || "USA",
              priority: site.priority || "High",
              phase: site.phase || "1",
              users: site.userCount || site.users || 100,
              projectManager: users.find((u) => u.role === "project-manager")?.name || "Project Manager",
              technicalOwners: users
                .filter((u) => u.role === "technical-owner" || u.role === "systems-engineer")
                .map((u) => u.name)
                .slice(0, 2) || ["Technical Owner"],
              status: site.status || "In Progress",
              completionPercent: site.completionPercent || Math.floor(Math.random() * 80) + 10,
              notes:
                site.notes ||
                site.description ||
                `${site.type} deployment with ${site.userCount || 100} users. Compliance requirements: ${site.complianceFrameworks?.join(", ") || "Standard security protocols"}.`,
              wiredVendors: site.wiredVendors || site.networkVendors || ["Cisco"],
              wirelessVendors: site.wirelessVendors || site.networkVendors || ["Cisco"],
              deviceTypes: site.deviceTypes || ["Windows", "Apple", "Mobile"],
              radsec: site.radsecConfiguration || "Native",
              plannedStart: site.plannedStart || "2025-01-01",
              plannedEnd: site.plannedEnd || "2025-03-01",
            }

            setSiteData(transformedSite)
            console.log("[v0] Site workbook data loaded:", transformedSite)
          } else {
            console.log("[v0] Site not found for ID:", siteId)
            setSiteData(null)
          }
        } catch (error) {
          console.error("[v0] Error loading site data:", error)
          setSiteData(null)
        } finally {
          setLoading(false)
        }
      }

      loadSiteData()
    } else {
      console.log("[v0] No siteId provided to SiteWorkbook")
      setSiteData(null)
    }
  }, [siteId])

  if (!siteId || loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {loading ? "Loading Site Data..." : "No Site Selected"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {loading
                ? "Please wait while we load the site information."
                : "Please select a site from the Master List to view its detailed workbook."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!siteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Site Not Found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The selected site could not be found. Please try selecting a different site.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook: {siteData.name}</span>
          </CardTitle>
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
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Site ID:</span>
                  <span className="font-mono">{siteData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                  <span>{siteData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Country:</span>
                  <span>{siteData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                  <Badge className={getPriorityColor(siteData.priority)}>{siteData.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Phase:</span>
                  <span>Phase {siteData.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Users:</span>
                  <span>{siteData.users.toLocaleString()}</span>
                </div>
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
                  <span>{siteData.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Technical Owners:</span>
                  <div className="text-right">
                    {siteData.technicalOwners.map((owner, index) => (
                      <div key={index}>{owner}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor(siteData.status)}`}>{siteData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${siteData.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{siteData.completionPercent}%</span>
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
                  <span>{new Date(siteData.plannedStart).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned End:</span>
                  <span>{new Date(siteData.plannedEnd).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>
                    {Math.ceil(
                      (new Date(siteData.plannedEnd).getTime() - new Date(siteData.plannedStart).getTime()) /
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
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">RADSEC Implementation:</span>
                  <Badge variant="outline">{siteData.radsec}</Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wired Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wiredVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wireless Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wirelessVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Device Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.deviceTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Project Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">{siteData.notes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
