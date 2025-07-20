"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"
import * as api from "@/lib/api"
import type { LibraryData } from "@/lib/database"

interface ScopingQuestionnaireProps {
  library: LibraryData
  onSiteCreate: () => void
}

const CheckboxGrid = ({ title, options, selectedIds, onSelectionChange, nameField = "name" }: any) => (
  <div>
    <Label className="font-semibold">{title}</Label>
    <ScrollArea className="h-48 mt-2 border rounded p-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {(options || []).map((option: any) => (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={`${title}-${option.id}`}
              checked={selectedIds.includes(option.id)}
              onCheckedChange={(checked) => {
                const newSelection = checked
                  ? [...selectedIds, option.id]
                  : selectedIds.filter((id: any) => id !== option.id)
                onSelectionChange(newSelection)
              }}
            />
            <Label htmlFor={`${title}-${option.id}`} className="text-sm font-normal">
              {option[nameField]}
            </Label>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
)

export function ScopingQuestionnaire({ library, onSiteCreate }: ScopingQuestionnaireProps) {
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    country: "",
    users_count: 100,
    project_manager_id: 1,
    technical_owner_ids: [],
    idp_vendor_ids: [],
    wired_vendor_ids: [],
    wireless_vendor_ids: [],
    use_case_ids: [],
  })
  const [isSaving, setIsSaving] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      const siteData = {
        ...formData,
        // Default values for a new site
        status: "Planned",
        phase: 1,
        planned_start: new Date().toISOString().split("T")[0],
        planned_end: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
        completion_percent: 0,
        radsec: "Not Used",
        vendor_ids: [...formData.wired_vendor_ids, ...formData.wireless_vendor_ids],
        firewall_vendor_ids: [],
        vpn_vendor_ids: [],
        edr_xdr_vendor_ids: [],
        siem_vendor_ids: [],
        device_type_ids: [],
        checklist_item_ids: [],
        tasks: [],
        test_case_statuses: [],
        requirement_statuses: [],
      }
      await api.createSite(siteData)
      toast({ title: "Success", description: "New site created and added to the list." })
      onSiteCreate()
    } catch (error) {
      toast({ title: "Error", description: "Failed to create site.", variant: "destructive" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Site Scoping</CardTitle>
        <CardDescription>
          Fill out the details below to scope a new deployment site. This will create a new site card in the "Sites"
          tab.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                placeholder="e.g., London Headquarters"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(v) => handleInputChange("region", v)}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {library.regions.map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(v) => handleInputChange("country", v)}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {library.countries.map((c) => (
                      <SelectItem key={c.code} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="users-count">Number of Users</Label>
              <Input
                id="users-count"
                type="number"
                value={formData.users_count}
                onChange={(e) => handleInputChange("users_count", Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          {/* Column 2: Use Cases */}
          <CheckboxGrid
            title="Select Use Cases"
            options={library.useCases}
            selectedIds={formData.use_case_ids}
            onSelectionChange={(ids: string[]) => handleInputChange("use_case_ids", ids)}
            nameField="title"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CheckboxGrid
            title="IDP Vendors"
            options={library.idpVendors}
            selectedIds={formData.idp_vendor_ids}
            onSelectionChange={(ids: number[]) => handleInputChange("idp_vendor_ids", ids)}
          />
          <CheckboxGrid
            title="Wired Vendors"
            options={library.wiredVendors}
            selectedIds={formData.wired_vendor_ids}
            onSelectionChange={(ids: number[]) => handleInputChange("wired_vendor_ids", ids)}
          />
          <CheckboxGrid
            title="Wireless Vendors"
            options={library.wirelessVendors}
            selectedIds={formData.wireless_vendor_ids}
            onSelectionChange={(ids: number[]) => handleInputChange("wireless_vendor_ids", ids)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? "Creating Site..." : "Create New Site"}
        </Button>
      </CardFooter>
    </Card>
  )
}
