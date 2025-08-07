'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Book, MapPin, Users, Calendar, Settings, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react'

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
    notes: 'Executive network needs priority handling. Board room has custom AV equipment requiring special considerations for IoT device authentication.',
    wiredVendors: ['Cisco', 'Juniper'],
    wirelessVendors: ['Cisco'],
    deviceTypes: ['Windows', 'Apple', 'Mobile', 'IoT'],
    radsec: 'Native',
    plannedStart: '2025-08-01',
    plannedEnd: '2025-08-15',
    deploymentChecklist: [
      { item: 'Intune Configuration', status: 'complete' },
      { item: 'Certificate Templates', status: 'complete' },
      { item: 'RADIUS Configuration', status: 'in-progress' },
      { item: 'Switch Configuration', status: 'in-progress' },
      { item: 'Wireless Configuration', status: 'pending' },
      { item: 'Policy Configuration', status: 'pending' },
      { item: 'User Testing', status: 'pending' },
      { item: 'Go-Live', status: 'pending' }
    ]
  } : null

  if (!siteId || !siteData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Site Workbook</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            {siteId ? `Site workbook for ${siteId}` : 'Select a site to view its workbook'}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'outline'
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

  const getChecklistIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <XCircle className="h-4 w-4 text-gray-400" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Workbook: {siteData.name}</CardTitle>
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
                  <Badge variant={getPriorityColor(siteData.priority)}>
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
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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

          {/* Deployment Checklist */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Deployment Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {siteData.deploymentChecklist.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  {getChecklistIcon(item.status)}
                  <span className={`flex-1 ${item.status === 'complete' ? 'line-through text-gray-500' : ''}`}>
                    {item.item}
                  </span>
                  <Badge 
                    variant={item.status === 'complete' ? 'default' : item.status === 'in-progress' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
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
