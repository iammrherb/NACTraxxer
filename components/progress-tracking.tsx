'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Users, Network, Shield, Calendar, Target, Activity } from 'lucide-react'

interface ProgressItem {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending' | 'blocked'
  progress: number
  dueDate: string
  assignee: string
  priority: 'high' | 'medium' | 'low'
}

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'completed' | 'on-track' | 'at-risk' | 'delayed'
  progress: number
  tasks: ProgressItem[]
}

export default function ProgressTracking() {
  const [selectedPhase, setSelectedPhase] = useState('planning')

  const milestones: Milestone[] = [
    {
      id: '1',
      title: 'Project Planning & Assessment',
      description: 'Initial project setup, requirements gathering, and infrastructure assessment',
      targetDate: '2024-02-15',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: '1-1',
          title: 'Stakeholder Alignment',
          description: 'Define project scope, objectives, and success criteria',
          status: 'completed',
          progress: 100,
          dueDate: '2024-01-20',
          assignee: 'Sarah Johnson',
          priority: 'high'
        },
        {
          id: '1-2',
          title: 'Network Infrastructure Assessment',
          description: 'Document current network topology and identify integration points',
          status: 'completed',
          progress: 100,
          dueDate: '2024-02-01',
          assignee: 'Mike Chen',
          priority: 'high'
        },
        {
          id: '1-3',
          title: 'Security Requirements Review',
          description: 'Define security policies and compliance requirements',
          status: 'completed',
          progress: 100,
          dueDate: '2024-02-10',
          assignee: 'Lisa Wang',
          priority: 'medium'
        }
      ]
    },
    {
      id: '2',
      title: 'Portnox Cloud Setup',
      description: 'Configure Portnox Cloud platform and establish connectivity',
      targetDate: '2024-03-15',
      status: 'completed',
      progress: 100,
      tasks: [
        {
          id: '2-1',
          title: 'Cloud Tenant Provisioning',
          description: 'Set up Portnox Cloud tenant and initial configuration',
          status: 'completed',
          progress: 100,
          dueDate: '2024-02-20',
          assignee: 'Tom Rodriguez',
          priority: 'high'
        },
        {
          id: '2-2',
          title: 'RADSec Proxy Deployment',
          description: 'Deploy and configure RADSec proxies for secure RADIUS communication',
          status: 'completed',
          progress: 100,
          dueDate: '2024-03-01',
          assignee: 'Mike Chen',
          priority: 'high'
        },
        {
          id: '2-3',
          title: 'Identity Provider Integration',
          description: 'Configure Azure AD integration for user authentication',
          status: 'completed',
          progress: 100,
          dueDate: '2024-03-10',
          assignee: 'Lisa Wang',
          priority: 'medium'
        }
      ]
    },
    {
      id: '3',
      title: 'Certificate Infrastructure',
      description: 'Deploy PKI infrastructure and certificate management',
      targetDate: '2024-04-15',
      status: 'on-track',
      progress: 85,
      tasks: [
        {
          id: '3-1',
          title: 'PKI Certificate Authority Setup',
          description: 'Configure Portnox private PKI for certificate issuance',
          status: 'completed',
          progress: 100,
          dueDate: '2024-03-20',
          assignee: 'Tom Rodriguez',
          priority: 'high'
        },
        {
          id: '3-2',
          title: 'Intune SCEP Configuration',
          description: 'Configure Microsoft Intune for automated certificate deployment',
          status: 'in-progress',
          progress: 75,
          dueDate: '2024-04-05',
          assignee: 'Sarah Johnson',
          priority: 'high'
        },
        {
          id: '3-3',
          title: 'Certificate Enrollment Testing',
          description: 'Test automated certificate enrollment across device types',
          status: 'pending',
          progress: 0,
          dueDate: '2024-04-12',
          assignee: 'Mike Chen',
          priority: 'medium'
        }
      ]
    },
    {
      id: '4',
      title: 'Network Integration',
      description: 'Configure network infrastructure for 802.1X authentication',
      targetDate: '2024-05-15',
      status: 'in-progress',
      progress: 45,
      tasks: [
        {
          id: '4-1',
          title: 'Switch Configuration',
          description: 'Configure 802.1X on network switches across all sites',
          status: 'in-progress',
          progress: 60,
          dueDate: '2024-04-25',
          assignee: 'Mike Chen',
          priority: 'high'
        },
        {
          id: '4-2',
          title: 'Wireless Controller Setup',
          description: 'Configure wireless controllers for certificate-based authentication',
          status: 'in-progress',
          progress: 40,
          dueDate: '2024-05-05',
          assignee: 'Tom Rodriguez',
          priority: 'high'
        },
        {
          id: '4-3',
          title: 'VLAN Policy Configuration',
          description: 'Define and implement dynamic VLAN assignment policies',
          status: 'pending',
          progress: 0,
          dueDate: '2024-05-10',
          assignee: 'Lisa Wang',
          priority: 'medium'
        }
      ]
    },
    {
      id: '5',
      title: 'Pilot Deployment',
      description: 'Deploy NAC solution to pilot group and validate functionality',
      targetDate: '2024-06-15',
      status: 'pending',
      progress: 15,
      tasks: [
        {
          id: '5-1',
          title: 'Pilot User Selection',
          description: 'Identify and prepare pilot user group for testing',
          status: 'in-progress',
          progress: 50,
          dueDate: '2024-05-20',
          assignee: 'Sarah Johnson',
          priority: 'medium'
        },
        {
          id: '5-2',
          title: 'Device Certificate Deployment',
          description: 'Deploy certificates to pilot devices via Intune',
          status: 'pending',
          progress: 0,
          dueDate: '2024-06-01',
          assignee: 'Tom Rodriguez',
          priority: 'high'
        },
        {
          id: '5-3',
          title: 'Authentication Testing',
          description: 'Validate 802.1X authentication across device types',
          status: 'pending',
          progress: 0,
          dueDate: '2024-06-10',
          assignee: 'Mike Chen',
          priority: 'high'
        }
      ]
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'on-track':
        return 'bg-blue-100 text-blue-800'
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800'
      case 'delayed':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const overallProgress = Math.round(
    milestones.reduce((acc, milestone) => acc + milestone.progress, 0) / milestones.length
  )

  const completedMilestones = milestones.filter(m => m.status === 'completed').length
  const totalTasks = milestones.reduce((acc, milestone) => acc + milestone.tasks.length, 0)
  const completedTasks = milestones.reduce((acc, milestone) => 
    acc + milestone.tasks.filter(task => task.status === 'completed').length, 0
  )

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{overallProgress}%</p>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{completedMilestones}/{milestones.length}</p>
                <p className="text-sm text-muted-foreground">Milestones Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                <p className="text-sm text-muted-foreground">Tasks Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">Jun 15</p>
                <p className="text-sm text-muted-foreground">Target Completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Project Timeline & Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="relative">
                {/* Timeline Line */}
                {index < milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
                )}
                
                <div className="flex items-start space-x-4">
                  {/* Timeline Dot */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' ? 'bg-green-100' :
                    milestone.status === 'on-track' ? 'bg-blue-100' :
                    milestone.status === 'at-risk' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Milestone Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{milestone.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{milestone.targetDate}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{milestone.description}</p>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-1">
                        <Progress value={milestone.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{milestone.progress}%</span>
                    </div>
                    
                    {/* Tasks */}
                    <div className="space-y-2">
                      {milestone.tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(task.priority)} variant="outline">
                              {task.priority}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{task.assignee}</span>
                            <div className="w-20">
                              <Progress value={task.progress} className="h-1" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Task View */}
      <Tabs value={selectedPhase} onValueChange={setSelectedPhase} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="setup">Cloud Setup</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="pilot">Pilot</TabsTrigger>
        </TabsList>

        {milestones.map((milestone, index) => (
          <TabsContent key={milestone.id} value={['planning', 'setup', 'certificates', 'network', 'pilot'][index]}>
            <Card>
              <CardHeader>
                <CardTitle>{milestone.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestone.tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <h4 className="font-semibold">{task.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Assignee:</span>
                          <p className="text-muted-foreground">{task.assignee}</p>
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span>
                          <p className="text-muted-foreground">{task.dueDate}</p>
                        </div>
                        <div>
                          <span className="font-medium">Progress:</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={task.progress} className="flex-1 h-2" />
                            <span className="text-xs">{task.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
