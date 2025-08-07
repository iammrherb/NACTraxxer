'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, MapPin, Building, Users, Network } from 'lucide-react'

interface Site {
  id: string
  name: string
  location: string
  region: string
  status: 'active' | 'inactive' | 'planning' | 'deployment'
  devices: number
  users: number
  lastUpdate: string
  nacDeployed: boolean
  compliance: number
}

interface SiteManagementProps {
  onSiteSelect: (siteId: string) => void
}

export default function SiteManagement({ onSiteSelect }: SiteManagementProps) {
  const [sites, setSites] = useState<Site[]>([
    {
      id: '1',
      name: 'ABM Corporate HQ',
      location: 'New York, NY',
      region: 'North America',
      status: 'active',
      devices: 1250,
      users: 850,
      lastUpdate: '2024-01-20T10:30:00Z',
      nacDeployed: true,
      compliance: 98
    },
    {
      id: '2',
      name: 'ABM West Coast Office',
      location: 'San Francisco, CA',
      region: 'North America',
      status: 'active',
      devices: 890,
      users: 620,
      lastUpdate: '2024-01-19T15:45:00Z',
      nacDeployed: true,
      compliance: 95
    },
    {
      id: '3',
      name: 'ABM Chicago Branch',
      location: 'Chicago, IL',
      region: 'North America',
      status: 'deployment',
      devices: 450,
      users: 320,
      lastUpdate: '2024-01-18T09:15:00Z',
      nacDeployed: false,
      compliance: 0
    },
    {
      id: '4',
      name: 'ABM London Office',
      location: 'London, UK',
      region: 'Europe',
      status: 'planning',
      devices: 680,
      users: 480,
      lastUpdate: '2024-01-17T14:20:00Z',
      nacDeployed: false,
      compliance: 0
    },
    {
      id: '5',
      name: 'ABM Singapore Hub',
      location: 'Singapore',
      region: 'Asia Pacific',
      status: 'active',
      devices: 720,
      users: 510,
      lastUpdate: '2024-01-20T08:00:00Z',
      nacDeployed: true,
      compliance: 92
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [regionFilter, setRegionFilter] = useState('all')
  const [selectedSites, setSelectedSites] = useState<string[]>([])

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status === statusFilter
    const matchesRegion = regionFilter === 'all' || site.region === regionFilter
    
    return matchesSearch && matchesStatus && matchesRegion
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'planning': return 'bg-blue-500'
      case 'deployment': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getComplianceColor = (compliance: number) => {
    if (compliance >= 95) return 'text-green-600'
    if (compliance >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleSiteSelect = (siteId: string) => {
    onSiteSelect(siteId)
  }

  const toggleSiteSelection = (siteId: string) => {
    setSelectedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    )
  }

  const exportSites = () => {
    const exportData = {
      sites: filteredSites,
      exportedAt: new Date().toISOString(),
      totalSites: filteredSites.length,
      summary: {
        active: filteredSites.filter(s => s.status === 'active').length,
        deployment: filteredSites.filter(s => s.status === 'deployment').length,
        planning: filteredSites.filter(s => s.status === 'planning').length,
        totalDevices: filteredSites.reduce((sum, s) => sum + s.devices, 0),
        totalUsers: filteredSites.reduce((sum, s) => sum + s.users, 0)
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `abm-sites-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const regions = [...new Set(sites.map(site => site.region))]
  const statuses = ['active', 'inactive', 'planning', 'deployment']

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-[#00c8d7] rounded-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#00c8d7] to-[#007acc] bg-clip-text text-transparent">
                ABM Site Management
              </span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportSites}
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Sites
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Sites
              </Button>
              <Button
                size="sm"
                className="bg-[#00c8d7] hover:bg-[#0099cc] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Site
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-[#00c8d7]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-[#00c8d7]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                      <span className="capitalize">{status}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-[#00c8d7]">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sites</p>
                <p className="text-3xl font-bold text-green-600">
                  {filteredSites.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-3xl font-bold text-blue-600">
                  {filteredSites.reduce((sum, s) => sum + s.devices, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Network className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">
                  {filteredSites.reduce((sum, s) => sum + s.users, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#00c8d7]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NAC Deployed</p>
                <p className="text-3xl font-bold text-[#00c8d7]">
                  {filteredSites.filter(s => s.nacDeployed).length}
                </p>
              </div>
              <div className="p-3 bg-[#00c8d7]/10 rounded-full">
                <MapPin className="w-6 h-6 text-[#00c8d7]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sites Table */}
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Site Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSites(filteredSites.map(s => s.id))
                        } else {
                          setSelectedSites([])
                        }
                      }}
                      checked={selectedSites.length === filteredSites.length && filteredSites.length > 0}
                    />
                  </TableHead>
                  <TableHead>Site Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>NAC Status</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSites.map((site) => (
                  <TableRow 
                    key={site.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleSiteSelect(site.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.id)}
                        onChange={() => toggleSiteSelection(site.id)}
                      />
                    </TableCell>
                    <TableCell className="font-semibold">{site.name}</TableCell>
                    <TableCell>{site.location}</TableCell>
                    <TableCell>{site.region}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(site.status)} text-white`}>
                        {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{site.devices.toLocaleString()}</TableCell>
                    <TableCell>{site.users.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={site.nacDeployed ? 'default' : 'secondary'}>
                        {site.nacDeployed ? 'Deployed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getComplianceColor(site.compliance)}`}>
                        {site.compliance}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(site.lastUpdate).toLocaleDateString()}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
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

      {/* Bulk Actions */}
      {selectedSites.length > 0 && (
        <Card className="border-[#00c8d7] bg-[#00c8d7]/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">
                {selectedSites.length} site{selectedSites.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Deploy NAC
                </Button>
                <Button variant="outline" size="sm">
                  Update Policies
                </Button>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedSites([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
