'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertTriangle, Users, Network, Shield, Calendar, TrendingUp } from 'lucide-react'

interface ProjectPhase {
  id: string
  name: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  progress: number
  startDate: string
  endDate: string
  tasks: number
  completedTasks: number
}

export default function ProgressTracking() {
  const [phases] = useState<ProjectPhase[]>([
    {
      id: '1',
      name: 'Initial Assessment',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      tasks: 8,
      completedTasks: 8
    },
    {
      id: '2',
      name: 'Portnox Cloud Setup',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-16',
      endDate: '2024-01-30',
      tasks: 12,
      completedTasks: 12
    },
    {
      id: '3',
      name: 'Identity Integration',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      tasks: 10,
      completedTasks: 6
    },
    {
      id: '4',
      name: 'Network Configuration',
      status: 'pending',
      progress: 0,
      startDate: '2024-02-16',
      endDate: '2024-03-01',
      tasks: 15,
      completedTasks: 0
    },
    {
      id: '5',
      name: 'Pilot Deployment',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-02',
      endDate: '2024-03-16',
      tasks: 20,
      completedTasks: 0
    },
    {
      id: '6',
      name: 'Production Rollout',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-17',
      endDate: '2024-04-01',
      tasks: 25,
      completedTasks: 0
    }
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      'in-progress': 'secondary',
      pending: 'outline',
      blocked: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ').toUpperCase()}
      </Badge>
    )
  }

  const overallProgress = Math.round(
    phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length
  )

  const completedPhases = phases.filter(p => p.status === 'completed').length
  const totalTasks = phases.reduce((sum, phase) => sum + phase.tasks, 0)
  const completedTasks = phases.reduce((sum, phase) => sum + phase.completedTasks, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Rollout Progress</h2>
        <p className="text-muted-foreground">Track deployment progress across all phases</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Phases</p>
                <p className="text-2xl font-bold">{completedPhases}/{phases.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tasks Completed</p>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Phase</p>
                <p className="text-lg font-bold">Identity Integration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative">
                {index < phases.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                )}
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    {getStatusIcon(phase.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{phase.name}</h3>
                      {getStatusBadge(phase.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{phase.startDate} - {phase.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tasks</p>
                        <p className="font-medium">{phase.completedTasks}/{phase.tasks} completed</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="font-medium">{phase.progress}%</p>
                      </div>
                    </div>
                    
                    <Progress value={phase.progress} className="w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="risks">Risks & Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phase Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{completedPhases} phases</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">1 phase</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending</span>
                    <span className="text-sm font-medium">{phases.length - completedPhases - 1} phases</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Cloud Infrastructure Setup</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Initial Assessment Complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Identity Integration (65%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Network Configuration</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold">Team Members</h3>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Active contributors</p>
                </div>
                <div className="text-center">
                  <Network className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold">Sites</h3>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-muted-foreground">Deployment locations</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold">Devices</h3>
                  <p className="text-2xl font-bold">524</p>
                  <p className="text-sm text-muted-foreground">To be configured</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Network Vendor Compatibility</h4>
                    <p className="text-sm text-muted-foreground">
                      Some legacy network equipment may require firmware updates
                    </p>
                    <Badge variant="secondary" className="mt-2">Medium Risk</Badge>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Certificate Deployment</h4>
                    <p className="text-sm text-muted-foreground">
                      PKI infrastructure is ready and tested
                    </p>
                    <Badge variant="outline" className="mt-2">Low Risk</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
