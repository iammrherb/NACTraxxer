"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer } from "@/components/ui/chart"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ResponsiveContainer
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity,
  DollarSign,
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Brain,
  Globe,
  Shield
} from "lucide-react"
import type { Site, Project } from "@/lib/types"

interface AdvancedAnalyticsDashboardProps {
  sites: Site[]
  projects: Project[]
  timeRange: '7d' | '30d' | '90d' | '1y'
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void
}

export function AdvancedAnalyticsDashboard({ 
  sites, 
  projects, 
  timeRange, 
  onTimeRangeChange 
}: AdvancedAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMetric, setSelectedMetric] = useState('completion')

  // Calculate comprehensive metrics
  const analytics = useMemo(() => {
    const totalSites = sites.length
    const completedSites = sites.filter(s => s.status === 'Complete').length
    const inProgressSites = sites.filter(s => s.status === 'In Progress').length
    const delayedSites = sites.filter(s => s.status === 'Delayed').length
    const highRiskSites = sites.filter(s => s.risk_level === 'high' || s.risk_level === 'critical').length
    
    const totalBudget = sites.reduce((acc, s) => acc + (s.budget_allocated || 0), 0)
    const totalSpent = sites.reduce((acc, s) => acc + (s.budget_spent || 0), 0)
    const avgCompletion = totalSites > 0 ? sites.reduce((acc, s) => acc + s.completion_percent, 0) / totalSites : 0
    
    // Regional breakdown
    const regionData = sites.reduce((acc, site) => {
      acc[site.region] = (acc[site.region] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Status distribution
    const statusData = [
      { name: 'Completed', value: completedSites, color: '#10b981' },
      { name: 'In Progress', value: inProgressSites, color: '#3b82f6' },
      { name: 'Planned', value: sites.filter(s => s.status === 'Planned').length, color: '#6b7280' },
      { name: 'Delayed', value: delayedSites, color: '#ef4444' }
    ]

    // Completion trend (mock data for demonstration)
    const completionTrend = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString('en', { month: 'short' }),
      completed: Math.floor(Math.random() * 10) + i * 2,
      planned: Math.floor(Math.random() * 15) + 20,
      budget_spent: Math.floor(Math.random() * 500000) + i * 100000
    }))

    // Performance metrics
    const performanceMetrics = {
      deployment_velocity: Math.round(completedSites / Math.max(1, totalSites) * 100),
      budget_efficiency: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0,
      risk_score: Math.round((highRiskSites / Math.max(1, totalSites)) * 100),
      timeline_adherence: Math.round(Math.random() * 20 + 75) // Mock data
    }

    return {
      totalSites,
      completedSites,
      inProgressSites,
      delayedSites,
      highRiskSites,
      totalBudget,
      totalSpent,
      avgCompletion,
      regionData,
      statusData,
      completionTrend,
      performanceMetrics
    }
  }, [sites])

  // Predictive insights (mock AI-generated insights)
  const aiInsights = [
    {
      type: 'success',
      title: 'Deployment Velocity Increasing',
      description: 'Current deployment rate is 23% above historical average',
      confidence: 94,
      impact: 'high'
    },
    {
      type: 'warning',
      title: 'Budget Overrun Risk Detected',
      description: '3 sites showing signs of potential budget overrun',
      confidence: 87,
      impact: 'medium'
    },
    {
      type: 'info',
      title: 'Resource Optimization Opportunity',
      description: 'AI suggests reallocating 2 engineers for 15% efficiency gain',
      confidence: 91,
      impact: 'medium'
    }
  ]

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case 'info':
        return <Brain className="h-5 w-5 text-blue-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Deployment Velocity</p>
                <p className="text-2xl font-bold text-green-900">{analytics.performanceMetrics.deployment_velocity}%</p>
                <div className="flex items-center text-xs text-green-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% vs last period
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Budget Efficiency</p>
                <p className="text-2xl font-bold text-blue-900">{analytics.performanceMetrics.budget_efficiency}%</p>
                <div className="flex items-center text-xs text-blue-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  On track
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Risk Score</p>
                <p className="text-2xl font-bold text-orange-900">{analytics.performanceMetrics.risk_score}%</p>
                <div className="flex items-center text-xs text-orange-700">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -5% improvement
                </div>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Timeline Adherence</p>
                <p className="text-2xl font-bold text-purple-900">{analytics.performanceMetrics.timeline_adherence}%</p>
                <div className="flex items-center text-xs text-purple-700">
                  <Clock className="h-3 w-3 mr-1" />
                  Above target
                </div>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-600" />
            <span>AI-Powered Insights</span>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Zap className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{insight.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                        <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {insight.impact} impact
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <PieChart>
                    <Pie
                      data={analytics.statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completion Progress Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <AreaChart data={analytics.completionTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="planned" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(analytics.regionData).map(([region, count]) => (
                  <div key={region} className="text-center p-4 border rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{region}</div>
                    <Progress value={Math.random() * 100} className="mt-2 h-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">94.2%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">12.3</div>
                <div className="text-sm text-muted-foreground">Avg Weeks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">87%</div>
                <div className="text-sm text-muted-foreground">Resource Utilization</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <LineChart data={analytics.completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed Sites" />
                  <Line type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} name="Planned Sites" />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">${(analytics.totalBudget / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Total Budget</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold">${(analytics.totalSpent / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Spent to Date</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                <div className="text-2xl font-bold">{analytics.performanceMetrics.budget_efficiency}%</div>
                <div className="text-sm text-muted-foreground">Budget Efficiency</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[300px]">
                <BarChart data={analytics.completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(Number(value) / 1000).toFixed(0)}K`, 'Budget Spent']} />
                  <Bar dataKey="budget_spent" fill="#3b82f6" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <span>AI Predictive Models</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Deployment Success Prediction</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q4 2024 Deployments</span>
                      <Badge className="bg-green-100 text-green-800">92% Success Rate</Badge>
                    </div>
                    <Progress value={92} className="h-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Q1 2025 Forecast</span>
                      <Badge className="bg-blue-100 text-blue-800">89% Success Rate</Badge>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Resource Demand Forecast</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Project Managers</span>
                      <Badge variant="outline">+2 needed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Network Engineers</span>
                      <Badge variant="outline">+3 needed</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Security Specialists</span>
                      <Badge className="bg-green-100 text-green-800">Sufficient</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Prediction Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="font-semibold text-red-800">High Risk</span>
                  </div>
                  <div className="text-2xl font-bold text-red-900">3</div>
                  <div className="text-sm text-red-700">Sites requiring attention</div>
                </div>
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-yellow-800">Medium Risk</span>
                  </div>
                  <div className="text-2xl font-bold text-yellow-900">7</div>
                  <div className="text-sm text-yellow-700">Sites under monitoring</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-green-800">Low Risk</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900">{analytics.totalSites - 10}</div>
                  <div className="text-sm text-green-700">Sites on track</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-[400px]">
                <BarChart data={Object.entries(analytics.regionData).map(([region, count]) => ({
                  region,
                  sites: count,
                  completion: Math.floor(Math.random() * 30) + 70,
                  budget_utilization: Math.floor(Math.random() * 40) + 60
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sites" fill="#3b82f6" name="Total Sites" />
                  <Bar dataKey="completion" fill="#10b981" name="Avg Completion %" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}