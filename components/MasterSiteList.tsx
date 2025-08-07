'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Plus, Edit, Trash2, Download, Building2, MapPin, Users, Calendar } from 'lucide-react'

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: 'High' | 'Medium' | 'Low'
  phase: string
  users: number
  projectManager: string
  technicalOwners: string[]
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: string
  plannedStart: string
  plannedEnd: string
  status: 'Not Started' | 'In Progress' | 'Complete' | 'Delayed'
  completionPercent: number
  deploymentChecklist: string[]
  notes: string
}

interface MasterSiteListProps {
  onSiteSelect: (siteId: string) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [sites, setSites] = useState<Site[]>([
    {
      id: 'NYC001',
      name: 'Manhattan Corporate HQ',
      region: 'North America',
      country: 'United States',
      priority: 'High',
      phase: '1',
      users: 2500,
      projectManager: 'Sarah Johnson',
      technicalOwners: ['Mike Chen', 'Lisa Rodriguez'],
      wiredVendors: ['Cisco', 'Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-02-01',
      plannedEnd: '2025-02-28',
      status: 'In Progress',
      completionPercent: 65,
      deploymentChecklist: ['LRAD', 'RADIUS', 'Switches', 'Wireless'],
      notes: 'Primary headquarters deployment with full feature set required.'
    },
    {
      id: 'LAX002',
      name: 'Los Angeles Office',
      region: 'North America',
      country: 'United States',
      priority: 'Medium',
      phase: '2',
      users: 850,
      projectManager: 'David Kim',
      technicalOwners: ['Jennifer Wu', 'Carlos Martinez'],
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'LRAD',
      plannedStart: '2025-03-15',
      plannedEnd: '2025-04-15',
      status: 'Not Started',
      completionPercent: 0,
      deploymentChecklist: [],
      notes: 'Standard office deployment with mixed vendor environment.'
    },
    {
      id: 'LON003',
      name: 'London Regional Office',
      region: 'EMEA',
      country: 'United Kingdom',
      priority: 'High',
      phase: '1',
      users: 1200,
      projectManager: 'Emma Thompson',
      technicalOwners: ['James Wilson', 'Sophie Clarke'],
      wiredVendors: ['Cisco', 'HPE'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2025-02-15',
      plannedEnd: '2025-03-15',
      status: 'Complete',
      completionPercent: 100,
      deploymentChecklist: ['LRAD', 'RADIUS', 'Switches', 'Wireless', 'MAB', 'Testing'],
      notes: 'Successfully completed ahead of schedule. All systems operational.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: '',
    region: '',
    country: '',
    priority: 'Medium',
    phase: '1',
    users: 0,
    projectManager: '',
    technicalOwners: [],
    wiredVendors: [],
    wirelessVendors: [],
    deviceTypes: [],
    radsec: 'LRAD',
    plannedStart: '',
    plannedEnd: '',
    status: 'Not Started',
    completionPercent: 0,
    deploymentChecklist: [],
    notes: ''
  })

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = filterRegion === 'all' || site.region === filterRegion
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus
    const matchesPriority = filterPriority === 'all' || site.priority === filterPriority
    
    return matchesSearch && matchesRegion && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Delayed': return 'bg-red-100 text-red-800'
      case 'Not Started': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleAddSite = () => {
    if (newSite.name && newSite.region) {
      const site: Site = {
        id: `${newSite.name?.substring(0, 3).toUpperCase()}${String(sites.length + 1).padStart(3, '0')}`,
        name: newSite.name,
        region: newSite.region,
        country: newSite.country || '',
        priority: newSite.priority as Site['priority'],
        phase: newSite.phase || '1',
        users: newSite.users || 0,
        projectManager: newSite.projectManager || '',
        technicalOwners: newSite.technicalOwners || [],
        wiredVendors: newSite.wiredVendors || [],
        wirelessVendors: newSite.wirelessVendors || [],
        deviceTypes: newSite.deviceTypes || [],
        radsec: newSite.radsec || 'LRAD',
        plannedStart: newSite.plannedStart || '',
        plannedEnd: newSite.plannedEnd || '',
        status: newSite.status as Site['status'],
        completionPercent: newSite.completionPercent || 0,
        deploymentChecklist: newSite.deploymentChecklist || [],
        notes: newSite.notes || ''
      }
      setSites([...sites, site])
      setNewSite({
        name: '',
        region: '',
        country: '',
        priority: 'Medium',
        phase: '1',
        users: 0,
        projectManager: '',
        technicalOwners: [],
        wiredVendors: [],
        wirelessVendors: [],
        deviceTypes: [],
        radsec: 'LRAD',
        plannedStart: '',
        plannedEnd: '',
        status: 'Not Started',
        completionPercent: 0,
        deploymentChecklist: [],
        notes: ''
      })
      setShowAddModal(false)
    }
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
  }

  const handleUpdateSite = () => {
    if (editingSite) {
      setSites(sites.map(s => s.id === editingSite.id ? editingSite : s))
      setEditingSite(null)
    }
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(s => s.id !== siteId))
  }

  const exportSites = () => {
    const dataStr = JSON.stringify(sites, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'abm-sites.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const totalSites = sites.length
  const completedSites = sites.filter(s => s.status === 'Complete').length
  const inProgressSites = sites.filter(s => s.status === 'In Progress').length
  const totalUsers = sites.reduce((sum, site) => sum + site.users, 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Sites</p>
                <p className="text-2xl font-bold">{totalSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{inProgressSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedSites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Master Site List</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={exportSites} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Site Name</Label>
                      <Input
                        id="name"
                        value={newSite.name || ''}
                        onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="region">Region</Label>
                      <Select value={newSite.region} onValueChange={(value) => setNewSite({ ...newSite, region: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="North America">North America</SelectItem>
                          <SelectItem value="EMEA">EMEA</SelectItem>
                          <SelectItem value="APAC">APAC</SelectItem>
                          <SelectItem value="Latin America">Latin America</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={newSite.country || ''}
                        onChange={(e) => setNewSite({ ...newSite, country: e.target.value })}
                        placeholder="Enter country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newSite.priority} onValueChange={(value) => setNewSite({ ...newSite, priority: value as Site['priority'] })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="users">Number of Users</Label>
                      <Input
                        id="users"
                        type="number"
                        value={newSite.users || ''}
                        onChange={(e) => setNewSite({ ...newSite, users: parseInt(e.target.value) || 0 })}
                        placeholder="Enter user count"
                      />
                    </div>
                    <div>
                      <Label htmlFor="projectManager">Project Manager</Label>
                      <Input
                        id="projectManager"
                        value={newSite.projectManager || ''}
                        onChange={(e) => setNewSite({ ...newSite, projectManager: e.target.value })}
                        placeholder="Enter project manager name"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={newSite.notes || ''}
                        onChange={(e) => setNewSite({ ...newSite, notes: e.target.value })}
                        placeholder="Enter any additional notes"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button onClick={handleAddSite}>Add Site</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="EMEA">EMEA</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
                <SelectItem value="Latin America">Latin America</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Sites List */}
      <div className="space-y-4">
        {filteredSites.map((site) => (
          <Card key={site.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-semibold">{site.name}</h3>
                    <Badge variant="outline">{site.id}</Badge>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                    <Badge className={getPriorityColor(site.priority)}>
                      {site.priority} Priority
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Region:</span> {site.region}
                    </div>
                    <div>
                      <span className="font-medium">Users:</span> {site.users.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">PM:</span> {site.projectManager}
                    </div>
                    <div>
                      <span className="font-medium">Phase:</span> {site.phase}
                    </div>
                  </div>
                  {site.status === 'In Progress' && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${site.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{site.completionPercent}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSiteSelect(site.id)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSite(site)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSite(site.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Site Modal */}
      {editingSite && (
        <Dialog open={!!editingSite} onOpenChange={() => setEditingSite(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Site: {editingSite.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Site Name</Label>
                <Input
                  id="edit-name"
                  value={editingSite.name}
                  onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-region">Region</Label>
                <Select value={editingSite.region} onValueChange={(value) => setEditingSite({ ...editingSite, region: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="EMEA">EMEA</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                    <SelectItem value="Latin America">Latin America</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-country">Country</Label>
                <Input
                  id="edit-country"
                  value={editingSite.country}
                  onChange={(e) => setEditingSite({ ...editingSite, country: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={editingSite.priority} onValueChange={(value) => setEditingSite({ ...editingSite, priority: value as Site['priority'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-users">Number of Users</Label>
                <Input
                  id="edit-users"
                  type="number"
                  value={editingSite.users}
                  onChange={(e) => setEditingSite({ ...editingSite, users: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingSite.status} onValueChange={(value) => setEditingSite({ ...editingSite, status: value as Site['status'] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-projectManager">Project Manager</Label>
                <Input
                  id="edit-projectManager"
                  value={editingSite.projectManager}
                  onChange={(e) => setEditingSite({ ...editingSite, projectManager: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-completion">Completion %</Label>
                <Input
                  id="edit-completion"
                  type="number"
                  min="0"
                  max="100"
                  value={editingSite.completionPercent}
                  onChange={(e) => setEditingSite({ ...editingSite, completionPercent: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSite.notes}
                  onChange={(e) => setEditingSite({ ...editingSite, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setEditingSite(null)}>Cancel</Button>
              <Button onClick={handleUpdateSite}>Update Site</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
