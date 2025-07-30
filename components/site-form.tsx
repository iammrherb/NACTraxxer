"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Site, User, Vendor, DeviceType } from "@/lib/types"

interface SiteFormProps {
  site: Site | null
  onSubmit: (data: Partial<Site>) => void
  onCancel: () => void
  users: User[]
  vendors: Vendor[]
  deviceTypes: DeviceType[]
}

export function SiteForm({ site, onSubmit, onCancel, users, vendors, deviceTypes }: SiteFormProps) {
  const [formData, setFormData] = useState<Partial<Site>>({
    name: "",
    location: "",
    contact_person: "",
    contact_email: "",
    contact_phone: "",
    notes: "",
    project_manager_id: undefined,
    technical_owner_ids: [],
    vendor_ids: [],
    device_type_ids: [],
  })

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name || "",
        location: site.location || "",
        contact_person: site.contact_person || "",
        contact_email: site.contact_email || "",
        contact_phone: site.contact_phone || "",
        notes: site.notes || "",
        project_manager_id: site.project_manager_id,
        technical_owner_ids: site.technical_owner_ids || [],
        vendor_ids: site.vendor_ids || [],
        device_type_ids: site.device_type_ids || [],
      })
    }
  }, [site])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const projectManagers = users.filter((u) => u.role === "Project Manager")
  const technicalOwners = users.filter((u) => u.role === "Technical Owner")

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{site ? "Edit Site" : "Add New Site"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Site Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_person" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contact_person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_email" className="text-right">
                Contact Email
              </Label>
              <Input
                id="contact_email"
                name="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contact_phone" className="text-right">
                Contact Phone
              </Label>
              <Input
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project_manager_id" className="text-right">
                Project Manager
              </Label>
              <Select
                name="project_manager_id"
                value={formData.project_manager_id?.toString()}
                onValueChange={(value) => handleSelectChange("project_manager_id", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a project manager" />
                </SelectTrigger>
                <SelectContent>
                  {projectManagers.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Note: Multi-select for technical owners, vendors, device types would require a more complex component.
                For now, we'll leave this as a placeholder for future enhancement.
                A multi-select combobox from shadcn/ui would be a good fit here.
            */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
