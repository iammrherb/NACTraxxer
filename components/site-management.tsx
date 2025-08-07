'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Search, Plus, Edit, Download, MapPin, Users, Network, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface Site {
  id: string
  name: string
  location: string
  type: string
  users: number
  devices: number
  status: 'Planning' | 'In Progress' | 'Testing' | 'Complete' | 'On Hold'
  priority: 'High' | 'Medium' | 'Low'
  completion: number
  startDate: string
  targetDate: string
  networkVendor: string
  contactPerson: string
  notes: string
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
      type: 'Headquarters',
      users: 850,
      devices: 1200,
      status: 'Complete',
      priority: 'High',
      completion: 100,
      startDate: '2024-01-15',
      targetDate: '2024-03-15',
      networkVendor: 'Cisco Meraki',
      contactPerson: 'John Smith',
      notes: 'Primary site with full deployment completed successfully.'
    },
    {
      id: '2',
      name: 'West Coast Office',
      location: 'San Francisco, CA',
      type: 'Regional Office',
      users: 425,
      devices: 580,
      status: 'In Progress',
      priority: 'High',
      completion: 75,
      startDate: '2024-02-01',
      targetDate: '2024-04-01',
      networkVendor: 'Cisco Meraki',
      contactPerson: 'Sarah Johnson',
      notes: 'Phase 2 deployment in progress. Certificate rollout 80% complete.'
    },
    {
      id: '3',
      name: 'Manufacturing Plant A',
      location: 'Detroit, MI',
      type: 'Manufacturing',
      users: 320,
      devices: 450,
      status: 'Testing',
      priority: 'Medium',
      completion: 90,
      startDate: '2024-01-20',
      targetDate: '2024-03-20',
      networkVendor: 'Aruba',
      contactPerson: 'Mike Chen',
      notes: 'Pilot testing with 50 users. IoT device integration pending.'
    },
    {
      id: '4',
      name: 'Research & Development',
      location: 'Austin, TX',
      type: 'R&D Facility',
      users: 180,
      devices: 280,
      status: 'Planning',
      priority: 'Medium',
      completion: 25,
      startDate: '2024-03-01',
      targetDate: '2024-05-01',
      networkVendor: 'Cisco Catalyst',
      contactPerson: 'Lisa Wang',
      notes: 'Security requirements review in progress. High-security zone configuration needed.'
    },
    {
      id: '5',
      name: 'Distribution Center',
      location: 'Chicago, IL',
      type: 'Warehouse',
      users: 95,
      devices: 150,
      status: 'On Hold',
      priority: 'Low',
      completion: 10,
      startDate: '2024-04-01',
      targetDate: '2024-06-01',
      networkVendor: 'Extreme Networks',
      contactPerson: 'Tom Rodriguez',
      notes: 'Delayed due to network infrastructure upgrade requirements.'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || site.status === statusFilter
    const matchesPriority = priorityFilter === 'All' || site.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'Testing':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'On Hold':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Testing':
        return 'bg-yellow-100 text-yellow-800'
      case 'On Hold':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleEditSite = (site: Site) => {
    setEditingSite({ ...site })
  }

  const handleSaveSite = () => {
    if (editingSite) {
      setSites(prev => prev.map(site => 
        site.id === editingSite.id ? editingSite : site
      ))
      setEditingSite(null)
    }
  }

  const handleAddSite = () => {
    const newSite: Site = {
      id: Date.now().toString(),
      name: 'New Site',
      location: '',
      type: 'Branch Office',
      users: 0,
      devices: 0,
      status: 'Planning',
      priority: 'Medium',
      completion: 0,
      startDate: new Date().toISOString().split('T')[0],
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      networkVendor: 'Cisco Meraki',
      contactPerson: '',
      notes: ''
    }
    setSites(prev => [...prev, newSite])
    setEditingSite(newSite)
    setIsAddModalOpen(false)
  }

  const exportSites = () => {
    const csvContent = [
      ['Name', 'Location', 'Type', 'Users', 'Devices', 'Status', 'Priority', 'Completion', 'Start Date', 'Target Date', 'Network Vendor', 'Contact Person'].join(','),
      ...sites.map(site => [
        site.name,
        site.location,
        site.type,
        site.users,
        site.devices,
        site.status,
        site.priority,
        `${site.completion}%`,
        site.startDate,
        site.targetDate,
        site.networkVendor,
        site.contactPerson
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sites_export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Site Management</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>Click "Add Site" to create a new site entry that you can then edit with specific details.</p>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddSite}>
                        Add Site
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={exportSites}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sites Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Users/Devices</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Target Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="font-medium">{site.name}</div>
                      <div className="text-sm text-muted-foreground">{site.networkVendor}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{site.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{site.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{site.users}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Network className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{site.devices}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(site.status)}
                        <Badge className={getStatusColor(site.status)}>
                          {site.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(site.priority)}>
                        {site.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={site.completion} className="w-20" />
                        <span className="text-xs text-muted-foreground">{site.completion}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{site.targetDate}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSite(site)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSiteSelect(site.id)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Site Modal */}
      <Dialog open={!!editingSite} onOpenChange={() => setEditingSite(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Site: {editingSite?.name}</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Site Name</Label>
                <Input
                  id="edit-name"
                  value={editingSite.name}
                  onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={editingSite.location}
                  onChange={(e) => setEditingSite({ ...editingSite, location: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-type">Site Type</Label>
                <Select value={editingSite.type} onValueChange={(value) => setEditingSite({ ...editingSite, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headquarters">Headquarters</SelectItem>
                    <SelectItem value="Regional Office">Regional Office</SelectItem>
                    <SelectItem value="Branch Office">Branch Office</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="R&D Facility">R&D Facility</SelectItem>
                    <SelectItem value="Warehouse">Warehouse</SelectItem>
                    <SelectItem value="Data Center">Data Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-users">Number of Users</Label>
                <Input
                  id="edit-users"
                  type="number"
                  value={editingSite.users}
                  onChange={(e) => setEditingSite({ ...editingSite, users: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-devices">Number of Devices</Label>
                <Input
                  id="edit-devices"
                  type="number"
                  value={editingSite.devices}
                  onChange={(e) => setEditingSite({ ...editingSite, devices: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingSite.status} onValueChange={(value: any) => setEditingSite({ ...editingSite, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Testing">Testing</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select value={editingSite.priority} onValueChange={(value: any) => setEditingSite({ ...editingSite, priority: value })}>
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
              
              <div className="space-y-2">
                <Label htmlFor="edit-completion">Completion %</Label>
                <Input
                  id="edit-completion"
                  type="number"
                  min="0"
                  max="100"
                  value={editingSite.completion}
                  onChange={(e) => setEditingSite({ ...editingSite, completion: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-start">Start Date</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={editingSite.startDate}
                  onChange={(e) => setEditingSite({ ...editingSite, startDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-target">Target Date</Label>
                <Input
                  id="edit-target"
                  type="date"
                  value={editingSite.targetDate}
                  onChange={(e) => setEditingSite({ ...editingSite, targetDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-vendor">Network Vendor</Label>
                <Select value={editingSite.networkVendor} onValueChange={(value) => setEditingSite({ ...editingSite, networkVendor: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cisco Meraki">Cisco Meraki</SelectItem>
                    <SelectItem value="Cisco Catalyst">Cisco Catalyst</SelectItem>
                    <SelectItem value="Aruba">Aruba</SelectItem>
                    <SelectItem value="Juniper">Juniper</SelectItem>
                    <SelectItem value="Extreme Networks">Extreme Networks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-contact">Contact Person</Label>
                <Input
                  id="edit-contact"
                  value={editingSite.contactPerson}
                  onChange={(e) => setEditingSite({ ...editingSite, contactPerson: e.target.value })}
                />
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingSite.notes}
                  onChange={(e) => setEditingSite({ ...editingSite, notes: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="col-span-2 flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setEditingSite(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSite}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
