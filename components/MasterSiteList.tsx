'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Building2, Search, Filter, Plus, Edit, Trash2, MapPin, Users, Calendar, Download, Upload } from 'lucide-react'

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
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  completionPercent: number
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: 'Native' | 'Proxy' | 'Hybrid'
  plannedStart: string
  plannedEnd: string
  notes: string
}

interface MasterSiteListProps {
  onSiteSelect?: (siteId: string) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [sites, setSites] = useState<Site[]>([
    {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 2500,
      projectManager: 'Alex Rivera',
      technicalOwners: ['John Smith', 'Mark Wilson'],
      status: 'In Progress',
      completionPercent: 65,
      wiredVendors: ['Cisco', 'Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-08-01',
      plannedEnd: '2025-08-15',
      notes: 'Executive network needs priority handling. Board room has custom AV equipment.'
    },
    {
      id: 'ABM-LON001',
      name: 'ABM London Office',
      region: 'EMEA',
      country: 'UK',
      priority: 'High',
      phase: '1',
      users: 1200,
      projectManager: 'Sarah Chen',
      technicalOwners: ['David Brown', 'Emma Taylor'],
      status: 'Complete',
      completionPercent: 100,
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Proxy',
      plannedStart: '2025-07-15',
      plannedEnd: '2025-07-30',
      notes: 'GDPR compliance requirements. Multi-tenant building with shared infrastructure.'
    },
    {
      id: 'ABM-TOK001',
      name: 'ABM Tokyo Branch',
      region: 'APAC',
      country: 'Japan',
      priority: 'Medium',
      phase: '2',
      users: 800,
      projectManager: 'Hiroshi Tanaka',
      technicalOwners: ['Yuki Sato'],
      status: 'Planned',
      completionPercent: 0,
      wiredVendors: ['Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Mobile', 'IoT'],
      radsec: 'Hybrid',
      plannedStart: '2025-09-01',
      plannedEnd: '2025-09-20',
      notes: 'Language localization required. Integration with existing NTT infrastructure.'
    },
    {
      id: 'ABM-SYD001',
      name: 'ABM Sydney Office',
      region: 'APAC',
      country: 'Australia',
      priority: 'Medium',
      phase: '2',
      users: 600,
      projectManager: 'Michael O\'Connor',
      technicalOwners: ['Lisa Wang', 'James Mitchell'],
      status: 'Delayed',
      completionPercent: 25,
      wiredVendors: ['HPE'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Apple'],
      radsec: 'Proxy',
      plannedStart: '2025-08-15',
      plannedEnd: '2025-09-05',
      notes: 'Delayed due to building renovation. Temporary network setup required.'
    },
    {
      id: 'ABM-NYC001',
      name: 'ABM New York Branch',
      region: 'North America',
      country: 'USA',
      priority: 'Low',
      phase: '3',
      users: 300,
      projectManager: 'Jennifer Lopez',
      technicalOwners: ['Robert Kim'],
      status: 'Planned',
      completionPercent: 0,
      wiredVendors: ['Extreme'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2025-10-01',
      plannedEnd: '2025-10-10',
      notes: 'Small branch office. Shared services with headquarters.'
    },
    {
      id: 'ABM-FRA001',
      name: 'ABM Frankfurt Office',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Low',
      phase: '3',
      users: 450,
      projectManager: 'Klaus Mueller',
      technicalOwners: ['Anna Schmidt', 'Thomas Weber'],
      status: 'Planned',
      completionPercent: 0,
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Proxy',
      plannedStart: '2025-10-15',
      plannedEnd: '2025-10-25',
      notes: 'German data protection laws compliance required.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const [newSite, setNewSite] = useState<Partial<Site>>({
    name: '',
    region: 'North America',
    country: '',
    priority: 'Medium',
    phase: '1',
    users: 0,
    projectManager: '',
    technicalOwners: [],
    status: 'Planned',
    completionPercent: 0,
    wiredVendors: [],
    wirelessVendors: [],
    deviceTypes: [],
    radsec: 'Native',
    plannedStart: '',
    plannedEnd: '',
    notes: ''
  })

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.projectManager.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = filterRegion === 'all' || site.region === filterRegion
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus
    const matchesPriority = filterPriority === 'all' || site.priority === filterPriority

    return matchesSearch && matchesRegion && matchesStatus && matchesPriority
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Planned': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Delayed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleEditSite = (site: Site) => {
    setEditingSite({ ...site })
    setIsEditModalOpen(true)
  }

  const handleSaveSite = () => {
    if (editingSite) {
      setSites(prev => prev.map(site => 
        site.id === editingSite.id ? editingSite : site
      ))
      setIsEditModalOpen(false)
      setEditingSite(null)
    }
  }

  const handleAddSite = () => {
    if (newSite.name && newSite.country) {
      const site: Site = {
        id: `ABM-${Date.now()}`,
        name: newSite.name,
        region: newSite.region || 'North America',
        country: newSite.country,
        priority: newSite.priority || 'Medium',
        phase: newSite.phase || '1',
        users: newSite.users || 0,
        projectManager: newSite.projectManager || '',
        technicalOwners: newSite.technicalOwners || [],
        status: newSite.status || 'Planned',
        completionPercent: newSite.completionPercent || 0,
        wiredVendors: newSite.wiredVendors || [],
        wirelessVendors: newSite.wirelessVendors || [],
        deviceTypes: newSite.deviceTypes || [],
        radsec: newSite.radsec || 'Native',
        plannedStart: newSite.plannedStart || '',
        plannedEnd: newSite.plannedEnd || '',
        notes: newSite.notes || ''
      }
      
      setSites(prev => [...prev, site])
      setIsAddModalOpen(false)
      setNewSite({
        name: '',
        region: 'North America',
        country: '',
        priority: 'Medium',
        phase: '1',
        users: 0,
        projectManager: '',
        technicalOwners: [],
        status: 'Planned',
        completionPercent: 0,
        wiredVendors: [],
        wirelessVendors: [],
        deviceTypes: [],
        radsec: 'Native',
        plannedStart: '',
        plannedEnd: '',
        notes: ''
      })
    }
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(prev => prev.filter(site => site.id !== siteId))
  }

  const exportSites = () => {
    const dataStr = JSON.stringify(sites, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `abm-sites-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span>Master Site List</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive list of all ABM deployment sites with project details and status tracking.
          </p>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sites, countries, or project managers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                  <SelectItem value="APAC">APAC</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
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

              <Select value={filterPriority} onValueChange={setFilterPriority}>
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
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Site</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      value={newSite.name}
                      onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                      placeholder="Enter site name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={newSite.country}
                      onChange={(e) => setNewSite({ ...newSite, country: e.target.value })}
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select value={newSite.region} onValueChange={(value) => setNewSite({ ...newSite, region: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="EMEA">EMEA</SelectItem>
                        <SelectItem value="APAC">APAC</SelectItem>
                      </SelectContent>
                    </Select>
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
                      value={newSite.users}
                      onChange={(e) => setNewSite({ ...newSite, users: parseInt(e.target.value) || 0 })}
                      placeholder="Enter user count"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectManager">Project Manager</Label>
                    <Input
                      id="projectManager"
                      value={newSite.projectManager}
                      onChange={(e) => setNewSite({ ...newSite, projectManager: e.target.value })}
                      placeholder="Enter project manager name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newSite.notes}
                      onChange={(e) => setNewSite({ ...newSite, notes: e.target.value })}
                      placeholder="Enter any additional notes"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSite}>
                    Add Site
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={exportSites}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>

          {/* Sites Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Site
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Manager
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSites.map((site) => (
                    <tr 
                      key={site.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => onSiteSelect?.(site.id)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {site.name}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {site.id}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          <div>
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {site.country}
                            </div>
                            <div className="text-sm text-gray-500">
                              {site.region}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className={getPriorityColor(site.priority)}>
                          {site.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(site.status)}>
                          {site.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${site.completionPercent}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {site.completionPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900 dark:text-gray-100">
                            {site.users.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {site.projectManager}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditSite(site)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteSite(site.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {filteredSites.length}
              </div>
              <div className="text-sm text-blue-600">Total Sites</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {filteredSites.filter(s => s.status === 'Complete').length}
              </div>
              <div className="text-sm text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredSites.filter(s => s.status === 'In Progress').length}
              </div>
              <div className="text-sm text-yellow-600">In Progress</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {filteredSites.reduce((sum, site) => sum + site.users, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Site Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Site: {editingSite?.name}</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Site Name</Label>
                <Input
                  id="edit-name"
                  value={editingSite.name}
                  onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                />
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
                <Label htmlFor="edit-region">Region</Label>
                <Select 
                  value={editingSite.region} 
                  onValueChange={(value) => setEditingSite({ ...editingSite, region: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="EMEA">EMEA</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={editingSite.priority} 
                  onValueChange={(value) => setEditingSite({ ...editingSite, priority: value as Site['priority'] })}
                >
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
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={editingSite.status} 
                  onValueChange={(value) => setEditingSite({ ...editingSite, status: value as Site['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
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
              <div>
                <Label htmlFor="edit-pm">Project Manager</Label>
                <Input
                  id="edit-pm"
                  value={editingSite.projectManager}
                  onChange={(e) => setEditingSite({ ...editingSite, projectManager: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-start">Planned Start</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={editingSite.plannedStart}
                  onChange={(e) => setEditingSite({ ...editingSite, plannedStart: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-end">Planned End</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={editingSite.plannedEnd}
                  onChange={(e) => setEditingSite({ ...editingSite, plannedEnd: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSite.notes}
                  onChange={(e) => setEditingSite({ ...editingSite, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSite}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
