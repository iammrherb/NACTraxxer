'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart3, Calendar, CheckCircle, Clock, AlertTriangle, Users, Building, Network, Download, Filter } from 'lucide-react'

interface Site {
  id: string
  name: string
  location: string
  status: 'not-started' | 'planning' | 'in-progress' | 'testing' | 'completed' | 'delayed'
  progress: number
  startDate: string
  targetDate: string
  actualDate?: string
  team: string[]
  issues: number
}

const mockSites: Site[] = [
  {
    id: '1',
    name: 'ABM Corporate HQ',
    location: 'New York, NY',
    status: 'completed',
    progress: 100,
    startDate: '2024-01-15',
    targetDate: '2024-02-15',
    actualDate: '2024-02-10',
    team: ['John Smith', 'Sarah Johnson'],
    issues: 0
  },
  {
    id: '2',
    name: 'ABM West Coast Office',
    location: 'San Francisco, CA',
    status: 'in-progress',
    progress: 75,
    startDate: '2024-02-01',
    targetDate: '2024-03-01',
    team: ['Mike Chen', 'Lisa Rodriguez'],
    issues: 2
  },
  {
    id: '3',
    name: 'ABM Manufacturing Plant',
    location: 'Detroit, MI',
    status: 'testing',
    progress: 90,
    startDate: '2024-02-15',
    targetDate: '2024-03-15',
    team: ['David Wilson', 'Emma Davis'],
    issues: 1
  },
  {
    id: '4',
    name: 'ABM Distribution Center',
    location: 'Chicago, IL',
    status: 'planning',
    progress: 25,
    startDate: '2024-03-01',
    targetDate: '2024-04-01',
    team: ['Alex Thompson'],
    issues: 0
  },
  {
    id: '5',
    name: 'ABM Regional Office',
    location: 'Atlanta, GA',
    status: 'delayed',
    progress: 40,
    startDate: '2024-01-20',
    targetDate: '2024-02-20',
    team: ['Maria Garcia', 'Tom Anderson'],
    issues: 5
  }
]

const getStatusColor = (status: Site['status']) => {
  switch (status) {
    case 'completed': return 'bg-green-500'
    case 'in-progress': return 'bg-blue-500'
    case 'testing': return 'bg-yellow-500'
    case 'planning': return 'bg-purple-500'
    case 'delayed': return 'bg-red-500'
    default: return 'bg-gray-500'
  }
}

const getStatusIcon = (status: Site['status']) => {
  switch (status) {
    case 'completed': return <CheckCircle className="h-4 w-4" />
    case 'in-progress': return <Clock className="h-4 w-4" />
    case 'testing': return <BarChart3 className="h-4 w-4" />
    case 'planning': return <Calendar className="h-4 w-4" />
    case 'delayed': return <AlertTriangle className="h-4 w-4" />
    default: return <Clock className="h-4 w-4" />
  }
}

export default function ProgressTracking() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [activeTab, setActiveTab] = useState('overview')

  const filteredSites = selectedStatus === 'all' 
    ? mockSites 
    : mockSites.filter(site => site.status === selectedStatus)

  const overallProgress = Math.round(
    mockSites.reduce((sum, site) => sum + site.progress, 0) / mockSites.length
  )

  const statusCounts = {
    completed: mockSites.filter(s => s.status === 'completed').length,
    'in-progress': mockSites.filter(s => s.status === 'in-progress').length,
    testing: mockSites.filter(s => s.status === 'testing').length,
    planning: mockSites.filter(s => s.status === 'planning').length,
    delayed: mockSites.filter(s => s.status === 'delayed').length,
    'not-started': mockSites.filter(s => s.status === 'not-started').length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rollout Progress</h2>
          <p className="text-gray-600">Track Zero Trust NAC deployment across all sites</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Sites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{mockSites.length}</div>
            <p className="text-sm text-gray-600 mt-1">Sites in deployment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
            <p className="text-sm text-gray-600 mt-1">Sites completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockSites.reduce((sum, site) => sum + site.issues, 0)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Active issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Site Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Current status of all deployment sites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className={`w-12 h-12 rounded-full ${getStatusColor(status as Site['status'])} mx-auto mb-2 flex items-center justify-center text-white`}>
                      {getStatusIcon(status as Site['status'])}
                    </div>
                    <div className="text-lg font-semibold">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{status.replace('-', ' ')}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress by Site */}
          <Card>
            <CardHeader>
              <CardTitle>Progress by Site</CardTitle>
              <CardDescription>Individual site deployment progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSites.map((site) => (
                  <div key={site.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(site.status)}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{site.name}</h4>
                        <Badge variant="outline" className="capitalize">
                          {site.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{site.location}</span>
                        <span>{site.progress}%</span>
                      </div>
                      <Progress value={site.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Timeline</CardTitle>
              <CardDescription>Planned vs actual deployment dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSites.map((site, index) => (
                  <div key={site.id} className="relative">
                    {index !== mockSites.length - 1 && (
                      <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                    )}
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(site.status)} flex items-center justify-center text-white flex-shrink-0`}>
                        {getStatusIcon(site.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{site.name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {site.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Started: {new Date(site.startDate).toLocaleDateString()}</div>
                          <div>Target: {new Date(site.targetDate).toLocaleDateString()}</div>
                          {site.actualDate && (
                            <div>Completed: {new Date(site.actualDate).toLocaleDateString()}</div>
                          )}
                        </div>
                        <div className="mt-2">
                          <Progress value={site.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Details</CardTitle>
              <CardDescription>Detailed information for each deployment site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockSites.map((site) => (
                  <div key={site.id} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{site.name}</h3>
                        <p className="text-gray-600">{site.location}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {site.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600">Progress</div>
                        <div className="text-lg font-semibold">{site.progress}%</div>
                        <Progress value={site.progress} className="mt-1 h-2" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Team Size</div>
                        <div className="text-lg font-semibold flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {site.team.length}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-600">Issues</div>
                        <div className="text-lg font-semibold flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {site.issues}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600">Team Members</div>
                      <div className="flex flex-wrap gap-2">
                        {site.team.map((member, index) => (
                          <Badge key={index} variant="secondary">{member}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
