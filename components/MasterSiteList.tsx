'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Plus, MapPin, Users, Network, MoreHorizontal } from 'lucide-react'

interface Site {
  id: string
  name: string
  location: string
  status: 'active' | 'pending' | 'inactive'
  devices: number
  users: number
  lastUpdate: string
}

export default function MasterSiteList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sites] = useState<Site[]>([
    {
      id: '1',
      name: 'Corporate Headquarters',
      location: 'New York, NY',
      status: 'active',
      devices: 1250,
      users: 850,
      lastUpdate: '2024-01-15'
    },
    {
      id: '2',
      name: 'West Coast Office',
      location: 'San Francisco, CA',
      status: 'active',
      devices: 680,
      users: 420,
      lastUpdate: '2024-01-14'
    },
    {
      id: '3',
      name: 'Manufacturing Plant',
      location: 'Detroit, MI',
      status: 'pending',
      devices: 320,
      users: 180,
      lastUpdate: '2024-01-12'
    },
    {
      id: '4',
      name: 'European Office',
      location: 'London, UK',
      status: 'active',
      devices: 450,
      users: 280,
      lastUpdate: '2024-01-13'
    },
    {
      id: '5',
      name: 'Research Facility',
      location: 'Austin, TX',
      status: 'inactive',
      devices: 150,
      users: 75,
      lastUpdate: '2024-01-10'
    }
  ])

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            <span>Master Site List</span>
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and monitor all deployment sites across your organization.
          </p>
        </CardHeader>
        <CardContent>
          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Site</span>
            </Button>
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map((site) => (
              <Card key={site.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{site.name}</h3>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{site.location}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    {getStatusBadge(site.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Network className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">{site.devices}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Devices</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">{site.users}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Last updated: {site.lastUpdate}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">View Details</Button>
                    <Button size="sm" variant="outline" className="flex-1">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No sites found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or add a new site.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
