'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Plus, Search, Filter, Download, Edit, Eye, MapPin, Users, Calendar, AlertCircle } from 'lucide-react'

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: 'High' | 'Medium' | 'Low'
  phase: number
  users: number
  projectManager: string
  technicalOwners: string[]
  status: 'Planned' | 'In Progress' | 'Complete' | 'Delayed'
  completionPercent: number
  plannedStart: string
  plannedEnd: string
  radsecType: 'Native' | 'LRAD' | 'None'
  networkVendors: string[]
  deviceTypes: string[]
  notes?: string
}

export default function SiteManagement() {
  const [sites] = useState<Site[]>([
    {
      id: 'ABM-HQ001',
      name: 'ABM Global Headquarters',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: 1,
      users: 2500,
      projectManager: 'Alex Rivera',
      technicalOwners: ['John Smith', 'Mark Wilson'],
      status: 'In Progress',
      completionPercent: 65,
      plannedStart: '2025-08-01',
      plannedEnd: '2025-08-15',
      radsecType: 'Native',
      networkVendors: ['Cisco', 'Meraki'],
      deviceTypes: ['Windows', 'macOS', 'iOS', 'Android'],
      notes: 'Executive network requires priority handling'
    },
    {
      id: 'ABM-DC002',
      name: 'Primary Data Center',
      region: 'North America',
      country: 'USA',
      priority: 'High',
      phase: 1,
      users: 150,
      projectManager: 'Marcus Chen',
      technicalOwners: ['Emily Jones', 'Paul Davis'],
      status: 'Complete',
      completionPercent: 100,
      plannedStart: '2025-08-05',
      plannedEnd: '2025-08-12',
      radsecType: 'LRAD',
      networkVendors: ['Cisco'],
      deviceTypes: ['Windows', 'Linux'],
      notes: '24/7 operation requires careful change windows'
    },
    {
      id: 'ABM-EUR003',
      name: 'European Headquarters',
      region: 'EMEA',
      country: 'Germany',
      priority: 'Medium',
      phase: 2,
      users: 1200,
      projectManager: 'Sofia Linden',
      technicalOwners: ['Sarah Thompson'],
      status: 'Planned',
      completionPercent: 0,
      plannedStart: '2025-09-01',
      plannedEnd: '2025-09-15',
      radsecType: 'Native',
      networkVendors: ['Aruba'],
      deviceTypes: ['Windows', 'macOS', 'iOS'],
      notes: 'GDPR compliance requirements'
    },
    {
      id: 'ABM-APAC004',
      name: 'APAC Regional Office',
      region: 'APAC',
      country: 'Singapore',
      priority: 'Medium',
      phase: 2,
      users: 800,
      projectManager: 'Michael Zhang',
      technicalOwners: ['Carlos Mendez'],
      status: 'Delayed',
      completionPercent: 15,
      plannedStart: '2025-09-10',
      plannedEnd: '2025-09-25',
      radsecType: 'LRAD',
      networkVendors: ['Juniper'],
      deviceTypes: ['Windows', 'macOS', 'Android'],
      notes: 'Delayed due to local infrastructure issues'
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.country.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = !regionFilter || site.region === regionFilter
    const matchesStatus = !statusFilter || site.status === statusFilter
    const matchesPriority = !priorityFilter || site.priority === priorityFilter

    return matchesSearch && matchesRegion && matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Delayed': return 'bg-red-100 text-red-800'
      case 'Planned': return 'bg-gray-100 text-gray-800'
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

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-green-500'
    if (percent >= 50) return 'bg-blue-500'
    if (percent > 0) return 'bg-yellow-500'
    return 'bg-gray-300'
  }

  const exportToCSV = () => {
    const headers = ['Site ID', 'Site Name', 'Region', 'Country', 'Priority', 'Phase', 'Users', 'Status', 'Completion %']
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
        site.status,
        site.completionPercent
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `portnox-sites-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Site Management</span>
            <div className="flex items-center space-x-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Site
              </Button>
            </div>
          </CardTitle>
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

            {(searchTerm || regionFilter || statusFilter || priorityFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('')
                  setRegionFilter('')
                  setStatusFilter('')
                  setPriorityFilter('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{filteredSites.length}</p>
                    <p className="text-sm text-muted-foreground">Total Sites</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSites.reduce((sum, site) => sum + site.users, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSites.filter(s => s.status === 'Complete').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {filteredSites.filter(s => s.status === 'Delayed').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Delayed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sites Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Timeline</TableHead>
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
                      <div>
                        <div className="font-medium">{site.country}</div>
                        <div className="text-sm text-muted-foreground">{site.region}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(site.priority)}>
                        {site.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Phase {site.phase}</Badge>
                    </TableCell>
                    <TableCell>{site.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={site.completionPercent} 
                          className="w-16 h-2"
                        />
                        <span className="text-sm font-medium">{site.completionPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(site.plannedStart).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          to {new Date(site.plannedEnd).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
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
    </div>
  )
}
