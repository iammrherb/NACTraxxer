"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import type { Site, User, LibraryItem, LibraryData } from "@/lib/types"
import { toast } from "./ui/use-toast"
import * as api from "@/lib/api"

interface SiteFormProps {
  site?: Site | null
  isOpen: boolean
  onClose: () => void
  onSave: (siteData: any) => void
  onUpdateLibraries: () => void
  users: User[]
  library?: LibraryData
  scopingData?: { industry: string; projectGoals: string[] }
}

const initialFormData = {
  id: "",
  name: "",
  region: "",
  country: "",
  priority: "Medium",
  phase: 1,
  users_count: 0,
  project_manager_id: 0,
  radsec: "Native",
  planned_start: "",
  planned_end: "",
  status: "Planned",
  completion_percent: 0,
  notes: "",
  technical_owner_ids: [] as number[],
  vendor_ids: [] as number[],
  firewall_vendor_ids: [] as number[],
  vpn_vendor_ids: [] as number[],
  edr_xdr_vendor_ids: [] as number[],
  siem_vendor_ids: [] as number[],
  idp_vendor_ids: [] as number[],
  mfa_vendor_ids: [] as number[],
  mdm_vendor_ids: [] as number[],
  device_type_ids: [] as number[],
  checklist_item_ids: [] as string[],
  use_case_ids: [] as string[],
  test_matrix_ids: [] as string[],
  deployment_type: "hybrid" as "agent" | "agentless" | "hybrid",
  auth_methods: [] as string[],
  os_details: {
    windows: false,
    macos: false,
    ios: false,
    android: false,
    linux: false,
    linux_distro: "",
  },
  industry: "",
  project_goals: [] as string[],
  legacy_nac_systems: [] as { name: string; migration_timeline_months: number }[],
}

export function SiteForm({
  site,
  isOpen,
  onClose,
  onSave,
  onUpdateLibraries,
  users,
  library,
  scopingData,
}: SiteFormProps) {
  const [formData, setFormData] = useState(initialFormData)
  const [customVendorName, setCustomVendorName] = useState("")
  const [customVendorType, setCustomVendorType] = useState<
    "wired" | "wireless" | "firewall" | "vpn" | "edr_xdr" | "siem" | "idp" | "mfa" | "mdm"
  >("wired")

  useEffect(() => {
    if (!isOpen || !library) return

    if (site) {
      setFormData({
        ...initialFormData, // Start with defaults
        ...site, // Overlay existing site data
        // @ts-ignore
        technical_owner_ids: site.technical_owners?.map((owner) => owner.id) || [],
        // @ts-ignore
        vendor_ids: site.vendors?.map((v) => v.id) || [],
        // @ts-ignore
        firewall_vendor_ids: site.firewall_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        vpn_vendor_ids: site.vpn_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        edr_xdr_vendor_ids: site.edr_xdr_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        siem_vendor_ids: site.siem_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        idp_vendor_ids: site.idp_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        mfa_vendor_ids: site.mfa_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        mdm_vendor_ids: site.mdm_vendors?.map((v) => v.id) || [],
        // @ts-ignore
        device_type_ids: site.device_types?.map((dt) => dt.id) || [],
        // @ts-ignore
        checklist_item_ids: site.checklist_items?.map((item) => item.id) || [],
      })
    } else {
      // This is a new site, apply scoping suggestions
      setFormData({
        ...initialFormData,
        use_case_ids: [], // Faulty suggestion logic removed for stability
        industry: scopingData?.industry || "",
        project_goals: scopingData?.projectGoals || [],
      })
    }
  }, [site, isOpen, scopingData, library])

  const handleAddCustomVendor = async () => {
    if (!customVendorName) {
      toast({ title: "Error", description: "Custom vendor name is required.", variant: "destructive" })
      return
    }
    try {
      // @ts-ignore
      const newVendor = await api.createVendor({ name: customVendorName, type: customVendorType })
      toast({ title: "Success", description: `Added custom vendor: ${newVendor.name}` })
      setCustomVendorName("")
      onUpdateLibraries() // This will trigger a re-fetch of vendors on the main page
    } catch (error) {
      toast({ title: "Error", description: "Failed to add custom vendor.", variant: "destructive" })
    }
  }

  const handleMultiCheckboxChange = (field: keyof typeof initialFormData, id: number | string, checked: boolean) => {
    setFormData((prev) => {
      const currentIds = (prev[field] as (number | string)[]) || []
      return {
        ...prev,
        [field]: checked ? [...currentIds, id] : currentIds.filter((existingId) => existingId !== id),
      }
    })
  }

  const groupedChecklistItems = useMemo(() => {
    if (!library || !library.deploymentChecklist) return {}
    return library.deploymentChecklist.reduce((acc: Record<string, LibraryItem[]>, item: LibraryItem) => {
      ;(acc[item.category] = acc[item.category] || []).push(item)
      return acc
    }, {})
  }, [library])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let savedSite
      if (site) {
        savedSite = await api.updateSite(site.id, formData)
      } else {
        // @ts-ignore
        savedSite = await api.createSite(formData)
      }
      onSave(savedSite)
      toast({ title: "Success", description: `Site ${site ? "updated" : "created"} successfully.` })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save site.", variant: "destructive" })
    }
  }

  const renderCheckboxGrid = (
    items: { id: string; title: string }[],
    field: keyof typeof initialFormData,
    columns = 3,
  ) => (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-x-4 gap-y-2 mt-2`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${String(field)}-${item.id}`}
            checked={(formData[field] as string[]).includes(item.id)}
            onCheckedChange={(checked) => handleMultiCheckboxChange(field, item.id, checked as boolean)}
          />
          <Label htmlFor={`${String(field)}-${item.id}`} className="text-sm font-normal">
            {item.title}
          </Label>
        </div>
      ))}
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{site ? "Edit Site" : "Add New Site"}</DialogTitle>
        </DialogHeader>
        {!library ? (
          <div className="p-4 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
                <div className="pt-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end space-x-2 pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <ScrollArea className="max-h-[80vh]">
            <form onSubmit={handleSubmit} className="space-y-6 p-4">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="id">Site ID *</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                      disabled={!!site}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Site Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="users_count">Number of Users *</Label>
                    <Input
                      id="users_count"
                      type="number"
                      min="1"
                      value={formData.users_count}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, users_count: Number.parseInt(e.target.value) || 0 }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Deployment Checklist</CardTitle>
                  <CardDescription>Select all relevant items for this site's deployment plan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={Object.keys(groupedChecklistItems)[0] || ""} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      {Object.keys(groupedChecklistItems).map((category) => (
                        <TabsTrigger key={category} value={category}>
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {Object.entries(groupedChecklistItems).map(([category, items]) => (
                      <TabsContent key={category} value={category} className="pt-4">
                        {renderCheckboxGrid(items, "checklist_item_ids", 2)}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">{site ? "Update Site" : "Create Site"}</Button>
              </div>
            </form>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
