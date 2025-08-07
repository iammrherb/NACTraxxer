'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { FileText, Download, Printer, MapPin, Users, Network, Calendar, CheckCircle, Clock, AlertTriangle, Settings, Shield, Key } from 'lucide-react'

interface SiteWorkbookProps {
  selectedSite: string | null
}

interface SiteDetails {
  id: string
  name: string
  location: string
  type: string
  users: number
  devices: number
  status: string
  priority: string
  completion: number
  startDate: string
  targetDate: string
  networkVendor: string
  contactPerson: string
  notes: string
  technicalDetails: {
    networkSegments: string[]
    vlanConfiguration: { id: number; name: string; subnet: string }[]
    switchPorts: number
    accessPoints: number
    serverRacks: number
  }
  deploymentChecklist: {
    category: string
    tasks: { id: string; title: string; status: 'completed' | 'in-progress' | 'pending'; assignee: string; dueDate: string }[]
  }[]
  riskAssessment: {
    risk: string
    impact: 'High' | 'Medium' | 'Low'
    probability: 'High' | 'Medium' | 'Low'
    mitigation: string
    status: 'Open' | 'Mitigated' | 'Closed'
  }[]
}

export default function SiteWorkbook({ selectedSite }: SiteWorkbookProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock site data - in real app this would come from props or API
  const siteData: { [key: string]: SiteDetails } = {
    '1': {
      id: '1',
      name: 'Corporate Headquarters',
      location: 'New York, NY',
      type: 'Headquarters',
      users: 850,
      devices: 1200,
      status: 'Complete',
      priority: 'High',
      completion: 100,
      startDate: '2024-01-15',
      targetDate: '2024-03-15',
      networkVendor: 'Cisco Meraki',
      contactPerson: 'John Smith',
      notes: 'Primary site with full deployment completed successfully.',
      technicalDetails: {
        networkSegments: ['Corporate LAN', 'Guest Network', 'IoT Network', 'Server Network'],
        vlanConfiguration: [
          { id: 10, name: 'Corporate', subnet: '10.1.10.0/24' },
          { id: 20, name: 'Guest', subnet: '10.1.20.0/24' },
          { id: 30, name: 'IoT', subnet: '10.1.30.0/24' },
          { id: 40, name: 'Servers', subnet: '10.1.40.0/24' }
        ],
        switchPorts: 48,
        accessPoints: 24,
        serverRacks: 8
      },
      deploymentChecklist: [
        {
          category: 'Infrastructure Preparation',
          tasks: [
            { id: '1-1', title: 'Network topology documentation', status: 'completed', assignee: 'Mike Chen', dueDate: '2024-01-20' },
            { id: '1-2', title: 'Switch configuration backup', status: 'completed', assignee: 'Mike Chen', dueDate: '2024-01-22' },
            { id: '1-3', title: 'VLAN configuration review', status: 'completed', assignee: 'Lisa Wang', dueDate: '2024-01-25' }
          ]
        },
        {
          category: 'Portnox Configuration',
          tasks: [
            { id: '2-1', title: 'Site configuration in Portnox Cloud', status: 'completed', assignee: 'Tom Rodriguez', dueDate: '2024-02-01' },
            { id: '2-2', title: 'Policy configuration', status: 'completed', assignee: 'Sarah Johnson', dueDate: '2024-02-05' },
            { id: '2-3', title: 'RADSec proxy configuration', status: 'completed', assignee: 'Tom Rodriguez', dueDate: '2024-02-10' }
          ]
        },
        {
          category: 'Certificate Deployment',
          tasks: [
            { id: '3-1', title: 'Intune SCEP profile creation', status: 'completed', assignee: 'Sarah Johnson', dueDate: '2024-02-15' },
            { id: '3-2', title: 'Certificate deployment to devices', status: 'completed', assignee: 'Sarah Johnson', dueDate: '2024-02-20' },
            { id: '3-3', title: 'Certificate validation testing', status: 'completed', assignee: 'Mike Chen', dueDate: '2024-02-25' }
          ]
        }
      ],
      riskAssessment: [
        {
          risk: 'Network downtime during switch configuration',
          impact: 'High',
          probability: 'Low',
          mitigation: 'Schedule changes during maintenance window with rollback plan',
          status: 'Mitigated'
        },
        {
          risk: 'Certificate enrollment failures',
          impact: 'Medium',
          probability: 'Medium',
          mitigation: 'Implement staged rollout with manual enrollment fallback',
          status: 'Mitigated'
        }
      ]
    },
    '2': {
      id: '2',
      name: 'West Coast Office',
      location: 'San Francisco, CA',
      type: 'Regional Office',
      users: 425,
      devices: 580,
      status: 'In Progress',
      priority: 'High',
      completion: 75,
      startDate: '2024-02-01',
      targetDate: '2024-04-01',
      networkVendor: 'Cisco Meraki',
      contactPerson: 'Sarah Johnson',
      notes: 'Phase 2 deployment in progress. Certificate rollout 80% complete.',
      technicalDetails: {
        networkSegments: ['Corporate LAN', 'Guest Network', 'Development Network'],
        vlanConfiguration: [
          { id: 10, name: 'Corporate', subnet: '10.2.10.0/24' },
          { id: 20, name: 'Guest', subnet: '10.2.20.0/24' },
          { id: 50, name: 'Development', subnet: '10.2.50.0/24' }
        ],
        switchPorts: 24,
        accessPoints: 16,
        serverRacks: 4
      },
      deploymentChecklist: [
        {
          category: 'Infrastructure Preparation',
          tasks: [
            { id: '1-1', title: 'Network topology documentation', status: 'completed', assignee: 'Mike Chen', dueDate: '2024-02-05' },
            { id: '1-2', title: 'Switch configuration backup', status: 'completed', assignee: 'Mike Chen', dueDate: '2024-02-07' },
            { id: '1-3', title: 'VLAN configuration review', status: 'completed', assignee: 'Lisa Wang', dueDate: '2024-02-10' }
          ]
        },
        {
          category: 'Portnox Configuration',
          tasks: [
            { id: '2-1', title: 'Site configuration in Portnox Cloud', status: 'completed', assignee: 'Tom Rodriguez', dueDate: '2024-02-15' },
            { id: '2-2', title: 'Policy configuration', status: 'completed', assignee: 'Sarah Johnson', dueDate: '2024-02-20' },
            { id: '2-3', title: 'RADSec proxy configuration', status: 'in-progress', assignee: 'Tom Rodriguez', dueDate: '2024-03-01' }
          ]
        },
        {
          category: 'Certificate Deployment',
          tasks: [
            { id: '3-1', title: 'Intune SCEP profile creation', status: 'completed', assignee: 'Sarah Johnson', dueDate: '2024-03-05' },
            { id: '3-2', title: 'Certificate deployment to devices', status: 'in-progress', assignee: 'Sarah Johnson', dueDate: '2024-03-15' },
            { id: '3-3', title: 'Certificate validation testing', status: 'pending', assignee: 'Mike Chen', dueDate: '2024-03-20' }
          ]
        }
      ],
      riskAssessment: [
        {
          risk: 'Development team resistance to certificate authentication',
          impact: 'Medium',
          probability: 'Medium',
          mitigation: 'Conduct training sessions and provide development-friendly policies',
          status: 'Open'
        },
        {
          risk: 'Legacy application compatibility issues',
          impact: 'High',
          probability: 'Low',
          mitigation: 'Identify legacy apps and create exception policies',
          status: 'Open'
        }
      ]
    }
  }

  const currentSite = selectedSite ? siteData[selectedSite] : null

  if (!selectedSite || !currentSite) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Site Selected</h3>
            <p className="text-muted-foreground">Select a site from the Sites tab to view its detailed workbook.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const exportWorkbook = (format: 'pdf' | 'excel') => {
    // Mock export functionality
    alert(`Exporting ${currentSite.name} workbook as ${format.toUpperCase()}...`)
  }

  const totalTasks = currentSite.deploymentChecklist.reduce((acc, category) => acc + category.tasks.length, 0)
  const completedTasks = currentSite.deploymentChecklist.reduce((acc, category) => 
    acc + category.tasks.filter(task => task.status === 'completed').length, 0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Site Workbook: {currentSite.name}</span>
              </CardTitle>
              <p className="text-muted-foreground mt-1">{currentSite.location} • {currentSite.type}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => exportWorkbook('pdf')}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => exportWorkbook('excel')}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Site Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{currentSite.users}</p>
                <p className="text-sm text-muted-foreground">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Network className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{currentSite.devices}</p>
                <p className="text-sm text-muted-foreground">Devices</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{currentSite.completion}%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Done</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Site Type</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.type}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Network Vendor</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.networkVendor}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Contact Person</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Target Date</Label>
                    <p className="text-sm text-muted-foreground">{currentSite.targetDate}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Project Status</Label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getStatusColor(currentSite.status.toLowerCase().replace(' ', '-'))}>
                      {currentSite.status}
                    </Badge>
                    <Badge variant="outline">{currentSite.priority} Priority</Badge>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Progress</Label>
                  <div className="mt-2">
                    <Progress value={currentSite.completion} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-1">{currentSite.completion}% Complete</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm text-muted-foreground mt-1">{currentSite.notes}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Deployment Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentSite.deploymentChecklist.map((category, index) => {
                    const categoryCompleted = category.tasks.filter(task => task.status === 'completed').length
                    const categoryTotal = category.tasks.length
                    const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100)
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{category.category}</h4>
                          <span className="text-sm text-muted-foreground">{categoryCompleted}/{categoryTotal}</span>
                        </div>
                        <Progress value={categoryProgress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Network className="h-5 w-5" />
                  <span>Network Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Network Segments</Label>
                  <div className="mt-2 space-y-1">
                    {currentSite.technicalDetails.networkSegments.map((segment, index) => (
                      <Badge key={index} variant="outline">{segment}</Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Infrastructure</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm">Switch Ports: <span className="font-medium">{currentSite.technicalDetails.switchPorts}</span></p>
                    </div>
                    <div>
                      <p className="text-sm">Access Points: <span className="font-medium">{currentSite.technicalDetails.accessPoints}</span></p>
                    </div>
                    <div>
                      <p className="text-sm">Server Racks: <span className="font-medium">{currentSite.technicalDetails.serverRacks}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>VLAN Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentSite.technicalDetails.vlanConfiguration.map((vlan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">VLAN {vlan.id}</p>
                        <p className="text-sm text-muted-foreground">{vlan.name}</p>
                      </div>
                      <Badge variant="outline">{vlan.subnet}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="checklist">
          <div className="space-y-6">
            {currentSite.deploymentChecklist.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category.category}</span>
                    <Badge variant="outline">
                      {category.tasks.filter(task => task.status === 'completed').length}/{category.tasks.length} Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">Assigned to: {task.assignee}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Risk Assessment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSite.riskAssessment.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">{risk.risk}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRiskColor(risk.impact)}>
                          {risk.impact} Impact
                        </Badge>
                        <Badge className={getRiskColor(risk.probability)}>
                          {risk.probability} Probability
                        </Badge>
                        <Badge variant={risk.status === 'Open' ? 'destructive' : 'default'}>
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Mitigation Strategy</Label>
                      <p className="text-sm text-muted-foreground mt-1">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Project Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Project Start</Label>
                    <p className="text-lg font-semibold">{currentSite.startDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Target Completion</Label>
                    <p className="text-lg font-semibold">{currentSite.targetDate}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Key Milestones</h4>
                  {currentSite.deploymentChecklist.map((category, index) => {
                    const isCompleted = category.tasks.every(task => task.status === 'completed')
                    const isInProgress = category.tasks.some(task => task.status === 'in-progress')
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          isCompleted ? 'bg-green-500' : 
                          isInProgress ? 'bg-blue-500' : 
                          'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{category.category}</p>
                          <p className="text-sm text-muted-foreground">
                            {category.tasks.filter(task => task.status === 'completed').length}/{category.tasks.length} tasks completed
                          </p>
                        </div>
                        <Badge className={
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isInProgress ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {isCompleted ? 'Complete' : isInProgress ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...props}>
      {children}
    </label>
  )
}
