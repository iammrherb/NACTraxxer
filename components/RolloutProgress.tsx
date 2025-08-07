'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, CheckCircle, Clock, AlertTriangle, Users } from 'lucide-react'

export default function RolloutProgress() {
  // Sample data - in a real app this would come from an API
  const stats = {
    totalSites: 12,
    completedSites: 3,
    inProgressSites: 4,
    plannedSites: 5,
    delayedSites: 0,
    totalUsers: 9550
  }

  const overallProgress = Math.round((stats.completedSites / stats.totalSites) * 100)

  const siteProgress = [
    { name: 'ABM Global Headquarters', status: 'In Progress', progress: 35, priority: 'High' },
    { name: 'Primary Data Center', status: 'In Progress', progress: 65, priority: 'High' },
    { name: 'Manufacturing Plant', status: 'Complete', progress: 100, priority: 'High' },
    { name: 'London Office', status: 'Complete', progress: 100, priority: 'High' },
    { name: 'Secondary Data Center', status: 'Complete', progress: 100, priority: 'High' },
    { name: 'European HQ', status: 'Planned', progress: 0, priority: 'Medium' },
    { name: 'APAC Regional Office', status: 'Planned', progress: 0, priority: 'Medium' },
    { name: 'Research & Development', status: 'In Progress', progress: 55, priority: 'High' },
    { name: 'Flagship Retail Store', status: 'Planned', progress: 0, priority: 'Medium' },
    { name: 'Paris Office', status: 'Planned', progress: 0, priority: 'Medium' },
    { name: 'Tokyo Office', status: 'Delayed', progress: 0, priority: 'Medium' },
    { name: 'Satellite Office', status: 'Planned', progress: 0, priority: 'Low' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'text-green-600'
      case 'In Progress': return 'text-blue-600'
      case 'Planned': return 'text-gray-600'
      case 'Delayed': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'In Progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'Planned': return <Clock className="h-4 w-4 text-gray-600" />
      case 'Delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-600'
      case 'In Progress': return 'bg-blue-600'
      case 'Planned': return 'bg-gray-400'
      case 'Delayed': return 'bg-red-600'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span>Overall NAC & RADIUS Rollout Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Complete Sites</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.completedSites}</p>
                  <p className="text-sm text-green-600 dark:text-green-400">of {stats.totalSites} total sites</p>
                </div>
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">In Progress</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.inProgressSites}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">sites being deployed</p>
                </div>
                <Clock className="h-12 w-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planned</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.plannedSites}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">sites scheduled</p>
                </div>
                <Clock className="h-12 w-12 text-gray-600" />
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Users</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">across all sites</p>
                </div>
                <Users className="h-12 w-12 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Total Project Completion</h3>
              <span className="text-2xl font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {stats.completedSites} of {stats.totalSites} sites completed
            </p>
          </div>

          {/* Site Progress List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Site Completion Status</h3>
            <div className="space-y-4">
              {siteProgress.map((site, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(site.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {site.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(site.priority)}>
                          {site.priority}
                        </Badge>
                        <span className={`text-sm font-medium ${getStatusColor(site.status)}`}>
                          {site.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(site.status)}`}
                          style={{ width: `${site.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[40px]">
                        {site.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
