"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Book,
  MapPin,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Save,
  Plus,
  Settings,
  Shield,
  List,
  Globe,
  Building,
} from "lucide-react"
import PolicyEditor from "./policy-editor"
import PolicyManagement from "./policy-management"
import { storage, type Site } from "@/lib/storage"

interface ChecklistItem {
  id: string
  item: string
  status: "complete" | "in-progress" | "pending"
  assignee?: string
  dueDate?: string
  notes?: string
}

interface Policy {
  id: string
  name: string
  condition: string
  action: string
  vlan: string
  priority: number
  type: "global" | "site-specific"
  siteId?: string
  description?: string
}

interface SiteWorkbookProps {
  siteId: string
  onSiteChange?: (siteId: string) => void
  onClose?: () => void
}

export default function SiteWorkbook({ siteId, onSiteChange, onClose }: SiteWorkbookProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedSiteId, setSelectedSiteId] = useState<string>(siteId || "")
  const [isEditing, setIsEditing] = useState(false)
  const [editedSite, setEditedSite] = useState<Site | null>(null)
  const [showPolicyEditor, setShowPolicyEditor] = useState(false)
  const [customChecklist, setCustomChecklist] = useState<ChecklistItem[]>([])
  const [globalPolicies, setGlobalPolicies] = useState<Policy[]>([])
  const [sitePolicies, setSitePolicies] = useState<Policy[]>([])
  const [showPolicyManager, setShowPolicyManager] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadSites()
  }, [])

  useEffect(() => {
    if (siteId) {
      setSelectedSiteId(siteId)
    }
  }, [siteId])

  useEffect(() => {
    if (selectedSiteId && isClient) {
      loadSiteData()
    }
  }, [selectedSiteId, isClient])

  const loadSites = async () => {
    if (typeof window === "undefined") return

    try {
      const sitesData = await storage.getSites()
      setSites(sitesData || [])

      if (!siteId && sitesData && sitesData.length > 0) {
        setSelectedSiteId(sitesData[0].id)
        onSiteChange?.(sitesData[0].id)
      }
    } catch (error) {
      console.error("Error loading sites:", error)
    }
  }

  const loadSiteData = async () => {
    if (typeof window === "undefined" || !selectedSiteId) return

    try {
      // Load custom checklist for this site
      const savedChecklist = localStorage.getItem(`portnox-checklist-${selectedSiteId}`)
      if (savedChecklist) {
        setCustomChecklist(JSON.parse(savedChecklist))
      } else {
        // Initialize with default checklist
        const defaultChecklist = generateDefaultChecklist()
        setCustomChecklist(defaultChecklist)
      }

      // Load global policies
      const globalPoliciesData = await storage.getGlobalPolicies()
      setGlobalPolicies(
        globalPoliciesData.map((p) => ({
          id: p.id,
          name: p.name,
          condition: p.conditions.map((c: any) => `${c.type} ${c.operator} ${c.value}`).join(", "),
          action: p.actions.map((a: any) => a.type).join(", "),
          vlan: p.actions.find((a: any) => a.type === "vlan_assign")?.parameters?.vlan || "N/A",
          priority: p.priority,
          type: "global" as const,
          description: p.description,
        })),
      )

      // Load site-specific policies
      const savedSitePolicies = localStorage.getItem(`portnox-site-policies-${selectedSiteId}`)
      if (savedSitePolicies) {
        setSitePolicies(JSON.parse(savedSitePolicies))
      }
    } catch (error) {
      console.error("Error loading site data:", error)
    }
  }

  const siteData = sites.find((site) => site.id === selectedSiteId)

  const handleSiteSelect = (newSiteId: string) => {
    setSelectedSiteId(newSiteId)
    onSiteChange?.(newSiteId)
    setIsEditing(false)
  }

  const startEditing = () => {
    if (siteData) {
      setEditedSite({ ...siteData })
      setIsEditing(true)
    }
  }

  const saveChanges = async () => {
    if (editedSite && selectedSiteId) {
      try {
        await storage.updateSite(selectedSiteId, editedSite)
        setSites(sites.map((site) => (site.id === selectedSiteId ? editedSite : site)))
        setIsEditing(false)
        setEditedSite(null)
      } catch (error) {
        console.error("Error saving site:", error)
      }
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedSite(null)
  }

  const updateChecklistItem = (itemId: string, updates: Partial<ChecklistItem>) => {
    if (typeof window === "undefined") return

    const updatedChecklist = customChecklist.map((item) => (item.id === itemId ? { ...item, ...updates } : item))
    setCustomChecklist(updatedChecklist)
    localStorage.setItem(`portnox-checklist-${selectedSiteId}`, JSON.stringify(updatedChecklist))
  }

  const addChecklistItem = () => {
    if (typeof window === "undefined") return

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      item: "New Task",
      status: "pending",
    }
    const updatedChecklist = [...customChecklist, newItem]
    setCustomChecklist(updatedChecklist)
    localStorage.setItem(`portnox-checklist-${selectedSiteId}`, JSON.stringify(updatedChecklist))
  }

  const generateDefaultChecklist = (): ChecklistItem[] => [
    { id: "1", item: "Intune Configuration", status: "pending" },
    { id: "2", item: "Certificate Templates", status: "pending" },
    { id: "3", item: "RADIUS Configuration", status: "pending" },
    { id: "4", item: "Switch Configuration", status: "pending" },
    { id: "5", item: "Wireless Configuration", status: "pending" },
    { id: "6", item: "Policy Configuration", status: "pending" },
    { id: "7", item: "User Testing", status: "pending" },
    { id: "8", item: "Go-Live", status: "pending" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "implementation":
      case "testing":
        return "text-blue-600"
      case "planning":
        return "text-gray-600"
      case "on-hold":
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

  const handlePolicyCreate = (policy: Policy) => {
    if (typeof window === "undefined") return

    if (policy.type === "global") {
      setGlobalPolicies([...globalPolicies, policy])
      localStorage.setItem("portnox-global-policies", JSON.stringify([...globalPolicies, policy]))
    } else if (policy.type === "site-specific") {
      setSitePolicies([...sitePolicies, policy])
      localStorage.setItem(`portnox-site-policies-${selectedSiteId}`, JSON.stringify([...sitePolicies, policy]))
    }
    setShowPolicyManager(false)
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (sites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-5 w-5" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No Sites Available</p>
            <p>Add sites in the Site Management tab to view their workbooks.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!selectedSiteId || !siteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Site Workbook</span>
            </div>
            <Select value={selectedSiteId} onValueChange={handleSiteSelect}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a site..." />
              </SelectTrigger>
              <SelectContent>
                {sites.map((site) => (
                  <SelectItem key={site.id} value={site.id}>
                    {site.name} ({site.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Book className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">Select a Site</p>
            <p>Choose a site from the dropdown above to view its workbook.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentSite = isEditing ? editedSite! : siteData

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Book className="h-5 w-5" />
              <span>Site Workbook: {currentSite.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedSiteId} onValueChange={handleSiteSelect}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a site..." />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name} ({site.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!isEditing ? (
                <Button onClick={startEditing} variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={saveChanges} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={cancelEditing} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="checklist">Deployment</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
                      <span className="font-mono">{currentSite.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                      {isEditing ? (
                        <Input
                          value={currentSite.region}
                          onChange={(e) => setEditedSite({ ...currentSite, region: e.target.value })}
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{currentSite.region}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Country:</span>
                      {isEditing ? (
                        <Input
                          value={currentSite.country}
                          onChange={(e) => setEditedSite({ ...currentSite, country: e.target.value })}
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{currentSite.country}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                      {isEditing ? (
                        <Select
                          value={currentSite.priority}
                           onValueChange={(value: string) =>
                            setEditedSite({ ...currentSite, priority: value as Site["priority"] })
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="secondary">{getPriorityColor(currentSite.priority || "Medium")}</Badge>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Phase:</span>
                      {isEditing ? (
                        <Input
                          value={currentSite.phase}
                          onChange={(e) => setEditedSite({ ...currentSite, phase: e.target.value })}
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{currentSite.phase}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Users:</span>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={currentSite.users}
                          onChange={(e) =>
                            setEditedSite({ ...currentSite, users: Number.parseInt(e.target.value) || 0 })
                          }
                          className="w-32 h-8"
                        />
                      ) : (
                        <span>{(currentSite.users || 0).toLocaleString()}</span>
                      )}
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
                      <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                      {isEditing ? (
                        <Select
                          value={currentSite.status}
                          onValueChange={(value: string) =>
                            setEditedSite({ ...currentSite, status: value as Site["status"] })
                          }
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="implementation">Implementation</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="on-hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={`font-medium ${getStatusColor(currentSite.status || "Planned")}`}>
                          {currentSite.status || "Planned"}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${currentSite.progress}%` }}
                          />
                        </div>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={currentSite.progress}
                            onChange={(e) =>
                              setEditedSite({ ...currentSite, progress: Number.parseInt(e.target.value) || 0 })
                            }
                            className="w-16 h-8"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <span className="text-sm font-medium">{currentSite.progress}%</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="checklist" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <List className="h-5 w-5 text-blue-600" />
                  <span>Deployment Checklist</span>
                </h3>
                <Button onClick={addChecklistItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-3">
                {customChecklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {getChecklistIcon(item.status)}
                    <div className="flex-1">
                      <Input
                        value={item.item}
                        onChange={(e) => updateChecklistItem(item.id, { item: e.target.value })}
                        className={`border-none bg-transparent p-0 h-auto ${item.status === "complete" ? "line-through text-gray-500" : ""}`}
                      />
                      {item.assignee && (
                        <div className="text-xs text-muted-foreground mt-1">Assigned to: {item.assignee}</div>
                      )}
                    </div>
                    <Select
                      value={item.status}
                      onValueChange={(value: "complete" | "in-progress" | "pending") =>
                        updateChecklistItem(item.id, { status: value })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="policies" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>NAC Policies</span>
                </h3>
                <Button onClick={() => setShowPolicyManager(true)} size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Policies
                </Button>
                <Button onClick={() => setShowPolicyEditor(true)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Policy
                </Button>
              </div>

              <div className="space-y-4">
                {/* Global Policies */}
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span>Global Policies ({globalPolicies.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {globalPolicies.map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Priority {policy.priority}</Badge>
                            <span className="font-medium">{policy.name}</span>
                            <Badge variant="secondary">
                              <Globe className="h-3 w-3 mr-1" />
                              Global
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {policy.action} → VLAN {policy.vlan}
                          </div>
                        </div>
                      </div>
                    ))}
                    {globalPolicies.length === 0 && (
                      <p className="text-muted-foreground text-sm">No global policies defined.</p>
                    )}
                  </div>
                </div>

                {/* Site-Specific Policies */}
                <div>
                  <h4 className="font-medium flex items-center space-x-2 mb-3">
                    <Building className="h-4 w-4 text-green-600" />
                    <span>Site-Specific Policies ({sitePolicies.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {sitePolicies.map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">Priority {policy.priority}</Badge>
                            <span className="font-medium">{policy.name}</span>
                            <Badge variant="default">
                              <Building className="h-3 w-3 mr-1" />
                              Site
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {policy.action} → VLAN {policy.vlan}
                          </div>
                        </div>
                      </div>
                    ))}
                    {sitePolicies.length === 0 && (
                      <p className="text-muted-foreground text-sm">No site-specific policies defined.</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Notes</h3>
                {isEditing ? (
                  <Textarea
                    value={currentSite.notes}
                    onChange={(e) => setEditedSite({ ...currentSite, notes: e.target.value })}
                    placeholder="Add project notes, requirements, or important information..."
                    rows={8}
                  />
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 min-h-[200px]">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {currentSite.notes || "No notes available for this site."}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Policy Editor Modal */}
      {showPolicyEditor && (
        <PolicyEditor onClose={() => setShowPolicyEditor(false)} siteId={selectedSiteId} siteName={siteData.name} />
      )}

      {/* Policy Manager Modal */}
      {showPolicyManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Policy Management</h2>
                <Button variant="ghost" onClick={() => setShowPolicyManager(false)}>
                  ×
                </Button>
              </div>
              <PolicyManagement />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
