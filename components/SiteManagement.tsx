'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, Filter, Download, Upload, Edit, Trash2, MapPin, Users, Calendar, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'
import AddSiteModal from '@/components/add-site-modal'

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
  radsec: string
  plannedStart: string
  plannedEnd: string
  notes: string
}

interface SiteManagementProps {
  onSiteSelect: (siteId: string) => void
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'New York Headquarters',
      region: 'North America',
      country: 'United States',
      priority: 'High',
      phase: '1',
      users: 2500,
      projectManager: 'Alex Rivera',
      technicalOwners: ['John Smith', 'Emily Jones'],
      status: 'In Progress',
      completionPercent: 75,
      wiredVendors: ['Cisco', 'Aruba'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Apple', 'Mobile'],
      radsec: 'Native',
      plannedStart: '2024-01-15',
      plannedEnd: '2024-03-30',
      notes: 'Primary headquarters deployment with full Zero Trust implementation'
    },
    {
      id: '2',
      name: 'London Office',
      region: 'EMEA',
      country: 'United Kingdom',
      priority: 'High',
      phase: '1',
      users: 800,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Mark Wilson', 'Sarah Thompson'],
      status: 'Complete',
      completionPercent: 100,
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple'],
      radsec: 'LRAD',
      plannedStart: '2024-02-01',
      plannedEnd: '2024-04-15',
      notes: 'EMEA regional hub with GDPR compliance requirements'
    },
    {
      id: '3',
      name: 'Tokyo Branch',
      region: 'APAC',
      country: 'Japan',
      priority: 'Medium',
      phase: '2',
      users: 450,
      projectManager: 'Sofia Linden',
      technicalOwners: ['Carlos Mendez', 'Jennifer Lee'],
      status: 'Planned',
      completionPercent: 0,
      wiredVendors: ['Aruba'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Mobile'],
      radsec: 'Proxy',
      plannedStart: '2024-05-01',
      plannedEnd: '2024-07-30',
      notes: 'APAC expansion with local compliance requirements'
    },
    {
      id: '4',
      name: 'Chicago Manufacturing',
      region: 'North America',
      country: 'United States',
      priority: 'High',
      phase: '1',
      users: 1200,
      projectManager: 'Michael Zhang',
      technicalOwners: ['Paul Davis', 'Diego Ruiz'],
      status: 'In Progress',
      completionPercent: 45,
      wiredVendors: ['Cisco', 'HPE'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Windows', 'Linux', 'IoT'],
      radsec: 'Native',
      plannedStart: '2024-02-15',
      plannedEnd: '2024-05-15',
      notes: 'Manufacturing facility with extensive IoT device integration'
    },
    {
      id: '5',
      name: 'Sydney Office',
      region: 'APAC',
      country: 'Australia',
      priority: 'Medium',
      phase: '2',
      users: 320,
      projectManager: 'Maria Rodriguez',
      technicalOwners: ['Jennifer Lee'],
      status: 'Delayed',
      completionPercent: 25,
      wiredVendors: ['Cisco'],
      wirelessVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Apple'],
      radsec: 'LRAD',
      plannedStart: '2024-03-01',
      plannedEnd: '2024-06-30',
      notes: 'Delayed due to local infrastructure challenges'
    },
    {
      id: '6',
      name: 'Frankfurt Data Center',
      region: 'EMEA',
      country: 'Germany',
      priority: 'High',
      phase: '1',
      users: 150,
      projectManager: 'James Wilson',
      technicalOwners: ['Mark Wilson', 'Carlos Mendez'],
      status: 'In Progress',
      completionPercent: 90,
      wiredVendors: ['Juniper', 'Aruba'],
      wirelessVendors: ['Aruba'],
      deviceTypes: ['Linux', 'Windows'],
      radsec: 'Native',
      plannedStart: '2024-01-01',
      plannedEnd: '2024-03-15',
      notes: 'Critical data center with high security requirements'
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const handleAddSite = (newSite: Omit<Site, 'id'>) => {
    const site: Site = {
      ...newSite,
      id: Date.now().toString()
    }
    setSites([...sites, site])
    showNotification('Site added successfully!', 'success')
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(sites.filter(site => site.id !== siteId))
    showNotification('Site deleted successfully!', 'success')
  }

  const handleExportSites = () => {
    const exportData = {
      sites,
      exportDate: new Date().toISOString(),
      totalSites: sites.length,
      version: '20.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-sites-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
    
    showNotification('Sites exported successfully!', 'success')
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'Delayed':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'Planned':
        return <Calendar className="h-4 w-4 text-gray-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Planned':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.projectManager.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRegion = filterRegion === 'all' || site.region === filterRegion
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus
    const matchesPriority = filterPriority === 'all' || site.priority === filterPriority
    
    return matchesSearch && matchesRegion && matchesStatus && matchesPriority
  })

  const totalSites = sites.length
  const completedSites = sites.filter(s => s.status === 'Complete').length
  const inProgressSites = sites.filter(s => s.status === 'In Progress').length
  const plannedSites = sites.filter(s => s.status === 'Planned').length
  const delayedSites = sites.filter(s => s.status === 'Delayed').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-[#00c8d7]" />
              <div>
                <div className="text-2xl font-bold">{totalSites}</div>
                <div className="text-sm text-muted-foreground">Total Sites</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{completedSites}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{inProgressSites}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="text-2xl font-bold text-gray-600">{plannedSites}</div>
                <div className="text-sm text-muted-foreground">Planned</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{delayedSites}</div>
                <div className="text-sm text-muted-foreground">Delayed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-[#00c8d7]" />
              <span>Master Site List</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleExportSites}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setShowAddModal(true)} className="bg-[#00c8d7] hover:bg-[#0099cc]">
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger className="w-40">
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
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
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
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            {(searchTerm || filterRegion !== 'all' || filterStatus !== 'all' || filterPriority !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setFilterRegion('all')
                  setFilterStatus('all')
                  setFilterPriority('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Sites Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Project Manager</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-sm text-muted-foreground">{site.country}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{site.region}</Badge>
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
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#00c8d7] transition-all duration-300"
                            style={{ width: `${site.completionPercent}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{site.completionPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{site.users.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{site.projectManager}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Phase {site.phase}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSiteSelect(site.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSite(site.id)}
                          className="text-red-500 hover:text-red-700"
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
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No sites found</div>
              <div className="text-sm">
                {searchTerm || filterRegion !== 'all' || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Get started by adding your first site'
                }
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Site Modal */}
      <AddSiteModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onAddSite={handleAddSite}
      />
    </div>
  )
}
