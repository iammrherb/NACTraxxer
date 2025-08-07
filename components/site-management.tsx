'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Edit, Trash2, Download, FileText, FileSpreadsheet, Eye, Save, X } from 'lucide-react'

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
  notes: string
  wiredVendors: string[]
  wirelessVendors: string[]
  deviceTypes: string[]
  radsec: 'Native' | 'LRAD' | 'None'
  plannedStart: string
  plannedEnd: string
  deploymentChecklist: string[]
}

interface SiteManagementProps {
  onSiteSelect?: (siteId: string) => void
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [filteredSites, setFilteredSites] = useState<Site[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [newSite, setNewSite] = useState<Partial<Site>>({})

  // Sample data with comprehensive site information
  const initialSites: Site[] = [
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
      completionPercent: 35,
      notes: 'Executive network needs priority handling. Board room has custom AV equipment.',
      wiredVendors: ['Cisco', 'Juniper'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-08-01',
      plannedEnd: '2025-08-15',
      deploymentChecklist: ['Intune', 'Native', 'RADIUS', 'Switches', 'Wireless', 'MAB', 'Guest', 'Testing']
    },
    {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: '1',
      users: 150,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Emily Jones', 'Paul Davis'],
      status: 'In Progress',
      completionPercent: 65,
      notes: '24/7 operation requires careful change windows.',
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Linux', 'IoT'],
      radsec: 'LRAD',
      plannedStart: '2025-08-05',
      plannedEnd: '2025-08-12',
      deploymentChecklist: ['LRAD', 'RADIUS', 'Switches', 'MAB', 'Testing']
    },
    {
      id: 'ABM-EUR003',
      name: 'European Headquarters',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Medium',
      phase: '2',
      users: 1200,
      projectManager: 'Sofia Linden',
      technicalOwners: ['Sarah Thompson'],
      status: 'Planned',
      completionPercent: 0,
      notes: 'GDPR compliance required.',
      wiredVendors: ['HPE'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2025-09-01',
      plannedEnd: '2025-09-15',
      deploymentChecklist: ['GDPR Review', 'Intune', 'Native', 'RADIUS', 'Switches', 'Wireless']
    },
    {
      id: 'ABM-APAC004',
      name: 'APAC Regional Office',
      region: 'APAC',
      country: 'Singapore',
      priority: 'Medium',
      phase: '2',
      users: 800,
      projectManager: 'Michael Zhang',
      technicalOwners: ['Carlos Mendez'],
      status: 'Planned',
      completionPercent: 0,
      notes: 'Multi-tenant building with shared infrastructure.',
      wiredVendors: ['Juniper'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'LRAD',
      plannedStart: '2025-09-10',
      plannedEnd: '2025-09-25',
      deploymentChecklist: ['LRAD', 'RADIUS', 'Switches', 'Wireless', 'Testing']
    },
    {
      id: 'ABM-MFG006',
      name: 'Manufacturing Plant',
      region: 'LATAM',
      country: 'Mexico',
      priority: 'High',
      phase: '1',
      users: 450,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Carlos Mendez', 'John Smith'],
      status: 'Complete',
      completionPercent: 100,
      notes: 'Manufacturing floor required special considerations for IoT devices.',
      wiredVendors: ['Extreme'],
      wirelessVendors: ['Extreme'],
      deviceTypes: ['Windows', 'IoT'],
      radsec: 'Native',
      plannedStart: '2025-08-15',
      plannedEnd: '2025-08-30',
      deploymentChecklist: ['Intune', 'Native', 'RADIUS', 'Switches', 'Wireless', 'MAB', 'Guest', 'Testing', 'Documentation']
    }
  ]

  // Available options for dropdowns
  const projectManagers = ['Alex Rivera', 'Marcus Chen', 'Sofia Linden', 'Michael Zhang']
  const technicalOwners = ['John Smith', 'Mark Wilson', 'Emily Jones', 'Paul Davis', 'Sarah Thompson', 'Carlos Mendez']
  const wiredVendorOptions = ['Cisco', 'Juniper', 'Aruba', 'HPE', 'Extreme', 'Meraki']
  const wirelessVendorOptions = ['Cisco', 'Aruba', 'Juniper', 'Extreme', 'Meraki', 'Ruckus']
  const deviceTypeOptions = ['Windows', 'Apple', 'Mobile', 'IoT', 'Guest', 'BYOD', 'Linux']

  useEffect(() => {
    // Load sites from localStorage or use initial data
    const savedSites = localStorage.getItem('portnox-sites')
    if (savedSites) {
      try {
        setSites(JSON.parse(savedSites))
      } catch (error) {
        console.error('Failed to load saved sites:', error)
        setSites(initialSites)
      }
    } else {
      setSites(initialSites)
    }
  }, [])

  useEffect(() => {
    // Save sites to localStorage whenever sites change
    localStorage.setItem('portnox-sites', JSON.stringify(sites))
  }, [sites])

  useEffect(() => {
    // Filter sites based on search and filters
    let filtered = sites

    if (searchTerm) {
      filtered = filtered.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (regionFilter) {
      filtered = filtered.filter(site => site.region === regionFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(site => site.priority === priorityFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(site => site.status === statusFilter)
    }

    setFilteredSites(filtered)
  }, [sites, searchTerm, regionFilter, priorityFilter, statusFilter])

  const handleAddSite = () => {
    if (newSite.id && newSite.name) {
      const site: Site = {
        id: newSite.id,
        name: newSite.name,
        region: newSite.region || 'North America',
        country: newSite.country || 'USA',
        priority: newSite.priority || 'Medium',
        phase: newSite.phase || '1',
        users: newSite.users || 0,
        projectManager: newSite.projectManager || projectManagers[0],
        technicalOwners: newSite.technicalOwners || [],
        status: newSite.status || 'Planned',
        completionPercent: newSite.completionPercent || 0,
        notes: newSite.notes || '',
        wiredVendors: newSite.wiredVendors || [],
        wirelessVendors: newSite.wirelessVendors || [],
        deviceTypes: newSite.deviceTypes || [],
        radsec: newSite.radsec || 'Native',
        plannedStart: newSite.plannedStart || new Date().toISOString().split('T')[0],
        plannedEnd: newSite.plannedEnd || new Date().toISOString().split('T')[0],
        deploymentChecklist: newSite.deploymentChecklist || []
      }

      setSites([...sites, site])
      setNewSite({})
      setShowAddModal(false)
    }
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setShowEditModal(true)
  }

  const handleUpdateSite = () => {
    if (editingSite) {
      setSites(sites.map(site => site.id === editingSite.id ? editingSite : site))
      setEditingSite(null)
      setShowEditModal(false)
    }
  }

  const handleDeleteSite = (siteId: string) => {
    if (confirm('Are you sure you want to delete this site?')) {
      setSites(sites.filter(site => site.id !== siteId))
    }
  }

  const handleViewWorkbook = (siteId: string) => {
    if (onSiteSelect) {
      onSiteSelect(siteId)
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Site ID', 'Name', 'Region', 'Country', 'Priority', 'Phase', 'Users',
      'Project Manager', 'Technical Owners', 'Status', 'Completion %',
      'Wired Vendors', 'Wireless Vendors', 'Device Types', 'RADSEC',
      'Planned Start', 'Planned End', 'Notes'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredSites.map(site => [
        site.id,
        `"${site.name}"`,
        site.region,
        site.country,
        site.priority,
        site.phase,
        site.users,
        `"${site.projectManager}"`,
        `"${site.technicalOwners.join('; ')}"`,
        site.status,
        site.completionPercent,
        `"${site.wiredVendors.join('; ')}"`,
        `"${site.wirelessVendors.join('; ')}"`,
        `"${site.deviceTypes.join('; ')}"`,
        site.radsec,
        site.plannedStart,
        site.plannedEnd,
        `"${site.notes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-sites-${Date.now()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToExcel = () => {
    // In a real implementation, this would use a library like xlsx
    console.log('Exporting to Excel format...')
    exportToCSV() // Fallback to CSV for now
  }

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

  const handleCheckboxChange = (
    items: string[],
    setItems: (items: string[]) => void,
    value: string,
    checked: boolean
  ) => {
    if (checked) {
      setItems([...items, value])
    } else {
      setItems(items.filter(item => item !== value))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Site Management</CardTitle>
            <div className="flex space-x-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={exportToExcel} variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Site
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Site</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="site-id">Site ID *</Label>
                          <Input
                            id="site-id"
                            value={newSite.id || ''}
                            onChange={(e) => setNewSite({...newSite, id: e.target.value})}
                            placeholder="ABM-XXX001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="site-name">Site Name *</Label>
                          <Input
                            id="site-name"
                            value={newSite.name || ''}
                            onChange={(e) => setNewSite({...newSite, name: e.target.value})}
                            placeholder="Site Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Select
                            value={newSite.region || ''}
                            onValueChange={(value) => setNewSite({...newSite, region: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Region" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="North America">North America</SelectItem>
                              <SelectItem value="EMEA">EMEA</SelectItem>
                              <SelectItem value="APAC">APAC</SelectItem>
                              <SelectItem value="LATAM">LATAM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            value={newSite.country || ''}
                            onChange={(e) => setNewSite({...newSite, country: e.target.value})}
                            placeholder="Country"
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newSite.priority || ''}
                            onValueChange={(value: 'High' | 'Medium' | 'Low') => setNewSite({...newSite, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Priority" />
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
                            onChange={(e) => setNewSite({...newSite, users: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Project Management */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Project Management</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project-manager">Project Manager</Label>
                          <Select
                            value={newSite.projectManager || ''}
                            onValueChange={(value) => setNewSite({...newSite, projectManager: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Project Manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {projectManagers.map(pm => (
                                <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={newSite.status || ''}
                            onValueChange={(value: 'Planned' | 'In Progress' | 'Complete' | 'Delayed') => 
                              setNewSite({...newSite, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Planned">Planned</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Complete">Complete</SelectItem>
                              <SelectItem value="Delayed">Delayed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label>Technical Owners</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {technicalOwners.map(owner => (
                            <div key={owner} className="flex items-center space-x-2">
                              <Checkbox
                                id={`owner-${owner}`}
                                checked={newSite.technicalOwners?.includes(owner) || false}
                                onCheckedChange={(checked) => {
                                  const currentOwners = newSite.technicalOwners || []
                                  handleCheckboxChange(
                                    currentOwners,
                                    (owners) => setNewSite({...newSite, technicalOwners: owners}),
                                    owner,
                                    checked as boolean
                                  )
                                }}
                              />
                              <Label htmlFor={`owner-${owner}`} className="text-sm">{owner}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Technical Configuration */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Technical Configuration</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="radsec">RADSEC Implementation</Label>
                          <Select
                            value={newSite.radsec || ''}
                            onValueChange={(value: 'Native' | 'LRAD' | 'None') => setNewSite({...newSite, radsec: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select RADSEC Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Native">Native</SelectItem>
                              <SelectItem value="LRAD">LRAD</SelectItem>
                              <SelectItem value="None">None</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Wired Network Vendors</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {wiredVendorOptions.map(vendor => (
                              <div key={vendor} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`wired-${vendor}`}
                                  checked={newSite.wiredVendors?.includes(vendor) || false}
                                  onCheckedChange={(checked) => {
                                    const currentVendors = newSite.wiredVendors || []
                                    handleCheckboxChange(
                                      currentVendors,
                                      (vendors) => setNewSite({...newSite, wiredVendors: vendors}),
                                      vendor,
                                      checked as boolean
                                    )
                                  }}
                                />
                                <Label htmlFor={`wired-${vendor}`} className="text-sm">{vendor}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Wireless Network Vendors</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {wirelessVendorOptions.map(vendor => (
                              <div key={vendor} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`wireless-${vendor}`}
                                  checked={newSite.wirelessVendors?.includes(vendor) || false}
                                  onCheckedChange={(checked) => {
                                    const currentVendors = newSite.wirelessVendors || []
                                    handleCheckboxChange(
                                      currentVendors,
                                      (vendors) => setNewSite({...newSite, wirelessVendors: vendors}),
                                      vendor,
                                      checked as boolean
                                    )
                                  }}
                                />
                                <Label htmlFor={`wireless-${vendor}`} className="text-sm">{vendor}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label>Device Types</Label>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            {deviceTypeOptions.map(type => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`device-${type}`}
                                  checked={newSite.deviceTypes?.includes(type) || false}
                                  onCheckedChange={(checked) => {
                                    const currentTypes = newSite.deviceTypes || []
                                    handleCheckboxChange(
                                      currentTypes,
                                      (types) => setNewSite({...newSite, deviceTypes: types}),
                                      type,
                                      checked as boolean
                                    )
                                  }}
                                />
                                <Label htmlFor={`device-${type}`} className="text-sm">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Timeline and Notes */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Timeline & Notes</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="planned-start">Planned Start Date</Label>
                          <Input
                            id="planned-start"
                            type="date"
                            value={newSite.plannedStart || ''}
                            onChange={(e) => setNewSite({...newSite, plannedStart: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="planned-end">Planned End Date</Label>
                          <Input
                            id="planned-end"
                            type="date"
                            value={newSite.plannedEnd || ''}
                            onChange={(e) => setNewSite({...newSite, plannedEnd: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newSite.notes || ''}
                          onChange={(e) => setNewSite({...newSite, notes: e.target.value})}
                          placeholder="Enter any special considerations, dependencies, or requirements..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddModal(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleAddSite}>
                        <Save className="h-4 w-4 mr-2" />
                        Add Site
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="EMEA">EMEA</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
                <SelectItem value="LATAM">LATAM</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sites Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completion</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Project Manager</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-mono">{site.id}</TableCell>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(site.priority)}>
                        {site.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${site.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{site.completionPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.users.toLocaleString()}</TableCell>
                    <TableCell>{site.projectManager}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewWorkbook(site.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
            <div className="text-center py-8 text-gray-500">
              No sites found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Site Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Site: {editingSite?.name}</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-site-id">Site ID</Label>
                    <Input
                      id="edit-site-id"
                      value={editingSite.id}
                      onChange={(e) => setEditingSite({...editingSite, id: e.target.value})}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-site-name">Site Name</Label>
                    <Input
                      id="edit-site-name"
                      value={editingSite.name}
                      onChange={(e) => setEditingSite({...editingSite, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-region">Region</Label>
                    <Select
                      value={editingSite.region}
                      onValueChange={(value) => setEditingSite({...editingSite, region: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="North America">North America</SelectItem>
                        <SelectItem value="EMEA">EMEA</SelectItem>
                        <SelectItem value="APAC">APAC</SelectItem>
                        <SelectItem value="LATAM">LATAM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-country">Country</Label>
                    <Input
                      id="edit-country"
                      value={editingSite.country}
                      onChange={(e) => setEditingSite({...editingSite, country: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select
                      value={editingSite.priority}
                      onValueChange={(value: 'High' | 'Medium' | 'Low') => 
                        setEditingSite({...editingSite, priority: value})}
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
                    <Label htmlFor="edit-users">Number of Users</Label>
                    <Input
                      id="edit-users"
                      type="number"
                      value={editingSite.users}
                      onChange={(e) => setEditingSite({...editingSite, users: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Project Management */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Project Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-project-manager">Project Manager</Label>
                    <Select
                      value={editingSite.projectManager}
                      onValueChange={(value) => setEditingSite({...editingSite, projectManager: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projectManagers.map(pm => (
                          <SelectItem key={pm} value={pm}>{pm}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={editingSite.status}
                      onValueChange={(value: 'Planned' | 'In Progress' | 'Complete' | 'Delayed') => 
                        setEditingSite({...editingSite, status: value})}
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
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="edit-completion">Completion Percentage</Label>
                  <Input
                    id="edit-completion"
                    type="number"
                    min="0"
                    max="100"
                    value={editingSite.completionPercent}
                    onChange={(e) => setEditingSite({...editingSite, completionPercent: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div className="mt-4">
                  <Label>Technical Owners</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {technicalOwners.map(owner => (
                      <div key={owner} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-owner-${owner}`}
                          checked={editingSite.technicalOwners.includes(owner)}
                          onCheckedChange={(checked) => {
                            handleCheckboxChange(
                              editingSite.technicalOwners,
                              (owners) => setEditingSite({...editingSite, technicalOwners: owners}),
                              owner,
                              checked as boolean
                            )
                          }}
                        />
                        <Label htmlFor={`edit-owner-${owner}`} className="text-sm">{owner}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Technical Configuration */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Technical Configuration</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-radsec">RADSEC Implementation</Label>
                    <Select
                      value={editingSite.radsec}
                      onValueChange={(value: 'Native' | 'LRAD' | 'None') => 
                        setEditingSite({...editingSite, radsec: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Native">Native</SelectItem>
                        <SelectItem value="LRAD">LRAD</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Wired Network Vendors</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {wiredVendorOptions.map(vendor => (
                        <div key={vendor} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-wired-${vendor}`}
                            checked={editingSite.wiredVendors.includes(vendor)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(
                                editingSite.wiredVendors,
                                (vendors) => setEditingSite({...editingSite, wiredVendors: vendors}),
                                vendor,
                                checked as boolean
                              )
                            }}
                          />
                          <Label htmlFor={`edit-wired-${vendor}`} className="text-sm">{vendor}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Wireless Network Vendors</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {wirelessVendorOptions.map(vendor => (
                        <div key={vendor} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-wireless-${vendor}`}
                            checked={editingSite.wirelessVendors.includes(vendor)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(
                                editingSite.wirelessVendors,
                                (vendors) => setEditingSite({...editingSite, wirelessVendors: vendors}),
                                vendor,
                                checked as boolean
                              )
                            }}
                          />
                          <Label htmlFor={`edit-wireless-${vendor}`} className="text-sm">{vendor}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Device Types</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {deviceTypeOptions.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-device-${type}`}
                            checked={editingSite.deviceTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              handleCheckboxChange(
                                editingSite.deviceTypes,
                                (types) => setEditingSite({...editingSite, deviceTypes: types}),
                                type,
                                checked as boolean
                              )
                            }}
                          />
                          <Label htmlFor={`edit-device-${type}`} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Timeline and Notes */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Timeline & Notes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-planned-start">Planned Start Date</Label>
                    <Input
                      id="edit-planned-start"
                      type="date"
                      value={editingSite.plannedStart}
                      onChange={(e) => setEditingSite({...editingSite, plannedStart: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-planned-end">Planned End Date</Label>
                    <Input
                      id="edit-planned-end"
                      type="date"
                      value={editingSite.plannedEnd}
                      onChange={(e) => setEditingSite({...editingSite, plannedEnd: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editingSite.notes}
                    onChange={(e) => setEditingSite({...editingSite, notes: e.target.value})}
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleUpdateSite}>
                  <Save className="h-4 w-4 mr-2" />
                  Update Site
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
