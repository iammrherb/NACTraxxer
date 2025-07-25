"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Site } from "@/lib/database"
import { mockCountries } from "@/lib/library-data" // Updated import
import { createVendor as apiCreateVendor } from "@/lib/api"

interface SiteFormProps {
  site?: Site | null
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  projectId: string
  users: any[]
  wiredVendors: any[]
  wirelessVendors: any[]
  firewallVendors: any[]
  vpnVendors: any[]
  edrXdrVendors: any[]
  siemVendors: any[]
  deviceTypes: any[]
  checklistItems: any[]
  useCases: any[]
  testMatrix: any[]
  // For pre-populating from scoping
  scopingData?: { industry: string; projectGoals: string[] }
}

export function SiteForm({
  isOpen,
  onClose,
  onSave,
  site,
  projectId,
  users,
  wiredVendors,
  wirelessVendors,
  firewallVendors,
  vpnVendors,
  edrXdrVendors,
  siemVendors,
  deviceTypes,
  checklistItems,
  useCases,
  testMatrix,
  scopingData,
}: SiteFormProps) {
  const [formData, setFormData] = useState<Partial<Site>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [customVendorName, setCustomVendorName] = useState("")
  const [customVendorType, setCustomVendorType] = useState<"wired" | "wireless">("wired")

  useEffect(() => {
    if (site) {
      setFormData(site)
    } else {
      let suggestedUseCases: string[] = []
      if (scopingData) {
        suggestedUseCases = useCases
          .filter(
            (uc) =>
              uc.is_baseline ||
              uc.applicable_industries.includes(scopingData.industry) ||
              uc.applicable_goals.some((g) => scopingData.projectGoals.includes(g)),
          )
          .map((uc) => uc.id)
      }
      setFormData({
        project_id: projectId,
        name: "",
        status: "Planned",
        phase: 1,
        priority: "Medium",
        users_count: 0,
        country: "",
        region: "",
        completion_percent: 0,
        use_case_ids: suggestedUseCases,
        industry: scopingData?.industry || "",
        project_goals: scopingData?.projectGoals || [],
      })
    }
  }, [site, projectId, isOpen, scopingData, useCases])

  const handleChange = (field: keyof Site, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddCustomVendor = async () => {
    if (!customVendorName) {
      toast({ title: "Error", description: "Custom vendor name is required.", variant: "destructive" })
      return
    }
    try {
      const newVendor = await apiCreateVendor({ name: customVendorName, type: customVendorType, is_custom: true })
      toast({ title: "Success", description: `Added custom vendor: ${newVendor.name}` })
      setCustomVendorName("")
      // onUpdateLibraries() // This will trigger a re-fetch of vendors on the main page
    } catch (error) {
      toast({ title: "Error", description: "Failed to add custom vendor.", variant: "destructive" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const url = site ? `/api/sites/${site.id}` : "/api/sites"
    const method = site ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save site")
      }

      toast({ title: "Success", description: `Site ${site ? "updated" : "created"} successfully.` })
      onSave()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>{site ? "Edit Site" : "Add New Site"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Site Info, Project Management etc. */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select value={formData.status} onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="users_count" className="text-right">
                Users
              </Label>
              <Input
                id="users_count"
                type="number"
                value={formData.users_count || 0}
                onChange={(e) => handleChange("users_count", Number.parseInt(e.target.value, 10))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="text-right">
                Region
              </Label>
              <Input
                id="region"
                value={formData.region || ""}
                onChange={(e) => handleChange("region", e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Network & Security */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Select value={formData.country} onValueChange={(v) => handleChange("country", v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockCountries.map((c) => (
                    <SelectItem key={c.code} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select value={formData.priority} onValueChange={(v) => handleChange("priority", v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phase" className="text-right">
                Phase
              </Label>
              <Input
                id="phase"
                type="number"
                value={formData.phase || 1}
                onChange={(e) => handleChange("phase", Number.parseInt(e.target.value, 10))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="completion_percent" className="text-right">
                Completion Percent
              </Label>
              <Input
                id="completion_percent"
                type="number"
                value={formData.completion_percent || 0}
                onChange={(e) => handleChange("completion_percent", Number.parseInt(e.target.value, 10))}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Deployment Details */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deployment_type" className="text-right">
                Deployment Type
              </Label>
              <Select value={formData.deployment_type} onValueChange={(v) => handleChange("deployment_type", v)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">Agent-based</SelectItem>
                  <SelectItem value="agentless">Agentless</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="auth_methods" className="text-right">
                Authentication Methods
              </Label>
              <div className="grid grid-cols-4 gap-4 mt-2 border rounded p-2 col-span-3">
                {["EAP-TLS", "EAP-TTLS", "PEAP", "MSCHAPv2", "PAP", "SAML", "OpenID", "EAM"].map((m) => (
                  <div key={m} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`auth-${m}`}
                      checked={formData.auth_methods?.includes(m)}
                      onChange={(e) => handleChange("auth_methods", [...(formData.auth_methods || []), m])}
                    />
                    <Label htmlFor={`auth-${m}`} className="font-normal">
                      {m}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="os_details" className="text-right">
                Operating Systems
              </Label>
              <div className="grid grid-cols-3 gap-4 mt-2 border rounded p-2 col-span-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="os-windows"
                    checked={formData.os_details?.windows}
                    onChange={(e) => handleChange("os_details", { ...formData.os_details, windows: e.target.checked })}
                  />
                  <Label htmlFor="os-windows" className="font-normal">
                    Windows
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="os-macos"
                    checked={formData.os_details?.macos}
                    onChange={(e) => handleChange("os_details", { ...formData.os_details, macos: e.target.checked })}
                  />
                  <Label htmlFor="os-macos" className="font-normal">
                    macOS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="os-ios"
                    checked={formData.os_details?.ios}
                    onChange={(e) => handleChange("os_details", { ...formData.os_details, ios: e.target.checked })}
                  />
                  <Label htmlFor="os-ios" className="font-normal">
                    iOS
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="checkbox"
                    id="os-android"
                    checked={formData.os_details?.android}
                    onChange={(e) => handleChange("os_details", { ...formData.os_details, android: e.target.checked })}
                  />
                  <Label htmlFor="os-android" className="font-normal">
                    Android
                  </Label>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Input
                    type="checkbox"
                    id="os-linux"
                    checked={formData.os_details?.linux}
                    onChange={(e) => handleChange("os_details", { ...formData.os_details, linux: e.target.checked })}
                  />
                  <Label htmlFor="os-linux" className="font-normal">
                    Linux
                  </Label>
                  {formData.os_details?.linux && (
                    <Input
                      placeholder="Distro(s)..."
                      value={formData.os_details?.linux_distro}
                      onChange={(e) =>
                        handleChange("os_details", { ...formData.os_details, linux_distro: e.target.value })
                      }
                      className="h-8 ml-2"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Scope Definition */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="use_cases" className="text-right">
                Use Cases
              </Label>
              <div className="grid grid-cols-4 gap-4 mt-2 border rounded p-2 col-span-3">
                {useCases.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`use-case-${item.id}`}
                      checked={formData.use_case_ids?.includes(item.id)}
                      onChange={(e) =>
                        handleChange(
                          "use_case_ids",
                          e.target.checked
                            ? [...(formData.use_case_ids || []), item.id]
                            : formData.use_case_ids?.filter((id) => id !== item.id),
                        )
                      }
                    />
                    <Label htmlFor={`use-case-${item.id}`} className="font-normal">
                      {item.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="test_matrix" className="text-right">
                Test Matrix
              </Label>
              <div className="grid grid-cols-4 gap-4 mt-2 border rounded p-2 col-span-3">
                {testMatrix.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`test-matrix-${item.id}`}
                      checked={formData.test_matrix_ids?.includes(item.id)}
                      onChange={(e) =>
                        handleChange(
                          "test_matrix_ids",
                          e.target.checked
                            ? [...(formData.test_matrix_ids || []), item.id]
                            : formData.test_matrix_ids?.filter((id) => id !== item.id),
                        )
                      }
                    />
                    <Label htmlFor={`test-matrix-${item.id}`} className="font-normal">
                      {item.platform} - {item.mode} - {item.type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Deployment Checklist */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="checklist_items" className="text-right">
                Checklist Items
              </Label>
              <div className="grid grid-cols-4 gap-4 mt-2 border rounded p-2 col-span-3">
                {checklistItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`checklist-item-${item.id}`}
                      checked={formData.checklist_item_ids?.includes(item.id)}
                      onChange={(e) =>
                        handleChange(
                          "checklist_item_ids",
                          e.target.checked
                            ? [...(formData.checklist_item_ids || []), item.id]
                            : formData.checklist_item_ids?.filter((id) => id !== item.id),
                        )
                      }
                    />
                    <Label htmlFor={`checklist-item-${item.id}`} className="font-normal">
                      {item.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
