import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
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
  ArrowRight,
  Zap,
  Globe,
  Shield,
  Activity
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { apiClient } from '../lib/api'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export function Dashboard() {
  const { user } = useAuthStore()

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const result = await apiClient.get('/api/analytics')
      return result.data
    },
    enabled: !!user,
  })

  const { data: sites, isLoading: sitesLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const result = await apiClient.get('/api/sites')
      return result.data
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
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const overview = analytics?.overview || {}
  const performance = analytics?.performance || {}

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden">
        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-lg text-muted-foreground">
                  Here's your deployment overview for today
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-float">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-500 rounded-full animate-pulse flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Sites</p>
                  <p className="text-3xl font-bold">{overview.total_sites || 0}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+12% from last month</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold">{performance.success_rate || 0}%</p>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span>{overview.completed_deployments || 0} completed</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-3xl font-bold">{overview.active_deployments || 0}</p>
                  <div className="flex items-center text-sm text-purple-600">
                    <Activity className="h-4 w-4 mr-1" />
                    <span>In progress</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{overview.total_users?.toLocaleString() || 0}</p>
                  <div className="flex items-center text-sm text-orange-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Across all sites</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sites */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Recent Sites</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest deployment activities
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sites" className="flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sites?.slice(0, 5).map((site, index) => (
                <motion.div
                  key={site.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {site.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {site.region} • {site.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge 
                        variant={
                          site.status === 'Complete' ? 'success' :
                          site.status === 'In Progress' ? 'info' :
                          site.status === 'Delayed' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {site.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">
                        {site.users_count} users
                      </p>
                    </div>
                    <div className="w-20">
                      <Progress 
                        value={site.completion_percent} 
                        variant={
                          site.completion_percent >= 80 ? 'success' :
                          site.completion_percent >= 50 ? 'warning' :
                          'default'
                        }
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground text-center mt-1">
                        {site.completion_percent}%
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Overview */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Deployment Velocity</span>
                    <span className="text-muted-foreground">{performance.deployment_velocity || 85}%</span>
                  </div>
                  <Progress value={performance.deployment_velocity || 85} variant="success" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">On-time Delivery</span>
                    <span className="text-muted-foreground">{performance.on_time_delivery || 92}%</span>
                  </div>
                  <Progress value={performance.on_time_delivery || 92} variant="info" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Budget Efficiency</span>
                    <span className="text-muted-foreground">94%</span>
                  </div>
                  <Progress value={94} variant="warning" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Health</span>
                  <Badge variant="success" className="animate-pulse">
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Get started with common tasks
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2 group hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                asChild
              >
                <Link to="/sites">
                  <Building2 className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Create New Site</span>
                  <span className="text-xs text-muted-foreground">Add deployment location</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2 group hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                asChild
              >
                <Link to="/projects">
                  <BarChart3 className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Start New Project</span>
                  <span className="text-xs text-muted-foreground">Begin deployment project</span>
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center justify-center space-y-2 group hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                asChild
              >
                <Link to="/analytics">
                  <TrendingUp className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">View Analytics</span>
                  <span className="text-xs text-muted-foreground">Performance insights</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Banner */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">All Systems Operational</h3>
                  <p className="text-sm text-green-700">
                    All deployment services are running smoothly
                  </p>
                </div>
              </div>
              <Badge variant="success" className="animate-pulse">
                <Globe className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}