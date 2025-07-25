import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { Button } from '../components/ui/Button'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Plus,
  ArrowRight
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../lib/api'
import { Site, Analytics } from '../lib/mockData'
import { useNavigate } from 'react-router-dom'

export function Dashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const result = await apiClient.get('/api/analytics')
      return result.data as Analytics
    },
    enabled: !!user,
  })

  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const result = await apiClient.get('/api/sites')
      return result.data as Site[]
    },
    enabled: !!user,
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const result = await apiClient.get('/api/projects')
      return result.data || []
    },
    enabled: !!user,
  })

  if (analyticsLoading || sitesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const overview = analytics?.overview || {}
  const performance = analytics?.performance || {}
  const financial = analytics?.financial || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}! Here's your deployment overview.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/analytics')}
            className="flex items-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button 
            onClick={() => navigate('/sites')}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Deployment
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/sites')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sites</p>
                <p className="text-2xl font-bold text-blue-900">{overview.total_sites || 0}</p>
                <p className="text-xs text-blue-700 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {overview.active_deployments || 0} active deployments
                </p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/analytics')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-900">{performance.success_rate || 0}%</p>
                <p className="text-xs text-green-700 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {overview.completed_deployments || 0} completed
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/projects')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-900">{performance.avg_completion_rate || 0}%</p>
                <p className="text-xs text-purple-700 flex items-center mt-1">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Across all projects
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Users</p>
                <p className="text-2xl font-bold text-orange-900">{overview.total_users?.toLocaleString() || 0}</p>
                <p className="text-xs text-orange-700 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" />
                  Across all sites
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Sites
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/sites')}
              className="text-blue-600 hover:text-blue-800"
            >
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sites?.slice(0, 5).map((site: Site) => (
                <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate('/sites')}>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{site.name}</p>
                      <Badge 
                        className={
                          site.status === 'Complete' ? 'bg-green-100 text-green-800' :
                          site.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          site.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {site.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{site.region} • {site.country}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-16">
                          <Progress value={site.completion_percent} className="h-1" />
                        </div>
                        <span className="text-xs text-gray-500">{site.completion_percent}%</span>
                      </div>
                      <span className="text-xs text-gray-500">{site.users_count} users</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Overview
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/analytics')}
              className="text-blue-600 hover:text-blue-800"
            >
              Details <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Deployment Velocity</span>
                <span className="text-sm text-gray-600">{performance.deployment_velocity || 85}%</span>
              </div>
              <Progress value={performance.deployment_velocity || 85} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-time Delivery</span>
                <span className="text-sm text-gray-600">{performance.on_time_delivery || 92}%</span>
              </div>
              <Progress value={performance.on_time_delivery || 92} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Budget Efficiency</span>
                <span className="text-sm text-gray-600">{financial.budget_efficiency || 94}%</span>
              </div>
              <Progress value={financial.budget_efficiency || 94} className="h-2" />

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Health</span>
                  <span className="text-sm font-bold text-green-600">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/sites')}
            >
              <Building2 className="h-6 w-6" />
              <span>Create New Site</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/projects')}
            >
              <BarChart3 className="h-6 w-6" />
              <span>Start New Project</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex flex-col items-center justify-center space-y-2"
              onClick={() => navigate('/analytics')}
            >
              <TrendingUp className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}