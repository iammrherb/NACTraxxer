'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Search, Download, Edit, Trash2, Eye, Building, MapPin, Users, Calendar, CheckCircle, Clock, AlertTriangle, XCircle, Filter } from 'lucide-react'
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

const sampleSites: Site[] = [
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
    wiredVendors: ['Cisco', 'Juniper'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
    radsec: 'Native',
    plannedStart: '2025-08-01',
    plannedEnd: '2025-08-15',
    notes: 'Executive network needs priority handling. Board room has custom AV equipment requiring special considerations for IoT device authentication.'
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
    wiredVendors: ['Cisco'],
    wirelessVendors: ['Aruba'],
    deviceTypes: ['Windows', 'IoT'],
    radsec: 'LRAD',
    plannedStart: '2025-08-05',
    plannedEnd: '2025-08-12',
    notes: '24/7 operation requires careful change windows. Critical infrastructure with redundant authentication paths.'
  },
  {
    id: 'ABM-EUR003',
    name: 'European HQ',
    region: 'EMEA',
    country: 'Germany',
    priority: 'Medium',
    phase: '2',
    users: 1200,
    projectManager: 'Sofia Linden',
    technicalOwners: ['Sarah Thompson'],
    status: 'Planned',
    completionPercent: 0,
    wiredVendors: ['HPE'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Windows', 'Apple', 'Mobile'],
    radsec: 'Native',
    plannedStart: '2025-09-01',
    plannedEnd: '2025-09-15',
    notes: 'GDPR compliance required. Multi-language support needed for user onboarding portal.'
  },
  {
    id: 'ABM-MFG006',
    name: 'Manufacturing Plant',
    region: 'LATAM',
    country: 'Mexico',
    priority: 'High',
    phase: '1',
    users: 450,
    projectManager: 'Maria Rodriguez',
    technicalOwners: ['Carlos Mendez', 'Diego Ruiz'],
    status: 'Complete',
    completionPercent: 100,
    wiredVendors: ['Extreme'],
    wirelessVendors: ['Extreme'],
    deviceTypes: ['Windows', 'IoT'],
    radsec: 'Native',
    plannedStart: '2025-08-15',
    plannedEnd: '2025-08-30',
    notes: 'Manufacturing floor required special considerations for IoT devices. Implemented using certificates for device authentication. Project completed ahead of schedule.'
  },
  {
    id: 'ABM-RD007',
    name: 'Research & Development',
    region: 'North America',
    country: 'USA',
    priority: 'High',
    phase: '1',
    users: 320,
    projectManager: 'James Wilson',
    technicalOwners: ['Jennifer Lee', 'Paul Davis'],
    status: 'In Progress',
    completionPercent: 55,
    wiredVendors: ['Cisco', 'Aruba'],
    wirelessVendors: ['Cisco', 'Aruba'],
    deviceTypes: ['Windows', 'Apple', 'Linux', 'IoT'],
    radsec: 'LRAD',
    plannedStart: '2025-08-03',
    plannedEnd: '2025-08-20',
    notes: 'Specialized lab equipment needs custom authentication. Research environment requires flexible access policies.'
  }
]

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>(sampleSites)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === 'all' || site.region === regionFilter
    const matchesPriority = priorityFilter === 'all' || site.priority === priorityFilter
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter

    return matchesSearch && matchesRegion && matchesPriority && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'Delayed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'Planned':
        return <XCircle className="h-4 w-4 text-gray-600" />
      default:
        return null
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive'
      case 'Medium':
        return 'default'
      case 'Low':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const exportToCSV = () => {
    const headers = [
      'Site ID', 'Site Name', 'Region', 'Country', 'Priority', 'Phase', 
      'Users', 'Project Manager', 'Technical Owners', 'Status', 
      'Completion %', 'RADSEC', 'Notes'
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
        `"${site.technicalOwners.join(', ')}"`,
        site.status,
        site.completionPercent,
        site.radsec,
        `"${site.notes}"`
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

  const handleAddSite = (newSite: Omit<Site, 'id'>) => {
    const site: Site = {
      ...newSite,
      id: `ABM-${Date.now().toString().slice(-6).toUpperCase()}`
    }
    setSites(prev => [...prev, site])
  }

  const handleDeleteSite = (siteId: string) => {
    setSites(prev => prev.filter(site => site.id !== siteId))
  }

  const handleViewSite = (site: Site) => {
    setSelectedSite(site)
    onSiteSelect(site.id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Master Site List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Controls */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>

            <div className="ml-auto flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>

          {/* Sites Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Project Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{site.name}</div>
                        <div className="text-sm text-muted-foreground">{site.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{site.region}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{site.country}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(site.priority)}>
                        {site.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>Phase {site.phase}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{site.users.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>{site.projectManager}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(site.status)}
                        <span>{site.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Progress value={site.completionPercent} className="w-20" />
                        <span className="text-sm text-muted-foreground">
                          {site.completionPercent}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSite(site)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
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
            <div className="text-center py-8 text-muted-foreground">
              No sites found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Site Details Dialog */}
      <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>{selectedSite?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Site ID: {selectedSite?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSite && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Region:</span>
                        <span>{selectedSite.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span>{selectedSite.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant={getPriorityColor(selectedSite.priority)}>
                          {selectedSite.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phase:</span>
                        <span>Phase {selectedSite.phase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Users:</span>
                        <span>{selectedSite.users.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Project Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Project Manager:</span>
                        <span>{selectedSite.projectManager}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Technical Owners:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedSite.technicalOwners.map((owner, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {owner}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planned Start:</span>
                        <span>{selectedSite.plannedStart}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Planned End:</span>
                        <span>{selectedSite.plannedEnd}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(selectedSite.status)}
                          <span>{selectedSite.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Progress:</span>
                        <span>{selectedSite.completionPercent}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Technical Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RADSEC:</span>
                        <span>{selectedSite.radsec}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Wired Vendors:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedSite.wiredVendors.map((vendor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Wireless Vendors:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedSite.wirelessVendors.map((vendor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Device Types</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.deviceTypes.map((type, index) => (
                    <Badge key={index} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedSite.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedSite.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Site Modal */}
      <AddSiteModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onAddSite={handleAddSite}
      />
    </div>
  )
}
