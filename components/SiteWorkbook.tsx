'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Building2, Network, Users, Shield, Settings, FileText, Download, Save } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock site data - in real app this would come from props or API
  const siteData = {
    id: siteId || 'NYC001',
    name: 'Manhattan Corporate HQ',
    region: 'North America',
    country: 'United States',
    address: '123 Corporate Plaza, New York, NY 10001',
    projectManager: 'Sarah Johnson',
    technicalOwners: ['Mike Chen', 'Lisa Rodriguez'],
    status: 'In Progress',
    phase: '1'
  }

  const workbookTabs = [
    { id: 'overview', name: 'Site Overview', icon: Building2 },
    { id: 'network', name: 'Network Config', icon: Network },
    { id: 'users', name: 'User Groups', icon: Users },
    { id: 'security', name: 'Security Policies', icon: Shield },
    { id: 'deployment', name: 'Deployment', icon: Settings },
    { id: 'documentation', name: 'Documentation', icon: FileText }
  ]

  if (!siteId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Site Selected</h3>
          <p className="text-gray-600">Please select a site from the Master Site List to view its workbook.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Site Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>{siteData.name}</span>
                <Badge variant="outline">{siteData.id}</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">{siteData.address}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span><strong>PM:</strong> {siteData.projectManager}</span>
                <span><strong>Phase:</strong> {siteData.phase}</span>
                <Badge className="bg-blue-100 text-blue-800">{siteData.status}</Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Workbook
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workbook Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
              {workbookTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 data-[state=active]:bg-blue-50"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Site Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input id="site-name" defaultValue={siteData.name} />
                      </div>
                      <div>
                        <Label htmlFor="site-address">Address</Label>
                        <Textarea id="site-address" defaultValue={siteData.address} rows={3} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="region">Region</Label>
                          <Select defaultValue={siteData.region}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="North America">North America</SelectItem>
                              <SelectItem value="EMEA">EMEA</SelectItem>
                              <SelectItem value="APAC">APAC</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue={siteData.country} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Project Team</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="project-manager">Project Manager</Label>
                        <Input id="project-manager" defaultValue={siteData.projectManager} />
                      </div>
                      <div>
                        <Label htmlFor="technical-owners">Technical Owners</Label>
                        <Textarea 
                          id="technical-owners" 
                          defaultValue={siteData.technicalOwners.join(', ')} 
                          rows={2}
                        />
                      </div>
                      <div>
                        <Label htmlFor="deployment-phase">Deployment Phase</Label>
                        <Select defaultValue={siteData.phase}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Phase 1 - Pilot</SelectItem>
                            <SelectItem value="2">Phase 2 - Rollout</SelectItem>
                            <SelectItem value="3">Phase 3 - Production</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Network Infrastructure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="wired-vendor">Wired Network Vendor</Label>
                        <Select defaultValue="cisco">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cisco">Cisco</SelectItem>
                            <SelectItem value="juniper">Juniper</SelectItem>
                            <SelectItem value="hpe">HPE Aruba</SelectItem>
                            <SelectItem value="extreme">Extreme Networks</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="wireless-vendor">Wireless Vendor</Label>
                        <Select defaultValue="cisco">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cisco">Cisco</SelectItem>
                            <SelectItem value="aruba">Aruba</SelectItem>
                            <SelectItem value="ruckus">Ruckus</SelectItem>
                            <SelectItem value="meraki">Meraki</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="radius-config">RADIUS Configuration</Label>
                        <Select defaultValue="native">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="native">Native RADIUS</SelectItem>
                            <SelectItem value="lrad">LRAD Proxy</SelectItem>
                            <SelectItem value="radsec">RadSec</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">VLAN Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">Corporate VLAN</div>
                            <div className="text-sm text-gray-600">VLAN 100 - 192.168.100.0/24</div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">Guest VLAN</div>
                            <div className="text-sm text-gray-600">VLAN 200 - 192.168.200.0/24</div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Configured</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">Quarantine VLAN</div>
                            <div className="text-sm text-gray-600">VLAN 999 - 192.168.999.0/24</div>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Groups & Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">User Groups</h4>
                        <div className="space-y-2">
                          {['Employees', 'Contractors', 'Guests', 'Service Accounts'].map((group) => (
                            <div key={group} className="flex items-center space-x-2">
                              <Checkbox defaultChecked />
                              <Label>{group}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Device Types</h4>
                        <div className="space-y-2">
                          {['Windows Laptops', 'MacBooks', 'Mobile Devices', 'IoT Devices', 'Printers'].map((device) => (
                            <div key={device} className="flex items-center space-x-2">
                              <Checkbox defaultChecked />
                              <Label>{device}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Security Policies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Corporate Device Access', status: 'Active', priority: 'High' },
                        { name: 'Guest Network Policy', status: 'Active', priority: 'Medium' },
                        { name: 'IoT Device Isolation', status: 'Pending', priority: 'High' },
                        { name: 'Non-Compliant Quarantine', status: 'Active', priority: 'Critical' }
                      ].map((policy, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded">
                          <div>
                            <div className="font-medium">{policy.name}</div>
                            <div className="text-sm text-gray-600">Priority: {policy.priority}</div>
                          </div>
                          <Badge className={
                            policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }>
                            {policy.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deployment Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { task: 'LRAD Installation', completed: true },
                        { task: 'RADIUS Configuration', completed: true },
                        { task: 'Switch Configuration', completed: true },
                        { task: 'Wireless Controller Setup', completed: false },
                        { task: 'MAB Configuration', completed: false },
                        { task: 'User Testing', completed: false },
                        { task: 'Documentation', completed: false }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Checkbox checked={item.completed} />
                          <Label className={item.completed ? 'line-through text-gray-500' : ''}>
                            {item.task}
                          </Label>
                          {item.completed && (
                            <Badge className="bg-green-100 text-green-800">Complete</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Site Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deployment-notes">Deployment Notes</Label>
                        <Textarea 
                          id="deployment-notes" 
                          placeholder="Enter deployment notes and observations..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="technical-specs">Technical Specifications</Label>
                        <Textarea 
                          id="technical-specs" 
                          placeholder="Document technical specifications and configurations..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="known-issues">Known Issues</Label>
                        <Textarea 
                          id="known-issues" 
                          placeholder="Document any known issues or limitations..."
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
