"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Palette, Users, Network, List, Book, BarChart3, Upload } from "lucide-react"
import ArchitectureDesigner from "@/components/architecture-designer"
import MasterSiteList from "@/components/MasterSiteList"
import SiteWorkbook from "@/components/site-workbook"
import UserManagementModal from "@/components/UserManagementModal"
import ThemeCustomizer from "@/components/ThemeCustomizer"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("architecture")
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [customerLogo, setCustomerLogo] = useState<string | null>(null)

  useEffect(() => {
    const savedLogo = localStorage.getItem("portnox-customer-logo")
    if (savedLogo) setCustomerLogo(savedLogo)
  }, [])

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      setCustomerLogo(dataUrl)
      localStorage.setItem("portnox-customer-logo", dataUrl)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="w-full bg-gradient-to-r from-[#00c8d7] to-[#0099cc] text-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 rounded-md p-2">
                  <img src="/stencils/portnox.png" alt="Portnox" className="h-8 w-auto object-contain" />
                </div>
                <Separator orientation="vertical" className="h-8 bg-white/40" />
                <div className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors">
                  <img
                    src={
                      customerLogo ||
                      "/placeholder.svg?height=32&width=140&query=customer%20logo%20placeholder" ||
                      "/placeholder.svg"
                    }
                    alt="Customer Logo"
                    className="h-8 max-w-[140px] object-contain"
                  />
                </div>
                <label
                  htmlFor="logo-upload"
                  className="flex items-center space-x-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer ml-2"
                >
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Change Logo</span>
                </label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Zero Trust NAC Architecture Designer</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowUserModal(true)}
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowThemeCustomizer(true)}
              >
                <Palette className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="architecture" className="flex items-center space-x-2">
              <Network className="h-4 w-4" />
              <span>Architecture Designer</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Master Site List</span>
            </TabsTrigger>
            <TabsTrigger value="workbook" className="flex items-center space-x-2">
              <Book className="h-4 w-4" />
              <span>Site Workbook</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Rollout Progress</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="architecture">
            <ArchitectureDesigner selectedSiteId={selectedSiteId || undefined} />
          </TabsContent>

          <TabsContent value="sites">
            <MasterSiteList
              onSiteSelect={(id) => {
                setSelectedSiteId(id)
                setActiveTab("workbook")
              }}
            />
          </TabsContent>

          <TabsContent value="workbook">
            <SiteWorkbook siteId={selectedSiteId || undefined} />
          </TabsContent>

          <TabsContent value="progress">
            <div className="text-sm text-muted-foreground">Progress dashboard coming next.</div>
          </TabsContent>
        </Tabs>
      </main>

      <UserManagementModal open={showUserModal} onOpenChange={setShowUserModal} />
      <ThemeCustomizer open={showThemeCustomizer} onOpenChange={setShowThemeCustomizer} />
    </div>
  )
}
