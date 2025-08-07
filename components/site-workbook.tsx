'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Book, FileText, Network, Users, Settings, CheckCircle, Clock, AlertTriangle, Download, Edit, Save } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

interface WorkbookData {
  id: string
  name: string
  location: string
  status: string
  progress: number
  overview: {
    description: string
    siteType: string
    expectedDevices: number
    expectedUsers: number
    projectManager: string
    technicalOwner: string
    startDate: string
    targetDate: string
  }
  networkInfo: {
    existingInfrastructure: string[]
    ipRanges: string[]
    vlanConfiguration: string[]
    wirelessSSIDs: string[]
  }
  checklist: {
    category: string
    items: {
      id: string
      task: string
      completed: boolean
      assignee: string
      dueDate: string
      notes?: string
    }[]
  }[]
  configurations: {
    switchConfig: string
    wirelessConfig: string
    radiusConfig: string
    policyConfig: string
  }
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [editMode, setEditMode] = useState(false)

  // Mock data - in real app, this would be fetched based on siteId
  const workbookData: WorkbookData = {
    id: siteId || '1',
    name: 'Corporate Headquarters',
    location: 'New York, NY',
    status: 'in-progress',
    progress: 75,
    overview: {
      description: 'Primary corporate headquarters with executive offices, IT department, and main data center.',
      siteType: 'Corporate Office',
      expectedDevices: 450,
      expectedUsers: 200,
      projectManager: 'John Smith',
      technicalOwner: 'Sarah Johnson',
      startDate: '2024-01-01',
      targetDate: '2024-01-15'
    },
    networkInfo: {
      existingInfrastructure: ['Cisco Catalyst 9300 Switches', 'Cisco 9800 Wireless Controller', 'Fortinet FortiGate Firewall'],
      ipRanges: ['10.1.0.0/16', '192.168.100.0/24'],
      vlanConfiguration: ['VLAN 10 - Corporate Users', 'VLAN 20 - Guest Network', 'VLAN 30 - IoT Devices', 'VLAN 40 - Servers'],
      wirelessSSIDs: ['CorpWiFi-Secure', 'CorpWiFi-Guest', 'CorpWiFi-IoT']
    },
    checklist: [
      {
        category: 'Pre-Deployment',
        items: [
          { id: '1', task: 'Site survey and assessment', completed: true, assignee: 'Sarah Johnson', dueDate: '2024-01-03' },
          { id: '2', task: 'Network infrastructure review', completed: true, assignee: 'Mike Davis', dueDate: '2024-01-05' },
          { id: '3', task: 'Security policy definition', completed: true, assignee: 'John Smith', dueDate: '2024-01-07' },
          { id: '4', task: 'User communication plan', completed: false, assignee: 'Lisa Chen', dueDate: '2024-01-10' }
        ]
      },
      {
        category: 'Hardware & Configuration',
        items: [
          { id: '5', task: 'RADIUS proxy installation', completed: true, assignee: 'Sarah Johnson', dueDate: '2024-01-08' },
          { id: '6', task: 'Switch configuration update', completed: true, assignee: 'Mike Davis', dueDate: '2024-01-10' },
          { id: '7', task: 'Wireless controller configuration', completed: false, assignee: 'Sarah Johnson', dueDate: '2024-01-12' },
          { id: '8', task: 'Certificate deployment', completed: false, assignee: 'David Brown', dueDate: '2024-01-14' }
        ]
      },
      {
        category: 'Testing & Validation',
        items: [
          { id: '9', task: 'Authentication testing', completed: false, assignee: 'Sarah Johnson', dueDate: '2024-01-15' },
          { id: '10', task: 'Policy enforcement testing', completed: false, assignee: 'Mike Davis', dueDate: '2024-01-16' },
          { id: '11', task: 'User acceptance testing', completed: false, assignee: 'Lisa Chen', dueDate: '2024-01-18' },
          { id: '12', task: 'Performance validation', completed: false, assignee: 'David Brown', dueDate: '2024-01-20' }
        ]
      }
    ],
    configurations: {
      switchConfig: `! Cisco Switch Configuration for NAC
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa accounting dot1x default start-stop group radius

radius server portnox-primary
 address ipv4 10.1.1.100 auth-port 1812 acct-port 1813
 key PortnoxSecretKey123
 
dot1x system-auth-control
dot1x critical eapol

interface range GigabitEthernet1/0/1-48
 switchport mode access
 authentication port-control auto
 authentication periodic
 authentication timer restart 30
 dot1x pae authenticator
 dot1x timeout quiet-period 10
 spanning-tree portfast`,
      wirelessConfig: `# Wireless Controller Configuration
wlan create 1 CorpWiFi-Secure CorpWiFi-Secure
wlan security wpa akm 802.1x 1
wlan security 802.1x authentication-server radius 10.1.1.100 1812 1813 PortnoxSecretKey123 1
wlan enable 1

wlan create 2 CorpWiFi-Guest CorpWiFi-Guest  
wlan security web-auth 2
wlan enable 2`,
      radiusConfig: `# RADIUS Proxy Configuration
server {
    listen {
        type = auth
        ipaddr = *
        port = 1812
    }
    
    client portnox-cloud {
        ipaddr = 0.0.0.0/0
        secret = PortnoxSecretKey123
    }
    
    home_server portnox-cloud {
        type = auth+acct
        ipaddr = radius.portnox.com
        port = 1812
        secret = CloudSecretKey456
        proto = radsec
    }
}`,
      policyConfig: `# Access Control Policies
Policy: Corporate Users
- Device Type: Managed Windows/Mac
- Authentication: EAP-TLS Certificate
- VLAN Assignment: VLAN 10
- Bandwidth: Unlimited
- Access Hours: 24/7

Policy: BYOD Devices  
- Device Type: Personal Mobile
- Authentication: PEAP-MSCHAPv2
- VLAN Assignment: VLAN 20
- Bandwidth: 50 Mbps
- Access Hours: Business Hours Only

Policy: IoT Devices
- Device Type: IoT/Sensors
- Authentication: MAC Authentication
- VLAN Assignment: VLAN 30
- Bandwidth: 10 Mbps
- Access Hours: 24/7`
    }
  }

