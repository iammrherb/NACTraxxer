"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { EnhancedSiteDashboard } from "@/components/enhanced-site-dashboard"
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard"
import { AIProjectCreator } from "@/components/ai-project-creator"
import { ScopingDashboard } from "@/components/scoping-dashboard"
import { LibraryDashboard } from "@/components/library-dashboard"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { SettingsDashboard } from "@/components/settings-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { Site, User, LibraryData, SiteStats, Milestone, Project, Organization } from "@/lib/types"
import { Loading } from "@/components/loading"
import { Settings, Telescope, ListTodo, LayoutDashboard, BookOpen, GanttChartSquare, BarChart3, Brain, Plus } from "lucide-react"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [library, setLibrary] = useState<LibraryData | null>(null)
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("sites")
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [showAICreator, setShowAICreator] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [sitesData, projectsData, organizationsData, usersData, libraryData, statsData, milestonesData, analyticsData] = await Promise.all([
        api.getSites(),
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/organizations').then(res => res.json()),
        api.getUsers(),
        api.getLibraryData(),
        api.getSiteStats(),
        api.getMilestones(),
        fetch('/api/analytics').then(res => res.json()),
      ])
      setSites(sitesData)
      setProjects(projectsData)
      setOrganizations(organizationsData)
      setUsers(usersData)
      setLibrary(libraryData)
      setStats(statsData)
      setMilestones(milestonesData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error fetching data",
        description: "Could not load initial application data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSiteCreate = () => {
    toast({ title: "Site Creation", description: "Opening site creation form..." })
  }

  const handleSiteUpdate = (site: Site) => {
    toast({ title: "Site Update", description: `Updating ${site.name}...` })
  }

  const handleBulkOperation = (operation: string, siteIds: string[]) => {
    toast({ title: "Bulk Operation", description: `Performing ${operation} on ${siteIds.length} sites.` })
  }

  const handleProjectCreate = (projectData: any) => {
    toast({ 
      title: "AI Project Created", 
      description: `Created project: ${projectData.name} with ${projectData.success_probability}% success probability` 
    })
    fetchData() // Refresh data
  }

  if (isLoading || !library || !stats || !analytics) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* AI Project Creator Button */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Deployment Command Center</h1>
            <p className="text-muted-foreground">AI-powered NAC deployment management platform</p>
          </div>
          <Button onClick={() => setShowAICreator(true)} className="bg-purple-600 hover:bg-purple-700">
            <Brain className="h-4 w-4 mr-2" />
            AI Project Creator
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto">
            <TabsTrigger value="sites">
              <ListTodo className="w-4 h-4 mr-2" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="scoping">
              <Telescope className="w-4 h-4 mr-2" />
              Scoping
            </TabsTrigger>
            <TabsTrigger value="library">
              <BookOpen className="w-4 h-4 mr-2" />
              Library
            </TabsTrigger>
            <TabsTrigger value="reports">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="sites" className="mt-4">
            <EnhancedSiteDashboard 
              sites={sites} 
              projects={projects}
              organizations={organizations}
              onSiteCreate={handleSiteCreate} 
              onSiteUpdate={handleSiteUpdate} 
              onBulkOperation={handleBulkOperation} 
            />
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <AdvancedAnalyticsDashboard 
              sites={sites} 
              projects={projects}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </TabsContent>
          <TabsContent value="scoping" className="mt-4">
            <ScopingDashboard library={library} onSiteCreate={fetchData} />
          </TabsContent>
          <TabsContent value="library" className="mt-4">
            <LibraryDashboard libraryData={library} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <ReportsDashboard />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <SettingsDashboard users={users} />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* AI Project Creator Modal */}
      <AIProjectCreator
        isOpen={showAICreator}
        onClose={() => setShowAICreator(false)}
        onProjectCreate={handleProjectCreate}
      />
      
      <Toaster />
    </div>
  )
}
