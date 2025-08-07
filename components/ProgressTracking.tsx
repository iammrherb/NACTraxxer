'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertCircle, XCircle, Calendar, Download, RefreshCw } from 'lucide-react'

interface DeploymentPhase {
  id: string
  name: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  progress: number
  startDate: string
  endDate?: string
  estimatedCompletion: string
  sites: number
  completedSites: number
}

interface Milestone {
  id: string
  title: string
  description: string
  dueDate: string
  status: 'completed' | 'on-track' | 'at-risk' | 'overdue'
  progress: number
  dependencies: string[]
}

export default function ProgressTracking() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')

  const deploymentPhases: DeploymentPhase[] = [
    {
      id: '1',
      name: 'Planning & Assessment',
      description: 'Site surveys, network assessment, and deployment planning',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-01-15',
      estimatedCompletion: '2024-01-15',
      sites: 5,
      completedSites: 5
    },
    {
      id: '2',
      name: 'Infrastructure Preparation',
      description: 'Network infrastructure updates and certificate deployment',
      status: 'completed',
      progress: 100,
      startDate: '2024-01-16',
      endDate: '2024-02-01',
      estimatedCompletion: '2024-02-01',
      sites: 5,
      completedSites: 5
    },
    {
      id: '3',
      name: 'Pilot Deployment',
      description: 'Initial NAC deployment at pilot sites',
      status: 'completed',
      progress: 100,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      estimatedCompletion: '2024-02-15',
      sites: 2,
      completedSites: 2
    },
    {
      id: '4',
      name: 'Phase 1 Rollout',
      description: 'NAC deployment to primary sites',
      status: 'in-progress',
      progress: 75,
      startDate: '2024-02-15',
      estimatedCompletion: '2024-03-15',
      sites: 3,
      completedSites: 2
    },
    {
      id: '5',
      name: 'Phase 2 Rollout',
      description: 'NAC deployment to remaining sites',
      status: 'pending',
      progress: 0,
      startDate: '2024-03-15',
      estimatedCompletion: '2024-04-30',
      sites: 5,
      completedSites: 0
    },
    {
      id: '6',
      name: 'Optimization & Training',
      description: 'Performance optimization and user training',
      status: 'pending',
      progress: 0,
      startDate: '2024-04-30',
      estimatedCompletion: '2024-05-31',
      sites: 5,
      completedSites: 0
    }
  ]

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Network Assessment Complete',
      description: 'Complete network infrastructure assessment for all sites',
      dueDate: '2024-01-15',
      status: 'completed',
      progress: 100,
      dependencies: []
    },
    {
      id: '2',
      title: 'Certificate Infrastructure Deployed',
      description: 'Deploy PKI infrastructure and device certificates',
      dueDate: '2024-02-01',
      status: 'completed',
      progress: 100,
      dependencies: ['1']
    },
    {
      id: '3',
      title: 'Pilot Sites Operational',
      description: 'Pilot sites fully operational with NAC',
      dueDate: '2024-02-15',
      status: 'completed',
      progress: 100,
      dependencies: ['2']
    },
    {
      id: '4',
      title: 'Primary Sites Deployment',
      description: 'Deploy NAC to all primary business locations',
      dueDate: '2024-03-15',
      status: 'on-track',
      progress: 75,
      dependencies: ['3']
    },
    {
      id: '5',
      title: 'Full Rollout Complete',
      description: 'NAC deployed to all ABM locations',
      dueDate: '2024-04-30',
      status: 'on-track',
      progress: 25,
      dependencies: ['4']
    },
    {
      id: '6',
      title: 'Training & Documentation',
      description: 'Complete user training and documentation',
      dueDate: '2024-05-31',
      status: 'on-track',
      progress: 10,
      dependencies: ['5']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'on-track': return 'bg-green-500'
      case 'at-risk': return 'bg-yellow-500'
      case 'overdue': return 'bg-red-500'
      case 'blocked': return 'bg-red-500'
      case 'pending': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'in-progress': return <Clock className="w-4 h-4" />
      case 'on-track': return <TrendingUp className="w-4 h-4" />
      case 'at-risk': return <AlertCircle className="w-4 h-4" />
      case 'overdue': return <XCircle className="w-4 h-4" />
      case 'blocked': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const overallProgress = Math.round(
    deploymentPhases.reduce((sum, phase) => sum + phase.progress, 0) / deploymentPhases.length
  )

  const completedPhases = deploymentPhases.filter(phase => phase.status === 'completed').length
  const totalSites = deploymentPhases.reduce((sum, phase) => sum + phase.sites, 0)
  const completedSites = deploymentPhases.reduce((sum, phase) => sum + phase.completedSites, 0)

  const exportProgress = () => {
    const exportData = {
      summary: {
        overallProgress,
        completedPhases,
        totalPhases: deploymentPhases.length,
        completedSites,
        totalSites,
        exportedAt: new Date().toISOString()
      },
      phases: deploymentPhases,
      milestones,
      timeline: {
        startDate: deploymentPhases[0].startDate,
        estimatedCompletion: deploymentPhases[deploymentPhases.length - 1].estimatedCompletion
      }
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `abm-nac-progress-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-[#00c8d7] rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <span className="bg-gradient-to-r from-[#00c8d7] to-[#007acc] bg-clip-text text-transparent">
                NAC Rollout Progress
              </span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportProgress}
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-[#00c8d7] text-[#00c8d7] hover:bg-[#00c8d7] hover:text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-[#00c8d7]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-3xl font-bold text-[#00c8d7]">{overallProgress}%</p>
              </div>
              <div className="p-3 bg-[#00c8d7]/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-[#00c8d7]" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Phases</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedPhases}/{deploymentPhases.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sites Deployed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {completedSites}/{totalSites}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Remaining</p>
                <p className="text-3xl font-bold text-purple-600">
                  {Math.ceil((new Date('2024-05-31').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="phases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-2">
          <TabsTrigger 
            value="phases" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Deployment Phases
          </TabsTrigger>
          <TabsTrigger 
            value="milestones" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Key Milestones
          </TabsTrigger>
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-[#00c8d7] data-[state=active]:text-white transition-all duration-300"
          >
            Project Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phases" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Deployment Phases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deploymentPhases.map((phase, index) => (
                  <div key={phase.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#00c8d7] text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{phase.name}</h3>
                          <p className="text-gray-600">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`${getStatusColor(phase.status)} text-white`}>
                          {getStatusIcon(phase.status)}
                          <span className="ml-1 capitalize">{phase.status.replace('-', ' ')}</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Progress</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={phase.progress} className="flex-1 h-2" />
                          <span className="text-sm font-semibold">{phase.progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Sites</p>
                        <p className="text-lg font-semibold">
                          {phase.completedSites}/{phase.sites} completed
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Timeline</p>
                        <p className="text-sm">
                          {new Date(phase.startDate).toLocaleDateString()} - {' '}
                          {phase.endDate 
                            ? new Date(phase.endDate).toLocaleDateString()
                            : new Date(phase.estimatedCompletion).toLocaleDateString()
                          }
                        </p>
                      </div>
                    </div>

                    {phase.status === 'in-progress' && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Current Activity:</strong> Deploying NAC infrastructure to {phase.sites - phase.completedSites} remaining sites. 
                          Expected completion: {new Date(phase.estimatedCompletion).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Key Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{milestone.title}</h3>
                          <Badge variant="outline" className={`${getStatusColor(milestone.status)} text-white`}>
                            {getStatusIcon(milestone.status)}
                            <span className="ml-1 capitalize">{milestone.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#00c8d7]">{milestone.progress}%</p>
                        <Progress value={milestone.progress} className="w-24 h-2 mt-1" />
                      </div>
                    </div>

                    {milestone.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-500 mb-1">Dependencies:</p>
                        <div className="flex flex-wrap gap-1">
                          {milestone.dependencies.map((depId) => {
                            const dep = milestones.find(m => m.id === depId)
                            return dep ? (
                              <Badge key={depId} variant="secondary" className="text-xs">
                                {dep.title}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#00c8d7]"></div>
                
                <div className="space-y-8">
                  {deploymentPhases.map((phase, index) => (
                    <div key={phase.id} className="relative flex items-start space-x-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' :
                        phase.status === 'in-progress' ? 'bg-blue-500' :
                        'bg-gray-300'
                      } text-white font-bold`}>
                        {phase.status === 'completed' ? (
                          <CheckCircle className="w-8 h-8" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Timeline content */}
                      <div className="flex-1 min-w-0 pb-8">
                        <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{phase.name}</h3>
                            <Badge variant="outline" className={`${getStatusColor(phase.status)} text-white`}>
                              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{phase.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Start Date</p>
                              <p>{new Date(phase.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">
                                {phase.endDate ? 'Completed' : 'Est. Completion'}
                              </p>
                              <p>
                                {phase.endDate 
                                  ? new Date(phase.endDate).toLocaleDateString()
                                  : new Date(phase.estimatedCompletion).toLocaleDateString()
                                }
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{phase.progress}%</span>
                            </div>
                            <Progress value={phase.progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
