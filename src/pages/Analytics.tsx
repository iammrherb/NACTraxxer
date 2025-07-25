import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  Building2,
  Target,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export function Analytics() {
  const { token, user } = useAuthStore()

  if (token) {
    apiClient.setToken(token)
  }

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const result = await apiClient.get('/api/analytics')
      return result.data || {}
    },
    enabled: !!user,
  })

  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const result = await apiClient.get('/api/sites')
      return result.data || []
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

  // Process data for charts
  const regionData = sites?.reduce((acc: any, site: any) => {
    const region = site.region
    if (!acc[region]) {
      acc[region] = { name: region, sites: 0, completed: 0, inProgress: 0 }
    }
    acc[region].sites++
    if (site.status.toLowerCase().includes('complete')) {
      acc[region].completed++
    } else if (site.status.toLowerCase().includes('progress')) {
      acc[region].inProgress++
    }
    return acc
  }, {})

  const regionChartData = regionData ? Object.values(regionData) : []

  const statusData = sites?.reduce((acc: any, site: any) => {
    const status = site.status
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  const statusChartData = statusData ? Object.entries(statusData).map(([name, value]) => ({ name, value })) : []

  const progressData = sites?.map((site: any, index: number) => ({
    name: site.name.length > 15 ? site.name.substring(0, 15) + '...' : site.name,
    progress: site.completion_percent,
    users: site.users_count
  })).slice(0, 10) || []

  const monthlyTrend = [
    { month: 'Jan', deployments: 12, success: 10 },
    { month: 'Feb', deployments: 19, success: 17 },
    { month: 'Mar', deployments: 15, success: 14 },
    { month: 'Apr', deployments: 22, success: 20 },
    { month: 'May', deployments: 28, success: 26 },
    { month: 'Jun', deployments: 35, success: 33 },
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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

  const totalSites = sites?.length || 0
  const completedSites = sites?.filter((s: any) => s.status.toLowerCase().includes('complete')).length || 0
  const inProgressSites = sites?.filter((s: any) => s.status.toLowerCase().includes('progress')).length || 0
  const totalUsers = sites?.reduce((acc: number, site: any) => acc + site.users_count, 0) || 0
  const avgProgress = totalSites ? Math.round(sites.reduce((acc: number, s: any) => acc + s.completion_percent, 0) / totalSites) : 0
  const successRate = totalSites ? Math.round((completedSites / totalSites) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Deployment insights and performance metrics</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Sites</p>
                <p className="text-2xl font-bold text-blue-900">{totalSites}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-blue-600 mr-1" />
                  <span className="text-xs text-blue-700">+12% from last month</span>
                </div>
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
                <p className="text-2xl font-bold text-green-900">{successRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-xs text-green-700">+5% from last month</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Progress</p>
                <p className="text-2xl font-bold text-purple-900">{avgProgress}%</p>
                <div className="flex items-center mt-1">
                  <Activity className="h-4 w-4 text-purple-600 mr-1" />
                  <span className="text-xs text-purple-700">Across all projects</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Total Users</p>
                <p className="text-2xl font-bold text-orange-900">{totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <Users className="h-4 w-4 text-orange-600 mr-1" />
                  <span className="text-xs text-orange-700">Across all sites</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Deployment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="deployments" 
                  stackId="1"
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.6}
                  name="Total Deployments"
                />
                <Area 
                  type="monotone" 
                  dataKey="success" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.6}
                  name="Successful"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sites by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sites" fill="#3B82F6" name="Total Sites" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {progressData.map((site, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{site.name}</p>
                    <p className="text-xs text-gray-500">{site.users} users</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="w-24">
                      <Progress value={site.progress} className="h-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">
                      {site.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Deployment Velocity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Time to Deploy</span>
                <span className="text-sm text-gray-600">14 days</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Fastest Deployment</span>
                <span className="text-sm text-gray-600">7 days</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">On-time Delivery</span>
                <span className="text-sm text-gray-600">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">High Risk Sites</span>
                <Badge variant="destructive">3</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medium Risk Sites</span>
                <Badge className="bg-yellow-100 text-yellow-800">7</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Risk Sites</span>
                <Badge className="bg-green-100 text-green-800">{totalSites - 10}</Badge>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Risk Score</span>
                  <span className="text-sm font-bold text-green-600">Low</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Budget</span>
                <span className="text-sm text-gray-600">$2.4M</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Spent to Date</span>
                <span className="text-sm text-gray-600">$1.8M</span>
              </div>
              <Progress value={75} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Remaining Budget</span>
                <span className="text-sm text-gray-600">$600K</span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Budget Efficiency</span>
                  <span className="text-sm font-bold text-green-600">92%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}