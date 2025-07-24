"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
  Filter,
  Search,
  Plus,
  Download,
  Upload,
  Settings,
  Globe,
  Zap
} from "lucide-react"
import type { Site, Project, Organization } from "@/lib/types"

interface EnhancedSiteDashboardProps {
  sites: Site[]
  projects: Project[]
  organizations: Organization[]
  onSiteCreate: () => void
  onSiteUpdate: (site: Site) => void
  onBulkOperation: (operation: string, siteIds: string[]) => void
}

export function EnhancedSiteDashboard({ 
  sites, 
  projects, 
  organizations, 
  onSiteCreate, 
  onSiteUpdate, 
  onBulkOperation 
}: EnhancedSiteDashboardProps) {
  const [activeView, setActiveView] = useState<'grid' | 'table' | 'map' | 'timeline'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    region: 'all',
    project: 'all',
    deployment_type: 'all',
    risk_level: 'all'
  })
  const [selectedSites, setSelectedSites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'completion' | 'priority' | 'go_live_date'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Enhanced filtering and search
  const filteredSites = useMemo(() => {
    let filtered = sites.filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.country.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = filters.status === 'all' || site.status === filters.status
      const matchesPriority = filters.priority === 'all' || site.priority === filters.priority
      const matchesRegion = filters.region === 'all' || site.region === filters.region
      const matchesDeploymentType = filters.deployment_type === 'all' || site.deployment_type === filters.deployment_type
      const matchesRiskLevel = filters.risk_level === 'all' || site.risk_level === filters.risk_level

      return matchesSearch && matchesStatus && matchesPriority && matchesRegion && 
             matchesDeploymentType && matchesRiskLevel
    })

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'completion') {
        aValue = a.completion_percent
        bValue = b.completion_percent
      } else if (sortBy === 'go_live_date') {
        aValue = a.go_live_date ? new Date(a.go_live_date) : new Date('9999-12-31')
        bValue = b.go_live_date ? new Date(b.go_live_date) : new Date('9999-12-31')
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [sites, searchTerm, filters, sortBy, sortOrder])

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    const total = sites.length
    const completed = sites.filter(s => s.status === 'Complete').length
    const inProgress = sites.filter(s => s.status === 'In Progress').length
    const planned = sites.filter(s => s.status === 'Planned').length
    const delayed = sites.filter(s => s.status === 'Delayed').length
    const highRisk = sites.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length
    const avgCompletion = total > 0 ? Math.round(sites.reduce((acc, s) => acc + s.completion_percent, 0) / total) : 0
    const totalBudget = sites.reduce((acc, s) => acc + (s.budget_allocated || 0), 0)
    const totalSpent = sites.reduce((acc, s) => acc + (s.budget_spent || 0), 0)

    return {
      total,
      completed,
      inProgress,
      planned,
      delayed,
      highRisk,
      avgCompletion,
      totalBudget,
      totalSpent,
      budgetUtilization: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
    }
  }, [sites])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Delayed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Planned':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical':
        return 'bg-red-500'
      case 'high':
        return 'bg-orange-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'Medium':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'Low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sites</p>
                <p className="text-2xl font-bold text-blue-900">{metrics.total}</p>
                <p className="text-xs text-blue-700">{metrics.avgCompletion}% avg completion</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{metrics.completed}</p>
                <p className="text-xs text-green-700">{metrics.inProgress} in progress</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">High Risk</p>
                <p className="text-2xl font-bold text-orange-900">{metrics.highRisk}</p>
                <p className="text-xs text-orange-700">{metrics.delayed} delayed</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Budget Utilization</p>
                <p className="text-2xl font-bold text-purple-900">{metrics.budgetUtilization}%</p>
                <p className="text-xs text-purple-700">${(metrics.totalSpent / 1000000).toFixed(1)}M spent</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites by name, ID, region, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                  <SelectItem value="APAC">APAC</SelectItem>
                  <SelectItem value="LATAM">LATAM</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.risk_level} onValueChange={(value) => setFilters(prev => ({ ...prev, risk_level: value }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Risk" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button onClick={onSiteCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredSites.length} of {sites.length} sites
          </span>
          {selectedSites.length > 0 && (
            <Badge variant="secondary">
              {selectedSites.length} selected
            </Badge>
          )}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedSites.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{selectedSites.length} sites selected</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onBulkOperation('update_status', selectedSites)}>
                  Update Status
                </Button>
                <Button size="sm" variant="outline" onClick={() => onBulkOperation('assign_pm', selectedSites)}>
                  Assign PM
                </Button>
                <Button size="sm" variant="outline" onClick={() => onBulkOperation('set_priority', selectedSites)}>
                  Set Priority
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedSites([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Site Content Views */}
      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSites.map((site) => (
            <Card key={site.id} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSites.includes(site.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSites(prev => [...prev, site.id])
                        } else {
                          setSelectedSites(prev => prev.filter(id => id !== site.id))
                        }
                      }}
                      className="rounded"
                    />
                    {getPriorityIcon(site.priority)}
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${getRiskColor(site.risk_level || 'low')}`} />
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{site.name}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  {site.city ? `${site.city}, ` : ''}{site.country}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {site.users_count.toLocaleString()} users
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Phase {site.phase}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{site.completion_percent}%</span>
                  </div>
                  <Progress value={site.completion_percent} className="h-2" />
                </div>

                {site.go_live_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    Go-live: {new Date(site.go_live_date).toLocaleDateString()}
                  </div>
                )}

                {site.budget_allocated && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Budget
                    </span>
                    <span className="font-medium">
                      ${(site.budget_allocated / 1000).toFixed(0)}K
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-1">
                    {site.deployment_type && (
                      <Badge variant="outline" className="text-xs">
                        {site.deployment_type.toUpperCase()}
                      </Badge>
                    )}
                    {site.industry && (
                      <Badge variant="outline" className="text-xs">
                        {site.industry}
                      </Badge>
                    )}
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onSiteUpdate(site)}>
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="table" className="mt-0">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="text-left p-4">
                      <input
                        type="checkbox"
                        checked={selectedSites.length === filteredSites.length && filteredSites.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSites(filteredSites.map(s => s.id))
                          } else {
                            setSelectedSites([])
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold">Site</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Progress</th>
                    <th className="text-left p-4 font-semibold">Priority</th>
                    <th className="text-left p-4 font-semibold">Go-Live</th>
                    <th className="text-left p-4 font-semibold">Budget</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSites.map((site) => (
                    <tr key={site.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedSites.includes(site.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSites(prev => [...prev, site.id])
                            } else {
                              setSelectedSites(prev => prev.filter(id => id !== site.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{site.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {site.region} • {site.users_count.toLocaleString()} users
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(site.status)}>
                          {site.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={site.completion_percent} className="w-16 h-2" />
                          <span className="text-sm font-medium">{site.completion_percent}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-1">
                          {getPriorityIcon(site.priority)}
                          <span className="text-sm">{site.priority}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {site.go_live_date ? new Date(site.go_live_date).toLocaleDateString() : 'TBD'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          {site.budget_allocated ? `$${(site.budget_allocated / 1000).toFixed(0)}K` : 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <Button size="sm" variant="ghost" onClick={() => onSiteUpdate(site)}>
                          <Settings className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="map" className="mt-0">
        <Card>
          <CardContent className="p-8 text-center">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
            <p className="text-muted-foreground mb-4">
              Geographic visualization of deployment sites with real-time status indicators
            </p>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Enable Map Integration
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline" className="mt-0">
        <Card>
          <CardContent className="p-8 text-center">
            <BarChart3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Timeline View</h3>
            <p className="text-muted-foreground mb-4">
              Interactive Gantt chart showing deployment timelines and dependencies
            </p>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Open Timeline View
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      {filteredSites.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No sites found</h3>
            <p className="text-muted-foreground mb-4">
              No sites match your current search and filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('')
              setFilters({
                status: 'all',
                priority: 'all',
                region: 'all',
                project: 'all',
                deployment_type: 'all',
                risk_level: 'all'
              })
            }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}