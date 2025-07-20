"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Site, User, Vendor, DeviceType, ChecklistItem, BaseVendor } from "@/lib/database"
import { mockCountries } from "@/lib/mock-data"

interface SiteFormProps {
  site?: Site | null
  isOpen: boolean
  onClose: () => void
  onSave: (siteData: any) => void
  users: User[]
  wiredVendors: Vendor[]
  wirelessVendors: Vendor[]
  firewallVendors: BaseVendor[]
  vpnVendors: BaseVendor[]
  edrXdrVendors: BaseVendor[]
  siemVendors: BaseVendor[]
  deviceTypes: DeviceType[]
  checklistItems: ChecklistItem[]
}

const initialFormData = {
  id: "",
  name: "",
  region: "",
  country: "",
  priority: "",
  phase: 1,
  users_count: 0,
  project_manager_id: 0,
  radsec: "",
  planned_start: "",
  planned_end: "",
  status: "",
  completion_percent: 0,
  notes: "",
  technical_owner_ids: [] as number[],
  vendor_ids: [] as number[],
  firewall_vendor_ids: [] as number[],
  vpn_vendor_ids: [] as number[],
  edr_xdr_vendor_ids: [] as number[],
  siem_vendor_ids: [] as number[],
  device_type_ids: [] as number[],
  checklist_item_ids: [] as number[],
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
}

