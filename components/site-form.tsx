"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Site, User, Vendor, DeviceType, ChecklistItem } from "@/lib/database"

interface SiteFormProps {
  site?: Site | null
  isOpen: boolean
  onClose: () => void
  onSave: (siteData: any) => void
  users: User[]
  vendors: Vendor[]
  deviceTypes: DeviceType[]
  checklistItems: ChecklistItem[]
}

export function SiteForm({
  site,
  isOpen,
  onClose,
  onSave,
  users = [],
  vendors = [],
  deviceTypes = [],
  checklistItems = [],
}: SiteFormProps) {
  const [formData, setFormData] = useState({
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
    device_type_ids: [] as number[],
    checklist_item_ids: [] as number[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
        vendor_ids: site.vendors?.map((vendor) => vendor.id) || [],
        device_type_ids: site.device_types?.map((dt) => dt.id) || [],
        checklist_item_ids: site.checklist_items?.filter((item) => item.completed).map((item) => item.id) || [],
      })
    } else {
      setFormData({
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
        technical_owner_ids: [],
        vendor_ids: [],
        device_type_ids: [],
        checklist_item_ids: [],
      })
    }
    setErrors({})
  }, [site, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.id.trim()) newErrors.id = "Site ID is required"
    if (!formData.name.trim()) newErrors.name = "Site name is required"
    if (!formData.region) newErrors.region = "Region is required"
    if (!formData.country.trim()) newErrors.country = "Country is required"
    if (!formData.priority) newErrors.priority = "Priority is required"
    if (formData.users_count <= 0) newErrors.users_count = "Users count must be greater than 0"
    if (!formData.project_manager_id) newErrors.project_manager_id = "Project manager is required"
    if (!formData.radsec) newErrors.radsec = "RADSEC implementation is required"
    if (!formData.planned_start) newErrors.planned_start = "Planned start date is required"
    if (!formData.planned_end) newErrors.planned_end = "Planned end date is required"
    if (!formData.status) newErrors.status = "Status is required"
    if (formData.completion_percent < 0 || formData.completion_percent > 100) {
      newErrors.completion_percent = "Completion percentage must be between 0 and 100"
    }
    if (formData.technical_owner_ids.length === 0) {
      newErrors.technical_owner_ids = "At least one technical owner is required"
    }
    if (formData.vendor_ids.length === 0) {
      newErrors.vendor_ids = "At least one vendor is required"
    }
    if (formData.device_type_ids.length === 0) {
      newErrors.device_type_ids = "At least one device type is required"
    }

    // Date validation
    if (formData.planned_start && formData.planned_end) {
      if (new Date(formData.planned_start) > new Date(formData.planned_end)) {
        newErrors.planned_end = "End date must be after start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleCheckboxChange = (
    field: "technical_owner_ids" | "vendor_ids" | "device_type_ids" | "checklist_item_ids",
    id: number,
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked ? [...prev[field], id] : prev[field].filter((existingId) => existingId !== id),
    }))
  }

  const projectManagers = users.filter((user) => user.user_type === "project_manager")
  const technicalOwners = users.filter((user) => user.user_type === "technical_owner")
  const wiredVendors = vendors.filter((vendor) => vendor.type === "wired")
  const wirelessVendors = vendors.filter((vendor) => vendor.type === "wireless")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{site ? "Edit Site" : "Add New Site"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">Site ID *</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                  disabled={!!site}
                  className={errors.id ? "border-red-500" : ""}
                />
                {errors.id && <p className="text-sm text-red-500 mt-1">{errors.id}</p>}
              </div>

              <div>
                <Label htmlFor="name">Site Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="region">Region *</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                >
                  <SelectTrigger className={errors.region ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="EMEA">EMEA</SelectItem>
                    <SelectItem value="APAC">APAC</SelectItem>
                    <SelectItem value="LATAM">LATAM</SelectItem>
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region}</p>}
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
                  className={errors.country ? "border-red-500" : ""}
                />
                {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country}</p>}
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-red-500 mt-1">{errors.priority}</p>}
              </div>

              <div>
                <Label htmlFor="phase">Phase *</Label>
                <Select
                  value={formData.phase.toString()}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, phase: Number.parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Phase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Phase 1</SelectItem>
                    <SelectItem value="2">Phase 2</SelectItem>
                    <SelectItem value="3">Phase 3</SelectItem>
                    <SelectItem value="4">Phase 4</SelectItem>
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
                  className={errors.users_count ? "border-red-500" : ""}
                />
                {errors.users_count && <p className="text-sm text-red-500 mt-1">{errors.users_count}</p>}
              </div>

              <div>
                <Label htmlFor="radsec">RADSEC Implementation *</Label>
                <Select
                  value={formData.radsec}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, radsec: value }))}
                >
                  <SelectTrigger className={errors.radsec ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select RADSEC Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Native">Native</SelectItem>
                    <SelectItem value="LRAD">LRAD</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
                {errors.radsec && <p className="text-sm text-red-500 mt-1">{errors.radsec}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Project Management */}
          <Card>
            <CardHeader>
              <CardTitle>Project Management</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="project_manager_id">Project Manager *</Label>
                <Select
                  value={formData.project_manager_id.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, project_manager_id: Number.parseInt(value) }))
                  }
                >
                  <SelectTrigger className={errors.project_manager_id ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Project Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectManagers.map((pm) => (
                      <SelectItem key={pm.id} value={pm.id.toString()}>
                        {pm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.project_manager_id && <p className="text-sm text-red-500 mt-1">{errors.project_manager_id}</p>}
              </div>

              <div className="col-span-2">
                <Label>Technical Owners *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {technicalOwners.map((owner) => (
                    <div key={owner.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tech-owner-${owner.id}`}
                        checked={formData.technical_owner_ids.includes(owner.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("technical_owner_ids", owner.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`tech-owner-${owner.id}`} className="text-sm">
                        {owner.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.technical_owner_ids && (
                  <p className="text-sm text-red-500 mt-1">{errors.technical_owner_ids}</p>
                )}
              </div>

              <div>
                <Label htmlFor="planned_start">Planned Start Date *</Label>
                <Input
                  id="planned_start"
                  type="date"
                  value={formData.planned_start}
                  onChange={(e) => setFormData((prev) => ({ ...prev, planned_start: e.target.value }))}
                  className={errors.planned_start ? "border-red-500" : ""}
                />
                {errors.planned_start && <p className="text-sm text-red-500 mt-1">{errors.planned_start}</p>}
              </div>

              <div>
                <Label htmlFor="planned_end">Planned End Date *</Label>
                <Input
                  id="planned_end"
                  type="date"
                  value={formData.planned_end}
                  onChange={(e) => setFormData((prev) => ({ ...prev, planned_end: e.target.value }))}
                  className={errors.planned_end ? "border-red-500" : ""}
                />
                {errors.planned_end && <p className="text-sm text-red-500 mt-1">{errors.planned_end}</p>}
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status}</p>}
              </div>

              <div>
                <Label htmlFor="completion_percent">Completion Percentage *</Label>
                <Input
                  id="completion_percent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.completion_percent}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, completion_percent: Number.parseInt(e.target.value) || 0 }))
                  }
                  className={errors.completion_percent ? "border-red-500" : ""}
                />
                {errors.completion_percent && <p className="text-sm text-red-500 mt-1">{errors.completion_percent}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Network Infrastructure */}
          <Card>
            <CardHeader>
              <CardTitle>Network Infrastructure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Wired Vendors *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {wiredVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`wired-vendor-${vendor.id}`}
                        checked={formData.vendor_ids.includes(vendor.id)}
                        onCheckedChange={(checked) => handleCheckboxChange("vendor_ids", vendor.id, checked as boolean)}
                      />
                      <Label htmlFor={`wired-vendor-${vendor.id}`} className="text-sm">
                        {vendor.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Wireless Vendors *</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {wirelessVendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`wireless-vendor-${vendor.id}`}
                        checked={formData.vendor_ids.includes(vendor.id)}
                        onCheckedChange={(checked) => handleCheckboxChange("vendor_ids", vendor.id, checked as boolean)}
                      />
                      <Label htmlFor={`wireless-vendor-${vendor.id}`} className="text-sm">
                        {vendor.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.vendor_ids && <p className="text-sm text-red-500 mt-1">{errors.vendor_ids}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Device Types and Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Device Types *</Label>
                <div className="grid grid-cols-4 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {deviceTypes.map((deviceType) => (
                    <div key={deviceType.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`device-type-${deviceType.id}`}
                        checked={formData.device_type_ids.includes(deviceType.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("device_type_ids", deviceType.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`device-type-${deviceType.id}`} className="text-sm">
                        {deviceType.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.device_type_ids && <p className="text-sm text-red-500 mt-1">{errors.device_type_ids}</p>}
              </div>

              <div>
                <Label>Deployment Checklist</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto border rounded p-2">
                  {checklistItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={formData.checklist_item_ids.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("checklist_item_ids", item.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={`checklist-${item.id}`} className="text-sm">
                        {item.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Enter any special considerations, dependencies, or requirements..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{site ? "Update Site" : "Create Site"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
