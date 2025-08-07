'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Download, Edit, Eye, Trash2 } from 'lucide-react'

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
}

interface MasterSiteListProps {
  onSiteSelect: (siteId: string) => void
}

export default function MasterSiteList({ onSiteSelect }: MasterSiteListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Sample data - in a real app this would come from an API
  const [sites] = useState<Site[]>([
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
      notes: 'Executive network needs priority handling.'
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
      notes: '24/7 operation requires careful change windows.'
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
      notes: 'GDPR compliance required.'
    }
  ])

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = !regionFilter || site.region === regionFilter
    const matchesStatus = !statusFilter || site.status === statusFilter
    const matchesPriority = !priorityFilter || site.priority === priorityFilter
    
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
      case 'Complete': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planned': return 'text-gray-600'
      case 'Delayed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const exportCSV = () => {
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
    link.download = `portnox-sites-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleEditSite = (siteId: string) => {
    const site = sites.find(s => s.id === siteId)
    if (site) {
      setEditingSite(site)
      setShowEditModal(true)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Master Site List</span>
          <div className="flex space-x-2">
            <Button onClick={exportCSV} variant="outline" size="sm">
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
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
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
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sites Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Site ID</th>
                <th className="text-left p-3 font-semibold">Site Name</th>
                <th className="text-left p-3 font-semibold">Region</th>
                <th className="text-left p-3 font-semibold">Priority</th>
                <th className="text-left p-3 font-semibold">Phase</th>
                <th className="text-left p-3 font-semibold">Users</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Progress</th>
                <th className="text-left p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.map((site) => (
                <tr key={site.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-mono text-sm">{site.id}</td>
                  <td className="p-3 font-medium">{site.name}</td>
                  <td className="p-3">{site.region}</td>
                  <td className="p-3">
                    <Badge className={getPriorityColor(site.priority)}>
                      {site.priority}
                    </Badge>
                  </td>
                  <td className="p-3">Phase {site.phase}</td>
                  <td className="p-3">{site.users.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`font-medium ${getStatusColor(site.status)}`}>
                      {site.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${site.completionPercent}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-[40px]">
                        {site.completionPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onSiteSelect(site.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditSite(site.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSites.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sites found matching your criteria.
          </div>
        )}
      </CardContent>
      {/* Edit Site Modal */}
      {showEditModal && editingSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Site: {editingSite.name}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Name</label>
                  <input
                    type="text"
                    defaultValue={editingSite.name}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select defaultValue={editingSite.priority} className="w-full p-2 border rounded-md">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Manager</label>
                  <input
                    type="text"
                    defaultValue={editingSite.projectManager}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Users</label>
                  <input
                    type="number"
                    defaultValue={editingSite.users}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  defaultValue={editingSite.notes}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Save logic would go here
                setShowEditModal(false)
                alert('Site updated successfully!')
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
