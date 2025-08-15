"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  storage,
  type Site,
  type User,
  REGIONS,
  COUNTRIES,
  US_STATES,
  PHASES,
  WIRED_VENDORS,
  WIRELESS_VENDORS,
  FIREWALL_VENDORS,
  MDM_PROVIDERS,
} from "@/lib/storage"
import BulkSiteCreator from "./bulk-site-creator"
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  MapPin,
  Users,
  Network,
  CheckCircle,
  Clock,
  AlertCircle,
  Pause,
  Wifi,
  Shield,
  Settings,
  Globe,
  Server,
  Key,
  Smartphone,
  Eye,
  Copy,
  Layers,
} from "lucide-react"

interface SiteManagementProps {
  onSiteSelect?: (siteId: string) => void
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [regionFilter, setRegionFilter] = useState<string>("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showBulkCreator, setShowBulkCreator] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState<Partial<Site>>({
    name: "",
    location: "",
    region: "",
    country: "",
    state: "",
    city: "",
    siteType: "branch",
    status: "planning",
    priority: "medium",
    phase: "Phase 1 - Planning",
    users: 0,
    devices: 0,
    deviceBreakdown: {
      windows: 0,
      mac: 0,
      linux: 0,
      ios: 0,
      android: 0,
      iot: 0,
      medical: 0,
      printers: 0,
      cameras: 0,
      voip: 0,
      kiosks: 0,
      tablets: 0,
      chromeos: 0,
      other: 0,
    },
    assignedUsers: {
      projectManagers: [],
      technicalOwners: [],
      siteOwners: [],
      systemsEngineers: [],
      accountExecutives: [],
      technicalAccountManagers: [],
      technicians: [],
      securitySpecialists: [],
    },
    startDate: "",
    targetDate: "",
    progress: 0,
    wiredInfrastructure: {
      vendor: "cisco",
      switchModels: [],
      switchCount: 0,
      portCount: 0,
      stackingSupport: false,
      poeSupport: false,
      mgmtVlan: 100,
      firmware: "",
    },
    wirelessInfrastructure: {
      vendor: "cisco",
      controllerModel: "",
      apModels: [],
      apCount: 0,
      wifiStandards: [],
      bandSupport: [],
      meshSupport: false,
      firmware: "",
    },
    connectivity: {
      type: "internet",
      bandwidth: "",
      provider: "",
      redundancy: false,
    },
    identityProvider: {
      type: "azure-ad",
      domain: "",
      syncEnabled: false,
      mfaEnabled: false,
      conditionalAccess: false,
    },
    mdmProvider: {
      type: "intune",
      enrollmentType: "automatic",
      complianceEnabled: false,
      appManagement: false,
    },
    firewallInfrastructure: {
      vendor: "palo-alto",
      models: [],
      haConfiguration: false,
      userIdIntegration: false,
      syslogEnabled: false,
      firmware: "",
    },
    radiusConfiguration: {
      type: "cloud-radius",
      clustering: false,
      loadBalancing: false,
      certificates: false,
    },
    deviceAdministration: {
      type: "radius",
      privilegeLevels: [1, 15],
      commandAuthorization: false,
    },
    vlans: 5,
    subnets: [],
    dhcpScopes: 3,
    dnsServers: [],
    globalPolicies: [],
    sitePolicies: [],
    policyEnforcement: {
      dynamic_vlan: false,
      bandwidth_control: false,
      time_based_access: false,
      device_compliance: false,
      location_based: false,
    },
    complianceRequirements: [],
    securityStandards: [],
    dataClassification: "internal",
    notes: "",
    deploymentChecklist: [],
    riskAssessment: [],
    milestones: [],
  })

  const connectivityTypes = [
    { id: "mpls", name: "MPLS Network", description: "Multi-Protocol Label Switching" },
    { id: "sdwan", name: "SD-WAN", description: "Software-Defined Wide Area Network" },
    { id: "internet", name: "Internet Connection", description: "Standard internet connectivity" },
    { id: "expressroute", name: "Azure ExpressRoute", description: "Private connection to Azure" },
    { id: "directconnect", name: "AWS Direct Connect", description: "Private connection to AWS" },
    { id: "vpn", name: "Site-to-Site VPN", description: "IPSec VPN connection" },
    { id: "fiber", name: "Dedicated Fiber", description: "Private fiber optic connection" },
    { id: "satellite", name: "Satellite Connection", description: "Satellite internet connectivity" },
  ]

  const identityProviders = [
    { id: "azure-ad", name: "Microsoft Azure AD", description: "Azure Active Directory" },
    { id: "active-directory", name: "Active Directory", description: "On-premises Active Directory" },
    { id: "okta", name: "Okta", description: "Okta Identity Management" },
    { id: "ping", name: "Ping Identity", description: "PingFederate & PingDirectory" },
    { id: "jumpcloud", name: "JumpCloud", description: "Cloud directory service" },
    { id: "google-workspace", name: "Google Workspace", description: "Google Cloud Identity" },
    { id: "aws-sso", name: "AWS SSO", description: "AWS Single Sign-On" },
    { id: "onelogin", name: "OneLogin", description: "OneLogin identity platform" },
    { id: "auth0", name: "Auth0", description: "Auth0 identity platform" },
  ]

  useEffect(() => {
    loadData()

    const handleDemoDataLoaded = () => {
      loadData()
    }

    const handleSitesUpdated = () => {
      loadData()
    }

    window.addEventListener("demoDataLoaded", handleDemoDataLoaded)
    window.addEventListener("sitesUpdated", handleSitesUpdated)

    return () => {
      window.removeEventListener("demoDataLoaded", handleDemoDataLoaded)
      window.removeEventListener("sitesUpdated", handleSitesUpdated)
    }
  }, [])

  useEffect(() => {
    filterSites()
  }, [sites, searchTerm, statusFilter, priorityFilter, regionFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      const [sitesData, usersData] = await Promise.all([storage.getSites(), storage.getUsers()])
      setSites(sitesData || [])
      setUsers(usersData || [])

      window.dispatchEvent(new CustomEvent("sitesDataLoaded", { detail: { sites: sitesData, users: usersData } }))
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load sites and users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterSites = () => {
    let filtered = sites || []

    if (searchTerm) {
      filtered = filtered.filter(
        (site) =>
          site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
          site.country.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((site) => site.status === statusFilter)
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((site) => site.priority === priorityFilter)
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((site) => site.region === regionFilter)
    }

    setFilteredSites(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (!formData.name || !formData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      if (editingSite) {
        await storage.updateSite(editingSite.id, formData as Site)
        toast({
          title: "Site updated",
          description: "Site has been updated successfully.",
        })
      } else {
        await storage.createSite(formData as Omit<Site, "id" | "createdAt" | "updatedAt">)
        toast({
          title: "Site created",
          description: "New site has been created successfully.",
        })
      }

      setShowAddDialog(false)
      setEditingSite(null)
      resetForm()
      await loadData()

      window.dispatchEvent(new CustomEvent("sitesUpdated"))
    } catch (error) {
      console.error("Error saving site:", error)
      toast({
        title: "Error",
        description: "Failed to save site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (site: Site) => {
    setEditingSite(site)
    setFormData(site)
    setShowAddDialog(true)
    setActiveTab("basic")
  }

  const handleDelete = async (siteId: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return

    try {
      await storage.deleteSite(siteId)
      toast({
        title: "Site deleted",
        description: "Site has been deleted successfully.",
      })
      await loadData()

      window.dispatchEvent(new CustomEvent("sitesUpdated"))
    } catch (error) {
      console.error("Error deleting site:", error)
      toast({
        title: "Error",
        description: "Failed to delete site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDuplicate = async (site: Site) => {
    try {
      const duplicatedSite = {
        ...site,
        name: `${site.name} (Copy)`,
        status: "planning" as const,
        progress: 0,
      }
      delete (duplicatedSite as any).id
      delete (duplicatedSite as any).createdAt
      delete (duplicatedSite as any).updatedAt

      await storage.createSite(duplicatedSite)
      toast({
        title: "Site duplicated",
        description: "Site has been duplicated successfully.",
      })
      await loadData()

      window.dispatchEvent(new CustomEvent("sitesUpdated"))
    } catch (error) {
      console.error("Error duplicating site:", error)
      toast({
        title: "Error",
        description: "Failed to duplicate site. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      region: "",
      country: "",
      state: "",
      city: "",
      siteType: "branch",
      status: "planning",
      priority: "medium",
      phase: "Phase 1 - Planning",
      users: 0,
      devices: 0,
      deviceBreakdown: {
        windows: 0,
        mac: 0,
        linux: 0,
        ios: 0,
        android: 0,
        iot: 0,
        medical: 0,
        printers: 0,
        cameras: 0,
        voip: 0,
        kiosks: 0,
        tablets: 0,
        chromeos: 0,
        other: 0,
      },
      assignedUsers: {
        projectManagers: [],
        technicalOwners: [],
        siteOwners: [],
        systemsEngineers: [],
        accountExecutives: [],
        technicalAccountManagers: [],
        technicians: [],
        securitySpecialists: [],
      },
      startDate: "",
      targetDate: "",
      progress: 0,
      wiredInfrastructure: {
        vendor: "cisco",
        switchModels: [],
        switchCount: 0,
        portCount: 0,
        stackingSupport: false,
        poeSupport: false,
        mgmtVlan: 100,
        firmware: "",
      },
      wirelessInfrastructure: {
        vendor: "cisco",
        controllerModel: "",
        apModels: [],
        apCount: 0,
        wifiStandards: [],
        bandSupport: [],
        meshSupport: false,
        firmware: "",
      },
      connectivity: {
        type: "internet",
        bandwidth: "",
        provider: "",
        redundancy: false,
      },
      identityProvider: {
        type: "azure-ad",
        domain: "",
        syncEnabled: false,
        mfaEnabled: false,
        conditionalAccess: false,
      },
      mdmProvider: {
        type: "intune",
        enrollmentType: "automatic",
        complianceEnabled: false,
        appManagement: false,
      },
      firewallInfrastructure: {
        vendor: "palo-alto",
        models: [],
        haConfiguration: false,
        userIdIntegration: false,
        syslogEnabled: false,
        firmware: "",
      },
      radiusConfiguration: {
        type: "cloud-radius",
        clustering: false,
        loadBalancing: false,
        certificates: false,
      },
      deviceAdministration: {
        type: "radius",
        privilegeLevels: [1, 15],
        commandAuthorization: false,
      },
      vlans: 5,
      subnets: [],
      dhcpScopes: 3,
      dnsServers: [],
      globalPolicies: [],
      sitePolicies: [],
      policyEnforcement: {
        dynamic_vlan: false,
        bandwidth_control: false,
        time_based_access: false,
        device_compliance: false,
        location_based: false,
      },
      complianceRequirements: [],
      securityStandards: [],
      dataClassification: "internal",
      notes: "",
      deploymentChecklist: [],
      riskAssessment: [],
      milestones: [],
    })
    setActiveTab("basic")
  }

  const exportSites = async () => {
    try {
      const data = await storage.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `portnox-sites-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Export successful",
        description: "Sites data has been exported successfully.",
      })
    } catch (error) {
      console.error("Error exporting sites:", error)
      toast({
        title: "Error",
        description: "Failed to export sites. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: Site["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "implementation":
      case "testing":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "on-hold":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: Site["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "implementation":
      case "testing":
        return "bg-blue-100 text-blue-800"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: Site["priority"]) => {
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

  const handleSiteSelect = (site: Site) => {
    if (onSiteSelect) {
      onSiteSelect(site.id)
      toast({
        title: "Site Selected",
        description: `Selected ${site.name} for detailed view`,
      })
    }
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
              <MapPin className="h-6 w-6 text-blue-600" />
              <span>Master Site List & Configuration</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportSites}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowBulkCreator(true)}>
                <Layers className="h-4 w-4 mr-2" />
                Bulk Create
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSite ? "Edit Site Configuration" : "Add New Site"}</DialogTitle>
                  </DialogHeader>

                  <form onSubmit={handleSubmit}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                      <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
                        <TabsTrigger value="authentication">Authentication</TabsTrigger>
                        <TabsTrigger value="policies">Policies</TabsTrigger>
                        <TabsTrigger value="team">Team</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-4">
                        {/* Basic Site Information */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Site Name *</Label>
                            <Input
                              id="name"
                              value={formData.name || ""}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input
                              id="location"
                              value={formData.location || ""}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Select
                              value={formData.region}
                              onValueChange={(value) => setFormData({ ...formData, region: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                              </SelectTrigger>
                              <SelectContent>
                                {REGIONS.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={formData.country}
                              onValueChange={(value) => setFormData({ ...formData, country: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {COUNTRIES.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.country === "United States" && (
                            <div className="space-y-2">
                              <Label htmlFor="state">State</Label>
                              <Select
                                value={formData.state}
                                onValueChange={(value) => setFormData({ ...formData, state: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                  {US_STATES.map((state) => (
                                    <SelectItem key={state} value={state}>
                                      {state}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="siteType">Site Type</Label>
                            <Select
                              value={formData.siteType}
                              onValueChange={(value: Site["siteType"]) => setFormData({ ...formData, siteType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="headquarters">Headquarters</SelectItem>
                                <SelectItem value="branch">Branch Office</SelectItem>
                                <SelectItem value="campus">Campus</SelectItem>
                                <SelectItem value="department">Department</SelectItem>
                                <SelectItem value="floor">Floor</SelectItem>
                                <SelectItem value="building">Building</SelectItem>
                                <SelectItem value="datacenter">Data Center</SelectItem>
                                <SelectItem value="remote">Remote Site</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value: Site["status"]) => setFormData({ ...formData, status: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">Planning</SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="implementation">Implementation</SelectItem>
                                <SelectItem value="testing">Testing</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="on-hold">On Hold</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                              value={formData.priority}
                              onValueChange={(value: Site["priority"]) => setFormData({ ...formData, priority: value })}
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

                        <div className="space-y-2">
                          <Label htmlFor="phase">Phase</Label>
                          <Select
                            value={formData.phase}
                            onValueChange={(value) => setFormData({ ...formData, phase: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {PHASES.map((phase) => (
                                <SelectItem key={phase} value={phase}>
                                  {phase}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="users">User Count</Label>
                            <Input
                              id="users"
                              type="number"
                              min="0"
                              value={formData.users || 0}
                              onChange={(e) =>
                                setFormData({ ...formData, users: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="devices">Total Device Count</Label>
                            <Input
                              id="devices"
                              type="number"
                              min="0"
                              value={formData.devices || 0}
                              onChange={(e) =>
                                setFormData({ ...formData, devices: Number.parseInt(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>

                        {/* Device Breakdown */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Device Breakdown</h3>
                          <div className="grid grid-cols-4 gap-4">
                            {Object.entries(formData.deviceBreakdown || {}).map(([key, value]) => (
                              <div key={key} className="space-y-2">
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </Label>
                                <Input
                                  id={key}
                                  type="number"
                                  min="0"
                                  value={value}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      deviceBreakdown: {
                                        ...formData.deviceBreakdown!,
                                        [key]: Number.parseInt(e.target.value) || 0,
                                      },
                                    })
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={formData.startDate || ""}
                              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="targetDate">Target Date</Label>
                            <Input
                              id="targetDate"
                              type="date"
                              value={formData.targetDate || ""}
                              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea
                            id="notes"
                            value={formData.notes || ""}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="infrastructure" className="space-y-6">
                        {/* Wired Infrastructure */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Network className="h-5 w-5" />
                            <span>Wired Infrastructure</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Switch Vendor</Label>
                              <Select
                                value={formData.wiredInfrastructure?.vendor}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: { ...formData.wiredInfrastructure!, vendor: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {WIRED_VENDORS.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                      {vendor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Switch Count</Label>
                              <Input
                                type="number"
                                min="0"
                                value={formData.wiredInfrastructure?.switchCount || 0}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      switchCount: Number.parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>Port Count</Label>
                              <Input
                                type="number"
                                min="0"
                                value={formData.wiredInfrastructure?.portCount || 0}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      portCount: Number.parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Management VLAN</Label>
                              <Input
                                type="number"
                                min="1"
                                max="4094"
                                value={formData.wiredInfrastructure?.mgmtVlan || 100}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      mgmtVlan: Number.parseInt(e.target.value) || 100,
                                    },
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Firmware Version</Label>
                              <Input
                                value={formData.wiredInfrastructure?.firmware || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      firmware: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 17.09.02"
                              />
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.wiredInfrastructure?.stackingSupport || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      stackingSupport: checked,
                                    },
                                  })
                                }
                              />
                              <Label className="text-sm">Stacking Support</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.wiredInfrastructure?.poeSupport || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    wiredInfrastructure: {
                                      ...formData.wiredInfrastructure!,
                                      poeSupport: checked,
                                    },
                                  })
                                }
                              />
                              <Label className="text-sm">PoE+ Support</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Wireless Infrastructure */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Wifi className="h-5 w-5" />
                            <span>Wireless Infrastructure</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Wireless Vendor</Label>
                              <Select
                                value={formData.wirelessInfrastructure?.vendor}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    wirelessInfrastructure: {
                                      ...formData.wirelessInfrastructure!,
                                      vendor: value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {WIRELESS_VENDORS.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                      {vendor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Access Point Count</Label>
                              <Input
                                type="number"
                                min="0"
                                value={formData.wirelessInfrastructure?.apCount || 0}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wirelessInfrastructure: {
                                      ...formData.wirelessInfrastructure!,
                                      apCount: Number.parseInt(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Controller Model</Label>
                              <Input
                                value={formData.wirelessInfrastructure?.controllerModel || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wirelessInfrastructure: {
                                      ...formData.wirelessInfrastructure!,
                                      controllerModel: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 9800-CL"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Firmware Version</Label>
                              <Input
                                value={formData.wirelessInfrastructure?.firmware || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    wirelessInfrastructure: {
                                      ...formData.wirelessInfrastructure!,
                                      firmware: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 17.09.04"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={formData.wirelessInfrastructure?.meshSupport || false}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  wirelessInfrastructure: {
                                    ...formData.wirelessInfrastructure!,
                                    meshSupport: checked,
                                  },
                                })
                              }
                            />
                            <Label>Mesh Support</Label>
                          </div>
                        </div>

                        <Separator />

                        {/* Connectivity */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Globe className="h-5 w-5" />
                            <span>Network Connectivity</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Connection Type</Label>
                              <Select
                                value={formData.connectivity?.type}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    connectivity: { ...formData.connectivity!, type: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {connectivityTypes.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      <div>
                                        <div className="font-medium">{type.name}</div>
                                        <div className="text-xs text-gray-500">{type.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Bandwidth</Label>
                              <Input
                                value={formData.connectivity?.bandwidth || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    connectivity: { ...formData.connectivity!, bandwidth: e.target.value },
                                  })
                                }
                                placeholder="e.g., 100 Mbps, 1 Gbps"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Provider</Label>
                              <Input
                                value={formData.connectivity?.provider || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    connectivity: { ...formData.connectivity!, provider: e.target.value },
                                  })
                                }
                                placeholder="ISP or carrier name"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch
                                checked={formData.connectivity?.redundancy || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    connectivity: { ...formData.connectivity!, redundancy: checked },
                                  })
                                }
                              />
                              <Label>Redundant Connection</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Firewall Infrastructure */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Firewall Infrastructure</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Firewall Vendor</Label>
                              <Select
                                value={formData.firewallInfrastructure?.vendor}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    firewallInfrastructure: {
                                      ...formData.firewallInfrastructure!,
                                      vendor: value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {FIREWALL_VENDORS.map((vendor) => (
                                    <SelectItem key={vendor.id} value={vendor.id}>
                                      {vendor.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Firmware Version</Label>
                              <Input
                                value={formData.firewallInfrastructure?.firmware || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    firewallInfrastructure: {
                                      ...formData.firewallInfrastructure!,
                                      firmware: e.target.value,
                                    },
                                  })
                                }
                                placeholder="e.g., 11.0.2"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.firewallInfrastructure?.haConfiguration || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    firewallInfrastructure: {
                                      ...formData.firewallInfrastructure!,
                                      haConfiguration: checked,
                                    },
                                  })
                                }
                              />
                              <Label>High Availability</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.firewallInfrastructure?.userIdIntegration || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    firewallInfrastructure: {
                                      ...formData.firewallInfrastructure!,
                                      userIdIntegration: checked,
                                    },
                                  })
                                }
                              />
                              <Label>User-ID Integration</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.firewallInfrastructure?.syslogEnabled || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    firewallInfrastructure: {
                                      ...formData.firewallInfrastructure!,
                                      syslogEnabled: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Syslog Integration</Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="authentication" className="space-y-6">
                        {/* Identity Provider */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Identity Provider</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Identity Provider</Label>
                              <Select
                                value={formData.identityProvider?.type}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    identityProvider: { ...formData.identityProvider!, type: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {identityProviders.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                      <div>
                                        <div className="font-medium">{provider.name}</div>
                                        <div className="text-xs text-gray-500">{provider.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Domain</Label>
                              <Input
                                value={formData.identityProvider?.domain || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    identityProvider: { ...formData.identityProvider!, domain: e.target.value },
                                  })
                                }
                                placeholder="company.com"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.identityProvider?.syncEnabled || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    identityProvider: {
                                      ...formData.identityProvider!,
                                      syncEnabled: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Directory Sync</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.identityProvider?.mfaEnabled || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    identityProvider: {
                                      ...formData.identityProvider!,
                                      mfaEnabled: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Multi-Factor Auth</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.identityProvider?.conditionalAccess || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    identityProvider: {
                                      ...formData.identityProvider!,
                                      conditionalAccess: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Conditional Access</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* MDM Provider */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Smartphone className="h-5 w-5" />
                            <span>Mobile Device Management</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>MDM Provider</Label>
                              <Select
                                value={formData.mdmProvider?.type}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    mdmProvider: { ...formData.mdmProvider!, type: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {MDM_PROVIDERS.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                      <div>
                                        <div className="font-medium">{provider.name}</div>
                                        <div className="text-xs text-gray-500">{provider.description}</div>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Enrollment Type</Label>
                              <Select
                                value={formData.mdmProvider?.enrollmentType}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    mdmProvider: { ...formData.mdmProvider!, enrollmentType: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="automatic">Automatic</SelectItem>
                                  <SelectItem value="manual">Manual</SelectItem>
                                  <SelectItem value="bulk">Bulk Enrollment</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.mdmProvider?.complianceEnabled || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    mdmProvider: {
                                      ...formData.mdmProvider!,
                                      complianceEnabled: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Compliance Enforcement</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.mdmProvider?.appManagement || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    mdmProvider: {
                                      ...formData.mdmProvider!,
                                      appManagement: checked,
                                    },
                                  })
                                }
                              />
                              <Label>App Management</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* RADIUS Configuration */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Server className="h-5 w-5" />
                            <span>RADIUS Configuration</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>RADIUS Type</Label>
                              <Select
                                value={formData.radiusConfiguration?.type}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    radiusConfiguration: { ...formData.radiusConfiguration!, type: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cloud-radius">Cloud RADIUS</SelectItem>
                                  <SelectItem value="on-premise-radius">On-Premise RADIUS</SelectItem>
                                  <SelectItem value="radius-proxy">RADIUS Proxy</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>RADIUS Vendor</Label>
                              <Select
                                value={formData.radiusConfiguration?.vendor || "none"}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    radiusConfiguration: {
                                      ...formData.radiusConfiguration!,
                                      vendor: value === "none" ? undefined : value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Select vendor</SelectItem>
                                  <SelectItem value="cisco-ise">Cisco Identity Services Engine</SelectItem>
                                  <SelectItem value="aruba-clearpass">Aruba ClearPass</SelectItem>
                                  <SelectItem value="bradford-campus-manager">Bradford Campus Manager</SelectItem>
                                  <SelectItem value="freeradius">FreeRADIUS</SelectItem>
                                  <SelectItem value="windows-nps">Windows Network Policy Server</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.radiusConfiguration?.clustering || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    radiusConfiguration: {
                                      ...formData.radiusConfiguration!,
                                      clustering: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Clustering</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.radiusConfiguration?.loadBalancing || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    radiusConfiguration: {
                                      ...formData.radiusConfiguration!,
                                      loadBalancing: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Load Balancing</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={formData.radiusConfiguration?.certificates || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    radiusConfiguration: {
                                      ...formData.radiusConfiguration!,
                                      certificates: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Certificate Auth</Label>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        {/* Device Administration */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center space-x-2">
                            <Key className="h-5 w-5" />
                            <span>Device Administration</span>
                          </h3>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Administration Type</Label>
                              <Select
                                value={formData.deviceAdministration?.type}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    deviceAdministration: { ...formData.deviceAdministration!, type: value },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="radius">RADIUS</SelectItem>
                                  <SelectItem value="tacacs">TACACS+</SelectItem>
                                  <SelectItem value="both">Both RADIUS & TACACS+</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Administration Vendor</Label>
                              <Select
                                value={formData.deviceAdministration?.vendor || "none"}
                                onValueChange={(value) =>
                                  setFormData({
                                    ...formData,
                                    deviceAdministration: {
                                      ...formData.deviceAdministration!,
                                      vendor: value === "none" ? undefined : value,
                                    },
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">Select vendor</SelectItem>
                                  <SelectItem value="cisco-ise">Cisco Identity Services Engine</SelectItem>
                                  <SelectItem value="aruba-clearpass">Aruba ClearPass</SelectItem>
                                  <SelectItem value="freeradius">FreeRADIUS</SelectItem>
                                  <SelectItem value="tacacs-plus">TACACS+ Server</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Privilege Levels</Label>
                              <Input
                                value={formData.deviceAdministration?.privilegeLevels?.join(", ") || ""}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    deviceAdministration: {
                                      ...formData.deviceAdministration!,
                                      privilegeLevels: e.target.value
                                        .split(",")
                                        .map((p) => Number.parseInt(p.trim()))
                                        .filter((p) => !isNaN(p)),
                                    },
                                  })
                                }
                                placeholder="1, 15"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                              <Switch
                                checked={formData.deviceAdministration?.commandAuthorization || false}
                                onCheckedChange={(checked) =>
                                  setFormData({
                                    ...formData,
                                    deviceAdministration: {
                                      ...formData.deviceAdministration!,
                                      commandAuthorization: checked,
                                    },
                                  })
                                }
                              />
                              <Label>Command Authorization</Label>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="policies" className="space-y-4">
                        {/* Policy Configuration will be integrated with PolicyManagement component */}
                        <div className="text-center py-12">
                          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Configuration</h3>
                          <p className="text-gray-600 mb-4">
                            Configure site-specific and global policies for this location.
                          </p>
                          <Button>
                            <Settings className="h-4 w-4 mr-2" />
                            Configure Policies
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="team" className="space-y-4">
                        {/* Team Assignment */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Team Assignments</h3>

                          {Object.entries(formData.assignedUsers || {}).map(([role, assignedUserIds]) => (
                            <div key={role} className="space-y-2">
                              <Label className="capitalize">{role.replace(/([A-Z])/g, " $1")}</Label>
                              <Select
                                value={assignedUserIds.length > 0 ? assignedUserIds.join(",") : "none"}
                                onValueChange={(value) => {
                                  const userIds = value === "none" ? [] : value.split(",")
                                  setFormData({
                                    ...formData,
                                    assignedUsers: {
                                      ...formData.assignedUsers!,
                                      [role]: userIds,
                                    },
                                  })
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={`Select ${role.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="none">No assignment</SelectItem>
                                  {users
                                    ?.filter((user) =>
                                      role === "projectManagers"
                                        ? user.role === "project-manager"
                                        : role === "technicalOwners"
                                          ? user.role === "technical-owner"
                                          : role === "siteOwners"
                                            ? user.role === "site-owner"
                                            : role === "systemsEngineers"
                                              ? user.role === "systems-engineer"
                                              : role === "accountExecutives"
                                                ? user.role === "account-executive"
                                                : role === "technicalAccountManagers"
                                                  ? user.role === "technical-account-manager"
                                                  : role === "technicians"
                                                    ? user.role === "technician"
                                                    : role === "securitySpecialists"
                                                      ? user.role === "security-specialist"
                                                      : true,
                                    )
                                    .map((user) => (
                                      <SelectItem key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="advanced" className="space-y-4">
                        {/* Advanced Configuration */}
                        <div className="space-y-6">
                          {/* Network Configuration */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Network Configuration</h3>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>VLANs</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={formData.vlans || 5}
                                  onChange={(e) =>
                                    setFormData({ ...formData, vlans: Number.parseInt(e.target.value) || 5 })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>DHCP Scopes</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={formData.dhcpScopes || 3}
                                  onChange={(e) =>
                                    setFormData({ ...formData, dhcpScopes: Number.parseInt(e.target.value) || 3 })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Data Classification</Label>
                                <Select
                                  value={formData.dataClassification}
                                  onValueChange={(value) =>
                                    setFormData({ ...formData, dataClassification: value as any })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="public">Public</SelectItem>
                                    <SelectItem value="internal">Internal</SelectItem>
                                    <SelectItem value="confidential">Confidential</SelectItem>
                                    <SelectItem value="restricted">Restricted</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Subnets</Label>
                                <Textarea
                                  value={formData.subnets?.join("\n") || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      subnets: e.target.value.split("\n").filter((s) => s.trim()),
                                    })
                                  }
                                  placeholder="10.1.0.0/24&#10;10.2.0.0/24"
                                  rows={3}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>DNS Servers</Label>
                                <Textarea
                                  value={formData.dnsServers?.join("\n") || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      dnsServers: e.target.value.split("\n").filter((s) => s.trim()),
                                    })
                                  }
                                  placeholder="8.8.8.8&#10;8.8.4.4"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Policy Enforcement */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Policy Enforcement Features</h3>

                            <div className="grid grid-cols-2 gap-4">
                              {Object.entries(formData.policyEnforcement || {}).map(([feature, enabled]) => (
                                <div key={feature} className="flex items-center space-x-2">
                                  <Switch
                                    checked={enabled}
                                    onCheckedChange={(checked) =>
                                      setFormData({
                                        ...formData,
                                        policyEnforcement: {
                                          ...formData.policyEnforcement!,
                                          [feature]: checked,
                                        },
                                      })
                                    }
                                  />
                                  <Label className="capitalize">{feature.replace(/_/g, " ")}</Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          {/* Compliance */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Compliance & Security</h3>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Compliance Requirements</Label>
                                <Textarea
                                  value={formData.complianceRequirements?.join(", ") || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      complianceRequirements: e.target.value
                                        .split(",")
                                        .map((r) => r.trim())
                                        .filter((r) => r),
                                    })
                                  }
                                  placeholder="SOX, PCI-DSS, HIPAA, GDPR"
                                  rows={2}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Security Standards</Label>
                                <Textarea
                                  value={formData.securityStandards?.join(", ") || ""}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      securityStandards: e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter((s) => s),
                                    })
                                  }
                                  placeholder="NIST, ISO 27001, CIS Controls"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                      <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">{editingSite ? "Update" : "Create"} Site</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {REGIONS.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="implementation">Implementation</SelectItem>
                <SelectItem value="testing">Testing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sites Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Infrastructure</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow
                    key={site.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onSiteSelect?.(site.id)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{site.name}</div>
                        <div className="text-sm text-gray-500">
                          {site.siteType} • {site.phase}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{site.location}</div>
                        <div className="text-sm text-gray-500">{site.region}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(site.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(site.status)}
                          <span>{site.status.replace("-", " ")}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(site.priority)}>{site.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={site.progress} className="w-16" />
                        <span className="text-sm text-gray-600">{site.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-3 w-3" />
                        <span>{Object.values(site.assignedUsers || {}).flat().length} assigned</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(site.targetDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Network className="h-3 w-3" />
                        <span>{site.wiredInfrastructure?.switchCount || 0}SW</span>
                        <Wifi className="h-3 w-3" />
                        <span>{site.wirelessInfrastructure?.apCount || 0}AP</span>
                        <Users className="h-3 w-3 ml-2" />
                        <span>{site.users}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSiteSelect(site)
                          }}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicate(site)
                          }}
                          title="Duplicate Site"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(site)
                          }}
                          title="Edit Site"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(site.id)
                          }}
                          title="Delete Site"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sites found</h3>
              <p className="text-gray-600 mb-4">
                {sites?.length === 0
                  ? "Get started by adding your first site."
                  : "Try adjusting your search or filters."}
              </p>
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => {
                    resetForm()
                    setShowAddDialog(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
                <Button variant="outline" onClick={() => setShowBulkCreator(true)}>
                  <Layers className="h-4 w-4 mr-2" />
                  Bulk Create
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Site Creator Modal */}
      <BulkSiteCreator
        open={showBulkCreator}
        onOpenChange={setShowBulkCreator}
        onSitesCreated={() => {
          loadData()
          setShowBulkCreator(false)
        }}
      />
    </div>
  )
}
