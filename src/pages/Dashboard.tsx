import { useQuery } from '@tanstack/react-query'
import { InternalLink } from '../components/InternalLinkHelper'
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
  BarChart3
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export function Dashboard() {
  const { token } = useAuthStore()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const result = await response.json()
      return result.data || result
    },
  })

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const response = await fetch('/api/sites', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const result = await response.json()
      return result.data || []
    },
  })

  if (isLoading) {
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

  const overview = stats?.overview || {}
  const performance = stats?.performance || {}
  const financial = stats?.financial || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to your deployment command center</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Building2 className="h-4 w-4 mr-2" />
          New Deployment
        </Button>
        <div className="flex space-x-2">
          <InternalLink to="/sites" variant="prominent" showIcon>
            View All Sites
          </InternalLink>
          <InternalLink to="/analytics" variant="subtle">
            Detailed Analytics
          </InternalLink>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sites</p>
                <p className="text-2xl font-bold text-blue-900">{overview.total_sites || 0}</p>
                <p className="text-xs text-blue-700">{overview.active_deployments || 0} active</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-900">{performance.success_rate || 0}%</p>
                <p className="text-xs text-green-700">{overview.completed_deployments || 0} completed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Completion</p>
                <p className="text-2xl font-bold text-purple-900">{performance.avg_completion_rate || 0}%</p>
                <p className="text-xs text-purple-700">Across all projects</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Budget Efficiency</p>
                <p className="text-2xl font-bold text-orange-900">{financial.budget_efficiency || 0}%</p>
                <p className="text-xs text-orange-700">On track</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Sites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sites?.slice(0, 5).map((site: any) => (
                <div key={site.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{site.name}</p>
                    <p className="text-sm text-gray-600">{site.region} • {site.country}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={site.status === 'Complete' ? 'default' : 'secondary'}>
                      {site.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{site.completion_percent}%</p>
                      <Progress value={site.completion_percent} className="w-16 h-1" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <InternalLink 
                    to={`/sites/${site.id}`} 
                    variant="subtle" 
                    className="text-xs"
                  >
                    View Details
                  </InternalLink>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Deployment Velocity</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-time Delivery</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <Progress value={92} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Satisfaction</span>
                <span className="text-sm text-gray-600">4.8/5</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}