  const handleChecklistUpdate = (itemId: string, completed: boolean) => {
    // Update checklist item completion status
    console.log(`Updating item ${itemId} to ${completed}`)
  }

  const handleExportWorkbook = () => {
    console.log('Exporting site workbook...')
  }

  const getCompletionRate = () => {
    const totalItems = workbookData.checklist.reduce((total, category) => total + category.items.length, 0)
    const completedItems = workbookData.checklist.reduce((total, category) => 
      total + category.items.filter(item => item.completed).length, 0)
    return Math.round((completedItems / totalItems) * 100)
  }

  if (!siteId) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Book className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Site Selected</h3>
          <p className="text-gray-600 text-center">
            Select a site from the Master Site List to view its detailed workbook
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Book className="h-5 w-5" />
                <span>{workbookData.name} - Site Workbook</span>
              </CardTitle>
              <CardDescription>
                Comprehensive deployment documentation and progress tracking
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                {editMode ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editMode ? 'Save Changes' : 'Edit Mode'}
              </Button>
              <Button onClick={handleExportWorkbook}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{workbookData.status.replace('-', ' ').toUpperCase()}</Badge>
              <span className="text-sm text-gray-600">{workbookData.location}</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{getCompletionRate()}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          <Progress value={getCompletionRate()} className="mb-6" />
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="network">Network Info</TabsTrigger>
          <TabsTrigger value="checklist">Deployment Checklist</TabsTrigger>
          <TabsTrigger value="config">Configurations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Site Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{workbookData.overview.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Site Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Site Type:</span>
                        <span>{workbookData.overview.siteType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Devices:</span>
                        <span>{workbookData.overview.expectedDevices}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Users:</span>
                        <span>{workbookData.overview.expectedUsers}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Project Team</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Project Manager:</span>
                        <span>{workbookData.overview.projectManager}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Owner:</span>
                        <span>{workbookData.overview.technicalOwner}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span>{new Date(workbookData.overview.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target Date:</span>
                        <span>{new Date(workbookData.overview.targetDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Existing Infrastructure</h4>
                <div className="space-y-2">
                  {workbookData.networkInfo.existingInfrastructure.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Network className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">IP Ranges</h4>
                  <div className="space-y-2">
                    {workbookData.networkInfo.ipRanges.map((range, index) => (
                      <Badge key={index} variant="outline">{range}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Wireless SSIDs</h4>
                  <div className="space-y-2">
                    {workbookData.networkInfo.wirelessSSIDs.map((ssid, index) => (
                      <Badge key={index} variant="outline">{ssid}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">VLAN Configuration</h4>
                <div className="space-y-2">
                  {workbookData.networkInfo.vlanConfiguration.map((vlan, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{vlan}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <div className="space-y-6">
            {workbookData.checklist.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={(checked) => handleChecklistUpdate(item.id, checked as boolean)}
                          disabled={!editMode}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                              {item.task}
                            </h4>
                            <div className="flex items-center space-x-2">
                              {item.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span>Assignee: {item.assignee}</span>
                            <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Switch Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{workbookData.configurations.switchConfig}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wireless Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{workbookData.configurations.wirelessConfig}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>RADIUS Proxy Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{workbookData.configurations.radiusConfig}</code>
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Control Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{workbookData.configurations.policyConfig}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
