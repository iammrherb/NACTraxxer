"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteTable } from "@/components/site-table"
import { SiteForm } from "@/components/site-form"
import { SiteDetailModal } from "@/components/site-detail-modal"
import { ScopingDashboard } from "@/components/scoping-dashboard"
import { LibraryDashboard } from "@/components/library-dashboard"
import { SettingsDashboard } from "@/components/settings-dashboard"
import { BulkEditModal } from "@/components/bulk-edit-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { Site, DatabaseUser, LibraryData } from "@/lib/database"

export default function Home() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [library, setLibrary] = useState<LibraryData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSiteFormOpen, setIsSiteFormOpen] = useState(false)
  const [isSiteDetailOpen, setIsSiteDetailOpen] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [bulkEditSiteIds, setBulkEditSiteIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("sites")

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [sitesData, usersData, libraryData] = await Promise.all([
        api.getSites(),
        api.getUsers(),
        api.getLibraryData(),
      ])
      setSites(sitesData)
      setUsers(usersData)
      setLibrary(libraryData)
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "Could not load initial application data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddSite = () => {
    setSelectedSite(null)
    setIsSiteFormOpen(true)
  }

  const handleEditSite = (site: Site) => {
    setSelectedSite(site)
    setIsSiteDetailOpen(true)
  }

  const handleBulkEdit = (siteIds: string[]) => {
    setBulkEditSiteIds(siteIds)
    setIsBulkEditOpen(true)
  }

  const handleSaveSite = async (siteData: any) => {
    try {
      if (selectedSite) {
        await api.updateSite(selectedSite.id, siteData)
        toast({ title: "Success", description: "Site updated successfully." })
      } else {
        await api.createSite(siteData)
        toast({ title: "Success", description: "Site created successfully." })
      }
      fetchData()
      setIsSiteFormOpen(false)
    } catch (error) {
      toast({ title: "Error", description: "Failed to save site.", variant: "destructive" })
    }
  }

  const handleSiteCreated = () => {
    fetchData()
    setActiveTab("sites")
  }

  if (isLoading || !library) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="scoping">Scoping</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="progress">
            <ProgressDashboard sites={sites} />
          </TabsContent>
          <TabsContent value="scoping">
            <ScopingDashboard library={library} onSiteCreate={handleSiteCreated} />
          </TabsContent>
          <TabsContent value="sites">
            <SiteTable
              sites={sites}
              onAddSite={handleAddSite}
              onEditSite={handleEditSite}
              onViewWorkbook={() => {}}
              onShowNotes={() => {}}
              onBulkEdit={handleBulkEdit}
            />
          </TabsContent>
          <TabsContent value="library">
            <LibraryDashboard library={library} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsDashboard onUpdate={fetchData} users={users} />
          </TabsContent>
        </Tabs>
      </main>
      {isSiteFormOpen && (
        <SiteForm
          isOpen={isSiteFormOpen}
          onClose={() => setIsSiteFormOpen(false)}
          onSave={handleSaveSite}
          site={selectedSite}
          users={users}
          wiredVendors={library.wiredVendors}
          wirelessVendors={library.wirelessVendors}
          firewallVendors={library.firewallVendors}
          vpnVendors={library.vpnVendors}
          edrXdrVendors={library.edrXdrVendors}
          siemVendors={library.siemVendors}
          deviceTypes={library.deviceTypes}
          checklistItems={library.checklistItems}
          useCases={library.useCases}
          testMatrix={library.testMatrix}
          onUpdateLibraries={fetchData}
        />
      )}
      {isSiteDetailOpen && selectedSite && (
        <SiteDetailModal
          isOpen={isSiteDetailOpen}
          onClose={() => setIsSiteDetailOpen(false)}
          site={selectedSite}
          onUpdate={fetchData}
          library={library}
          users={users}
        />
      )}
      {isBulkEditOpen && (
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          siteIds={bulkEditSiteIds}
          library={library}
          users={users}
          onUpdate={fetchData}
        />
      )}
      <Toaster />
    </div>
  )
}
