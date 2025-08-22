"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Checkbox } from "./ui/checkbox"
import { 
  FileText, 
  Download, 
  Upload, 
  Save, 
  MapPin, 
  Users, 
  Network, 
  Shield, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock
} from "lucide-react"
import { storage, type Site } from "../lib/storage"

interface SiteWorkbookData {
  siteInfo: {
    name: string
    location: string
    contactPerson: string
    email: string
    phone: string
    businessHours: string
  }
  networkInfo: {
    wiredVendor: string
    wirelessVendor: string
    firewallVendor: string
    switchCount: number
    apCount: number
    firewallCount: number
    internetBandwidth: string
    networkTopology: string
  }
  userInfo: {
    totalUsers: number
    employeeCount: number
    contractorCount: number
    guestCount: number
    departmentBreakdown: Record<string, number>
  }
  deviceInfo: {
    windowsDevices: number
    macDevices: number
    iosDevices: number
    androidDevices: number
    linuxDevices: number
    iotDevices: number
    specialDevices: string[]
  }
  securityRequirements: {
    complianceFrameworks: string[]
    authenticationMethods: string[]
    encryptionRequirements: string[]
    accessControlPolicies: string[]
    specialRequirements: string[]
  }
  deploymentPlan: {
    phases: Array<{
      name: string
      description: string
      duration: string
      dependencies: string[]
      resources: string[]
    }>
    riskAssessment: {
      technicalRisks: string[]
      businessRisks: string[]
      mitigationStrategies: string[]
    }
  }
}

