import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '../lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Target
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description?: string
  project_type: string
  status: string
  priority: string
  start_date?: string
  end_date?: string
  budget?: number
  health_score: number
  risk_level: string
  project_manager?: {
    name: string
    email: string
  }
  organization?: {
    name: string
    slug: string
  }
  created_at: string
}

export function Projects() {
  const { token, user } = useAuthStore()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  if (token) {
    apiClient.setToken(token)
  }

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const result = await apiClient.get('/api/projects')
      return result.data || []
    },
    enabled: !!user,
  })

  const createProjectMutation = useMutation({
    mutationFn: async (projectData: Partial<Project>) => {
      const result = await apiClient.post('/api/projects', projectData)
      if (!result.success) throw new Error(result.error?.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Project created successfully!')
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    },
  })

  const filteredProjects = projects?.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesType = typeFilter === 'all' || project.project_type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  }) || []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'planning':
        return 'bg-yellow-100 text-yellow-800'
      case 'on-hold':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      case 'low':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your deployment projects</p>
        </div>
        <Button 
          onClick={() => {
            createProjectMutation.mutate({
              name: `Project ${Date.now()}`,
              description: 'New deployment project',
              project_type: 'production',
              status: 'planning',
              priority: 'medium',
              health_score: 100,
              risk_level: 'low'
            })
          }}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={createProjectMutation.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          {createProjectMutation.isPending ? 'Creating...' : 'New Project'}
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="poc">POC</option>
            <option value="pilot">Pilot</option>
            <option value="production">Production</option>
            <option value="migration">Migration</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold">{projects?.length || 0}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {projects?.filter((p: Project) => p.status.toLowerCase() === 'active').length || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {projects?.filter((p: Project) => p.status.toLowerCase() === 'completed').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Health</p>
                <p className="text-2xl font-bold">
                  {projects?.length ? Math.round(projects.reduce((acc: number, p: Project) => acc + p.health_score, 0) / projects.length) : 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project: Project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{project.description}</p>
                  )}
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {project.project_type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={getHealthColor(project.health_score)}>
                      {project.health_score}% Health
                    </span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-gray-400" />
                    <span className={getRiskColor(project.risk_level)}>
                      {project.risk_level} Risk
                    </span>
                  </div>
                </div>
                
                {project.budget && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    ${project.budget.toLocaleString()}
                  </div>
                )}
                
                {project.start_date && project.end_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                  </div>
                )}
                
                {project.project_manager && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {project.project_manager.name}
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
                    {project.organization && (
                      <span>{project.organization.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first project'}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button 
                onClick={() => {
                  createProjectMutation.mutate({
                    name: `Project ${Date.now()}`,
                    description: 'New deployment project',
                    project_type: 'production',
                    status: 'planning',
                    priority: 'medium',
                    health_score: 100,
                    risk_level: 'low'
                  })
                }}
                disabled={createProjectMutation.isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}