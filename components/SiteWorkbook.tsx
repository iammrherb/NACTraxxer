'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Book, MapPin, Users, Calendar, Settings } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  // Sample site data - in a real app this would be fetched based on siteId
  const siteData = siteId ? {
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
    plannedEnd: '2025-08-15'
  } : null

  if (!siteId || !siteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No Site Selected
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please select a site from the Master List to view its detailed workbook.
            </p>
          </div>
        </CardContent>
      </Card>
    )
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
      case 'Complete': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planned': return 'text-gray-600'
      case 'Delayed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Book className="h-6 w-6 text-blue-600" />
            <span>Site Workbook: {siteData.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Site Information</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Site ID:</span>
                  <span className="font-mono">{siteData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Region:</span>
                  <span>{siteData.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Country:</span>
                  <span>{siteData.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Priority:</span>
                  <Badge className={getPriorityColor(siteData.priority)}>
                    {siteData.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Phase:</span>
                  <span>Phase {siteData.phase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Users:</span>
                  <span>{siteData.users.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Project Team</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Project Manager:</span>
                  <span>{siteData.projectManager}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Technical Owners:</span>
                  <div className="text-right">
                    {siteData.technicalOwners.map((owner, index) => (
                      <div key={index}>{owner}</div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${getStatusColor(siteData.status)}`}>
                    {siteData.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Completion:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${siteData.completionPercent}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{siteData.completionPercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Project Timeline</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned Start:</span>
                  <span>{new Date(siteData.plannedStart).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Planned End:</span>
                  <span>{new Date(siteData.plannedEnd).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Duration:</span>
                  <span>
                    {Math.ceil((new Date(siteData.plannedEnd).getTime() - new Date(siteData.plannedStart).getTime()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              </div>
            </div>

            {/* Technical Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span>Technical Configuration</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600 dark:text-gray-400">RADSEC Implementation:</span>
                  <Badge variant="outline">{siteData.radsec}</Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wired Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wiredVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Wireless Vendors:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.wirelessVendors.map((vendor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {vendor}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Device Types:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {siteData.deviceTypes.map((type, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Project Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300">
                {siteData.notes}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
