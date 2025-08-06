'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, CheckCircle, Clock, AlertTriangle, Network, Shield, Settings, Users, Wifi, Server, Database, Key, Monitor } from 'lucide-react'

interface ChecklistItem {
  id: string
  category: string
  task: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  assignee: string
  dueDate: string
  notes?: string
}

interface SiteDetails {
  id: string
  name: string
  status: string
  progress: number
  phase: number
  users: number
  location: string
  projectManager: string
  technicalOwners: string[]
  networkVendors: string[]
  deviceTypes: string[]
  radsecType: string
  plannedStart: string
  plannedEnd: string
}

export default function SiteWorkbook() {
  const [selectedSite, setSelectedSite] = useState<string>('ABM-HQ001')
  const [activeTab, setActiveTab] = useState('overview')

  const siteDetails: SiteDetails = {
    id: 'ABM-HQ001',
    name: 'ABM Global Headquarters',
    status: 'In Progress',
    progress: 65,
    phase: 1,
    users: 2500,
    location: 'New York, USA',
    projectManager: 'Alex Rivera',
    technicalOwners: ['John Smith', 'Mark Wilson'],
    networkVendors: ['Cisco', 'Meraki'],
    deviceTypes: ['Windows', 'macOS', 'iOS', 'Android'],
    radsecType: 'Native',
    plannedStart: '2025-08-01',
    plannedEnd: '2025-08-15'
  }

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      category: 'Planning',
      task: 'Site Survey Completed',
      description: 'Complete physical and network infrastructure assessment',
      status: 'completed',
      assignee: 'John Smith',
      dueDate: '2025-08-02',
      notes: 'Survey completed on schedule. No major infrastructure changes needed.'
    },
    {
      id: '2',
      category: 'Planning',
      task: 'Network Documentation Review',
      description: 'Review existing network diagrams and configurations',
      status: 'completed',
      assignee: 'Mark Wilson',
      dueDate: '2025-08-03'
    },
    {
      id: '3',
      category: 'Infrastructure',
      task: 'RADSec Proxy Deployment',
      description: 'Deploy and configure RADSec proxy containers',
      status: 'in-progress',
      assignee: 'John Smith',
      dueDate: '2025-08-08',
      notes: 'Primary proxy deployed. Working on standby configuration.'
    },
    {
      id: '4',
      category: 'Infrastructure',
      task: 'Load Balancer Configuration',
      description: 'Configure load balancer for RADSec proxy high availability',
      status: 'in-progress',
      assignee: 'Mark Wilson',
      dueDate: '2025-08-09'
    },
    {
      id: '5',
      category: 'Certificates',
      task: 'PKI Integration Setup',
      description: 'Configure Portnox PKI integration with certificate templates',
      status: 'pending',
      assignee: 'John Smith',
      dueDate: '2025-08-10'
    },
    {
      id: '6',
      category: 'Certificates',
      task: 'SCEP Profile Configuration',
      description: 'Create and deploy SCEP profiles for device certificate enrollment',
      status: 'pending',
      assignee: 'Mark Wilson',
      dueDate: '2025-08-11'
    },
    {
      id: '7',
      category: 'Network',
      task: 'Switch Configuration',
      description: 'Configure 802.1X authentication on network switches',
      status: 'pending',
      assignee: 'John Smith',
      dueDate: '2025-08-12'
    },
    {
      id: '8',
      category: 'Network',
      task: 'Wireless Controller Setup',
      description: 'Configure wireless controllers for certificate-based authentication',
      status: 'pending',
      assignee: 'Mark Wilson',
      dueDate: '2025-08-13'
    },
    {
      id: '9',
      category: 'Testing',
      task: 'Authentication Testing',
      description: 'Test end-to-end authentication flow with sample devices',
      status: 'pending',
      assignee: 'John Smith',
      dueDate: '2025-08-14'
    },
    {
      id: '10',
      category: 'Deployment',
      task: 'Production Rollout',
      description: 'Enable NAC for all users and devices',
      status: 'pending',
      assignee: 'Mark Wilson',
      dueDate: '2025-08-15'
    }
  ])

  const updateChecklistItem = (id: string, field: string, value: any) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />
      case 'blocked':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Planning': return <FileText className="h-4 w-4" />
      case 'Infrastructure': return <Server className="h-4 w-4" />
      case 'Certificates': return <Key className="h-4 w-4" />
      case 'Network': return <Network className="h-4 w-4" />
      case 'Testing': return <Monitor className="h-4 w-4" />
      case 'Deployment': return <Settings className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const completedTasks = checklist.filter(item => item.status === 'completed').length
  const totalTasks = checklist.length
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100)

  const categories = [...new Set(checklist.map(item => item.category))]

  return (
    <div className="space-y-6">
      {/* Site Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">{siteDetails.name}</h1>
                <p className="text-muted-foreground">{siteDetails.id} - {siteDetails.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={
                siteDetails.status === 'Complete' ? 'bg-green-100 text-green-800' :
                siteDetails.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                siteDetails.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {siteDetails.status}
              </Badge>
              <Badge variant="outline">Phase {siteDetails.phase}</Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Users</p>
                <p className="font-semibold">{siteDetails.users.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">RADSec Type</p>
                <p className="font-semibold">{siteDetails.radsecType}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Network className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Network Vendors</p>
                <p className="font-semibold">{siteDetails.networkVendors.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="flex items-center space-x-2">
                  <Progress value={siteDetails.progress} className="w-16 h-2" />
                  <span className="font-semibold">{siteDetails.progress}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workbook Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Project Manager</Label>
                    <p className="font-medium">{siteDetails.projectManager}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Technical Owners</Label>
                    <p className="font-medium">{siteDetails.technicalOwners.join(', ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Planned Start</Label>
                    <p className="font-medium">{new Date(siteDetails.plannedStart).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Planned End</Label>
                    <p className="font-medium">{new Date(siteDetails.plannedEnd).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Progress Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm font-bold">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-medium text-green-600">{completedTasks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">In Progress:</span>
                      <span className="font-medium text-blue-600">
                        {checklist.filter(item => item.status === 'in-progress').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending:</span>
                      <span className="font-medium text-gray-600">
                        {checklist.filter(item => item.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Blocked:</span>
                      <span className="font-medium text-red-600">
                        {checklist.filter(item => item.status === 'blocked').length}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map(category => {
                  const categoryTasks = checklist.filter(item => item.category === category)
                  const categoryCompleted = categoryTasks.filter(item => item.status === 'completed').length
                  const categoryProgress = Math.round((categoryCompleted / categoryTasks.length) * 100)
                  
                  return (
                    <div key={category} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-2 mb-3">
                        {getCategoryIcon(category)}
                        <h4 className="font-medium">{category}</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{categoryProgress}%</span>
                        </div>
                        <Progress value={categoryProgress} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          {categoryCompleted} of {categoryTasks.length} tasks completed
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Implementation Checklist</span>
                <Badge variant="outline">
                  {completedTasks} of {totalTasks} completed
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map(category => (
                  <div key={category}>
                    <h4 className="font-semibold text-lg mb-3 flex items-center space-x-2">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </h4>
                    <div className="space-y-3 ml-6">
                      {checklist
                        .filter(item => item.category === category)
                        .map(item => (
                          <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="flex-shrink-0 mt-1">
                              {getStatusIcon(item.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium">{item.task}</h5>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getStatusColor(item.status)}>
                                    {item.status.replace('-', ' ')}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Due: {new Date(item.dueDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {item.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">
                                  Assigned to: {item.assignee}
                                </span>
                                <Select
                                  value={item.status}
                                  onValueChange={(value) => updateChecklistItem(item.id, 'status', value)}
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              {item.notes && (
                                <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                  <strong>Notes:</strong> {item.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">RADIUS Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="primary-radius">Primary RADIUS Server</Label>
                      <Input id="primary-radius" value="radius1.portnox.cloud" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="secondary-radius">Secondary RADIUS Server</Label>
                      <Input id="secondary-radius" value="radius2.portnox.cloud" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="shared-secret">Shared Secret</Label>
                      <Input id="shared-secret" type="password" value="••••••••••••" readOnly />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">VLAN Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="corporate-vlan">Corporate VLAN</Label>
                      <Input id="corporate-vlan" value="100" />
                    </div>
                    <div>
                      <Label htmlFor="guest-vlan">Guest VLAN</Label>
                      <Input id="guest-vlan" value="200" />
                    </div>
                    <div>
                      <Label htmlFor="iot-vlan">IoT VLAN</Label>
                      <Input id="iot-vlan" value="300" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificate Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ca-url">Certificate Authority URL</Label>
                    <Input id="ca-url" value="https://pki.portnox.cloud" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="scep-url">SCEP Enrollment URL</Label>
                    <Input id="scep-url" value="https://scep.portnox.cloud" readOnly />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="ocsp-url">OCSP Responder URL</Label>
                    <Input id="ocsp-url" value="https://ocsp.portnox.cloud" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="cert-validity">Certificate Validity Period</Label>
                    <Select defaultValue="1year">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6months">6 Months</SelectItem>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="2years">2 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Plan Execution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Authentication Tests</h4>
                    <div className="space-y-3">
                      {[
                        'Windows Domain Authentication',
                        'macOS Certificate Authentication',
                        'iOS Device Authentication',
                        'Android Device Authentication',
                        'Guest Portal Access',
                        'IoT Device Registration'
                      ].map((test, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Checkbox id={`test-${index}`} />
                          <Label htmlFor={`test-${index}`} className="text-sm">
                            {test}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Network Tests</h4>
                    <div className="space-y-3">
                      {[
                        'VLAN Assignment Verification',
                        'Policy Enforcement Testing',
                        'Failover Testing',
                        'Performance Testing',
                        'Security Posture Validation',
                        'Compliance Verification'
                      ].map((test, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <Checkbox id={`network-test-${index}`} />
                          <Label htmlFor={`network-test-${index}`} className="text-sm">
                            {test}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="test-notes">Test Results & Notes</Label>
                  <Textarea
                    id="test-notes"
                    placeholder="Document test results, issues encountered, and resolutions..."
                    className="mt-2"
                    rows={6}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Required Documents</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'Network Architecture Diagram', status: 'completed' },
                        { name: 'RADIUS Configuration Guide', status: 'completed' },
                        { name: 'Certificate Deployment Guide', status: 'in-progress' },
                        { name: 'User Onboarding Procedures', status: 'pending' },
                        { name: 'Troubleshooting Runbook', status: 'pending' },
                        { name: 'Security Assessment Report', status: 'pending' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">{doc.name}</span>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Deliverables</h4>
                    <div className="space-y-3">
                      {[
                        { name: 'As-Built Documentation', status: 'in-progress' },
                        { name: 'Handover Package', status: 'pending' },
                        { name: 'Training Materials', status: 'pending' },
                        { name: 'Support Contacts List', status: 'completed' },
                        { name: 'Warranty Information', status: 'completed' },
                        { name: 'Change Management Process', status: 'pending' }
                      ].map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <span className="text-sm">{doc.name}</span>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="project-notes">Project Notes & Lessons Learned</Label>
                  <Textarea
                    id="project-notes"
                    placeholder="Document key decisions, challenges overcome, and recommendations for future deployments..."
                    className="mt-2"
                    rows={8}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
