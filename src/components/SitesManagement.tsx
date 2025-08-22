"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Filter, Download, Upload, MapPin, Users, HardDrive, Calendar, DollarSign, AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { storage, type Site } from "../lib/storage"
import { INDUSTRY_SCENARIOS } from "../lib/industryScenarios"

export default function SitesManagement() {
  const [sites, setSites] = useState<Site[]>(storage.getSites())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  
  const [newSite, setNewSite] = useState({
    name: "",
    location: "",
    industry: "",
    type: "",
    status: "planning",
    priority: "medium",
    users: 0,
    devices: 0,
    budget: 0,
    timeline: "",
    notes: ""
  })

  const filteredSites = useMemo(() => {
    return sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = selectedIndustry === "all" || site.industry === selectedIndustry
      const matchesStatus = selectedStatus === "all" || site.status === selectedStatus  
      const matchesPriority = selectedPriority === "all" || site.priority === selectedPriority
      
      return matchesSearch && matchesIndustry && matchesStatus && matchesPriority
    })
  }, [sites, searchTerm, selectedIndustry, selectedStatus, selectedPriority])

  const handleAddSite = () => {
    const site: Site = {
      id: `site-${Date.now()}`,
      ...newSite,
      completionPercent: 0
    }
    
    const updatedSites = [...sites, site]
    setSites(updatedSites)
    storage.saveSites(updatedSites)
    
    setIsAddingNew(false)
    setNewSite({
      name: "",
      location: "",
      industry: "",
      type: "",
      status: "planning",
      priority: "medium", 
      users: 0,
      devices: 0,
      budget: 0,
      timeline: "",
      notes: ""
    })
  }

  const loadIndustryScenario = (industryId: string) => {
    const scenario = INDUSTRY_SCENARIOS[industryId]
    if (scenario && scenario.sampleSites) {
      const newSites = scenario.sampleSites.map((sampleSite, index) => ({
        id: `${industryId}-site-${index}`,
        name: sampleSite.name,
        location: sampleSite.location,
        industry: industryId,
        type: sampleSite.type,
        status: "planning" as const,
        priority: sampleSite.priority.toLowerCase() as "low" | "medium" | "high" | "critical",
        users: sampleSite.users,
        devices: sampleSite.devices,
        budget: sampleSite.budget,
        timeline: sampleSite.timeline,
        specialRequirements: sampleSite.specialRequirements,
        completionPercent: 0
      }))
      
      const updatedSites = [...sites, ...newSites]
      setSites(updatedSites)
      storage.saveSites(updatedSites)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "planning": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "on-hold": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Master Site List</h2>
            <p className="text-muted-foreground">Manage and track all NAC deployment sites</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Site</DialogTitle>
                  <DialogDescription>Create a new site for NAC deployment</DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="template">Industry Template</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="siteName">Site Name *</Label>
                        <Input
                          id="siteName"
                          value={newSite.name}
                          onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                          placeholder="Enter site name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={newSite.location}
                          onChange={(e) => setNewSite({...newSite, location: e.target.value})}
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select value={newSite.industry} onValueChange={(value) => setNewSite({...newSite, industry: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(INDUSTRY_SCENARIOS).map(scenario => (
                              <SelectItem key={scenario.id} value={scenario.id}>
                                {scenario.icon} {scenario.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newSite.priority} onValueChange={(value) => setNewSite({...newSite, priority: value})}>
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
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="users">Users</Label>
                        <Input
                          id="users"
                          type="number"
                          value={newSite.users || ""}
                          onChange={(e) => setNewSite({...newSite, users: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="devices">Devices</Label>
                        <Input
                          id="devices"
                          type="number"
                          value={newSite.devices || ""}
                          onChange={(e) => setNewSite({...newSite, devices: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget ($)</Label>
                        <Input
                          id="budget"
                          type="number"
                          value={newSite.budget || ""}
                          onChange={(e) => setNewSite({...newSite, budget: parseInt(e.target.value) || 0})}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newSite.notes}
                        onChange={(e) => setNewSite({...newSite, notes: e.target.value})}
                        placeholder="Additional notes or requirements"
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                      <Button onClick={handleAddSite} disabled={!newSite.name || !newSite.location}>
                        Create Site
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="template" className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">Select an industry template to quickly add pre-configured sites</p>
                    <div className="grid gap-3">
                      {Object.values(INDUSTRY_SCENARIOS).map(scenario => (
                        <Card key={scenario.id} className="cursor-pointer hover:bg-muted/50" onClick={() => {
                          loadIndustryScenario(scenario.id)
                          setIsAddingNew(false)
                        }}>
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="text-2xl">{scenario.icon}</div>
                              <div className="flex-1">
                                <h4 className="font-semibold">{scenario.name}</h4>
                                <p className="text-sm text-muted-foreground">{scenario.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                                  <span>{scenario.sampleSites?.length || 0} sites</span>
                                  <span>{scenario.compliance.join(", ")}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Industries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {Object.values(INDUSTRY_SCENARIOS).map(scenario => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.icon} {scenario.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
          >
            <Filter className="h-4 w-4 mr-2" />
            {viewMode === "grid" ? "Table" : "Grid"} View
          </Button>
        </div>
      </div>

      {/* Sites Grid */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {site.location}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Badge className={getStatusColor(site.status)} variant="outline">
                      {site.status.replace("-", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(site.priority || "medium")} variant="outline">
                      {site.priority || "medium"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {site.completionPercent !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{site.completionPercent}%</span>
                      </div>
                      <Progress value={site.completionPercent} className="h-2" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {site.users?.toLocaleString() || 0} users
                    </div>
                    <div className="flex items-center">
                      <HardDrive className="h-4 w-4 mr-2 text-muted-foreground" />
                      {site.devices?.toLocaleString() || 0} devices
                    </div>
                  </div>
                  
                  {(site.budget || site.timeline) && (
                    <>
                      <Separator />
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {site.budget && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            ${site.budget.toLocaleString()}
                          </div>
                        )}
                        {site.timeline && (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {site.timeline}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {site.specialRequirements && site.specialRequirements.length > 0 && (
                    <>
                      <Separator />
                      <div>
                        <div className="flex items-center text-sm font-medium mb-2">
                          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                          Special Requirements
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {site.specialRequirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                          {site.specialRequirements.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{site.specialRequirements.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Table view would go here - simplified for space
        <Card>
          <CardContent className="p-0">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Table view coming soon...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sites found matching your criteria.</p>
          <Button className="mt-4" onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Site
          </Button>
        </div>
      )}
    </div>
  )
}