export function SiteForm({
  site,
  isOpen,
  onClose,
  onSave,
  users,
  wiredVendors,
  wirelessVendors,
  firewallVendors,
  vpnVendors,
  edrXdrVendors,
  siemVendors,
  deviceTypes,
  checklistItems,
}: SiteFormProps) {
  const [formData, setFormData] = useState(initialFormData)

  useEffect(() => {
    if (site) {
      setFormData({
        id: site.id,
        name: site.name,
        region: site.region,
        country: site.country,
        priority: site.priority,
        phase: site.phase,
        users_count: site.users_count,
        project_manager_id: site.project_manager_id || 0,
        radsec: site.radsec,
        planned_start: site.planned_start,
        planned_end: site.planned_end,
        status: site.status,
        completion_percent: site.completion_percent,
        notes: site.notes || "",
        technical_owner_ids: site.technical_owners?.map((owner) => owner.id) || [],
        vendor_ids: site.vendors?.map((v) => v.id) || [],
        firewall_vendor_ids: site.firewall_vendors?.map((v) => v.id) || [],
        vpn_vendor_ids: site.vpn_vendors?.map((v) => v.id) || [],
        edr_xdr_vendor_ids: site.edr_xdr_vendors?.map((v) => v.id) || [],
        siem_vendor_ids: site.siem_vendors?.map((v) => v.id) || [],
        device_type_ids: site.device_types?.map((dt) => dt.id) || [],
        checklist_item_ids: site.checklist_items?.filter((item) => item.completed).map((item) => item.id) || [],
        deployment_type: site.deployment_type || "hybrid",
        auth_methods: site.auth_methods || [],
        os_details: site.os_details || {
          windows: false,
          macos: false,
          ios: false,
          android: false,
          linux: false,
          linux_distro: "",
        },
      })
    } else {
      setFormData(initialFormData)
    }
  }, [site, isOpen])

  const handleMultiCheckboxChange = (field: keyof typeof initialFormData, id: number, checked: boolean) => {
    setFormData((prev) => {
      const currentIds = (prev[field] as number[]) || []
      return {
        ...prev,
        [field]: checked ? [...currentIds, id] : currentIds.filter((existingId) => existingId !== id),
      }
    })
  }

  const handleAuthMethodsChange = (method: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      auth_methods: checked ? [...prev.auth_methods, method] : prev.auth_methods.filter((m) => m !== method),
    }))
  }

  const handleOsDetailsChange = (os: keyof typeof initialFormData.os_details, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      os_details: { ...prev.os_details, [os]: checked },
    }))
  }

  const projectManagers = users.filter((user) => user.user_type === "project_manager")
  const technicalOwners = users.filter((user) => user.user_type === "technical_owner")

  const groupedChecklistItems = useMemo(() => {
    return checklistItems.reduce(
      (acc, item) => {
        ;(acc[item.category] = acc[item.category] || []).push(item)
        return acc
      },
      {} as Record<string, ChecklistItem[]>,
    )
  }, [checklistItems])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const renderCheckboxGrid = (
    items: { id: number; name: string }[],
    field: keyof typeof initialFormData,
    columns = 3,
  ) => (
    <div className={`grid grid-cols-${columns} gap-x-4 gap-y-2 mt-2 border rounded p-2`}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${field}-${item.id}`}
            checked={(formData[field] as number[]).includes(item.id)}
            onCheckedChange={(checked) => handleMultiCheckboxChange(field, item.id, checked as boolean)}
          />
          <Label htmlFor={`${field}-${item.id}`} className="text-sm font-normal">
            {item.name}
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
                  <Label htmlFor="region">Region *</Label>
                  <Select
                    value={formData.region}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="EMEA">EMEA</SelectItem>
                      <SelectItem value="APAC">APAC</SelectItem>
                      <SelectItem value="LATAM">LATAM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
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
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
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
                <CardTitle>Network & Security Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="network">
                  <TabsList>
                    <TabsTrigger value="network">Network</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                  </TabsList>
                  <TabsContent value="network" className="space-y-4 pt-4">
                    <div>
                      <Label className="font-semibold">Wired Vendors</Label>
                      {renderCheckboxGrid(wiredVendors, "vendor_ids")}
                    </div>
                    <div>
                      <Label className="font-semibold">Wireless Vendors</Label>
                      {renderCheckboxGrid(wirelessVendors, "vendor_ids")}
                    </div>
                  </TabsContent>
                  <TabsContent value="security" className="space-y-4 pt-4">
                    <div>
                      <Label className="font-semibold">Firewall Vendors</Label>
                      {renderCheckboxGrid(firewallVendors, "firewall_vendor_ids")}
                    </div>
                    <div>
                      <Label className="font-semibold">VPN Vendors</Label>
                      {renderCheckboxGrid(vpnVendors, "vpn_vendor_ids")}
                    </div>
                    <div>
                      <Label className="font-semibold">EDR/XDR Vendors</Label>
                      {renderCheckboxGrid(edrXdrVendors, "edr_xdr_vendor_ids")}
                    </div>
                    <div>
                      <Label className="font-semibold">SIEM/SOAR/MDR Vendors</Label>
                      {renderCheckboxGrid(siemVendors, "siem_vendor_ids")}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="font-semibold">Device Types In Scope</Label>
                  {renderCheckboxGrid(deviceTypes, "device_type_ids", 4)}
                </div>
                <div>
                  <Label className="font-semibold">Operating Systems</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2 border rounded p-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-windows"
                        checked={formData.os_details.windows}
                        onCheckedChange={(c) => handleOsDetailsChange("windows", c as boolean)}
                      />
                      <Label htmlFor="os-windows" className="font-normal">
                        Windows
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-macos"
                        checked={formData.os_details.macos}
                        onCheckedChange={(c) => handleOsDetailsChange("macos", c as boolean)}
                      />
                      <Label htmlFor="os-macos" className="font-normal">
                        macOS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-ios"
                        checked={formData.os_details.ios}
                        onCheckedChange={(c) => handleOsDetailsChange("ios", c as boolean)}
                      />
                      <Label htmlFor="os-ios" className="font-normal">
                        iOS
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="os-android"
                        checked={formData.os_details.android}
                        onCheckedChange={(c) => handleOsDetailsChange("android", c as boolean)}
                      />
                      <Label htmlFor="os-android" className="font-normal">
                        Android
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <Checkbox
                        id="os-linux"
                        checked={formData.os_details.linux}
                        onCheckedChange={(c) => handleOsDetailsChange("linux", c as boolean)}
                      />
                      <Label htmlFor="os-linux" className="font-normal">
                        Linux
                      </Label>
                      {formData.os_details.linux && (
                        <Input
                          placeholder="Distro(s)..."
                          value={formData.os_details.linux_distro}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              os_details: { ...p.os_details, linux_distro: e.target.value },
                            }))
                          }
                          className="h-8 ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Authentication Methods</Label>
                  <div className="grid grid-cols-4 gap-4 mt-2 border rounded p-2">
                    {["EAP-TLS", "EAP-TTLS", "PEAP", "MSCHAPv2", "PAP", "SAML", "OpenID", "EAM"].map((m) => (
                      <div key={m} className="flex items-center space-x-2">
                        <Checkbox
                          id={`auth-${m}`}
                          checked={formData.auth_methods.includes(m)}
                          onCheckedChange={(c) => handleAuthMethodsChange(m, c as boolean)}
                        />
                        <Label htmlFor={`auth-${m}`} className="font-normal">
                          {m}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="deployment_type" className="font-semibold">
                    Deployment Type
                  </Label>
                  <Select
                    value={formData.deployment_type}
                    onValueChange={(v) => setFormData((p) => ({ ...p, deployment_type: v as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agent">Agent-based</SelectItem>
                      <SelectItem value="agentless">Agentless</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Checklist</CardTitle>
                <CardDescription>Select all relevant technologies and integrations for this site.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="MDM/UEM" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="MDM/UEM">MDM/UEM</TabsTrigger>
                    <TabsTrigger value="SSO/MFA">SSO/MFA</TabsTrigger>
                    <TabsTrigger value="Infrastructure">Infrastructure</TabsTrigger>
                  </TabsList>
                  {Object.entries(groupedChecklistItems).map(([category, items]) => (
                    <TabsContent key={category} value={category}>
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
      </DialogContent>
    </Dialog>
  )
}
