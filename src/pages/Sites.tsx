import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Grid,
  List,
  Download,
  Upload
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

interface Site {
  id: string
  name: string
  region: string
  country: string
  priority: string
  phase: number
  users_count: number
  status: string
  completion_percent: number
  planned_start: string
  planned_end: string
  project_manager?: {
    name: string
    email: string
  }
  notes?: string
}

export function Sites() {
  const { token, user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [showCreateModal, setShowCreateModal] = useState(false)

  if (token) {
    apiClient.setToken(token)
  }

  const { data: sites, isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const result = await apiClient.get('/api/sites')
      return result.data || []
    },
    enabled: !!user,
  })

  const createSiteMutation = useMutation({
    mutationFn: async (siteData: Partial<Site>) => {
      const result = await apiClient.post('/api/sites', siteData)
      if (!result.success) throw new Error(result.error?.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] })
      toast.success('Site created successfully!')
      setShowCreateModal(false)
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create site')
    },
  })

  const filteredSites = sites?.filter((site: Site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.region.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || site.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  }) || []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'complete':
        return 'success'
      case 'in progress':
      case 'in_progress':
        return 'info'
      case 'planned':
        return 'secondary'
      case 'delayed':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const handleCreateSite = () => {
    createSiteMutation.mutate({
      name: `Site ${Date.now()}`,
      region: 'North America',
      country: 'United States',
      priority: 'Medium',
      phase: 1,
      users_count: 100,
      status: 'Planned',
      completion_percent: 0,
      planned_start: new Date().toISOString().split('T')[0],
      planned_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sites</h1>
            <p className="text-muted-foreground">Manage your deployment sites</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sites
          </h1>
          <p className="text-muted-foreground">Manage and monitor your deployment sites</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={handleCreateSite}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            disabled={createSiteMutation.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {createSiteMutation.isPending ? 'Creating...' : 'Add Site'}
          </Button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search sites by name, region, or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">All Status</option>
                  <option value="planned">Planned</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
                <div className="flex border border-input rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Sites</p>
                  <p className="text-2xl font-bold text-blue-900">{sites?.length || 0}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">In Progress</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {sites?.filter((s: Site) => s.status.toLowerCase().includes('progress')).length || 0}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-2xl font-bold text-green-900">
                    {sites?.filter((s: Site) => s.status.toLowerCase().includes('complete')).length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Avg Progress</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {sites?.length ? Math.round(sites.reduce((acc: number, s: Site) => acc + s.completion_percent, 0) / sites.length) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Sites Grid */}
      {viewMode === 'grid' ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {filteredSites.map((site: Site, index) => (
            <motion.div
              key={site.id}
              variants={itemVariants}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {site.name}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {site.region}, {site.country}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(site.priority)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={getStatusColor(site.status)}>
                        {site.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">Phase {site.phase}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      {site.users_count.toLocaleString()} users
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-medium">{site.completion_percent}%</span>
                      </div>
                      <Progress 
                        value={site.completion_percent} 
                        variant={
                          site.completion_percent >= 80 ? 'success' :
                          site.completion_percent >= 50 ? 'warning' :
                          'default'
                        }
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(site.planned_start).toLocaleDateString()} - {new Date(site.planned_end).toLocaleDateString()}
                    </div>
                    
                    {site.project_manager && (
                      <div className="text-sm text-muted-foreground">
                        PM: {site.project_manager.name}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Site
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Timeline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredSites.map((site: Site) => (
                      <tr key={site.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getPriorityIcon(site.priority)}
                            <div className="ml-3">
                              <div className="text-sm font-medium">{site.name}</div>
                              <div className="text-sm text-muted-foreground">Phase {site.phase}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {site.region}, {site.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusColor(site.status)}>
                            {site.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 mr-2">
                              <Progress value={site.completion_percent} className="h-2" />
                            </div>
                            <span className="text-sm font-medium">{site.completion_percent}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {site.users_count.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(site.planned_start).toLocaleDateString()} - {new Date(site.planned_end).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {filteredSites.length === 0 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by creating your first site'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  onClick={handleCreateSite}
                  disabled={createSiteMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Site
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  )
}