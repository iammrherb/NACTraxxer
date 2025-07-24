"use client"

import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { SiteTable } from "@/components/site-table"
import { SiteForm } from "@/components/site-form"
import { SiteDetailModal } from "@/components/site-detail-modal"
import { ScopingDashboard } from "@/components/scoping-dashboard"
import { LibraryDashboard } from "@/components/library-dashboard"
import { SettingsDashboard } from "@/components/settings-dashboard"
import { BulkEditModal } from "@/components/bulk-edit-modal"
import { Header } from "@/components/header"
import { Loading } from "@/components/loading"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { Site, DatabaseUser, LibraryData, SiteStats, ScopingQuestionnaire } from "@/lib/database"

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([])
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [libraryData, setLibraryData] = useState<LibraryData | null>(null)
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [questionnaires, setQuestionnaires] = useState<ScopingQuestionnaire[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSiteFormOpen, setIsSiteFormOpen] = useState(false)
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [isSiteDetailOpen, setIsSiteDetailOpen] = useState(false)
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [bulkEditSiteIds, setBulkEditSiteIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("progress")

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [sitesData, usersData, library, siteStats, questionnaireData] = await Promise.all([
        api.getSites(),
        api.getUsers(),
        api.getLibraryData(),
        api.getSiteStats(),
        api.getQuestionnaires(),
      ])
      setSites(sitesData)
      setUsers(usersData)
      setLibraryData(library)
      setStats(siteStats)
      setQuestionnaires(questionnaireData)
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch initial data.", variant: "destructive" })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleOpenSiteForm = (site: Site | null) => {
    setEditingSite(site)
    setIsSiteFormOpen(true)
  }

  const handleSaveSite = async (siteData: any) => {
    try {
      if (editingSite) {
        await api.updateSite(editingSite.id, siteData)
        toast({ title: "Success", description: "Site updated successfully." })
      } else {
        await api.createSite(siteData)
        toast({ title: "Success", description: "Site created successfully." })
      }
      setIsSiteFormOpen(false)
      setEditingSite(null)
      fetchData() // Refresh all data
    } catch (error) {
      toast({ title: "Error", description: `Failed to save site: ${error}`, variant: "destructive" })
    }
  }

  const handleDeleteSite = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return
    try {
      await api.deleteSite(id)
      toast({ title: "Success", description: "Site deleted." })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete site.", variant: "destructive" })
    }
  }

  const handleBulkUpdate = async (siteIds: string[], updates: Partial<Site>) => {
    try {
      await api.bulkUpdateSites(siteIds, updates)
      toast({ title: "Success", description: `${siteIds.length} sites updated.` })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to bulk update sites.", variant: "destructive" })
    }
  }

  const handleBulkCreate = async (count: number, prefix: string, start: number, defaults: Partial<Site>) => {
    try {
      const promises = []
      for (let i = 0; i < count; i++) {
        const siteData = {
          ...defaults,
          name: `${prefix}-${start + i}`,
          id: `${prefix.toUpperCase().replace(/[^A-Z]/g, "")}${start + i}`,
        }
        promises.push(api.createSite(siteData))
      }
      await Promise.all(promises)
      toast({ title: "Success", description: `${count} sites created successfully.` })
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: "Failed to bulk create sites.", variant: "destructive" })
    }
  }

  const handleSaveQuestionnaire = async (data: ScopingQuestionnaire) => {
    try {
      let savedQuestionnaire: ScopingQuestionnaire
      if (data.id) {
        savedQuestionnaire = await api.updateQuestionnaire(data.id, data)
        toast({ title: "Success", description: "Questionnaire updated." })
      } else {
        savedQuestionnaire = await api.createQuestionnaire(data)
        toast({ title: "Success", description: "Questionnaire saved." })
      }

      if (data.status === "Completed") {
        const siteCount = data.siteCount || 1
        const promises = []
        for (let i = 0; i < siteCount; i++) {
          const siteData = {
            name: `${data.organizationName} - Site ${i + 1}`,
            id: `${data.organizationName.substring(0, 3).toUpperCase()}${Date.now() + i}`,
            region: data.region,
            country: data.country,
            users_count: Math.floor(data.totalUsers / siteCount),
            // Map vendor names back to IDs
            vendor_ids: [
              ...libraryData.wiredVendors.filter((v) => data.wiredVendors.includes(v.name)).map((v) => v.id),
              ...libraryData.wirelessVendors.filter((v) => data.wirelessVendors.includes(v.name)).map((v) => v.id),
            ],
            mdm_vendor_ids: libraryData.mdmVendors.filter((v) => data.mdmVendors.includes(v.name)).map((v) => v.id),
            // ... map other vendor types similarly
          }
          promises.push(api.createSite(siteData))
        }
        await Promise.all(promises)
        toast({ title: "Success", description: `${siteCount} site(s) created from questionnaire.` })
        setActiveTab("sites")
      }
      fetchData()
    } catch (error) {
      toast({ title: "Error", description: `Failed to process questionnaire: ${error}`, variant: "destructive" })
    }
  }

  const handleEditSite = (site: Site) => {
    setSelectedSite(site)
    setIsSiteDetailOpen(true)
  }

  const handleBulkEdit = (siteIds: string[]) => {
    setBulkEditSiteIds(siteIds)
    setIsBulkEditOpen(true)
  }

  const handleSiteCreated = () => {
    fetchData()
    setActiveTab("sites")
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header users={users} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="progress">Progress Dashboard</TabsTrigger>
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="scoping">Scoping</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="progress">
            <ProgressDashboard stats={stats} sites={sites} />
          </TabsContent>
          <TabsContent value="sites">
            <SiteTable
              sites={sites}
              users={users}
              onAddSite={handleOpenSiteForm}
              onEditSite={handleEditSite}
              onViewWorkbook={() => {}}
              onShowNotes={() => {}}
              onBulkEdit={handleBulkEdit}
            />
          </TabsContent>
          <TabsContent value="scoping">
            <ScopingDashboard
              questionnaires={questionnaires}
              onSave={handleSaveQuestionnaire}
              library={libraryData}
              onDelete={api.deleteQuestionnaire}
              onUpdate={fetchData}
            />
          </TabsContent>
          <TabsContent value="library">
            <LibraryDashboard libraryData={libraryData} onUpdate={fetchData} />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsDashboard onUpdate={fetchData} users={users} />
          </TabsContent>
        </Tabs>
      </main>
      <Toaster />
      {isSiteFormOpen && (
        <SiteForm
          isOpen={isSiteFormOpen}
          onClose={() => setIsSiteFormOpen(false)}
          onSave={handleSaveSite}
          site={editingSite}
          users={users}
          wiredVendors={libraryData?.wiredVendors || []}
          wirelessVendors={libraryData?.wirelessVendors || []}
          firewallVendors={libraryData?.firewallVendors || []}
          vpnVendors={libraryData?.vpnVendors || []}
          edrXdrVendors={libraryData?.edrXdrVendors || []}
          siemVendors={libraryData?.siemVendors || []}
          deviceTypes={libraryData?.deviceTypes || []}
          checklistItems={libraryData?.checklistItems || []}
          useCases={libraryData?.useCases || []}
          testMatrix={libraryData?.testMatrix || []}
          onUpdateLibraries={fetchData}
        />
      )}
      {isSiteDetailOpen && selectedSite && (
        <SiteDetailModal
          isOpen={isSiteDetailOpen}
          onClose={() => setIsSiteDetailOpen(false)}
          site={selectedSite}
          onUpdate={fetchData}
          library={libraryData}
          users={users}
        />
      )}
      {isBulkEditOpen && (
        <BulkEditModal
          isOpen={isBulkEditOpen}
          onClose={() => setIsBulkEditOpen(false)}
          siteIds={bulkEditSiteIds}
          library={libraryData}
          users={users}
          onUpdate={fetchData}
        />
      )}
    </div>
  )
}
