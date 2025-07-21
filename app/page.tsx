"use client"

import dynamic from "next/dynamic"
import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Site, User, SiteStats, LibraryData } from "@/lib/database"
import * as api from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Home, Target, CaseUpper, BookCopy, Settings } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"

const DashboardSkeleton = () => (
  <div className="space-y-4 p-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-24" />
    </div>
    <Skeleton className="h-[400px] w-full rounded-lg" />
  </div>
)

const ProgressDashboard = dynamic(
  () => import("@/components/progress-dashboard").then((mod) => mod.ProgressDashboard),
  {
    loading: () => <DashboardSkeleton />,
  },
)
const ScopingDashboard = dynamic(() => import("@/components/scoping-dashboard").then((mod) => mod.ScopingDashboard), {
  loading: () => <DashboardSkeleton />,
})
const SiteList = dynamic(() => import("@/components/site-list").then((mod) => mod.SiteList), {
  loading: () => <DashboardSkeleton />,
})
const LibraryDashboard = dynamic(() => import("@/components/library-dashboard").then((mod) => mod.LibraryDashboard), {
  loading: () => <DashboardSkeleton />,
})
const SettingsDashboard = dynamic(
  () => import("@/components/settings-dashboard").then((mod) => mod.SettingsDashboard),
  {
    loading: () => <DashboardSkeleton />,
  },
)

export default function HomeDashboard() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  const loadAllData = useCallback(async () => {
    setLoading(true)
    try {
      const [sitesData, usersData, statsData, libData] = await Promise.all([
        api.getSites(),
        api.getUsers(),
        api.getSiteStats(),
        api.getLibraryData(),
      ])
      setSites(sitesData)
      setUsers(usersData)
      setStats(statsData)
      setLibraryData(libData)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  if (loading || !libraryData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <DashboardSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="scoping">
              <Target className="mr-2 h-4 w-4" />
              Scoping
            </TabsTrigger>
            <TabsTrigger value="sites">
              <CaseUpper className="mr-2 h-4 w-4" />
              Sites
            </TabsTrigger>
            <TabsTrigger value="library">
              <BookCopy className="mr-2 h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-4">
            {stats && <ProgressDashboard stats={stats} />}
          </TabsContent>

          <TabsContent value="scoping" className="mt-4">
            <ScopingDashboard
              library={libraryData}
              onSiteCreate={() => {
                loadAllData()
                setActiveTab("sites")
              }}
            />
          </TabsContent>

          <TabsContent value="sites" className="mt-4">
            <SiteList sites={sites} onUpdate={loadAllData} library={libraryData} users={users} />
          </TabsContent>

          <TabsContent value="library" className="mt-4">
            <LibraryDashboard libraryData={libraryData} onUpdate={loadAllData} />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <SettingsDashboard users={users} onUpdate={loadAllData} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
    </div>
  )
}
