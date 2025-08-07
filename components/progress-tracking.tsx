'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, XCircle, Calendar, Users, Network, Building, Download, Filter } from 'lucide-react'

interface ProgressData {
  totalSites: number
  completedSites: number
  inProgressSites: number
  planningSites: number
  onHoldSites: number
  totalDevices: number
  deployedDevices: number
  totalUsers: number
  onboardedUsers: number
  overallProgress: number
}

interface SiteProgress {
  id: string
  name: string
  location: string
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  progress: number
  startDate: string
  targetDate: string
  actualDate?: string
  devices: number
  users: number
  issues: number
  milestones: {
    name: string
    status: 'completed' | 'in-progress' | 'pending'
    date: string
  }[]
}

export default function ProgressTracking() {
  const [timeRange, setTimeRange] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const progressData: ProgressData = {
    totalSites: 12,
    completedSites: 3,
    inProgressSites: 5,
    planningSites: 3,
    onHoldSites: 1,
    totalDevices: 2450,
    deployedDevices: 1680,
    totalUsers: 1200,
    onboardedUsers: 850,
    overallProgress: 68
  }

  const siteProgress: SiteProgress[] = [
    {
      id: '1',
      name: 'Corporate Headquarters',
      location: 'New York, NY',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      targetDate: '2024-01-15',
      actualDate: '2024-01-14',
      devices: 450,
      users: 200,
      issues: 0,
      milestones: [
        { name: 'Infrastructure Assessment', status: 'completed', date: '2024-01-03' },
        { name: 'Hardware Installation', status: 'completed', date: '2024-01-08' },
        { name: 'Configuration & Testing', status: 'completed', date: '2024-01-12' },
        { name: 'User Training', status: 'completed', date: '2024-01-14' },
        { name: 'Go-Live', status: 'completed', date: '2024-01-15' }
      ]
    },
    {
      id: '2',
      name: 'West Coast Branch',
      location: 'San Francisco, CA',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-02-01',
      targetDate: '2024-02-28',
      devices: 180,
      users: 85,
      issues: 2,
      milestones: [
        { name: 'Infrastructure Assessment', status: 'completed', date: '2024-02-03' },
        { name: 'Hardware Installation', status: 'completed', date: '2024-02-10' },
        { name: 'Configuration & Testing', status: 'in-progress', date: '2024-02-20' },
        { name: 'User Training', status: 'pending', date: '2024-02-25' },
        { name: 'Go-Live', status: 'pending', date: '2024-02-28' }
      ]
    },
    {
      id: '3',
      name: 'Manufacturing Plant A',
      location: 'Detroit, MI',
      status: 'planning',
      progress: 25,
      startDate: '2024-03-01',
      targetDate: '2024-03-15',
      devices: 320,
      users: 150,
      issues: 1,
      milestones: [
        { name: 'Infrastructure Assessment', status: 'in-progress', date: '2024-03-05' },
        { name: 'Hardware Installation', status: 'pending', date: '2024-03-08' },
        { name: 'Configuration & Testing', status: 'pending', date: '2024-03-12' },
        { name: 'User Training', status: 'pending', date: '2024-03-14' },
        { name: 'Go-Live', status: 'pending', date: '2024-03-15' }
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'planning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'on-hold':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-600" />
      case 'in-progress':
        return <Clock className="h-3 w-3 text-blue-600" />
      case 'pending':
        return <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
      default:
        return null
    }
  }

  const handleExportReport = () => {
    console.log('Exporting progress report...')
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sites</p>
                <p className="text-2xl font-bold">{progressData.totalSites}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4 flex space-x-2">
              <Badge variant="outline" className="text-green-600">
                {progressData.completedSites} Complete
              </Badge>
              <Badge variant="outline" className="text-blue-600">
                {progressData.inProgressSites} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Device Deployment</p>
                <p className="text-2xl font-bold">
                  {progressData.deployedDevices}/{progressData.totalDevices}
                </p>
              </div>
              <Network className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Progress value={(progressData.deployedDevices / progressData.totalDevices) * 100} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                {Math.round((progressData.deployedDevices / progressData.totalDevices) * 100)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">User Onboarding</p>
                <p className="text-2xl font-bold">
                  {progressData.onboardedUsers}/{progressData.totalUsers}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <Progress value={(progressData.onboardedUsers / progressData.totalUsers) * 100} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                {Math.round((progressData.onboardedUsers / progressData.totalUsers) * 100)}% Complete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{progressData.overallProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <Progress value={progressData.overallProgress} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">On Track</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Tracking Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Site Deployment Progress</span>
              </CardTitle>
              <CardDescription>
                Track the progress of NAC deployment across all sites
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {siteProgress.map((site) => (
              <div key={site.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(site.status)}
                    <div>
                      <h3 className="font-semibold">{site.name}</h3>
                      <p className="text-sm text-gray-600">{site.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-2xl font-bold">{site.progress}%</span>
                      <Badge variant={site.status === 'completed' ? 'default' : site.status === 'in-progress' ? 'secondary' : 'outline'}>
                        {site.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Target: {new Date(site.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <Progress value={site.progress} className="h-3" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Network className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{site.devices} Devices</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{site.users} Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{site.issues} Issues</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Milestones</h4>
                  <div className="space-y-2">
                    {site.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        {getMilestoneIcon(milestone.status)}
                        <span className={`text-sm ${milestone.status === 'completed' ? 'text-green-600' : milestone.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'}`}>
                          {milestone.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          {new Date(milestone.date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
