'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, Building2, Calendar, Download } from 'lucide-react'

export default function ProgressTracking() {
  const overallProgress = {
    totalSites: 125,
    completedSites: 12,
    inProgressSites: 8,
    plannedSites: 105,
    overallCompletion: 15
  }

  const phaseProgress = [
    { phase: 'Phase 1', sites: 25, completed: 12, inProgress: 8, planned: 5, completion: 80 },
    { phase: 'Phase 2', sites: 40, completed: 0, inProgress: 0, planned: 40, completion: 0 },
    { phase: 'Phase 3', sites: 35, completed: 0, inProgress: 0, planned: 35, completion: 0 },
    { phase: 'Phase 4', sites: 25, completed: 0, inProgress: 0, planned: 25, completion: 0 }
  ]

  const recentActivity = [
    { site: 'ABM-HQ001', activity: 'Completed certificate deployment', timestamp: '2 hours ago', status: 'success' },
    { site: 'ABM-DC002', activity: 'Started network configuration', timestamp: '4 hours ago', status: 'info' },
    { site: 'ABM-NYC003', activity: 'Pilot testing completed', timestamp: '1 day ago', status: 'success' },
    { site: 'ABM-LA004', activity: 'Deployment delayed - resource conflict', timestamp: '2 days ago', status: 'warning' }
  ]

  const milestones = [
    { title: 'Project Kickoff', date: '2025-01-15', status: 'completed' },
    { title: 'Phase 1 Pilot Complete', date: '2025-02-28', status: 'completed' },
    { title: 'Phase 1 Rollout Complete', date: '2025-04-15', status: 'in-progress' },
    { title: 'Phase 2 Start', date: '2025-05-01', status: 'upcoming' },
    { title: 'Project Complete', date: '2025-12-31', status: 'upcoming' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getMilestoneStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'upcoming': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Sites</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{overallProgress.totalSites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{overallProgress.completedSites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">In Progress</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{overallProgress.inProgressSites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{overallProgress.overallCompletion}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Phase Progress</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {phaseProgress.map((phase, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{phase.phase}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{phase.sites} sites</span>
                    <span className="text-lg font-bold text-blue-600">{phase.completion}%</span>
                  </div>
                </div>
                
                <Progress value={phase.completion} className="h-3" />
                
                <div className="flex justify-between text-sm">
                  <div className="flex space-x-4">
                    <span className="text-green-600">✓ {phase.completed} Completed</span>
                    <span className="text-blue-600">⟳ {phase.inProgress} In Progress</span>
                    <span className="text-gray-600">○ {phase.planned} Planned</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(activity.status)}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{activity.site}</div>
                    <div className="text-sm text-gray-600">{activity.activity}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span>Project Milestones</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{milestone.title}</div>
                    <div className="text-sm text-gray-600">{milestone.date}</div>
                  </div>
                  <Badge className={getMilestoneStatus(milestone.status)}>
                    {milestone.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
