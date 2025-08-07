'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Book, MapPin, Network, Users, Shield, Settings, Download, Edit, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface SiteWorkbookProps {
  siteId: string | null
}

interface SiteDetails {
  id: string
  name: string
  location: string
  region: string
  status: 'active' | 'inactive' | 'planning' | 'deployment'
  devices: number
  users: number
  nacDeployed: boolean
  compliance: number
  lastUpdate: string
  networkInfo: {
    subnets: string[]
    vlans: number[]
    switches: number
    accessPoints: number
    firewalls: number
  }
  deploymentInfo: {
    phase: string
    progress: number
    startDate: string
    estimatedCompletion: string
    assignedEngineer: string
    issues: Issue[]
  }
  policies: {
    userPolicies: number
    devicePolicies: number
    networkPolicies: number
    lastPolicyUpdate: string
  }
  certificates: {
    issued: number
    active: number
    expiring: number
    revoked: number
  }
}

interface Issue {
  id: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in-progress' | 'resolved'
  createdDate: string
  assignee: string
}

export default function SiteWorkbook({ siteId }: SiteWorkbookProps) {
  const [siteDetails, setSiteDetails] = useState<SiteDetails | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock site data - in real implementation, this would fetch from API
  const mockSiteData: { [key: string]: SiteDetails } = {
    '1': {
      id: '1',
      name: 'ABM Corporate HQ',
      location: 'New York, NY',
      region: 'North America',
      status: 'active',
      devices: 1250,
      users: 850,
      nacDeployed: true,
      compliance: 98,
      lastUpdate: '2024-01-20T10:30:00Z',
      networkInfo: {
        subnets: ['10.1.0.0/24', '10.1.1.0/24', '10.1.2.0/24', '10.1.10.0/24'],
        vlans: [100, 101, 102, 200, 300],
        switches: 24,
        accessPoints: 45,
        firewalls: 2
      },
      deploymentInfo: {
        phase: 'Optimization',
        progress: 95,
        startDate: '2024-01-01',
        estimatedCompletion: '2024-01-31',
        assignedEngineer: 'John Smith',
        issues: [
          {
            id: '1',
            title: 'Certificate Renewal Required',
            description: '15 device certificates expiring within 30 days',
            severity: 'medium',
            status: 'in-progress',
            createdDate: '2024-01-18',
            assignee: 'John Smith'
          }
        ]
      },
      policies: {
        userPolicies: 12,
        devicePolicies: 8,
        networkPolicies: 6,
        lastPolicyUpdate: '2024-01-19T14:20:00Z'
      },
      certificates: {
        issued: 1250,
        active: 1235,
        expiring: 15,
        revoked: 0
      }
    },
    '2': {
      id: '2',
      name: 'ABM West Coast Office',
      location: 'San Francisco, CA',
      region: 'North America',
      status: 'active',
      devices: 890,
      users: 620,
      nacDeployed: true,
      compliance: 95,
      lastUpdate: '2024-01-19T15:45:00Z',
      networkInfo: {
        subnets: ['10.2.0.0/24', '10.2.1.0/24', '10.2.10.0/24'],
        vlans: [100, 101, 200, 300],
        switches: 18,
        accessPoints: 32,
        firewalls: 2
      },
      deploymentInfo: {
        phase: 'Production',
        progress: 100,
        startDate: '2024-01-05',
        estimatedCompletion: '2024-01-25',
        assignedEngineer: 'Sarah Johnson',
        issues: []
      },
      policies: {
        userPolicies: 10,
        devicePolicies: 7,
        networkPolicies: 5,
        lastPolicyUpdate: '2024-01-18T09:30:00Z'
      },
      certificates: {
        issued: 890,
        active: 890,
        expiring: 8,
        revoked: 0
      }
    }
  }

  useEffect(() => {
    if (siteId) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setSiteDetails(mockSiteData[siteId] || null)
        setLoading(false)
      }, 500)
    } else {
      setSiteDetails(null)
    }
  }, [siteId])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'inactive': return 'bg-gray-500'
      case 'planning': return 'bg-blue-500'
      case 'deployment': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getIssueStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'open': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  const exportWorkbook = () => {
    if (!siteDetails) return

    const exportData = {
      site: siteDetails,
      exportedAt: new Date().toISOString(),
      exportedBy: 'Current User'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${siteDetails.name.replace(/\s+/g, '-').toLowerCase()}-workbook-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[#00c8d7] mx-auto mb-4" />
          <p className="text-gray-600">Loading site workbook...</p>
        </div>
      </div>
    )
  }

  if (!siteId || !siteDetails) {
    return (
      <Card className="shadow-xl">
        <CardContent className="text-center py-12">
          <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Site Selected</h3>
          <p className="text-gray-500 mb-4">
            Select a site from the Master Site List to view its detailed workbook
          </p>
          <Button 
            variant="outline"
            className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
          >
            Go to Site List
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-[#00c8d7] rounded-lg">
                <Book className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-[#00c8d7] to-[#007acc] bg-clip-text text-transparent">
                  {siteDetails.name}
                </CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{siteDetails.location}</span>
                  </div>
                  <Badge variant="outline" className={`${getStatusColor(siteDetails.status)} text-white`}>
                    {siteDetails.status.charAt(0).toUpperCase() + siteDetails.status.slice(1)}
                  </Badge>
                  <Badge variant={siteDetails.nacDeployed ? 'default' : 'secondary'}>
                    NAC {siteDetails.nacDeployed ? 'Deployed' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportWorkbook}
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#00c8d7]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-3xl font-bold text-[#00c8d7]">{siteDetails.compliance}%</p>
              </div>
              <div className="p-3 bg-[#00c8d7]/10 rounded-full">
                <Shield className="w-6 h-6 text-[#00c8d7]" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={siteDetails.compliance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                <p className="text-3xl font-bold text-blue-600">{siteDetails.devices.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Network className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{siteDetails.users.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Issues</p>
                <p className="text-3xl font-bold text-purple-600">{siteDetails.deploymentInfo.issues.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="network" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Network
          </TabsTrigger>
          <TabsTrigger 
            value="deployment" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Deployment
          </TabsTrigger>
          <TabsTrigger 
            value="policies" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Policies
          </TabsTrigger>
          <TabsTrigger 
            value="certificates" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Site ID</p>
                    <p className="font-semibold">{siteDetails.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Region</p>
                    <p className="font-semibold">{siteDetails.region}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge variant="outline" className={`${getStatusColor(siteDetails.status)} text-white`}>
                      {siteDetails.status.charAt(0).toUpperCase() + siteDetails.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Update</p>
                    <p className="font-semibold">{new Date(siteDetails.lastUpdate).toLocaleDateString()}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">NAC Deployment Status</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={siteDetails.nacDeployed ? 'default' : 'secondary'}>
                      {siteDetails.nacDeployed ? 'Deployed' : 'Pending'}
                    </Badge>
                    {siteDetails.nacDeployed && (
                      <span className="text-sm text-green-600">✓ Fully operational</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {siteDetails.deploymentInfo.issues.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-semibold">No open issues</p>
                    <p className="text-gray-500 text-sm">All systems operating normally</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {siteDetails.deploymentInfo.issues.map((issue) => (
                      <div key={issue.id} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getIssueStatusIcon(issue.status)}
                            <h4 className="font-semibold text-sm">{issue.title}</h4>
                          </div>
                          <Badge variant="outline" className={`${getSeverityColor(issue.severity)} text-white text-xs`}>
                            {issue.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{issue.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Assigned to: {issue.assignee}</span>
                          <span>Created: {new Date(issue.createdDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{siteDetails.networkInfo.switches}</p>
                    <p className="text-sm text-gray-600">Switches</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{siteDetails.networkInfo.accessPoints}</p>
                    <p className="text-sm text-gray-600">Access Points</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{siteDetails.networkInfo.firewalls}</p>
                    <p className="text-sm text-gray-600">Firewalls</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{siteDetails.networkInfo.vlans.length}</p>
                    <p className="text-sm text-gray-600">VLANs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Network Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Subnets</p>
                  <div className="flex flex-wrap gap-2">
                    {siteDetails.networkInfo.subnets.map((subnet, index) => (
                      <Badge key={index} variant="outline">{subnet}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">VLANs</p>
                  <div className="flex flex-wrap gap-2">
                    {siteDetails.networkInfo.vlans.map((vlan, index) => (
                      <Badge key={index} variant="secondary">VLAN {vlan}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Current Phase</p>
                  <p className="text-2xl font-bold text-[#00c8d7]">{siteDetails.deploymentInfo.phase}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Progress</p>
                  <p className="text-2xl font-bold text-[#00c8d7]">{siteDetails.deploymentInfo.progress}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">Assigned Engineer</p>
                  <p className="text-lg font-semibold">{siteDetails.deploymentInfo.assignedEngineer}</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Deployment Progress</span>
                  <span className="text-sm text-gray-600">{siteDetails.deploymentInfo.progress}%</span>
                </div>
                <Progress value={siteDetails.deploymentInfo.progress} className="h-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="font-semibold">{new Date(siteDetails.deploymentInfo.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Estimated Completion</p>
                  <p className="font-semibold">{new Date(siteDetails.deploymentInfo.estimatedCompletion).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Policy Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{siteDetails.policies.userPolicies}</p>
                    <p className="text-sm text-gray-600">User Policies</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{siteDetails.policies.devicePolicies}</p>
                    <p className="text-sm text-gray-600">Device Policies</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{siteDetails.policies.networkPolicies}</p>
                    <p className="text-sm text-gray-600">Network Policies</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Policy Update</p>
                  <p className="font-semibold">{new Date(siteDetails.policies.lastPolicyUpdate).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#00c8d7] hover:bg-[#0099cc]">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Policies
                </Button>
                <Button variant="outline" className="w-full border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Policies
                </Button>
                <Button variant="outline" className="w-full border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Policies
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{siteDetails.certificates.active}</p>
                    <p className="text-sm text-gray-600">Active</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{siteDetails.certificates.expiring}</p>
                    <p className="text-sm text-gray-600">Expiring Soon</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{siteDetails.certificates.issued}</p>
                    <p className="text-sm text-gray-600">Total Issued</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{siteDetails.certificates.revoked}</p>
                    <p className="text-sm text-gray-600">Revoked</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Certificate Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#00c8d7] hover:bg-[#0099cc]">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Certificates
                </Button>
                <Button variant="outline" className="w-full border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renew Expiring
                </Button>
                <Button variant="outline" className="w-full border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                {siteDetails.certificates.expiring > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-800">
                        {siteDetails.certificates.expiring} certificates expiring within 30 days
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
