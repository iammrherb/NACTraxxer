"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, MapPin, Users, Calendar, Settings, Zap, Shield, Activity } from "lucide-react"

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  // Sample site data - in a real app this would be fetched based on siteId
  const siteData = siteId
    ? {
        id: "ABM-HQ001",
        name: "ABM Global Headquarters",
        region: "North America",
        country: "USA",
        priority: "High",
        phase: "1",
        users: 2500,
        projectManager: "Alex Rivera",
        technicalOwners: ["John Smith", "Mark Wilson"],
        status: "In Progress",
        completionPercent: 35,
        notes: "Executive network needs priority handling. Board room has custom AV equipment.",
        wiredVendors: ["Cisco", "Juniper"],
        wirelessVendors: ["Cisco"],
        deviceTypes: ["Windows", "Apple", "Mobile", "IoT"],
        radsec: "Native",
        plannedStart: "2025-08-01",
        plannedEnd: "2025-08-15",
      }
    : null

  if (!siteId || !siteData) {
    return (
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-cyber-primary glow-cyber-primary" />
            <span className="text-cyber-primary">Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 relative">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="relative z-10">
              <Book className="h-16 w-16 text-cyber-primary/50 mx-auto mb-4 glow-cyber-primary" />
              <h3 className="text-lg font-medium text-cyber-primary mb-2">No Site Selected</h3>
              <p className="text-muted-foreground">
                Please select a site from the Master List to view its detailed workbook.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "cyber-badge-danger"
      case "Medium":
        return "cyber-badge-warning"
      case "Low":
        return "cyber-badge-success"
      default:
        return "cyber-badge"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-cyber-accent"
      case "In Progress":
        return "text-cyber-primary"
      case "Planned":
        return "text-muted-foreground"
      case "Delayed":
        return "text-cyber-danger"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="cyber-card relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-cyber-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-radial from-cyber-secondary/20 to-transparent" />

        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-cyber-primary glow-cyber-primary" />
            <span className="text-cyber-primary">Site Workbook: {siteData.name}</span>
            <Badge className="cyber-badge-secondary ml-auto">
              <Activity className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-cyber-primary glow-cyber-primary" />
                <span className="text-cyber-primary">Site Information</span>
              </h3>

              <div className="space-y-3 bg-black/20 p-4 rounded-lg border border-cyber-primary/20 backdrop-blur-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">Site ID:</span>
                  <span className="font-mono text-cyber-accent glow-cyber-accent">{siteData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Region:</span>
                  <span className="text-cyber-primary">{siteData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Country:</span>
                  <span className="text-cyber-primary">{siteData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Priority:</span>
                  <Badge className={getPriorityColor(siteData.priority)}>
                    <Zap className="w-3 h-3 mr-1" />
                    {siteData.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Phase:</span>
                  <span className="text-cyber-secondary">Phase {siteData.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Users:</span>
                  <span className="text-cyber-accent font-mono">{siteData.users.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5 text-cyber-secondary glow-cyber-secondary" />
                <span className="text-cyber-secondary">Project Team</span>
              </h3>

              <div className="space-y-3 bg-black/20 p-4 rounded-lg border border-cyber-secondary/20 backdrop-blur-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Project Manager:</span>
                  <span className="text-cyber-secondary">{siteData.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Technical Owners:</span>
                  <div className="text-right">
                    {siteData.technicalOwners.map((owner, index) => (
                      <div key={index} className="text-cyber-secondary">
                        {owner}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Status:</span>
                  <span className={`font-medium ${getStatusColor(siteData.status)}`}>{siteData.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-muted-foreground">Completion:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 cyber-progress h-2">
                      <div
                        className="cyber-progress-bar h-full transition-all duration-1000"
                        style={{ width: `${siteData.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-cyber-primary font-mono">
                      {siteData.completionPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-cyber-accent glow-cyber-accent" />
                <span className="text-cyber-accent">Project Timeline</span>
              </h3>

              <div className="space-y-3 bg-black/20 p-4 rounded-lg border border-cyber-accent/20 backdrop-blur-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Planned Start:</span>
                  <span className="text-cyber-accent font-mono">
                    {new Date(siteData.plannedStart).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Planned End:</span>
                  <span className="text-cyber-accent font-mono">
                    {new Date(siteData.plannedEnd).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">Duration:</span>
                  <span className="text-cyber-accent font-mono">
                    {Math.ceil(
                      (new Date(siteData.plannedEnd).getTime() - new Date(siteData.plannedStart).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="h-5 w-5 text-cyber-warning glow-cyber-warning" />
                <span className="text-cyber-warning">Technical Configuration</span>
              </h3>

              <div className="space-y-3 bg-black/20 p-4 rounded-lg border border-cyber-warning/20 backdrop-blur-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">RADSEC Implementation:</span>
                  <Badge className="cyber-badge-warning">
                    <Shield className="w-3 h-3 mr-1" />
                    {siteData.radsec}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Wired Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wiredVendors.map((vendor, index) => (
                      <Badge key={index} className="cyber-badge text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Wireless Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wirelessVendors.map((vendor, index) => (
                      <Badge key={index} className="cyber-badge-secondary text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Device Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.deviceTypes.map((type, index) => (
                      <Badge key={index} className="cyber-badge-accent text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-cyber-primary/20">
            <h3 className="text-lg font-semibold mb-3 text-cyber-primary">Project Notes</h3>
            <div className="bg-black/30 rounded-lg p-4 border border-cyber-primary/20 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 cyber-grid opacity-10" />
              <p className="text-muted-foreground relative z-10">{siteData.notes}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
