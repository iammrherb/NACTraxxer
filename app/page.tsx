"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteList } from "@/components/site-list"
import { ScopingDashboard } from "@/components/scoping-dashboard"
import { LibraryDashboard } from "@/components/library-dashboard"
import { ReportsDashboard } from "@/components/reports-dashboard"
import { SettingsDashboard } from "@/components/settings-dashboard"
import { ImplementationDashboard } from "@/components/implementation-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { Site, User, LibraryData, SiteStats, Milestone } from "@/lib/types"
import { Loading } from "@/components/loading"
import { Settings, Telescope, ListTodo, LayoutDashboard, BookOpen, GanttChartSquare, BarChart3 } from "lucide-react"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [library, setLibrary] = useState<LibraryData | null>(null)
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("sites")

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [sitesData, usersData, libraryData, statsData, milestonesData] = await Promise.all([
        api.getSites(),
        api.getUsers(),
        api.getLibraryData(),
        api.getSiteStats(),
        api.getMilestones(),
      ])
      setSites(sitesData)
      setUsers(usersData)
      setLibrary(libraryData)
      setStats(statsData)
      setMilestones(milestonesData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error fetching data",
        description: error instanceof Error ? error.message : "Could not load initial application data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (isLoading || !library || !stats) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-7 h-auto">
            <TabsTrigger value="sites">
              <ListTodo className="w-4 h-4 mr-2" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="progress">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="implementation">
              <GanttChartSquare className="w-4 h-4 mr-2" />
              Implementation
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
            <SiteList sites={sites} library={library} users={users} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="progress" className="mt-4">
            <ProgressDashboard stats={stats} sites={sites} milestones={milestones} />
          </TabsContent>
          <TabsContent value="implementation" className="mt-4">
            <ImplementationDashboard sites={sites} checklist={library.deploymentChecklist} />
          </TabsContent>
          <TabsContent value="scoping" className="mt-4">
            <ScopingDashboard useCases={library.useCases} requirements={library.requirements} />
          </TabsContent>
          <TabsContent value="library" className="mt-4">
            <LibraryDashboard libraryData={library} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <ReportsDashboard />
          </TabsContent>
          <TabsContent value="settings" className="mt-4">
            <SettingsDashboard users={users} onUpdate={fetchData} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  )
}
