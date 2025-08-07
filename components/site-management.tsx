'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Filter, FileText, Edit, Trash2, Eye, MapPin, Building, Users, Network, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'

interface Site {
  id: string
  name: string
  location: string
  type: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  devices: number
  users: number
  progress: number
  projectManager: string
  technicalOwner: string
  deploymentDate: string
  priority: 'high' | 'medium' | 'low'
}

interface SiteManagementProps {
  onSiteSelect: (siteId: string) => void
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'Corporate Headquarters',
      location: 'New York, NY',
      type: 'Corporate Office',
      status: 'completed',
      devices: 450,
      users: 200,
      progress: 100,
      projectManager: 'John Smith',
      technicalOwner: 'Sarah Johnson',
      deploymentDate: '2024-01-15',
      priority: 'high'
    },
    {
      id: '2',
      name: 'West Coast Branch',
      location: 'San Francisco, CA',
      type: 'Branch Office',
      status: 'in-progress',
      devices: 180,
      users: 85,
      progress: 65,
      projectManager: 'Mike Davis',
      technicalOwner: 'Lisa Chen',
      deploymentDate: '2024-02-28',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Manufacturing Plant A',
      location: 'Detroit, MI',
      type: 'Manufacturing',
      status: 'planning',
      devices: 320,
      users: 150,
      progress: 25,
      projectManager: 'Robert Wilson',
      technicalOwner: 'David Brown',
      deploymentDate: '2024-03-15',
      priority: 'medium'
    },
    {
      id: '4',
      name: 'Distribution Center',
      location: 'Chicago, IL',
      type: 'Warehouse',
      status: 'on-hold',
      devices: 95,
      users: 45,
      progress: 10,
      projectManager: 'Jennifer Lee',
      technicalOwner: 'Mark Taylor',
      deploymentDate: '2024-04-01',
      priority: 'low'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddSite, setShowAddSite] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'planning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'on-hold':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      'in-progress': 'secondary',
      planning: 'outline',
      'on-hold': 'destructive'
    }
    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center space-x-1">
        {getStatusIcon(status)}
        <span className="capitalize">{status.replace('-', ' ')}</span>
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    }
    return (
      <Badge className={colors[priority] || 'bg-gray-100 text-gray-800'}>
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const handleAddSite = (newSite: Omit<Site, 'id'>) => {
    const site: Site = {
      ...newSite,
      id: (sites.length + 1).toString()
    }
    setSites([...sites, site])
    setShowAddSite(false)
  }

  const handleEditSite = (updatedSite: Site) => {
    setSites(sites.map(site => site.id === updatedSite.id ? updatedSite : site))
    setEditingSite(null)
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(site => site.id !== siteId))
  }

  const handleExportSites = () => {
    const csvContent = [
      ['Name', 'Location', 'Type', 'Status', 'Devices', 'Users', 'Progress', 'Project Manager', 'Technical Owner', 'Deployment Date', 'Priority'],
      ...sites.map(site => [
        site.name,
        site.location,
        site.type,
        site.status,
        site.devices.toString(),
        site.users.toString(),
        `${site.progress}%`,
        site.projectManager,
        site.technicalOwner,
        site.deploymentDate,
        site.priority
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sites-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Master Site List</span>
              </CardTitle>
              <CardDescription>
                Manage all deployment sites and track rollout progress across your organization
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleExportSites} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={showAddSite} onOpenChange={setShowAddSite}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new deployment site
                    </DialogDescription>
                  </DialogHeader>
                  <AddSiteForm onSubmit={handleAddSite} onCancel={() => setShowAddSite(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
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
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Deployment Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{site.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.location}</TableCell>
                    <TableCell>{site.type}</TableCell>
                    <TableCell>{getStatusBadge(site.status)}</TableCell>
                    <TableCell>{getPriorityBadge(site.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Network className="h-4 w-4 text-gray-400" />
                        <span>{site.devices}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{site.users}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${site.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{site.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.deploymentDate}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSiteSelect(site.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingSite(site)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSite(site.id)}
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
            <div className="text-center py-8">
              <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sites found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first deployment site'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Site Dialog */}
      {editingSite && (
        <Dialog open={!!editingSite} onOpenChange={() => setEditingSite(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Site</DialogTitle>
              <DialogDescription>
                Update the site information and deployment details
              </DialogDescription>
            </DialogHeader>
            <EditSiteForm 
              site={editingSite} 
              onSubmit={handleEditSite} 
              onCancel={() => setEditingSite(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Add Site Form Component
function AddSiteForm({ onSubmit, onCancel }: { onSubmit: (site: Omit<Site, 'id'>) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    type: '',
    status: 'planning' as const,
    devices: 0,
    users: 0,
    progress: 0,
    projectManager: '',
    technicalOwner: '',
    deploymentDate: '',
    priority: 'medium' as const
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Site Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Site Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select site type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corporate Office">Corporate Office</SelectItem>
              <SelectItem value="Branch Office">Branch Office</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Data Center">Data Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expected Devices</label>
          <Input
            type="number"
            value={formData.devices}
            onChange={(e) => setFormData({ ...formData, devices: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Expected Users</label>
          <Input
            type="number"
            value={formData.users}
            onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Manager</label>
          <Input
            value={formData.projectManager}
            onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Technical Owner</label>
          <Input
            value={formData.technicalOwner}
            onChange={(e) => setFormData({ ...formData, technicalOwner: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Target Deployment Date</label>
        <Input
          type="date"
          value={formData.deploymentDate}
          onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Site
        </Button>
      </div>
    </form>
  )
}

// Edit Site Form Component
function EditSiteForm({ site, onSubmit, onCancel }: { site: Site, onSubmit: (site: Site) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState(site)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Site Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Site Type</label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select site type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Corporate Office">Corporate Office</SelectItem>
              <SelectItem value="Branch Office">Branch Office</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Warehouse">Warehouse</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Data Center">Data Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value: 'planning' | 'in-progress' | 'completed' | 'on-hold') => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={formData.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setFormData({ ...formData, priority: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Progress (%)</label>
          <Input
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Devices</label>
          <Input
            type="number"
            value={formData.devices}
            onChange={(e) => setFormData({ ...formData, devices: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Users</label>
          <Input
            type="number"
            value={formData.users}
            onChange={(e) => setFormData({ ...formData, users: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Manager</label>
          <Input
            value={formData.projectManager}
            onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Technical Owner</label>
          <Input
            value={formData.technicalOwner}
            onChange={(e) => setFormData({ ...formData, technicalOwner: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Deployment Date</label>
        <Input
          type="date"
          value={formData.deploymentDate}
          onChange={(e) => setFormData({ ...formData, deploymentDate: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Update Site
        </Button>
      </div>
    </form>
  )
}