export default function SiteWorkbook() {
  const [selectedSite, setSelectedSite] = useState<string>("")
  const [sites, setSites] = useState<Site[]>([])
  const [workbookData, setWorkbookData] = useState<SiteWorkbookData>({
    siteInfo: {
      name: "",
      location: "",
      contactPerson: "",
      email: "",
      phone: "",
      businessHours: ""
    },
    networkInfo: {
      wiredVendor: "",
      wirelessVendor: "",
      firewallVendor: "",
      switchCount: 0,
      apCount: 0,
      firewallCount: 0,
      internetBandwidth: "",
      networkTopology: ""
    },
    userInfo: {
      totalUsers: 0,
      employeeCount: 0,
      contractorCount: 0,
      guestCount: 0,
      departmentBreakdown: {}
    },
    deviceInfo: {
      windowsDevices: 0,
      macDevices: 0,
      iosDevices: 0,
      androidDevices: 0,
      linuxDevices: 0,
      iotDevices: 0,
      specialDevices: []
    },
    securityRequirements: {
      complianceFrameworks: [],
      authenticationMethods: [],
      encryptionRequirements: [],
      accessControlPolicies: [],
      specialRequirements: []
    },
    deploymentPlan: {
      phases: [
        {
          name: "Phase 1: Planning & Assessment",
          description: "Site survey, network assessment, and initial configuration",
          duration: "2-3 weeks",
          dependencies: [],
          resources: ["Network Engineer", "Security Analyst"]
        },
        {
          name: "Phase 2: Infrastructure Setup", 
          description: "Hardware installation and network configuration",
          duration: "3-4 weeks",
          dependencies: ["Phase 1"],
          resources: ["Field Technician", "Network Engineer"]
        },
        {
          name: "Phase 3: Policy Configuration",
          description: "NAC policy setup and user group configuration",
          duration: "2-3 weeks", 
          dependencies: ["Phase 2"],
          resources: ["Security Engineer", "System Administrator"]
        },
        {
          name: "Phase 4: Testing & Validation",
          description: "End-to-end testing and user acceptance testing",
          duration: "1-2 weeks",
          dependencies: ["Phase 3"],
          resources: ["QA Engineer", "End Users"]
        },
        {
          name: "Phase 5: Go-Live & Support",
          description: "Production deployment and ongoing support",
          duration: "1 week",
          dependencies: ["Phase 4"],
          resources: ["Support Team", "Project Manager"]
        }
      ],
      riskAssessment: {
        technicalRisks: [
          "Network compatibility issues",
          "Legacy device integration challenges",
          "Performance impact on critical systems"
        ],
        businessRisks: [
          "User productivity disruption",
          "Compliance violation during transition",
          "Budget overrun due to unforeseen requirements"
        ],
        mitigationStrategies: [
          "Comprehensive pre-deployment testing",
          "Phased rollout approach",
          "24/7 support during transition",
          "Rollback procedures documented"
        ]
      }
    }
  })

  useEffect(() => {
    const loadSites = async () => {
      const loadedSites = await storage.getSites()
      setSites(loadedSites)
    }
    loadSites()
  }, [])

  const loadSiteData = (siteId: string) => {
    const site = sites.find(s => s.id === siteId)
    if (site) {
      setWorkbookData(prev => ({
        ...prev,
        siteInfo: {
          name: site.name,
          location: site.location,
          contactPerson: site.projectManager || "",
          email: "",
          phone: "",
          businessHours: "9 AM - 5 PM"
        },
        userInfo: {
          totalUsers: site.users || 0,
          employeeCount: Math.round((site.users || 0) * 0.8),
          contractorCount: Math.round((site.users || 0) * 0.15),
          guestCount: Math.round((site.users || 0) * 0.05),
          departmentBreakdown: {
            "IT": Math.round((site.users || 0) * 0.1),
            "Finance": Math.round((site.users || 0) * 0.15),
            "HR": Math.round((site.users || 0) * 0.1),
            "Operations": Math.round((site.users || 0) * 0.4),
            "Management": Math.round((site.users || 0) * 0.25)
          }
        },
        deviceInfo: {
          windowsDevices: Math.round((site.devices as number || 0) * 0.6),
          macDevices: Math.round((site.devices as number || 0) * 0.2),
          iosDevices: Math.round((site.devices as number || 0) * 0.1),
          androidDevices: Math.round((site.devices as number || 0) * 0.05),
          linuxDevices: Math.round((site.devices as number || 0) * 0.03),
          iotDevices: Math.round((site.devices as number || 0) * 0.02),
          specialDevices: site.specialRequirements || []
        }
      }))
    }
  }

  const exportWorkbook = () => {
    const dataStr = JSON.stringify(workbookData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `${workbookData.siteInfo.name.replace(/\s+/g, '_')}_workbook.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const completionPercentage = () => {
    let completed = 0
    let total = 0
    
    // Check each section for completion
    Object.entries(workbookData.siteInfo).forEach(([key, value]) => {
      total++
      if (value && value.toString().trim() !== "") completed++
    })
    
    Object.entries(workbookData.networkInfo).forEach(([key, value]) => {
      total++
      if (value && (typeof value === 'string' ? value.trim() !== "" : value > 0)) completed++
    })
    
    // Add more sections as needed
    return Math.round((completed / total) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Site Workbook</h2>
            <p className="text-muted-foreground">Comprehensive site documentation and deployment planning</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm" onClick={exportWorkbook}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* Site Selection */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label htmlFor="siteSelect">Select Site</Label>
                <Select value={selectedSite} onValueChange={(value) => {
                  setSelectedSite(value)
                  loadSiteData(value)
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a site to document..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map(site => (
                      <SelectItem key={site.id} value={site.id}>
                        <div className="flex items-center space-x-2">
                          <span>{site.name}</span>
                          <Badge variant="secondary" className="text-xs">{site.status}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedSite && (
                <div className="text-center">
                  <div className="text-lg font-semibold text-primary">{completionPercentage()}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedSite ? (
        <Tabs defaultValue="site-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="site-info" className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span className="hidden sm:inline">Site Info</span>
            </TabsTrigger>
            <TabsTrigger value="network" className="flex items-center space-x-1">
              <Network className="h-3 w-3" />
              <span className="hidden sm:inline">Network</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-1">
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site-info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Site Information</span>
                </CardTitle>
                <CardDescription>Basic site details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={workbookData.siteInfo.name}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, name: e.target.value }
                      }))}
                      placeholder="Enter site name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={workbookData.siteInfo.location}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, location: e.target.value }
                      }))}
                      placeholder="Enter location"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={workbookData.siteInfo.contactPerson}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, contactPerson: e.target.value }
                      }))}
                      placeholder="Primary contact name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={workbookData.siteInfo.email}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, email: e.target.value }
                      }))}
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={workbookData.siteInfo.phone}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, phone: e.target.value }
                      }))}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessHours">Business Hours</Label>
                    <Input
                      id="businessHours"
                      value={workbookData.siteInfo.businessHours}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        siteInfo: { ...prev.siteInfo, businessHours: e.target.value }
                      }))}
                      placeholder="9 AM - 5 PM"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>Network Infrastructure</span>
                </CardTitle>
                <CardDescription>Current network setup and infrastructure details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="wiredVendor">Wired Network Vendor</Label>
                    <Select value={workbookData.networkInfo.wiredVendor} onValueChange={(value) => 
                      setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, wiredVendor: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="juniper">Juniper</SelectItem>
                        <SelectItem value="hp">HP/Aruba</SelectItem>
                        <SelectItem value="extreme">Extreme Networks</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="wirelessVendor">Wireless Vendor</Label>
                    <Select value={workbookData.networkInfo.wirelessVendor} onValueChange={(value) => 
                      setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, wirelessVendor: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cisco">Cisco</SelectItem>
                        <SelectItem value="aruba">Aruba</SelectItem>
                        <SelectItem value="ruckus">Ruckus</SelectItem>
                        <SelectItem value="ubiquiti">Ubiquiti</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="firewallVendor">Firewall Vendor</Label>
                    <Select value={workbookData.networkInfo.firewallVendor} onValueChange={(value) => 
                      setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, firewallVendor: value }
                      }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="palo-alto">Palo Alto</SelectItem>
                        <SelectItem value="fortinet">Fortinet</SelectItem>
                        <SelectItem value="cisco">Cisco ASA</SelectItem>
                        <SelectItem value="checkpoint">Check Point</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="switchCount">Switch Count</Label>
                    <Input
                      id="switchCount"
                      type="number"
                      value={workbookData.networkInfo.switchCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, switchCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apCount">Access Points</Label>
                    <Input
                      id="apCount"
                      type="number"
                      value={workbookData.networkInfo.apCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, apCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="firewallCount">Firewalls</Label>
                    <Input
                      id="firewallCount"
                      type="number"
                      value={workbookData.networkInfo.firewallCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, firewallCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="internetBandwidth">Internet Bandwidth</Label>
                    <Input
                      id="internetBandwidth"
                      value={workbookData.networkInfo.internetBandwidth}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        networkInfo: { ...prev.networkInfo, internetBandwidth: e.target.value }
                      }))}
                      placeholder="e.g., 100 Mbps"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="networkTopology">Network Topology Notes</Label>
                  <Textarea
                    id="networkTopology"
                    value={workbookData.networkInfo.networkTopology}
                    onChange={(e) => setWorkbookData(prev => ({
                      ...prev,
                      networkInfo: { ...prev.networkInfo, networkTopology: e.target.value }
                    }))}
                    placeholder="Describe the network topology, VLANs, and any special configurations..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Information</span>
                </CardTitle>
                <CardDescription>User demographics and department breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="totalUsers">Total Users</Label>
                    <Input
                      id="totalUsers"
                      type="number"
                      value={workbookData.userInfo.totalUsers || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        userInfo: { ...prev.userInfo, totalUsers: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount">Employees</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={workbookData.userInfo.employeeCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        userInfo: { ...prev.userInfo, employeeCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractorCount">Contractors</Label>
                    <Input
                      id="contractorCount"
                      type="number"
                      value={workbookData.userInfo.contractorCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        userInfo: { ...prev.userInfo, contractorCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guestCount">Guests</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={workbookData.userInfo.guestCount || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        userInfo: { ...prev.userInfo, guestCount: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-3">Department Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(workbookData.userInfo.departmentBreakdown).map(([dept, count]) => (
                      <div key={dept} className="flex items-center justify-between p-3 border rounded">
                        <span>{dept}</span>
                        <Input
                          type="number"
                          value={count || ""}
                          onChange={(e) => setWorkbookData(prev => ({
                            ...prev,
                            userInfo: {
                              ...prev.userInfo,
                              departmentBreakdown: {
                                ...prev.userInfo.departmentBreakdown,
                                [dept]: parseInt(e.target.value) || 0
                              }
                            }
                          }))}
                          className="w-20"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Device Inventory</span>
                </CardTitle>
                <CardDescription>Device types and operating system breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="windowsDevices">Windows Devices</Label>
                    <Input
                      id="windowsDevices"
                      type="number"
                      value={workbookData.deviceInfo.windowsDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, windowsDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="macDevices">Mac Devices</Label>
                    <Input
                      id="macDevices"
                      type="number"
                      value={workbookData.deviceInfo.macDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, macDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linuxDevices">Linux Devices</Label>
                    <Input
                      id="linuxDevices"
                      type="number"
                      value={workbookData.deviceInfo.linuxDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, linuxDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="iosDevices">iOS Devices</Label>
                    <Input
                      id="iosDevices"
                      type="number"
                      value={workbookData.deviceInfo.iosDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, iosDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="androidDevices">Android Devices</Label>
                    <Input
                      id="androidDevices"
                      type="number"
                      value={workbookData.deviceInfo.androidDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, androidDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="iotDevices">IoT Devices</Label>
                    <Input
                      id="iotDevices"
                      type="number"
                      value={workbookData.deviceInfo.iotDevices || ""}
                      onChange={(e) => setWorkbookData(prev => ({
                        ...prev,
                        deviceInfo: { ...prev.deviceInfo, iotDevices: parseInt(e.target.value) || 0 }
                      }))}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Special Devices & Requirements</Label>
                  <Textarea
                    value={workbookData.deviceInfo.specialDevices.join('\n')}
                    onChange={(e) => setWorkbookData(prev => ({
                      ...prev,
                      deviceInfo: { ...prev.deviceInfo, specialDevices: e.target.value.split('\n').filter(Boolean) }
                    }))}
                    placeholder="List any special devices, legacy systems, or unique requirements (one per line)..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Requirements</span>
                </CardTitle>
                <CardDescription>Compliance frameworks and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium">Compliance Frameworks</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {["HIPAA", "SOX", "PCI DSS", "GDPR", "FISMA", "NIST", "ISO 27001", "FERPA"].map(framework => (
                      <div key={framework} className="flex items-center space-x-2">
                        <Checkbox
                          id={framework}
                          checked={workbookData.securityRequirements.complianceFrameworks.includes(framework)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setWorkbookData(prev => ({
                                ...prev,
                                securityRequirements: {
                                  ...prev.securityRequirements,
                                  complianceFrameworks: [...prev.securityRequirements.complianceFrameworks, framework]
                                }
                              }))
                            } else {
                              setWorkbookData(prev => ({
                                ...prev,
                                securityRequirements: {
                                  ...prev.securityRequirements,
                                  complianceFrameworks: prev.securityRequirements.complianceFrameworks.filter(f => f !== framework)
                                }
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={framework} className="text-sm">{framework}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Authentication Methods</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {["802.1X", "MAC Address", "Web Portal", "SMS", "Certificate", "Active Directory", "LDAP", "RADIUS"].map(method => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={workbookData.securityRequirements.authenticationMethods.includes(method)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setWorkbookData(prev => ({
                                ...prev,
                                securityRequirements: {
                                  ...prev.securityRequirements,
                                  authenticationMethods: [...prev.securityRequirements.authenticationMethods, method]
                                }
                              }))
                            } else {
                              setWorkbookData(prev => ({
                                ...prev,
                                securityRequirements: {
                                  ...prev.securityRequirements,
                                  authenticationMethods: prev.securityRequirements.authenticationMethods.filter(m => m !== method)
                                }
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={method} className="text-sm">{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label>Special Security Requirements</Label>
                  <Textarea
                    value={workbookData.securityRequirements.specialRequirements.join('\n')}
                    onChange={(e) => setWorkbookData(prev => ({
                      ...prev,
                      securityRequirements: {
                        ...prev.securityRequirements,
                        specialRequirements: e.target.value.split('\n').filter(Boolean)
                      }
                    }))}
                    placeholder="List any special security requirements (one per line)..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Deployment Plan</span>
                </CardTitle>
                <CardDescription>Phased deployment approach and risk assessment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-4">Deployment Phases</h4>
                  <div className="space-y-4">
                    {workbookData.deploymentPlan.phases.map((phase, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-medium">{phase.name}</h5>
                              <p className="text-sm text-muted-foreground mt-1">{phase.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {phase.duration}
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  Resources: {phase.resources.join(", ")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {phase.dependencies.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  <Info className="h-3 w-3 mr-1" />
                                  {phase.dependencies.length} deps
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-4">Risk Assessment</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                          Technical Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {workbookData.deploymentPlan.riskAssessment.technicalRisks.map((risk, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                          Business Risks
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ul className="space-y-2">
                          {workbookData.deploymentPlan.riskAssessment.businessRisks.map((risk, index) => (
                            <li key={index} className="text-sm flex items-start">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center text-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mitigation Strategies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {workbookData.deploymentPlan.riskAssessment.mitigationStrategies.map((strategy, index) => (
                        <li key={index} className="text-sm flex items-start text-green-800">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {strategy}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Site Selected</h3>
            <p className="text-muted-foreground">
              Please select a site from the dropdown above to begin documenting deployment requirements.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}